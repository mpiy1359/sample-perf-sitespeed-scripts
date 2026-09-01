/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
  try {
    // 1. Navigate to the target page (we bypass measuring this setup step)
    await commands.navigate('https://en.wikipedia.org/w/index.php?title=Special:UserLogin'); [11]

    // 2. Populate input fields using unified selectors (CSS selectors used by default)
    // Click and type commands natively auto-wait up to 6 seconds for elements to appear [13]
    await commands.type('id:wpName1', 'my_sample_username'); [11]
    await commands.type('id:wpPassword1', 'my_secure_password'); [11]

    // 3. Initiate metric collection and video trace for the transactional login step
    await commands.measure.start('Login_Submit'); [11]

    // 4. Click the login button and instruct the engine to wait for navigation to stabilize
    await commands.click('id:wpLoginAttempt', { waitForNavigation: true }); [11, 13]

    // 5. Conclude metric capture for the login step
    await commands.measure.stop(); [11]

    // 6. Sequence into a subsequent measured navigation under the same session (keeps session cookies active)
    await commands.measure.start('Wikipedia_Main_Page'); [14]
    await commands.navigate('https://en.wikipedia.org/wiki/Main_Page');
    return commands.measure.stop(); [14]

  } catch (e) {
    // Log failures gracefully to inspect them inside your script console and HTML logs
    context.log.error('Automation failed: ' + e.message); [15]
    throw e; [11]
  }
}

// EXECUTION COMMAND: npx sitespeed.io.cmd sample_journey.mjs -b chrome -n 3
