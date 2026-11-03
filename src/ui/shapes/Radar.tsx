import { motion } from 'framer-motion';
import { STATS, STAT_META, type Stat } from '../../core/types';
import { SPRING } from './Progress';

/** Hexagon stat radar. `levels` drives the filled shape; it morphs with a spring. */
export function Radar({ levels, size = 220, labels = false, pulse, progress }: { levels: Record<Stat, number>; size?: number; labels?: boolean; pulse?: Stat | null; progress?: Record<Stat, number> }) {
  const pad = labels ? 46 : 6;
  const R = size / 2 - pad;
  const cx = size / 2, cy = size / 2;
  const maxL = Math.max(5, ...STATS.map((s) => levels[s] + (progress?.[s] ?? 0)));
  const scale = Math.ceil((maxL + 1) / 5) * 5;
  const ang = (i: number) => -Math.PI / 2 + (i * Math.PI) / 3;
  const pt = (i: number, r: number) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))] as const;
  const ring = (f: number) => STATS.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const shape = STATS.map((s, i) => {
    const v = levels[s] + (progress?.[s] ?? 0);
    const r = R * Math.max(0.08, v / scale);
    return pt(i, r);
  });
  const d = `M${shape.map((p) => p.map((n) => n.toFixed(2)).join(' ')).join(' L')} Z`;
  return (
    <svg className="radar" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[1, 0.75, 0.5, 0.25].map((f) => (
        <polygon key={f} points={ring(f)} fill={f === 1 ? 'var(--bg0)' : 'none'} stroke="var(--line)" strokeWidth={1} opacity={f === 1 ? 1 : 0.8} />
      ))}
      {STATS.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth={1} />; })}
      <motion.path d={d} initial={false} animate={{ d }} transition={SPRING} fill="var(--accent)" fillOpacity={0.16} stroke="var(--accent)" strokeWidth={size > 120 ? 2 : 1.5} strokeLinejoin="round" />
      {STATS.map((s, i) => (
        <motion.circle key={s} initial={false} animate={{ cx: shape[i][0], cy: shape[i][1], r: pulse === s ? (size > 120 ? 9 : 5) : size > 120 ? 4.5 : 2.6 }} transition={SPRING}
          fill={STAT_META[s].hue} stroke="var(--bg1)" strokeWidth={size > 120 ? 2 : 1} />
      ))}
      {labels && STATS.map((s, i) => {
        const [x, y] = pt(i, R + 26);
        return (
          <g key={s}>
            <text x={x} y={y - 3} textAnchor="middle" className="radar-lbl">{STAT_META[s].name}</text>
            <text x={x} y={y + 13} textAnchor="middle" className="radar-lv" fill={STAT_META[s].hue}>Lv {levels[s]}</text>
          </g>
        );
      })}
    </svg>
  );
}
