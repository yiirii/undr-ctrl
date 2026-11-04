import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useStore } from '../../store/store';
import { spendingInsights, productivityInsights } from '../../core/insights';
import { dayKey, WEEKDAYS, monthName, MONTHS } from '../../core/dates';
import { STAT_META } from '../../core/types';
import { statLevel } from '../../core/rules';
import { CatIcon } from './money/parts';
import { SPRING, Count } from '../shapes/Progress';
import { Icon } from '../shapes/icons';
import { useFmt } from '../format';

type Tab = 'money' | 'productivity';

export function Insights() {
  const [tab, setTab] = useState<Tab>('money');
  return (
    <div className="page page-wide">
      <div className="ph">
        <div><h1>Insights</h1><div className="sub">Patterns from what you've logged</div></div>
        <div className="ph-actions"><div className="seg-ctl"><button className={tab === 'money' ? 'on' : ''} onClick={() => setTab('money')}>Where money goes</button><button className={tab === 'productivity' ? 'on' : ''} onClick={() => setTab('productivity')}>Productivity</button></div></div>
      </div>
      {tab === 'money' ? <MoneyInsights /> : <ProductivityInsights />}
    </div>
  );
}

/** Small vertical bars; `hi` marks the highlighted (latest) bar. */
function MiniBars({ values, color, labels, height = 120, hi, fmtVal }: { values: number[]; color: string; labels: string[]; height?: number; hi?: number; fmtVal?: (n: number) => string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="six" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="six-col" title={fmtVal ? `${labels[i]}: ${fmtVal(v)}` : undefined}>
          <div className="six-bars"><motion.div className="six-bar" style={{ width: '62%', maxWidth: 26, background: color, opacity: hi === undefined || hi === i ? 1 : 0.38 }} initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ ...SPRING, delay: i * 0.03 }} /></div>
          <div className="six-lbl">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="mcard insight-empty"><Icon name="chart" size={22} /><div>{text}</div></div>;
}

function MoneyInsights() {
  const money = useStore((x) => x.s.money);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const r = useMemo(() => spendingInsights(money, today), [money, today]);
  if (!money.entries.some((e) => e.kind === 'out')) return <Empty text="Log a few expenses and this page starts showing where your money goes and how each month compares." />;
  const diff = r.totalThisSen - r.totalUsualByNowSen;
  const nth = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;
  const byWhen = r.paceFrac >= 1 ? 'in a month' : `by the ${nth(Number(today.slice(8)))}`;
  const barMax = Math.max(r.totalUsualByNowSen, r.totalThisSen, 1);
  const mk = today.slice(0, 7);
  const ratio = r.week.weekdaySen > 0 ? r.week.weekendSen / r.week.weekdaySen : 0;
  const weekSentence = r.week.weekendSen === 0 && r.week.weekdaySen === 0 ? 'Not enough days yet.'
    : ratio >= 1.3 ? `You spend about ${ratio >= 2 ? `${ratio.toFixed(1)}×` : `${Math.round((ratio - 1) * 100)}% more`} per day on weekends.`
      : ratio > 0 && ratio <= 0.77 ? 'Weekdays cost you more than weekends. Uni days add up.'
        : 'Your spending is about even across the week.';
  const scale = Math.max(r.week.weekdaySen, r.week.weekendSen, 1);
  const cats = useStore.getState().s.money.categories;
  return (
    <div className="money-grid">
      <div className="money-hero">
        <div style={{ minWidth: 240 }}>
          <div className="hero-label">Spent in {monthName(mk)} so far</div>
          <div className="hero-num" style={{ fontSize: '2.4rem' }}><Count value={(r.totalThisSen) / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></div>
          <div className="hero-of">{r.totalAvgSen ? <>Your usual month: {fmt.rm(r.totalAvgSen)}</> : 'Your usual month shows after one full month.'}</div>
        </div>
        <div className="hero-side">
          {r.totalAvgSen > 0 && (
            <div className="io">
              <div className="io-row"><div className="io-lbl">Usually</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--t3)' }} initial={false} animate={{ width: `${(r.totalUsualByNowSen / barMax) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(r.totalUsualByNowSen)}</div></div>
              <div className="io-row"><div className="io-lbl">This month</div><div className="io-track"><motion.div className="io-fill" style={{ background: diff > 0 ? 'var(--warn)' : 'var(--in)' }} initial={false} animate={{ width: `${(r.totalThisSen / barMax) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(r.totalThisSen)}</div></div>
            </div>
          )}
          <div className="insight-line">{r.totalAvgSen === 0 ? 'Keep logging. Comparisons appear once there is a month to compare with.' : diff > 0 ? <>That's <b style={{ color: 'var(--warn)' }}>{fmt.rm(diff)} more</b> than you usually spend {byWhen}.</> : <>You're <b style={{ color: 'var(--in)' }}>{fmt.rm(-diff)} under</b> what you usually spend {byWhen}.</>}</div>
        </div>
      </div>

      <div className="two">
        <div className="mcard">
          <div className="mcard-h"><h3>Biggest changes</h3><span className="muted">vs usual {byWhen}</span></div>
          {r.changes.length === 0 && <div className="muted" style={{ fontSize: '.86rem' }}>Nothing stands out yet.</div>}
          <div className="stack" style={{ gap: 14 }}>
            {r.changes.map((c) => {
              const cat = cats.find((x) => x.id === c.id)!;
              const up = c.diffSen > 0;
              return (
                <div key={c.id} className="row" style={{ gap: 12 }}>
                  <CatIcon c={cat} size={34} />
                  <div className="grow"><div style={{ fontWeight: 700 }}>{c.name}</div><div className="muted" style={{ fontSize: '.8rem' }}>{fmt.rm(c.thisSen)} so far · usually {fmt.rm(c.usualByNowSen)} {byWhen}</div></div>
                  <span className={`chip ${up ? 'warn' : 'ok'}`}>{up ? '+' : '−'}{fmt.rm(Math.abs(c.diffSen))}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mcard">
          <div className="mcard-h"><h3>Weekdays vs weekends</h3><span className="muted">per day, last 90 days</span></div>
          <div className="io" style={{ marginBottom: 14 }}>
            <div className="io-row"><div className="io-lbl">Weekday</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--int)' }} initial={{ width: 0 }} animate={{ width: `${(r.week.weekdaySen / scale) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(r.week.weekdaySen)}</div></div>
            <div className="io-row"><div className="io-lbl">Weekend</div><div className="io-track"><motion.div className="io-fill" style={{ background: 'var(--cha)' }} initial={{ width: 0 }} animate={{ width: `${(r.week.weekendSen / scale) * 100}%` }} transition={SPRING} /></div><div className="io-val">{fmt.rm(r.week.weekendSen)}</div></div>
          </div>
          <div className="insight-line">{weekSentence}</div>
        </div>
      </div>

      <div className="mcard">
        <div className="mcard-h"><h3>Six months by category</h3></div>
        <div className="cat-trends">
          {r.categories.map((c) => {
            const cat = cats.find((x) => x.id === c.id)!;
            return (
              <div key={c.id} className="cat-trend">
                <div className="row" style={{ gap: 10, marginBottom: 10 }}><CatIcon c={cat} size={28} /><b className="grow">{c.name}</b><span className="muted" style={{ fontSize: '.82rem' }}>{fmt.rm(c.thisSen)}</span></div>
                <MiniBars values={c.months.map((m) => m.sen)} labels={c.months.map((m) => MONTHS[Number(m.mk.slice(5)) - 1].slice(0, 1))} color={c.color} height={70} hi={5} fmtVal={fmt.rm} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProductivityInsights() {
  const s = useStore((x) => x.s);
  const today = dayKey(new Date());
  const p = useMemo(() => productivityInsights(s.tasks, s.focusLog, s.ledger, today, s.settings.weekStartsMonday), [s.tasks, s.focusLog, s.ledger, today, s.settings.weekStartsMonday]);
  const anything = p.days.some((d) => d.finished > 0) || p.focusWeeks.some((w) => w.minutes > 0);
  if (!anything) return <Empty text="Finish a few tasks and this page shows your best days and times, how much of your plan you get through, and how your stats are growing." />;
  const planned = p.days.reduce((n, d) => n + d.planned, 0);
  const plannedDone = p.days.reduce((n, d) => n + d.plannedDone, 0);
  const rate = planned ? Math.round((plannedDone / planned) * 100) : null;
  const max = Math.max(1, ...p.days.map((d) => Math.max(d.planned, d.finished)));
  const focusTotal = p.focusWeeks.reduce((n, w) => n + w.minutes, 0);
  const growth = p.statGrowth.map((g) => ({ ...g, gained: g.now - g.before })).sort((a, b) => b.gained - a.gained);
  const gMax = Math.max(1, ...growth.map((g) => g.gained));
  return (
    <div className="money-grid">
      <div className="mcard">
        <div className="mcard-h"><h3>Planned vs done</h3><span className="muted">My Day, last 14 days</span><div className="grow" />{rate !== null && <span className={`chip ${rate >= 70 ? 'ok' : rate >= 40 ? '' : 'warn'}`}>{rate}% of your plan done</span>}</div>
        <div className="pvd">
          {p.days.map((d, i) => (
            <div key={d.day} className="pvd-col" title={`${d.day}: planned ${d.planned}, finished ${d.finished}`}>
              <div className="pvd-bars">
                <motion.div className="pvd-plan" initial={{ height: 0 }} animate={{ height: `${(d.planned / max) * 100}%` }} transition={{ ...SPRING, delay: i * 0.02 }} />
                <motion.div className="pvd-done" initial={{ height: 0 }} animate={{ height: `${(d.finished / max) * 100}%` }} transition={{ ...SPRING, delay: i * 0.02 + 0.05 }} />
              </div>
              <div className="six-lbl" style={{ color: d.day === today ? 'var(--t1)' : undefined }}>{WEEKDAYS[new Date(`${d.day}T12:00:00`).getDay()].slice(0, 1)}</div>
            </div>
          ))}
        </div>
        <div className="row legend" style={{ gap: 16, marginTop: 10 }}><span><i style={{ background: 'var(--bg4)' }} />Planned</span><span><i style={{ background: 'var(--accent)' }} />Finished (all tasks & habits)</span></div>
      </div>

      <div className="two">
        <div className="mcard">
          <div className="mcard-h"><h3>Your best day</h3><span className="muted">last 60 days</span></div>
          <div className="insight-big">{p.bestWeekday ?? '—'}</div>
          <MiniBars values={[1, 2, 3, 4, 5, 6, 0].map((k) => p.byWeekday[k])} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} color="var(--accent)" height={90} hi={p.bestWeekday ? [1, 2, 3, 4, 5, 6, 0].indexOf(p.byWeekday.indexOf(Math.max(...p.byWeekday))) : undefined} />
        </div>
        <div className="mcard">
          <div className="mcard-h"><h3>Your best time</h3><span className="muted">when tasks get ticked</span></div>
          <div className="insight-big">{p.bestTime ?? '—'}</div>
          <MiniBars values={p.bySlot.map((x) => x.count)} labels={p.bySlot.map((x) => x.name)} color="var(--int)" height={90} hi={p.bestTime ? p.bySlot.findIndex((x) => x.name === p.bestTime) : undefined} />
        </div>
      </div>

      <div className="two">
        <div className="mcard">
          <div className="mcard-h"><h3>Focus</h3><span className="muted">minutes per week</span><div className="grow" /><span className="muted">{Math.round(focusTotal / 60 * 10) / 10}h in 8 weeks</span></div>
          <MiniBars values={p.focusWeeks.map((w) => w.minutes)} labels={p.focusWeeks.map((w, i) => (i === 7 ? 'Now' : `${new Date(`${w.start}T12:00:00`).getDate()}/${new Date(`${w.start}T12:00:00`).getMonth() + 1}`))} color="var(--ok)" height={110} hi={7} fmtVal={(n) => `${n} min`} />
        </div>
        <div className="mcard">
          <div className="mcard-h"><h3>Stat growth</h3><span className="muted">last 90 days</span></div>
          <div className="stack" style={{ gap: 11 }}>
            {growth.map((g) => {
              const meta = STAT_META[g.stat];
              const lv = statLevel(g.now).level, lv0 = statLevel(g.before).level;
              return (
                <div key={g.stat} className="row" style={{ gap: 10, fontSize: '.86rem' }}>
                  <span style={{ width: 84, fontWeight: 600 }}>{meta.name}</span>
                  <div className="io-track grow"><motion.div className="io-fill" style={{ background: meta.hue }} initial={{ width: 0 }} animate={{ width: `${(Math.max(0, g.gained) / gMax) * 100}%` }} transition={SPRING} /></div>
                  <span className="muted" style={{ width: 92, textAlign: 'right' }}>{g.gained > 0 ? `+${g.gained} XP` : g.gained < 0 ? `${g.gained} XP` : '—'}</span>
                  <span className="chip" style={{ minWidth: 58, justifyContent: 'center' }}>{lv0 === lv ? `Lv ${lv}` : `${lv0} → ${lv}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
