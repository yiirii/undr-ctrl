// Screenshots of every screen / window / state, at laptop and iPhone sizes, plus contact sheets for review.
// Usage: node scripts/audit-shots.cjs [desk|phone] ; dev server on :5173
const { chromium, devices } = require('playwright');
const fs = require('fs');
const MODE = process.argv[2] || 'desk';
const PHONE = MODE === 'phone';
const OUT = `shots/audit-${MODE}`;
fs.mkdirSync(OUT, { recursive: true });

const nav = (label) => async (p) => {
  if (!PHONE) return p.locator('.nav-item', { hasText: new RegExp(`^\\s*${label}`) }).first().click();
  const tab = p.locator('.pn-tab', { hasText: new RegExp(`^\\s*${label}\\s*$`) });
  if (await tab.count()) return tab.first().click();
  await p.locator('.pn-tab', { hasText: 'More' }).click();
  await p.locator('.more-row', { hasText: new RegExp(`^\\s*${label}\\s*$`) }).first().click();
};
const click = (sel) => async (p) => p.locator(sel).first().click();
const scroll = (y) => async (p) => p.evaluate((y) => document.querySelector('.main-scroll')?.scrollTo(0, y), y);
const biz = [nav('Money'), click('.money-tabs button:has-text("Business")')];
const plus = (label) => PHONE ? [click('.pn-plus'), click(`.qa-btn:has-text("${label}")`)] : [];

const SHOTS = [
  ['01-myday', [nav('My Day')]],
  ['02-myday-scrolled', [nav('My Day'), scroll(600)]],
  ['03-planned', [nav('Planned')]],
  ['04-habits', [nav('Habits')]],
  ['05-list-uni', [nav('Uni')]],
  ['06-task-detail', [nav('My Day'), click('.tasks .task:not(.done)')]],
  ['07-task-detail-scrolled', [nav('My Day'), click('.tasks .task:not(.done)'), async (p) => p.evaluate(() => document.querySelector('.detail')?.scrollTo(0, 2000))]],
  ['08-quickadd', [nav('My Day'), async (p) => { await p.keyboard.press('Control+Space'); await p.keyboard.type('essay due fri 5pm #uni'); }]],
  ['09-money', [nav('Money'), click('.money-tabs button:has-text("Personal")')]],
  ['10-money-scrolled', [nav('Money'), click('.money-tabs button:has-text("Personal")'), scroll(700)]],
  ['11-money-scrolled2', [nav('Money'), click('.money-tabs button:has-text("Personal")'), scroll(1500)]],
  ['12-logsheet', [nav('Money'), click('.money-tabs button:has-text("Personal")'), ...(PHONE ? plus('Expense') : [async (p) => p.keyboard.press('Control+e')])]],
  ['13-category-detail', [nav('Money'), click('.money-tabs button:has-text("Personal")'), click('.bubble')]],
  ['14-recap', [nav('Money'), click('button:has-text("recap")')]],
  ['15-business', [...biz]],
  ['16-business-scrolled', [...biz, scroll(800)]],
  ['17-business-scrolled2', [...biz, scroll(1600)]],
  ['18-buy', [...biz, ...(PHONE ? plus('Bought') : [click('button:has-text("Bought")')])]],
  ['19-sell-pick', [...biz, ...(PHONE ? plus('Sold') : [click('.money-grid button:has-text("Sold")')])]],
  ['20-sell', [...biz, click('.stock-card button:has-text("Sell")')]],
  ['21-reserve', [...biz, click('.stock-card button[title="Reserve for a buyer"]')]],
  ['22-item', [...biz, click('.stock-card')]],
  ['23-insights', [nav('Insights')]],
  ['24-insights-prod', [nav('Insights'), click('button:has-text("Productivity")')]],
  ['25-quests', [nav('Quests')]],
  ['26-profile', [nav('Profile')]],
  ['27-profile-scrolled', [nav('Profile'), scroll(900)]],
  ['28-settings-general', [nav('Settings')]],
  ['29-settings-appearance', [nav('Settings'), click('.seg-ctl button:has-text("Appearance")')]],
  ['30-settings-money', [nav('Settings'), click('.seg-ctl button:has-text("Money")')]],
  ...(PHONE ? [] : [['31-settings-music', [nav('Settings'), click('.seg-ctl button:has-text("Music")')]]]),
  ['32-settings-sync', [nav('Settings'), click('.seg-ctl button:has-text("Sync")')]],
  ['33-settings-data', [nav('Settings'), click('.seg-ctl button:has-text("Data")')]],
  ['34-focus', [nav('My Day'), async (p) => { const b = p.locator('.task:not(.done) .focus-btn').first(); await b.hover().catch(() => {}); await b.click({ force: true }); }]],
  ['35-more', PHONE ? [click('.pn-tab:has-text("More")')] : [nav('My Day')]],
  ['36-plus', PHONE ? [click('.pn-plus')] : [nav('My Day')]],
];

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(PHONE ? { ...devices['iPhone 14'] } : { viewport: { width: 1440, height: 900 } });
  const errors = [];
  for (const [name, steps] of SHOTS) {
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(`${name}: console ${m.text().slice(0, 140)}`); });
    await p.goto(`http://localhost:5173/?reset=1&seed=demo&view=myday`); await p.waitForTimeout(700);
    for (let i = 0; i < 3; i++) { await p.keyboard.press('Escape'); await p.waitForTimeout(90); }
    try {
      for (const s of steps) {
        if (await p.locator('.levelup').isVisible().catch(() => false)) { await p.locator('.levelup').click(); await p.waitForTimeout(300); }
        await s(p); await p.waitForTimeout(350);
      }
    } catch (e) { errors.push(`${name}: step failed ${e.message.split('\n')[0]}`); }
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/${name}.png` });
    await p.close();
  }
  await b.close();
  console.log(errors.length ? errors.join('\n') : 'no errors');
})();
