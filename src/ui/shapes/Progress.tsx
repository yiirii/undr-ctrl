// The shared progress family: Bar, SegBar, Ring, Liquid. Same thickness, radius and spring everywhere.
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useStore } from '../../store/store';
import { glow as gain } from '../motion/juice';

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
  const track = useRef<HTMLDivElement>(null);
  const prev = useRef(value);
  useEffect(() => { const was = prev.current; prev.current = value; if (value > was && track.current?.offsetParent) gain(track.current); }, [value]);
  return (
    <div className={`pbar ${className ?? ''}`} title={`${f(value)} / ${f(max)}`}>
      {(label || showNumbers) && (
        <div className="pbar-head">
          {label && <span className="pbar-label">{label}</span>}
          {showNumbers && <span className="pbar-num">{f(value)} <i>/ {f(max)}</i></span>}
        </div>
      )}
      <div ref={track} className={`pbar-track ${complete ? 'is-full' : ''}`} style={{ height }}>
        <motion.div className="pbar-fill" style={{ background: color }} initial={false} animate={{ width: `${mainPct}%` }} transition={tr(reduced)} />
        {over && <motion.div className="pbar-tail" initial={false} animate={{ width: `${tailPct}%` }} transition={tr(reduced)} />}
      </div>
    </div>
  );
}

export function SegBar({ done, total, color = 'var(--accent-fill)', height = 8, gap = 4 }: { done: number; total: number; color?: string; height?: number; gap?: number }) {
  const reduced = useReduced();
  const box = useRef<HTMLDivElement>(null);
  const prev = useRef(done);
  useEffect(() => {
    const was = prev.current; prev.current = done;
    if (done <= was || reduced || !box.current?.offsetParent) return;
    const segs = box.current.children;
    for (let i = was; i < done && i < segs.length; i++) (segs[i] as HTMLElement).animate?.([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.9)', offset: 0.3 }, { transform: 'scaleY(1)' }], { duration: 480, delay: (i - was) * 60 + 120, easing: 'ease-out' });
  }, [done, reduced]);
  if (total > 24) return <Bar value={done} max={total} color={color} height={height} />;
  const n = Math.max(1, total);
  return (
    <div className="segbar" ref={box} style={{ gap, height }}>
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
          {/* waves move with CSS: smooth, off the main thread, and paused while hidden */}
          <g transform="translate(0 0)"><path className={reduced ? undefined : 'lq-wave lq-a'} d={wave(6)} fill={color} opacity={0.45} style={{ ['--w' as string]: `${w / 2}px` }} /></g>
          <g transform="translate(0 3)"><path className={reduced ? undefined : 'lq-wave lq-b'} d={wave(5)} fill={color} style={{ ['--w' as string]: `${w / 2}px` }} /></g>
        </motion.g>
      </g>
      <rect width={size - 1} height={size - 1} x={0.5} y={0.5} rx={radius} fill="none" stroke="var(--line)" />
    </svg>
  );
}

/** Rolling number: counts to its new value (written straight to the screen, no React work per frame) and pops when it goes up. */
export function Count({ value, format = (v: number) => Math.round(v).toLocaleString('en-US'), pop = true }: { value: number; format?: (v: number) => string; pop?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduced = useReduced();
  const fmt = useRef(format); fmt.current = format;
  const busy = useRef(false);
  const [first] = useState(() => format(value)); // React only sets the text once; the effect owns it after that
  // keep the text right when only the formatting changes (e.g. the RM style setting)
  useEffect(() => { const el = ref.current; if (el && !busy.current) { const t = fmt.current(value); if (el.textContent !== t) el.textContent = t; } });
  useEffect(() => {
    const el = ref.current;
    const from = prev.current; prev.current = value;
    if (!el) return;
    if (reduced || from === value) { el.textContent = fmt.current(value); return; }
    busy.current = true;
    const c = animate(from, value, { duration: Math.min(1.1, 0.55 + Math.log10(1 + Math.abs(value - from)) * 0.12), ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { el.textContent = fmt.current(v); }, onComplete: () => { busy.current = false; el.textContent = fmt.current(value); } });
    if (pop && value > from && el.animate && el.offsetParent !== null) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)', offset: 0.3 }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' });
    return () => { c.stop(); busy.current = false; };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className="count">{first}</span>;
}
