import { app, BrowserWindow } from 'electron';
import path from 'node:path';
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1280, height: 820, webPreferences: { preload: path.join(__dirname, 'preload.js') } });
  win.loadFile(path.join(__dirname, '../dist/index.html'));
});
