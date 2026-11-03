import { describe, test, expect } from 'vitest';
import { spendingInsights, productivityInsights } from './insights';
import { defaultCategories } from './money';
import type { MoneyEntry, Task } from './types';

const out = (date: string, sen: number, categoryId = 'food'): MoneyEntry => ({ id: date + sen + categoryId, kind: 'out', sen, categoryId, note: '', date, loggedOn: date });

describe('spending insights', () => {
  const money = { categories: defaultCategories(), entries: [
    out('2026-08-03', 30000), out('2026-09-04', 30000), out('2026-10-05', 30000), // food avg 300
    out('2026-11-02', 45000), // food this month 450 (+150)
    out('2026-10-10', 10000, 'transport'), out('2026-11-01', 2000, 'transport'),
  ] } as any;
  const r = spendingInsights(money, '2026-11-03');
  test('six-month series per category, oldest first', () => {
    const food = r.categories.find((c) => c.id === 'food')!;
    expect(food.months.map((m) => m.sen)).toEqual([0, 0, 30000, 30000, 30000, 45000]);
    expect(food.avgSen).toBe(30000); // average of earlier months that had spending
  });
  test('biggest changes vs your average, largest first', () => {
    expect(r.changes[0]).toMatchObject({ id: 'food', diffSen: 15000 });
    expect(r.changes[1]).toMatchObject({ id: 'transport', diffSen: -8000 });
  });
  test('weekday vs weekend daily average over the last 90 days', () => {
    // 2026-11-01 is a Sunday, 2026-11-02 a Monday
    const w = spendingInsights({ categories: defaultCategories(), entries: [out('2026-11-01', 6000), out('2026-11-02', 1000)] } as any, '2026-11-03').week;
    expect(w.weekendSen).toBeGreaterThan(w.weekdaySen);
  });
});

describe('productivity insights', () => {
  const task = (o: Partial<Task>): Task => ({ id: Math.random() + '', title: 'x', notes: '', listId: 'uni', size: 'normal', completions: [], streak: 0, createdAt: '2026-10-01T00:00:00.000Z', order: 0, ...o });
  test('finished vs planned per day (My Day)', () => {
    const tasks = [
      task({ myDay: '2026-11-02', doneAt: new Date(2026, 10, 2, 9).toISOString() }),
      task({ myDay: '2026-11-02' }),
      task({ doneAt: new Date(2026, 10, 2, 21).toISOString() }), // not planned, still finished
    ];
    const p = productivityInsights(tasks, [], [], '2026-11-03');
    const d = p.days.find((x) => x.day === '2026-11-02')!;
    expect(d).toMatchObject({ planned: 2, plannedDone: 1, finished: 2 });
    expect(p.days.length).toBe(14);
  });
  test('best weekday and best time of day', () => {
    const tasks = [0, 1, 2].map((i) => task({ doneAt: new Date(2026, 10, 2, 22, i).toISOString() })).concat([task({ doneAt: new Date(2026, 10, 3, 8).toISOString() })]);
    const p = productivityInsights(tasks, [], [], '2026-11-03');
    expect(p.bestWeekday).toBe('Monday');
    expect(p.bestTime).toBe('Night');
  });
  test('focus minutes per week (last 8 weeks)', () => {
    const p = productivityInsights([], [{ taskId: 'a', day: '2026-11-02', minutes: 25 }, { taskId: 'a', day: '2026-11-03', minutes: 50 }] as any, [], '2026-11-03');
    expect(p.focusWeeks.length).toBe(8);
    expect(p.focusWeeks[7].minutes).toBe(75);
  });
});
