import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { remaining } from '../../core/focus';
import { Ring } from '../shapes/Progress';
import { fmtSec } from '../music/service';

export function useNow(ms = 500) {
  const [n, setN] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setN(Date.now()), ms); return () => clearInterval(i); }, [ms]);
  return n;
}

export function MiniTimer() {
  const f = useStore((x) => x.s.focus);
  const task = useStore((x) => x.s.tasks.find((t) => t.id === x.s.focus?.taskId));
  const view = useStore((x) => x.ui.view);
  const go = useStore((x) => x.go);
  const collapsed = useStore((x) => x.s.appearance.sidebarCollapsed);
  const now = useNow(1000);
  if (!f || view === 'focus') return null;
  const left = remaining(f, now);
  return (
    <div className="mini-timer" onClick={() => go('focus')} title="Back to focus">
      <Ring value={left} max={f.durationMs} size={30} stroke={4} color={f.phase === 'break' ? 'var(--ok)' : 'var(--accent)'} />
      {!collapsed && <div className="grow" style={{ minWidth: 0 }}><b>{fmtSec(left / 1000)}</b><span>{f.phase === 'break' ? 'Break' : task?.title ?? 'Focus'}{f.pausedAt ? ' · paused' : ''}</span></div>}
    </div>
  );
}
