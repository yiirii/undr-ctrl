// The narrow API exposed by electron/preload.ts. Absent in the browser build.
import type { Track } from './core/types';

export interface Reminder { id: string; at: number; title: string; body: string }
export interface LofiBridge {
  storage: { load(): Promise<{ data: unknown; recovered: boolean } | null>; save(json: string): Promise<boolean>; saveSync(json: string): boolean };
  music: { import(link?: boolean): Promise<Track[]>; importPaths(paths: string[], link?: boolean): Promise<Track[]>; remove(id: string, file: string): Promise<void>; exists(file: string): Promise<boolean> };
  notify(title: string, body: string, taskId?: string): void;
  setStartup(on: boolean): void;
  onWindowHidden(cb: () => void): () => void;
  onWindowShown(cb: () => void): () => void;
  onOpenQuickAdd(cb: () => void): () => void;
  onFocusTask(cb: (taskId: string) => void): () => void;
  exportData(json: string): Promise<boolean>;
  importData(): Promise<string | null>;
  musicUrl(file: string): string;
  isWindowVisible(): boolean;
  platform: string;
}
declare global { interface Window { lofi?: LofiBridge } }
export const bridge = (): LofiBridge | undefined => (typeof window !== 'undefined' ? window.lofi : undefined);
