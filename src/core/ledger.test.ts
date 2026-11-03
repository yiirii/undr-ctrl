import { describe, test, expect } from 'vitest';
import { deriveProgress, entry, reverse } from './ledger';
import type { LedgerEntry } from './types';

const at = (i: number) => `2026-11-0${i}T10:00:00.000Z`;

describe('deriveProgress', () => {
  test('sums xp per stat', () => {
    const l = [entry('task', 'int', 20, true, 'a', at(1)), entry('task', 'int', 30, true, 'b', at(2)), entry('task', 'str', 10, true, 'c', at(2))];
    const p = deriveProgress(l);
    expect(p.statXp.int).toBe(50);
    expect(p.statXp.str).toBe(10);
    expect(p.stats.int.level).toBe(2);
  });
  test('wealth is clamped at zero in time order', () => {
    const l = [entry('drip', 'wea', 30, false, 'd1', at(1)), entry('spend', 'wea', -50, false, 's', at(2)), entry('drip', 'wea', 10, false, 'd2', at(3))];
    expect(deriveProgress(l).statXp.wea).toBe(10);
  });
  test('lifetime ignores non-lifetime entries', () => {
    const l = [entry('drip', 'wea', 60, false, 'd', at(1)), entry('task', 'int', 20, true, 't', at(2)), entry('bookkeeping', null, 2, true, 'b', at(2))];
    expect(deriveProgress(l).lifetime).toBe(22);
  });
  test('topStat ties broken by STATS order', () => {
    const l = [entry('task', 'cha', 20, true, 'a', at(1)), entry('task', 'str', 20, true, 'b', at(1))];
    expect(deriveProgress(l).topStat).toBe('str');
  });
  test('empty ledger defaults', () => {
    const p = deriveProgress([]);
    expect(p.char.level).toBe(1);
    expect(p.topStat).toBe('int');
  });
  test('undo after level-up restores previous level', () => {
    let l: LedgerEntry[] = [entry('task', 'int', 90, true, 'x', at(1))];
    expect(deriveProgress(l).char.level).toBe(1);
    l = [...l, entry('task', 'int', 20, true, 'y', at(2))];
    expect(deriveProgress(l).char.level).toBe(2);
    l = reverse(l, 'y', at(3));
    const p = deriveProgress(l);
    expect(p.char.level).toBe(1);
    expect(p.lifetime).toBe(90);
    expect(p.statXp.int).toBe(90);
  });
  test('reverse is idempotent', () => {
    let l: LedgerEntry[] = [entry('task', 'int', 20, true, 'y', at(1))];
    l = reverse(l, 'y', at(2));
    l = reverse(l, 'y', at(3));
    expect(deriveProgress(l).statXp.int).toBe(0);
  });
});
