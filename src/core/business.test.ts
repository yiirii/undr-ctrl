import { describe, test, expect } from 'vitest';
import { matchesQuery, wealthForBuy, itemProfit, bizMonth, stockSummary, wealthForSale, wealthForBizExpense, bizSixMonths, type BizItem, type BizExpense } from './business';
import { sortGroups, addedAt } from './business';
import { suggestFromHistory, defaultCategories, type MoneyState } from './money';
import type { MoneyEntry } from './types';

const item = (o: Partial<BizItem>): BizItem => ({ id: 'i' + Math.random(), name: 'Groot #49', costSen: 4000, boughtOn: '2026-10-01', status: 'stock', ...o });

describe('business', () => {
  test('item profit = sold - cost - fees', () => {
    expect(itemProfit(item({ status: 'sold', soldSen: 8500, feesSen: 700 }))).toBe(3800);
    expect(itemProfit(item({ status: 'stock' }))).toBe(0);
    expect(itemProfit(item({ status: 'sold', soldSen: 3000, feesSen: 500 }))).toBe(-1500);
  });
  test('month summary counts sales, cost of sold items, fees and other expenses in that month', () => {
    const items = [
      item({ status: 'sold', soldSen: 8500, feesSen: 700, soldOn: '2026-11-02' }),
      item({ status: 'sold', costSen: 2000, soldSen: 3500, soldOn: '2026-11-10' }),
      item({ status: 'sold', soldSen: 9000, soldOn: '2026-10-20' }),
      item({ costSen: 6000, boughtOn: '2026-11-05' }),
    ];
    const ex: BizExpense[] = [{ id: 'e', sen: 1200, label: 'Bubble wrap', date: '2026-11-04' }, { id: 'f', sen: 999, label: 'old', date: '2026-10-04' }];
    const m = bizMonth(items, ex, '2026-11');
    expect(m.salesSen).toBe(12000);
    expect(m.cogsSen).toBe(6000);
    expect(m.feesSen).toBe(700);
    expect(m.expensesSen).toBe(1200);
    expect(m.profitSen).toBe(12000 - 6000 - 700 - 1200);
    expect(m.soldCount).toBe(2);
    expect(m.boughtSen).toBe(6000);
    expect(m.boughtCount).toBe(1);
  });
  test('stock summary', () => {
    const s = stockSummary([item({ costSen: 4000, askSen: 7000 }), item({ costSen: 2500 }), item({ status: 'sold', soldSen: 1 })], '2026-11-03');
    expect(s.count).toBe(2);
    expect(s.costSen).toBe(6500);
    expect(s.askSen).toBe(7000);
    expect(s.oldestDays).toBe(33);
  });
  test('wealth follows cash: buying costs, a sale adds what was received, expenses subtract', () => {
    expect(wealthForBuy(item({ costSen: 4000 }), 'x')[0]).toMatchObject({ stat: 'wea', amount: -40, lifetime: false });
    expect(wealthForSale(item({ status: 'sold', soldSen: 8500, feesSen: 700 }), 'x')[0]).toMatchObject({ stat: 'wea', amount: 78, lifetime: false });
    expect(wealthForBizExpense({ id: 'e', sen: 1250, label: '', date: '2026-11-01' }, 'x')[0].amount).toBe(-13);
  });
  test('six month profit series', () => {
    const s = bizSixMonths([item({ status: 'sold', soldSen: 9000, soldOn: '2026-10-20' })], [], '2026-11-03');
    expect(s.length).toBe(6);
    expect(s[4]).toMatchObject({ mk: '2026-10', profitSen: 5000 });
  });
});

describe('suggestFromHistory (track first, budget later)', () => {
  const cats = defaultCategories();
  const out = (sen: number, categoryId: string, date: string): MoneyEntry => ({ id: date + sen, kind: 'out', sen, categoryId, note: '', date, loggedOn: date });
  const st = (entries: MoneyEntry[]): MoneyState => ({ categories: cats, sources: [], entries, goals: [], deposits: [] });
  test('needs at least 14 days of history', () => {
    expect(suggestFromHistory(st([out(1000, 'food', '2026-11-01')]), '2026-11-10')).toBeNull();
  });
  test('monthly average per category, rounded up to RM 10', () => {
    const e = [out(30000, 'food', '2026-10-04'), out(1200, 'transport', '2026-10-20')];
    const r = suggestFromHistory(st(e), '2026-11-03')!; // 30 days of history
    expect(r.days).toBe(30);
    expect(r.limits.food).toBe(31000); // 300 / 30 * 30.4 = 304 → 310
    expect(r.limits.transport).toBe(2000); // 12 / 30 * 30.4 = 12.16 → RM 20
  });
});

describe('search', () => {
  test('every word must appear, in any order; # and case are ignored; notes count', () => {
    const it = { name: 'Funko Pop! Groot #49', note: 'box damaged' } as any;
    expect(matchesQuery(it, 'groot 49')).toBe(true);
    expect(matchesQuery(it, '#49 groot')).toBe(true);
    expect(matchesQuery(it, '49')).toBe(true);
    expect(matchesQuery(it, 'damaged')).toBe(true);
    expect(matchesQuery(it, 'groot 50')).toBe(false);
    expect(matchesQuery(it, '   ')).toBe(true);
  });
});

describe('sorting stock and collection', () => {
  const it = (id: string, name: string, boughtOn = '2026-11-01') => ({ id, name, costSen: 1000, boughtOn, status: 'stock' }) as unknown as BizItem;
  // ids start with the time they were added (base-36 ms), so "date added" follows the id
  const t = (ms: number) => (Date.parse('2026-11-01') + ms).toString(36);
  const kiki = [it(t(3000) + 'a', 'Kiki #1176')], groot = [it(t(1000) + 'b', 'groot #49'), it(t(5000) + 'c', 'Groot #49')], ash = [it(t(2000) + 'd', 'Ash #12')];
  const groups = [kiki, groot, ash];
  test('A to Z ignores case', () => {
    expect(sortGroups(groups, 'az').map((g) => g[0].name)).toEqual(['Ash #12', 'groot #49', 'Kiki #1176']);
  });
  test('newest first uses the latest piece added in a group; oldest first the earliest', () => {
    expect(sortGroups(groups, 'new').map((g) => g[0].name)).toEqual(['groot #49', 'Kiki #1176', 'Ash #12']);
    expect(sortGroups(groups, 'old').map((g) => g[0].name)).toEqual(['groot #49', 'Ash #12', 'Kiki #1176']);
  });
  test('an id without a time falls back to the bought date', () => {
    const a = [it('legacy-x', 'Old', '2025-01-01')], b = [it(t(Date.parse('2026-01-01')) + 'z', 'New', '2026-01-01')];
    expect(addedAt(a[0])).toBe(Date.parse('2025-01-01'));
    expect(sortGroups([b, a], 'old').map((g) => g[0].name)).toEqual(['Old', 'New']);
  });
});
