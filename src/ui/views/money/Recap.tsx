import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore, act } from '../../../store/store';
import { finishRecap } from '../../../store/logic';
import { recap } from '../../../core/money';
import { bizMonth } from '../../../core/business';
import { addMonths, monthName, monthKey, dayKey } from '../../../core/dates';
import { Icon } from '../../shapes/icons';
import { Count, Liquid, SPRING } from '../../shapes/Progress';
import { Donut, CatIcon } from './parts';
import { useFmt } from '../../format';
import { Setup } from './Setup';

export function Recap({ month, onClose }: { month: string; onClose: () => void }) {
  const s = useStore((x) => x.s);
  const fmt = useFmt();
  const [i, setI] = useState(0);
  const [adjust, setAdjust] = useState(false);
  const r = recap(s.money, month);
  const prevName = monthName(addMonths(month, -1));
  const cat = (id: string) => s.money.categories.find((c) => c.id === id)!;
  const wealthDelta = s.ledger.filter((e) => e.stat === 'wea' && monthKey(dayKey(new Date(e.at))) === month).reduce((n, e) => n + e.amount, 0);
  const biz = bizMonth(s.business.items, s.business.expenses, month);
  const cards = 7;
  const next = () => { if (i < cards - 1) setI(i + 1); };
  const prev = () => setI(Math.max(0, i - 1));
  const finish = () => { act(finishRecap, month, new Date()); onClose(); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight' || e.key === ' ') next(); else if (e.key === 'ArrowLeft') prev(); else if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  if (adjust) return <Setup onDone={finish} />;
  const big = (sen: number, color?: string) => <div className="recap-big" style={{ color }}><Count value={sen / 100} format={(v) => fmt.rm(Math.round(v) * 100)} /></div>;
  const body = [
    <>
      <div className="recap-kicker">{monthName(month)} recap</div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING}><svg width="90" height="90" viewBox="0 0 90 90"><rect x="15" y="15" width="60" height="60" rx="18" fill="var(--in)" opacity=".85" /><circle cx="68" cy="22" r="10" fill="var(--xp)" /></svg></motion.div>
      {big(r.inSen, 'var(--in)')}
      <div className="recap-text">came in this month.</div>
    </>,
    <>
      <div className="recap-kicker">Money out</div>
      <Donut parts={r.byCategory.map((b) => ({ color: cat(b.id)?.color ?? 'var(--t3)', value: b.spentSen }))} size={200} stroke={24}>
        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{r.byCategory.length} categories</div>
      </Donut>
      {big(r.outSen)}
      <div className="recap-text">went out. {r.byCategory[0] ? <>Most of it on <b style={{ color: cat(r.byCategory[0].id)?.color }}>{cat(r.byCategory[0].id)?.name}</b>.</> : 'A very quiet month.'}</div>
    </>,
    <>
      <div className="recap-kicker">You kept</div>
      {big(r.keptSen, r.keptSen >= 0 ? 'var(--in)' : 'var(--bad)')}
      {(biz.salesSen > 0 || biz.expensesSen > 0) && <div className="chip" style={{ fontSize: '.9rem', padding: '6px 12px' }}>Business: {biz.soldCount} sold · {biz.profitSen >= 0 ? '+' : ''}{fmt.rm(biz.profitSen)} profit</div>}
      <div className="recap-text">{r.deltaKeptSen === 0 ? `Same as ${prevName}.` : r.deltaKeptSen > 0 ? <>That's <b style={{ color: 'var(--in)' }}>{fmt.rm(r.deltaKeptSen)} more</b> than {prevName}.</> : <>That's {fmt.rm(-r.deltaKeptSen)} less than {prevName}. Next month is a fresh start.</>}</div>
    </>,
    <>
      <div className="recap-kicker">Your top three changes</div>
      <div className="stack" style={{ width: 440 }}>
        {r.movers.length === 0 && <div className="recap-text">Nothing changed much from {prevName}.</div>}
        {r.movers.map((m, k) => (
          <motion.div key={m.id} className="tl-item" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 * k }} style={{ cursor: 'default' }}>
            <CatIcon c={cat(m.id)} size={38} /><div className="tl-note">{cat(m.id)?.name}</div>
            <div className="tl-amt" style={{ color: m.deltaSen > 0 ? 'var(--warn)' : 'var(--in)' }}><Icon name={m.deltaSen > 0 ? 'arrowUp' : 'arrowDown'} size={14} stroke={2.6} /> {fmt.rm(Math.abs(m.deltaSen))}</div>
          </motion.div>
        ))}
      </div>
      <div className="recap-text">compared with {prevName}.</div>
    </>,
    <>
      <div className="recap-kicker">Budgets</div>
      <div className="cat-cloud" style={{ justifyContent: 'center', maxWidth: 560 }}>
        {r.categories.filter((c) => c.limitSen > 0).map((c, k) => (
          <motion.div key={c.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.06 * k }}
            style={{ width: 64, height: 64, borderRadius: 22, display: 'grid', placeItems: 'center', background: c.spentSen <= c.limitSen ? 'color-mix(in srgb, var(--ok) 24%, transparent)' : 'color-mix(in srgb, var(--warn) 24%, transparent)', color: c.spentSen <= c.limitSen ? 'var(--ok)' : 'var(--warn)' }} title={cat(c.id)?.name}>
            <Icon name={cat(c.id)?.icon ?? 'dot'} size={26} />
          </motion.div>
        ))}
      </div>
      <div className="recap-big">{r.withinBudget}<span style={{ fontSize: '2rem', color: 'var(--t3)' }}> / {r.budgeted}</span></div>
      <div className="recap-text">categories stayed within budget.</div>
    </>,
    <>
      <div className="recap-kicker">Goals</div>
      {r.goals.length === 0 ? <div className="recap-text">No savings goals yet. Add one on the Money page.</div> : (
        <div className="row" style={{ gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {r.goals.map((g) => (
            <div key={g.id} className="col" style={{ alignItems: 'center' }}>
              <Liquid value={g.savedSen} max={g.targetSen} size={110} radius={28} />
              <b>{g.name}</b><span className="muted">{fmt.rm(g.savedSen)} of {fmt.rm(g.targetSen)}</span>
            </div>
          ))}
        </div>
      )}
    </>,
    <>
      <div className="recap-kicker">Next month</div>
      <div className="recap-big" style={{ color: wealthDelta >= 0 ? 'var(--wea)' : 'var(--bad)' }}>{wealthDelta >= 0 ? '+' : ''}{wealthDelta}</div>
      <div className="recap-text">Wealth XP this month. Keep the same budget, or adjust it?</div>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn primary lg" onClick={finish}><Icon name="check" size={16} stroke={2.4} />Keep the same budget</button>
        <button className="btn lg" onClick={() => setAdjust(true)}><Icon name="sliders" size={16} />Adjust</button>
      </div>
      <div className="muted" style={{ fontSize: '.8rem' }}>+25 XP for finishing your recap</div>
    </>,
  ];
  return (
    <motion.div className="recap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="recap-bars">{Array.from({ length: cards }, (_, k) => <div key={k}><motion.i initial={false} animate={{ width: k <= i ? '100%' : '0%' }} transition={{ duration: 0.4 }} /></div>)}</div>
      <div className="row" style={{ padding: '10px 20px 0' }}><div className="grow" /><button className="icon-btn" onClick={onClose} title="Close"><Icon name="x" /></button></div>
      <AnimatePresence mode="wait">
        <motion.div key={i} className="recap-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} onClick={(e) => { if ((e.target as HTMLElement).closest('button')) return; next(); }}>
          {body[i]}
        </motion.div>
      </AnimatePresence>
      <div className="recap-nav">
        <button className="btn ghost" onClick={prev} disabled={i === 0}><Icon name="left" size={16} />Back</button>
        {i < cards - 1 && <button className="btn" onClick={next}>Next<Icon name="right" size={16} /></button>}
      </div>
    </motion.div>
  );
}
