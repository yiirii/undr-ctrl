import { describe, test, expect } from 'vitest';
import { initialState, type AppState } from '../store/state';
import * as L from '../store/logic';
import { toRecords, diff, applyRemote, isMonotone, type Rec } from './model';

const NOW = new Date(2026, 10, 4, 10);
const base = () => {
  let s = L.rollover(initialState('Chloe'), NOW).state;
  s = L.addTask(s, { title: 'Essay', listId: 'uni' } as any, NOW).state;
  s = L.addBizItems(s, { name: 'Groot', costSen: 4000, qty: 2, boughtOn: '2026-11-01' }, NOW).state;
  s = { ...s, music: { ...s.music, volume: 0.33 }, settings: { ...s.settings, backupFolder: 'G:/x', time24: true } };
  return s;
};
const recs = (s: AppState, t = 1): Rec[] => [...toRecords(s).values()].map((r) => ({ ...r, updatedAt: t }));
const synced = (s: AppState) => ({ tasks: s.tasks, items: s.business.items, ledger: s.ledger, lists: s.lists, quests: s.quests, profile: s.profile, time24: s.settings.time24, achievements: s.achievements });

describe('records', () => {
  test('keys: collections by id, singletons under one/, device-local fields excluded', () => {
    const r = toRecords(base());
    expect([...r.keys()].some((k) => k.startsWith('tasks/'))).toBe(true);
    expect([...r.keys()].filter((k) => k.startsWith('items/')).length).toBe(2);
    expect(r.has('one/profile')).toBe(true);
    expect([...r.keys()].some((k) => k.includes('music'))).toBe(false);
    expect(JSON.stringify(r.get('one/settings')!.data)).not.toContain('G:/x');
  });
  test('an empty device that applies all records of another gets the same synced data', () => {
    const s = base();
    const fresh = initialState('');
    const out = applyRemote(fresh, recs(s));
    expect(synced(out)).toEqual(synced(s));
    expect(out.music.volume).toBe(fresh.music.volume); // device-local untouched
  });
  test('device-local settings survive applying remote settings', () => {
    const local = { ...initialState('x'), settings: { ...initialState('x').settings, backupFolder: 'D:/mine' } };
    const out = applyRemote(local, recs(base()));
    expect(out.settings.backupFolder).toBe('D:/mine');
    expect(out.settings.time24).toBe(true);
  });
});

describe('diff', () => {
  test('detects added, edited and deleted records', () => {
    const a = base();
    let b = L.updateTask(a, a.tasks[0].id, { title: 'Essay v2' }).state;
    b = L.deleteBizItem(b, b.business.items[0].id, NOW).state;
    b = L.addTask(b, { title: 'New', listId: 'uni' } as any, NOW).state;
    const d = diff(a, b);
    const up = d.upserts.map((x) => x.key);
    expect(up).toContain(`tasks/${a.tasks[0].id}`);
    expect(up.some((k) => k.startsWith('tasks/') && k !== `tasks/${a.tasks[0].id}`)).toBe(true);
    expect(d.deletes.map((x) => x.key)).toContain(`items/${a.business.items[0].id}`);
  });
  test('no changes → empty diff', () => {
    const a = base();
    expect(diff(a, a)).toEqual({ upserts: [], deletes: [] });
  });
});

describe('merge rules', () => {
  test('tombstone removes a record', () => {
    const s = base();
    const id = s.business.items[0].id;
    const out = applyRemote(s, [{ k: 'items', id, key: `items/${id}`, data: null, updatedAt: 5, deleted: true } as any]);
    expect(out.business.items.some((i) => i.id === id)).toBe(false);
  });
  test('string-array singletons union; questsCompleted takes the max', () => {
    const s = { ...base(), achievements: ['a', 'b'], questsCompleted: 5 };
    const out = applyRemote(s, [
      { k: 'one', id: 'achievements', key: 'one/achievements', data: ['b', 'c'], updatedAt: 1 },
      { k: 'one', id: 'questsCompleted', key: 'one/questsCompleted', data: 3, updatedAt: 9 },
    ] as any);
    expect(out.achievements.sort()).toEqual(['a', 'b', 'c']);
    expect(out.questsCompleted).toBe(5);
    expect(isMonotone('one/achievements')).toBe(true);
    expect(isMonotone('tasks/x')).toBe(false);
  });
  test('ledger: reversed once set stays set', () => {
    const s = base();
    const e = s.ledger[s.ledger.length - 1];
    const local = { ...s, ledger: s.ledger.map((x) => (x.id === e.id ? { ...x, reversed: true } : x)) };
    const out = applyRemote(local, [{ k: 'ledger', id: e.id, key: `ledger/${e.id}`, data: { ...e, reversed: undefined }, updatedAt: 99 }] as any);
    expect(out.ledger.find((x) => x.id === e.id)!.reversed).toBe(true);
  });
});
