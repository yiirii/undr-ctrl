// Undo for the last action, safe with sync and the append-only XP ledger.
// Your data (tasks, lists, money, business) goes back to how it was. The ledger is never cut:
// entries the action added are reversed (as an undone task would be), and entries it reversed come back as fresh copies.
// Earned achievements, quest progress and settings are left as they are.
import type { AppState } from './state';
import type { LedgerEntry } from '../core/types';
import { uid } from '../core/id';

const KEEP_SOURCES = new Set(['quest', 'achievement', 'drip', 'recap']); // earned on their own; never taken back by an undo

export function revertTo(before: AppState, after: AppState, now: Date): AppState {
  const at = now.toISOString();
  const was = new Map(before.ledger.map((e) => [e.id, e]));
  const ledger: LedgerEntry[] = [];
  const extra: LedgerEntry[] = [];
  for (const e of after.ledger) {
    const old = was.get(e.id);
    if (!old) {
      // added by the action
      if (KEEP_SOURCES.has(e.source) || e.source === 'reverse' || e.reversed) { ledger.push(e); continue; }
      ledger.push({ ...e, reversed: true });
      extra.push({ id: uid(), at, source: 'reverse', stat: e.stat, amount: -e.amount, lifetime: e.lifetime, ref: e.ref });
    } else if (e.reversed && !old.reversed) {
      // the action reversed it: it stays reversed (sync keeps that for good), so bring it back as a copy
      ledger.push(e);
      if (!KEEP_SOURCES.has(e.source)) extra.push({ ...old, id: uid(), at });
    } else ledger.push(e);
  }
  return {
    ...after,
    lists: before.lists,
    tasks: before.tasks,
    money: { ...after.money, entries: before.money.entries, goals: before.money.goals, deposits: before.money.deposits },
    business: { ...after.business, items: before.business.items, expenses: before.business.expenses, income: before.business.income, moves: before.business.moves },
    focus: before.focus,
    focusLog: before.focusLog,
    myDayCleared: after.myDayCleared,
    ledger: [...ledger, ...extra],
  };
}
