import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, dialog, Notification, protocol, net, shell } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { loadWithFallback, saveAtomic } from './storage';

app.setName('Undr Ctrl');
app.setAppUserModelId('app.undrctrl.desktop');
const dataDir = path.join(app.getPath('appData'), 'Undr Ctrl');
app.setPath('userData', dataDir);
const musicDir = path.join(dataDir, 'music');
const prefsFile = path.join(dataDir, 'prefs.json');
const AUDIO = ['mp3', 'm4a', 'aac', 'ogg', 'opus', 'wav', 'flac'];

protocol.registerSchemesAsPrivileged([{ scheme: 'lofi-music', privileges: { secure: true, standard: true, stream: true, supportFetchAPI: true, bypassCSP: true } }]);

let win: BrowserWindow | null = null;
let tray: Tray | null = null;
let quitting = false;
const startHidden = process.argv.includes('--hidden');

if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => showWindow());

const readPrefs = (): Record<string, unknown> => { try { return JSON.parse(fs.readFileSync(prefsFile, 'utf8')); } catch { return {}; } };
const writePrefs = (p: Record<string, unknown>) => { fs.mkdirSync(dataDir, { recursive: true }); fs.writeFileSync(prefsFile, JSON.stringify({ ...readPrefs(), ...p })); };
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const asset = (f: string) => path.join(__dirname, f);

function send(ch: string, ...args: unknown[]) { if (win && !win.isDestroyed()) win.webContents.send(ch, ...args); }

function showWindow() {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1360, height: 880, minWidth: 980, minHeight: 640, show: false, backgroundColor: '#1e1f22', autoHideMenuBar: true, title: 'Undr Ctrl',
    icon: asset('icon.png'),
    webPreferences: { preload: asset('preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: false, backgroundThrottling: false },
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, '../dist/index.html'));
  win.once('ready-to-show', () => { if (!startHidden) win!.show(); else send('window-hidden'); });
  win.on('close', (e) => {
    if (quitting) return;
    e.preventDefault();
    win!.hide();
    if (!readPrefs().trayHintShown && tray) {
      tray.displayBalloon?.({ title: 'Undr Ctrl is still here', content: 'Undr Ctrl keeps running in the tray so reminders work. Quit from the tray menu.', iconType: 'info' });
      writePrefs({ trayHintShown: true });
    }
  });
  for (const ev of ['hide', 'minimize'] as const) win.on(ev as 'hide', () => send('window-hidden'));
  for (const ev of ['show', 'restore'] as const) win.on(ev as 'show', () => send('window-shown'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

function createTray() {
  const img = nativeImage.createFromPath(asset('tray.png'));
  tray = new Tray(img.isEmpty() ? nativeImage.createEmpty() : img);
  tray.setToolTip('Undr Ctrl');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open Undr Ctrl', click: showWindow },
    { label: 'Quick add…', click: () => { showWindow(); send('open-quick-add'); } },
    { type: 'separator' },
    { label: 'Quit', click: () => { quitting = true; app.quit(); } },
  ]));
  tray.on('click', () => (win?.isVisible() && !win.isMinimized() ? win.hide() : showWindow()));
}

function applyStartup(on: boolean) {
  if (!app.isPackaged) return;
  app.setLoginItemSettings({ openAtLogin: on, args: ['--hidden'] });
}

async function readTrack(file: string, stored: string) {
  let title = path.basename(file).replace(/\.[^.]+$/, ''), artist = '', durationSec = 0;
  try {
    const mm = await import('music-metadata');
    const meta = await mm.parseFile(file, { duration: true, skipCovers: true });
    title = meta.common.title || title;
    artist = meta.common.artist || '';
    durationSec = Math.round(meta.format.duration ?? 0);
  } catch { /* tags unreadable: keep file name */ }
  return { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, title, artist, file: stored, durationSec };
}

async function importFiles(paths: string[], link: boolean) {
  fs.mkdirSync(musicDir, { recursive: true });
  const out = [];
  for (const p of paths) {
    if (!AUDIO.includes(path.extname(p).slice(1).toLowerCase()) || !fs.existsSync(p)) continue;
    let stored = p;
    if (!link) {
      let name = path.basename(p);
      while (fs.existsSync(path.join(musicDir, name))) name = `${path.parse(name).name}-1${path.extname(name)}`;
      fs.copyFileSync(p, path.join(musicDir, name));
      stored = name;
    }
    out.push(await readTrack(link ? p : path.join(musicDir, stored), stored));
  }
  return out;
}

const resolveMusic = (stored: string) => (path.isAbsolute(stored) ? stored : path.join(musicDir, path.basename(stored)));

app.whenReady().then(() => {
  protocol.handle('lofi-music', (req) => {
    const u = new URL(req.url);
    const stored = decodeURIComponent(u.pathname.replace(/^\//, ''));
    const file = resolveMusic(stored);
    if (!fs.existsSync(file)) return new Response('missing', { status: 404 });
    return net.fetch(pathToFileURL(file).toString(), { headers: req.headers });
  });

  ipcMain.handle('storage:load', () => loadWithFallback(dataDir));
  ipcMain.handle('storage:save', (_e, json: string) => { try { saveAtomic(dataDir, json, today()); return true; } catch { return false; } });
  ipcMain.on('storage:saveSync', (e, json: string) => { try { saveAtomic(dataDir, json, today()); e.returnValue = true; } catch { e.returnValue = false; } });
  ipcMain.handle('music:import', async (_e, link: boolean) => {
    const r = await dialog.showOpenDialog(win!, { title: 'Add music', properties: ['openFile', 'multiSelections'], filters: [{ name: 'Audio', extensions: AUDIO }] });
    return r.canceled ? [] : importFiles(r.filePaths, !!link);
  });
  ipcMain.handle('music:importPaths', (_e, paths: string[], link: boolean) => importFiles(paths, !!link));
  ipcMain.handle('music:remove', (_e, _id: string, stored: string) => {
    if (!path.isAbsolute(stored)) { const f = path.join(musicDir, path.basename(stored)); if (fs.existsSync(f)) fs.rmSync(f); }
  });
  ipcMain.handle('music:exists', (_e, stored: string) => fs.existsSync(resolveMusic(stored)));
  ipcMain.handle('data:export', async (_e, json: string) => {
    const r = await dialog.showSaveDialog(win!, { title: 'Export Undr Ctrl backup', defaultPath: `undr-ctrl-backup-${today()}.undrctrl.json`, filters: [{ name: 'Undr Ctrl backup', extensions: ['json'] }] });
    if (r.canceled || !r.filePath) return false;
    fs.writeFileSync(r.filePath, json);
    return true;
  });
  ipcMain.handle('data:import', async () => {
    const r = await dialog.showOpenDialog(win!, { title: 'Import Undr Ctrl backup', properties: ['openFile'], filters: [{ name: 'Undr Ctrl backup', extensions: ['json'] }] });
    return r.canceled ? null : fs.readFileSync(r.filePaths[0], 'utf8');
  });
  ipcMain.on('notify', (_e, title: string, body: string, taskId?: string) => {
    if (!Notification.isSupported()) return;
    const n = new Notification({ title, body, icon: asset('icon.png'), silent: false });
    n.on('click', () => { showWindow(); if (taskId) send('focus-task', taskId); });
    n.show();
  });
  ipcMain.on('startup', (_e, on: boolean) => applyStartup(on));
  ipcMain.on('win:visible', (e) => { e.returnValue = !!win && win.isVisible() && !win.isMinimized(); });

  createWindow();
  createTray();
  // apply the saved "start with Windows" choice (default on)
  const saved = loadWithFallback(dataDir)?.data as { settings?: { startWithWindows?: boolean } } | undefined;
  applyStartup(saved?.settings?.startWithWindows ?? true);
});

app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => { /* stay in tray */ });
