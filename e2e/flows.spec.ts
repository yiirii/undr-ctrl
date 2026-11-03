import { test, expect, type Page } from '@playwright/test';

const lofi = (page: Page, fn: string) => page.evaluate(fn);
async function open(page: Page, q: string) {
  await page.goto(`/?${q}`);
  await page.waitForFunction(() => !!(window as any).__lofi && (document.querySelector('.app') || document.querySelector('.onb')));
  await page.waitForTimeout(300);
}
const xp = (page: Page) => page.evaluate(() => (window as any).__lofi.getState().s.ledger.filter((e: any) => e.lifetime).reduce((n: number, e: any) => n + e.amount, 0));

test('quick-add a dated task, find it in Planned and Uni, complete it for XP', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=myday');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+Space');
  await page.keyboard.type('essay due fri 5pm #uni');
  const cand = page.locator('.qa-cand.on');
  await expect(cand).toContainText('Uni');
  await expect(cand).toContainText(/Fri|Today|Tomorrow|\w{3} \d+/);
  await expect(cand).toContainText('5 PM');
  await page.keyboard.press('Enter');
  await page.click('.nav-item:has-text("Planned")');
  await expect(page.locator('.task-title', { hasText: 'essay' })).toBeVisible();
  await page.click('.nav-item:has-text("Uni")');
  const row = page.locator('.task', { hasText: 'essay' });
  await expect(row).toBeVisible();
  const before = await xp(page);
  await row.locator('.check').click();
  await expect.poll(() => xp(page)).toBeGreaterThan(before);
});

test('money: guided setup, log out and in, hero and bars update, empty recap does not crash', async ({ page }) => {
  await open(page, 'reset=1&seed=fresh');
  await page.fill('.onb-name', 'Chloe');
  await page.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await page.click('button:has-text("Next"), button:has-text("Set up money")');
  await page.locator('.sheet input.input').first().fill('1500');
  await page.click('button:has-text("Next")');
  await page.click('button:has-text("Next")');
  await expect(page.locator('.stack-bar')).toBeVisible();
  await page.click('button:has-text("Next")');
  await page.click('button:has-text("Done")');
  await page.click('.nav-item:has-text("Money")');
  const hero = page.locator('.hero-num');
  await expect(hero).toContainText('RM 1,200'); // 20% of RM 1,500 goes to savings
  await page.keyboard.press('Control+e');
  await page.click('.cat-pick:has-text("Food")');
  for (const k of ['1', '2', '.', '5', '0']) await page.keyboard.press(k);
  await page.click('button:has-text("Log RM 12.50")');
  await expect(hero).toContainText('RM 1,187.50');
  await page.keyboard.press('Control+e');
  await page.click('.inout-toggle button:has-text("Money in")');
  await page.click('.cat-pick:has-text("Parents")');
  for (const k of ['5', '0', '0']) await page.keyboard.press(k);
  await page.keyboard.press('Enter');
  await expect(page.locator('.io-row').first()).toContainText('RM 500');
  await expect(page.locator('.kept-line')).toContainText('RM 487.50');
  await lofi(page, `window.__lofi.getState().setUI({ recapMonth: '2026-01' })`);
  await expect(page.locator('.recap')).toBeVisible();
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  await expect(page.locator('.recap')).toContainText('Wealth XP this month');
});

test('wealth drops on spending and rises on deposit', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=money');
  await page.keyboard.press('Escape');
  const wea = () => page.evaluate(() => (window as any).__lofi.getState().s.ledger.filter((e: any) => e.stat === 'wea').sort((a: any, b: any) => (a.at < b.at ? -1 : 1)).reduce((n: number, e: any) => Math.max(0, n + e.amount), 0));
  const w0 = await wea();
  await page.keyboard.press('Control+e');
  await page.click('.cat-pick:has-text("Fun")');
  for (const k of ['4', '0']) await page.keyboard.press(k);
  await page.keyboard.press('Enter');
  await expect.poll(wea).toBe(w0 - 40);
  await page.locator('.goal', { hasText: 'Bali trip' }).locator('button:has-text("Add to goal")').click();
  await page.locator('.goal', { hasText: 'Bali trip' }).locator('input').fill('50');
  await page.keyboard.press('Enter');
  await expect.poll(wea).toBe(w0 - 40 + 100);
});

test('level up overlay appears, then any key dismisses it', async ({ page }) => {
  await open(page, 'reset=1&seed=levelup&view=myday');
  await page.keyboard.press('Escape');
  await page.locator('.task:not(.done)').first().locator('.check').click();
  await expect(page.locator('.levelup')).toBeVisible();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'shots/levelup.png' });
  await page.keyboard.press('Space');
  await expect(page.locator('.levelup')).toHaveCount(0);
});

test('focus session completes and gives XP', async ({ page }) => {
  await page.clock.install();
  await open(page, 'reset=1&seed=demo&view=myday');
  await page.keyboard.press('Escape');
  await page.locator('.task:not(.done)').first().hover();
  await page.locator('.task:not(.done) .focus-btn').first().click();
  await expect(page.locator('.focus-time')).toBeVisible();
  const before = await xp(page);
  await page.clock.fastForward('25:05');
  await expect(page.locator('.toast', { hasText: 'Focus session done' })).toBeVisible();
  expect(await xp(page)).toBeGreaterThan(before);
});

test('quest completion claims XP and shows a toast', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=quests');
  await page.keyboard.press('Escape');
  await lofi(page, `(() => { const st = window.__lofi.getState(); st.patch((s) => ({ ...s, quests: s.quests.map((q, i) => (i === 0 ? { ...q, templateId: 'd-three', label: 'Complete 3 tasks', target: 3, claimed: false } : q)) })); })()`);
  await page.click('.nav-item:has-text("My Day")');
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Control+Space');
    await page.keyboard.type(`quick task ${i}`);
    await page.keyboard.press('Enter');
    await page.locator('.task', { hasText: `quick task ${i}` }).locator('.check').click();
    // a big moment (level-up) may cover the screen; tap it away like a person would
    const lu = page.locator('.levelup');
    if (await lu.isVisible().catch(() => false)) { await lu.click(); await expect(lu).toBeHidden(); }
  }
  await expect(page.locator('.toast', { hasText: 'Quest complete' })).toBeVisible();
});

test('add a money category inline (no browser prompt)', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=money');
  await page.keyboard.press('Escape');
  await page.click('button:has-text("Category")');
  await page.locator('.new-cat input').fill('Coffee');
  await page.keyboard.press('Enter');
  await expect(page.locator('.bubble', { hasText: 'Coffee' })).toBeVisible();
});

test('money setup works with no income: skip, track first, then tracking hero', async ({ page }) => {
  await open(page, 'reset=1&seed=fresh');
  await page.fill('.onb-name', 'Chloe');
  await page.keyboard.press('Enter');
  for (let i = 0; i < 3; i++) await page.click('button:has-text("Next"), button:has-text("Set up money")');
  await page.click("button:has-text(\"Skip, my income isn't regular\")");
  await page.click('button:has-text("Next")');
  await expect(page.locator('.choice.on')).toContainText('Track first');
  await page.click('button:has-text("Next")');
  await page.click('button:has-text("Done")');
  await page.click('.nav-item:has-text("Money")');
  await expect(page.locator('.money-hero')).toContainText('Spent in');
  await expect(page.locator('.money-hero')).toContainText('Days tracked');
  await page.keyboard.press('Control+e');
  await page.click('.cat-pick:has-text("Food")');
  for (const k of ['9', '.', '5', '0']) await page.keyboard.press(k);
  await page.keyboard.press('Enter');
  await expect(page.locator('.money-hero .hero-num')).toContainText('RM 9.50');
});

test('business: buy two, sell one, see profit and Wealth go up', async ({ page }) => {
  await open(page, 'reset=1&seed=fresh');
  await page.evaluate(() => (window as any).__lofi.getState().patch((s: any) => ({ ...s, profile: { ...s.profile, name: 'C', onboarded: true } })));
  await page.click('.nav-item:has-text("Money")');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('button:has-text("Log your first purchase")');
  await page.fill('input[placeholder^="e.g. Funko"]', 'Funko Pop! Groot #49');
  await page.locator('.sheet input[inputmode="decimal"]').first().fill('40');
  await page.click('.sheet .seg-ctl button:has-text("+")');
  await page.click('button:has-text("Add to stock")');
  await expect(page.locator('.stock-card')).toContainText('×2');
  await page.locator('.stock-card button:has-text("Sell")').click();
  await page.locator('.sheet input[inputmode="decimal"]').nth(0).fill('85');
  await page.locator('.sheet input[inputmode="decimal"]').nth(1).fill('7');
  await expect(page.locator('.sheet')).toContainText('+RM 38');
  await page.click('button:has-text("Record sale")');
  await expect(page.locator('.money-hero')).toContainText('RM 38');
  await expect(page.locator('.stock-card')).not.toContainText('×2');
  const wea = await page.evaluate(() => (window as any).__lofi.getState().s.ledger.filter((e: any) => e.stat === 'wea').reduce((n: number, e: any) => n + e.amount, 0));
  expect(wea).toBe(38);
});
