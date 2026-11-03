// Electron: the exact freeze Chloe hit. Business tab, a sale, then every page must show.
const { _electron } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
(async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'lofi-home-'));
  const app = await _electron.launch({ args: ['--no-sandbox', 'dist-electron/main.js'], env: { ...process.env, HOME: home, XDG_CONFIG_HOME: path.join(home, '.config') } });
  const win = await app.firstWindow();
  await win.waitForSelector('.onb', { timeout: 20000 });
  await win.fill('.onb-name', 'Chloe'); await win.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await win.click('button:has-text("Next"), button:has-text("Set up money")');
  await win.click('button:has-text("Set up later")');
  await win.waitForSelector('.app');
  await win.click('.nav-item:has-text("Money")');
  await win.click('.money-tabs button:has-text("Business")');
  await win.click('button:has-text("Log your first purchase")');
  await win.fill('input[placeholder="Item name"]', 'Groot #49');
  await win.locator('.sheet input[inputmode="decimal"]').first().fill('40');
  await win.keyboard.press('Enter');
  await win.fill('input[placeholder="Item name"]', 'Hedwig #76');
  await win.locator('.sheet input[inputmode="decimal"]').first().fill('39');
  await win.click('.sheet button:has-text("Add to stock")');
  await win.waitForSelector('.modal', { state: 'detached' });
  await win.locator('.stock-card button:has-text("Sell")').first().click();
  await win.locator('.sheet input[inputmode="decimal"]').first().fill('85');
  await win.click('button:has-text("Record sale")');
  await win.waitForTimeout(800);
  if (await win.locator('.levelup').isVisible().catch(() => false)) { await win.locator('.levelup').click(); await win.waitForTimeout(400); }
  let bad = 0;
  for (const [label, h] of [['My Day', 'My Day'], ['Planned', 'Planned'], ['Habits', 'Habits'], ['Insights', 'Insights'], ['Quests', 'Quests'], ['Money', 'Money'], ['Business', 'Business']]) {
    await win.locator('.nav-item', { hasText: new RegExp(`^\\s*${label}`) }).first().click({ timeout: 3000 });
    await win.waitForTimeout(450);
    const h1 = await win.locator('.main-scroll h1').first().innerText();
    if (h1 !== h) { bad++; console.log('BAD', label, '->', h1); }
  }
  const saved = JSON.parse(fs.readFileSync(path.join(home, '.config', 'Undr Ctrl', 'data.json'), 'utf8'));
  console.log('pieces saved:', saved.business.items.length, 'sold:', saved.business.items.filter((i) => i.status === 'sold').length);
  await app.evaluate(({ app }) => app.quit());
  console.log(bad ? 'NAV FAIL' : 'NAV OK');
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error('NAV FAIL', e.message); process.exit(1); });
