/**
 * tests/logger.test.js
 *
 * Unit tests for utils/logger.js
 *
 * Purpose:
 *   Verifies that the logger correctly:
 *     - Writes to stdout for info/debug messages.
 *     - Writes to stderr for warn/error messages.
 *     - Respects the LOG_LEVEL environment variable.
 *
 * Run:
 *   node tests/logger.test.js
 */

'use strict';

const assert = require('assert');

// ---------------------------------------------------------------------------
// Helpers – capture stdout / stderr without polluting the test output
// ---------------------------------------------------------------------------

/**
 * Temporarily replaces a write stream with a capture function, runs
 * `fn`, then restores the original and returns what was written.
 *
 * @param {'stdout'|'stderr'} stream
 * @param {Function} fn
 * @returns {string} Captured output.
 */
function capture(stream, fn) {
  const chunks = [];
  const original = process[stream].write.bind(process[stream]);
  process[stream].write = (chunk) => { chunks.push(chunk); return true; };
  fn();
  process[stream].write = original;
  return chunks.join('');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// info() writes valid JSON to stdout
{
  // Clear module cache so LOG_LEVEL override takes effect.
  delete require.cache[require.resolve('../utils/logger')];
  process.env.LOG_LEVEL = 'info';
  const { logger } = require('../utils/logger');

  const out = capture('stdout', () => logger.info('hello world'));
  const parsed = JSON.parse(out.trim());

  assert.strictEqual(parsed.level, 'INFO');
  assert.strictEqual(parsed.message, 'hello world');
  assert.ok(parsed.timestamp, 'should include timestamp');
}

// error() writes to stderr
{
  delete require.cache[require.resolve('../utils/logger')];
  process.env.LOG_LEVEL = 'info';
  const { logger } = require('../utils/logger');

  const err = capture('stderr', () => logger.error('something broke'));
  const parsed = JSON.parse(err.trim());

  assert.strictEqual(parsed.level, 'ERROR');
}

// warn() writes to stderr
{
  delete require.cache[require.resolve('../utils/logger')];
  const { logger } = require('../utils/logger');

  const err = capture('stderr', () => logger.warn('heads up'));
  const parsed = JSON.parse(err.trim());
  assert.strictEqual(parsed.level, 'WARN');
}

// debug() is suppressed when LOG_LEVEL=info
{
  delete require.cache[require.resolve('../utils/logger')];
  process.env.LOG_LEVEL = 'info';
  const { logger } = require('../utils/logger');

  const out = capture('stdout', () => logger.debug('invisible'));
  assert.strictEqual(out, '', 'debug should be suppressed at LOG_LEVEL=info');
}

// debug() is visible when LOG_LEVEL=debug
{
  delete require.cache[require.resolve('../utils/logger')];
  process.env.LOG_LEVEL = 'debug';
  const { logger } = require('../utils/logger');

  const out = capture('stdout', () => logger.debug('visible'));
  assert.ok(out.length > 0, 'debug should be visible at LOG_LEVEL=debug');
  delete process.env.LOG_LEVEL;
}

// Error objects are serialised correctly
{
  delete require.cache[require.resolve('../utils/logger')];
  process.env.LOG_LEVEL = 'error';
  const { logger } = require('../utils/logger');

  const err = capture('stderr', () => logger.error('oops', new Error('boom')));
  const parsed = JSON.parse(err.trim());
  assert.ok(parsed.data && parsed.data.message === 'boom', 'Error should be serialised');
}

console.log('\n✅  All logger tests passed.\n');
