import { useEffect, useRef } from 'react';
import { useStore, act } from '../../store/store';
import { focusPause, focusResume, focusStop, focusAddFive, focusStart } from '../../store/logic';
import { remaining } from '../../core/focus';
import { dayKey } from '../../core/dates';
import { STAT_META } from '../../core/types';
import { taskStat } from '../../store/facts';
import { Ring, SegBar } from '../shapes/Progress';
import { Icon } from '../shapes/icons';
import { useNow } from '../shell/MiniTimer';
import { fmtSec, getPlayer } from '../music/service';
import { sfx } from '../sound/synth';
import { bridge } from '../../bridge';
import { Ambient } from '../shapes/Ambient';

const LENGTHS = [15, 25, 45, 50];

/** Runs app-wide: finishes sessions when time runs out and links music if enabled. */
export function FocusTicker() {
  const f = useStore((x) => x.s.focus);
  const link = useStore((x) => x.s.focusSettings.musicLink);
  // only tick while a session is actually running
  const now = useNow(500, !!f && f.pausedAt === undefined);
  const phase = useRef<string | null>(null);
  useEffect(() => {
    if (!f || f.pausedAt !== undefined) return;
    if (remaining(f, now) <= 0) {
      const task = useStore.getState().s.tasks.find((t) => t.id === f.taskId);
      act(focusStop, Date.now(), new Date());
      sfx.focusEnd();
      if (document.hidden || !(bridge()?.isWindowVisible() ?? true)) bridge()?.notify(f.phase === 'break' ? 'Break over' : 'Focus session done', f.phase === 'break' ? 'Ready for another round?' : `Nice work on “${task?.title ?? 'your task'}”.`);
    }
  }, [now, f]);
  useEffect(() => {
    const p = f ? `${f.phase}:${f.pausedAt !== undefined}` : null;
    if (p === phase.current) return;
    phase.current = p;
    if (!link || !useStore.getState().s.music.tracks.length) return;
    if (f && f.phase === 'focus' && f.pausedAt === undefined) getPlayer().play();
    else getPlayer().pause();
  }, [f, link]);
  return null;
}

export function Focus() {
  const s = useStore((x) => x.s);
  const go = useStore((x) => x.go);
  const setSettings = useStore((x) => x.patch);
  const f = s.focus;
  const now = useNow(250, !!f && f.pausedAt === undefined);
  const today = dayKey(new Date());
  if (!f) {
    const recent = s.tasks.filter((t) => !t.doneAt && !t.habit).slice(-6).reverse();
    return (
      <div className="focus-page">
        <Ambient size={200} />
        <h2 style={{ fontSize: '1.6rem' }}>Pick something to focus on</h2>
        <div className="seg-ctl">{LENGTHS.map((m) => <button key={m} className={s.focusSettings.focusMin === m ? 'on' : ''} onClick={() => setSettings((st) => ({ ...st, focusSettings: { ...st.focusSettings, focusMin: m } }))}>{m} min</button>)}</div>
        <div className="stack" style={{ width: 420 }}>
          {recent.map((t) => <button key={t.id} className="btn" style={{ justifyContent: 'flex-start', height: 44 }} onClick={() => act(focusStart, t.id, s.focusSettings.focusMin, Date.now())}><Icon name="target" size={16} />{t.title}</button>)}
          {!recent.length && <p className="muted">Add a task first, then press its target button.</p>}
        </div>
      </div>
    );
  }
  const task = s.tasks.find((t) => t.id === f.taskId);
  const stat = task ? taskStat(s, task) : null;
  const color = f.phase === 'break' ? 'var(--ok)' : stat ? STAT_META[stat].hue : 'var(--accent)';
  const left = remaining(f, now);
  const sessions = s.focusLog.filter((x) => x.taskId === f.taskId && x.day === today && x.completed).length;
  const paused = f.pausedAt !== undefined;
  return (
    <div className="focus-page">
      <Ring value={left} max={f.durationMs} size={300} stroke={14} color={color} track="var(--bg3)" marker={1 - left / f.durationMs}>
        <div>
          <div className="focus-time">{fmtSec(left / 1000)}</div>
          <div className="focus-phase">{f.phase === 'break' ? 'Break' : paused ? 'Paused' : 'Focus'}</div>
        </div>
      </Ring>
      <div className="focus-task">{f.phase === 'break' ? 'Stretch, breathe, drink water.' : task?.title}</div>
      {stat && f.phase === 'focus' && <span className="chip"><span className="sdot" style={{ background: color }} />+{sessions === 0 ? 10 : sessions < 4 ? 5 : 0} {STAT_META[stat].name} when done</span>}
      <div className="row" style={{ gap: 10 }}>
        {paused ? <button className="btn primary lg" onClick={() => act(focusResume, Date.now())}><Icon name="play" size={16} />Resume</button>
          : <button className="btn lg" onClick={() => act(focusPause, Date.now())}><Icon name="pause" size={16} />Pause</button>}
        <button className="btn lg" onClick={() => act(focusAddFive)}>+5 min</button>
        <button className="btn ghost lg" onClick={() => { act(focusStop, Date.now(), new Date()); if (f.phase === 'break') go('myday'); }}><Icon name="x" size={16} />{f.phase === 'break' ? 'Skip break' : 'Stop'}</button>
      </div>
      <div style={{ width: 280 }}>
        <div className="day-progress" style={{ margin: 0 }}>
          <div className="meta"><span>Sessions today on this task</span><span>{sessions} / 4</span></div>
          <SegBar done={sessions} total={4} height={8} color={color} />
        </div>
      </div>
    </div>
  );
}
