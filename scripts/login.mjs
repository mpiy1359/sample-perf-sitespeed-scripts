// login.mjs
export default async function (context, commands) {
    await commands.navigate(
        'https://en.wikipedia.org/w/index.php?title=Special:UserLogin'
    );

    await commands.type('id:wpName1', context.options.my.username);
    await commands.type('id:wpPassword1', context.options.my.password);

    // Click submit and wait for the post-login redirect
    await commands.click('id:wpLoginAttempt', {waitForNavigation: true});

    // Sanity check: if the logged-in marker isn't there, the login failed
    await commands.wait('id:pt-userpage');
};

// sitespeed.io --preScript login.mjs --browsertime.my.username myuser --browsertime.my.password 'sup3r-s3cret' https://en.wikipedia.org/wiki/User:myuser https://en.wikipedia.org/wiki/Special:Watchlist
// npx sitespeed.io.cmd --preScript login.mjs --browsertime.my.username myuser --browsertime.my.password 'sup3r-s3cret' https://en.wikipedia.org/wiki/User:myuser https://en.wikipedia.org/wiki/Special:Watchlist


/* Multiple pre and post scripts */
// sitespeed.io \
//   --preScript consent.mjs \
//   --preScript login.mjs \
//   --preScript geo.mjs \
//   https://example.org/page1
