import { test as base, expect, type Page } from '@playwright/test';

// Pages you've visited stay alive (hidden) so switching back is instant. Tests mean "what's on screen",
// so every page-level selector here only matches visible elements.
const vis = (sel: string) => (sel.includes('visible=') ? sel : `${sel} >> visible=true`);
const test = base.extend({
  page: async ({ page }, use) => {
    const loc = page.locator.bind(page), click = page.click.bind(page), fill = page.fill.bind(page);
    (page as any).locator = (sel: string, o?: any) => loc(vis(sel), o);
    (page as any).click = (sel: string, o?: any) => click(vis(sel), o);
    (page as any).fill = (sel: string, v: string, o?: any) => fill(vis(sel), v, o);
    await use(page);
  },
});

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

test('business: buy two, sell one; Wealth follows the cash (−80 bought, +78 received)', async ({ page }) => {
  await open(page, 'reset=1&seed=fresh');
  await page.evaluate(() => (window as any).__lofi.getState().patch((s: any) => ({ ...s, profile: { ...s.profile, name: 'C', onboarded: true } })));
  await page.click('.nav-item:has-text("Money")');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('button:has-text("Log your first purchase")');
  await page.fill('input[placeholder="Item name"]', 'Funko Pop! Groot #49');
  await page.locator('.sheet input[inputmode="decimal"]').first().fill('40');
  await page.click('.sheet .seg-ctl button:has-text("+")');
  await page.click('button:has-text("Add to stock")');
  await expect(page.locator('.modal')).toHaveCount(0);
  await expect(page.locator('.stock-card')).toContainText('×2');
  await page.locator('.stock-card button:has-text("Sell")').click();
  await page.locator('.sheet input[inputmode="decimal"]').nth(0).fill('85');
  await page.locator('.sheet input[inputmode="decimal"]').nth(1).fill('7');
  await expect(page.locator('.sheet')).toContainText('+RM 38');
  await page.click('button:has-text("Record sale")');
  await expect(page.locator('.money-hero')).toContainText('RM 38');
  await expect(page.locator('.stock-card')).not.toContainText('×2');
  const wea = await page.evaluate(() => (window as any).__lofi.getState().s.ledger.filter((e: any) => e.stat === 'wea' && !e.reversed && e.source !== 'reverse').reduce((n: number, e: any) => n + e.amount, 0));
  expect(wea).toBe(-2);
  // the Ship task was created in the Business list
  await expect(page.locator('.nav-item:has-text("Business")')).toBeVisible();
});

const fresh = async (page: any) => {
  await open(page, 'reset=1&seed=fresh');
  await page.evaluate(() => (window as any).__lofi.getState().patch((s: any) => ({ ...s, profile: { ...s.profile, name: 'C', onboarded: true } })));
};

test('reservation: deposit, then balance paid becomes a sale; a big profit shows the moment', async ({ page }) => {
  await fresh(page);
  await page.click('.nav-item:has-text("Money")');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('button:has-text("Log your first purchase")');
  await page.fill('input[placeholder="Item name"]', 'Stitch #1045');
  await page.locator('.sheet input[inputmode="decimal"]').first().fill('42');
  await page.click('button:has-text("Add to stock")');
  await expect(page.locator('.modal')).toHaveCount(0);
  await page.locator('.stock-card button[title="Reserve for a buyer"]').click();
  await page.locator('.sheet input[inputmode="decimal"]').nth(0).fill('20');
  await page.locator('.sheet input[inputmode="decimal"]').nth(1).fill('100');
  await page.click('.sheet button:has-text("WhatsApp")');
  await page.click('.sheet button:has-text("Reserve"):not(:has-text("for"))');
  await expect(page.locator('.mcard', { has: page.locator('h3', { hasText: /^Reserved$/ }) })).toContainText('Deposit RM 20 of RM 100');
  await expect(page.locator('.money-hero')).toContainText('RM 0');
  await page.locator('.mcard', { has: page.locator('h3', { hasText: /^Reserved$/ }) }).locator('button:has-text("Paid")').click();
  await expect(page.locator('.sheet input[inputmode="decimal"]').first()).toHaveValue('80');
  await expect(page.locator('.sheet')).toContainText('+RM 58');
  await page.click('button:has-text("Complete sale")');
  await expect(page.locator('.levelup')).toContainText('+RM 58');
  await page.keyboard.press('Space');
  await expect(page.locator('.money-hero')).toContainText('RM 58');
});

test('steps: add steps in the detail panel, tick one, the row shows 1/2', async ({ page }) => {
  await fresh(page);
  await page.keyboard.press('Control+Space');
  await page.keyboard.type('Lab report #uni');
  await page.keyboard.press('Enter');
  await page.locator('.task', { hasText: 'Lab report' }).click();
  await page.fill('.step.add input', 'Collect data');
  await page.keyboard.press('Enter');
  await page.fill('.step.add input', 'Write discussion');
  await page.keyboard.press('Enter');
  await page.locator('.steps .step .check').first().click();
  await expect(page.locator('.task', { hasText: 'Lab report' }).locator('.steps-chip')).toContainText('1/2');
});

test('after recording a sale the app stays clickable (no invisible window left behind)', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=money');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.click('.money-tabs button:has-text("Business")');
  for (const price of ['55', '60']) {
    await page.locator('.stock-card button:has-text("Sell")').first().click();
    await page.locator('.sheet input[inputmode="decimal"]').first().fill(price);
    await page.click('button:has-text("Record sale")');
    await expect(page.locator('.modal')).toHaveCount(0, { timeout: 3000 });
  }
  await page.locator('.nav-item:has-text("My Day")').click({ timeout: 3000 });
  await expect(page.locator('h1')).toHaveText('My Day');
});

test('switching Money tabs never freezes navigation', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=money');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('.money-tabs button:has-text("Personal")');
  await page.click('.money-tabs button:has-text("Business")');
  await page.locator('.nav-item:has-text("Insights")').click();
  await expect(page.locator('h1')).toHaveText('Insights');
  await page.locator('.nav-item:has-text("My Day")').click();
  await expect(page.locator('h1')).toHaveText('My Day');
});

test('catalogue mode: Enter adds a piece and starts the next one; known names prefill the cost', async ({ page }) => {
  await open(page, 'reset=1&seed=fresh');
  await page.evaluate(() => (window as any).__lofi.getState().patch((s: any) => ({ ...s, profile: { ...s.profile, name: 'C', onboarded: true } })));
  await page.click('.nav-item:has-text("Money")');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('button:has-text("Log your first purchase")');
  const name = page.locator('input[placeholder="Item name"]');
  const cost = page.locator('.sheet input[inputmode="decimal"]').first();
  await name.fill('Groot #49'); await cost.fill('40'); await page.keyboard.press('Enter');
  await expect(page.locator('.sheet .chip.ok')).toContainText('1 added');
  await expect(name).toBeFocused();
  await name.fill('Hedwig #76'); await cost.fill('39'); await page.keyboard.press('Enter');
  await name.fill('Groot #49');
  await expect(cost).toHaveValue('40');
  await page.keyboard.press('Enter');
  await expect(page.locator('.sheet .chip.ok')).toContainText('3 added');
  await page.click('.sheet button:has-text("Done")');
  await expect(page.locator('.modal')).toHaveCount(0);
  await expect(page.locator('.stock-card', { hasText: 'Groot #49' })).toContainText('×2');
  await expect(page.locator('.stock-card', { hasText: 'Hedwig #76' })).toBeVisible();
  // leaving and coming back keeps the Business tab
  await page.click('.nav-item:has-text("My Day")');
  await page.click('.nav-item:has-text("Money")');
  await expect(page.locator('.money-tabs button.on')).toHaveText('Business');
});

test('free pieces: tap Free, add to stock and collection, selling one counts the full price as profit', async ({ page }) => {
  await open(page, 'reset=1&seed=fresh');
  await page.evaluate(() => (window as any).__lofi.getState().patch((s: any) => ({ ...s, profile: { ...s.profile, name: 'C', onboarded: true } })));
  await page.click('.nav-item:has-text("Money")');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('button:has-text("Log your first purchase")');
  await page.fill('input[placeholder="Item name"]', 'Gift Groot');
  await page.click('.sheet button:has-text("Free")');
  await expect(page.locator('.sheet')).toContainText('Nothing comes off your Wealth');
  await page.keyboard.press('Enter');
  await expect(page.locator('.sheet .chip.ok')).toContainText('1 added');
  await page.click('.sheet button:has-text("For my collection")');
  await page.fill('input[placeholder="Item name"]', 'Birthday Kiki');
  await page.locator('.sheet input[inputmode="decimal"]').first().fill('0');
  await page.click('.sheet button:has-text("Add to collection")');
  await expect(page.locator('.modal')).toHaveCount(0);
  await expect(page.locator('.stock-card', { hasText: 'Gift Groot' })).toContainText('Free');
  await expect(page.locator('.stock-card.kept', { hasText: 'Birthday Kiki' })).toContainText('Free');
  await page.locator('.stock-card', { hasText: 'Gift Groot' }).locator('button:has-text("Sell")').click();
  await page.locator('.sheet input[inputmode="decimal"]').first().fill('35');
  await expect(page.locator('.sheet')).toContainText('+RM 35');
  await page.click('button:has-text("Record sale")');
  await expect(page.locator('.money-hero')).toContainText('RM 35');
});

test('search boxes have an × that clears the search in one click', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=money');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.click('.money-tabs button:has-text("Business")');
  const search = page.locator('.mcard .search-field input');
  await expect(page.locator('.mcard .search-field .search-clear')).toHaveCount(0);
  await search.fill('zzzz');
  await expect(page.locator('.mcard', { hasText: 'Nothing matches.' }).first()).toBeVisible();
  await page.locator('.mcard .search-field .search-clear').click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(page.locator('.stock-card').first()).toBeVisible();
  // in the picker: × clears, and Esc with text clears instead of closing the window
  await page.click('button:has-text("Sold")');
  const ps = page.locator('.sheet .search-field input');
  await ps.fill('zzzz');
  await page.locator('.sheet .search-field .search-clear').click();
  await expect(ps).toHaveValue('');
  await ps.fill('zzzz');
  await page.keyboard.press('Escape');
  await expect(ps).toHaveValue('');
  await expect(page.locator('.modal')).toHaveCount(1);
});

test('sync settings: create account, see synced status, sign out, wrong password is explained', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=settings&syncfake=1');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.click('.seg-ctl button:has-text("Sync")');
  await expect(page.locator('.sync-card')).toContainText('Sign in to sync');
  await page.click('button:has-text("First time? Create an account")');
  await page.fill('.sync-card input[type="email"]', 'chloe@example.com');
  await page.fill('.sync-card input[type="password"]', 'secret1');
  await page.click('.sync-card button:has-text("Create account")');
  await expect(page.locator('.sync-card')).toContainText('chloe@example.com');
  await expect(page.locator('.sync-card')).toContainText('Up to date', { timeout: 8000 });
  await page.click('.sync-card button:has-text("Sign out")');
  await page.fill('.sync-card input[type="email"]', 'chloe@example.com');
  await page.fill('.sync-card input[type="password"]', 'wrong-pw');
  await page.click('.sync-card button:has-text("Sign in")');
  await expect(page.locator('.sync-card')).toContainText('don’t match');
  await page.fill('.sync-card input[type="password"]', 'secret1');
  await page.click('.sync-card button:has-text("Sign in")');
  await expect(page.locator('.sync-card')).toContainText('Synced with your account');
});

test('business money: set the TnG balance, a TnG lunch takes from it, cash does not, moving money in adds to it', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=money');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.click('.money-tabs button:has-text("Business")');
  await page.click('button:has-text("Set my TnG balance")');
  await page.fill('.sheet input', '342.50');
  await page.click('.sheet button:has-text("Set balance")');
  await expect(page.locator('.biz-money .hero-num')).toHaveText('RM 342.50');
  const log = async (amt: string, wallet: 'Cash' | 'TnG') => {
    await page.keyboard.press('Control+e');
    await page.locator('.sheet .cat-pick').first().click();
    for (const k of amt) await page.keyboard.press(k);
    await page.click(`.wallet-pick button:has-text("${wallet}")`);
    await page.locator('.sheet .btn.primary.lg').click();
    await expect(page.locator('.modal')).toHaveCount(0);
  };
  await log('12', 'TnG');
  await expect(page.locator('.biz-money .hero-num')).toHaveText('RM 330.50');
  await log('20', 'Cash');
  await expect(page.locator('.biz-money .hero-num')).toHaveText('RM 330.50');
  await expect(page.locator('.biz-money')).toContainText('Taken out for you');
  await expect(page.locator('.biz-money .bm-row', { hasText: 'Taken out for you' })).toContainText('RM 12');
  await page.click('.biz-money button:has-text("Move money")');
  await page.fill('.sheet input[inputmode="decimal"]', '50');
  await page.click('.sheet .btn.primary.lg');
  await expect(page.locator('.biz-money .hero-num')).toHaveText('RM 380.50');
  // the next expense remembers TnG
  await page.keyboard.press('Control+e');
  await expect(page.locator('.wallet-pick button.on')).toHaveText(/Cash/); // last used was cash
  await page.keyboard.press('Escape');
  // the Personal tab shows where spending came from
  await page.click('.money-tabs button:has-text("Personal")');
  await expect(page.locator('.wallet-split')).toContainText('Business money (TnG)');
});

test('undo: logging money, ticking a task and selling a piece can each be undone in one tap', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=myday');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  const state = () => page.evaluate(() => (window as any).__lofi.getState().s);
  // tick a task, then undo
  const n0 = (await state()).tasks.filter((t: any) => t.doneAt).length;
  await page.locator('.main-scroll .tasks .task:not(.done) .check').first().click();
  await expect(page.locator('.undo-toast')).toContainText('Ticked off');
  await page.click('.undo-btn');
  await expect(page.locator('.undo-toast')).toHaveCount(0);
  expect((await state()).tasks.filter((t: any) => t.doneAt).length).toBe(n0);
  // log money, then undo with Ctrl+Z
  const e0 = (await state()).money.entries.length;
  await page.keyboard.press('Control+e');
  await page.locator('.sheet .cat-pick').first().click();
  await page.keyboard.press('7');
  await page.locator('.sheet .btn.primary.lg').click();
  await expect(page.locator('.undo-toast')).toContainText('Logged RM 7');
  expect((await state()).money.entries.length).toBe(e0 + 1);
  await page.keyboard.press('Control+z');
  await expect.poll(async () => (await state()).money.entries.length).toBe(e0);
  // sell a piece, then undo
  await page.click('.nav-item:has-text("Money")');
  await page.click('.money-tabs button:has-text("Business")');
  const sold0 = (await state()).business.items.filter((i: any) => i.status === 'sold').length;
  await page.click('button:has-text("Sold")');
  await page.locator('.sheet .tl-item').first().click();
  await page.locator('.sheet input[inputmode="decimal"]').first().fill('90');
  await page.click('button:has-text("Record sale")');
  await expect(page.locator('.undo-toast')).toContainText('Sold');
  await page.click('.undo-btn');
  await expect.poll(async () => (await state()).business.items.filter((i: any) => i.status === 'sold').length).toBe(sold0);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('tab bar instead of sidebar; + → Sold records a sale; level tab → Settings', async ({ page }) => {
    await open(page, 'reset=1&seed=demo&view=myday');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
    await expect(page.locator('.phone-nav')).toBeVisible();
    await expect(page.locator('.sidebar')).toHaveCount(0);
    await page.locator('.pn-plus').click();
    await page.locator('.qa-btn', { hasText: 'Sold' }).click();
    await page.locator('.sheet .tl-item').first().click();
    await page.locator('.sheet input[inputmode="decimal"]').first().fill('60');
    await page.locator('.sheet button:has-text("Carousell")').click();
    await page.locator('button:has-text("Record sale")').click();
    await expect(page.locator('.modal')).toHaveCount(0);
    const sold = await page.evaluate(() => (window as any).__lofi.getState().s.business.items.filter((i: any) => i.status === 'sold' && i.platform === 'Carousell' && i.soldSen === 6000).length);
    expect(sold).toBe(1);
    if (await page.locator('.levelup').isVisible().catch(() => false)) await page.locator('.levelup').click();
    await page.locator('.pn-me').click();
    await page.locator('.more-row', { hasText: 'Settings' }).click();
    await expect(page.locator('.main-scroll h1')).toHaveText('Settings');
    await page.locator('.pn-tab', { hasText: 'Money' }).click();
    await expect(page.locator('.main-scroll h1')).toHaveText('Money');
  });
  test('pages stay ready: fresh data when you come back, scroll kept, tap the tab again for the top', async ({ page }) => {
    await open(page, 'reset=1&seed=demo&view=myday');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
    await page.waitForTimeout(3500); // Money, Insights and Planned get prepared in the background
    expect(await page.evaluate(() => [...document.querySelectorAll('.page-kept')].map((e) => (e as HTMLElement).dataset.view).sort())).toEqual(['insights', 'money', 'planned']);
    // change data while Planned is hidden; it must show the change when opened
    await page.evaluate(() => { const st = (window as any).__lofi.getState(); st.patch((s: any) => ({ ...s, tasks: [...s.tasks, { ...s.tasks.find((t: any) => t.due && !t.done), id: 'fresh1', title: 'Fresh while hidden', done: false }] })); });
    await page.locator('.pn-me').tap();
    await page.locator('.more-row', { hasText: 'Planned' }).tap();
    await expect(page.locator('.main-scroll .task-title', { hasText: 'Fresh while hidden' })).toBeVisible();
    // scroll position is kept per page
    await page.locator('.pn-tab', { hasText: 'Money' }).tap();
    await expect(page.locator('.main-scroll h1')).toHaveText('Money');
    await page.evaluate(() => document.querySelector('.main-scroll')!.scrollTo(0, 500));
    await page.locator('.pn-tab', { hasText: 'My Day' }).tap();
    await expect(page.locator('.main-scroll h1')).toHaveText('My Day');
    await page.locator('.pn-tab', { hasText: 'Money' }).tap();
    await expect(page.locator('.main-scroll h1')).toHaveText('Money');
    expect(await page.evaluate(() => document.querySelector('.main-scroll')!.scrollTop)).toBeGreaterThan(400);
    // tapping the tab you're on goes back to the top
    await page.locator('.pn-tab', { hasText: 'Money' }).tap();
    await expect.poll(() => page.evaluate(() => document.querySelector('.main-scroll')!.scrollTop)).toBeLessThan(5);
    // Personal / Business both stay ready
    await page.locator('.money-tabs button', { hasText: 'Business' }).tap();
    await page.locator('.money-tabs button', { hasText: 'Personal' }).tap();
    await expect(page.locator('.money-hero')).toBeVisible();
  });
  test('juice: swipe right ticks a task off; a tick shows its effects and the XP lands; Reduced motion keeps it calm', async ({ page }) => {
    await open(page, 'reset=1&seed=demo&view=myday');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
    // tap the check: ripple + flying XP appear, then the task really is done
    const before = await xp(page);
    const first = page.locator('.main-scroll .tasks .task:not(.done)').first();
    const title = await first.locator('.task-title').textContent();
    await first.locator('.check').tap();
    await expect(page.locator('.fx-ripple')).toHaveCount(1);
    await expect(page.locator('.fx-fly')).toHaveCount(1, { timeout: 2000 });
    await expect.poll(() => xp(page)).toBeGreaterThan(before);
    await expect.poll(() => page.evaluate((t) => (window as any).__lofi.getState().s.tasks.find((x: any) => x.title === t)?.doneAt != null, title)).toBe(true);
    // swipe the next one to the right
    const row = page.locator('.main-scroll .tasks .task:not(.done)').first();
    const t2 = await row.locator('.task-title').textContent();
    const bx = (await row.boundingBox())!;
    const y = bx.y + bx.height / 2;
    await page.mouse.move(bx.x + 40, y); await page.mouse.down();
    for (let i = 1; i <= 10; i++) await page.mouse.move(bx.x + 40 + i * 16, y);
    await page.mouse.up();
    await expect.poll(() => page.evaluate((t) => (window as any).__lofi.getState().s.tasks.find((x: any) => x.title === t)?.doneAt != null, t2)).toBe(true);
    await expect(page.locator('.detail')).toHaveCount(0); // a swipe never opens the task
    // Reduced motion: no ripples or flying XP, and the tick commits at once
    await page.evaluate(() => (window as any).__lofi.getState().setSettings({ reducedMotion: true }));
    await page.waitForTimeout(800);
    const t3 = await page.locator('.main-scroll .tasks .task:not(.done) .task-title').first().textContent();
    await page.locator('.main-scroll .tasks .task:not(.done) .check').first().tap();
    expect(await page.evaluate((t) => (window as any).__lofi.getState().s.tasks.find((x: any) => x.title === t)?.doneAt != null, t3)).toBe(true);
    expect(await page.locator('.fx-ripple, .fx-fly').count()).toBe(0);
  });
  test('nothing is wider than the screen; settings tabs all reachable; desktop-only settings hidden', async ({ page }) => {
    await open(page, 'reset=1&seed=demo&view=myday');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
    const tooWide = () => page.evaluate(() => [...document.querySelectorAll('.main-scroll *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1 && !e.closest('.settings-tabs, .seg-ctl, .chart-scroll'); }).map((e) => e.className).slice(0, 5));
    for (const [v, h] of [['myday', 'My Day'], ['planned', 'Planned'], ['habits', 'Habits'], ['money', 'Money'], ['insights', 'Insights'], ['quests', 'Quests'], ['profile', 'Chloe'], ['settings', 'Settings']]) {
      await page.evaluate((v) => (window as any).__lofi.getState().go(v), v);
      await expect(page.locator('.main-scroll h1')).toHaveText(h);
      await page.waitForTimeout(250);
      expect(await tooWide(), v).toEqual([]);
      if (v === 'habits') expect(await page.locator('.habit-card > div:nth-child(2)').first().evaluate((e) => e.getBoundingClientRect().width)).toBeGreaterThan(200);
    }
    await expect(page.locator('.settings-tabs button', { hasText: 'Music' })).toHaveCount(0);
    await expect(page.locator('text=Start with Windows')).toHaveCount(0);
    for (const t of ['Appearance', 'Money', 'Sync', 'Data']) {
      await page.locator('.settings-tabs button', { hasText: t }).click();
      expect(await page.evaluate(() => document.querySelector('.main-scroll')!.scrollLeft)).toBe(0);
      expect(await tooWide(), t).toEqual([]);
    }
    await expect(page.locator('text=%APPDATA%')).toHaveCount(0);
  });
});

test.describe('iPhone first run', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('a new phone asks to sign in first; "Use without syncing" goes to the welcome', async ({ page }) => {
    await page.goto('/?reset=1&syncfake=1');
    await expect(page.locator('.first-screen')).toContainText('Sign in to sync');
    await page.click('button:has-text("Use without syncing")');
    await expect(page.locator('.onb, .onb-name').first()).toBeVisible();
  });
});

test('custom dropdowns: pick with the mouse, the keyboard, and close with Esc without closing the panel', async ({ page }) => {
  await open(page, 'reset=1&seed=demo&view=myday');
  for (let i = 0; i < 3; i++) await page.keyboard.press('Escape');
  await page.locator('.task:not(.done)').first().click();
  const list = page.locator('.detail .dd[aria-label="List"]');
  await list.click();
  await expect(page.locator('.dd-menu')).toBeVisible();
  await page.locator('.dd-menu .dd-opt', { hasText: 'Fitness' }).click();
  await expect(list).toContainText('Fitness');
  await expect(page.locator('.dd-menu')).toHaveCount(0);
  // keyboard: open, type to jump, Enter
  await list.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.type('soc');
  await page.keyboard.press('Enter');
  await expect(list).toContainText('Social');
  // Esc closes only the menu
  await list.click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dd-menu')).toHaveCount(0);
  await expect(page.locator('.detail')).toBeVisible();
  // repeat dropdown
  await page.locator('.detail .dd[aria-label="Repeat"]').click();
  await page.locator('.dd-menu .dd-opt', { hasText: 'Weekdays' }).click();
  await expect(page.locator('.detail .dd[aria-label="Repeat"]')).toContainText('Weekdays');
});
