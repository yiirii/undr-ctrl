// Side business (item-by-item resale): profit, stock and Wealth effects.
import type { LedgerEntry } from './types';
import { entry } from './ledger';
import { uid } from './id';
import { addMonths, diffDays, monthKey } from './dates';

export interface BizItem {
  id: string;
  name: string;
  costSen: number;
  boughtOn: string;
  status: 'stock' | 'sold' | 'reserved' | 'kept';
  askSen?: number; // optional asking price
  soldSen?: number;
  soldOn?: string;
  feesSen?: number; // shipping / platform fees on the sale
  note?: string;
  platform?: string; // where it sold / was reserved
  reservation?: { depositSen: number; dueOn: string; on: string; note?: string; priceSen?: number }; // priceSen: agreed total, optional
  valueSen?: number; // collection: my value estimate
  valueOn?: string;
}
export interface BizExpense { id: string; sen: number; label: string; date: string }
/** Other business income, e.g. a deposit kept after a cancelled reservation. */
export interface BizIncome { id: string; sen: number; label: string; date: string }
export const DEFAULT_PLATFORMS = ['Carousell', 'Threads', 'Facebook Marketplace', 'WhatsApp'];

export const itemProfit = (i: BizItem) => (i.status === 'sold' ? (i.soldSen ?? 0) - i.costSen - (i.feesSen ?? 0) : 0);

export interface BizMonth { salesSen: number; cogsSen: number; feesSen: number; expensesSen: number; otherIncomeSen: number; profitSen: number; soldCount: number; boughtSen: number; boughtCount: number }

export function bizMonth(items: BizItem[], expenses: BizExpense[], mk: string, income: BizIncome[] = []): BizMonth {
  const sold = items.filter((i) => i.status === 'sold' && i.soldOn && monthKey(i.soldOn) === mk);
  const bought = items.filter((i) => monthKey(i.boughtOn) === mk);
  const salesSen = sold.reduce((n, i) => n + (i.soldSen ?? 0), 0);
  const cogsSen = sold.reduce((n, i) => n + i.costSen, 0);
  const feesSen = sold.reduce((n, i) => n + (i.feesSen ?? 0), 0);
  const expensesSen = expenses.filter((e) => monthKey(e.date) === mk).reduce((n, e) => n + e.sen, 0);
  const otherIncomeSen = income.filter((e) => monthKey(e.date) === mk).reduce((n, e) => n + e.sen, 0);
  return { salesSen, cogsSen, feesSen, expensesSen, otherIncomeSen, profitSen: salesSen - cogsSen - feesSen - expensesSen + otherIncomeSen, soldCount: sold.length, boughtSen: bought.reduce((n, i) => n + i.costSen, 0), boughtCount: bought.length };
}

export function stockSummary(items: BizItem[], today: string) {
  const stock = items.filter((i) => i.status === 'stock');
  const reserved = items.filter((i) => i.status === 'reserved');
  return {
    reservedCount: reserved.length,
    depositsHeldSen: reserved.reduce((n, i) => n + (i.reservation?.depositSen ?? 0), 0),
    count: stock.length,
    costSen: stock.reduce((n, i) => n + i.costSen, 0),
    askSen: stock.reduce((n, i) => n + (i.askSen ?? 0), 0),
    oldestDays: stock.length ? Math.max(...stock.map((i) => diffDays(i.boughtOn, today))) : 0,
  };
}

const rm = (sen: number) => Math.round(sen / 100);

// Wealth follows cash: buying a piece (stock or collection) costs Wealth; money received raises it.
// Over a piece's life the net change equals its profit.
export function wealthForBuy(i: BizItem, at: string): LedgerEntry[] {
  const p = rm(i.costSen);
  return p ? [entry('biz-buy', 'wea', -p, false, `buy:${i.id}`, at)] : [];
}
/** Money received on a sale (price minus fees). */
export function wealthForSale(i: BizItem, at: string): LedgerEntry[] {
  const p = rm((i.soldSen ?? 0) - (i.feesSen ?? 0));
  return p ? [entry('biz-sale', 'wea', p, false, `rev:${i.id}`, at)] : [];
}
export function wealthForDeposit(i: BizItem, at: string): LedgerEntry[] {
  const p = rm(i.reservation?.depositSen ?? 0);
  return p ? [entry('biz-deposit', 'wea', p, false, `dep:${i.id}`, at)] : [];
}
export function wealthForBizExpense(e: BizExpense, at: string): LedgerEntry[] {
  const p = rm(e.sen);
  return p ? [entry('biz-expense', 'wea', -p, false, e.id, at)] : [];
}
export function wealthForBizIncome(e: BizIncome, at: string): LedgerEntry[] {
  const p = rm(e.sen);
  return p ? [entry('biz-income', 'wea', p, false, e.id, at)] : [];
}

export interface PlatformRow { platform: string; count: number; salesSen: number; profitSen: number }
export function platformMonth(items: BizItem[], mk: string): PlatformRow[] {
  const m = new Map<string, PlatformRow>();
  for (const i of items) {
    if (i.status !== 'sold' || !i.soldOn || monthKey(i.soldOn) !== mk) continue;
    const k = i.platform || 'Other';
    const r = m.get(k) ?? { platform: k, count: 0, salesSen: 0, profitSen: 0 };
    r.count++; r.salesSen += i.soldSen ?? 0; r.profitSen += itemProfit(i);
    m.set(k, r);
  }
  return [...m.values()].sort((a, b) => b.profitSen - a.profitSen || b.salesSen - a.salesSen);
}

export function collectionSummary(items: BizItem[]) {
  const kept = items.filter((i) => i.status === 'kept');
  const costSen = kept.reduce((n, i) => n + i.costSen, 0);
  const valueSen = kept.reduce((n, i) => n + (i.valueSen ?? i.costSen), 0);
  return { count: kept.length, costSen, valueSen, gainSen: valueSen - costSen };
}

export function reservationsDue(items: BizItem[], today: string) {
  return items
    .filter((i) => i.status === 'reserved' && i.reservation)
    .map((i) => ({ item: i, overdue: i.reservation!.dueOn < today, daysLeft: diffDays(today, i.reservation!.dueOn) }))
    .sort((a, b) => (a.item.reservation!.dueOn < b.item.reservation!.dueOn ? -1 : 1));
}

export function bizSixMonths(items: BizItem[], expenses: BizExpense[], today: string, income: BizIncome[] = []) {
  return Array.from({ length: 6 }, (_, k) => {
    const mk = addMonths(monthKey(today), k - 5);
    const m = bizMonth(items, expenses, mk, income);
    return { mk, profitSen: m.profitSen, salesSen: m.salesSen };
  });
}

/** One-time move from "a sale adds its profit" to cash-flow Wealth. Net Wealth per piece is unchanged for sold pieces. */
export function migrateToCashFlow(items: BizItem[], ledger: LedgerEntry[], at: string): LedgerEntry[] {
  const ids = new Set(items.map((i) => i.id));
  const out: LedgerEntry[] = [];
  const comps: LedgerEntry[] = [];
  for (const e of ledger) {
    if (e.source === 'biz-sale' && ids.has(e.ref) && !e.reversed) {
      out.push({ ...e, reversed: true });
      comps.push({ id: uid(), at, source: 'reverse', stat: e.stat, amount: -e.amount, lifetime: e.lifetime, ref: e.ref });
    } else out.push(e);
  }
  const fresh: LedgerEntry[] = [];
  for (const i of items) {
    fresh.push(...wealthForBuy(i, `${i.boughtOn}T00:00:00.000Z`));
    if (i.status === 'sold') fresh.push(...wealthForSale(i, `${i.soldOn ?? i.boughtOn}T12:00:00.000Z`));
  }
  return [...out, ...comps, ...fresh];
}
