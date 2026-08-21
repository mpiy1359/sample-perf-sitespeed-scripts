/**
 * utils/logger.js
 *
 * Centralised logging utility for the performance test project.
 *
 * Purpose:
 *   Provides a consistent, structured log format across all scripts and
 *   utilities. Using a dedicated logger (instead of bare console.log calls)
 *   makes it easy to:
 *     - Add timestamps to every message.
 *     - Control log verbosity via the LOG_LEVEL environment variable.
 *     - Swap in a more powerful logging library (e.g., winston, pino) later
 *       without touching every file that uses logging.
 *
 * Usage:
 *   const { logger } = require('./utils/logger');
 *   logger.info('Test started');
 *   logger.warn('Budget threshold approaching');
 *   logger.error('Test failed', err);
 */

'use strict';

/**
 * Log levels in ascending verbosity order.
 * Only messages at or above the configured level will be printed.
 * @enum {number}
 */
const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

/**
 * Active log level, driven by the LOG_LEVEL environment variable.
 * Defaults to 'info' if the variable is unset or invalid.
 * @type {number}
 */
const activeLevel =
  LOG_LEVELS[process.env.LOG_LEVEL] !== undefined
    ? LOG_LEVELS[process.env.LOG_LEVEL]
    : LOG_LEVELS.info;

/**
 * Returns an ISO-8601 timestamp string for the current moment.
 * @returns {string}
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Internal write function – formats and prints a log entry if the message
 * level is at or above the configured active level.
 *
 * @param {'error'|'warn'|'info'|'debug'} level - Severity of the message.
 * @param {string} message - Human-readable log message.
 * @param {*} [data] - Optional extra data (object, Error, etc.).
 */
function write(level, message, data) {
  if (LOG_LEVELS[level] > activeLevel) return;

  const entry = {
    timestamp: timestamp(),
    level: level.toUpperCase(),
    message,
  };

  if (data !== undefined) {
    entry.data = data instanceof Error ? { message: data.message, stack: data.stack } : data;
  }

  const output = JSON.stringify(entry);

  // Errors and warnings go to stderr; everything else to stdout.
  if (level === 'error' || level === 'warn') {
    process.stderr.write(output + '\n');
  } else {
    process.stdout.write(output + '\n');
  }
}

/**
 * Public logger API.
 */
const logger = {
  /** Log a debug-level message (only visible when LOG_LEVEL=debug). */
  debug: (message, data) => write('debug', message, data),

  /** Log an informational message. */
  info: (message, data) => write('info', message, data),

  /** Log a warning. */
  warn: (message, data) => write('warn', message, data),

  /** Log an error. */
  error: (message, data) => write('error', message, data),
};

module.exports = { logger };
