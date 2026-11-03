// Atomic JSON storage with daily rolling backups and corrupt-file recovery. No Electron imports (unit-testable).
import fs from 'node:fs';
import path from 'node:path';

const FILE = 'data.json';
const backupsDir = (dir: string) => path.join(dir, 'backups');

export function saveAtomic(dir: string, json: string, today: string): void {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, FILE);
  // first save of the day: keep yesterday's state as a dated backup
  const bdir = backupsDir(dir);
  const bfile = path.join(bdir, `data-${today}.json`);
  if (!fs.existsSync(bfile)) {
    fs.mkdirSync(bdir, { recursive: true });
    const src = fs.existsSync(file) && isValid(fs.readFileSync(file, 'utf8')) ? fs.readFileSync(file, 'utf8') : json;
    fs.writeFileSync(bfile, src);
    pruneBackups(dir, 14);
  }
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, json);
  fs.renameSync(tmp, file);
}

function isValid(text: string): boolean {
  try { JSON.parse(text); return true; } catch { return false; }
}

export function loadWithFallback(dir: string): { data: unknown; recovered: boolean } | null {
  const file = path.join(dir, FILE);
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    try { return { data: JSON.parse(text), recovered: false }; }
    catch { fs.copyFileSync(file, path.join(dir, `data.corrupt-${Date.now()}.json`)); }
  }
  const bdir = backupsDir(dir);
  if (!fs.existsSync(bdir)) return null;
  const files = fs.readdirSync(bdir).filter((f) => /^data-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort().reverse();
  for (const f of files) {
    try { return { data: JSON.parse(fs.readFileSync(path.join(bdir, f), 'utf8')), recovered: true }; } catch { /* try older */ }
  }
  return null;
}

export function pruneBackups(dir: string, keep: number): void {
  const bdir = backupsDir(dir);
  if (!fs.existsSync(bdir)) return;
  const files = fs.readdirSync(bdir).filter((f) => f.startsWith('data-')).sort();
  for (const f of files.slice(0, Math.max(0, files.length - keep))) fs.rmSync(path.join(bdir, f));
}

export const CLOUD_FILE = 'Undr Ctrl backup.json';
/** Write the single cloud-folder backup, replacing yesterday's. Atomic: temp file then rename. */
export function writeCloudBackup(folder: string, json: string): boolean {
  try {
    if (!folder || !fs.existsSync(folder) || !fs.statSync(folder).isDirectory() || !isValid(json)) return false;
    const file = path.join(folder, CLOUD_FILE);
    const tmp = path.join(folder, `.${CLOUD_FILE}.tmp`);
    fs.writeFileSync(tmp, json);
    fs.renameSync(tmp, file);
    return true;
  } catch {
    return false;
  }
}
