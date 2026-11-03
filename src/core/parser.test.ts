import { describe, test, expect } from 'vitest';
import { parseQuick, type ParseCtx } from './parser';
import { defaultCategories, defaultSources } from './money';
import type { List } from './types';

const lists: List[] = [
  { id: 'uni', name: 'Uni', icon: 'book', color: '#6ea8fe', stat: 'int' },
  { id: 'assign', name: 'Assignments', icon: 'pen', color: '#6ea8fe', stat: 'int' },
  { id: 'fit', name: 'Fitness', icon: 'bolt', color: '#ff7a6b', stat: 'str' },
  { id: 'personal', name: 'Personal', icon: 'dot', color: '#a79bff', stat: 'dis' },
];
const ctx: ParseCtx = { lists, categories: defaultCategories(), sources: defaultSources(), today: '2026-11-03' }; // Tuesday
const top = (s: string) => parseQuick(s, ctx)[0];

describe('tasks', () => {
  test.each<[string, Record<string, unknown>]>([
    ['essay due fri 5pm #uni', { kind: 'task', title: 'essay', due: '2026-11-06', time: '17:00', listId: 'uni' }],
    ['buy milk', { kind: 'task', title: 'buy milk' }],
    ['read ch4 tmr !quick', { kind: 'task', title: 'read ch4', due: '2026-11-04', size: 'quick' }],
    ['read ch4 tomorrow', { kind: 'task', title: 'read ch4', due: '2026-11-04' }],
    ['call mum today', { kind: 'task', title: 'call mum', due: '2026-11-03' }],
    ['lab report on 12 nov #assignments', { kind: 'task', title: 'lab report', due: '2026-11-12', listId: 'assign' }],
    ['lab report 12/11', { kind: 'task', title: 'lab report', due: '2026-11-12' }],
    ['meeting mon 9am', { kind: 'task', title: 'meeting', due: '2026-11-09', time: '09:00' }],
    ['meeting tue', { kind: 'task', title: 'meeting', due: '2026-11-10' }],
    ['submit at 17:30 today', { kind: 'task', title: 'submit', due: '2026-11-03', time: '17:30' }],
    ['revise 8.30pm', { kind: 'task', title: 'revise', time: '20:30' }],
    ['final project !big #uni', { kind: 'task', title: 'final project', size: 'big', listId: 'uni' }],
    ['clean room #personal', { kind: 'task', title: 'clean room', listId: 'personal' }],
    ['clean room #unknownlist', { kind: 'task', title: 'clean room #unknownlist' }],
    ['due next week report', { kind: 'task', title: 'report', due: '2026-11-10' }],
    ['tutorial in 3 days', { kind: 'task', title: 'tutorial', due: '2026-11-06' }],
    ['email lecturer next fri', { kind: 'task', title: 'email lecturer', due: '2026-11-13' }],
  ])('%s', (s, want) => expect(top(s)).toMatchObject(want));
});

describe('habits & recurrence', () => {
  test.each<[string, Record<string, unknown>]>([
    ['gym every mon wed fri', { kind: 'task', title: 'gym', habit: true, recurrence: { kind: 'weekly', days: [1, 3, 5] } }],
    ['meditate every day', { kind: 'task', title: 'meditate', habit: true, recurrence: { kind: 'daily' } }],
    ['meditate daily', { kind: 'task', title: 'meditate', habit: true, recurrence: { kind: 'daily' } }],
    ['stretch weekdays', { kind: 'task', title: 'stretch', habit: true, recurrence: { kind: 'weekdays' } }],
    ['water plants every 3 days', { kind: 'task', title: 'water plants', habit: true, recurrence: { kind: 'everyN', n: 3 } }],
    ['pay rent monthly on 5', { kind: 'task', title: 'pay rent', recurrence: { kind: 'monthly', day: 5 } }],
    ['run every sat #fitness', { kind: 'task', title: 'run', listId: 'fit', recurrence: { kind: 'weekly', days: [6] } }],
  ])('%s', (s, want) => expect(top(s)).toMatchObject(want));
});

describe('money', () => {
  test.each<[string, Record<string, unknown>]>([
    ['12.50 lunch food', { kind: 'out', sen: 1250, categoryId: 'food', note: 'lunch' }],
    ['12.50 lunch', { kind: 'out', sen: 1250, categoryId: 'food', note: 'lunch' }],
    ['rm8 grab', { kind: 'out', sen: 800, categoryId: 'transport', note: 'grab' }],
    ['RM 8 grab', { kind: 'out', sen: 800, categoryId: 'transport' }],
    ['5 coffee', { kind: 'out', sen: 500, categoryId: 'food', note: 'coffee' }],
    ['45 shopee shopping', { kind: 'out', sen: 4500, categoryId: 'shopping', note: 'shopee' }],
    ['15.90 spotify', { kind: 'out', sen: 1590, categoryId: 'subs' }],
    ['30 textbook', { kind: 'out', sen: 3000, categoryId: 'books' }],
    ['20 movie', { kind: 'out', sen: 2000, categoryId: 'fun' }],
    ['9 panadol', { kind: 'out', sen: 900, categoryId: 'health' }],
    ['3 random thing', { kind: 'out', sen: 300, categoryId: 'other', note: 'random thing' }],
    ['60 electricity', { kind: 'out', sen: 6000, categoryId: 'bills' }],
    ['+500 salary', { kind: 'in', sen: 50000, sourceId: 'parttime' }],
    ['+1500 allowance', { kind: 'in', sen: 150000, sourceId: 'allowance' }],
    ['+2000 ptptn', { kind: 'in', sen: 200000, sourceId: 'ptptn' }],
    ['+50 refund', { kind: 'in', sen: 5000, sourceId: 'other-in', note: 'refund' }],
  ])('%s', (s, want) => expect(top(s)).toMatchObject(want));

  test('numbers inside a task title stay a task when not leading', () => expect(top('read chapter 5')).toMatchObject({ kind: 'task', title: 'read chapter 5' }));
  test('ambiguous leading number offers a task alternative', () => {
    const c = parseQuick('3 essays to mark', ctx);
    expect(c.some((x) => x.kind === 'task')).toBe(true);
  });
  test('empty gives no candidates', () => expect(parseQuick('   ', ctx)).toEqual([]));
});
