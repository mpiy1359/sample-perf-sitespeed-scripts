/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    await commands.navigate('https://www.sitespeed.io');
    return commands.measure.start('https://www.sitespeed.io/documentation/');
}

// EXECUTION COMMAND: npx sitespeed.io.cmd -n 1 --multi navigate_measure.mjs
// npx browsertime navigate_measure.mjs

// npx sitespeed.io.cmd measure.mjs navigate_measure.mjs