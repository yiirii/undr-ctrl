import { describe, test, expect } from 'vitest';
import { initialState, type AppState } from '../store/state';
import * as L from '../store/logic';
import { deriveProgress } from '../core/ledger';
import { bizMonth } from '../core/business';
import { SyncEngine } from './engine';
import { FakeServer } from './fakeRemote';

const D = (d: string, h = 10) => new Date(`${d}T${String(h).padStart(2, '0')}:00:00`);

function device(server: FakeServer, s0: AppState, name: string) {
  let s = s0;
  let t = 1000;
  const clock = { now: () => t, tick: (ms = 1000) => { t += ms; } };
  const remote = server.client(name);
  const eng = new SyncEngine({ get: () => s, set: (x) => { s = x; }, remote, device: name, now: () => clock.now(), meta: {} });
  const act = <F extends (st: AppState, ...a: any[]) => L.Result>(fn: F, ...args: any[]) => {
    const prev = s; s = (fn as any)(s, ...args).state; clock.tick(); eng.onLocalChange(prev, s);
  };
  return { get s() { return s; }, eng, remote, clock, act };
}
const settle = async (...devs: { eng: SyncEngine }[]) => { for (let i = 0; i < 3; i++) for (const d of devs) await d.eng.flush(); };
const wea = (s: AppState) => deriveProgress(s.ledger).statXp.wea;
const life = (s: AppState) => deriveProgress(s.ledger).lifetime;

function laptopWithData() {
  let s = L.rollover(initialState('Chloe'), D('2026-11-01')).state;
  s = { ...s, profile: { ...s.profile, onboarded: true } };
  s = L.setBudget(s, { limits: { food: 30000 }, savingsSen: 0, expected: {} }, D('2026-11-01')).state;
  s = L.addTask(s, { title: 'Essay', listId: 'uni' } as any, D('2026-11-01')).state;
  s = L.addBizItems(s, { name: 'Groot', costSen: 4000, qty: 1, boughtOn: '2026-11-01' }, D('2026-11-01')).state;
  s = L.addBizItems(s, { name: 'Hedwig', costSen: 3000, qty: 1, boughtOn: '2026-11-01' }, D('2026-11-01')).state;
  return s;
}

describe('sync engine', () => {
  test('first sign-in: laptop uploads, empty phone downloads (and does not wipe the laptop)', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    expect(ph.s.business.items.map((i) => i.name)).toEqual(['Groot', 'Hedwig']);
    expect(ph.s.tasks.map((t) => t.title)).toEqual(['Essay']);
    expect(ph.s.profile.name).toBe('Chloe');
    expect(lap.s.business.items.length).toBe(2);
    expect(wea(ph.s)).toBe(wea(lap.s));
  });

  test('offline edits on both devices converge; the newest edit to the same piece wins; nothing else is lost', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    const groot = lap.s.business.items.find((i) => i.name === 'Groot')!.id;
    lap.remote.online = false; ph.remote.online = false;
    lap.act(L.editBizItem, groot, { askSen: 8000 }, D('2026-11-02'));
    lap.act(L.addTask, { title: 'Laptop task', listId: 'uni' }, D('2026-11-02'));
    ph.clock.tick(5000); // phone edits later
    ph.act(L.editBizItem, groot, { askSen: 9000 }, D('2026-11-02'));
    ph.act(L.addTask, { title: 'Phone task', listId: 'uni' }, D('2026-11-02'));
    expect(ph.eng.status.pending).toBeGreaterThan(0);
    lap.remote.online = true; ph.remote.online = true;
    await settle(lap, ph);
    for (const d of [lap, ph]) {
      expect(d.s.business.items.find((i) => i.id === groot)!.askSen).toBe(9000);
      expect(d.s.tasks.map((t) => t.title).sort()).toEqual(['Essay', 'Laptop task', 'Phone task']);
    }
    expect(ph.eng.status.pending).toBe(0);
  });

  test('both devices roll over the same days offline: drip and quests are not doubled', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    lap.remote.online = false; ph.remote.online = false;
    lap.act(L.rollover, D('2026-11-05'));
    ph.act(L.rollover, D('2026-11-05', 11));
    const alone = wea(lap.s);
    lap.remote.online = true; ph.remote.online = true;
    await settle(lap, ph);
    expect(wea(lap.s)).toBe(alone);
    expect(wea(ph.s)).toBe(alone);
    for (const d of [lap, ph]) {
      expect(d.s.quests.filter((q) => q.kind === 'daily' && q.period === '2026-11-05').length).toBe(3);
      expect(d.s.quests.filter((q) => q.kind === 'weekly').length).toBe(2);
    }
  });

  test('a newer delete is not undone by an older edit from the other device', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    const hedwig = lap.s.business.items.find((i) => i.name === 'Hedwig')!.id;
    lap.remote.online = false; ph.remote.online = false;
    ph.act(L.editBizItem, hedwig, { askSen: 7000 }, D('2026-11-02')); // older
    lap.clock.tick(10_000);
    lap.act(L.deleteBizItem, hedwig, D('2026-11-02')); // newer
    lap.remote.online = true; ph.remote.online = true;
    await settle(lap, ph);
    for (const d of [lap, ph]) expect(d.s.business.items.some((i) => i.id === hedwig)).toBe(false);
    expect(wea(lap.s)).toBe(wea(ph.s));
  });

  test('undo on one device while the other is offline: reversed on both, Wealth and profit match', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    const groot = ph.s.business.items.find((i) => i.name === 'Groot')!.id;
    ph.act(L.sellBizItem, groot, { soldSen: 8500, soldOn: '2026-11-02', platform: 'Carousell' }, D('2026-11-02'));
    await settle(lap, ph);
    expect(lap.s.business.items.find((i) => i.id === groot)!.status).toBe('sold');
    ph.remote.online = false;
    lap.act(L.unsellBizItem, groot, D('2026-11-02', 12));
    await settle(lap);
    ph.remote.online = true;
    await settle(lap, ph);
    for (const d of [lap, ph]) expect(d.s.business.items.find((i) => i.id === groot)!.status).toBe('stock');
    expect(wea(ph.s)).toBe(wea(lap.s));
    expect(life(ph.s)).toBe(life(lap.s));
    expect(bizMonth(ph.s.business.items, [], '2026-11').profitSen).toBe(bizMonth(lap.s.business.items, [], '2026-11').profitSen);
  });

  test('device-local things (music, backup folder) never cross devices', async () => {
    const server = new FakeServer();
    const l0 = laptopWithData();
    const lap = device(server, { ...l0, music: { ...l0.music, volume: 0.2 }, settings: { ...l0.settings, backupFolder: 'G:/My Drive/Undr Ctrl' } }, 'laptop');
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    expect(ph.s.settings.backupFolder).toBeUndefined();
    expect(ph.s.music.volume).toBe(initialState('').music.volume);
  });

  test('a device whose clock runs an hour behind still wins with an edit made after it saw the other one', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.clock.tick(3_600_000); // laptop clock ahead
    lap.eng.start(); await settle(lap);
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(lap, ph);
    const groot = lap.s.business.items.find((i) => i.name === 'Groot')!.id;
    lap.act(L.editBizItem, groot, { askSen: 8000 }, D('2026-11-02'));
    await settle(lap, ph);
    ph.act(L.editBizItem, groot, { askSen: 9900 }, D('2026-11-02')); // later in real time, earlier by its clock
    await settle(lap, ph);
    for (const d of [lap, ph]) expect(d.s.business.items.find((i) => i.id === groot)!.askSen).toBe(9900);
  });
});

describe('restart while offline', () => {
  test('changes made offline survive an app restart and are pushed later', async () => {
    const server = new FakeServer();
    const lap = device(server, laptopWithData(), 'laptop');
    lap.eng.start(); await settle(lap);
    lap.remote.online = false;
    lap.act(L.addTask, { title: 'Written offline', listId: 'uni' }, D('2026-11-02'));
    const saved = JSON.parse(JSON.stringify(lap.eng.snapshot()));
    lap.eng.stop();
    // app restarts with the saved state + sync snapshot, now online
    let s = lap.s;
    const remote = server.client('laptop2');
    const eng2 = new SyncEngine({ get: () => s, set: (x) => { s = x; }, remote, device: 'laptop', meta: saved.meta, pending: saved.pending, now: () => 99_999 });
    eng2.start(); await eng2.flush();
    const ph = device(server, initialState(''), 'phone');
    ph.eng.start(); await settle(ph);
    expect(ph.s.tasks.map((t) => t.title)).toContain('Written offline');
  });
});
