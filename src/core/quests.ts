import type { Quest, Stat } from './types';
import type { Facts } from './facts';

export interface QuestTemplate {
  id: string; kind: 'daily' | 'weekly'; label: string; target: number; stat?: Stat; unit?: 'sen' | 'min';
  value: (f: Facts) => number;
  dynamicTarget?: (f: Facts) => number;
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  { id: 'd-int2', kind: 'daily', label: 'Complete 2 Intelligence tasks', target: 2, stat: 'int', value: (f) => f.doneTodayByStat.int },
  { id: 'd-str1', kind: 'daily', label: 'Do 1 Strength task', target: 1, stat: 'str', value: (f) => f.doneTodayByStat.str },
  { id: 'd-clear', kind: 'daily', label: 'Clear My Day', target: 1, value: (f) => f.myDayDone, dynamicTarget: (f) => f.myDayTotal },
  { id: 'd-log', kind: 'daily', label: 'Log your spending today', target: 1, value: (f) => f.expensesLoggedToday },
  { id: 'd-streak', kind: 'daily', label: 'Keep a habit streak alive', target: 1, value: (f) => f.habitsDoneToday },
  { id: 'd-big', kind: 'daily', label: 'Finish a Big task before noon', target: 1, value: (f) => f.bigBeforeNoonToday },
  { id: 'd-three', kind: 'daily', label: 'Complete 3 tasks', target: 3, value: (f) => f.tasksDoneToday },
  { id: 'd-focus', kind: 'daily', label: 'Focus for 50 minutes today', target: 50, unit: 'min', value: (f) => f.focusMinutesToday },
  { id: 'd-cre', kind: 'daily', label: 'Make something: 1 Creativity task', target: 1, stat: 'cre', value: (f) => f.doneTodayByStat.cre },
  { id: 'd-cha', kind: 'daily', label: 'Reach out: 1 Charisma task', target: 1, stat: 'cha', value: (f) => f.doneTodayByStat.cha },
  { id: 'd-dis', kind: 'daily', label: 'Tidy up: 2 Discipline tasks', target: 2, stat: 'dis', value: (f) => f.doneTodayByStat.dis },
  { id: 'w-workout', kind: 'weekly', label: 'Work out 3 times', target: 3, stat: 'str', value: (f) => f.doneWeekByStat.str },
  { id: 'w-budget', kind: 'weekly', label: 'Stay under budget in every category this week', target: 7, value: (f) => (f.overBudgetThisWeek ? 0 : f.weekDaysElapsed) },
  { id: 'w-save', kind: 'weekly', label: 'Add RM 50 to savings', target: 5000, unit: 'sen', value: (f) => f.depositedWeekSen },
  { id: 'w-tasks', kind: 'weekly', label: 'Complete 15 tasks', target: 15, value: (f) => f.tasksDoneWeek },
  { id: 'w-focus', kind: 'weekly', label: 'Focus for 3 hours this week', target: 180, unit: 'min', value: (f) => f.focusMinutesWeek },
  { id: 'w-int', kind: 'weekly', label: 'Complete 6 Intelligence tasks', target: 6, stat: 'int', value: (f) => f.doneWeekByStat.int },
];

const tpl = (id: string) => QUEST_TEMPLATES.find((t) => t.id === id)!;

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}

/** usage: recent completions per stat. Templates for unused stats are less likely. */
function pick(pool: QuestTemplate[], n: number, seed: string, usage: Partial<Record<Stat, number>>): QuestTemplate[] {
  const r = rng(seed);
  const left = [...pool];
  const out: QuestTemplate[] = [];
  const anyUsage = Object.values(usage).some((v) => (v ?? 0) > 0);
  while (out.length < n && left.length) {
    const w = left.map((t) => (t.stat && anyUsage && !(usage[t.stat] ?? 0) ? 0.25 : 1));
    let x = r() * w.reduce((a, b) => a + b, 0);
    let i = 0;
    for (; i < w.length - 1; i++) { x -= w[i]; if (x <= 0) break; }
    out.push(left.splice(i, 1)[0]);
  }
  return out;
}

export function rollQuests(period: string, kind: 'daily' | 'weekly', usage: Partial<Record<Stat, number>>): Quest[] {
  const pool = QUEST_TEMPLATES.filter((t) => t.kind === kind);
  return pick(pool, kind === 'daily' ? 3 : 2, `${kind}-${period}`, usage).map((t) => ({
    id: `${period}-${t.id}`, templateId: t.id, kind, period, label: t.label, target: t.target, claimed: false,
  }));
}

export function rerollOne(quests: Quest[], questId: string, seed: string): Quest[] {
  const q = quests.find((x) => x.id === questId);
  if (!q) return quests;
  const used = new Set(quests.map((x) => x.templateId));
  const pool = QUEST_TEMPLATES.filter((t) => t.kind === q.kind && !used.has(t.id));
  if (!pool.length) return quests;
  const [t] = pick(pool, 1, seed, {});
  const nq: Quest = { id: `${q.period}-${t.id}`, templateId: t.id, kind: q.kind, period: q.period, label: t.label, target: t.target, claimed: false };
  return quests.map((x) => (x.id === questId ? nq : x));
}

export function questProgress(q: Quest, f: Facts): { done: number; target: number; complete: boolean } {
  const t = tpl(q.templateId);
  const target = t.dynamicTarget ? Math.max(1, t.dynamicTarget(f)) : q.target;
  const done = Math.min(target, Math.max(0, t.value(f)));
  const valid = t.dynamicTarget ? t.dynamicTarget(f) > 0 : true;
  return { done, target, complete: valid && done >= target };
}

export const questUnit = (q: Quest) => tpl(q.templateId)?.unit;
export const questStat = (q: Quest) => tpl(q.templateId)?.stat;
