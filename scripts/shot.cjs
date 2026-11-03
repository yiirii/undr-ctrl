const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const [, , ...specs] = process.argv;
  for (const spec of specs) {
    const [name, query, w = '1600', h = '1000', action = ''] = spec.split('|');
    const p = await b.newPage({ viewport: { width: +w, height: +h } });
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(`http://localhost:5173/?${query}`);
    await p.waitForTimeout(1200);
    if (action) { for (const a of action.split(';')) { const [k, v] = a.split('='); if (k === 'click') await p.click(v); if (k === 'press') await p.keyboard.press(v); if (k === 'type') await p.keyboard.type(v); if (k === 'wait') await p.waitForTimeout(+v); if (k === 'eval') await p.evaluate(v); } await p.waitForTimeout(900); }
    await p.screenshot({ path: `shots/${name}.png` });
    console.log(name, errs.length ? 'ERRORS: ' + errs.slice(0, 3).join(' | ') : 'ok');
    await p.close();
  }
  await b.close();
})();
