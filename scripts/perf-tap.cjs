// Tap → screen-changed latency on an emulated iPhone with a 4x slower CPU.
// "shown" = first frame where the new screen is there; "settled" = the new screen fully opaque.
// Usage: node scripts/perf-tap.cjs <prod build url>   (dev server on :5173 supplies demo data)
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
  await p.goto(URL + '?view=myday'); await p.waitForSelector('.pn-tab'); await p.waitForTimeout(3000);
  for (let i = 0; i < 3; i++) await p.keyboard.press('Escape');
  // measure helper: starts on the next pointerdown, resolves when cond() holds (and when fully opaque)
  await p.evaluate(() => {
    window.__arm = (src) => new Promise((res) => {
      const cond = new Function('return (' + src + ')()');
      addEventListener('pointerdown', () => {
        const t0 = performance.now(); let shown = 0;
        const tick = () => {
          const el = cond();
          if (el && !shown) shown = performance.now() - t0;
          let op = 1; for (let e = el; e && e !== document.body; e = e.parentElement) op *= +getComputedStyle(e).opacity;
          if (el && op > 0.97) return res({ shown: Math.round(shown), settled: Math.round(performance.now() - t0) });
          if (performance.now() - t0 > 4000) return res({ shown: Math.round(shown), settled: -1 });
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { once: true, capture: true });
    });
  }).catch(async () => {
    await p.evaluate(`window.__arm = (src) => new Promise((res) => {
      const cond = new Function('return (' + src + ')()');
      addEventListener('pointerdown', () => {
        const t0 = performance.now(); let shown = 0;
        const tick = () => {
          const el = cond();
          if (el && !shown) shown = performance.now() - t0;
          let op = 1; for (let e = el; e && e !== document.body; e = e.parentElement) op *= +getComputedStyle(e).opacity;
          if (el && op > 0.97) return res({ shown: Math.round(shown), settled: Math.round(performance.now() - t0) });
          if (performance.now() - t0 > 4000) return res({ shown: Math.round(shown), settled: -1 });
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { once: true, capture: true });
    })`);
  });
  const h1 = (t) => `() => [...document.querySelectorAll('h1')].find((h) => h.offsetParent && h.textContent.trim() === ${JSON.stringify(t)})`;
  const on = (sel, t) => `() => [...document.querySelectorAll(${JSON.stringify(sel)})].find((e) => e.offsetParent && e.classList.contains('on') && e.textContent.includes(${JSON.stringify(t)}))`;
  const results = [];
  const step = async (label, tapSel, cond) => {
    const pr = p.evaluate((c) => window.__arm(c), cond).catch(() => p.evaluate(`window.__arm(${JSON.stringify(cond)})`));
    await p.waitForTimeout(50);
    await p.locator(tapSel).first().tap();
    const r = await pr; results.push([label, r.shown, r.settled]);
    await p.waitForTimeout(700);
  };
  const tab = (t) => `.pn-tab:has-text("${t}")`;
  await step('My Day → Money (1st)', tab('Money'), h1('Money'));
  await step('Money → My Day', tab('My Day'), h1('My Day'));
  await step('My Day → Money (again)', tab('Money'), h1('Money'));
  await step('Money → Insights', tab('Insights'), h1('Insights'));
  await step('Insights → Money', tab('Money'), h1('Money'));
  await step('Personal → Business', '.money-tabs button:has-text("Business")', `() => [...document.querySelectorAll('.main-scroll *')].find((e) => e.offsetParent && /^Profit in /i.test(e.textContent.trim()) && e.childElementCount === 0)`);
  await step('Business → Personal', '.money-tabs button:has-text("Personal")', `() => [...document.querySelectorAll('.hero-label, .money-hero')].find((e) => e.offsetParent)`);
  await step('Money → My Day', tab('My Day'), h1('My Day'));
  await step('More sheet opens', tab('More'), `() => document.querySelector('.phone-sheet .more-row')`);
  await step('More → Planned', '.more-row:has-text("Planned")', h1('Planned'));
  await step('Planned → My Day', tab('My Day'), h1('My Day'));
  console.log('step'.padEnd(28), 'shown'.padStart(6), 'settled'.padStart(8));
  for (const [l, s, t] of results) console.log(l.padEnd(28), String(s).padStart(6), String(t).padStart(8));
  const avg = (i) => Math.round(results.reduce((a, r) => a + r[i], 0) / results.length);
  console.log('AVERAGE'.padEnd(28), String(avg(1)).padStart(6), String(avg(2)).padStart(8));
  await b.close();
})();
