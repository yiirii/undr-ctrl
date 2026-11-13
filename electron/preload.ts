import { contextBridge, ipcRenderer } from 'electron';

const on = (ch: string, cb: (...a: unknown[]) => void) => {
  const h = (_e: unknown, ...a: unknown[]) => cb(...a);
  ipcRenderer.on(ch, h);
  return () => { ipcRenderer.removeListener(ch, h); };
};

contextBridge.exposeInMainWorld('lofi', {
  storage: { load: () => ipcRenderer.invoke('storage:load'), save: (json: string) => ipcRenderer.invoke('storage:save', json), saveSync: (json: string) => ipcRenderer.sendSync('storage:saveSync', json) as boolean },
  music: {
    import: (link?: boolean) => ipcRenderer.invoke('music:import', !!link),
    importPaths: (paths: string[], link?: boolean) => ipcRenderer.invoke('music:importPaths', paths, !!link),
    remove: (id: string, file: string) => ipcRenderer.invoke('music:remove', id, file),
    exists: (file: string) => ipcRenderer.invoke('music:exists', file),
  },
  notify: (title: string, body: string, taskId?: string) => ipcRenderer.send('notify', title, body, taskId),
  setStartup: (v: boolean) => ipcRenderer.send('startup', v),
  onWindowHidden: (cb: () => void) => on('window-hidden', cb),
  onWindowShown: (cb: () => void) => on('window-shown', cb),
  onOpenQuickAdd: (cb: () => void) => on('open-quick-add', cb),
  updates: {
    state: () => ipcRenderer.invoke('update:state'),
    check: () => ipcRenderer.invoke('update:check'),
    install: () => ipcRenderer.send('update:install'),
    onState: (cb: (st: unknown) => void) => on('update-state', cb),
  },
  onFocusTask: (cb: (id: string) => void) => on('focus-task', (id) => cb(id as string)),
  exportData: (json: string) => ipcRenderer.invoke('data:export', json),
  importData: () => ipcRenderer.invoke('data:import'),
  backup: {
    chooseFolder: () => ipcRenderer.invoke('backup:chooseFolder'),
    write: (folder: string, json: string) => ipcRenderer.invoke('backup:write', folder, json),
    open: (folder: string) => ipcRenderer.invoke('backup:open', folder),
  },
  musicUrl: (file: string) => `lofi-music://t/${encodeURIComponent(file)}`,
  isWindowVisible: () => ipcRenderer.sendSync('win:visible') as boolean,
  platform: process.platform,
});
