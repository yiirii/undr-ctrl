// In-memory stand-in for Firestore with the same rule the real one enforces:
// a write is accepted only if it is newer (updatedAt) than what the server has.
import type { Rec } from './model';
import type { Remote, PushResult } from './engine';

export class FakeServer {
  docs = new Map<string, Rec>();
  private clients = new Set<FakeClient>();
  client(name: string): FakeClient { const c = new FakeClient(this, name); this.clients.add(c); return c; }
  /** @internal */ write(from: FakeClient, recs: Rec[]): PushResult {
    const accepted: Rec[] = [], rejected: string[] = [];
    for (const r of recs) {
      const cur = this.docs.get(r.key);
      if (cur && cur.updatedAt >= r.updatedAt) { rejected.push(r.key); continue; }
      this.docs.set(r.key, r); accepted.push(r);
    }
    if (accepted.length) for (const c of this.clients) c.deliver(accepted);
    void from;
    return { rejected };
  }
}

export class FakeClient implements Remote {
  private cbs = new Set<(recs: Rec[]) => void>();
  private _online = true;
  constructor(private server: FakeServer, public name: string) {}
  get online() { return this._online; }
  set online(v: boolean) {
    const was = this._online; this._online = v;
    if (v && !was) this.deliver([...this.server.docs.values()]); // reconnect: catch up
  }
  async push(recs: Rec[]): Promise<PushResult> {
    if (!this._online) throw new Error('offline');
    return this.server.write(this, recs.map((r) => JSON.parse(JSON.stringify(r))));
  }
  subscribe(cb: (recs: Rec[]) => void) {
    this.cbs.add(cb);
    if (this._online) cb([...this.server.docs.values()].map((r) => JSON.parse(JSON.stringify(r)))); // initial snapshot (may be empty)
    return () => { this.cbs.delete(cb); };
  }
  /** @internal */ deliver(recs: Rec[]) { if (!this._online) return; for (const cb of this.cbs) cb(recs.map((r) => JSON.parse(JSON.stringify(r)))); }
}
