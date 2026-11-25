import { describe, expect, test } from 'vitest';
import { habitMonth, habitStats } from './habitCalendar';
import type { Recurrence } from './types';

const daily: Recurrence = { kind: 'daily' };
const mwf: Recurrence = { kind: 'weekly', days: [1, 3, 5] };

describe('habit month calendar', () => {
  test('November 2026 starts on a Sunday: Monday-first weeks pad 6 blanks, 30 days, full weeks', () => {
    const m = habitMonth({ recurrence: daily, anchor: '2026-11-01', completions: [] }, '2026-11', '2026-11-25', true);
    expect(m.lead).toBe(6);
    expect(m.days).toHaveLength(30);
    expect((m.lead + m.days.length) % 7 === 0 || m.trail > 0).toBe(true);
    expect((m.lead + m.days.length + m.trail) % 7).toBe(0);
    expect(habitMonth({ recurrence: daily, anchor: '2026-11-01', completions: [] }, '2026-11', '2026-11-25', false).lead).toBe(0);
  });
  test('each day is done, missed, off, today, future or before the habit started', () => {
    const m = habitMonth({ recurrence: mwf, anchor: '2026-11-04', completions: ['2026-11-04', '2026-11-09'] }, '2026-11', '2026-11-13', true);
    const st = (d: number) => m.days[d - 1].state;
    expect(st(2)).toBe('before'); // before the anchor
    expect(st(4)).toBe('done'); // Wed, done
    expect(st(5)).toBe('off'); // Thu, not scheduled
    expect(st(6)).toBe('missed'); // Fri, scheduled, not done
    expect(st(9)).toBe('done');
    expect(st(13)).toBe('today'); // Fri, today, not yet done
    expect(st(16)).toBe('future');
  });
  test('a completion on an off day still shows as done', () => {
    const m = habitMonth({ recurrence: mwf, anchor: '2026-11-01', completions: ['2026-11-05'] }, '2026-11', '2026-11-20', true);
    expect(m.days[4].state).toBe('done');
  });
});

describe('habit stats', () => {
  test('current streak, longest streak and completion rate over scheduled days so far', () => {
    const done = ['2026-11-02', '2026-11-04', '2026-11-06', '2026-11-11', '2026-11-13'];
    const s = habitStats({ recurrence: mwf, anchor: '2026-11-02', completions: done }, '2026-11-13');
    // scheduled so far: 2,4,6,9,11,13 = 6; done 5 (9 missed)
    expect(s.current).toBe(2);
    expect(s.longest).toBe(3);
    expect(s.rate).toBeCloseTo(5 / 6);
    expect(s.total).toBe(5);
  });
  test('today not yet done does not break the current streak', () => {
    const s = habitStats({ recurrence: daily, anchor: '2026-11-01', completions: ['2026-11-01', '2026-11-02'] }, '2026-11-03');
    expect(s.current).toBe(2);
    expect(s.rate).toBeCloseTo(1); // today not counted until it's over or done
  });
  test('no scheduled days yet: rate is 0, nothing breaks', () => {
    expect(habitStats({ recurrence: daily, anchor: '2026-12-01', completions: [] }, '2026-11-25')).toEqual({ current: 0, longest: 0, rate: 0, total: 0 });
  });
});
