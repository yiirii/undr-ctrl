import { describe, test, expect } from 'vitest';
import { initialState, migrate } from './state';
import * as L from './logic';
import { deriveProgress } from '../core/ledger';
import { bizMonth, platformMonth, stockSummary, collectionSummary } from '../core/business';

const NOW = new Date(2026, 10, 3, 10, 0);
// Give Wealth a big cushion so the 0-floor never hides a movement.
const base = () => {
  const s = L.rollover(initialState('Chloe'), NOW).state;
  return { ...s, ledger: [...s.ledger, { id: 'cushion', at: '2026-01-01T00:00:00.000Z', source: 'drip', stat: 'wea' as const, amount: 1000, lifetime: false, ref: 'cushion' }] };
};
const wea = (s: ReturnType<typeof base>) => deriveProgress(s.ledger).statXp.wea - 1000;
const buy = (s: ReturnType<typeof base>, o: Partial<{ costSen: number; qty: number; kept: boolean; name: string }> = {}) =>
  L.addBizItems(s, { name: o.name ?? 'Groot #49', costSen: o.costSen ?? 4000, qty: o.qty ?? 1, boughtOn: '2026-11-01', kept: o.kept }, NOW).state;

describe('cash-flow Wealth', () => {
  test('buying for stock lowers Wealth by the cost', () => {
    expect(wea(buy(base(), { qty: 2 }))).toBe(-80);
  });
  test('buying for the collection also lowers Wealth', () => {
    const s = buy(base(), { kept: true });
    expect(s.business.items[0].status).toBe('kept');
    expect(wea(s)).toBe(-40);
  });
  test('selling raises Wealth by what you received; over the life of a piece Wealth moves by the profit', () => {
    let s = buy(base());
    s = L.sellBizItem(s, s.business.items[0].id, { soldSen: 8500, feesSen: 700, soldOn: '2026-11-03', platform: 'Carousell' }, NOW).state;
    expect(wea(s)).toBe(38); // -40 + 78
    expect(s.business.items[0].platform).toBe('Carousell');
  });
  test('undoing a sale removes only the sale; the purchase still counts', () => {
    let s = buy(base());
    const id = s.business.items[0].id;
    s = L.sellBizItem(s, id, { soldSen: 8500, soldOn: '2026-11-03' }, NOW).state;
    s = L.unsellBizItem(s, id, NOW).state;
    expect(s.business.items[0].status).toBe('stock');
    expect(wea(s)).toBe(-40);
  });
  test('editing the cost of a piece re-applies its purchase', () => {
    let s = buy(base());
    s = L.editBizItem(s, s.business.items[0].id, { costSen: 5000 }, NOW).state;
    expect(wea(s)).toBe(-50);
  });
  test('deleting a piece removes every Wealth effect it had', () => {
    let s = buy(base());
    const id = s.business.items[0].id;
    s = L.sellBizItem(s, id, { soldSen: 8500, soldOn: '2026-11-03' }, NOW).state;
    s = L.deleteBizItem(s, id, NOW).state;
    expect(wea(s)).toBe(0);
  });
  test('selling a piece straight from the collection works and profit is against its cost', () => {
    let s = buy(base(), { kept: true });
    s = L.sellBizItem(s, s.business.items[0].id, { soldSen: 10000, soldOn: '2026-11-03' }, NOW).state;
    expect(bizMonth(s.business.items, [], '2026-11', []).profitSen).toBe(6000);
    expect(wea(s)).toBe(60);
  });
});

describe('collection', () => {
  test('moving between stock and collection does not touch Wealth or profit', () => {
    let s = buy(base());
    const id = s.business.items[0].id;
    s = L.keepBizItem(s, id).state;
    expect(s.business.items[0].status).toBe('kept');
    s = L.unkeepBizItem(s, id).state;
    expect(s.business.items[0].status).toBe('stock');
    expect(wea(s)).toBe(-40);
  });
  test('value estimate and collection summary', () => {
    let s = buy(base(), { kept: true, qty: 2 });
    s = L.setBizValue(s, s.business.items[0].id, 9000, NOW).state;
    const c = collectionSummary(s.business.items);
    expect(c.count).toBe(2);
    expect(c.costSen).toBe(8000);
    expect(c.valueSen).toBe(9000 + 4000); // unvalued pieces count at cost
    expect(c.gainSen).toBe(5000);
    expect(s.business.items[0].valueOn).toBe('2026-11-03');
  });
});

describe('reservations (deposit required)', () => {
  const reserved = () => {
    let s = buy(base());
    const id = s.business.items[0].id;
    s = L.reserveBizItem(s, id, { depositSen: 2000, dueOn: '2026-11-10', platform: 'WhatsApp' }, NOW).state;
    return { s, id };
  };
  test('reserving holds the piece, takes the deposit as cash and creates a collect-balance task', () => {
    const { s, id } = reserved();
    const it = s.business.items.find((i) => i.id === id)!;
    expect(it.status).toBe('reserved');
    expect(wea(s)).toBe(-40 + 20);
    expect(stockSummary(s.business.items, '2026-11-03').count).toBe(0);
    expect(stockSummary(s.business.items, '2026-11-03').depositsHeldSen).toBe(2000);
    const t = s.tasks.find((x) => x.link?.itemId === id)!;
    expect(t.title).toBe('Collect balance: Groot #49');
    expect(t.due).toBe('2026-11-10');
    expect(s.lists.some((l) => l.id === t.listId && l.name === 'Business')).toBe(true);
  });
  test('a deposit is not profit', () => {
    const { s } = reserved();
    expect(bizMonth(s.business.items, [], '2026-11', s.business.income).profitSen).toBe(0);
  });
  test('balance paid turns it into a sale of deposit + balance and completes the task', () => {
    let { s, id } = reserved();
    s = L.completeReservation(s, id, { balanceSen: 6500, feesSen: 0, soldOn: '2026-11-08' }, NOW).state;
    const it = s.business.items.find((i) => i.id === id)!;
    expect(it.status).toBe('sold');
    expect(it.soldSen).toBe(8500);
    expect(it.platform).toBe('WhatsApp');
    expect(wea(s)).toBe(45 + 13); // +45 cash over the piece's life, +13 for finishing the Quick 'Collect balance' task on time (Business list levels Wealth)
    expect(s.tasks.find((x) => x.link?.itemId === id && x.link.kind === 'biz-collect')!.doneAt).toBeTruthy();
  });
  test('cancel with deposit refunded: back to stock, deposit gone, task removed', () => {
    let { s, id } = reserved();
    s = L.cancelReservation(s, id, { keepDeposit: false }, NOW).state;
    expect(s.business.items[0].status).toBe('stock');
    expect(wea(s)).toBe(-40);
    expect(s.tasks.some((x) => x.link?.itemId === id)).toBe(false);
  });
  test('cancel with deposit kept: back to stock, deposit counts as business income (profit)', () => {
    let { s, id } = reserved();
    s = L.cancelReservation(s, id, { keepDeposit: true }, NOW).state;
    expect(s.business.items[0].status).toBe('stock');
    expect(wea(s)).toBe(-20);
    expect(s.business.income[0].label).toBe('Kept deposit: Groot #49');
    expect(bizMonth(s.business.items, [], '2026-11', s.business.income).profitSen).toBe(2000);
  });
  test('deposit must be more than zero', () => {
    const s = buy(base());
    expect(L.reserveBizItem(s, s.business.items[0].id, { depositSen: 0, dueOn: '2026-11-10' }, NOW).state).toBe(s);
  });
});

describe('platforms and linked ship task', () => {
  test('profit per platform this month', () => {
    let s = buy(base(), { qty: 3 });
    const [a, b, c] = s.business.items.map((i) => i.id);
    s = L.sellBizItem(s, a, { soldSen: 8000, soldOn: '2026-11-02', platform: 'Carousell' }, NOW).state;
    s = L.sellBizItem(s, b, { soldSen: 6000, soldOn: '2026-11-02', platform: 'Carousell' }, NOW).state;
    s = L.sellBizItem(s, c, { soldSen: 5000, soldOn: '2026-11-02', platform: 'Threads' }, NOW).state;
    const p = platformMonth(s.business.items, '2026-11');
    expect(p[0]).toMatchObject({ platform: 'Carousell', count: 2, salesSen: 14000, profitSen: 6000 });
    expect(p[1]).toMatchObject({ platform: 'Threads', count: 1, profitSen: 1000 });
  });
  test('a sale that needs shipping creates a Ship task due tomorrow; undoing the sale removes it', () => {
    let s = buy(base());
    const id = s.business.items[0].id;
    s = L.sellBizItem(s, id, { soldSen: 8000, soldOn: '2026-11-03', platform: 'Carousell', ship: true }, NOW).state;
    const t = s.tasks.find((x) => x.link?.kind === 'biz-ship')!;
    expect(t.title).toBe('Ship Groot #49');
    expect(t.due).toBe('2026-11-04');
    s = L.unsellBizItem(s, id, NOW).state;
    expect(s.tasks.some((x) => x.link?.kind === 'biz-ship')).toBe(false);
  });
  test('default platforms', () => {
    expect(initialState().business.platforms).toEqual(['Carousell', 'Threads', 'Facebook Marketplace', 'WhatsApp']);
  });
});

describe('migration to cash-flow Wealth', () => {
  test('old data: purchases get a cost entry, old profit entries become revenue, bookkeeping XP stays', () => {
    let s = base();
    // old-style data: one sold item whose sale gave +38 profit, one item in stock, bookkeeping referencing the first item
    s = {
      ...s,
      business: { ...s.business, items: [
        { id: 'a', name: 'Groot', costSen: 4000, boughtOn: '2026-10-01', status: 'sold', soldSen: 8500, feesSen: 700, soldOn: '2026-10-05' },
        { id: 'b', name: 'Hedwig', costSen: 3000, boughtOn: '2026-10-02', status: 'stock' },
      ] } as any,
      ledger: [...s.ledger,
        { id: 'x1', at: '2026-10-05T00:00:00.000Z', source: 'biz-sale', stat: 'wea', amount: 38, lifetime: false, ref: 'a' },
        { id: 'x2', at: '2026-10-01T00:00:00.000Z', source: 'bookkeeping', stat: null, amount: 2, lifetime: true, ref: 'a' }],
      bizVersion: undefined,
    } as any;
    const m = migrate(JSON.parse(JSON.stringify(s)));
    // Groot: -40 + 78 = +38 ; Hedwig: -30  => 8
    expect(deriveProgress(m.ledger).statXp.wea - 1000).toBe(8);
    expect(deriveProgress(m.ledger).lifetime).toBe(deriveProgress(s.ledger).lifetime);
    // idempotent
    const again = migrate(JSON.parse(JSON.stringify(m)));
    expect(again.ledger.length).toBe(m.ledger.length);
  });
});

describe('undo is exact even at the Wealth floor', () => {
  test('deleting a purchase logged while Wealth was 0 does not create Wealth', () => {
    let s = L.rollover(initialState('Chloe'), NOW).state;
    s = L.addBizItems(s, { name: 'Oops', costSen: 4000, qty: 1, boughtOn: '2026-11-03' }, NOW).state;
    s = L.deleteBizItem(s, s.business.items[0].id, NOW).state;
    expect(deriveProgress(s.ledger).statXp.wea).toBe(0);
  });
});

describe('free pieces (cost RM 0)', () => {
  test('a free piece can be added to stock or the collection and does not touch Wealth', () => {
    let s = buy(base(), { costSen: 0, kept: true, name: 'Gift Groot' });
    s = buy(s, { costSen: 0, name: 'Free Hedwig' });
    expect(s.business.items.map((i) => [i.name, i.costSen, i.status])).toEqual([['Gift Groot', 0, 'kept'], ['Free Hedwig', 0, 'stock']]);
    expect(wea(s)).toBe(0);
  });
  test('selling a free piece: the whole price is profit', () => {
    let s = buy(base(), { costSen: 0 });
    s = L.sellBizItem(s, s.business.items[0].id, { soldSen: 5000, feesSen: 500, soldOn: '2026-11-03' }, NOW).state;
    expect(bizMonth(s.business.items, [], '2026-11', []).profitSen).toBe(4500);
    expect(wea(s)).toBe(45);
  });
  test('cost can be edited down to 0 (and the purchase leaves Wealth)', () => {
    let s = buy(base());
    s = L.editBizItem(s, s.business.items[0].id, { costSen: 0 }, NOW).state;
    expect(s.business.items[0].costSen).toBe(0);
    expect(wea(s)).toBe(0);
  });
  test('negative or missing costs are still refused', () => {
    const s = base();
    expect(L.addBizItems(s, { name: 'x', costSen: -100, qty: 1, boughtOn: '2026-11-03' }, NOW).state).toBe(s);
    expect(L.addBizItems(s, { name: 'x', costSen: NaN, qty: 1, boughtOn: '2026-11-03' }, NOW).state).toBe(s);
  });
});
