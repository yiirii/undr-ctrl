import { create } from 'zustand';
import { initialState, migrate, type AppState, type View } from './state';
import * as L from './logic';
import { moments } from './moments';
import { pickAdapter, type Adapter } from '../persistence/adapter';
import { deriveProgress, type Progress } from '../core/ledger';
import { dayKey } from '../core/dates';
import type { Appearance } from '../core/appearance';

type Args<F> = F extends (s: AppState, ...a: infer A) => L.Result ? A : never;

interface UI {
  view: View;
  detailId: string | null;
  quickAdd: boolean;
  logSheet: false | { kind: 'in' | 'out'; editId?: string };
  recapMonth: string | null;
  saveError: boolean;
  recovered: boolean;
  loaded: boolean;
}

export interface Store {
  s: AppState;
  ui: UI;
  setUI(p: Partial<UI>): void;
  go(v: View): void;
  run<F extends (s: AppState, ...a: any[]) => L.Result>(fn: F, ...args: Args<F>): void;
  setAppearance(p: Partial<Appearance>): void;
  setSettings(p: Partial<AppState['settings']>): void;
  patch(fn: (s: AppState) => AppState): void;
  load(adapter?: Adapter): Promise<void>;
  replace(s: AppState): void;
}

let adapter: Adapter | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let failures = 0;

function scheduleSave(get: () => Store, set: (p: Partial<Store>) => void) {
  if (!adapter) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const ok = await adapter!.save(JSON.stringify(get().s)).catch(() => false);
    if (ok) { failures = 0; if (get().ui.saveError) set({ ui: { ...get().ui, saveError: false } }); }
    else { failures++; set({ ui: { ...get().ui, saveError: true } }); setTimeout(() => scheduleSave(get, set), Math.min(30000, 1000 * 2 ** failures)); }
  }, 500);
}

export const useStore = create<Store>((set, get) => ({
  s: initialState(),
  ui: { view: 'myday', detailId: null, quickAdd: false, logSheet: false, recapMonth: null, saveError: false, recovered: false, loaded: false },
  setUI: (p) => set({ ui: { ...get().ui, ...p } }),
  go: (view) => set({ ui: { ...get().ui, view, detailId: null } }),
  run: (fn, ...args) => {
    const r = fn(get().s, ...args);
    if (r.state !== get().s) { set({ s: r.state }); scheduleSave(get, set); }
    if (r.moments.length) moments.emit(r.moments);
  },
  setAppearance: (p) => { set({ s: { ...get().s, appearance: { ...get().s.appearance, ...p } } }); scheduleSave(get, set); },
  setSettings: (p) => { set({ s: { ...get().s, settings: { ...get().s.settings, ...p } } }); scheduleSave(get, set); },
  patch: (fn) => { set({ s: fn(get().s) }); scheduleSave(get, set); },
  replace: (s) => { set({ s: migrate(s) }); scheduleSave(get, set); },
  load: async (a) => {
    adapter = a ?? pickAdapter();
    const got = await adapter.load().catch(() => null);
    const state = got ? migrate(got.data) : initialState();
    const r = L.rollover(state, new Date());
    set({ s: r.state, ui: { ...get().ui, loaded: true, recovered: !!got?.recovered, view: r.state.settings.startPage } });
    scheduleSave(get, set);
    if (r.moments.length) moments.emit(r.moments);
  },
}));

// convenience
export const now = () => new Date();
export const today = () => dayKey(new Date());
let memo: { ledger: unknown; p: Progress } | null = null;
export function useProgress(): Progress {
  const ledger = useStore((x) => x.s.ledger);
  if (!memo || memo.ledger !== ledger) memo = { ledger, p: deriveProgress(ledger) };
  return memo.p;
}
export const act = <F extends (s: AppState, ...a: any[]) => L.Result>(fn: F, ...args: Args<F>) => useStore.getState().run(fn, ...args);
