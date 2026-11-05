import { describe, it, expect } from 'vitest';
import { walletFlowsSen, businessMoney, takenOutMonth, personalSplit, adjustFor, type BizMove } from './wallet';
import type { BizItem, BizExpense, BizIncome } from './business';
import type { MoneyEntry } from './types';

const item = (o: Partial<BizItem>): BizItem => ({ id: Math.random().toString(36), name: 'Pop', costSen: 4000, boughtOn: '2026-11-01', status: 'stock', ...o });
const out = (sen: number, date: string, wallet?: 'tng' | 'cash'): MoneyEntry => ({ id: Math.random().toString(36), kind: 'out', sen, categoryId: 'food', note: '', date, loggedOn: date, ...(wallet ? { wallet } : {}) });
const inn = (sen: number, date: string, wallet?: 'tng' | 'cash'): MoneyEntry => ({ id: Math.random().toString(36), kind: 'in', sen, sourceId: 'parents', note: '', date, loggedOn: date, ...(wallet ? { wallet } : {}) });

describe('business money (TnG)', () => {
  const items = [
    item({ costSen: 4000, status: 'sold', soldSen: 9000, feesSen: 500, soldOn: '2026-11-03' }), // +8500 −4000
    item({ costSen: 3000, status: 'stock' }), // −3000
    item({ costSen: 0, status: 'kept' }), // free piece: 0
    item({ costSen: 2000, status: 'reserved', reservation: { depositSen: 1500, dueOn: '2026-11-10', on: '2026-11-04' } }), // −2000 +1500
  ];
  const expenses: BizExpense[] = [{ id: 'e', sen: 800, label: 'Boxes', date: '2026-11-02' }];
  const income: BizIncome[] = [{ id: 'i', sen: 500, label: 'Deposit kept', date: '2026-11-02' }];
  const entries = [out(1200, '2026-11-05', 'tng'), out(999, '2026-11-05'), out(300, '2026-11-05', 'cash'), inn(5000, '2026-11-01', 'tng'), inn(10000, '2026-11-01')];
  const moves: BizMove[] = [{ id: 'm1', sen: 2000, dir: 'in', date: '2026-11-02' }, { id: 'm2', sen: 700, dir: 'out', date: '2026-11-06' }];

  it('adds money in from sales, deposits, kept deposits, TnG income and top-ups; takes out stock, costs, personal TnG spending and moves out', () => {
    // sales 9000−500, deposit 1500, income 500, tng income 5000, move in 2000
    // stock 4000+3000+0+2000, costs 800, tng spend 1200, move out 700
    expect(walletFlowsSen(items, expenses, income, entries, moves)).toBe(8500 + 1500 + 500 + 5000 + 2000 - 9000 - 800 - 1200 - 700);
  });
  it('cash spending and cash income never touch business money', () => {
    expect(walletFlowsSen([], [], [], [out(5000, '2026-11-01'), out(5000, '2026-11-01', 'cash'), inn(9000, '2026-11-01')], [])).toBe(0);
  });
  it('matching your real TnG balance stores an adjustment, after which new flows move the balance', () => {
    const flows = walletFlowsSen(items, expenses, income, entries, moves);
    const adj = adjustFor(flows, 34000);
    expect(businessMoney(flows, { adjustSen: adj, setOn: '2026-11-06' })).toBe(34000);
    const more = walletFlowsSen(items, expenses, income, [...entries, out(1000, '2026-11-07', 'tng')], moves);
    expect(businessMoney(more, { adjustSen: adj, setOn: '2026-11-06' })).toBe(33000);
  });
  it('has no balance until you tell it what is in your TnG', () => {
    expect(businessMoney(1234, undefined)).toBeNull();
  });
  it('taken out this month: personal TnG spending plus money moved out; put in: TnG income plus top-ups', () => {
    const t = takenOutMonth([...entries, out(400, '2026-10-30', 'tng')], moves, '2026-11');
    expect(t).toEqual({ spentSen: 1200, movedOutSen: 700, takenOutSen: 1900, receivedSen: 5000, movedInSen: 2000, putInSen: 7000 });
  });
  it('splits personal spending by what paid for it (old entries count as cash)', () => {
    expect(personalSplit(entries, '2026-11')).toEqual({ cashSen: 1299, tngSen: 1200 });
  });
});

import { businessMonthFlows } from './wallet';
describe('business money this month', () => {
  it('money in from sales, deposits taken and other income; money out on pieces bought and other costs', () => {
    const items: BizItem[] = [
      { id: 'a', name: 'A', costSen: 4000, boughtOn: '2026-10-20', status: 'sold', soldSen: 9000, feesSen: 500, soldOn: '2026-11-03' },
      { id: 'b', name: 'B', costSen: 3000, boughtOn: '2026-11-02', status: 'stock' },
      { id: 'c', name: 'C', costSen: 2000, boughtOn: '2026-11-02', status: 'reserved', reservation: { depositSen: 1500, dueOn: '2026-11-10', on: '2026-11-04' } },
      { id: 'd', name: 'D', costSen: 1000, boughtOn: '2026-10-02', status: 'sold', soldSen: 2000, soldOn: '2026-10-05' },
    ];
    const r = businessMonthFlows(items, [{ id: 'e', sen: 800, label: 'Boxes', date: '2026-11-02' }], [{ id: 'i', sen: 500, label: 'Kept', date: '2026-11-09' }], '2026-11');
    expect(r).toEqual({ inSen: 8500 + 1500 + 500, outSen: 3000 + 2000 + 800 });
  });
});
