/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {

    const stopWatch = commands.stopWatch.get('Before_navigating_page');
    // Do the thing you want to measure ...
    // Then stop the watch
    const time = stopWatch.stop();
    // Measure navigation to a page
    await commands.measure.start('https://www.sitespeed.io');
    // Then attach that timing to that page.
    commands.measure.add(stopWatch.getName(), time);

}
