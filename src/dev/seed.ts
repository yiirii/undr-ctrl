// Demo data for screenshots and manual testing (?seed=demo). Never used in normal runs.
import { initialState, type AppState } from '../store/state';
import * as L from '../store/logic';
import { addDays, dayKey } from '../core/dates';
import { suggestSplit } from '../core/money';

const at = (k: string, h = 10, m = 0) => { const [y, mo, d] = k.split('-').map(Number); return new Date(y, mo - 1, d, h, m); };

export function seedDemo(kind: string): AppState {
  const now = new Date();
  const today = dayKey(now);
  let s = initialState('Chloe');
  s.profile.onboarded = kind !== 'fresh';
  if (kind === 'fresh') return s;
  if (kind === 'track') {
    s = L.rollover(s, at(addDays(today, -9))).state;
    s = L.setBudget(s, { limits: {}, savingsSen: 0, expected: {} }, at(addDays(today, -9))).state;
    for (let i = 9; i >= 0; i--) {
      const d = addDays(today, -i);
      s = L.logMoney(s, { kind: 'out', sen: 1200 + i * 90, categoryId: 'food', note: 'Lunch', date: d }, at(d, 13)).state;
      if (i % 3 === 0) s = L.logMoney(s, { kind: 'out', sen: 850, categoryId: 'transport', note: 'Grab', date: d }, at(d, 9)).state;
    }
    s = L.logMoney(s, { kind: 'in', sen: 30000, sourceId: 'allowance', note: 'From mum', date: addDays(today, -5) }, at(addDays(today, -5), 10)).state;
    return L.rollover(s, now).state;
  }
  const start = addDays(today, -34);
  s = L.rollover(s, at(start)).state;
  const income = 185000;
  const split = suggestSplit(income, s.money.categories);
  s = L.setBudget(s, { limits: split.limits, savingsSen: split.savingsSen, expected: { allowance: 120000, parttime: 65000 } }, at(start)).state;
  s = L.addGoal(s, { name: 'New laptop', targetSen: 400000, deadline: addDays(today, 140) }, at(start)).state;
  s = L.addGoal(s, { name: 'Bali trip', targetSen: 150000 }, at(start)).state;
  const add = (title: string, listId: string, extra: Partial<L.NewTask> = {}, when = start) => { s = L.addTask(s, { title, listId, ...extra }, at(when)).state; return s.tasks[s.tasks.length - 1].id; };
  const gym = add('Gym', 'fitness', { habit: true, recurrence: { kind: 'weekly', days: [1, 3, 5] }, anchor: start });
  const read = add('Read 20 pages', 'uni', { habit: true, recurrence: { kind: 'daily' }, anchor: start });
  const journal = add('Journal', 'personal', { habit: true, recurrence: { kind: 'daily' }, anchor: start, size: 'quick' });
  const lunch = ['Food', 'Food', 'Transport', 'Food', 'Fun', 'Shopping', 'Food', 'Subscriptions', 'Books & Uni', 'Food'];
  const notes = ['Nasi lemak', 'Kopi', 'Grab to campus', 'Mamak with friends', 'Movie', 'Shopee haul', 'Groceries', 'Spotify', 'Printing', 'Boba'];
  for (let i = 0; i <= 34; i++) {
    const d = addDays(start, i);
    s = L.rollover(s, at(d, 7)).state;
    if (i === 0 || d.slice(8) === '01') {
      s = L.logMoney(s, { kind: 'in', sen: 120000, sourceId: 'allowance', note: 'From mum', date: d }, at(d, 9)).state;
    }
    if (d.slice(8) === '15') s = L.logMoney(s, { kind: 'in', sen: 65000, sourceId: 'parttime', note: 'Café shifts', date: d }, at(d, 18)).state;
    const n = 1 + (i % 3);
    for (let k = 0; k < n; k++) {
      const j = (i * 3 + k) % lunch.length;
      const cat = s.money.categories.find((c) => c.name === lunch[j])!;
      const sen = [1250, 450, 900, 2200, 2400, 6890, 4560, 1590, 800, 990][j];
      s = L.logMoney(s, { kind: 'out', sen, categoryId: cat.id, note: notes[j], date: d }, at(d, 12 + k)).state;
    }
    if (i % 7 === 3) s = L.deposit(s, s.money.goals[0].id, 15000, at(d, 20)).state;
    const dayIdx = i % 7;
    if ([1, 3, 5].includes(new Date(at(d)).getDay()) && i % 9 !== 4) s = L.completeTask(s, gym, at(d, 18)).state;
    if (i % 6 !== 5 || i > 26) s = L.completeTask(s, read, at(d, 22)).state;
    if (i > 20) s = L.completeTask(s, journal, at(d, 23)).state;
    if (i < 33) {
      const t = add(['Tutorial 3', 'Lab report', 'Revise lecture notes', 'Reply to lecturer', 'Sketch session', 'Call grandma', 'Laundry'][dayIdx], ['uni', 'assignments', 'uni', 'personal', 'creative', 'social', 'personal'][dayIdx], { size: dayIdx === 1 ? 'big' : 'normal' }, d);
      s = L.completeTask(s, t, at(d, 15)).state;
    }
  }
  // Funko side business
  const funkos: [string, number, number, number | null, number][] = [
    ['Funko Pop! Groot #49', 4000, 8500, 700, 30], ['Funko Pop! Pikachu #353', 3500, 6000, 500, 26], ['Funko Pop! Spider-Man #593', 4500, 3800, 0, 22],
    ['Funko Pop! Baby Yoda #368', 5200, 9900, 900, 12], ['Funko Pop! Totoro #1095', 4800, 0, null, 9], ['Funko Pop! Totoro #1095', 4800, 0, null, 9],
    ['Funko Pop! Hedwig #76', 3900, 0, null, 4], ['Funko Pop! Wednesday #1309', 6500, 11800, 800, 3],
  ];
  for (const [name, cost, sold, fee, ago] of funkos) {
    const d = addDays(today, -ago);
    s = L.addBizItems(s, { name, costSen: cost, qty: 1, boughtOn: d, askSen: sold ? undefined : Math.round(cost * 1.8 / 100) * 100 }, at(d, 11)).state;
    if (sold) { const sd = addDays(d, Math.min(ago, 5)); s = L.sellBizItem(s, s.business.items[s.business.items.length - 1].id, { soldSen: sold, feesSen: fee ?? 0, soldOn: sd > today ? today : sd }, at(sd > today ? today : sd, 19)).state; }
  }
  s = L.addBizExpense(s, { sen: 1890, label: 'Pop protectors', date: addDays(today, -2) }, at(addDays(today, -2), 15)).state;
  // today
  s = L.rollover(s, now).state;
  add('Finish marketing report draft', 'assignments', { due: today, time: '17:00', size: 'big', myDay: true }, today);
  add('Database assignment', 'assignments', { due: addDays(today, 3), size: 'big', myDay: true }, today);
  add('Reply to internship email', 'personal', { due: addDays(today, -1), myDay: true }, today);
  const done1 = add('Log this week\'s groceries', 'personal', { myDay: true, size: 'quick' }, today);
  const done2 = add('Read chapter 4', 'uni', { myDay: true }, today);
  add('Draw thumbnail sketches', 'creative', { myDay: true, size: 'quick' }, today);
  add('Lab report: methods section', 'assignments', { due: addDays(today, 6) }, today);
  add('Group meeting prep', 'uni', { due: addDays(today, 1), time: '10:00' }, today);
  add('Buy birthday gift for Aina', 'social', { due: addDays(today, 9) }, today);
  add('Pay phone bill', 'personal', { due: addDays(today, 12), recurrence: { kind: 'monthly', day: 15 } }, today);
  s = L.completeTask(s, done1, at(today, 9, 10)).state;
  s = L.completeTask(s, done2, at(today, 9, 40)).state;
  s = L.completeTask(s, read, at(today, 8)).state;
  s = L.logMoney(s, { kind: 'out', sen: 1250, categoryId: 'food', note: 'Nasi lemak', date: today }, at(today, 9)).state;
  s.focusLog.push({ taskId: done2, day: today, minutes: 25, completed: true });
  if (kind === 'levelup') {
    const p = s.ledger.filter((e) => e.lifetime).reduce((n, e) => n + e.amount, 0);
    let L2 = 1; while (50 * (L2 + 1) * L2 <= p) L2++;
    const need = 50 * (L2 + 1) * L2 - p - 5;
    s.ledger.push({ id: 'seed-boost', at: new Date(now.getTime() - 60000).toISOString(), source: 'seed', stat: 'int', amount: need, lifetime: true, ref: 'seed' });
  }
  return s;
}
