// Laptop auto-update: checks GitHub Releases (yiirii/undr-ctrl) on start and every 4 hours,
// downloads quietly in the background, then tells the window "update ready".
// Restarting installs it; if Chloe never presses Restart it installs on the next quit.
import { app, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

export type UpdatePhase = 'idle' | 'checking' | 'downloading' | 'ready' | 'latest' | 'error';
export interface UpdateState { phase: UpdatePhase; version?: string; percent?: number; current: string }

const EVERY = 4 * 60 * 60 * 1000;

export function setupUpdates(send: (state: UpdateState) => void, beforeInstall: () => void) {
  let state: UpdateState = { phase: 'idle', current: app.getVersion() };
  const set = (p: Partial<UpdateState>) => { state = { ...state, ...p }; send(state); };

  ipcMain.handle('update:state', () => state);
  ipcMain.handle('update:check', () => check());
  ipcMain.on('update:install', () => { if (state.phase !== 'ready') return; beforeInstall(); setImmediate(() => autoUpdater.quitAndInstall(true, true)); });

  if (!app.isPackaged) return; // dev runs never update themselves
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => { if (state.phase !== 'ready') set({ phase: 'checking' }); });
  autoUpdater.on('update-available', (i) => set({ phase: 'downloading', version: i.version, percent: 0 }));
  autoUpdater.on('download-progress', (p) => set({ phase: 'downloading', percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', (i) => set({ phase: 'ready', version: i.version }));
  autoUpdater.on('update-not-available', () => set({ phase: 'latest' }));
  autoUpdater.on('error', () => { if (state.phase !== 'ready') set({ phase: 'error' }); });

  async function check() {
    if (!app.isPackaged || state.phase === 'ready' || state.phase === 'downloading') return state;
    try { await autoUpdater.checkForUpdates(); } catch { set({ phase: 'error' }); }
    return state;
  }
  setTimeout(() => void check(), 15_000);
  setInterval(() => void check(), EVERY);
}
