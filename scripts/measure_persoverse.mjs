/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    context.log.info('Start to measure the Persoverse URL');
    return commands.measure.start('https://persoverse-portal-qa.cloud.sysco.net/sign-in?reset=true');
}

// https://persoverse-portal-qa.cloud.sysco.net/sign-in?reset=true