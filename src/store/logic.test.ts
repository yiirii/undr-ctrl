import { describe, test, expect } from 'vitest';
import { initialState, type AppState } from './state';
import * as L from './logic';
import { deriveProgress } from '../core/ledger';

const NOW = new Date(2026, 10, 3, 10, 0); // Tue 3 Nov 2026 10:00 local
const at = (d: number, h = 10) => new Date(2026, 10, d, h, 0);
const fresh = () => L.rollover(initialState('Chloe'), NOW).state;

function addUniTask(s: AppState, extra: Partial<Parameters<typeof L.addTask>[1]> = {}) {
  const r = L.addTask(s, { title: 'Read chapter 4', listId: 'uni', ...extra }, NOW);
  return { s: r.state, id: r.state.tasks[r.state.tasks.length - 1].id };
}

describe('tasks', () => {
  test('completing a Normal Uni task adds 20 int xp and emits taskCompleted', () => {
    const { s, id } = addUniTask(fresh());
    const r = L.completeTask(s, id, NOW);
    const p = deriveProgress(r.state.ledger);
    expect(p.statXp.int).toBe(20);
    expect(r.moments.find((m) => m.type === 'taskCompleted')).toMatchObject({ type: 'taskCompleted', xp: 20, stat: 'int' });
  });
  test('on-time bonus when due today or later', () => {
    const { s, id } = addUniTask(fresh(), { due: '2026-11-04' });
    expect(deriveProgress(L.completeTask(s, id, NOW).state.ledger).statXp.int).toBe(25);
  });
  test('task stat override beats list stat', () => {
    const { s, id } = addUniTask(fresh(), { stat: 'cre' });
    expect(deriveProgress(L.completeTask(s, id, NOW).state.ledger).statXp.cre).toBe(20);
  });
  test('uncompleting restores the previous state', () => {
    const { s, id } = addUniTask(fresh());
    const done = L.completeTask(s, id, NOW).state;
    const back = L.uncompleteTask(done, id, NOW).state;
    expect(deriveProgress(back.ledger).statXp.int).toBe(0);
    expect(back.tasks.find((t) => t.id === id)!.doneAt).toBeUndefined();
  });
  test('completing a habit increments its streak', () => {
    let s = fresh();
    s = L.addTask(s, { title: 'Gym', listId: 'fitness', habit: true, recurrence: { kind: 'daily' }, anchor: '2026-11-01' }, NOW).state;
    const id = s.tasks[s.tasks.length - 1].id;
    s = L.completeTask(s, id, at(1)).state;
    s = L.completeTask(s, id, at(2)).state;
    const r = L.completeTask(s, id, at(3));
    expect(r.state.tasks.find((t) => t.id === id)!.streak).toBe(3);
    expect(deriveProgress(r.state.ledger).statXp.str).toBe(22 + 24 + 26);
  });
  test('recurring monthly task spawns its next instance', () => {
    let s = fresh();
    s = L.addTask(s, { title: 'Pay rent', listId: 'personal', due: '2026-11-05', recurrence: { kind: 'monthly', day: 5 } }, NOW).state;
    const id = s.tasks[s.tasks.length - 1].id;
    s = L.completeTask(s, id, NOW).state;
    expect(s.tasks.filter((t) => t.title === 'Pay rent' && !t.doneAt)[0].due).toBe('2026-12-05');
  });
  test('first task unlocks First Steps achievement with xp', () => {
    const { s, id } = addUniTask(fresh());
    const r = L.completeTask(s, id, NOW);
    expect(r.state.achievements).toContain('first-steps');
    expect(r.moments.some((m) => m.type === 'achievementUnlocked')).toBe(true);
  });
  test('level up emits a moment', () => {
    let s = fresh();
    s = { ...s, ledger: [...s.ledger, { id: 'seed', at: '2026-11-01T00:00:00.000Z', source: 'seed', stat: null, amount: 70, lifetime: true, ref: 'seed' }] };
    const { s: s2, id } = addUniTask(s);
    const r = L.completeTask(s2, id, NOW); // +20 task +25 first-steps → crosses 100
    expect(r.moments.some((m) => m.type === 'levelUp' && m.level === 2)).toBe(true);
  });
});

describe('money', () => {
  test('logging money out today subtracts wealth and gives bookkeeping xp', () => {
    let s = fresh();
    s = L.setBudget(s, { limits: { food: 60000 }, savingsSen: 0, expected: {} }, NOW).state;
    s = { ...s, ledger: [...s.ledger, { id: 'w', at: '2026-11-01T00:00:00.000Z', source: 'drip', stat: 'wea', amount: 100, lifetime: false, ref: 'w' }] };
    const r = L.logMoney(s, { kind: 'out', sen: 1250, categoryId: 'food', note: 'lunch', date: '2026-11-03' }, NOW);
    const p = deriveProgress(r.state.ledger);
    expect(p.statXp.wea).toBe(100 - 13);
    expect(r.state.ledger.some((e) => e.source === 'bookkeeping' && e.amount === 2)).toBe(true);
  });
  test('deleting an entry reverses its xp', () => {
    let s = fresh();
    s = { ...s, ledger: [...s.ledger, { id: 'w', at: '2026-11-01T00:00:00.000Z', source: 'drip', stat: 'wea', amount: 100, lifetime: false, ref: 'w' }] };
    s = L.logMoney(s, { kind: 'out', sen: 2000, categoryId: 'food', note: '', date: '2026-11-03' }, NOW).state;
    const id = s.money.entries[0].id;
    s = L.deleteMoney(s, id, NOW).state;
    expect(deriveProgress(s.ledger).statXp.wea).toBe(100);
    expect(s.money.entries.length).toBe(0);
  });
  test('deposit gives 2 xp per RM toward wealth and lifetime', () => {
    let s = fresh();
    s = L.addGoal(s, { name: 'New laptop', targetSen: 400000 }, NOW).state;
    const before = deriveProgress(s.ledger).lifetime;
    s = L.deposit(s, s.money.goals[0].id, 5000, NOW).state;
    const p = deriveProgress(s.ledger);
    expect(p.statXp.wea).toBe(100);
    expect(p.lifetime - before).toBeGreaterThanOrEqual(100);
    expect(s.money.goals[0].savedSen).toBe(5000);
  });
  test('income does not touch wealth', () => {
    const s = L.logMoney(fresh(), { kind: 'in', sen: 150000, sourceId: 'allowance', note: '', date: '2026-11-03' }, NOW).state;
    expect(deriveProgress(s.ledger).statXp.wea).toBe(0);
  });
  test('rejects non-positive amounts', () => {
    const s = fresh();
    expect(L.logMoney(s, { kind: 'out', sen: 0, categoryId: 'food', note: '', date: '2026-11-03' }, NOW).state).toBe(s);
  });
});

describe('focus', () => {
  test('a completed focus session gives 10 xp to the task stat, then 5', () => {
    const { s, id } = addUniTask(fresh());
    let st = L.focusStart(s, id, 25, NOW.getTime()).state;
    st = L.focusStop(st, NOW.getTime() + 25 * 60000, new Date(NOW.getTime() + 25 * 60000)).state;
    expect(deriveProgress(st.ledger).statXp.int).toBe(10);
    st = L.focusStart(st, id, 25, NOW.getTime() + 30 * 60000).state;
    st = L.focusStop(st, NOW.getTime() + 55 * 60000, new Date(NOW.getTime() + 55 * 60000)).state;
    expect(deriveProgress(st.ledger).statXp.int).toBe(15);
    expect(st.focusLog.length).toBe(2);
  });
  test('abandoned session gives nothing', () => {
    const { s, id } = addUniTask(fresh());
    let st = L.focusStart(s, id, 25, NOW.getTime()).state;
    st = L.focusStop(st, NOW.getTime() + 10 * 60000, NOW).state;
    expect(deriveProgress(st.ledger).statXp.int).toBe(0);
  });
});

describe('quests', () => {
  test('completing a quest claims its xp once', () => {
    let s = fresh();
    s = { ...s, quests: [{ id: 'q', templateId: 'd-three', kind: 'daily', period: '2026-11-03', label: 'Complete 3 tasks', target: 3, claimed: false }] };
    for (let i = 0; i < 3; i++) {
      const r = L.addTask(s, { title: `t${i}`, listId: 'personal' }, NOW);
      s = L.completeTask(r.state, r.state.tasks[r.state.tasks.length - 1].id, NOW).state;
    }
    expect(s.quests[0].claimed).toBe(true);
    expect(s.ledger.filter((e) => e.source === 'quest').length).toBe(1);
  });
});

describe('business money (TnG)', () => {
  test('an expense remembers what paid for it; Wealth is the same whichever wallet paid', () => {
    const a = L.logMoney(fresh(), { kind: 'out', sen: 1200, categoryId: 'food', note: '', date: '2026-11-03', wallet: 'tng' }, NOW).state;
    const b = L.logMoney(fresh(), { kind: 'out', sen: 1200, categoryId: 'food', note: '', date: '2026-11-03', wallet: 'cash' }, NOW).state;
    expect(a.money.entries[0].wallet).toBe('tng');
    expect(b.money.entries[0].wallet).toBe('cash');
    const w = (s: AppState) => JSON.stringify(deriveProgress(s.ledger).stats.wea);
    expect(w(a)).toBe(w(b));
  });
  test('editing an entry can switch its wallet', () => {
    let s = L.logMoney(fresh(), { kind: 'out', sen: 900, categoryId: 'food', note: '', date: '2026-11-03', wallet: 'cash' }, NOW).state;
    s = L.editMoney(s, s.money.entries[0].id, { wallet: 'tng' }, NOW).state;
    expect(s.money.entries[0].wallet).toBe('tng');
  });
  test('telling the app your TnG balance makes business money equal it, then spending lowers it', () => {
    let s = L.setTngBalance(fresh(), 25000, NOW).state;
    expect(L.businessMoneyNow(s)).toBe(25000);
    s = L.logMoney(s, { kind: 'out', sen: 1200, categoryId: 'food', note: '', date: '2026-11-03', wallet: 'tng' }, NOW).state;
    expect(L.businessMoneyNow(s)).toBe(23800);
    s = L.logMoney(s, { kind: 'out', sen: 5000, categoryId: 'food', note: '', date: '2026-11-03', wallet: 'cash' }, NOW).state;
    expect(L.businessMoneyNow(s)).toBe(23800);
  });
  test('moving money in or out changes business money but never Wealth or XP; a move can be deleted', () => {
    let s = L.setTngBalance(fresh(), 10000, NOW).state;
    const before = s.ledger.length;
    s = L.addMove(s, { sen: 3000, dir: 'in', date: '2026-11-03', note: 'Topped up' }, NOW).state;
    expect(L.businessMoneyNow(s)).toBe(13000);
    s = L.addMove(s, { sen: 500, dir: 'out', date: '2026-11-03' }, NOW).state;
    expect(L.businessMoneyNow(s)).toBe(12500);
    expect(s.ledger.length).toBe(before);
    s = L.deleteMove(s, s.business.moves[1].id).state;
    expect(L.businessMoneyNow(s)).toBe(13000);
    expect(L.addMove(s, { sen: 0, dir: 'in', date: '2026-11-03' }, NOW).state).toBe(s);
  });
  test('no balance until it is set', () => {
    expect(L.businessMoneyNow(fresh())).toBeNull();
  });
});
