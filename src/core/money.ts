import type { Category, Deposit, Goal, IncomeSource, LedgerEntry, MoneyEntry } from './types';
import { addDays, addMonths, daysInMonth, dayOfMonth, diffDays, monthKey, weekday, WEEKDAYS } from './dates';
import { entry } from './ledger';

export interface MoneyState {
  categories: Category[];
  sources: IncomeSource[];
  entries: MoneyEntry[];
  goals: Goal[];
  deposits: Deposit[];
}

export function defaultCategories(): Category[] {
  const c = (id: string, name: string, icon: string, color: string, need: boolean): Category => ({ id, name, icon, color, need, limitSen: 0 });
  return [
    c('food', 'Food', 'bowl', '#ffb86b', true),
    c('transport', 'Transport', 'bus', '#6ec6ff', true),
    c('shopping', 'Shopping', 'bag', '#f59ac6', false),
    c('bills', 'Bills', 'bolt', '#ffd166', true),
    c('fun', 'Fun', 'star', '#b39dff', false),
    c('health', 'Health', 'heart', '#ff8a8a', true),
    c('books', 'Books & Uni', 'book', '#7ee0c3', true),
    c('gifts', 'Gifts', 'gift', '#ff9fb2', false),
    c('subs', 'Subscriptions', 'repeat', '#8fb8ff', false),
    c('other', 'Other', 'dots', '#b5bac1', false),
  ];
}

export function defaultSources(): IncomeSource[] {
  return [
    { id: 'allowance', name: 'Allowance', icon: 'home', expectedSen: 0 },
    { id: 'ptptn', name: 'PTPTN / Scholarship', icon: 'cap', expectedSen: 0 },
    { id: 'parttime', name: 'Part-time', icon: 'clock', expectedSen: 0 },
    { id: 'other-in', name: 'Other', icon: 'dots', expectedSen: 0 },
  ];
}

// ---------- amounts ----------
export function parseAmount(raw: string): number | null {
  let s = raw.trim().replace(/^rm\s*/i, '').replace(/\s+/g, '');
  if (!s) return null;
  if (s.includes(',') && !s.includes('.') && /,\d{2}$/.test(s) && s.split(',').length === 2) s = s.replace(',', '.');
  else s = s.replace(/,(?=\d{3}(\D|$))/g, '');
  if (!/^\d*(\.\d+)?$/.test(s) || s === '.' || s === '') return null;
  const sen = Math.round(parseFloat(s) * 100);
  return Number.isFinite(sen) && sen > 0 ? sen : null;
}

export function formatRM(sen: number, compact = false): string {
  const neg = sen < 0;
  const a = Math.abs(Math.round(sen));
  const rm = Math.floor(a / 100);
  const c = a % 100;
  const body = rm.toLocaleString('en-US') + (c ? `.${String(c).padStart(2, '0')}` : '');
  return `${neg ? '−' : ''}RM${compact ? '' : ' '}${body}`;
}

// ---------- month summary ----------
export type CatStatus = 'calm' | 'warn' | 'over';
export interface CategorySummary { id: string; spentSen: number; limitSen: number; ratio: number; status: CatStatus }
export interface MonthSummary {
  inSen: number; expectedInSen: number; outSen: number; keptSen: number;
  budgetSen: number; leftSen: number; safePerDaySen: number; daysLeft: number; monthElapsed: number;
  categories: CategorySummary[]; hasBudget: boolean;
}

export const inMonth = (e: { date: string }, mk: string) => monthKey(e.date) === mk;

export function statusOf(spent: number, limit: number): { ratio: number; status: CatStatus } {
  if (limit <= 0) return { ratio: spent > 0 ? 1.5 : 0, status: spent > 0 ? 'over' : 'calm' };
  const ratio = spent / limit;
  return { ratio, status: ratio > 1 ? 'over' : ratio >= 0.8 ? 'warn' : 'calm' };
}

export function monthSummary(s: MoneyState, mk: string, today: string): MonthSummary {
  const es = s.entries.filter((e) => inMonth(e, mk));
  const inSen = es.filter((e) => e.kind === 'in').reduce((n, e) => n + e.sen, 0);
  const outSen = es.filter((e) => e.kind === 'out').reduce((n, e) => n + e.sen, 0);
  const expectedInSen = s.sources.reduce((n, x) => n + x.expectedSen, 0);
  const budgetSen = s.categories.reduce((n, c) => n + c.limitSen, 0);
  const dim = daysInMonth(`${mk}-01`);
  const tm = monthKey(today);
  const daysLeft = tm === mk ? dim - dayOfMonth(today) + 1 : tm < mk ? dim : 0;
  const monthElapsed = tm === mk ? dayOfMonth(today) / dim : tm > mk ? 1 : 0;
  const leftSen = budgetSen - outSen;
  const hasBudget = budgetSen > 0;
  const safePerDaySen = hasBudget && daysLeft > 0 ? Math.max(0, Math.floor(leftSen / daysLeft)) : 0;
  const categories = s.categories.map((c) => {
    const spentSen = es.filter((e) => e.kind === 'out' && e.categoryId === c.id).reduce((n, e) => n + e.sen, 0);
    return { id: c.id, spentSen, limitSen: c.limitSen, ...statusOf(spentSen, c.limitSen) };
  });
  return { inSen, expectedInSen, outSen, keptSen: inSen - outSen, budgetSen, leftSen, safePerDaySen, daysLeft, monthElapsed, categories, hasBudget };
}

// ---------- split ----------
export function suggestSplit(monthlyInSen: number, categories: Category[]): { limits: Record<string, number>; savingsSen: number } {
  const needs = categories.filter((c) => c.need);
  const wants = categories.filter((c) => !c.need);
  let needShare = Math.round(monthlyInSen * 0.5);
  let wantShare = Math.round(monthlyInSen * 0.3);
  if (!needs.length) { wantShare += needShare; needShare = 0; }
  if (!wants.length) { needShare += wantShare; wantShare = 0; }
  const limits: Record<string, number> = {};
  const assign = (group: Category[], share: number) => {
    if (!group.length) return;
    const each = Math.floor(share / group.length / 100) * 100;
    for (const c of group) limits[c.id] = each;
  };
  assign(needs, needShare);
  assign(wants, wantShare);
  const used = Object.values(limits).reduce((a, b) => a + b, 0);
  return { limits, savingsSen: monthlyInSen - used };
}

export const unassigned = (monthlyInSen: number, limits: Record<string, number>, savingsSen: number) =>
  monthlyInSen - savingsSen - Object.values(limits).reduce((a, b) => a + b, 0);

export function fitToIncome(monthlyInSen: number, limits: Record<string, number>, savingsSen: number) {
  const total = Object.values(limits).reduce((a, b) => a + b, 0) + savingsSen;
  if (total <= 0) return { limits: { ...limits }, savingsSen: monthlyInSen };
  const k = monthlyInSen / total;
  const out: Record<string, number> = {};
  for (const [id, v] of Object.entries(limits)) out[id] = Math.floor((v * k) / 100) * 100;
  const used = Object.values(out).reduce((a, b) => a + b, 0);
  return { limits: out, savingsSen: monthlyInSen - used };
}

// ---------- wealth ----------
export function dripForDay(s: MoneyState, day: string): number {
  const budgetSen = s.categories.reduce((n, c) => n + c.limitSen, 0);
  if (budgetSen <= 0) return 0;
  return Math.round(budgetSen / 100 / daysInMonth(day));
}

export function wealthEntriesForMoney(e: MoneyEntry, at: string): LedgerEntry[] {
  if (e.kind !== 'out') return [];
  const rm = Math.round(e.sen / 100);
  return rm ? [entry('spend', 'wea', -rm, false, e.id, at)] : [];
}

// ---------- nudges ----------
export interface Nudge { id: string; kind: 'warn' | 'payday' | 'quiet'; text: string; categoryId?: string; goalId?: string; suggestSen?: number }

export function nudge(s: MoneyState, today: string): Nudge | null {
  const mk = monthKey(today);
  const m = monthSummary(s, mk, today);
  const daysAfterToday = daysInMonth(today) - dayOfMonth(today);
  const warn = m.categories.filter((c) => c.limitSen > 0 && c.ratio >= 0.8).sort((a, b) => b.ratio - a.ratio)[0];
  if (warn) {
    const cat = s.categories.find((c) => c.id === warn.id)!;
    const pct = Math.round(warn.ratio * 100);
    if (warn.status === 'over') {
      return { id: `warn-${warn.id}-${mk}-over`, kind: 'warn', categoryId: warn.id, text: `${cat.name} is ${formatRM(warn.spentSen - warn.limitSen)} over for ${monthLabel(mk)}. Easing off a little here keeps the rest of the month calm.` };
    }
    const perDay = daysAfterToday > 0 ? Math.round((warn.limitSen - warn.spentSen) / daysAfterToday / 100) * 100 : warn.limitSen - warn.spentSen;
    return { id: `warn-${warn.id}-${mk}`, kind: 'warn', categoryId: warn.id, text: `${cat.name} is at ${pct}% with ${daysAfterToday} day${daysAfterToday === 1 ? '' : 's'} left. About ${formatRM(perDay)} a day keeps it on track.` };
  }
  const goal = s.goals.find((g) => g.savedSen < g.targetSen);
  const pay = s.entries.filter((e) => e.kind === 'in' && (e.date === today || e.loggedOn === today) && e.sen >= 10000).sort((a, b) => b.sen - a.sen)[0];
  if (pay && goal) {
    const suggestSen = Math.max(1000, Math.round((pay.sen * 0.2) / 1000) * 1000);
    return { id: `payday-${pay.id}`, kind: 'payday', goalId: goal.id, suggestSen, text: `Nice, ${formatRM(pay.sen)} in. Want to put ${formatRM(suggestSen)} toward ${goal.name}?` };
  }
  if (s.entries.length) {
    const last = s.entries.reduce((d, e) => (e.date > d ? e.date : d), '0000-00-00');
    if (diffDays(last, today) >= 3) {
      return { id: `quiet-${today}`, kind: 'quiet', text: `Haven't logged spending since ${dayName(last)}. Anything to add?` };
    }
  }
  return null;
}

const dayName = (k: string) => ({ Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' } as Record<string, string>)[WEEKDAYS[weekday(k)]];
const monthLabel = (mk: string) => new Date(`${mk}-01T00:00:00`).toLocaleString('en-US', { month: 'long' });

// ---------- recap ----------
export interface RecapData {
  month: string; inSen: number; outSen: number; keptSen: number; prevKeptSen: number; deltaKeptSen: number;
  byCategory: { id: string; spentSen: number }[];
  movers: { id: string; deltaSen: number }[];
  withinBudget: number; budgeted: number;
  categories: CategorySummary[];
  goals: { id: string; name: string; savedSen: number; targetSen: number }[];
}

export function recap(s: MoneyState, mk: string): RecapData {
  const cur = monthSummary(s, mk, `${mk}-${String(daysInMonth(`${mk}-01`)).padStart(2, '0')}`);
  const pk = addMonths(mk, -1);
  const prev = monthSummary(s, pk, `${pk}-${String(daysInMonth(`${pk}-01`)).padStart(2, '0')}`);
  const byCategory = cur.categories.filter((c) => c.spentSen > 0).map((c) => ({ id: c.id, spentSen: c.spentSen })).sort((a, b) => b.spentSen - a.spentSen);
  const movers = cur.categories
    .map((c) => ({ id: c.id, deltaSen: c.spentSen - (prev.categories.find((p) => p.id === c.id)?.spentSen ?? 0) }))
    .filter((m) => m.deltaSen !== 0)
    .sort((a, b) => Math.abs(b.deltaSen) - Math.abs(a.deltaSen))
    .slice(0, 3);
  const budgetedCats = cur.categories.filter((c) => c.limitSen > 0);
  return {
    month: mk, inSen: cur.inSen, outSen: cur.outSen, keptSen: cur.keptSen, prevKeptSen: prev.keptSen, deltaKeptSen: cur.keptSen - prev.keptSen,
    byCategory, movers, withinBudget: budgetedCats.filter((c) => c.spentSen <= c.limitSen).length, budgeted: budgetedCats.length,
    categories: cur.categories,
    goals: s.goals.map((g) => ({ id: g.id, name: g.name, savedSen: g.savedSen, targetSen: g.targetSen })),
  };
}

export function goalPlan(g: Goal, today: string): string {
  const left = Math.max(0, g.targetSen - g.savedSen);
  if (left === 0) return 'Done. Well saved.';
  if (!g.deadline) return `${formatRM(left)} to go`;
  const months = Math.max(1, Math.ceil(diffDays(today, g.deadline) / 30.4));
  const per = Math.ceil(left / months / 100) * 100;
  const when = new Date(`${g.deadline}T00:00:00`).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return `${formatRM(per)} a month gets you there by ${when}`;
}

export { addDays };
