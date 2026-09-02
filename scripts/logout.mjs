// logout.mjs
export default async function (context, commands) {
    await commands.click('id:logout-link', { waitForNavigation: true });
};

// sitespeed.io \
//   --preScript login.mjs \
//   --postScript logout.mjs \
//   https://example.org/page1 \
//   https://example.org/page2