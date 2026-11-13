import { create } from 'zustand';
import { initialState, migrate, type AppState, type View } from './state';
import * as L from './logic';
import { moments } from './moments';
import { revertTo } from './undo';
import { pickAdapter, type Adapter } from '../persistence/adapter';
import { deriveProgress, type Progress } from '../core/ledger';
import { dayKey } from '../core/dates';
import type { Appearance } from '../core/appearance';

type Args<F> = F extends (s: AppState, ...a: infer A) => L.Result ? A : never;

/** Business windows, opened from the Business tab or from the phone's + button. */
export type BizSheet =
  | null
  | { kind: 'buy'; kept?: boolean }
  | { kind: 'sell'; id?: string }
  | { kind: 'reserve'; id?: string }
  | { kind: 'paid'; id: string }
  | { kind: 'cost' }
  | { kind: 'platforms' }
  | { kind: 'item'; id: string }
  | { kind: 'tng' }
  | { kind: 'move' };

interface UI {
  view: View;
  detailId: string | null;
  quickAdd: boolean;
  logSheet: false | { kind: 'in' | 'out'; editId?: string };
  recapMonth: string | null;
  moneyTab?: 'personal' | 'business'; // remembered while the app is open
  bizSheet?: BizSheet;
  moreOpen?: boolean; // phone: the More sheet
  quickActions?: boolean; // phone: the + sheet
  undo?: { id: number; label: string } | null; // the "Undo" toast for the last action
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

/** Write immediately (used when the window is closing so a pending debounced save is never lost). */
export function flushSave(json: string) {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  const b = typeof window !== 'undefined' ? window.lofi : undefined;
  if (b) return b.storage.saveSync(json);
  try { localStorage.setItem('lofi-data', json); return true; } catch { return false; }
}

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
    window.addEventListener('beforeunload', () => { if (saveTimer) flushSave(JSON.stringify(get().s)); });
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
// ---------------- undo ----------------
let lastUndo: { id: number; before: AppState } | null = null;
let undoSeq = 0;
/** Run an action and offer "Undo" for a few seconds. `label` is shown on the toast. */
export function actUndoable<F extends (s: AppState, ...a: any[]) => L.Result>(label: string, fn: F, ...args: Args<F>) {
  const st = useStore.getState();
  const before = st.s;
  st.run(fn, ...args);
  if (useStore.getState().s === before) return; // nothing happened
  const id = ++undoSeq;
  lastUndo = { id, before };
  useStore.getState().setUI({ undo: { id, label } });
}
/** Put things back the way they were before the last undoable action. */
export function undoLast() {
  const st = useStore.getState();
  if (!lastUndo || st.ui.undo?.id !== lastUndo.id) return;
  const next = revertTo(lastUndo.before, st.s, new Date());
  lastUndo = null;
  st.patch(() => next);
  st.setUI({ undo: null });
}
export function dismissUndo(id: number) { const st = useStore.getState(); if (st.ui.undo?.id === id) { st.setUI({ undo: null }); lastUndo = null; } }

export const act = <F extends (s: AppState, ...a: any[]) => L.Result>(fn: F, ...args: Args<F>) => useStore.getState().run(fn, ...args);
