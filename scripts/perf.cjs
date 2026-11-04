// Load + interaction timing on an emulated mid-range phone (4x CPU slowdown).
// Usage: node scripts/perf.cjs <url>   (serve a production build; e.g. python3 -m http.server)
const { chromium, devices } = require('playwright');
const URL = process.argv[2] || 'http://localhost:4320/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  // demo data comes from the dev server (seeding only exists in dev builds)
  const dev = await b.newPage(); await dev.goto('http://localhost:5173/?reset=1&seed=demo'); await dev.waitForTimeout(1500);
  const data = await dev.evaluate(() => localStorage.getItem('lofi-data')); await dev.close();
  await ctx.addInitScript((d) => { if (!localStorage.getItem('lofi-data')) localStorage.setItem('lofi-data', d); localStorage.setItem('undr-skip-sync', '1'); }, data);
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  // seed once, then measure a clean cold-ish reload
  await p.goto(URL + '?view=myday'); await p.waitForSelector('.pn-tab', { timeout: 30000 });
  const loads = [];
  for (let i = 0; i < 3; i++) {
    await p.goto(URL + '?view=myday');
    await p.waitForSelector('.task', { timeout: 30000 });
    loads.push(await p.evaluate(() => {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
      return { fcp: Math.round(fcp), ready: Math.round(performance.now()) };
    }));
  }
  const tabs = ['Money', 'Insights', 'My Day', 'Money', 'My Day'];
  const nav = [];
  for (const t of tabs) {
    const t0 = await p.evaluate(() => performance.now());
    await p.locator('.pn-tab', { hasText: t }).click();
    await p.waitForFunction((t) => document.querySelector('.main-scroll h1')?.textContent?.includes(t === 'My Day' ? 'My Day' : t), t);
    nav.push([t, Math.round((await p.evaluate(() => performance.now())) - t0)]);
  }
  // long tasks during a burst of task completions
  await p.evaluate(() => { window.__lt = []; new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: false }); });
  const t0 = Date.now();
  await p.locator('.tasks .task:not(.done) .check').first().click();
  await p.waitForTimeout(1500);
  const lt = await p.evaluate(() => window.__lt);
  console.log(JSON.stringify({ loads, nav, completeLongTasks: lt }, null, 0));
  await b.close();
})();
