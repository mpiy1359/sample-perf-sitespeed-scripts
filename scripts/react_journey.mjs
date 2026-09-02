/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {

    await commands.measure.start('https://react.dev');
    await commands.measure.start('Learn');
    await commands.click('link:Learn', { waitForNavigation: true });
    return commands.measure.stop();

}