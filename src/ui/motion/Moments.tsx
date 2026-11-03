import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { moments } from '../../store/moments';
import type { Moment } from '../../store/logic';
import { useStore, useProgress } from '../../store/store';
import { STAT_META } from '../../core/types';
import { title as makeTitle } from '../../core/rules';
import type { Unlock } from '../../core/unlocks';
import { attachCanvas, burst, cssVar } from './particles';
import { sfx } from '../sound/synth';
import { Count, SPRING } from '../shapes/Progress';
import { Icon } from '../shapes/icons';
import { HexBadge } from '../views/Badges';

type Toast = { id: number; m: Moment };
let tid = 0;

export function applyUnlock(u: Unlock) {
  const st = useStore.getState();
  if (u.kind === 'theme') st.setAppearance({ theme: u.value as never });
  if (u.kind === 'accent') st.setAppearance({ accent: u.value });
  if (u.kind === 'sound') st.setSettings({ sound: u.value as never });
  if (u.kind === 'title') st.setSettings({ title: u.value });
}

function Shards({ size = 180 }: { size?: number }) {
  const c = size / 2, R = size / 2 - 6;
  const pts = Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3; return [c + R * Math.cos(a), c + R * Math.sin(a)]; });
  const hues = ['int', 'str', 'wea', 'dis', 'cre', 'cha'].map((k) => STAT_META[k as keyof typeof STAT_META].hue);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {pts.map((p, i) => {
        const q = pts[(i + 1) % 6];
        const mx = (p[0] + q[0]) / 2 - c, my = (p[1] + q[1]) / 2 - c;
        return (
          <motion.path key={i} d={`M${c} ${c} L${p[0]} ${p[1]} L${q[0]} ${q[1]} Z`} fill={hues[i]} stroke="var(--bg0)" strokeWidth={2}
            initial={{ x: mx * 5, y: my * 5, rotate: (i % 2 ? 1 : -1) * 70, opacity: 0, scale: 0.6 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }} transition={{ ...SPRING, stiffness: 110, delay: 0.08 * i }} style={{ originX: `${c}px`, originY: `${c}px` }} />
        );
      })}
    </svg>
  );
}

function LevelUp({ level, unlocks, onDone }: { level: number; unlocks: Unlock[]; onDone: () => void }) {
  const p = useProgress();
  useEffect(() => {
    sfx.arpeggio();
    const t = setTimeout(() => burst(window.innerWidth / 2, window.innerHeight / 2 - 60, [cssVar('--xp'), cssVar('--int'), cssVar('--cre'), cssVar('--wea'), cssVar('--t1')], 64, 11, true), 650);
    const key = (e: KeyboardEvent) => { e.preventDefault(); onDone(); };
    const k = setTimeout(() => window.addEventListener('keydown', key), 400);
    return () => { clearTimeout(t); clearTimeout(k); window.removeEventListener('keydown', key); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div className="levelup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onDone} style={{ pointerEvents: 'auto' }}>
      <div className="levelup-inner">
        <Shards />
        <div className="lv-kicker">Level up</div>
        <motion.div className="lv-num" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...SPRING, delay: 0.55 }}><Count value={level} /></motion.div>
        <div className="lv-title">{makeTitle(level, p.topStat)}</div>
        {unlocks.length > 0 && (
          <div className="unlocks">
            {unlocks.map((u, i) => (
              <motion.div key={u.id} className="unlock" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.9 + i * 0.12 }}>
                <Icon name={u.kind === 'theme' ? 'palette' : u.kind === 'sound' ? 'volume' : 'sparkle'} size={16} /> {u.label} unlocked
                <button className="btn primary sm" onClick={(e) => { e.stopPropagation(); applyUnlock(u); }}>Apply now</button>
              </motion.div>
            ))}
          </div>
        )}
        <div className="skip">Press any key to continue</div>
      </div>
    </motion.div>
  );
}

function ToastView({ m }: { m: Moment }) {
  if (m.type === 'statLevelUp') {
    const meta = STAT_META[m.stat];
    return <><div className="glow" style={{ background: meta.hue }} /><HexBadge color={meta.hue} label={String(m.level)} size={38} /><div><b>{meta.name} {m.level}</b><p>Your {meta.name.toLowerCase()} grew.</p></div></>;
  }
  if (m.type === 'questCompleted') return <><div className="glow" style={{ background: 'var(--xp)' }} /><HexBadge color="var(--xp)" icon="flag" size={38} /><div><b>Quest complete</b><p>{m.label} · +{m.xp} XP</p></div></>;
  if (m.type === 'achievementUnlocked') {
    const c = m.tier === 'gold' ? 'var(--xp)' : m.tier === 'silver' ? '#c9d1dc' : '#d79a6b';
    return <><div className="glow" style={{ background: c }} /><motion.div initial={{ scale: 1.8, rotate: -20, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }}><HexBadge color={c} icon="star" size={38} shimmer /></motion.div><div><b>{m.name}</b><p>Achievement · +{m.xp} XP{m.unlocks.length ? ` · ${m.unlocks.map((u) => u.label).join(', ')}` : ''}</p></div>{m.unlocks.map((u) => <button key={u.id} className="btn sm" onClick={() => applyUnlock(u)}>Apply</button>)}</>;
  }
  if (m.type === 'streakMilestone') return <><div className="glow" style={{ background: 'var(--accent)' }} /><div className="diamonds" style={{ gap: 4 }}>{Array.from({ length: 5 }, (_, i) => <motion.span key={i} className="d on" initial={{ scale: 0 }} animate={{ scale: 1.2 }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 400, damping: 12 }} />)}</div><div><b>{m.streak}-day streak</b><p>Consistency is a superpower.</p></div></>;
  if (m.type === 'focusDone') return <><div className="glow" style={{ background: 'var(--ok)' }} /><HexBadge color="var(--ok)" icon="target" size={38} /><div><b>{m.completed ? 'Focus session done' : 'Session stopped'}</b><p>{m.completed ? (m.xp ? `+${m.xp} XP` : 'Daily focus XP maxed for this task') : 'No worries. Try again when ready.'}</p></div></>;
  if (m.type === 'xp') return <><div className="glow" style={{ background: 'var(--xp)' }} /><HexBadge color="var(--xp)" label={`+${m.amount}`} size={38} /><div><b>{m.label}</b><p>+{m.amount} XP{m.stat ? ` · ${STAT_META[m.stat].name}` : ''}</p></div></>;
  return null;
}

export function Moments() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [levels, setLevels] = useState<{ level: number; unlocks: Unlock[] }[]>([]);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => { attachCanvas(canvas.current); }, []);
  useEffect(() => moments.on((m) => {
    if (m.type === 'taskCompleted') return;
    if (m.type === 'levelUp') { setLevels((l) => [...l, { level: m.level, unlocks: m.unlocks }]); return; }
    const id = ++tid;
    setToasts((t) => [...t.slice(-3), { id, m }]);
    if (m.type === 'questCompleted' || m.type === 'achievementUnlocked') { sfx.chime2(); burst(window.innerWidth - 200, window.innerHeight - 70, [cssVar('--xp'), cssVar('--t1'), cssVar('--accent')], 26, 6); }
    else if (m.type === 'statLevelUp') sfx.chime2();
    else if (m.type === 'streakMilestone') sfx.streak(m.streak);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), m.type === 'achievementUnlocked' && m.unlocks.length ? 9000 : 4800);
  }), []);
  return (
    <>
      <div className="moment-layer"><canvas ref={canvas} /></div>
      <div className="toasts">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} className="toast" layout initial={{ x: 60, opacity: 0, scale: 0.95 }} animate={{ x: 0, opacity: 1, scale: 1 }} exit={{ x: 40, opacity: 0 }} transition={SPRING}>
              <ToastView m={t.m} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>{levels[0] && <LevelUp key={levels[0].level} {...levels[0]} onDone={() => setLevels((l) => l.slice(1))} />}</AnimatePresence>
    </>
  );
}
