import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { getPlayer, useMusic, fmtSec } from './service';
import { Icon } from '../shapes/icons';
import { Cover } from './Cover';
import { SPRING } from '../shapes/Progress';

export function MiniPlayer() {
  const m = useStore((x) => x.s.music);
  const go = useStore((x) => x.go);
  const st = useMusic();
  const [open, setOpen] = useState(false);
  useEffect(() => { getPlayer(); }, []);
  if (!m.tracks.length) {
    return (
      <button className="nav-item mini-player" onClick={() => go('settings')} title="Add your own music in Settings → Music">
        <Icon name="music" /><span className="mp-text muted">Add your music</span>
      </button>
    );
  }
  const t = m.tracks.find((x) => x.id === st.trackId) ?? m.tracks.find((x) => !x.missing);
  if (!t) return null;
  const p = getPlayer();
  const frac = st.duration ? st.time / st.duration : 0;
  const queue = m.tracks.filter((x) => !x.missing);
  return (
    <div className="mini-player" style={{ position: 'relative' }}>
      <AnimatePresence>
        {open && (
          <motion.div className="mp-queue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={SPRING}>
            <div className="nav-sec" style={{ paddingTop: 4 }}>Queue<button onClick={() => useStore.getState().setUI({ view: 'settings' })} title="Manage music"><Icon name="sliders" size={14} /></button></div>
            {queue.slice(0, 9).map((q) => (
              <button key={q.id} className={`mp-q ${q.id === t.id ? 'on' : ''}`} onClick={() => p.play(q.id)}>
                <Cover id={q.id} size={26} /><span className="grow" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{q.title}</span>
                {q.id === t.id && st.playing && <span className="eq"><i /><i /><i /></span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mp">
        <button onClick={() => setOpen(!open)} title="Queue" style={{ display: 'grid' }}><Cover id={t.id} size={36} /></button>
        <div className="mp-text grow" style={{ minWidth: 0 }} onClick={() => setOpen(!open)}>
          <div className="mp-title">{t.title}</div>
          <div className="mp-sub">{st.playing ? `${fmtSec(st.time)} / ${fmtSec(st.duration)}` : t.artist || 'Paused'}</div>
        </div>
        <button className="icon-btn" onClick={() => p.toggle()} title={st.playing ? 'Pause' : 'Play'}><Icon name={st.playing ? 'pause' : 'play'} size={16} stroke={2.2} /></button>
        <button className="icon-btn mp-text" onClick={() => p.next()} title="Next"><Icon name="next" size={16} stroke={2.2} /></button>
      </div>
      <div className="mp-scrub" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); p.seek((e.clientX - r.left) / r.width); }}>
        <div style={{ width: `${frac * 100}%` }} />
      </div>
    </div>
  );
}
