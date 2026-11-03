import { describe, test, expect } from 'vitest';
import { dayKey, addDays, daysInMonth, weekStart, weekday } from './dates';
import { isScheduled, nextOccurrence, streakAfter } from './recurrence';

describe('dates', () => {
  test('dayKey local', () => expect(dayKey(new Date(2026, 10, 3, 23, 59))).toBe('2026-11-03'));
  test('addDays across month', () => expect(addDays('2026-10-30', 3)).toBe('2026-11-02'));
  test('daysInMonth', () => { expect(daysInMonth('2028-02-10')).toBe(29); expect(daysInMonth('2026-11-03')).toBe(30); });
  test('weekStart monday', () => { expect(weekStart('2026-11-05')).toBe('2026-11-02'); expect(weekStart('2026-11-08')).toBe('2026-11-02'); expect(weekStart('2026-11-08', false)).toBe('2026-11-08'); });
  test('weekday', () => expect(weekday('2026-11-03')).toBe(2));
});

describe('recurrence', () => {
  const mwf = { kind: 'weekly' as const, days: [1, 3, 5] };
  test('weekly next after wednesday is friday', () => expect(nextOccurrence(mwf, '2026-11-02', '2026-11-04')).toBe('2026-11-06'));
  test('monthly day 31 clamps to end of february', () => {
    expect(nextOccurrence({ kind: 'monthly', day: 31 }, '2027-01-31', '2027-01-31')).toBe('2027-02-28');
    expect(nextOccurrence({ kind: 'monthly', day: 31 }, '2028-01-31', '2028-01-31')).toBe('2028-02-29');
  });
  test('everyN 3 from anchor', () => {
    expect(isScheduled({ kind: 'everyN', n: 3 }, '2026-11-01', '2026-11-04')).toBe(true);
    expect(isScheduled({ kind: 'everyN', n: 3 }, '2026-11-01', '2026-11-05')).toBe(false);
    expect(nextOccurrence({ kind: 'everyN', n: 3 }, '2026-11-01', '2026-11-04')).toBe('2026-11-07');
  });
  test('weekdays skips weekend', () => expect(nextOccurrence({ kind: 'weekdays' }, '2026-11-02', '2026-11-06')).toBe('2026-11-09'));
  test('not scheduled before anchor', () => expect(isScheduled({ kind: 'daily' }, '2026-11-05', '2026-11-04')).toBe(false));
});

describe('streaks', () => {
  const mwf = { kind: 'weekly' as const, days: [1, 3, 5] };
  test('counts only scheduled days', () => {
    expect(streakAfter(new Set(['2026-11-02', '2026-11-04', '2026-11-06']), mwf, '2026-10-01', '2026-11-06')).toBe(3);
  });
  test('missing a scheduled day resets', () => {
    expect(streakAfter(new Set(['2026-11-02', '2026-11-06']), mwf, '2026-10-01', '2026-11-06')).toBe(1);
    expect(streakAfter(new Set(['2026-11-02']), mwf, '2026-10-01', '2026-11-06')).toBe(0);
  });
  test('unfinished today does not break a streak up to yesterday', () => {
    expect(streakAfter(new Set(['2026-11-02', '2026-11-03']), { kind: 'daily' }, '2026-11-01', '2026-11-04')).toBe(2);
  });
});
