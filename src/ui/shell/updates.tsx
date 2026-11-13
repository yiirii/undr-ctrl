// The laptop's update status, mirrored from the main process. The web/iPhone app updates by itself, so
// nothing here shows there.
import { useEffect, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { bridge, type UpdateState } from '../../bridge';
import { Icon } from '../shapes/icons';
import { haptic } from '../motion/juice';

let current: UpdateState | null = null;
const subs = new Set<() => void>();
export function setUpdateState(st: UpdateState | null) { current = st; subs.forEach((f) => f()); }
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const useUpdateState = () => useSyncExternalStore(subscribe, () => current);

let wired = false;
function wire() {
  if (wired) return;
  wired = true;
  const u = bridge()?.updates;
  if (u) { void u.state().then(setUpdateState); u.onState(setUpdateState); }
  if (import.meta.env.DEV) (window as unknown as { __lofiUpdate: typeof setUpdateState }).__lofiUpdate = setUpdateState;
}

export function installUpdate() { haptic('success'); bridge()?.updates?.install(); }

/** "Update ready · Restart" in the sidebar, only once the new version has finished downloading. */
export function UpdateChip({ collapsed }: { collapsed?: boolean }) {
  useEffect(wire, []);
  const st = useUpdateState();
  const ready = st?.phase === 'ready';
  return (
    <AnimatePresence>
      {ready && (
        <motion.button key="upd" className={`update-chip ${collapsed ? 'mini' : ''}`} onClick={installUpdate} title={`Version ${st!.version} is ready. Restart to update.`}
          initial={{ opacity: 0, y: 10, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}>
          <span className="update-dot"><Icon name="download" size={15} stroke={2.2} /></span>
          {!collapsed && <span className="update-txt"><b>Update ready</b><span>v{st!.version}</span></span>}
          {!collapsed && <span className="update-go">Restart</span>}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const LABEL: Record<UpdateState['phase'], string> = { idle: 'Checks for updates on its own.', checking: 'Checking…', downloading: 'Downloading', ready: 'ready to install.', latest: "You're on the newest version.", error: "Couldn't check just now. It'll try again later." };

/** Settings row text + button. */
export function UpdateStatus() {
  useEffect(wire, []);
  const st = useUpdateState();
  if (!st) return null;
  const text = st.phase === 'downloading' ? `Downloading v${st.version}… ${st.percent ?? 0}%` : st.phase === 'ready' ? `v${st.version} ${LABEL.ready}` : LABEL[st.phase];
  return (
    <div className="set-row">
      <div className="grow"><div className="set-l">Updates <span className="muted" style={{ fontWeight: 500 }}>· v{st.current}</span></div><div className="set-h">{text}</div></div>
      {st.phase === 'ready'
        ? <button className="btn primary" onClick={installUpdate}><Icon name="download" size={16} />Restart to update</button>
        : <button className="btn" disabled={st.phase === 'checking' || st.phase === 'downloading'} onClick={() => void bridge()?.updates?.check().then(setUpdateState)}>{st.phase === 'checking' ? 'Checking…' : 'Check now'}</button>}
    </div>
  );
}
