// Month calendar and stats for one habit.
import type { Recurrence } from './types';
import { addDays, daysInMonth, monthStart, weekday } from './dates';
import { isScheduled, streakAfter } from './recurrence';

export type DayState = 'done' | 'missed' | 'off' | 'today' | 'future' | 'before';
export interface HabitLike { recurrence: Recurrence; anchor: string; completions: string[] }
export interface MonthDay { day: string; state: DayState; scheduled: boolean }

/** A month laid out in weeks: `lead` blank cells before day 1, the days, then `trail` blanks to fill the last week. */
export function habitMonth(h: HabitLike, mk: string, today: string, startsMonday: boolean) {
  const first = monthStart(mk);
  const n = daysInMonth(first);
  const lead = startsMonday ? (weekday(first) + 6) % 7 : weekday(first);
  const done = new Set(h.completions);
  const days: MonthDay[] = Array.from({ length: n }, (_, i) => {
    const day = addDays(first, i);
    const scheduled = isScheduled(h.recurrence, h.anchor, day);
    const state: DayState = done.has(day) ? 'done'
      : day < h.anchor ? 'before'
      : day > today ? 'future'
      : day === today ? (scheduled ? 'today' : 'off')
      : scheduled ? 'missed' : 'off';
    return { day, state, scheduled };
  });
  return { lead, days, trail: (7 - ((lead + n) % 7)) % 7 };
}

/** Current streak, longest streak, and share of scheduled days done so far (today counts only once it's done). */
export function habitStats(h: HabitLike, today: string) {
  const done = new Set(h.completions);
  let longest = 0, run = 0, sched = 0, hit = 0;
  for (let d = h.anchor, i = 0; d <= today && i < 3660; d = addDays(d, 1), i++) {
    if (!isScheduled(h.recurrence, h.anchor, d)) continue;
    const ok = done.has(d);
    if (d === today && !ok) continue;
    sched++;
    if (ok) { hit++; run++; longest = Math.max(longest, run); } else run = 0;
  }
  return { current: h.anchor > today ? 0 : streakAfter(done, h.recurrence, h.anchor, today), longest, rate: sched ? hit / sched : 0, total: h.completions.length };
}
