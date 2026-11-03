// Side business (item-by-item resale): profit, stock and Wealth effects.
import type { LedgerEntry } from './types';
import { entry } from './ledger';
import { addMonths, diffDays, monthKey } from './dates';

export interface BizItem {
  id: string;
  name: string;
  costSen: number;
  boughtOn: string;
  status: 'stock' | 'sold';
  askSen?: number; // optional asking price
  soldSen?: number;
  soldOn?: string;
  feesSen?: number; // shipping / platform fees on the sale
  note?: string;
}
export interface BizExpense { id: string; sen: number; label: string; date: string }

export const itemProfit = (i: BizItem) => (i.status === 'sold' ? (i.soldSen ?? 0) - i.costSen - (i.feesSen ?? 0) : 0);

export interface BizMonth { salesSen: number; cogsSen: number; feesSen: number; expensesSen: number; profitSen: number; soldCount: number; boughtSen: number; boughtCount: number }

export function bizMonth(items: BizItem[], expenses: BizExpense[], mk: string): BizMonth {
  const sold = items.filter((i) => i.status === 'sold' && i.soldOn && monthKey(i.soldOn) === mk);
  const bought = items.filter((i) => monthKey(i.boughtOn) === mk);
  const salesSen = sold.reduce((n, i) => n + (i.soldSen ?? 0), 0);
  const cogsSen = sold.reduce((n, i) => n + i.costSen, 0);
  const feesSen = sold.reduce((n, i) => n + (i.feesSen ?? 0), 0);
  const expensesSen = expenses.filter((e) => monthKey(e.date) === mk).reduce((n, e) => n + e.sen, 0);
  return { salesSen, cogsSen, feesSen, expensesSen, profitSen: salesSen - cogsSen - feesSen - expensesSen, soldCount: sold.length, boughtSen: bought.reduce((n, i) => n + i.costSen, 0), boughtCount: bought.length };
}

export function stockSummary(items: BizItem[], today: string) {
  const stock = items.filter((i) => i.status === 'stock');
  return {
    count: stock.length,
    costSen: stock.reduce((n, i) => n + i.costSen, 0),
    askSen: stock.reduce((n, i) => n + (i.askSen ?? 0), 0),
    oldestDays: stock.length ? Math.max(...stock.map((i) => diffDays(i.boughtOn, today))) : 0,
  };
}

const rm = (sen: number) => Math.round(sen / 100);

/** A sale moves Wealth by its profit (can be negative). Buying stock alone does not. */
export function wealthForSale(i: BizItem, at: string): LedgerEntry[] {
  const p = rm(itemProfit(i));
  return p ? [entry('biz-sale', 'wea', p, false, i.id, at)] : [];
}
export function wealthForBizExpense(e: BizExpense, at: string): LedgerEntry[] {
  const p = rm(e.sen);
  return p ? [entry('biz-expense', 'wea', -p, false, e.id, at)] : [];
}

export function bizSixMonths(items: BizItem[], expenses: BizExpense[], today: string) {
  return Array.from({ length: 6 }, (_, k) => {
    const mk = addMonths(monthKey(today), k - 5);
    const m = bizMonth(items, expenses, mk);
    return { mk, profitSen: m.profitSen, salesSen: m.salesSen };
  });
}
