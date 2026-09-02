/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    await commands.navigate('https://www.sitespeed.io');
    // This is equivalent to measure.start + click(selector, { waitForNavigation: true }) + measure.stop
    return commands.measure.clickAndMeasure('Documentation', 'a[href="/documentation/"]');
}