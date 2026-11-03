import { describe, test, expect } from 'vitest';
import { initialState } from './state';
import * as L from './logic';
import { deriveProgress } from '../core/ledger';
import { deadline, startNudges } from '../core/deadline';

const NOW = new Date(2026, 10, 3, 10, 0);
const fresh = () => L.rollover(initialState('Chloe'), NOW).state;
const withTask = (o: Partial<Parameters<typeof L.addTask>[1]> = {}) => {
  const s = L.addTask(fresh(), { title: 'Essay', listId: 'uni', ...o } as any, NOW).state;
  return { s, id: s.tasks[s.tasks.length - 1].id };
};

describe('steps inside tasks', () => {
  test('add, tick (+2 XP to the task stat), untick (reversed), reorder, delete', () => {
    let { s, id } = withTask();
    s = L.addStep(s, id, 'Outline').state;
    s = L.addStep(s, id, 'Draft').state;
    s = L.addStep(s, id, '  ').state; // ignored
    const t = () => s.tasks.find((x) => x.id === id)!;
    expect(t().steps!.map((x) => x.title)).toEqual(['Outline', 'Draft']);
    const [a, b] = t().steps!.map((x) => x.id);
    s = L.toggleStep(s, id, a, NOW).state;
    expect(t().steps![0].done).toBe(true);
    expect(deriveProgress(s.ledger).statXp.int).toBe(2);
    s = L.toggleStep(s, id, a, NOW).state;
    expect(deriveProgress(s.ledger).statXp.int).toBe(0);
    s = L.moveStep(s, id, b, 0).state;
    expect(t().steps!.map((x) => x.title)).toEqual(['Draft', 'Outline']);
    s = L.renameStep(s, id, b, 'First draft').state;
    s = L.deleteStep(s, id, a, NOW).state;
    expect(t().steps!.map((x) => x.title)).toEqual(['First draft']);
  });
  test('deleting a ticked step takes its XP back', () => {
    let { s, id } = withTask();
    s = L.addStep(s, id, 'Outline').state;
    const sid = s.tasks.find((x) => x.id === id)!.steps![0].id;
    s = L.toggleStep(s, id, sid, NOW).state;
    s = L.deleteStep(s, id, sid, NOW).state;
    expect(deriveProgress(s.ledger).statXp.int).toBe(0);
  });
});

describe('deadline countdown', () => {
  test('days left and a bar that drains from creation to due', () => {
    const t = { createdAt: '2026-11-01T02:00:00.000Z', due: '2026-11-11', size: 'big' } as any;
    const d = deadline(t, '2026-11-06')!;
    expect(d.daysLeft).toBe(5);
    expect(d.remaining).toBeCloseTo(0.5, 1);
    expect(d.label).toBe('5 days left');
    expect(deadline({ ...t, due: '2026-11-06' }, '2026-11-06')!.label).toBe('Due today');
    expect(deadline({ ...t, due: '2026-11-07' }, '2026-11-06')!.label).toBe('Tomorrow');
    expect(deadline({ ...t, due: '2026-11-04' }, '2026-11-06')!.label).toBe('2 days late');
    expect(deadline({ ...t, due: undefined }, '2026-11-06')).toBeNull();
  });
  test('early nudge: Big task due within 5 days with no steps done and no focus time', () => {
    let { s } = withTask({ size: 'big', due: '2026-11-07', title: 'Lab report' });
    let n = startNudges(s.tasks, s.focusLog, '2026-11-03');
    expect(n.map((x) => [x.task.title, x.daysLeft])).toEqual([['Lab report', 4]]);
    // focus time on it removes the nudge
    s = { ...s, focusLog: [{ taskId: s.tasks[0].id, day: '2026-11-03', minutes: 25 } as any] };
    expect(startNudges(s.tasks, s.focusLog, '2026-11-03')).toEqual([]);
  });
  test('no nudge for normal tasks or far-away deadlines', () => {
    const a = withTask({ size: 'normal', due: '2026-11-05' }).s;
    expect(startNudges(a.tasks, [], '2026-11-03')).toEqual([]);
    const b = withTask({ size: 'big', due: '2026-11-20' }).s;
    expect(startNudges(b.tasks, [], '2026-11-03')).toEqual([]);
  });
});

describe('completion combo', () => {
  test('finishing tasks within 90 s builds a combo with +2 XP per step, capped at +10', () => {
    let s = fresh();
    for (let i = 0; i < 8; i++) s = L.addTask(s, { title: `t${i}`, listId: 'personal' } as any, NOW).state;
    const ids = s.tasks.map((t) => t.id);
    const combos: number[] = [];
    let at = NOW.getTime();
    for (const id of ids) {
      const r = L.completeTask(s, id, new Date(at));
      s = r.state;
      const c = r.moments.find((m) => m.type === 'combo') as any;
      combos.push(c ? c.bonus : 0);
      at += 30_000;
    }
    expect(combos).toEqual([0, 2, 4, 6, 8, 10, 10, 10]);
  });
  test('a gap over 90 s resets the combo; undo takes the bonus back', () => {
    let s = fresh();
    for (let i = 0; i < 3; i++) s = L.addTask(s, { title: `t${i}`, listId: 'personal' } as any, NOW).state;
    const [a, b, c] = s.tasks.map((t) => t.id);
    s = L.completeTask(s, a, NOW).state;
    const r = L.completeTask(s, b, new Date(NOW.getTime() + 60_000));
    s = r.state;
    expect(r.moments.some((m) => m.type === 'combo')).toBe(true);
    s = L.uncompleteTask(s, b, new Date(NOW.getTime() + 70_000)).state;
    const liveCombo = s.ledger.filter((e) => e.source === 'combo' && !e.reversed).reduce((n, e) => n + e.amount, 0);
    expect(liveCombo).toBe(0);
    const r2 = L.completeTask(s, c, new Date(NOW.getTime() + 400_000));
    expect(r2.moments.some((m) => m.type === 'combo')).toBe(false);
  });
});
