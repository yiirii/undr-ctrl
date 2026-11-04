// Sync engine: stages local changes as timestamped records, pushes them, and merges incoming ones.
import type { AppState } from '../store/state';
import { diff, applyRemote, toRecords, isMonotone, type Rec, type RecBody } from './model';

export interface PushResult { rejected: string[] } // keys the server refused because it already has something newer
export interface Remote {
  push(recs: Rec[]): Promise<PushResult>;
  /** Calls back with an initial snapshot (possibly empty) and then with every change. */
  subscribe(cb: (recs: Rec[]) => void): () => void;
}
export type SyncMeta = Record<string, number>;
export interface SyncStatus { pending: number; lastSync?: number; online: boolean; started: boolean }

export class SyncEngine {
  private pending = new Map<string, Rec>();
  private applying = false;
  private first = true;
  private lastStamp = 0;
  private unsub?: () => void;
  private flushing?: Promise<void>;
  status: SyncStatus = { pending: 0, online: true, started: false };
  private listeners = new Set<(s: SyncStatus) => void>();

  constructor(private o: {
    get(): AppState; set(s: AppState): void; remote: Remote; device: string;
    now?: () => number; meta: SyncMeta; onMeta?: (m: SyncMeta) => void;
  }) {}

  private now() { return (this.o.now ?? Date.now)(); }
  /** Newer than anything this device has seen for the key, so a later edit wins even if this clock runs behind. */
  private stamp(key: string) { const t = Math.max(this.now(), this.lastStamp + 1, (this.o.meta[key] ?? 0) + 1); this.lastStamp = t; return t; }
  private emit() { this.status = { ...this.status, pending: this.pending.size }; for (const l of this.listeners) l(this.status); }
  onStatus(l: (s: SyncStatus) => void) { this.listeners.add(l); return () => { this.listeners.delete(l); }; }

  start() {
    if (this.status.started) return;
    this.status = { ...this.status, started: true };
    this.first = true;
    this.unsub = this.o.remote.subscribe((recs) => this.receive(recs));
    this.emit();
  }
  stop() { this.unsub?.(); this.unsub = undefined; this.status = { ...this.status, started: false }; this.emit(); }

  private stage(b: RecBody | Omit<RecBody, 'data'>, deleted = false) {
    const t = this.stamp(b.key);
    const rec: Rec = { key: b.key, k: b.k, id: b.id, data: deleted ? null : (b as RecBody).data, updatedAt: t, device: this.o.device, ...(deleted ? { deleted: true } : {}) };
    this.pending.set(b.key, rec);
    this.o.meta[b.key] = t;
  }

  /** Call after every local state change. */
  onLocalChange(prev: AppState, next: AppState) {
    if (this.applying || !this.status.started) return;
    const d = diff(prev, next);
    if (!d.upserts.length && !d.deletes.length) return;
    for (const u of d.upserts) this.stage(u);
    for (const x of d.deletes) this.stage(x, true);
    this.o.onMeta?.(this.o.meta);
    this.emit();
  }

  private receive(recs: Rec[]) {
    const initial = this.first;
    this.first = false;
    const apply: Rec[] = [];
    for (const r of recs) {
      const known = this.o.meta[r.key] ?? 0;
      if (r.device === this.o.device && known >= r.updatedAt) continue; // our own echo
      const p = this.pending.get(r.key);
      if (isMonotone(r.key)) apply.push(r);
      else if (r.updatedAt > known && !(p && p.updatedAt >= r.updatedAt)) { apply.push(r); if (p) this.pending.delete(r.key); }
      this.o.meta[r.key] = Math.max(known, r.updatedAt);
    }
    let next = this.o.get();
    if (apply.length) {
      this.applying = true;
      next = applyRemote(next, apply);
      this.o.set(next);
      this.applying = false;
      // merged-up values (unions, max, ledger undo flags) go back so every device converges
      const now = toRecords(next);
      for (const r of apply) {
        if (!isMonotone(r.key) || r.deleted) continue;
        const cur = now.get(r.key);
        if (cur && JSON.stringify(cur.data) !== JSON.stringify(r.data)) this.stage(cur);
      }
    }
    if (initial) {
      // first sync on this device: upload anything the account doesn't have yet
      const remoteKeys = new Set(recs.map((r) => r.key));
      for (const [key, body] of toRecords(this.o.get())) if (!remoteKeys.has(key) && !this.pending.has(key)) this.stage(body);
    }
    this.o.onMeta?.(this.o.meta);
    this.emit();
    void this.flush();
  }

  /** Push everything pending. Safe to call often. */
  async flush(): Promise<void> {
    if (this.flushing) { await this.flushing; if (!this.pending.size) return; }
    if (!this.pending.size || !this.status.started) return;
    const batch = [...this.pending.values()];
    this.flushing = (async () => {
      try {
        await this.o.remote.push(batch);
        for (const r of batch) if (this.pending.get(r.key) === r) this.pending.delete(r.key); // rejected = server has newer; it arrives via subscribe
        this.status = { ...this.status, online: true, lastSync: this.now() };
      } catch {
        this.status = { ...this.status, online: false };
      }
    })();
    await this.flushing;
    this.flushing = undefined;
    this.emit();
  }
}
