/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {

    await commands.navigate('https://www.sitespeed.io');

    await commands.measure.start('Documentation');
    await commands.click('link:Documentation', {waitForNavigation: true});
    return commands.measure.stop();

}

// EXECUTION COMMAND: npx sitespeed.io.cmd navigate_ssio_docu_page.mjs -n 1