const { _electron } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
(async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'lofi-home-'));
  const env = { ...process.env, HOME: home, XDG_CONFIG_HOME: path.join(home, '.config') };
  let app = await _electron.launch({ args: ['--no-sandbox', 'dist-electron/main.js'], env });
  let win = await app.firstWindow();
  await win.waitForSelector('.onb');
  await win.evaluate(() => window.__lofi.getState().patch((s) => ({ ...s, profile: { ...s.profile, name: 'Q', onboarded: true } })));
  await win.waitForSelector('.app');
  await win.waitForTimeout(800);
  await win.keyboard.press('Control+Space');
  await win.keyboard.type('saved right before quit');
  await win.keyboard.press('Enter');
  await app.evaluate(({ app }) => app.quit()); // within the 500 ms debounce
  await app.close().catch(() => {});
  const file = path.join(home, '.config', 'Undr Ctrl', 'data.json');
  const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ok = saved.tasks.some((t) => t.title === 'saved right before quit');
  console.log(ok ? 'QUIT-SAVE OK' : 'QUIT-SAVE LOST');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
