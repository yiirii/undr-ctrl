// Runs sync in the app: picks the backend, follows sign-in, wires the engine to the store.
import { create } from 'zustand';
import { useStore } from '../store/store';
import { SyncEngine, type SyncStatus } from './engine';
import { authMessage, type Backend, type SyncUser } from './backend';

interface SyncUI { user: SyncUser | null; ready: boolean; status: SyncStatus; available: boolean; enabled: boolean; firstData: boolean }
export const useSync = create<SyncUI>(() => ({ user: null, ready: false, available: true, enabled: false, firstData: false, status: { pending: 0, online: true, started: false } }));

let backend: Backend | null = null;
let engine: SyncEngine | null = null;
let teardown: (() => void)[] = [];

const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage full or blocked */ } },
};
function deviceId() {
  let d = ls.get('undr-device');
  if (!d) { d = `${navigator.userAgent.includes('Electron') ? 'pc' : 'web'}-${Math.random().toString(36).slice(2, 10)}`; ls.set('undr-device', d); }
  return d;
}

async function pickBackend(): Promise<Backend> {
  const fake = import.meta.env.DEV && new URLSearchParams(location.search).has('syncfake');
  if (fake) {
    const w = window as unknown as { __lofiFake?: Backend };
    if (!w.__lofiFake) { const { fakeBackend } = await import('./fakeBackend'); w.__lofiFake = fakeBackend(); }
    return w.__lofiFake;
  }
  const { firebaseBackend } = await import('./firebase');
  return firebaseBackend();
}

function startEngine(u: SyncUser) {
  stopEngine();
  const key = `undr-sync:${u.uid}`;
  let saved: { meta?: Record<string, number>; pending?: never[] } = {};
  try { saved = JSON.parse(ls.get(key) ?? '{}'); } catch { /* corrupt: start fresh, the server has the truth */ }
  let persistTimer: ReturnType<typeof setTimeout> | null = null;
  const persist = () => { if (persistTimer) clearTimeout(persistTimer); persistTimer = setTimeout(() => engine && ls.set(key, JSON.stringify(engine.snapshot())), 400); };
  engine = new SyncEngine({
    get: () => useStore.getState().s,
    set: (s) => useStore.getState().patch(() => s),
    remote: backend!.remote(u.uid),
    device: deviceId(),
    meta: saved.meta ?? {},
    pending: saved.pending ?? [],
    onMeta: persist,
  });
  const e = engine;
  teardown.push(useStore.subscribe((st, prev) => { if (st.s !== prev.s) { e.onLocalChange(prev.s, st.s); persist(); } }));
  teardown.push(e.onStatus((status) => useSync.setState({ status, ...(status.lastSync ? { firstData: true } : {}) })));
  teardown.push(useStore.subscribe((st) => { if (st.s.profile.onboarded) useSync.setState({ firstData: true }); }));
  const iv = setInterval(() => void e.flush(), 5000);
  const online = () => void e.flush();
  window.addEventListener('online', online);
  teardown.push(() => { clearInterval(iv); window.removeEventListener('online', online); if (persistTimer) { clearTimeout(persistTimer); ls.set(key, JSON.stringify(e.snapshot())); } });
  e.start();
}
function stopEngine() { teardown.forEach((f) => f()); teardown = []; engine?.stop(); engine = null; useSync.setState({ status: { pending: 0, online: true, started: false } }); }

/** Call once after the app data has loaded. */
export async function startSyncService() {
  useSync.setState({ enabled: true });
  try { backend = await pickBackend(); }
  catch { useSync.setState({ available: false, ready: true }); return; }
  backend.onUser((u) => { useSync.setState({ user: u, ready: true }); if (u) startEngine(u); else stopEngine(); });
}

export const sync = {
  async signIn(email: string, pw: string) { try { await backend!.signIn(email, pw); return null; } catch (e) { return authMessage(e); } },
  async signUp(email: string, pw: string) { try { await backend!.signUp(email, pw); return null; } catch (e) { return authMessage(e); } },
  async signOut() { await backend?.signOut(); },
  async reset(email: string) { try { await backend!.resetPassword(email); return null; } catch (e) { return authMessage(e); } },
  flush: () => engine?.flush(),
};
