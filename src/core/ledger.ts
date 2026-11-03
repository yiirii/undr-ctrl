import { STATS, type LedgerEntry, type Stat } from './types';
import { charLevel, statLevel, type LevelInfo } from './rules';
import { uid } from './id';

export interface Progress {
  statXp: Record<Stat, number>;
  lifetime: number;
  stats: Record<Stat, LevelInfo>;
  char: LevelInfo;
  topStat: Stat;
}

export function entry(source: string, stat: Stat | null, amount: number, lifetime: boolean, ref: string, at: string): LedgerEntry {
  return { id: uid(), at, source, stat, amount: Math.round(amount), lifetime, ref };
}

export function deriveProgress(ledger: LedgerEntry[]): Progress {
  const statXp = Object.fromEntries(STATS.map((s) => [s, 0])) as Record<Stat, number>;
  let lifetime = 0;
  const ordered = [...ledger].sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  for (const e of ordered) {
    if (e.stat) statXp[e.stat] = Math.max(0, statXp[e.stat] + e.amount);
    if (e.lifetime) lifetime = Math.max(0, lifetime + e.amount);
  }
  const stats = Object.fromEntries(STATS.map((s) => [s, statLevel(statXp[s])])) as Record<Stat, LevelInfo>;
  let topStat: Stat = STATS[0];
  for (const s of STATS) if (statXp[s] > statXp[topStat]) topStat = s;
  return { statXp, lifetime, stats, char: charLevel(lifetime), topStat };
}

/** Returns a new ledger where every live entry with `ref` is marked reversed and compensated. */
export function reverse(ledger: LedgerEntry[], ref: string, at: string): LedgerEntry[] {
  const out: LedgerEntry[] = [];
  const comps: LedgerEntry[] = [];
  for (const e of ledger) {
    if (e.ref === ref && !e.reversed && e.source !== 'reverse') {
      out.push({ ...e, reversed: true });
      comps.push({ id: uid(), at, source: 'reverse', stat: e.stat, amount: -e.amount, lifetime: e.lifetime, ref });
    } else out.push(e);
  }
  return [...out, ...comps];
}

export const sumWhere = (ledger: LedgerEntry[], pred: (e: LedgerEntry) => boolean) =>
  ledger.reduce((n, e) => (pred(e) ? n + e.amount : n), 0);
