// Full-app sweep: after every interaction, visit every page and assert navigation works,
// no stale/invisible overlays remain, and no runtime errors occurred.
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:5173';
const PAGES = [['My Day', 'My Day'], ['Planned', 'Planned'], ['Habits', 'Habits'], ['Money', 'Money'], ['Insights', 'Insights'], ['Quests', 'Quests'], ['Profile', null], ['Uni', 'Uni'], ['Business', 'Business'], ['Settings', 'Settings']];
const problems = []; const _push = problems.push.bind(problems); problems.push = (...a) => { a.forEach((x) => console.log('  !', x)); return _push(...a); };
(async () => {
  const b = await chromium.launch();
  const PHONE = process.env.VIEWPORT === 'phone';
  const p = await b.newPage(PHONE ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error' && !/favicon|Download the React/.test(m.text())) problems.push(`console: ${m.text().slice(0, 200)}`); });
  await p.goto(`${URL}/?reset=1&seed=demo&view=myday`); await p.waitForTimeout(900);
  const calm = async () => { // dismiss big moments / recap like a person would
    for (let i = 0; i < 4; i++) {
      if (await p.locator('.levelup').isVisible().catch(() => false)) { await p.locator('.levelup').click({ force: true }).catch(() => {}); await p.waitForTimeout(350); continue; }
      if (await p.locator('.recap').isVisible().catch(() => false)) { await p.keyboard.press('Escape'); await p.waitForTimeout(250); continue; }
      break;
    }
  };
  const nav = async (label) => {
    await calm();
    if (!PHONE) { await p.locator('.nav-item', { hasText: new RegExp(`^\\s*${label}`) }).first().click({ timeout: 3000 }); await p.waitForTimeout(260); return; }
    const tab = p.locator('.pn-tab', { hasText: new RegExp(`^\\s*${label}\\s*$`) });
    if (await tab.count()) await tab.first().click({ timeout: 3000 });
    else { await p.locator('.pn-tab', { hasText: 'More' }).click({ timeout: 3000 }); await p.locator('.more-row', { hasText: new RegExp(`^\\s*${label}\\s*$`) }).first().click({ timeout: 3000 }); }
    await p.waitForTimeout(260);
  };
  const navRound = async (after) => {
    for (const [label, h] of PAGES) {
      try {
        await nav(label);
        const pages = await p.locator('.main-scroll').count();
        const h1 = (await p.locator('.main-scroll h1').first().innerText({ timeout: 2000 }).catch(() => '?')).trim();
        if (h && h1 !== h) problems.push(`[after ${after}] nav to ${label}: h1 is "${h1}" (main-scroll count ${pages})`);
        let op = 0;
        for (let k = 0; k < 10 && op < 0.99; k++) { op = Number(await p.evaluate(() => getComputedStyle(document.querySelector('.main-scroll')).opacity)); if (op < 0.99) await p.waitForTimeout(100); }
        if (op < 0.99) problems.push(`[after ${after}] ${label} page invisible (opacity ${op})`);
      } catch (e) { problems.push(`[after ${after}] nav to ${label} failed: ${e.message.split('\n')[0]}`); }
    }
    const modals = await p.locator('.modal').count();
    if (modals) problems.push(`[after ${after}] ${modals} modal(s) left open: ${await p.evaluate(() => [...document.querySelectorAll('.modal')].map((m) => m.className + ' :: ' + (m.textContent || '').slice(0, 50)).join(' || '))}`);
  };
  const step = async (name, fn) => {
    try { await calm(); await fn(); await p.waitForTimeout(450); await calm(); }
    catch (e) { problems.push(`[${name}] action failed: ${e.message.split('\n')[0]}`); await p.keyboard.press('Escape').catch(() => {}); }
    await navRound(name);
    console.log('✓', name, problems.length ? `(problems so far: ${problems.length})` : '');
  };
  const biz = async () => { await nav('Money'); await p.click('.money-tabs button:has-text("Business")'); await p.waitForTimeout(250); };
  const sheetIn = (i) => p.locator('.modal .sheet input[inputmode="decimal"]').nth(i);
  await p.keyboard.press('Escape');

  await step('initial', async () => {});
  await step('business tab', biz);
  await step('buy 3 pieces', async () => { await biz(); await p.click('button:has-text("Bought")'); await p.fill('input[placeholder="Item name"]', 'Sweep Groot'); await sheetIn(0).fill('40'); await p.click('.sheet .seg-ctl button:has-text("+")'); await p.click('.sheet .seg-ctl button:has-text("+")'); await p.click('button:has-text("Add to stock")'); });
  await step('buy into collection', async () => { await biz(); await p.click('button:has-text("Bought")'); await p.click('.sheet button:has-text("For my collection")'); await p.fill('input[placeholder="Item name"]', 'Sweep Keeper'); await sheetIn(0).fill('60'); await p.click('button:has-text("Add to collection")'); });
  await step('sell small with ship', async () => { await biz(); await p.locator('.stock-card', { hasText: 'Sweep Groot' }).locator('button:has-text("Sell")').click(); await sheetIn(0).fill('45'); await p.click('.sheet button:has-text("Carousell")'); await p.click('button:has-text("Record sale")'); });
  await step('sell medium', async () => { await biz(); await p.locator('.stock-card', { hasText: 'Sweep Groot' }).locator('button:has-text("Sell")').click(); await sheetIn(0).fill('70'); await p.click('button:has-text("Record sale")'); });
  await step('sell big', async () => { await biz(); await p.click('button:has-text("Sold")'); await p.locator('.sheet .tl-item', { hasText: 'Sweep Groot' }).first().click(); await sheetIn(0).fill('200'); await p.click('button:has-text("Record sale")'); });
  await step('undo a sale', async () => { await biz(); await p.locator('.tl-item', { hasText: 'sold RM 200' }).first().click(); await p.click('.sheet button:has-text("Undo sale")'); });
  await step('reserve', async () => { await biz(); await p.locator('.stock-card').first().locator('button[title="Reserve for a buyer"]').click(); await sheetIn(0).fill('20'); await sheetIn(1).fill('90'); await p.click('.sheet button:has-text("WhatsApp")'); await p.click('.sheet button:has-text("Reserve"):not(:has-text("for"))'); });
  await step('balance paid', async () => { await biz(); await p.locator('.mcard', { has: p.locator('h3', { hasText: /^Reserved$/ }) }).locator('button:has-text("Paid")').first().click(); await p.click('button:has-text("Complete sale")'); });
  await step('reserve then cancel (kept)', async () => { await biz(); await p.locator('.stock-card').first().locator('button[title="Reserve for a buyer"]').click(); await sheetIn(0).fill('15'); await p.click('.sheet button:has-text("Reserve"):not(:has-text("for"))'); await p.waitForTimeout(300); await p.locator('.mcard', { has: p.locator('h3', { hasText: /^Reserved$/ }) }).locator('.tl-item').last().click(); await p.click('.sheet button:has-text("Cancel reservation")'); await p.click('.sheet button:has-text("I kept the deposit")'); });
  await step('keep a stock piece', async () => { await biz(); await p.locator('.stock-card:not(.kept)').first().click(); await p.click('.sheet button:has-text("Keep it")'); });
  await step('set collection value', async () => { await biz(); await p.locator('.stock-card.kept').first().click(); await sheetIn(1).fill('150'); await p.click('.sheet button:has-text("Save")'); });
  await step('collection back to stock', async () => { await biz(); await p.locator('.stock-card.kept').first().click(); await p.click('.sheet button:has-text("Move to stock")'); });
  await step('other cost', async () => { await biz(); await p.click('button:has-text("Other cost")'); await p.click('.sheet button:has-text("Packaging")'); await sheetIn(0).fill('12'); await p.click('button:has-text("Log cost")'); });
  await step('edit platforms', async () => { await biz(); await p.click('.mcard button:has-text("Edit")'); await p.fill('.sheet input[placeholder="Add a platform"]', 'Shopee'); await p.click('.sheet button:has-text("Add")'); await p.click('.sheet button:has-text("Save")'); });
  await step('delete a piece', async () => { await biz(); await p.locator('.stock-card:not(.kept)', { hasText: 'Hedwig' }).first().click(); await p.click('.sheet button:has-text("Delete")'); });
  await step('search stock', async () => { await biz(); await p.fill('input[placeholder="Search"]', 'zzz'); await p.fill('input[placeholder="Search"]', ''); });
  await step('close sheet with Esc and X', async () => { await biz(); await p.click('button:has-text("Bought")'); await p.keyboard.press('Escape'); await p.waitForTimeout(300); await p.click('button:has-text("Other cost")'); await p.click('.sheet .sheet-h .icon-btn'); });
  await step('personal tab + log expense', async () => { await nav('Money'); await p.click('.money-tabs button:has-text("Personal")'); await p.keyboard.press('Control+e'); await p.waitForTimeout(300); await p.locator('.logsheet .bubble, .sheet .bubble, .cat-pick').first().click().catch(() => {}); await p.keyboard.type('12'); await p.keyboard.press('Enter'); });
  await step('category detail', async () => { await nav('Money'); await p.click('.money-tabs button:has-text("Personal")'); await p.locator('.bubble').first().click(); await p.waitForTimeout(300); await p.keyboard.press('Escape'); await p.locator('.modal .icon-btn').first().click({ timeout: 800 }).catch(() => {}); });
  await step('recap', async () => { await nav('Money'); await p.click('button:has-text("recap")'); await p.waitForTimeout(400); await p.keyboard.press('Escape'); });
  await step('month back', async () => { await nav('Money'); await p.locator('.month-nav .icon-btn').first().click(); await p.click('.money-tabs button:has-text("Business")'); await p.locator('.month-nav .icon-btn').last().click(); });
  await step('quick add + complete', async () => { await nav('My Day'); await p.keyboard.press('Control+Space'); await p.keyboard.type('sweep task #uni'); await p.keyboard.press('Enter'); await p.waitForTimeout(300); await p.locator('.task', { hasText: 'sweep task' }).locator('.check').click(); });
  await step('steps in detail', async () => { await nav('My Day'); await p.locator('.task:not(.done)').first().click(); await p.fill('.step.add input', 'step one'); await p.keyboard.press('Enter'); await p.locator('.steps .step .check').first().click(); await p.locator('.detail .icon-btn[title^="Close"]').click(); });
  await step('start nudge + focus', async () => { await nav('My Day'); const n = p.locator('.start-nudge button:has-text("Start now")'); if (await n.count()) await n.click(); else { await p.locator('.task:not(.done) .focus-btn').first().click(); } await p.waitForTimeout(500); await p.locator('button:has-text("Stop"), .focus button[title*="Stop"]').first().click({ timeout: 2000 }).catch(() => {}); });
  await step('habit tick', async () => { await nav('My Day'); await p.locator('.habit-pill').first().click().catch(() => {}); });
  await step('habits page tick', async () => { await nav('Habits'); await p.locator('.check').first().click().catch(() => {}); });
  await step('insights tabs', async () => { await nav('Insights'); await p.click('button:has-text("Productivity")'); await p.click('button:has-text("Where money goes")'); });
  await step('quests reroll', async () => { await nav('Quests'); await p.locator('button:has-text("Reroll"), button[title*="eroll"]').first().click({ timeout: 1000 }).catch(() => {}); });
  await step('settings tabs', async () => { await nav('Settings'); for (const t of ['General', 'Appearance', 'Money', 'Sync', 'Data']) await p.click(`.seg-ctl button:has-text("${t}")`).catch(() => problems.push(`settings tab ${t} missing`)); });
  await step('theme switch', async () => { await nav('Settings'); await p.click('.seg-ctl button:has-text("Appearance")'); await p.locator('.theme-tile, [data-theme]').nth(2).click({ timeout: 1000 }).catch(() => {}); });
  await step('rapid nav spam', async () => { for (let i = 0; i < 3; i++) for (const [l] of PAGES) { if (PHONE) await nav(l); else await p.locator('.nav-item', { hasText: new RegExp(`^\\s*${l}`) }).first().click(); } });
  await step('rapid tab spam', async () => { await nav('Money'); for (let i = 0; i < 6; i++) { await p.click('.money-tabs button:has-text("Business")'); await p.click('.money-tabs button:has-text("Personal")'); } });

  // data checks: what the business actions should have produced
  const st = await p.evaluate(() => { const s = window.__lofi.getState().s; return { items: s.business.items.map((i) => [i.name, i.status, i.valueSen ?? null, i.platform ?? null]), income: s.business.income.map((e) => e.label), costs: s.business.expenses.map((e) => e.label), platforms: s.business.platforms, ship: s.tasks.filter((t) => t.link?.kind === 'biz-ship').length, collect: s.tasks.filter((t) => t.link?.kind === 'biz-collect').map((t) => !!t.doneAt) }; });
  const has = (cond, msg) => { if (!cond) problems.push(`data: ${msg}`); };
  has(st.items.some(([n, s, , pl]) => n === 'Sweep Groot' && s === 'sold' && pl === 'Carousell'), 'Carousell sale of Sweep Groot missing');
  has(st.items.some(([, s, v]) => s === 'stock' && v === 15000), 'collection value RM150 not kept when moved back to stock');
  has(st.income.some((l) => l.startsWith('Kept deposit')), 'kept deposit not recorded');
  has(st.costs.includes('Packaging'), 'packaging cost missing');
  has(st.platforms.includes('Shopee'), 'Shopee platform not saved');
  has(st.ship >= 1, 'no Ship task');
  has(st.collect.some((d) => d), 'collect task not completed on Paid');
  console.log('state:', JSON.stringify(st).slice(0, 600));
  console.log('\n==== PROBLEMS:', problems.length);
  for (const x of [...new Set(problems)]) console.log(' -', x);
  await b.close();
  process.exit(problems.length ? 1 : 0);
})();
