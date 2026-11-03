const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 256, height: 256 } });
  await p.goto('file://' + require('path').resolve('build/logo.html'));
  await p.locator('#s').screenshot({ path: 'build/icon.png', omitBackground: true });
  await p.setViewportSize({ width: 256, height: 256 });
  const p2 = await b.newPage({ viewport: { width: 32, height: 32 }, deviceScaleFactor: 1 });
  await p2.setContent(`<body style="margin:0;background:transparent"><img src="data:image/png;base64,${require('fs').readFileSync('build/icon.png').toString('base64')}" width="32" height="32"></body>`);
  await p2.screenshot({ path: 'build/tray.png', omitBackground: true, clip: { x: 0, y: 0, width: 32, height: 32 } });
  await b.close();
  console.log('icons ok');
})();
