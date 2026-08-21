/**
 * utils/budget-checker.js
 *
 * Performance budget checker utility.
 *
 * Purpose:
 *   After sitespeed.io completes a run it writes a JSON summary to the results
 *   folder. This utility reads that summary and compares key metrics against
 *   the thresholds defined in config/budget.json, providing a human-readable
 *   pass / fail report and a non-zero exit code on failure.
 *
 *   Using a dedicated checker (separate from the config file) means:
 *     - Budget logic can be unit-tested independently.
 *     - Thresholds can be overridden per-environment (dev / staging / prod).
 *     - Future enhancements (Slack notifications, JIRA tickets) have a single
 *       entry point to hook into.
 *
 * Usage (from CLI):
 *   node utils/budget-checker.js ./results/latest/data/browsertime.json
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

/**
 * Loads and returns the performance budget thresholds from the config file.
 *
 * @returns {object} Parsed budget configuration.
 */
function loadBudget() {
  const budgetPath = path.resolve(__dirname, '../config/budget.json');
  const raw = fs.readFileSync(budgetPath, 'utf8');
  const parsed = JSON.parse(raw);

  // Remove comment keys (those starting with "_") after parsing to avoid
  // fragile regex manipulation of the raw JSON string.
  function stripCommentKeys(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!k.startsWith('_')) {
        result[k] = stripCommentKeys(v);
      }
    }
    return result;
  }

  return stripCommentKeys(parsed);
}

/**
 * Compares a single metric value against its budget threshold.
 *
 * @param {string} metricName - Human-readable metric label.
 * @param {number} actual - Measured value.
 * @param {number} threshold - Maximum allowed value.
 * @returns {{ passed: boolean, metricName: string, actual: number, threshold: number }}
 */
function checkMetric(metricName, actual, threshold) {
  const passed = actual <= threshold;
  const status = passed ? 'PASS' : 'FAIL';
  logger.info(`[${status}] ${metricName}: ${actual} (budget: ${threshold})`);
  return { passed, metricName, actual, threshold };
}

/**
 * Runs all budget checks against the provided metrics object.
 *
 * @param {object} metrics - Key-value map of metric names to measured values.
 * @param {object} budget  - Key-value map of metric names to thresholds.
 * @returns {{ allPassed: boolean, results: Array }}
 */
function runChecks(metrics, budget) {
  const results = [];

  for (const [metricName, threshold] of Object.entries(budget)) {
    if (metricName.startsWith('_')) continue; // skip comment keys
    const actual = metrics[metricName];
    if (actual === undefined) {
      logger.warn(`Metric "${metricName}" not found in results – skipping.`);
      continue;
    }
    results.push(checkMetric(metricName, actual, threshold));
  }

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}

module.exports = { loadBudget, checkMetric, runChecks };

// ---------------------------------------------------------------------------
// CLI entry-point – only executes when the file is run directly.
// ---------------------------------------------------------------------------
if (require.main === module) {
  const [, , resultsFile] = process.argv;
  if (!resultsFile) {
    logger.error('Usage: node utils/budget-checker.js <path-to-browsertime.json>');
    process.exit(1);
  }

  logger.info(`Loading results from: ${resultsFile}`);
  const raw = fs.readFileSync(path.resolve(resultsFile), 'utf8');
  const data = JSON.parse(raw);

  // browsertime.json is an array; pick the first run's statistics.
  const stats = data[0]?.statistics?.timings?.pageTimings || {};
  const budget = loadBudget().browsertime || {};

  const { allPassed } = runChecks(stats, budget);
  process.exit(allPassed ? 0 : 1);
}
