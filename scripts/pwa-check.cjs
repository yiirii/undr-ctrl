// Checks the built web app: manifest, iPhone icon, offline worker, offline reload. Serve dist-web under /undr-ctrl/ on :4319 first.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('ERR', e.message));
  p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 160)); });
  await p.goto('http://localhost:4319/undr-ctrl/'); await p.waitForTimeout(2500);
  const man = await p.evaluate(async () => { const r = await fetch(document.querySelector('link[rel=manifest]').href); return [r.status, (await r.json()).name]; });
  console.log('manifest', man);
  const icon = await p.evaluate(async () => (await fetch(document.querySelector('link[rel=apple-touch-icon]').href)).status);
  console.log('apple icon', icon);
  console.log('sw', await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return !!(r && (r.active || r.installing || r.waiting)); }));
  console.log('first screen text:', (await p.locator('body').innerText()).slice(0, 120).replace(/\n/g, ' | '));
  await p.waitForTimeout(1500);
  await p.reload(); await p.waitForTimeout(1500); // let the SW control + cache assets
  await ctx.setOffline(true);
  await p.reload(); await p.waitForTimeout(1500);
  console.log('offline reload shows app:', (await p.locator('body').innerText()).slice(0, 80).replace(/\n/g, ' | '));
  await p.screenshot({ path: '/home/claude/lofi/shots/pwa-first.png' });
  await b.close();
})();
