// Insights: where money goes, and how productive you are. Pure functions over app data.
import type { Category, FocusLogEntry, LedgerEntry, MoneyEntry, Stat, Task } from './types';
import { STATS } from './types';
import { addDays, addMonths, dayKey, dayOfMonth, daysInMonth, diffDays, monthKey, weekday, weekStart } from './dates';
import { deriveProgress } from './ledger';

export interface CatTrend { id: string; name: string; color: string; months: { mk: string; sen: number }[]; thisSen: number; avgSen: number }
export interface SpendingInsights {
  categories: CatTrend[]; // only categories with any spending in the window, biggest this month first
  /** Compared with what you usually spend by this day of the month (avg × paceFrac). */
  changes: { id: string; name: string; color: string; thisSen: number; avgSen: number; usualByNowSen: number; diffSen: number }[];
  paceFrac: number; // share of the month passed (day / days in month)
  totalThisSen: number;
  totalAvgSen: number;
  totalUsualByNowSen: number;
  week: { weekdaySen: number; weekendSen: number }; // average spend per weekday / weekend day, last 90 days
}

export function spendingInsights(money: { categories: Category[]; entries: MoneyEntry[] }, today: string): SpendingInsights {
  const mkNow = monthKey(today);
  const mks = Array.from({ length: 6 }, (_, i) => addMonths(mkNow, i - 5));
  const outs = money.entries.filter((e) => e.kind === 'out');
  const categories: CatTrend[] = money.categories.map((c) => {
    const months = mks.map((mk) => ({ mk, sen: outs.filter((e) => e.categoryId === c.id && monthKey(e.date) === mk).reduce((n, e) => n + e.sen, 0) }));
    const earlier = months.slice(0, 5).filter((m) => m.sen > 0);
    const avgSen = earlier.length ? Math.round(earlier.reduce((n, m) => n + m.sen, 0) / earlier.length) : 0;
    return { id: c.id, name: c.name, color: c.color, months, thisSen: months[5].sen, avgSen };
  }).filter((c) => c.months.some((m) => m.sen > 0)).sort((a, b) => b.thisSen - a.thisSen || b.avgSen - a.avgSen);
  const paceFrac = dayOfMonth(today) / daysInMonth(today);
  const changes = categories
    .filter((c) => c.avgSen > 0)
    .map((c) => { const usualByNowSen = Math.round(c.avgSen * paceFrac); return { id: c.id, name: c.name, color: c.color, thisSen: c.thisSen, avgSen: c.avgSen, usualByNowSen, diffSen: c.thisSen - usualByNowSen }; })
    .filter((c) => c.diffSen !== 0)
    .sort((a, b) => Math.abs(b.diffSen) - Math.abs(a.diffSen))
    .slice(0, 3);
  const monthTotal = (mk: string) => outs.filter((e) => monthKey(e.date) === mk).reduce((n, e) => n + e.sen, 0);
  const earlierTotals = mks.slice(0, 5).map(monthTotal).filter((n) => n > 0);
  // weekday vs weekend, last 90 days, but only from the first entry onward
  const first = outs.reduce((a, e) => (e.date < a ? e.date : a), today);
  const from = [addDays(today, -89), first].sort()[1];
  let wd = 0, we = 0, wdDays = 0, weDays = 0;
  for (let d = from; d <= today; d = addDays(d, 1)) {
    const sum = outs.filter((e) => e.date === d).reduce((n, e) => n + e.sen, 0);
    const w = weekday(d);
    if (w === 0 || w === 6) { we += sum; weDays++; } else { wd += sum; wdDays++; }
  }
  const totalAvgSen = earlierTotals.length ? Math.round(earlierTotals.reduce((a, b) => a + b, 0) / earlierTotals.length) : 0;
  return {
    categories,
    changes,
    paceFrac,
    totalThisSen: monthTotal(mkNow),
    totalAvgSen,
    totalUsualByNowSen: Math.round(totalAvgSen * paceFrac),
    week: { weekdaySen: wdDays ? Math.round(wd / wdDays) : 0, weekendSen: weDays ? Math.round(we / weDays) : 0 },
  };
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const TIME_SLOTS = [
  { name: 'Morning', from: 5, to: 12 },
  { name: 'Afternoon', from: 12, to: 17 },
  { name: 'Evening', from: 17, to: 21 },
  { name: 'Night', from: 21, to: 29 }, // 21:00–05:00
] as const;
const slotOf = (h: number) => TIME_SLOTS.find((s) => (h >= s.from && h < s.to) || (h + 24 >= s.from && h + 24 < s.to))!.name;

export interface ProductivityInsights {
  days: { day: string; planned: number; plannedDone: number; finished: number }[]; // last 14 days
  bestWeekday: string | null;
  bestTime: string | null;
  byWeekday: number[]; // completions per weekday (Sun..Sat), last 60 days
  bySlot: { name: string; count: number }[];
  focusWeeks: { start: string; minutes: number }[]; // last 8 weeks, oldest first
  statGrowth: { stat: Stat; before: number; now: number }[]; // stat XP 90 days ago vs now
}

export function productivityInsights(tasks: Task[], focusLog: FocusLogEntry[], ledger: LedgerEntry[], today: string, weekStartsMonday = true): ProductivityInsights {
  // every completion as a local Date
  const completions: Date[] = [];
  for (const t of tasks) {
    if (t.doneAt) completions.push(new Date(t.doneAt));
    if (t.habit) for (const d of t.completions) completions.push(new Date(`${d}T12:00:00`));
  }
  const doneOn = (d: string) => completions.filter((c) => dayKey(c) === d).length;
  const days = Array.from({ length: 14 }, (_, i) => {
    const day = addDays(today, i - 13);
    const planned = tasks.filter((t) => !t.habit && t.myDay === day);
    return { day, planned: planned.length, plannedDone: planned.filter((t) => t.doneAt && dayKey(new Date(t.doneAt)) === day).length, finished: doneOn(day) };
  });
  const recent = completions.filter((c) => diffDays(dayKey(c), today) < 60);
  const byWeekday = [0, 0, 0, 0, 0, 0, 0];
  for (const c of recent) byWeekday[c.getDay()]++;
  const timed = tasks.filter((t) => t.doneAt).map((t) => new Date(t.doneAt!)).filter((c) => diffDays(dayKey(c), today) < 60);
  const bySlot = TIME_SLOTS.map((s) => ({ name: s.name, count: timed.filter((c) => slotOf(c.getHours()) === s.name).length }));
  const maxWd = Math.max(...byWeekday);
  const bestSlot = [...bySlot].sort((a, b) => b.count - a.count)[0];
  const ws = weekStart(today, weekStartsMonday);
  const focusWeeks = Array.from({ length: 8 }, (_, i) => {
    const start = addDays(ws, (i - 7) * 7);
    const end = addDays(start, 6);
    return { start, minutes: focusLog.filter((f) => f.day >= start && f.day <= end).reduce((n, f) => n + f.minutes, 0) };
  });
  const cutoff = `${addDays(today, -90)}T00:00:00.000Z`;
  const then = deriveProgress(ledger.filter((e) => e.at < cutoff));
  const now = deriveProgress(ledger);
  return {
    days,
    bestWeekday: maxWd > 0 ? DAY_NAMES[byWeekday.indexOf(maxWd)] : null,
    bestTime: bestSlot && bestSlot.count > 0 ? bestSlot.name : null,
    byWeekday,
    bySlot,
    focusWeeks,
    statGrowth: STATS.map((stat) => ({ stat, before: then.statXp[stat], now: now.statXp[stat] })),
  };
}
