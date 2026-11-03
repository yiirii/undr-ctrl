import { STATS, type Stat } from './types';

/** Counted snapshot of state that quests and achievements read. Built by the store. */
export interface Facts {
  tasksDoneTotal: number; tasksDoneToday: number; tasksDoneWeek: number;
  doneTodayByStat: Record<Stat, number>; doneWeekByStat: Record<Stat, number>;
  bigBeforeNoonToday: number;
  myDayTotal: number; myDayDone: number; myDayClearedCount: number;
  expensesLoggedToday: number; entriesTotal: number;
  habitsDueToday: number; habitsDoneToday: number; habitsCount: number; maxStreak: number;
  focusMinutesToday: number; focusMinutesWeek: number; focusMinutesTotal: number; focusSessionsTotal: number;
  depositedWeekSen: number; depositedTotalSen: number; goalsCompleted: number;
  weekDaysElapsed: number; overBudgetThisWeek: boolean; monthsUnderBudget: number;
  statLevels: Record<Stat, number>; charLevel: number;
  nightOwlCount: number; earlyBirdCount: number;
  questsCompleted: number; recapsDone: number; listsCount: number;
  bizSales: number; bizProfitTotalSen: number;
}

const zeroStats = () => Object.fromEntries(STATS.map((s) => [s, 0])) as Record<Stat, number>;
export const emptyFacts = (): Facts => ({
  tasksDoneTotal: 0, tasksDoneToday: 0, tasksDoneWeek: 0, doneTodayByStat: zeroStats(), doneWeekByStat: zeroStats(), bigBeforeNoonToday: 0,
  myDayTotal: 0, myDayDone: 0, myDayClearedCount: 0, expensesLoggedToday: 0, entriesTotal: 0,
  habitsDueToday: 0, habitsDoneToday: 0, habitsCount: 0, maxStreak: 0,
  focusMinutesToday: 0, focusMinutesWeek: 0, focusMinutesTotal: 0, focusSessionsTotal: 0,
  depositedWeekSen: 0, depositedTotalSen: 0, goalsCompleted: 0, weekDaysElapsed: 0, overBudgetThisWeek: false, monthsUnderBudget: 0,
  statLevels: Object.fromEntries(STATS.map((s) => [s, 1])) as Record<Stat, number>, charLevel: 1,
  nightOwlCount: 0, earlyBirdCount: 0, questsCompleted: 0, recapsDone: 0, listsCount: 0, bizSales: 0, bizProfitTotalSen: 0,
});
