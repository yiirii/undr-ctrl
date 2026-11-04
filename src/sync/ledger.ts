// Ledger merging across devices. Automatic entries (made by rollover/settle, not by a person)
// can be created independently on two devices for the same thing; they collapse to one.
import type { LedgerEntry } from '../core/types';

export const AUTO_SOURCES = new Set(['drip', 'quest', 'achievement', 'recap']);

/** Dedupe automatic entries by (source, ref): keep the lowest id; reversed if any copy was reversed. Stable order. */
export function canonicalLedger(entries: LedgerEntry[]): LedgerEntry[] {
  const groups = new Map<string, LedgerEntry[]>();
  for (const e of entries) {
    if (!AUTO_SOURCES.has(e.source)) continue;
    const k = `${e.source}|${e.ref}`;
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }
  const keep = new Map<string, LedgerEntry>();
  for (const [k, g] of groups) {
    const first = [...g].sort((a, b) => (a.id < b.id ? -1 : 1))[0];
    keep.set(k, g.some((e) => e.reversed) ? { ...first, reversed: true } : first);
  }
  const out: LedgerEntry[] = [];
  for (const e of entries) {
    if (!AUTO_SOURCES.has(e.source)) { out.push(e); continue; }
    const kept = keep.get(`${e.source}|${e.ref}`)!;
    if (kept.id === e.id) out.push(kept);
  }
  return out.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
