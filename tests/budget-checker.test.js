/**
 * tests/budget-checker.test.js
 *
 * Unit tests for utils/budget-checker.js
 *
 * Purpose:
 *   Verifies the budget-checking logic in isolation – no browser or network
 *   calls are required. Tests are written with Node's built-in `assert` module
 *   so there are zero additional test-runner dependencies.
 *
 * Run:
 *   node tests/budget-checker.test.js
 */

'use strict';

const assert = require('assert');
const { checkMetric, runChecks } = require('../utils/budget-checker');

// ---------------------------------------------------------------------------
// checkMetric
// ---------------------------------------------------------------------------

// PASS when actual is below threshold
{
  const result = checkMetric('firstPaint', 1500, 2000);
  assert.strictEqual(result.passed, true, 'should PASS when actual < threshold');
}

// PASS when actual equals threshold (boundary)
{
  const result = checkMetric('firstPaint', 2000, 2000);
  assert.strictEqual(result.passed, true, 'should PASS when actual === threshold');
}

// FAIL when actual exceeds threshold
{
  const result = checkMetric('firstPaint', 2500, 2000);
  assert.strictEqual(result.passed, false, 'should FAIL when actual > threshold');
}

// Returned object shape
{
  const result = checkMetric('largestContentfulPaint', 1000, 3500);
  assert.ok('metricName' in result, 'result should contain metricName');
  assert.ok('actual' in result, 'result should contain actual');
  assert.ok('threshold' in result, 'result should contain threshold');
}

// ---------------------------------------------------------------------------
// runChecks
// ---------------------------------------------------------------------------

// All metrics within budget → allPassed = true
{
  const metrics = { firstPaint: 1000, firstContentfulPaint: 1200 };
  const budget  = { firstPaint: 2000, firstContentfulPaint: 2500 };
  const { allPassed, results } = runChecks(metrics, budget);
  assert.strictEqual(allPassed, true, 'allPassed should be true when all metrics pass');
  assert.strictEqual(results.length, 2, 'should return one result per budget entry');
}

// One metric over budget → allPassed = false
{
  const metrics = { firstPaint: 3000, firstContentfulPaint: 1200 };
  const budget  = { firstPaint: 2000, firstContentfulPaint: 2500 };
  const { allPassed } = runChecks(metrics, budget);
  assert.strictEqual(allPassed, false, 'allPassed should be false when any metric fails');
}

// Missing metric in results is skipped without throwing
{
  const metrics = { firstPaint: 1000 };
  const budget  = { firstPaint: 2000, missingMetric: 500 };
  let threw = false;
  try {
    runChecks(metrics, budget);
  } catch {
    threw = true;
  }
  assert.strictEqual(threw, false, 'runChecks should not throw for missing metrics');
}

// _comment keys in budget are ignored
{
  const metrics = {};
  const budget  = { _comment: 'ignored' };
  const { results } = runChecks(metrics, budget);
  assert.strictEqual(results.length, 0, '_comment keys should be skipped');
}

console.log('\n✅  All budget-checker tests passed.\n');
