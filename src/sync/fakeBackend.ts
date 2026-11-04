// Dev/test backend: in-memory accounts + FakeServer, shared across tabs of one page load.
import type { Backend, SyncUser } from './backend';
import { FakeServer } from './fakeRemote';

export function fakeBackend(server = new FakeServer()): Backend & { server: FakeServer } {
  const users = new Map<string, { uid: string; pw: string }>();
  let cur: SyncUser | null = null;
  const cbs = new Set<(u: SyncUser | null) => void>();
  const emit = () => cbs.forEach((c) => c(cur));
  const err = (code: string) => Object.assign(new Error(code), { code });
  return {
    server,
    onUser: (cb) => { cbs.add(cb); cb(cur); return () => { cbs.delete(cb); }; },
    signUp: async (e, p) => { if (users.has(e)) throw err('auth/email-already-in-use'); if (p.length < 6) throw err('auth/weak-password'); users.set(e, { uid: 'u-' + e, pw: p }); cur = { uid: 'u-' + e, email: e }; emit(); },
    signIn: async (e, p) => { const u = users.get(e); if (!u || u.pw !== p) throw err('auth/invalid-credential'); cur = { uid: u.uid, email: e }; emit(); },
    signOut: async () => { cur = null; emit(); },
    resetPassword: async () => {},
    remote: () => server.client('dev'),
  };
}
