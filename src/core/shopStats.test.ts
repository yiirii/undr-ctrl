import { describe, test, expect } from 'vitest';
import { staleStock, shopStats } from './shopStats';
import type { BizItem } from './business';

const it = (o: Partial<BizItem>): BizItem => ({ id: Math.random().toString(36).slice(2), name: 'Groot', costSen: 4000, boughtOn: '2026-10-01', status: 'stock', ...o });

describe('slow-moving stock', () => {
  test('pieces in stock for 30+ days, oldest first, grouped by name with how long they have waited', () => {
    const items = [
      it({ name: 'Groot', boughtOn: '2026-09-01' }), it({ name: 'Groot', boughtOn: '2026-09-20' }),
      it({ name: 'Kiki', boughtOn: '2026-10-20' }), // 24 days: not yet
      it({ name: 'Totoro', boughtOn: '2026-10-01' }),
      it({ name: 'Sold one', boughtOn: '2026-01-01', status: 'sold', soldSen: 5000, soldOn: '2026-02-01' }),
      it({ name: 'Kept', boughtOn: '2026-01-01', status: 'kept' }),
    ];
    const r = staleStock(items, '2026-11-13');
    expect(r.map((g) => [g.name, g.count, g.days])).toEqual([['Groot', 2, 73], ['Totoro', 1, 43]]);
    expect(r[0].costSen).toBe(8000);
  });
});

describe('shop insights', () => {
  const items = [
    it({ name: 'Groot', costSen: 4000, boughtOn: '2026-10-01', status: 'sold', soldSen: 9000, feesSen: 500, soldOn: '2026-10-11', platform: 'Carousell' }), // 10 d, +4500
    it({ name: 'Groot', costSen: 4000, boughtOn: '2026-10-01', status: 'sold', soldSen: 8000, soldOn: '2026-10-05', platform: 'WhatsApp' }), // 4 d, +4000
    it({ name: 'Kiki', costSen: 5000, boughtOn: '2026-10-01', status: 'sold', soldSen: 12000, soldOn: '2026-10-31', platform: 'Carousell' }), // 30 d, +7000
    it({ name: 'Stitch', costSen: 3000, boughtOn: '2026-10-01', status: 'stock' }),
  ];
  const r = shopStats(items);
  test('totals: pieces sold, average days to sell, average profit per piece', () => {
    expect(r.soldCount).toBe(3);
    expect(r.avgDays).toBeCloseTo((10 + 4 + 30) / 3);
    expect(r.avgProfitSen).toBe(Math.round((4500 + 4000 + 7000) / 3));
  });
  test('best sellers by pieces sold, and most profitable by total profit', () => {
    expect(r.bestSellers[0]).toMatchObject({ name: 'Groot', count: 2, profitSen: 8500 });
    expect(r.mostProfit[0]).toMatchObject({ name: 'Groot', profitSen: 8500 });
    expect(r.mostProfit[1]).toMatchObject({ name: 'Kiki', profitSen: 7000 });
  });
  test('platforms compared: pieces, profit and how fast things sell there', () => {
    expect(r.platforms).toEqual([
      { platform: 'Carousell', count: 2, profitSen: 11500, avgDays: 20 },
      { platform: 'WhatsApp', count: 1, profitSen: 4000, avgDays: 4 },
    ]);
  });
  test('nothing sold yet gives empty, not broken, numbers', () => {
    expect(shopStats([it({})])).toMatchObject({ soldCount: 0, avgDays: 0, avgProfitSen: 0, bestSellers: [], platforms: [] });
  });
});
