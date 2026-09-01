/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    commands.meta.setTitle('Test Grafana SPA');
    commands.meta.setDescription('Test the first page, click the timepicker and then choose <b>Last 30 days</b> and measure that page.');
    await commands.measure.start(
        'https://dashboard.sitespeed.io/d/000000044/page-timing-metrics?orgId=1','pageTimingMetricsDefault'
    );
    await commands.click('class:gf-timepicker-nav-btn');
    await commands.wait.byTime(1000);
    await commands.measure.start('pageTimingMetrics30Days');
    await commands.click('link:Last 30 days', { waitForNavigation: true });
    await commands.measure.stop();
};