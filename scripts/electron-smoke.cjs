const { _electron } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
(async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'lofi-home-'));
  const app = await _electron.launch({ args: ['--no-sandbox', 'dist-electron/main.js'], env: { ...process.env, HOME: home, XDG_CONFIG_HOME: path.join(home, '.config') } });
  const win = await app.firstWindow();
  await win.waitForSelector('.onb', { timeout: 20000 });
  console.log('bridge:', await win.evaluate(() => typeof window.lofi === 'object' && typeof window.lofi.storage.save));
  await win.fill('.onb-name', 'Chloe');
  await win.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await win.click('button:has-text("Next"), button:has-text("Set up money")');
  await win.click('button:has-text("Set up later")');
  await win.waitForSelector('.app');
  await win.keyboard.press('Control+Space');
  await win.keyboard.type('read chapter 5 tmr #uni');
  await win.keyboard.press('Enter');
  await win.waitForTimeout(1500);
  const dataDir = path.join(home, '.config', 'Undr Ctrl');
  const file = path.join(dataDir, 'data.json');
  const saved = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
  console.log('data.json saved:', !!saved, 'tasks:', saved?.tasks?.length, 'name:', saved?.profile?.name, 'backups:', fs.existsSync(path.join(dataDir, 'backups')) ? fs.readdirSync(path.join(dataDir, 'backups')) : []);
  // hidden signal reaches renderer
  await win.evaluate(() => { window.__hid = 0; window.lofi.onWindowHidden(() => { window.__hid++; }); });
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].hide());
  await win.waitForTimeout(400);
  console.log('hidden events:', await win.evaluate(() => window.__hid), 'visible:', await win.evaluate(() => window.lofi.isWindowVisible()));
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].show());
  await win.waitForTimeout(300);
  await win.screenshot({ path: 'shots/electron.png' });
  console.log('title:', await win.title(), '| app name:', await app.evaluate(({ app }) => app.getName()));
  // close hides instead of quitting
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].close());
  await win.waitForTimeout(300);
  console.log('windows after close:', await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().length));
  await app.evaluate(({ app }) => app.quit());
  console.log('SMOKE OK');
})().catch((e) => { console.error('SMOKE FAIL', e.message); process.exit(1); });
