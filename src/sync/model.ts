// Sync model: AppState <-> keyed records, diffs and merging of remote records.
// Pure functions; no Firebase here.
import type { AppState, Settings } from '../store/state';
import { canonicalLedger } from './ledger';

export interface RecBody { key: string; k: string; id: string; data: unknown }
export interface Rec extends RecBody { updatedAt: number; deleted?: boolean; device?: string }

type Item = { id: string };
interface Coll { k: string; get(s: AppState): Item[]; set(s: AppState, v: Item[]): AppState }

const COLLS: Coll[] = [
  { k: 'lists', get: (s) => s.lists, set: (s, v) => ({ ...s, lists: v as AppState['lists'] }) },
  { k: 'tasks', get: (s) => s.tasks, set: (s, v) => ({ ...s, tasks: v as AppState['tasks'] }) },
  { k: 'categories', get: (s) => s.money.categories, set: (s, v) => ({ ...s, money: { ...s.money, categories: v as AppState['money']['categories'] } }) },
  { k: 'sources', get: (s) => s.money.sources, set: (s, v) => ({ ...s, money: { ...s.money, sources: v as AppState['money']['sources'] } }) },
  { k: 'entries', get: (s) => s.money.entries, set: (s, v) => ({ ...s, money: { ...s.money, entries: v as AppState['money']['entries'] } }) },
  { k: 'goals', get: (s) => s.money.goals, set: (s, v) => ({ ...s, money: { ...s.money, goals: v as AppState['money']['goals'] } }) },
  { k: 'deposits', get: (s) => s.money.deposits, set: (s, v) => ({ ...s, money: { ...s.money, deposits: v as AppState['money']['deposits'] } }) },
  { k: 'items', get: (s) => s.business.items, set: (s, v) => ({ ...s, business: { ...s.business, items: v as AppState['business']['items'] } }) },
  { k: 'expenses', get: (s) => s.business.expenses, set: (s, v) => ({ ...s, business: { ...s.business, expenses: v as AppState['business']['expenses'] } }) },
  { k: 'income', get: (s) => s.business.income, set: (s, v) => ({ ...s, business: { ...s.business, income: v as AppState['business']['income'] } }) },
  { k: 'ledger', get: (s) => s.ledger, set: (s, v) => ({ ...s, ledger: v as AppState['ledger'] }) },
  { k: 'quests', get: (s) => s.quests, set: (s, v) => ({ ...s, quests: v as AppState['quests'] }) },
];
const COLL = new Map(COLLS.map((c) => [c.k, c]));

/** Settings that belong to one device and never sync. */
export const LOCAL_SETTINGS = ['backupFolder', 'lastCloudBackup', 'cloudBackupFailed', 'startWithWindows'] as const;

type Merge = 'latest' | 'union' | 'max';
interface One { id: string; get(s: AppState): unknown; set(s: AppState, v: unknown): AppState; merge?: Merge }
const ONES: One[] = [
  { id: 'profile', get: (s) => s.profile, set: (s, v) => ({ ...s, profile: v as AppState['profile'] }) },
  { id: 'appearance', get: (s) => s.appearance, set: (s, v) => ({ ...s, appearance: v as AppState['appearance'] }) },
  {
    id: 'settings',
    get: (s) => { const o: Record<string, unknown> = { ...s.settings }; for (const k of LOCAL_SETTINGS) delete o[k]; return o; },
    set: (s, v) => { const keep: Record<string, unknown> = {}; for (const k of LOCAL_SETTINGS) keep[k] = s.settings[k]; return { ...s, settings: { ...(v as Settings), ...keep } as Settings }; },
  },
  { id: 'savingsTargetSen', get: (s) => s.money.savingsTargetSen, set: (s, v) => ({ ...s, money: { ...s.money, savingsTargetSen: v as number } }) },
  { id: 'setupDone', get: (s) => s.money.setupDone, set: (s, v) => ({ ...s, money: { ...s.money, setupDone: (v as boolean) || s.money.setupDone } }) },
  { id: 'dismissedNudges', merge: 'union', get: (s) => s.money.dismissedNudges, set: (s, v) => ({ ...s, money: { ...s.money, dismissedNudges: v as string[] } }) },
  { id: 'recapsSeen', merge: 'union', get: (s) => s.money.recapsSeen, set: (s, v) => ({ ...s, money: { ...s.money, recapsSeen: v as string[] } }) },
  { id: 'bizName', get: (s) => s.business.name, set: (s, v) => ({ ...s, business: { ...s.business, name: v as string } }) },
  { id: 'platforms', get: (s) => s.business.platforms, set: (s, v) => ({ ...s, business: { ...s.business, platforms: v as string[] } }) },
  { id: 'achievements', merge: 'union', get: (s) => s.achievements, set: (s, v) => ({ ...s, achievements: v as string[] }) },
  { id: 'questsCompleted', merge: 'max', get: (s) => s.questsCompleted, set: (s, v) => ({ ...s, questsCompleted: v as number }) },
  { id: 'rerollDay', get: (s) => s.rerollDay ?? null, set: (s, v) => ({ ...s, rerollDay: (v as string | null) ?? undefined }) },
  { id: 'focusLog', merge: 'union', get: (s) => s.focusLog, set: (s, v) => ({ ...s, focusLog: v as AppState['focusLog'] }) },
  { id: 'focusSettings', get: (s) => s.focusSettings, set: (s, v) => ({ ...s, focusSettings: v as AppState['focusSettings'] }) },
  { id: 'myDayCleared', merge: 'union', get: (s) => s.myDayCleared, set: (s, v) => ({ ...s, myDayCleared: v as string[] }) },
  { id: 'reminded', merge: 'union', get: (s) => s.reminded, set: (s, v) => ({ ...s, reminded: v as string[] }) },
  { id: 'lastRollover', merge: 'max', get: (s) => s.lastRollover ?? null, set: (s, v) => ({ ...s, lastRollover: (v as string | null) ?? undefined }) },
];
const ONE = new Map(ONES.map((o) => [o.id, o]));

/** Keys whose merge only ever grows (union / max): safe to apply even if older than local. */
export function isMonotone(key: string): boolean {
  if (!key.startsWith('one/')) return key.startsWith('ledger/');
  const m = ONE.get(key.slice(4))?.merge;
  return m === 'union' || m === 'max';
}

export function toRecords(s: AppState): Map<string, RecBody> {
  const out = new Map<string, RecBody>();
  for (const c of COLLS) for (const it of c.get(s)) out.set(`${c.k}/${it.id}`, { key: `${c.k}/${it.id}`, k: c.k, id: it.id, data: it });
  for (const o of ONES) out.set(`one/${o.id}`, { key: `one/${o.id}`, k: 'one', id: o.id, data: o.get(s) });
  return out;
}

/** What changed between two states. Collections compare by reference (state updates are immutable), singletons by value. */
export function diff(prev: AppState, next: AppState): { upserts: RecBody[]; deletes: Omit<RecBody, 'data'>[] } {
  const upserts: RecBody[] = [];
  const deletes: Omit<RecBody, 'data'>[] = [];
  if (prev === next) return { upserts, deletes };
  for (const c of COLLS) {
    const a = c.get(prev), b = c.get(next);
    if (a === b) continue;
    const before = new Map(a.map((x) => [x.id, x]));
    const seen = new Set<string>();
    for (const it of b) {
      seen.add(it.id);
      const old = before.get(it.id);
      if (old !== it && JSON.stringify(old) !== JSON.stringify(it)) upserts.push({ key: `${c.k}/${it.id}`, k: c.k, id: it.id, data: it });
    }
    for (const id of before.keys()) if (!seen.has(id)) deletes.push({ key: `${c.k}/${id}`, k: c.k, id });
  }
  for (const o of ONES) {
    const a = o.get(prev), b = o.get(next);
    if (a !== b && JSON.stringify(a) !== JSON.stringify(b)) upserts.push({ key: `one/${o.id}`, k: 'one', id: o.id, data: b });
  }
  return { upserts, deletes };
}

const unionVal = (a: unknown[], b: unknown[]) => {
  const seen = new Map<string, unknown>();
  for (const x of [...a, ...b]) seen.set(typeof x === 'string' ? x : JSON.stringify(x), x);
  return [...seen.values()];
};

/** Apply remote records (already filtered for staleness by the engine) to a local state. */
export function applyRemote(s: AppState, recs: Rec[]): AppState {
  if (!recs.length) return s;
  let st = s;
  const byColl = new Map<string, Rec[]>();
  for (const r of recs) {
    if (r.k === 'one') {
      const o = ONE.get(r.id);
      if (!o || r.deleted) continue;
      const cur = o.get(st);
      const v = o.merge === 'union' ? unionVal((cur as unknown[]) ?? [], (r.data as unknown[]) ?? [])
        : o.merge === 'max' ? ((cur ?? '') > (r.data ?? '') ? cur : r.data)
          : r.data;
      st = o.set(st, v);
    } else if (COLL.has(r.k)) byColl.set(r.k, [...(byColl.get(r.k) ?? []), r]);
  }
  for (const [k, rs] of byColl) {
    const c = COLL.get(k)!;
    const list = [...c.get(st)];
    const idx = new Map(list.map((x, i) => [x.id, i]));
    const drop = new Set<string>();
    for (const r of rs) {
      const i = idx.get(r.id);
      if (r.deleted) { if (i !== undefined) drop.add(r.id); continue; }
      let data = r.data as Item & { reversed?: boolean };
      if (k === 'ledger' && i !== undefined && (list[i] as { reversed?: boolean }).reversed) data = { ...data, reversed: true };
      if (i === undefined) { idx.set(r.id, list.length); list.push(data); } else list[i] = data;
    }
    let next = drop.size ? list.filter((x) => !drop.has(x.id)) : list;
    if (k === 'ledger') next = canonicalLedger(next as AppState['ledger']);
    st = c.set(st, next);
  }
  return st;
}
