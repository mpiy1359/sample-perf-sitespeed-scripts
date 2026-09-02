/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    await commands.navigate('https://www.sitespeed.io');

    // The sitespeed.io start page has a user timing mark named userTimingHeader
    const userTimingHeader = await commands.js.run(
        `return performance.getEntriesByName('userTimingHeader')[0].startTime;`
    );

    // The sitespeed.io start page has an element timing API for the logo
    const logoRenderTime = await commands.js.run(`
  const observer = new PerformanceObserver(list => {});
  observer.observe({ type: 'element', buffered: true });
  const entries = observer.takeRecords();
  for (let entry of entries) {
    if (entry.identifier === 'logo') {
      return Number(entry.renderTime.toFixed(0));
    }
  }
  `);

    context.log.info(
        `User Timing header: ${userTimingHeader} ms  and Logo Element render time ${logoRenderTime} ms`
    );
}