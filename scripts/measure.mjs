/**
 * @param {import('browsertime').BrowsertimeContext} context
 * @param {import('browsertime').BrowsertimeCommands} commands
 */
export default async function (context, commands) {
    context.log.info('Start to measure my first URL');
    return commands.measure.start('https://www.sitespeed.io');
}

// sitespeed.io -n 1 --multi measure.mjs
// EXECUTION COMMAND: npx sitespeed.io.cmd -n 1 --multi measure.mjs

/**
 * C:\git_repos\sample-perf-sitespeed-scripts\scripts>npx sitespeed.io.cmd -n 1 --multi measure.mjs
 * [2026-09-01 05:29:50] INFO: Versions OS: win32 10.0.20348 nodejs: v24.20.0 sitespeed.io: 42.6.0 browsertime: 28.3.0 coach: 9.2.1
 * [2026-09-01 05:29:51] INFO: Running tests using Chrome - 1 iteration(s)
 *
 * DevTools listening on ws://127.0.0.1:9222/devtools/browser/69868cb2-4ddf-4b17-9a0b-a1aa66b001c8
 * [4696:14520:0901/052951.695:ERROR:net\base\host_mapping_rules.cc:146] Failed parsing rule: "MAP cache.pack.google.com 127.0.0.1
 * [4696:14520:0901/052951.703:ERROR:net\base\host_mapping_rules.cc:146] Failed parsing rule: "MAP cache.pack.google.com 127.0.0.1
 * [2026-09-01 05:29:51] INFO: Start to measure my first URL
 * [2026-09-01 05:29:51] INFO: Testing url https://www.sitespeed.io iteration 1
 * [6168:13452:0901/052954.256:ERROR:google_apis\gcm\engine\registration_request.cc:291] Registration response error message: PHONE_REGISTRATION_ERROR
 * [2026-09-01 05:29:58] INFO: Take after page complete check screenshot
 * [2026-09-01 05:29:59] INFO: Take cumulative layout shift screenshot
 * [2026-09-01 05:30:00] INFO: Take largest contentful paint screenshot
 * [2026-09-01 05:30:02] INFO: https://www.sitespeed.io 9 requests, TTFB: 550ms, firstPaint: 879ms, FCP: 879ms, DOMContentLoaded: 855ms, LCP: 1.01s, CLS: 0, TBT: 0ms, CPUBenchmark: 46ms, Load: 861ms
 * [2026-09-01 05:30:06] INFO: HTML stored in C:\git_repos\sample-perf-sitespeed-scripts\scripts\sitespeed-result\measure_mjs\2026-09-01-05-29-50
 */