/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    context.log.info('Start to measure the Persoverse URL');
    return commands.measure.start('https://persoverse-portal-qa.cloud.sysco.net/sign-in?reset=true');
}

// https://persoverse-portal-qa.cloud.sysco.net/sign-in?reset=true
// EXECUTION COMMAND: npx sitespeed.io.cmd -n 1 --multi measure_persoverse.mjs