import { describe, test, expect } from 'vitest';
import { statusOf, parseAmount, parseCost, formatRM, monthSummary, suggestSplit, unassigned, fitToIncome, dripForDay, nudge, recap, defaultCategories, type MoneyState } from './money';
import type { MoneyEntry } from './types';

const cats = defaultCategories();
const food = cats.find((c) => c.name === 'Food')!;
const base = (over: Partial<MoneyState> = {}): MoneyState => ({ categories: cats.map((c) => ({ ...c, limitSen: 0 })), sources: [], entries: [], goals: [], deposits: [], ...over });
let n = 0;
const out = (sen: number, categoryId: string, date: string): MoneyEntry => ({ id: `e${n++}`, kind: 'out', sen, categoryId, note: '', date, loggedOn: date });
const inc = (sen: number, date: string): MoneyEntry => ({ id: `i${n++}`, kind: 'in', sen, sourceId: 'allow', note: '', date, loggedOn: date });

describe('parseAmount', () => {
  test.each([
    ['12.50', 1250], ['RM12.50', 1250], ['rm 12.50', 1250], ['12,50', 1250], ['.5', 50], ['1,200', 120000], ['7', 700], [' 3.2 ', 320],
  ])('%s → %i sen', (s, sen) => expect(parseAmount(s)).toBe(sen));
  test.each(['0', '-3', 'abc', '', '.', '1.2.3', '0.00'])('rejects %s', (s) => expect(parseAmount(s)).toBeNull());
});

describe('formatRM', () => {
  test('cents shown when non-zero', () => expect(formatRM(1250)).toBe('RM 12.50'));
  test('whole ringgit drops cents and groups thousands', () => expect(formatRM(120000)).toBe('RM 1,200'));
  test('compact', () => expect(formatRM(1250, true)).toBe('RM12.50'));
  test('negative', () => expect(formatRM(-500)).toBe('−RM 5'));
});

describe('monthSummary', () => {
  const limited = () => base({ categories: cats.map((c) => ({ ...c, limitSen: c.id === food.id ? 60000 : 0 })) });
  test('left = budget - spent, kept = in - out', () => {
    const s = base({ categories: cats.map((c, i) => ({ ...c, limitSen: i === 0 ? 185000 : 0 })), entries: [out(143000, cats[0].id, '2026-11-02'), inc(200000, '2026-11-01')] });
    const m = monthSummary(s, '2026-11', '2026-11-21');
    expect(m.leftSen).toBe(42000);
    expect(m.keptSen).toBe(57000);
    expect(m.safePerDaySen).toBe(Math.floor(42000 / 10)); // 21..30 inclusive = 10 days
  });
  test('ignores other months', () => {
    const s = base({ entries: [out(1000, food.id, '2026-10-31')] });
    expect(monthSummary(s, '2026-11', '2026-11-03').outSen).toBe(0);
  });
  test('status thresholds', () => {
    const st = (spent: number) => monthSummary({ ...limited(), entries: [out(spent, food.id, '2026-11-02')] }, '2026-11', '2026-11-03').categories.find((c) => c.id === food.id)!.status;
    expect(st(47400)).toBe('calm');
    expect(st(48000)).toBe('warn');
    expect(st(60000)).toBe('warn');
    expect(st(60600)).toBe('over');
  });
  test('monthSummary with no categories', () => {
    const m = monthSummary(base({ categories: [] }), '2026-11', '2026-11-03');
    expect(m.hasBudget).toBe(false);
    expect(m.safePerDaySen).toBe(0);
    expect(JSON.stringify(m)).not.toMatch(/null|NaN|Infinity/);
  });
  test('month elapsed', () => {
    expect(monthSummary(base(), '2026-11', '2026-11-15').monthElapsed).toBeCloseTo(0.5);
    expect(monthSummary(base(), '2026-10', '2026-11-15').monthElapsed).toBe(1);
  });
});

describe('split', () => {
  test('50/30/20 of RM 2000', () => {
    const r = suggestSplit(200000, cats);
    const sum = Object.values(r.limits).reduce((a, b) => a + b, 0);
    expect(r.savingsSen).toBe(40000);
    expect(sum).toBe(160000);
    expect(Object.values(r.limits).every((v) => v % 100 === 0)).toBe(true);
  });
  test('remainder goes to savings', () => {
    const r = suggestSplit(100000, cats.slice(0, 3));
    const sum = Object.values(r.limits).reduce((a, b) => a + b, 0);
    expect(sum + r.savingsSen).toBe(100000);
  });
  test('unassigned and fitToIncome', () => {
    expect(unassigned(100000, { a: 50000, b: 30000 }, 10000)).toBe(10000);
    expect(unassigned(100000, { a: 70000, b: 30000 }, 6000)).toBe(-6000);
    const f = fitToIncome(100000, { a: 70000, b: 30000 }, 6000);
    expect(unassigned(100000, f.limits, f.savingsSen)).toBe(0);
  });
});

describe('drip', () => {
  test('budget / days in month in whole RM', () => {
    const s = base({ categories: cats.map((c, i) => ({ ...c, limitSen: i === 0 ? 186000 : 0 })) });
    expect(dripForDay(s, '2026-10-05')).toBe(60);
    expect(dripForDay(base({ categories: [] }), '2026-10-05')).toBe(0);
  });
});

describe('nudge', () => {
  test('warn nudge with per-day plan', () => {
    const s = base({ categories: cats.map((c) => ({ ...c, limitSen: c.id === food.id ? 60000 : 0 })), entries: [out(49200, food.id, '2026-11-10')] });
    const nd = nudge(s, '2026-11-20')!;
    expect(nd.kind).toBe('warn');
    expect(nd.text).toContain('82%');
    expect(nd.text).toContain('RM 11');
  });
  test('payday nudge suggests a deposit toward a goal', () => {
    const s = base({ goals: [{ id: 'g', name: 'New laptop', targetSen: 400000, savedSen: 0, createdAt: '2026-11-01' }], entries: [inc(150000, '2026-11-20')] });
    const nd = nudge(s, '2026-11-20')!;
    expect(nd.kind).toBe('payday');
    expect(nd.text).toContain('New laptop');
    expect(nd.suggestSen).toBe(30000);
  });
  test('quiet nudge after 3 days', () => {
    const s = base({ entries: [out(500, food.id, '2026-11-13')] });
    expect(nudge(s, '2026-11-17')!.kind).toBe('quiet');
    expect(nudge(s, '2026-11-15')).toBeNull();
  });
});

describe('recap', () => {
  test('totals and comparison with previous month', () => {
    const s = base({ categories: cats.map((c) => ({ ...c, limitSen: 50000 })), entries: [inc(185000, '2026-10-01'), out(143000, food.id, '2026-10-05'), inc(100000, '2026-09-01'), out(67000, food.id, '2026-09-05')] });
    const r = recap(s, '2026-10');
    expect(r.inSen).toBe(185000);
    expect(r.outSen).toBe(143000);
    expect(r.keptSen).toBe(42000);
    expect(r.deltaKeptSen).toBe(42000 - 33000);
    expect(r.withinBudget).toBe(cats.length - 1);
    expect(r.movers[0].id).toBe(food.id);
  });
  test('empty month does not crash', () => {
    const r = recap(base(), '2026-10');
    expect(r.outSen).toBe(0);
    expect(r.movers).toEqual([]);
  });
});

describe('statusOf without a limit', () => {
  test('a category with no limit is never "over" (track-first mode has no limits yet)', () => {
    expect(statusOf(4720, 0).status).toBe('calm');
    expect(statusOf(0, 0).status).toBe('calm');
  });
});

describe('parseCost', () => {
  test('accepts 0 and "free" for free pieces; otherwise like parseAmount', () => {
    for (const z of ['0', '0.00', 'RM 0', 'rm0', '00', 'free', 'Free']) expect(parseCost(z)).toBe(0);
    expect(parseCost('40')).toBe(4000);
    expect(parseCost('')).toBeNull();
    expect(parseCost('-5')).toBeNull();
    expect(parseCost('abc')).toBeNull();
  });
});
