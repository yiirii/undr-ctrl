import { describe, test, expect } from 'vitest';
import { initialState } from './state';
import * as L from './logic';
import { deriveProgress } from '../core/ledger';

const NOW = new Date(2026, 10, 3, 10, 0);
const fresh = () => L.rollover(initialState('Chloe'), NOW).state;
const wea = (s: ReturnType<typeof fresh>) => deriveProgress(s.ledger).statXp.wea;

describe('business actions', () => {
  test('buying items adds stock (qty) without touching Wealth', () => {
    const s = L.addBizItems(fresh(), { name: 'Groot #49', costSen: 4000, qty: 3, boughtOn: '2026-11-03' }, NOW).state;
    expect(s.business.items.filter((i) => i.status === 'stock').length).toBe(3);
    expect(wea(s)).toBe(0);
  });
  test('selling raises Wealth by the profit and can be undone', () => {
    let s = L.addBizItems(fresh(), { name: 'Groot #49', costSen: 4000, qty: 1, boughtOn: '2026-11-01' }, NOW).state;
    const id = s.business.items[0].id;
    s = L.sellBizItem(s, id, { soldSen: 8500, feesSen: 700, soldOn: '2026-11-03' }, NOW).state;
    expect(s.business.items[0].status).toBe('sold');
    expect(wea(s)).toBe(38);
    s = L.unsellBizItem(s, id, NOW).state;
    expect(s.business.items[0].status).toBe('stock');
    expect(wea(s)).toBe(0);
  });
  test('editing a sold item re-applies its Wealth', () => {
    let s = L.addBizItems(fresh(), { name: 'Pikachu', costSen: 3000, qty: 1, boughtOn: '2026-11-01' }, NOW).state;
    const id = s.business.items[0].id;
    s = L.sellBizItem(s, id, { soldSen: 6000, soldOn: '2026-11-03' }, NOW).state;
    s = L.editBizItem(s, id, { soldSen: 7000 }, NOW).state;
    expect(wea(s)).toBe(40);
  });
  test('business expenses subtract Wealth; deleting reverses', () => {
    let s = fresh();
    s = { ...s, ledger: [...s.ledger, { id: 'w', at: '2026-11-01T00:00:00.000Z', source: 'drip', stat: 'wea', amount: 100, lifetime: false, ref: 'w' }] };
    s = L.addBizExpense(s, { sen: 1200, label: 'Bubble wrap', date: '2026-11-03' }, NOW).state;
    expect(wea(s)).toBe(88);
    s = L.deleteBizExpense(s, s.business.expenses[0].id, NOW).state;
    expect(wea(s)).toBe(100);
  });
  test('first sale unlocks an achievement', () => {
    let s = L.addBizItems(fresh(), { name: 'Groot', costSen: 1000, qty: 1, boughtOn: '2026-11-01' }, NOW).state;
    const r = L.sellBizItem(s, s.business.items[0].id, { soldSen: 2000, soldOn: '2026-11-03' }, NOW);
    expect(r.state.achievements).toContain('first-sale');
  });
  test('rejects invalid amounts', () => {
    const s = fresh();
    expect(L.addBizItems(s, { name: 'x', costSen: 0, qty: 1, boughtOn: '2026-11-03' }, NOW).state).toBe(s);
    expect(L.addBizItems(s, { name: '', costSen: 100, qty: 1, boughtOn: '2026-11-03' }, NOW).state).toBe(s);
  });
});

describe('track-first mode', () => {
  test('personal spending does not lower Wealth while there is no budget', () => {
    let s = fresh();
    s = { ...s, ledger: [...s.ledger, { id: 'w', at: '2026-11-01T00:00:00.000Z', source: 'drip', stat: 'wea', amount: 50, lifetime: false, ref: 'w' }] };
    s = L.logMoney(s, { kind: 'out', sen: 2000, categoryId: 'food', note: '', date: '2026-11-03' }, NOW).state;
    expect(wea(s)).toBe(50);
  });
  test('money setup can finish with no income and no limits', () => {
    const s = L.setBudget(fresh(), { limits: {}, savingsSen: 0, expected: {} }, NOW).state;
    expect(s.money.setupDone).toBe(true);
    expect(s.money.categories.every((c) => c.limitSen === 0)).toBe(true);
  });
});
