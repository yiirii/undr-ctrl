import { describe, test, expect } from 'vitest';
import { taskXp, statLevel, charLevel, rank, title, focusXp } from './rules';

describe('taskXp', () => {
  test('base xp by size', () => {
    expect(taskXp('quick', {})).toBe(10);
    expect(taskXp('normal', {})).toBe(20);
    expect(taskXp('big', {})).toBe(40);
  });
  test('on-time bonus is +25%', () => expect(taskXp('normal', { onTime: true })).toBe(25));
  test('streak multiplier caps at x2', () => {
    expect(taskXp('normal', { streak: 3 })).toBe(26);
    expect(taskXp('normal', { streak: 15 })).toBe(40);
    expect(taskXp('big', { onTime: true, streak: 10 })).toBe(100);
  });
});

describe('levels', () => {
  test('stat level thresholds 25s(s-1)', () => {
    expect(statLevel(0).level).toBe(1);
    expect(statLevel(49).level).toBe(1);
    expect(statLevel(50).level).toBe(2);
    expect(statLevel(500).level).toBe(5);
    expect(statLevel(2250).level).toBe(10);
  });
  test('stat level progress within level', () => {
    expect(statLevel(60)).toEqual({ level: 2, into: 10, need: 100 });
  });
  test('character level thresholds 50L(L-1)', () => {
    expect(charLevel(99).level).toBe(1);
    expect(charLevel(100).level).toBe(2);
    expect(charLevel(4500).level).toBe(10);
    expect(charLevel(122500).level).toBe(50);
  });
  test('ranks', () => {
    expect(rank(4)).toBe('Novice');
    expect(rank(5)).toBe('Apprentice');
    expect(rank(10)).toBe('Journeyman');
    expect(rank(20)).toBe('Adept');
    expect(rank(35)).toBe('Master');
    expect(rank(50)).toBe('Grandmaster');
  });
  test('title = rank + noun of top stat', () => expect(title(22, 'int')).toBe('Adept Scholar'));
});

describe('focusXp', () => {
  test('10 first, 5 next, 0 after 4 sessions', () => {
    expect(focusXp(0)).toBe(10);
    expect(focusXp(1)).toBe(5);
    expect(focusXp(3)).toBe(5);
    expect(focusXp(4)).toBe(0);
  });
});
