/**
 * user-journey.js
 *
 * A scripted Browsertime user journey for sitespeed.io.
 *
 * Purpose:
 *   Browsertime scripts allow you to simulate real user interactions
 *   (navigation, clicks, form fills) rather than passively loading a URL.
 *   This gives a more accurate picture of Real User Monitoring (RUM) metrics.
 *
 * How it works:
 *   - The exported async function receives a `context` object injected by
 *     sitespeed.io/Browsertime at runtime.
 *   - `context.webdriver` is a Selenium WebDriver instance.
 *   - `context.selenium.webdriver` exposes the Selenium namespace (By, until…).
 *   - `context.browsertime.result` is where custom metrics can be attached.
 *
 * Reference:
 *   https://www.sitespeed.io/documentation/sitespeed.io/scripting/
 */

'use strict';

/**
 * Main scripted journey – navigate to sitespeed.io home page and
 * verify a key element is present before measurements are captured.
 *
 * @param {object} context - Browsertime script context provided by sitespeed.io.
 * @returns {Promise<void>}
 */
module.exports = async function userJourney(context) {
  const driver = context.webdriver;
  const selenium = context.selenium.webdriver;

  // ---------------------------------------------------------------------------
  // Step 1 – Start performance measurement
  // startMeasurement() begins recording timing metrics for this page view.
  // ---------------------------------------------------------------------------
  await context.startMeasurement();

  // ---------------------------------------------------------------------------
  // Step 2 – Navigate to the target URL
  // ---------------------------------------------------------------------------
  await driver.get('https://www.sitespeed.io/');

  // ---------------------------------------------------------------------------
  // Step 3 – Wait for a key element to confirm the page has loaded
  // We wait for the <body> element to be located. In a real scenario you would
  // wait for a more specific element relevant to your application.
  // ---------------------------------------------------------------------------
  await driver.wait(
    selenium.until.elementLocated(selenium.By.tagName('body')),
    10000 // maximum wait in milliseconds
  );

  // ---------------------------------------------------------------------------
  // Step 4 – Stop performance measurement
  // stopMeasurement() signals the end of this page view and captures all metrics.
  // ---------------------------------------------------------------------------
  await context.stopMeasurement();
};
