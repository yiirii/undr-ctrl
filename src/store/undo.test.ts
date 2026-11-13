import { describe, test, expect } from 'vitest';
import { initialState, type AppState } from './state';
import * as L from './logic';
import { revertTo } from './undo';
import { deriveProgress } from '../core/ledger';

const NOW = new Date('2026-11-05T10:00:00');
const LATER = new Date('2026-11-05T10:00:05');
const fresh = () => L.rollover(initialState('Chloe'), NOW).state;
// progress from everything except achievements and quests (those stay earned through an undo)
const prog = (s: AppState) => JSON.stringify(deriveProgress(s.ledger.filter((e) => e.source !== 'achievement' && e.source !== 'quest')));

describe('undo', () => {
  test('undoing a logged expense removes it and gives back the Wealth, without deleting any ledger entry', () => {
    const before = fresh();
    const after = L.logMoney(before, { kind: 'out', sen: 1200, categoryId: 'food', note: '', date: '2026-11-05', wallet: 'tng' }, NOW).state;
    const undone = revertTo(before, after, LATER);
    expect(undone.money.entries).toHaveLength(0);
    expect(prog(undone)).toBe(prog(before));
    expect(undone.ledger.length).toBeGreaterThanOrEqual(after.ledger.length); // append-only: nothing removed
    for (const e of after.ledger) expect(undone.ledger.some((x) => x.id === e.id)).toBe(true);
  });
  test('undoing a tick un-ticks the task and takes the XP back', () => {
    let s = L.addTask(fresh(), { title: 'Essay', listId: 'uni' }, NOW).state;
    const id = s.tasks[s.tasks.length - 1].id;
    const after = L.completeTask(s, id, NOW).state;
    const undone = revertTo(s, after, LATER);
    expect(undone.tasks.find((t) => t.id === id)!.doneAt).toBeFalsy();
    expect(prog(undone)).toBe(prog(s));
  });
  test('undoing an un-tick ticks it again with its XP (already-reversed ledger entries are restored as new copies)', () => {
    let s = L.addTask(fresh(), { title: 'Essay', listId: 'uni' }, NOW).state;
    const id = s.tasks[s.tasks.length - 1].id;
    s = L.completeTask(s, id, NOW).state;
    const after = L.uncompleteTask(s, id, NOW).state;
    const undone = revertTo(s, after, LATER);
    expect(undone.tasks.find((t) => t.id === id)!.doneAt).toBeTruthy();
    expect(prog(undone)).toBe(prog(s));
    // the entries the un-tick reversed stay reversed (sync keeps "reversed" for good)
    for (const e of after.ledger.filter((x) => x.reversed)) expect(undone.ledger.find((x) => x.id === e.id)!.reversed).toBe(true);
  });
  test('undoing a deleted expense brings it back with the same id', () => {
    const s = L.logMoney(fresh(), { kind: 'out', sen: 800, categoryId: 'food', note: 'kopi', date: '2026-11-05' }, NOW).state;
    const id = s.money.entries[0].id;
    const after = L.deleteMoney(s, id, NOW).state;
    const undone = revertTo(s, after, LATER);
    expect(undone.money.entries.map((e) => e.id)).toEqual([id]);
    expect(prog(undone)).toBe(prog(s));
  });
  test('a sale undone puts the piece back in stock and the profit and Wealth back where they were', () => {
    let s = L.addBizItems(fresh(), { name: 'Groot', costSen: 4000, qty: 1, boughtOn: '2026-11-01' }, NOW).state;
    const id = s.business.items[0].id;
    const after = L.sellBizItem(s, id, { soldSen: 9000, feesSen: 0, soldOn: '2026-11-05', platform: 'Carousell' }, NOW).state;
    const undone = revertTo(s, after, LATER);
    expect(undone.business.items[0].status).toBe('stock');
    expect(prog(undone)).toBe(prog(s));
  });
  test('achievements, quests and settings earned or changed meanwhile are left alone', () => {
    const before = fresh();
    const after = { ...L.logMoney(before, { kind: 'out', sen: 100, categoryId: 'food', note: '', date: '2026-11-05' }, NOW).state, achievements: ['first-steps'], questsCompleted: 9 };
    const undone = revertTo(before, after, LATER);
    expect(undone.achievements).toEqual(['first-steps']);
    expect(undone.questsCompleted).toBe(9);
  });
});
