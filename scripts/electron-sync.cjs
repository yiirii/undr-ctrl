// Electron: the Sync tab loads Firebase and shows the sign-in form (no crash, no CSP block of the SDK itself).
const { _electron } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
(async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'lofi-home-'));
  const app = await _electron.launch({ args: ['--no-sandbox', 'dist-electron/main.js'], env: { ...process.env, HOME: home, XDG_CONFIG_HOME: path.join(home, '.config') } });
  const win = await app.firstWindow();
  const errs = [];
  win.on('pageerror', (e) => errs.push(e.message));
  win.on('console', (m) => { if (m.type() === 'error' && /Content Security Policy|Refused to/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await win.waitForSelector('.onb', { timeout: 20000 });
  await win.fill('.onb-name', 'Chloe'); await win.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await win.click('button:has-text("Next"), button:has-text("Set up money")');
  await win.click('button:has-text("Set up later")');
  await win.waitForSelector('.app');
  await win.click('.nav-item:has-text("Settings"), button:has-text("Settings")');
  await win.click('.seg-ctl button:has-text("Sync")');
  await win.waitForSelector('.sync-card:has-text("Sign in to sync")', { timeout: 15000 });
  console.log('sync form shown; errors:', errs.length ? errs : 'none');
  await app.evaluate(({ app }) => app.quit());
  console.log(errs.length ? 'SYNC-UI FAIL' : 'SYNC-UI OK');
  process.exit(errs.length ? 1 : 0);
})().catch((e) => { console.error('SYNC-UI FAIL', e.message); process.exit(1); });
