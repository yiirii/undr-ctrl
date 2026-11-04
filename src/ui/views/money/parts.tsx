// Money visual building blocks: InOut bars, category bubble, flow picture, donut, six-month bars, pace line.
import { motion } from 'framer-motion';
import type { Category } from '../../../core/types';
import { SPRING } from '../../shapes/Progress';
import { Icon } from '../../shapes/icons';
import { useFmt } from '../../format';
import type { CategorySummary } from '../../../core/money';

export function CatIcon({ c, size = 36 }: { c: Pick<Category, 'icon' | 'color' | 'emoji'>; size?: number }) {
  return (
    <div className="cat-ic" style={{ width: size, height: size, background: `color-mix(in srgb, ${c.color} 20%, transparent)`, color: c.color }}>
      {c.emoji ? <span style={{ fontSize: size * 0.48 }}>{c.emoji}</span> : <Icon name={c.icon} size={size * 0.52} stroke={2} />}
    </div>
  );
}

export function InOut({ inSen, expectedSen, outSen, bizSen }: { inSen: number; expectedSen: number; outSen: number; bizSen?: number }) {
  const fmt = useFmt();
  const scale = Math.max(inSen, expectedSen, outSen, Math.abs(bizSen ?? 0), 1);
  const row = (label: string, color: string, v: number, ghost?: number) => (
    <div className="io-row">
      <div className="io-lbl">{label}</div>
      <div className="io-track">
        {ghost !== undefined && ghost > v && <div className="io-ghost" style={{ width: `${(ghost / scale) * 100}%`, borderColor: color }} />}
        <motion.div className="io-fill" style={{ background: color }} initial={false} animate={{ width: `${(v / scale) * 100}%` }} transition={SPRING} />
      </div>
      <div className="io-val">{fmt.rm(v)}{ghost !== undefined && ghost > 0 && <i> of ~{fmt.rm(ghost)}</i>}</div>
    </div>
  );
  return (
    <div className="io">
      {row('Money in', 'var(--in)', inSen, expectedSen)}
      {row('Money out', 'var(--warn)', outSen)}
      {bizSen !== undefined && row(bizSen >= 0 ? 'Business profit' : 'Business loss', bizSen >= 0 ? 'var(--wea)' : 'var(--bad)', Math.abs(bizSen))}
    </div>
  );
}

export function CategoryBubble({ c, sum, onClick }: { c: Category; sum: CategorySummary; onClick: () => void }) {
  const fmt = useFmt();
  const ratio = sum.limitSen > 0 ? Math.min(1, sum.spentSen / sum.limitSen) : sum.spentSen > 0 ? 1 : 0;
  const tone = sum.status === 'over' ? 'var(--bad)' : sum.status === 'warn' ? 'var(--warn)' : c.color;
  return (
    <motion.button className={`bubble ${sum.status}`} onClick={onClick} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <motion.div className="bubble-fill" style={{ background: `color-mix(in srgb, ${tone} 22%, transparent)` }} initial={false} animate={{ height: `${ratio * 100}%` }} transition={SPRING} />
      <div className="bubble-in">
        <CatIcon c={c} size={34} />
        <div className="bubble-name">{c.name}</div>
        <div className="bubble-amt"><b>{fmt.rm(sum.spentSen)}</b>{sum.limitSen > 0 && <span> of {fmt.rm(sum.limitSen)}</span>}</div>
        {sum.status === 'over' && <div className="chip bad" style={{ marginTop: 6 }}>{fmt.rm(sum.spentSen - sum.limitSen)} over</div>}
        {sum.status === 'warn' && <div className="chip warn" style={{ marginTop: 6 }}>{Math.round(sum.ratio * 100)}%</div>}
      </div>
    </motion.button>
  );
}

/** Simplified Sankey: money in on the left, flowing into categories and "Kept" on the right. */
export function Flow({ inSen, cats, keptSen, width = 760 }: { inSen: number; cats: { name: string; color: string; sen: number }[]; keptSen: number; width?: number }) {
  const fmt = useFmt();
  const rights = [...cats.filter((c) => c.sen > 0).sort((a, b) => b.sen - a.sen), ...(keptSen > 0 ? [{ name: 'Kept', color: 'var(--in)', sen: keptSen }] : [])];
  const total = Math.max(inSen, rights.reduce((n, r) => n + r.sen, 0), 1);
  const H = Math.max(220, rights.length * 34);
  const gap = 6;
  const usable = H - gap * Math.max(0, rights.length - 1);
  const leftH = Math.max(8, (Math.max(inSen, rights.reduce((n, r) => n + r.sen, 0)) / total) * usable);
  const lx = 120, rx = width - 190, nodeW = 12;
  let ly = (H - leftH) / 2, ry = 0;
  const bands = rights.map((r) => {
    const h = Math.max(3, (r.sen / total) * usable);
    const b = { ...r, h, ly, ry, label: 0 };
    ly += (r.sen / total) * usable;
    ry += h + gap;
    return b;
  });
  // keep labels at least 18px apart
  let lastLabel = -Infinity;
  for (const b of bands) { b.label = Math.max(b.ry + b.h / 2 + 4, lastLabel + 18); lastLabel = b.label; }
  const Hfinal = Math.max(H, lastLabel + 8);
  return (
    <svg className="flow" viewBox={`0 0 ${width} ${Hfinal}`} width="100%" preserveAspectRatio="xMidYMid meet">
      <rect x={lx - nodeW} y={(H - leftH) / 2} width={nodeW} height={leftH} rx={4} fill="var(--in)" />
      <text x={lx - nodeW - 10} y={H / 2 - 6} textAnchor="end" className="flow-l">Money in</text>
      <text x={lx - nodeW - 10} y={H / 2 + 12} textAnchor="end" className="flow-v">{fmt.rm(inSen)}</text>
      {bands.map((b, i) => {
        const x1 = lx, x2 = rx, cx1 = lx + (rx - lx) * 0.5, cx2 = lx + (rx - lx) * 0.5;
        const d = `M${x1} ${b.ly} C${cx1} ${b.ly} ${cx2} ${b.ry} ${x2} ${b.ry} L${x2} ${b.ry + b.h} C${cx2} ${b.ry + b.h} ${cx1} ${b.ly + b.h} ${x1} ${b.ly + b.h} Z`;
        return (
          <g key={b.name} className="flow-band">
            <motion.path d={d} fill={b.color} initial={{ opacity: 0 }} animate={{ opacity: 0.28 }} transition={{ delay: 0.05 * i, duration: 0.5 }}><title>{`${b.name}: ${fmt.rm(b.sen)}`}</title></motion.path>
            <rect x={rx} y={b.ry} width={nodeW} height={b.h} rx={3} fill={b.color} />
            <text x={rx + nodeW + 10} y={b.label} className="flow-l">{b.name} <tspan className="flow-v">{fmt.rm(b.sen)}</tspan></text>
          </g>
        );
      })}
    </svg>
  );
}

export function Donut({ parts, size = 220, stroke = 26, children }: { parts: { color: string; value: number }[]; size?: number; stroke?: number; children?: React.ReactNode }) {
  const total = parts.reduce((n, p) => n + p.value, 0) || 1;
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={stroke} />
        {parts.map((p, i) => {
          const len = (p.value / total) * c;
          const off = acc;
          acc += len;
          return (
            <motion.circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.color} strokeWidth={stroke} strokeDasharray={`${Math.max(0, len - 3)} ${c}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`} initial={{ strokeDashoffset: -off + 40, opacity: 0, scale: 0.9 }} animate={{ strokeDashoffset: -off, opacity: 1, scale: 1 }}
              transition={{ ...SPRING, delay: 0.12 * i }} style={{ originX: '50%', originY: '50%' }} />
          );
        })}
      </svg>
      {children && <div className="ring-in">{children}</div>}
    </div>
  );
}

export function SixMonths({ data }: { data: { label: string; inSen: number; outSen: number }[] }) {
  const fmt = useFmt();
  const max = Math.max(1, ...data.flatMap((d) => [d.inSen, d.outSen]));
  return (
    <div className="six">
      {data.map((d) => (
        <div key={d.label} className="six-col" title={`${d.label}: in ${fmt.rm(d.inSen)}, out ${fmt.rm(d.outSen)}`}>
          <div className="six-bars">
            <motion.div className="six-bar" style={{ background: 'var(--in)' }} initial={{ height: 0 }} animate={{ height: `${(d.inSen / max) * 100}%` }} transition={SPRING} />
            <motion.div className="six-bar" style={{ background: 'var(--warn)' }} initial={{ height: 0 }} animate={{ height: `${(d.outSen / max) * 100}%` }} transition={{ ...SPRING, delay: 0.05 }} />
          </div>
          <div className="six-lbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Cumulative spending line against the even-pace budget line. */
export function PaceLine({ daily, limitSen, days, color }: { daily: number[]; limitSen: number; days: number; color: string }) {
  const W = 520, H = 160, pad = 8;
  let acc = 0;
  const cum = daily.map((v) => (acc += v));
  const max = Math.max(limitSen, acc, 1) * 1.08;
  const x = (i: number) => pad + (i / Math.max(1, days - 1)) * (W - pad * 2);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const path = cum.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="pace">
      {limitSen > 0 && <line x1={x(0)} y1={y(limitSen / days)} x2={x(days - 1)} y2={y(limitSen)} stroke="var(--t3)" strokeDasharray="4 5" strokeWidth={1.5} />}
      {limitSen > 0 && <line x1={x(0)} y1={y(limitSen)} x2={x(days - 1)} y2={y(limitSen)} stroke="var(--line)" strokeWidth={1} />}
      {cum.length > 0 && <path d={`${path} L${x(cum.length - 1)} ${H - pad} L${x(0)} ${H - pad} Z`} fill={color} opacity={0.12} />}
      {cum.length > 0 && <motion.path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />}
    </svg>
  );
}
