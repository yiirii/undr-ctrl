import { describe, test, expect } from 'vitest';
import { initialState } from '../store/state';
import * as L from '../store/logic';
import { deriveProgress } from '../core/ledger';
import { canonicalLedger } from './ledger';

const at = (d: string, h = 10) => new Date(`${d}T${String(h).padStart(2, '0')}:00:00`);

describe('canonical ledger', () => {
  test('two devices rolling over the same days do not double the drip', () => {
    let s = L.rollover(initialState('C'), at('2026-11-01')).state;
    s = L.setBudget(s, { limits: { food: 30000 }, savingsSen: 0, expected: {} }, at('2026-11-01')).state;
    const a = L.rollover(s, at('2026-11-04')).state; // laptop
    const b = L.rollover(s, at('2026-11-04', 11)).state; // phone, separately
    const union = [...new Map([...a.ledger, ...b.ledger].map((e) => [e.id, e])).values()];
    expect(deriveProgress(canonicalLedger(union)).statXp.wea).toBe(deriveProgress(a.ledger).statXp.wea);
    expect(deriveProgress(a.ledger).statXp.wea).toBeGreaterThan(0);
  });
  test('quest and achievement XP for the same ref count once', () => {
    const e = (id: string, source: string, ref: string, amount = 30) => ({ id, at: '2026-11-04T01:00:00.000Z', source, stat: null, amount, lifetime: true, ref });
    const led = canonicalLedger([e('b', 'quest', 'quest:q1'), e('a', 'quest', 'quest:q1'), e('c', 'achievement', 'ach:first', 10), e('d', 'achievement', 'ach:first', 10), e('x', 'task', 'task:1', 20), e('y', 'task', 'task:2', 20)] as any);
    expect(led.map((x) => x.id).sort()).toEqual(['a', 'c', 'x', 'y']);
  });
  test('a reversed auto entry wins over its live duplicate (undo is not lost)', () => {
    const e = (id: string, reversed?: boolean) => ({ id, at: '2026-11-04T01:00:00.000Z', source: 'recap', stat: null, amount: 25, lifetime: true, ref: 'recap:2026-10', reversed });
    const led = canonicalLedger([e('a'), e('b', true)] as any);
    expect(led.filter((x) => !x.reversed).length).toBe(0);
  });
  test('monthly repeats get the same id on both devices', () => {
    let s = L.rollover(initialState('C'), at('2026-09-05')).state;
    s = L.logMoney(s, { kind: 'out', sen: 1590, categoryId: 'subs', note: 'Spotify', date: '2026-09-05', repeatMonthly: true } as any, at('2026-09-05')).state;
    const a = L.rollover(s, at('2026-11-06')).state;
    const b = L.rollover(s, at('2026-11-06', 12)).state;
    const ids = (x: typeof a) => x.money.entries.filter((e) => e.autoFrom).map((e) => e.id).sort();
    expect(ids(a)).toEqual(ids(b));
    expect(ids(a).length).toBe(2);
  });
});
