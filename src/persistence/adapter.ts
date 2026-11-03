import { bridge } from '../bridge';

export interface Adapter { load(): Promise<{ data: unknown; recovered: boolean } | null>; save(json: string): Promise<boolean> }

const KEY = 'lofi-data';
export const localAdapter: Adapter = {
  async load() {
    try { const raw = localStorage.getItem(KEY); return raw ? { data: JSON.parse(raw), recovered: false } : null; } catch { return null; }
  },
  async save(json) {
    try { localStorage.setItem(KEY, json); return true; } catch { return false; }
  },
};

export const ipcAdapter: Adapter = {
  load: () => bridge()!.storage.load(),
  save: (json) => bridge()!.storage.save(json),
};

export const pickAdapter = (): Adapter => (bridge() ? ipcAdapter : localAdapter);
