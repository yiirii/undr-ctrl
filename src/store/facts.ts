import { emptyFacts, type Facts } from '../core/facts';
import { dayKey, weekStart, diffDays, addMonths, monthKey } from '../core/dates';
import { deriveProgress } from '../core/ledger';
import { STATS, type Stat, type Task } from '../core/types';
import { isScheduled } from '../core/recurrence';
import { monthSummary } from '../core/money';
import type { AppState } from './state';

export const taskStat = (s: AppState, t: Task): Stat | null => (t.stat !== undefined ? t.stat : s.lists.find((l) => l.id === t.listId)?.stat ?? null);

/** Every completion event: non-habit doneAt or habit completion day (time unknown → noon). */
function completions(s: AppState) {
  const out: { at: Date; day: string; task: Task }[] = [];
  for (const t of s.tasks) {
    if (t.habit) for (const d of t.completions) out.push({ at: new Date(`${d}T12:00:00`), day: d, task: t });
    else if (t.doneAt) { const at = new Date(t.doneAt); out.push({ at, day: dayKey(at), task: t }); }
  }
  return out;
}

export const inMyDay = (t: Task, today: string) => (t.habit ? !!t.recurrence && isScheduled(t.recurrence, t.anchor ?? t.createdAt.slice(0, 10), today) : t.myDay === today);

export function buildFacts(s: AppState, now: Date): Facts {
  const f = emptyFacts();
  const today = dayKey(now);
  const ws = weekStart(today, s.settings.weekStartsMonday);
  const comps = completions(s);
  f.tasksDoneTotal = comps.length;
  for (const c of comps) {
    const st = taskStat(s, c.task);
    if (c.day === today) { f.tasksDoneToday++; if (st) f.doneTodayByStat[st]++; if (c.task.size === 'big' && c.at.getHours() < 12 && !c.task.habit) f.bigBeforeNoonToday++; }
    if (c.day >= ws && c.day <= today) { f.tasksDoneWeek++; if (st) f.doneWeekByStat[st]++; }
    if (!c.task.habit) { const h = c.at.getHours(); if (h < 4) f.nightOwlCount++; if (h >= 4 && h < 7) f.earlyBirdCount++; }
  }
  const myDay = s.tasks.filter((t) => inMyDay(t, today));
  f.myDayTotal = myDay.length;
  f.myDayDone = myDay.filter((t) => (t.habit ? t.completions.includes(today) : !!t.doneAt)).length;
  f.myDayClearedCount = s.myDayCleared.length;
  const habits = s.tasks.filter((t) => t.habit);
  f.habitsCount = habits.length;
  f.habitsDueToday = habits.filter((t) => inMyDay(t, today)).length;
  f.habitsDoneToday = habits.filter((t) => t.completions.includes(today)).length;
  f.maxStreak = Math.max(0, ...habits.map((t) => t.streak));
  f.expensesLoggedToday = s.money.entries.filter((e) => e.kind === 'out' && e.loggedOn === today).length;
  f.entriesTotal = s.money.entries.length;
  for (const fl of s.focusLog) {
    f.focusMinutesTotal += fl.minutes;
    if (fl.completed) f.focusSessionsTotal++;
    if (fl.day === today) f.focusMinutesToday += fl.minutes;
    if (fl.day >= ws) f.focusMinutesWeek += fl.minutes;
  }
  for (const d of s.money.deposits) { f.depositedTotalSen += d.sen; if (d.date >= ws) f.depositedWeekSen += d.sen; }
  f.goalsCompleted = s.money.goals.filter((g) => g.savedSen >= g.targetSen && g.targetSen > 0).length;
  f.weekDaysElapsed = Math.min(7, diffDays(ws, today) + 1);
  const ms = monthSummary(s.money, monthKey(today), today);
  f.overBudgetThisWeek = ms.categories.some((c) => c.limitSen > 0 && c.status === 'over');
  // completed months fully within budget (only months that had a budget and spending)
  const budgeted = s.money.categories.some((c) => c.limitSen > 0);
  if (budgeted && s.money.entries.length) {
    const first = s.money.entries.reduce((m, e) => (e.date < m ? e.date : m), today).slice(0, 7);
    for (let mk = first; mk < monthKey(today); mk = addMonths(mk, 1)) {
      const m = monthSummary(s.money, mk, today);
      if (m.outSen > 0 && m.categories.every((c) => c.limitSen === 0 || c.spentSen <= c.limitSen)) f.monthsUnderBudget++;
    }
  }
  const p = deriveProgress(s.ledger);
  for (const st of STATS) f.statLevels[st] = p.stats[st].level;
  f.charLevel = p.char.level;
  f.questsCompleted = s.questsCompleted;
  f.recapsDone = s.money.recapsSeen.length;
  f.listsCount = s.lists.length;
  return f;
}

/** Recent completions per stat (14 days) for quest weighting. */
export function statUsage(s: AppState, now: Date): Partial<Record<Stat, number>> {
  const today = dayKey(now);
  const u: Partial<Record<Stat, number>> = {};
  for (const c of completions(s)) {
    if (diffDays(c.day, today) > 14) continue;
    const st = taskStat(s, c.task);
    if (st) u[st] = (u[st] ?? 0) + 1;
  }
  return u;
}
