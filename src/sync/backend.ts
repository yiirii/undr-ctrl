// Auth + remote, behind one small interface so tests (and the browser dev build) can use a fake.
import type { Remote } from './engine';

export interface SyncUser { uid: string; email: string }
export interface Backend {
  onUser(cb: (u: SyncUser | null) => void): () => void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  remote(uid: string): Remote;
}

/** Friendly words for auth errors. */
export function authMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? String((e as Error)?.message ?? e);
  if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(code)) return 'That email and password don’t match.';
  if (/email-already-in-use/.test(code)) return 'There’s already an account with that email. Sign in instead.';
  if (/weak-password/.test(code)) return 'Use at least 6 characters for the password.';
  if (/invalid-email/.test(code)) return 'That doesn’t look like an email address.';
  if (/network|offline|unavailable/.test(code)) return 'No connection. Try again when you’re online.';
  if (/too-many-requests/.test(code)) return 'Too many tries. Wait a minute and try again.';
  return 'Something went wrong. Try again.';
}
