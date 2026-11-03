// Daily single-file backup into a cloud-synced folder (Google Drive for desktop).
import { bridge } from '../bridge';
import { useStore } from '../store/store';
import { dayKey } from '../core/dates';

let running = false;
/** Write today's backup if a folder is chosen and today's isn't written yet (or force). */
export async function cloudBackup(force = false): Promise<boolean | null> {
  const b = bridge();
  const st = useStore.getState();
  const folder = st.s.settings.backupFolder;
  if (!b || !folder || running) return null;
  const last = st.s.settings.lastCloudBackup;
  if (!force && last && dayKey(new Date(last)) === dayKey(new Date()) && !st.s.settings.cloudBackupFailed) return null;
  running = true;
  try {
    const ok = await b.backup.write(folder, JSON.stringify(st.s));
    useStore.getState().patch((s) => ({ ...s, settings: { ...s.settings, ...(ok ? { lastCloudBackup: new Date().toISOString(), cloudBackupFailed: false } : { cloudBackupFailed: true }) } }));
    return ok;
  } finally { running = false; }
}
