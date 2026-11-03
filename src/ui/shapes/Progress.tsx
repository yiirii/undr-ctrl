// The shared progress family: Bar, SegBar, Ring, Liquid. Same thickness, radius and spring everywhere.
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useStore } from '../../store/store';

export const SPRING = { type: 'spring' as const, stiffness: 140, damping: 22, mass: 0.9 };
const useReduced = () => useStore((s) => s.s.settings.reducedMotion);
const tr = (reduced: boolean) => (reduced ? { duration: 0.25 } : SPRING);

export function Bar({ value, max, color = 'var(--accent-fill)', height = 8, showNumbers, format, label, className }: {
  value: number; max: number; color?: string; height?: number; showNumbers?: boolean; format?: (v: number) => string; label?: ReactNode; className?: string;
}) {
  const reduced = useReduced();
  const safeMax = max > 0 ? max : 1;
  const over = value > safeMax;
  const total = over ? value : safeMax;
  const mainPct = Math.max(0, Math.min(1, (over ? safeMax : value) / total)) * 100;
  const tailPct = over ? ((value - safeMax) / total) * 100 : 0;
  const complete = !over && value >= safeMax && max > 0;
  const f = format ?? ((v: number) => String(Math.round(v)));
  return (
    <div className={`pbar ${className ?? ''}`} title={`${f(value)} / ${f(max)}`}>
      {(label || showNumbers) && (
        <div className="pbar-head">
          {label && <span className="pbar-label">{label}</span>}
          {showNumbers && <span className="pbar-num">{f(value)} <i>/ {f(max)}</i></span>}
        </div>
      )}
      <div className={`pbar-track ${complete ? 'is-full' : ''}`} style={{ height }}>
        <motion.div className="pbar-fill" style={{ background: color }} initial={false} animate={{ width: `${mainPct}%` }} transition={tr(reduced)} />
        {over && <motion.div className="pbar-tail" initial={false} animate={{ width: `${tailPct}%` }} transition={tr(reduced)} />}
      </div>
    </div>
  );
}

export function SegBar({ done, total, color = 'var(--accent-fill)', height = 8, gap = 4 }: { done: number; total: number; color?: string; height?: number; gap?: number }) {
  const reduced = useReduced();
  if (total > 24) return <Bar value={done} max={total} color={color} height={height} />;
  const n = Math.max(1, total);
  return (
    <div className="segbar" style={{ gap, height }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className={`seg ${total === 0 ? 'seg-empty' : ''}`}>
          <motion.div className="seg-fill" style={{ background: color }} initial={false} animate={{ scaleX: i < done ? 1 : 0 }} transition={reduced ? { duration: 0.2 } : { ...SPRING, delay: i < done ? 0 : 0 }} />
        </div>
      ))}
    </div>
  );
}

export function Ring({ value, max, size = 44, stroke = 5, color = 'var(--accent)', track = 'var(--bg0)', children, marker }: {
  value: number; max: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode; marker?: number;
}) {
  const reduced = useReduced();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={false} animate={{ strokeDashoffset: c * (1 - p) }} transition={tr(reduced)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        {marker !== undefined && (
          <circle cx={size / 2 + r * Math.cos(2 * Math.PI * marker - Math.PI / 2)} cy={size / 2 + r * Math.sin(2 * Math.PI * marker - Math.PI / 2)} r={stroke * 0.55} fill="var(--t1)" stroke="var(--bg1)" strokeWidth={2} />
        )}
      </svg>
      {children && <div className="ring-in">{children}</div>}
    </div>
  );
}

/** Rounded square filled with a gently moving liquid. */
export function Liquid({ value, max, color = 'var(--wea)', size = 72, radius = 18 }: { value: number; max: number; color?: string; size?: number; radius?: number }) {
  const reduced = useReduced();
  const id = useId().replace(/:/g, '');
  const p = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const level = useSpring(p, { stiffness: 60, damping: 16 });
  useEffect(() => { level.set(p); }, [p, level]);
  const y = useTransform(level, (v) => size - v * size);
  const w = size * 2;
  const wave = (amp: number) => `M0 ${amp} Q ${w / 8} 0 ${w / 4} ${amp} T ${w / 2} ${amp} T ${(3 * w) / 4} ${amp} T ${w} ${amp} V ${size * 2} H 0 Z`;
  return (
    <svg className="liquid" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs><clipPath id={`lq${id}`}><rect width={size} height={size} rx={radius} /></clipPath></defs>
      <rect width={size} height={size} rx={radius} fill="var(--bg4)" opacity={0.5} />
      <g clipPath={`url(#lq${id})`}>
        <motion.g style={{ y }}>
          <motion.path d={wave(6)} fill={color} opacity={0.45} animate={reduced ? {} : { x: [-w / 2, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'linear' }} />
          <motion.path d={wave(5)} fill={color} animate={reduced ? {} : { x: [0, -w / 2] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'linear' }} style={{ translateY: 3 }} />
        </motion.g>
      </g>
      <rect width={size - 1} height={size - 1} x={0.5} y={0.5} rx={radius} fill="none" stroke="var(--line)" />
    </svg>
  );
}

/** Rolling number. */
export function Count({ value, format = (v: number) => Math.round(v).toLocaleString('en-US') }: { value: number; format?: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduced = useReduced();
  const [text, setText] = useState(format(value));
  useEffect(() => {
    if (reduced) { setText(format(value)); prev.current = value; return; }
    const c = animate(prev.current, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setText(format(v)) });
    prev.current = value;
    return () => c.stop();
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className="count">{text}</span>;
}
