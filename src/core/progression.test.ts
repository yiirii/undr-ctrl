import { describe, test, expect } from 'vitest';
import { rollQuests, questProgress, QUEST_TEMPLATES, rerollOne } from './quests';
import { ACHIEVEMENTS, newlyUnlocked, achievementProgress } from './achievements';
import { UNLOCKS, isUnlocked, nextUnlock, unlocksAt } from './unlocks';
import { emptyFacts } from './facts';

describe('quests', () => {
  test('pool sizes', () => {
    expect(QUEST_TEMPLATES.filter((t) => t.kind === 'daily').length).toBeGreaterThanOrEqual(8);
    expect(QUEST_TEMPLATES.filter((t) => t.kind === 'weekly').length).toBeGreaterThanOrEqual(5);
    expect(QUEST_TEMPLATES.some((t) => t.label === 'Focus for 50 minutes today')).toBe(true);
  });
  test('deterministic per seed, 3 daily / 2 weekly, no duplicates', () => {
    const a = rollQuests('2026-11-03', 'daily', {});
    expect(a).toEqual(rollQuests('2026-11-03', 'daily', {}));
    expect(a.length).toBe(3);
    expect(new Set(a.map((q) => q.templateId)).size).toBe(3);
    expect(rollQuests('2026-11-02', 'weekly', {}).length).toBe(2);
    const many = new Set(['01', '02', '03', '04', '05', '06'].map((d) => rollQuests(`2026-11-${d}`, 'daily', {}).map((q) => q.templateId).join()));
    expect(many.size).toBeGreaterThan(1);
  });
  test('clear my day completes when all My Day tasks done', () => {
    const q = { id: 'x', templateId: 'd-clear', kind: 'daily' as const, period: '2026-11-03', label: 'Clear My Day', target: 1, claimed: false };
    expect(questProgress(q, { ...emptyFacts(), myDayTotal: 4, myDayDone: 3 }).complete).toBe(false);
    expect(questProgress(q, { ...emptyFacts(), myDayTotal: 4, myDayDone: 4 })).toEqual({ done: 4, target: 4, complete: true });
    expect(questProgress(q, { ...emptyFacts(), myDayTotal: 0, myDayDone: 0 }).complete).toBe(false);
  });
  test('reroll swaps one quest for an unused template', () => {
    const qs = rollQuests('2026-11-03', 'daily', {});
    const r = rerollOne(qs, qs[0].id, 'seed2');
    expect(r.length).toBe(3);
    expect(new Set(r.map((q) => q.templateId)).size).toBe(3);
    expect(r.map((q) => q.templateId)).not.toContain(qs[0].templateId);
  });
});

describe('achievements', () => {
  test('37 achievements with unique ids', () => {
    expect(ACHIEVEMENTS.length).toBe(37);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(37);
  });
  test('centurion progress', () => {
    const c = ACHIEVEMENTS.find((a) => a.id === 'centurion')!;
    expect(achievementProgress(c, { ...emptyFacts(), tasksDoneTotal: 64 })).toEqual({ value: 64, target: 100 });
  });
  test('newlyUnlocked excludes previously unlocked', () => {
    const f = { ...emptyFacts(), tasksDoneTotal: 10 };
    const ids = newlyUnlocked([], f).map((a) => a.id);
    expect(ids).toContain('first-steps');
    expect(ids).toContain('ten-down');
    expect(newlyUnlocked(['first-steps'], f).map((a) => a.id)).not.toContain('first-steps');
  });
});

describe('unlocks', () => {
  const dusk = UNLOCKS.find((u) => u.id === 'theme-dusk')!;
  test('level gate', () => {
    expect(isUnlocked(dusk, 11, [])).toBe(false);
    expect(isUnlocked(dusk, 12, [])).toBe(true);
  });
  test('achievement gate', () => {
    const forest = UNLOCKS.find((u) => u.id === 'theme-forest')!;
    expect(isUnlocked(forest, 50, [])).toBe(false);
    expect(isUnlocked(forest, 1, ['iron-will'])).toBe(true);
  });
  test('next unlock after 9 is at 12', () => expect(nextUnlock(9)!.req.level).toBe(12));
  test('unlocksAt lists rewards reached exactly at a level', () => expect(unlocksAt(8).map((u) => u.id)).toContain('sound-glass'));
});
