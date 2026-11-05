// Where personal money comes from: Cash (allowance) or TnG, which is really the business's wallet.
// Personal spending paid with TnG is money taken out of the business (an "owner's draw"): it is not a
// business cost, so profit is untouched, but it lowers the business money you have to restock with.
// None of this changes Wealth or XP; it only shows where the money actually sits.
import type { BizItem, BizExpense, BizIncome } from './business';
import type { MoneyEntry } from './types';
import { monthKey } from './dates';

export type Wallet = 'cash' | 'tng';
/** Money moved between you and the business: "in" = topped up TnG, "out" = took money out of TnG. */
export interface BizMove { id: string; sen: number; dir: 'in' | 'out'; date: string; note?: string }
/** Set when you tell the app your real TnG balance: business money = all flows + adjustSen. */
export interface WalletAnchor { adjustSen: number; setOn: string }

const isTng = (e: MoneyEntry) => e.wallet === 'tng';

/** Everything that has ever gone into (+) or out of (−) TnG, as far as the app knows. */
export function walletFlowsSen(items: BizItem[], expenses: BizExpense[], income: BizIncome[], entries: MoneyEntry[], moves: BizMove[]): number {
  let n = 0;
  for (const i of items) {
    n -= i.costSen; // every piece is bought with TnG
    if (i.status === 'sold') n += (i.soldSen ?? 0) - (i.feesSen ?? 0);
    else if (i.status === 'reserved') n += i.reservation?.depositSen ?? 0;
  }
  for (const e of expenses) n -= e.sen;
  for (const e of income) n += e.sen;
  for (const e of entries) if (isTng(e)) n += e.kind === 'in' ? e.sen : -e.sen;
  for (const m of moves) n += m.dir === 'in' ? m.sen : -m.sen;
  return n;
}

/** The adjustment that makes the app's balance equal what's really in your TnG right now. */
export const adjustFor = (flowsSen: number, actualSen: number) => actualSen - flowsSen;

/** Business money now, or null until you've told the app your TnG balance once. */
export const businessMoney = (flowsSen: number, anchor: WalletAnchor | undefined) => (anchor ? flowsSen + anchor.adjustSen : null);

/** This month: what you took out of the business for yourself, and what you put in. */
export function takenOutMonth(entries: MoneyEntry[], moves: BizMove[], mk: string) {
  const inMonth = (d: string) => monthKey(d) === mk;
  const spentSen = entries.filter((e) => e.kind === 'out' && isTng(e) && inMonth(e.date)).reduce((n, e) => n + e.sen, 0);
  const receivedSen = entries.filter((e) => e.kind === 'in' && isTng(e) && inMonth(e.date)).reduce((n, e) => n + e.sen, 0);
  const movedOutSen = moves.filter((m) => m.dir === 'out' && inMonth(m.date)).reduce((n, m) => n + m.sen, 0);
  const movedInSen = moves.filter((m) => m.dir === 'in' && inMonth(m.date)).reduce((n, m) => n + m.sen, 0);
  return { spentSen, movedOutSen, takenOutSen: spentSen + movedOutSen, receivedSen, movedInSen, putInSen: receivedSen + movedInSen };
}

/** Personal spending this month by what paid for it. Entries from before this existed count as cash. */
export function personalSplit(entries: MoneyEntry[], mk: string) {
  let cashSen = 0, tngSen = 0;
  for (const e of entries) if (e.kind === 'out' && monthKey(e.date) === mk) { if (isTng(e)) tngSen += e.sen; else cashSen += e.sen; }
  return { cashSen, tngSen };
}

/** The business's own money in and out this month (sales, deposits, other income vs pieces bought and costs). */
export function businessMonthFlows(items: BizItem[], expenses: BizExpense[], income: BizIncome[], mk: string) {
  const inM = (d?: string) => !!d && monthKey(d) === mk;
  let inSen = 0, outSen = 0;
  for (const i of items) {
    if (inM(i.boughtOn)) outSen += i.costSen;
    if (i.status === 'sold' && inM(i.soldOn)) inSen += (i.soldSen ?? 0) - (i.feesSen ?? 0);
    if (i.status === 'reserved' && inM(i.reservation?.on)) inSen += i.reservation?.depositSen ?? 0;
  }
  for (const e of expenses) if (inM(e.date)) outSen += e.sen;
  for (const e of income) if (inM(e.date)) inSen += e.sen;
  return { inSen, outSen };
}
