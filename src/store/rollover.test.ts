import { describe, test, expect } from 'vitest';
import { initialState } from './state';
import * as L from './logic';

const day = (d: number) => new Date(2026, 10, d, 9, 0);

describe('rollover', () => {
  test('first run sets quests without drip', () => {
    const r = L.rollover(initialState('C'), day(3)).state;
    expect(r.lastRollover).toBe('2026-11-03');
    expect(r.quests.filter((q) => q.kind === 'daily').length).toBe(3);
    expect(r.quests.filter((q) => q.kind === 'weekly').length).toBe(2);
    expect(r.ledger.filter((e) => e.source === 'drip').length).toBe(0);
  });
  test('rollover catches up 4 missed days exactly once', () => {
    let s = L.rollover(initialState('C'), day(3)).state;
    s = L.setBudget(s, { limits: { food: 93000 }, savingsSen: 0, expected: {} }, day(3)).state; // RM 930 / 30 days = 31/day
    const once = L.rollover(s, day(7)).state;
    const twice = L.rollover(once, day(7)).state;
    const drips = twice.ledger.filter((e) => e.source === 'drip');
    expect(drips.length).toBe(4);
    expect(drips.every((e) => e.amount === 31)).toBe(true);
    expect(twice.quests.filter((q) => q.kind === 'daily').every((q) => q.period === '2026-11-07')).toBe(true);
    expect(twice).toEqual(once);
  });
  test('weekly quests roll on a new week only', () => {
    let s = L.rollover(initialState('C'), day(3)).state;
    const w1 = s.quests.filter((q) => q.kind === 'weekly').map((q) => q.id);
    s = L.rollover(s, day(5)).state;
    expect(s.quests.filter((q) => q.kind === 'weekly').map((q) => q.id)).toEqual(w1);
    s = L.rollover(s, day(9)).state;
    expect(s.quests.filter((q) => q.kind === 'weekly').every((q) => q.period === '2026-11-09')).toBe(true);
  });
  test('monthly repeating money entries are added on their day', () => {
    let s = L.rollover(initialState('C'), day(3)).state;
    s = L.logMoney(s, { kind: 'out', sen: 1590, categoryId: 'subs', note: 'Spotify', date: '2026-10-05', repeatMonthly: true }, day(3)).state;
    s = L.rollover(s, day(6)).state;
    const autos = s.money.entries.filter((e) => e.autoFrom);
    expect(autos.length).toBe(1);
    expect(autos[0].date).toBe('2026-11-05');
    expect(L.rollover(s, day(6)).state.money.entries.length).toBe(s.money.entries.length);
  });
  test('missed habit day resets displayed streak', () => {
    let s = L.rollover(initialState('C'), day(1)).state;
    s = L.addTask(s, { title: 'Read', listId: 'uni', habit: true, recurrence: { kind: 'daily' }, anchor: '2026-11-01' }, day(1)).state;
    const id = s.tasks[s.tasks.length - 1].id;
    s = L.completeTask(s, id, day(1)).state;
    s = L.completeTask(s, id, day(2)).state;
    s = L.rollover(s, day(5)).state;
    expect(s.tasks.find((t) => t.id === id)!.streak).toBe(0);
  });
});
