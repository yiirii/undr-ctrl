import type { Recurrence } from './types';
import { addDays, daysInMonth, dayOfMonth, diffDays, weekday } from './dates';

export function isScheduled(r: Recurrence, anchor: string, day: string): boolean {
  if (day < anchor) return false;
  switch (r.kind) {
    case 'daily': return true;
    case 'weekdays': { const w = weekday(day); return w >= 1 && w <= 5; }
    case 'weekly': return r.days.includes(weekday(day));
    case 'everyN': return diffDays(anchor, day) % Math.max(1, r.n) === 0;
    case 'monthly': return dayOfMonth(day) === Math.min(r.day, daysInMonth(day));
  }
}

/** First scheduled day strictly after `after`. */
export function nextOccurrence(r: Recurrence, anchor: string, after: string): string {
  let d = addDays(after < anchor ? addDays(anchor, -1) : after, 1);
  for (let i = 0; i < 800; i++, d = addDays(d, 1)) if (isScheduled(r, anchor, d)) return d;
  return d;
}

/** Consecutive completed scheduled days ending today (or ending at the last scheduled day before today if today isn't done). */
export function streakAfter(done: Set<string>, r: Recurrence, anchor: string, today: string): number {
  let d = today;
  if (!(isScheduled(r, anchor, today) && done.has(today))) d = addDays(today, -1);
  let n = 0;
  for (let i = 0; i < 3660 && d >= anchor; i++, d = addDays(d, -1)) {
    if (!isScheduled(r, anchor, d)) continue;
    if (!done.has(d)) break;
    n++;
  }
  return n;
}

export function describeRecurrence(r: Recurrence): string {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  switch (r.kind) {
    case 'daily': return 'Every day';
    case 'weekdays': return 'Weekdays';
    case 'weekly': return `Every ${[...r.days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map((d) => names[d]).join(' ')}`;
    case 'everyN': return `Every ${r.n} days`;
    case 'monthly': return `Monthly on the ${r.day}${['th', 'st', 'nd', 'rd'][r.day % 10 > 3 || [11, 12, 13].includes(r.day) ? 0 : r.day % 10]}`;
  }
}
