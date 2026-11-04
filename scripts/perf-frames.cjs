// Smoothness during the app's busiest animations on an emulated iPhone (CPU slowed 4x):
// frame times while ticking a task, switching tabs and opening the + sheet.
// Usage: node scripts/perf-frames.cjs <prod build url>   (dev server on :5173 supplies demo data)
const { chromium, devices } = require('playwright');
const URL = process.argv[2] || 'http://localhost:4320/';
(async () => {
  const b = await chromium.launch();
  const dev = await b.newPage(); await dev.goto('http://localhost:5173/?reset=1&seed=demo'); await dev.waitForTimeout(1500);
  const data = await dev.evaluate(() => localStorage.getItem('lofi-data')); await dev.close();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  await ctx.addInitScript((d) => { if (!localStorage.getItem('lofi-data')) localStorage.setItem('lofi-data', d); localStorage.setItem('undr-skip-sync', '1'); }, data);
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(URL + '?view=myday'); await p.waitForSelector('.pn-tab'); await p.waitForTimeout(3500);
  for (let i = 0; i < 3; i++) await p.keyboard.press('Escape');
  const measure = async (label, act) => {
    await p.evaluate(() => { window.__f = []; window.__lt = []; let last = performance.now(); const tick = (t) => { window.__f.push(t - last); last = t; if (window.__f.length < 90) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ type: 'longtask' }); } catch {} });
    await act();
    await p.waitForTimeout(1600);
    const r = await p.evaluate(() => { const f = window.__f.slice(1); f.sort((a, b) => a - b); return { frames: f.length, p50: Math.round(f[Math.floor(f.length * 0.5)]), p95: Math.round(f[Math.floor(f.length * 0.95)]), worst: Math.round(f[f.length - 1]), over50: f.filter((x) => x > 50).length, longTasks: window.__lt }; });
    console.log(label.padEnd(22), JSON.stringify(r));
    await p.waitForTimeout(500);
  };
  await measure('tick a task', () => p.locator('.main-scroll .tasks .task:not(.done) .check').first().tap());
  await measure('tab → Money', () => p.locator('.pn-tab', { hasText: 'Money' }).tap());
  await measure('Personal → Business', () => p.locator('.main-scroll .money-tabs button', { hasText: 'Business' }).tap());
  await measure('tab → My Day', () => p.locator('.pn-tab', { hasText: 'My Day' }).tap());
  await measure('open + sheet', () => p.locator('.pn-plus').tap());
  await b.close();
})();
