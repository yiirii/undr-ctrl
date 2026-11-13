// Funko shop insights: what's sitting in stock too long, what sells best, how fast, and where.
import { itemProfit, type BizItem } from './business';
import { diffDays } from './dates';

export interface StaleGroup { name: string; count: number; days: number; costSen: number; ids: string[] }

/** Stock waiting `minDays`+ days, grouped by name, oldest first. */
export function staleStock(items: BizItem[], today: string, minDays = 30): StaleGroup[] {
  const g = new Map<string, StaleGroup>();
  for (const i of items) {
    if (i.status !== 'stock') continue;
    const days = diffDays(i.boughtOn, today);
    if (days < minDays) continue;
    const cur = g.get(i.name) ?? { name: i.name, count: 0, days: 0, costSen: 0, ids: [] };
    cur.count++; cur.costSen += i.costSen; cur.days = Math.max(cur.days, days); cur.ids.push(i.id);
    g.set(i.name, cur);
  }
  return [...g.values()].sort((a, b) => b.days - a.days || a.name.localeCompare(b.name));
}

export interface NameStat { name: string; count: number; profitSen: number }
export interface PlatformStat { platform: string; count: number; profitSen: number; avgDays: number }

/** All-time numbers over everything sold. */
export function shopStats(items: BizItem[]) {
  const sold = items.filter((i) => i.status === 'sold' && i.soldOn);
  const days = (i: BizItem) => Math.max(0, diffDays(i.boughtOn, i.soldOn!));
  const byName = new Map<string, NameStat>();
  const byPlat = new Map<string, { count: number; profitSen: number; days: number }>();
  for (const i of sold) {
    const n = byName.get(i.name) ?? { name: i.name, count: 0, profitSen: 0 };
    n.count++; n.profitSen += itemProfit(i); byName.set(i.name, n);
    const key = i.platform || 'Not recorded';
    const p = byPlat.get(key) ?? { count: 0, profitSen: 0, days: 0 };
    p.count++; p.profitSen += itemProfit(i); p.days += days(i); byPlat.set(key, p);
  }
  const names = [...byName.values()];
  return {
    soldCount: sold.length,
    avgDays: sold.length ? sold.reduce((n, i) => n + days(i), 0) / sold.length : 0,
    avgProfitSen: sold.length ? Math.round(sold.reduce((n, i) => n + itemProfit(i), 0) / sold.length) : 0,
    bestSellers: [...names].sort((a, b) => b.count - a.count || b.profitSen - a.profitSen).slice(0, 5),
    mostProfit: [...names].sort((a, b) => b.profitSen - a.profitSen || b.count - a.count).slice(0, 5),
    platforms: [...byPlat.entries()].map(([platform, p]) => ({ platform, count: p.count, profitSen: p.profitSen, avgDays: Math.round(p.days / p.count) })).sort((a, b) => b.count - a.count || b.profitSen - a.profitSen),
  };
}
