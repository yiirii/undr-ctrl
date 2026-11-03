// Pure state transitions. Every action returns { state, moments }.
import type { AppState } from './state';
import type { Goal, MoneyEntry, Recurrence, Size, Stat, Task } from '../core/types';
import { STATS } from '../core/types';
import { uid } from '../core/id';
import { entry, deriveProgress, reverse } from '../core/ledger';
import { taskXp, focusXp, QUEST_XP, BOOKKEEPING_XP, RECAP_XP, SAVINGS_XP_PER_RM } from '../core/rules';
import { dayKey, addDays, weekStart, addMonths, monthKey, daysInMonth, dayOfMonth } from '../core/dates';
import { nextOccurrence, streakAfter } from '../core/recurrence';
import { dripForDay, wealthEntriesForMoney } from '../core/money';
import { rollQuests, rerollOne, questProgress } from '../core/quests';
import { newlyUnlocked, TIER_XP, ACHIEVEMENTS } from '../core/achievements';
import { unlocksAt, unlocksForAchievement, type Unlock } from '../core/unlocks';
import * as F from '../core/focus';
import { wealthForSale, wealthForBizExpense, wealthForBuy, wealthForDeposit, wealthForBizIncome, itemProfit, bizMonth, type BizItem } from '../core/business';
import { buildFacts, inMyDay, statUsage, taskStat } from './facts';

export type Moment =
  | { type: 'taskCompleted'; xp: number; stat: Stat | null; taskId: string }
  | { type: 'statLevelUp'; stat: Stat; level: number }
  | { type: 'levelUp'; level: number; unlocks: Unlock[] }
  | { type: 'questCompleted'; questId: string; label: string; xp: number }
  | { type: 'achievementUnlocked'; id: string; name: string; tier: string; xp: number; unlocks: Unlock[] }
  | { type: 'streakMilestone'; taskId: string; streak: number }
  | { type: 'focusDone'; taskId: string; xp: number; completed: boolean }
  | { type: 'xp'; amount: number; stat: Stat | null; label: string }
  | { type: 'sale'; profitSen: number; itemId: string; record: boolean }
  | { type: 'combo'; count: number; bonus: number };

export interface Result { state: AppState; moments: Moment[] }
const iso = (d: Date) => d.toISOString();

/** Claims quests and achievements unlocked by the change and reports level-ups. */
function settle(before: AppState, after: AppState, now: Date, moments: Moment[]): Result {
  let s = after;
  const today = dayKey(now);
  // quests
  for (let pass = 0; pass < 2; pass++) {
    const facts = buildFacts(s, now);
    let changed = false;
    const quests = s.quests.map((q) => {
      if (q.claimed) return q;
      if (q.kind === 'daily' && q.period !== today) return q;
      if (questProgress(q, facts).complete) {
        changed = true;
        const xp = QUEST_XP[q.kind];
        s = { ...s, ledger: [...s.ledger, entry('quest', null, xp, true, `quest:${q.id}`, iso(now))], questsCompleted: s.questsCompleted + 1 };
        moments.push({ type: 'questCompleted', questId: q.id, label: q.label, xp });
        return { ...q, claimed: true };
      }
      return q;
    });
    if (changed) s = { ...s, quests };
    // achievements
    const fresh = newlyUnlocked(s.achievements, buildFacts(s, now));
    if (fresh.length) {
      changed = true;
      s = {
        ...s,
        achievements: [...s.achievements, ...fresh.map((a) => a.id)],
        ledger: [...s.ledger, ...fresh.map((a) => entry('achievement', null, TIER_XP[a.tier], true, `ach:${a.id}`, iso(now)))],
      };
      for (const a of fresh) moments.push({ type: 'achievementUnlocked', id: a.id, name: a.name, tier: a.tier, xp: TIER_XP[a.tier], unlocks: unlocksForAchievement(a.id) });
    }
    if (!changed) break;
  }
  // My Day cleared bookkeeping
  const f = buildFacts(s, now);
  if (f.myDayTotal > 0 && f.myDayDone === f.myDayTotal && !s.myDayCleared.includes(today)) s = { ...s, myDayCleared: [...s.myDayCleared, today] };
  // level-ups
  const p0 = deriveProgress(before.ledger), p1 = deriveProgress(s.ledger);
  for (const st of STATS) if (p1.stats[st].level > p0.stats[st].level) moments.push({ type: 'statLevelUp', stat: st, level: p1.stats[st].level });
  if (p1.char.level > p0.char.level) {
    const unlocks: Unlock[] = [];
    for (let l = p0.char.level + 1; l <= p1.char.level; l++) unlocks.push(...unlocksAt(l));
    moments.push({ type: 'levelUp', level: p1.char.level, unlocks });
  }
  return { state: s, moments };
}

const done = (state: AppState): Result => ({ state, moments: [] });

// ---------------- tasks ----------------
export interface NewTask { title: string; listId: string; notes?: string; size?: Size; stat?: Stat | null; due?: string; time?: string; remind?: boolean; recurrence?: Recurrence; anchor?: string; habit?: boolean; myDay?: boolean }

export function addTask(s: AppState, n: NewTask, now: Date): Result {
  const title = n.title.trim();
  if (!title) return done(s);
  const today = dayKey(now);
  const t: Task = {
    id: uid(), title, notes: n.notes ?? '', listId: s.lists.some((l) => l.id === n.listId) ? n.listId : s.lists[0]?.id ?? 'personal',
    size: n.size ?? 'normal', due: n.due, time: n.time, remind: n.remind ?? !!n.time, recurrence: n.recurrence,
    anchor: n.recurrence ? n.anchor ?? n.due ?? today : undefined, habit: n.habit, completions: [], streak: 0,
    myDay: n.myDay ? today : undefined, createdAt: iso(now), order: s.tasks.length ? Math.max(...s.tasks.map((x) => x.order)) + 1 : 0,
  };
  if (n.stat !== undefined) t.stat = n.stat;
  return done({ ...s, tasks: [...s.tasks, t] });
}

export function updateTask(s: AppState, id: string, patch: Partial<Task>): Result {
  return done({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch, id } : t)) });
}

export function deleteTask(s: AppState, id: string): Result {
  return done({ ...s, tasks: s.tasks.filter((t) => t.id !== id) });
}

export function toggleMyDay(s: AppState, id: string, now: Date): Result {
  const today = dayKey(now);
  return done({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, myDay: t.myDay === today ? undefined : today } : t)) });
}

export function completeTask(s: AppState, id: string, now: Date): Result {
  const t = s.tasks.find((x) => x.id === id);
  if (!t) return done(s);
  const today = dayKey(now);
  const stat = taskStat(s, t);
  const moments: Moment[] = [];
  let next: AppState;
  if (t.habit && t.recurrence) {
    if (t.completions.includes(today)) return done(s);
    const completions = [...t.completions, today];
    const streak = streakAfter(new Set(completions), t.recurrence, t.anchor ?? today, today);
    const xp = taskXp(t.size, { streak });
    next = {
      ...s,
      tasks: s.tasks.map((x) => (x.id === id ? { ...x, completions, streak } : x)),
      ledger: [...s.ledger, entry('habit', stat, xp, true, `habit:${id}:${today}`, iso(now))],
    };
    moments.push({ type: 'taskCompleted', xp, stat, taskId: id });
    if ([7, 30, 100].includes(streak)) moments.push({ type: 'streakMilestone', taskId: id, streak });
  } else {
    if (t.doneAt) return done(s);
    const onTime = !!t.due && today <= t.due;
    const xp = taskXp(t.size, { onTime });
    let tasks = s.tasks.map((x) => (x.id === id ? { ...x, doneAt: iso(now) } : x));
    if (t.recurrence) {
      const after = t.due && t.due > today ? t.due : today;
      const nextDue = nextOccurrence(t.recurrence, t.anchor ?? today, after);
      const spawn: Task = { ...t, id: uid(), doneAt: undefined, spawnedId: undefined, due: nextDue, myDay: undefined, completions: [], createdAt: iso(now), order: t.order + 0.001 };
      tasks = tasks.map((x) => (x.id === id ? { ...x, spawnedId: spawn.id } : x));
      tasks.push(spawn);
    }
    next = { ...s, tasks, ledger: [...s.ledger, entry('task', stat, xp, true, `task:${id}`, iso(now))] };
    moments.push({ type: 'taskCompleted', xp, stat, taskId: id });
  }
  return settle(s, next, now, moments);
}

export function uncompleteTask(s: AppState, id: string, now: Date): Result {
  const t = s.tasks.find((x) => x.id === id);
  if (!t) return done(s);
  const today = dayKey(now);
  if (t.habit && t.recurrence) {
    if (!t.completions.includes(today)) return done(s);
    const completions = t.completions.filter((d) => d !== today);
    const streak = streakAfter(new Set(completions), t.recurrence, t.anchor ?? today, today);
    return done({ ...s, tasks: s.tasks.map((x) => (x.id === id ? { ...x, completions, streak } : x)), ledger: reverse(s.ledger, `habit:${id}:${today}`, iso(now)) });
  }
  if (!t.doneAt) return done(s);
  let tasks = s.tasks.map((x) => (x.id === id ? { ...x, doneAt: undefined, spawnedId: undefined } : x));
  if (t.spawnedId) {
    const sp = tasks.find((x) => x.id === t.spawnedId);
    if (sp && !sp.doneAt) tasks = tasks.filter((x) => x.id !== t.spawnedId);
  }
  return done({ ...s, tasks, ledger: reverse(s.ledger, `task:${id}`, iso(now)) });
}

// ---------------- lists ----------------
export function addList(s: AppState, l: { name: string; icon?: string; color?: string; stat: Stat | null; emoji?: string }): Result {
  const name = l.name.trim();
  if (!name) return done(s);
  return done({ ...s, lists: [...s.lists, { id: uid(), name, icon: l.icon ?? 'dot', color: l.color ?? '#b5bac1', stat: l.stat, emoji: l.emoji }] });
}
export function updateList(s: AppState, id: string, patch: Partial<AppState['lists'][number]>): Result {
  return done({ ...s, lists: s.lists.map((l) => (l.id === id ? { ...l, ...patch, id } : l)) });
}
export function deleteList(s: AppState, id: string): Result {
  if (s.lists.length <= 1) return done(s);
  const fallback = s.lists.find((l) => l.id !== id)!.id;
  return done({ ...s, lists: s.lists.filter((l) => l.id !== id), tasks: s.tasks.map((t) => (t.listId === id ? { ...t, listId: fallback } : t)) });
}

// ---------------- money ----------------
export interface NewMoney { kind: 'in' | 'out'; sen: number; categoryId?: string; sourceId?: string; note: string; date: string; repeatMonthly?: boolean }

const hasBudget = (s: AppState) => s.money.categories.some((c) => c.limitSen > 0);

function moneyLedger(s: AppState, e: MoneyEntry, now: Date) {
  const out = hasBudget(s) ? wealthEntriesForMoney(e, iso(now)) : [];
  if (e.date === e.loggedOn && !e.autoFrom) out.push(entry('bookkeeping', null, BOOKKEEPING_XP, true, e.id, iso(now)));
  return out;
}

export function logMoney(s: AppState, n: NewMoney, now: Date): Result {
  if (!(n.sen > 0) || !Number.isFinite(n.sen)) return done(s);
  const e: MoneyEntry = { id: uid(), kind: n.kind, sen: Math.round(n.sen), note: n.note.trim(), date: n.date, loggedOn: dayKey(now), repeatMonthly: n.repeatMonthly || undefined };
  if (n.kind === 'out') e.categoryId = n.categoryId ?? 'other'; else e.sourceId = n.sourceId ?? s.money.sources[0]?.id;
  const next = { ...s, money: { ...s.money, entries: [...s.money.entries, e] }, ledger: [...s.ledger, ...moneyLedger(s, e, now)] };
  return settle(s, next, now, []);
}

export function editMoney(s: AppState, id: string, patch: Partial<NewMoney>, now: Date): Result {
  const old = s.money.entries.find((e) => e.id === id);
  if (!old) return done(s);
  if (patch.sen !== undefined && !(patch.sen > 0)) return done(s);
  const e: MoneyEntry = { ...old, ...patch, id };
  const ledger = reverse(s.ledger, id, iso(now));
  const hadWealth = s.ledger.some((x) => x.ref === id && x.source === 'spend' && !x.reversed);
  const comp = hadWealth ? wealthEntriesForMoney(e, iso(now)) : [];
  const hadBook = s.ledger.some((x) => x.ref === id && x.source === 'bookkeeping' && !x.reversed);
  if (hadBook) comp.push(entry('bookkeeping', null, BOOKKEEPING_XP, true, id, iso(now)));
  return settle(s, { ...s, money: { ...s.money, entries: s.money.entries.map((x) => (x.id === id ? e : x)) }, ledger: [...ledger, ...comp] }, now, []);
}

export function deleteMoney(s: AppState, id: string, now: Date): Result {
  return done({ ...s, money: { ...s.money, entries: s.money.entries.filter((e) => e.id !== id) }, ledger: reverse(s.ledger, id, iso(now)) });
}

export function setBudget(s: AppState, b: { limits: Record<string, number>; savingsSen: number; expected: Record<string, number>; categoryIds?: string[] }, now: Date): Result {
  let categories = s.money.categories;
  if (b.categoryIds) categories = categories.filter((c) => b.categoryIds!.includes(c.id));
  categories = categories.map((c) => ({ ...c, limitSen: b.limits[c.id] ?? 0 }));
  const sources = s.money.sources.map((x) => ({ ...x, expectedSen: b.expected[x.id] ?? x.expectedSen }));
  return done({ ...s, money: { ...s.money, categories, sources, savingsTargetSen: b.savingsSen, setupDone: true } });
}

export function upsertCategory(s: AppState, c: Partial<AppState['money']['categories'][number]> & { name: string }): Result {
  if (c.id && s.money.categories.some((x) => x.id === c.id)) return done({ ...s, money: { ...s.money, categories: s.money.categories.map((x) => (x.id === c.id ? { ...x, ...c } : x)) } });
  return done({ ...s, money: { ...s.money, categories: [...s.money.categories, { id: uid(), icon: 'dot', color: '#b5bac1', limitSen: 0, need: false, ...c }] } });
}

export function addSource(s: AppState, name: string, expectedSen = 0): Result {
  return done({ ...s, money: { ...s.money, sources: [...s.money.sources, { id: uid(), name, icon: 'dot', expectedSen }] } });
}

export function addGoal(s: AppState, g: { name: string; targetSen: number; deadline?: string }, now: Date): Result {
  if (!g.name.trim() || !(g.targetSen > 0)) return done(s);
  const goal: Goal = { id: uid(), name: g.name.trim(), targetSen: g.targetSen, deadline: g.deadline, savedSen: 0, createdAt: iso(now) };
  return done({ ...s, money: { ...s.money, goals: [...s.money.goals, goal] } });
}
export function deleteGoal(s: AppState, id: string): Result {
  return done({ ...s, money: { ...s.money, goals: s.money.goals.filter((g) => g.id !== id) } });
}

export function deposit(s: AppState, goalId: string, sen: number, now: Date): Result {
  if (!(sen > 0) || !s.money.goals.some((g) => g.id === goalId)) return done(s);
  const d = { id: uid(), goalId, sen: Math.round(sen), date: dayKey(now) };
  const xp = Math.round(sen / 100) * SAVINGS_XP_PER_RM;
  const next = {
    ...s,
    money: { ...s.money, deposits: [...s.money.deposits, d], goals: s.money.goals.map((g) => (g.id === goalId ? { ...g, savedSen: g.savedSen + d.sen } : g)) },
    ledger: [...s.ledger, entry('deposit', 'wea', xp, true, d.id, iso(now))],
  };
  return settle(s, next, now, [{ type: 'xp', amount: xp, stat: 'wea', label: 'Saved' }]);
}

export function dismissNudge(s: AppState, id: string): Result {
  return done({ ...s, money: { ...s.money, dismissedNudges: [...s.money.dismissedNudges, id] } });
}

export function finishRecap(s: AppState, mk: string, now: Date): Result {
  if (s.money.recapsSeen.includes(mk)) return done(s);
  const next = { ...s, money: { ...s.money, recapsSeen: [...s.money.recapsSeen, mk] }, ledger: [...s.ledger, entry('recap', null, RECAP_XP, true, `recap:${mk}`, iso(now))] };
  return settle(s, next, now, [{ type: 'xp', amount: RECAP_XP, stat: null, label: 'Recap' }]);
}

// ---------------- business ----------------
// Wealth follows cash (see core/business): buy = -cost, money received = +. Refs: buy:<id>, rev:<id>, dep:<id>.
const BIZ_LIST = 'business';
function withBizList(s: AppState): AppState {
  if (s.lists.some((l) => l.id === BIZ_LIST)) return s;
  return { ...s, lists: [...s.lists, { id: BIZ_LIST, name: 'Business', icon: 'bag', stat: 'wea', color: '#9fd36a' }] };
}
function addLinkedTask(s: AppState, title: string, due: string, link: NonNullable<Task['link']>, now: Date): AppState {
  const s2 = withBizList(s);
  const t: Task = { id: uid(), title, notes: '', listId: BIZ_LIST, size: 'quick', due, completions: [], streak: 0, createdAt: iso(now), order: s2.tasks.length ? Math.max(...s2.tasks.map((x) => x.order)) + 1 : 0, link };
  return { ...s2, tasks: [...s2.tasks, t] };
}
/** Remove open (not done) linked tasks for an item, optionally only of one kind. */
function dropLinkedTasks(s: AppState, itemId: string, kind?: NonNullable<Task['link']>['kind']): AppState {
  return { ...s, tasks: s.tasks.filter((t) => !(t.link?.itemId === itemId && !t.doneAt && (!kind || t.link.kind === kind))) };
}
const setItem = (s: AppState, it: BizItem): AppState => ({ ...s, business: { ...s.business, items: s.business.items.map((i) => (i.id === it.id ? it : i)) } });
const posSen = (n?: number) => (n && n > 0 ? Math.round(n) : undefined);

export function addBizItems(s: AppState, n: { name: string; costSen: number; qty: number; boughtOn: string; askSen?: number; note?: string; kept?: boolean }, now: Date): Result {
  const name = n.name.trim();
  const qty = Math.max(1, Math.min(200, Math.floor(n.qty || 1)));
  if (!name || !(n.costSen > 0)) return done(s);
  const items: BizItem[] = Array.from({ length: qty }, () => ({ id: uid(), name, costSen: Math.round(n.costSen), boughtOn: n.boughtOn, status: n.kept ? 'kept' : 'stock', askSen: n.kept ? undefined : posSen(n.askSen), note: n.note }));
  const book = n.boughtOn === dayKey(now) ? [entry('bookkeeping', null, BOOKKEEPING_XP, true, `bought:${items[0].id}`, iso(now))] : [];
  const cost = items.flatMap((i) => wealthForBuy(i, iso(now)));
  return settle(s, { ...s, business: { ...s.business, items: [...s.business.items, ...items] }, ledger: [...s.ledger, ...cost, ...book] }, now, []);
}

export function sellBizItem(s: AppState, id: string, sale: { soldSen: number; feesSen?: number; soldOn: string; platform?: string; ship?: boolean }, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || !(it.status === 'stock' || it.status === 'kept') || !(sale.soldSen > 0)) return done(s);
  const sold: BizItem = { ...it, status: 'sold', soldSen: Math.round(sale.soldSen), feesSen: posSen(sale.feesSen), soldOn: sale.soldOn, platform: sale.platform || undefined };
  const book = sale.soldOn === dayKey(now) ? [entry('bookkeeping', null, BOOKKEEPING_XP, true, `sale:${id}`, iso(now))] : [];
  let next = { ...setItem(s, sold), ledger: [...s.ledger, ...wealthForSale(sold, iso(now)), ...book] };
  if (sale.ship) next = addLinkedTask(next, `Ship ${it.name}`, addDays(dayKey(now), 1), { kind: 'biz-ship', itemId: id }, now);
  return settle(s, next, now, [{ type: 'sale', profitSen: itemProfit(sold), itemId: id, record: isProfitRecord(s, next, sale.soldOn) }]);
}

/** Undo a sale. A piece that came from a reservation goes back to reserved (deposit held again). */
export function unsellBizItem(s: AppState, id: string, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || it.status !== 'sold') return done(s);
  const back: BizItem = { ...it, status: it.reservation ? 'reserved' : 'stock', soldSen: undefined, feesSen: undefined, soldOn: undefined, platform: it.reservation ? it.platform : undefined };
  let ledger = reverse(reverse(s.ledger, `rev:${id}`, iso(now)), `sale:${id}`, iso(now));
  if (it.reservation) ledger = [...ledger, ...wealthForDeposit(back, iso(now))];
  let next = dropLinkedTasks({ ...setItem(s, back), ledger }, id, 'biz-ship');
  if (it.reservation) next = { ...next, tasks: next.tasks.map((t) => (t.link?.itemId === id && t.link.kind === 'biz-collect' ? { ...t, doneAt: undefined } : t)), ledger: reverse(next.ledger, `task:${next.tasks.find((t) => t.link?.itemId === id && t.link.kind === 'biz-collect')?.id}`, iso(now)) };
  return done(next);
}

export function editBizItem(s: AppState, id: string, patch: Partial<Pick<BizItem, 'name' | 'costSen' | 'askSen' | 'note' | 'soldSen' | 'feesSen' | 'soldOn' | 'platform' | 'boughtOn' | 'valueSen'>>, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it) return done(s);
  if ((patch.costSen !== undefined && !(patch.costSen > 0)) || (patch.soldSen !== undefined && !(patch.soldSen > 0))) return done(s);
  const nx: BizItem = { ...it, ...patch, id, status: it.status };
  let ledger = s.ledger;
  if (nx.costSen !== it.costSen) ledger = [...reverse(ledger, `buy:${id}`, iso(now)), ...wealthForBuy(nx, iso(now))];
  if (it.status === 'sold' && (nx.soldSen !== it.soldSen || nx.feesSen !== it.feesSen)) ledger = [...reverse(ledger, `rev:${id}`, iso(now)), ...wealthForSale(nx, iso(now))];
  return done({ ...setItem(s, nx), ledger });
}

export function deleteBizItem(s: AppState, id: string, now: Date): Result {
  let ledger = s.ledger;
  for (const r of [`buy:${id}`, `rev:${id}`, `dep:${id}`, `sale:${id}`, id]) ledger = reverse(ledger, r, iso(now));
  const next = dropLinkedTasks({ ...s, business: { ...s.business, items: s.business.items.filter((i) => i.id !== id) }, ledger }, id);
  return done(next);
}

export function keepBizItem(s: AppState, id: string): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || it.status !== 'stock') return done(s);
  return done(setItem(s, { ...it, status: 'kept' }));
}
export function unkeepBizItem(s: AppState, id: string): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || it.status !== 'kept') return done(s);
  return done(setItem(s, { ...it, status: 'stock' }));
}
export function setBizValue(s: AppState, id: string, valueSen: number | undefined, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it) return done(s);
  return done(setItem(s, { ...it, valueSen: posSen(valueSen), valueOn: posSen(valueSen) ? dayKey(now) : undefined }));
}

export function reserveBizItem(s: AppState, id: string, r: { depositSen: number; dueOn: string; platform?: string; note?: string }, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || !(it.status === 'stock' || it.status === 'kept') || !(r.depositSen > 0) || !r.dueOn) return done(s);
  const res: BizItem = { ...it, status: 'reserved', platform: r.platform || undefined, reservation: { depositSen: Math.round(r.depositSen), dueOn: r.dueOn, on: dayKey(now), note: r.note?.trim() || undefined } };
  let next: AppState = { ...setItem(s, res), ledger: [...s.ledger, ...wealthForDeposit(res, iso(now))] };
  next = addLinkedTask(next, `Collect balance: ${it.name}`, r.dueOn, { kind: 'biz-collect', itemId: id }, now);
  return settle(s, next, now, []);
}

export function completeReservation(s: AppState, id: string, p: { balanceSen: number; feesSen?: number; soldOn: string; ship?: boolean }, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || it.status !== 'reserved' || !it.reservation || !(p.balanceSen >= 0)) return done(s);
  const sold: BizItem = { ...it, status: 'sold', soldSen: it.reservation.depositSen + Math.round(p.balanceSen), feesSen: posSen(p.feesSen), soldOn: p.soldOn };
  const book = p.soldOn === dayKey(now) ? [entry('bookkeeping', null, BOOKKEEPING_XP, true, `sale:${id}`, iso(now))] : [];
  let next: AppState = { ...setItem(s, sold), ledger: [...reverse(s.ledger, `dep:${id}`, iso(now)), ...wealthForSale(sold, iso(now)), ...book] };
  if (p.ship) next = addLinkedTask(next, `Ship ${it.name}`, addDays(dayKey(now), 1), { kind: 'biz-ship', itemId: id }, now);
  const moments: Moment[] = [{ type: 'sale', profitSen: itemProfit(sold), itemId: id, record: isProfitRecord(s, next, p.soldOn) }];
  const collect = next.tasks.find((t) => t.link?.itemId === id && t.link.kind === 'biz-collect' && !t.doneAt);
  if (collect) { const r = completeTask(next, collect.id, now); next = r.state; moments.push(...r.moments); }
  return settle(s, next, now, moments);
}

export function cancelReservation(s: AppState, id: string, o: { keepDeposit: boolean }, now: Date): Result {
  const it = s.business.items.find((i) => i.id === id);
  if (!it || it.status !== 'reserved' || !it.reservation) return done(s);
  const back: BizItem = { ...it, status: 'stock', reservation: undefined, platform: undefined };
  let next: AppState = { ...setItem(s, back), ledger: reverse(s.ledger, `dep:${id}`, iso(now)) };
  if (o.keepDeposit) {
    const inc = { id: uid(), sen: it.reservation.depositSen, label: `Kept deposit: ${it.name}`, date: dayKey(now) };
    next = { ...next, business: { ...next.business, income: [...next.business.income, inc] }, ledger: [...next.ledger, ...wealthForBizIncome(inc, iso(now))] };
  }
  return done(dropLinkedTasks(next, id));
}

export function deleteBizIncome(s: AppState, id: string, now: Date): Result {
  return done({ ...s, business: { ...s.business, income: s.business.income.filter((e) => e.id !== id) }, ledger: reverse(s.ledger, id, iso(now)) });
}

export function setPlatforms(s: AppState, platforms: string[]): Result {
  const clean = [...new Set(platforms.map((p) => p.trim()).filter(Boolean))].slice(0, 12);
  return done({ ...s, business: { ...s.business, platforms: clean } });
}

/** A new best month: this month's profit beats every earlier month and is positive. */
function isProfitRecord(before: AppState, after: AppState, soldOn: string): boolean {
  const mk = monthKey(soldOn);
  const p = (st: AppState, k: string) => bizMonth(st.business.items, st.business.expenses, k, st.business.income).profitSen;
  const now = p(after, mk);
  if (now <= 0 || now <= p(before, mk)) return false;
  const months = new Set(after.business.items.filter((i) => i.soldOn).map((i) => monthKey(i.soldOn!)));
  months.delete(mk);
  if (months.size === 0) return false; // first month is not a "record"
  return [...months].every((k) => p(after, k) < now) && p(before, mk) <= Math.max(...[...months].map((k) => p(after, k)));
}

export function addBizExpense(s: AppState, n: { sen: number; label: string; date: string }, now: Date): Result {
  if (!(n.sen > 0)) return done(s);
  const e = { id: uid(), sen: Math.round(n.sen), label: n.label.trim() || 'Business cost', date: n.date };
  return settle(s, { ...s, business: { ...s.business, expenses: [...s.business.expenses, e] }, ledger: [...s.ledger, ...wealthForBizExpense(e, iso(now))] }, now, []);
}

export function deleteBizExpense(s: AppState, id: string, now: Date): Result {
  return done({ ...s, business: { ...s.business, expenses: s.business.expenses.filter((e) => e.id !== id) }, ledger: reverse(s.ledger, id, iso(now)) });
}

// ---------------- quests ----------------
export function rerollQuest(s: AppState, questId: string, now: Date): Result {
  const today = dayKey(now);
  if (s.rerollDay === today) return done(s);
  const q = s.quests.find((x) => x.id === questId);
  if (!q || q.claimed) return done(s);
  const same = s.quests.filter((x) => x.kind === q.kind && x.period === q.period);
  const others = s.quests.filter((x) => !(x.kind === q.kind && x.period === q.period));
  return settle(s, { ...s, quests: [...others, ...rerollOne(same, questId, `${today}-reroll`)], rerollDay: today }, now, []);
}

// ---------------- focus ----------------
export function focusStart(s: AppState, taskId: string, mins: number, nowMs: number): Result {
  return done({ ...s, focus: F.start(taskId, mins, nowMs) });
}
export const focusPause = (s: AppState, nowMs: number): Result => done(s.focus ? { ...s, focus: F.pause(s.focus, nowMs) } : s);
export const focusResume = (s: AppState, nowMs: number): Result => done(s.focus ? { ...s, focus: F.resume(s.focus, nowMs) } : s);
export const focusAddFive = (s: AppState): Result => done(s.focus ? { ...s, focus: F.addFive(s.focus) } : s);

export function focusStop(s: AppState, nowMs: number, now: Date): Result {
  const f = s.focus;
  if (!f) return done(s);
  if (f.phase === 'break') return done({ ...s, focus: null });
  const r = F.finish(f, nowMs);
  const today = dayKey(now);
  const task = s.tasks.find((t) => t.id === f.taskId);
  const prior = s.focusLog.filter((x) => x.taskId === f.taskId && x.day === today && x.completed).length;
  const xp = r.completed ? focusXp(prior) : 0;
  const stat = task ? taskStat(s, task) : null;
  let next: AppState = { ...s, focus: r.completed && s.focusSettings.autoBreak ? F.start(f.taskId, s.focusSettings.breakMin, nowMs, 'break') : null };
  if (r.minutes > 0) next = { ...next, focusLog: [...s.focusLog, { taskId: f.taskId, day: today, minutes: r.minutes, completed: r.completed }] };
  if (xp) next = { ...next, ledger: [...next.ledger, entry('focus', stat, xp, true, `focus:${f.taskId}:${f.startedAt}`, iso(now))] };
  return settle(s, next, now, [{ type: 'focusDone', taskId: f.taskId, xp, completed: r.completed }]);
}

// ---------------- rollover ----------------
export function rollover(s: AppState, now: Date): Result {
  const today = dayKey(now);
  let st = s;
  if (st.lastRollover !== today) {
    let ledger = st.ledger;
    if (st.lastRollover && st.lastRollover < today) {
      const have = new Set(ledger.filter((e) => e.source === 'drip').map((e) => e.ref));
      for (let d = st.lastRollover; d < today; d = addDays(d, 1)) {
        const amt = dripForDay(st.money, d);
        if (amt > 0 && !have.has(`drip:${d}`)) ledger = [...ledger, entry('drip', 'wea', amt, false, `drip:${d}`, `${d}T23:59:59.000Z`)];
      }
    }
    const tasks = st.tasks.map((t) => (t.habit && t.recurrence ? { ...t, streak: streakAfter(new Set(t.completions), t.recurrence, t.anchor ?? today, today) } : t));
    st = { ...st, ledger, tasks, lastRollover: today };
  }
  // quests
  const ws = weekStart(today, st.settings.weekStartsMonday);
  const usage = statUsage(st, now);
  const hasDaily = st.quests.some((q) => q.kind === 'daily' && q.period === today);
  const hasWeekly = st.quests.some((q) => q.kind === 'weekly' && q.period === ws);
  if (!hasDaily || !hasWeekly) {
    const daily = hasDaily ? st.quests.filter((q) => q.kind === 'daily' && q.period === today) : rollQuests(today, 'daily', usage);
    const weekly = hasWeekly ? st.quests.filter((q) => q.kind === 'weekly' && q.period === ws) : rollQuests(ws, 'weekly', usage);
    st = { ...st, quests: [...daily, ...weekly] };
  }
  // monthly repeating money entries
  const added: MoneyEntry[] = [];
  for (const tmpl of st.money.entries.filter((e) => e.repeatMonthly && !e.autoFrom)) {
    const dom = dayOfMonth(tmpl.date);
    for (let mk = addMonths(monthKey(tmpl.date), 1); mk <= monthKey(today); mk = addMonths(mk, 1)) {
      const d = `${mk}-${String(Math.min(dom, daysInMonth(`${mk}-01`))).padStart(2, '0')}`;
      if (d > today) break;
      if (st.money.entries.some((e) => e.autoFrom === tmpl.id && monthKey(e.date) === mk)) continue;
      added.push({ ...tmpl, id: uid(), date: d, loggedOn: d, repeatMonthly: undefined, autoFrom: tmpl.id });
    }
  }
  if (added.length) {
    st = { ...st, money: { ...st.money, entries: [...st.money.entries, ...added] }, ledger: [...st.ledger, ...(hasBudget(st) ? added.flatMap((e) => wealthEntriesForMoney(e, `${e.date}T12:00:00.000Z`)) : [])] };
  }
  if (st === s) return done(s);
  return settle(s, st, now, []);
}

// ---------------- misc ----------------
export function completeOnboarding(s: AppState, name: string): Result {
  return done({ ...s, profile: { ...s.profile, name: name.trim() || 'Friend', onboarded: true } });
}

export function myDayTasks(s: AppState, now: Date) {
  const today = dayKey(now);
  return s.tasks.filter((t) => inMyDay(t, today));
}

export { ACHIEVEMENTS };
