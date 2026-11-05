import { personalSplit } from '../../core/wallet';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Keep } from '../shapes/Keep';
import { useStore, act } from '../../store/store';
import { deposit, dismissNudge, addGoal, deleteGoal, upsertCategory } from '../../store/logic';
import { monthSummary, nudge as getNudge, goalPlan, parseAmount, inMonth, suggestFromHistory } from '../../core/money';
import { bizMonth } from '../../core/business';
import { setBudget } from '../../store/logic';
import { Business } from './money/Business';
import { addMonths, dayKey, daysInMonth, monthKey, monthName, dayOfMonth, monthStart, addDays, MONTHS } from '../../core/dates';
import { Icon } from '../shapes/icons';
import { Bar, Liquid, Ring, Count, SPRING } from '../shapes/Progress';
import { useFmt } from '../format';
import { CatIcon, CategoryBubble, Flow, InOut, PaceLine, SixMonths, Donut } from './money/parts';
import { LogSheet } from './money/LogSheet';
import { Setup } from './money/Setup';
import { Recap } from './money/Recap';
import { Ambient } from '../shapes/Ambient';
import type { MoneyEntry } from '../../core/types';

export function Money() {
  const s = useStore((x) => x.s);
  const ui = { recapMonth: useStore.getState().ui.recapMonth }; // read once, for the auto-open below
  const setUI = useStore((x) => x.setUI);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const [mk, setMk] = useState(monthKey(today));
  const [setup, setSetup] = useState<false | number>(false);
  const tab = useStore((x) => x.ui.moneyTab ?? 'personal');
  const setTab = (moneyTab: 'personal' | 'business') => useStore.getState().setUI({ moneyTab });
  const [catId, setCatId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState(false);
  const [addingCat, setAddingCat] = useState(false);
  const [catName, setCatName] = useState('');
  const isCurrent = mk === monthKey(today);
  const m = monthSummary(s.money, mk, today);
  const prevMk = addMonths(monthKey(today), -1);
  const prevHas = s.money.entries.some((e) => inMonth(e, prevMk));
  const nd = isCurrent ? getNudge(s.money, today) : null;
  const showNudge = nd && !s.money.dismissedNudges.includes(nd.id);
  const entries = s.money.entries.filter((e) => inMonth(e, mk)).sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  const byDay: [string, MoneyEntry[]][] = [];
  for (const e of entries) { const last = byDay[byDay.length - 1]; if (last && last[0] === e.date) last[1].push(e); else byDay.push([e.date, [e]]); }
  const six = Array.from({ length: 6 }, (_, i) => { const k = addMonths(monthKey(today), i - 5); const x = monthSummary(s.money, k, today); return { label: MONTHS[Number(k.slice(5)) - 1].slice(0, 3), inSen: x.inSen, outSen: x.outSen }; });
  const earliest = s.money.entries.reduce((a, e) => (e.date < a ? e.date : a), today);

  // auto-open the recap on the 1st for last month
  useEffect(() => {
    if (dayOfMonth(today) <= 3 && prevHas && !s.money.recapsSeen.includes(prevMk) && !ui.recapMonth) setUI({ recapMonth: prevMk });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const used = m.budgetSen > 0 ? m.outSen / m.budgetSen : 0;
  const split = personalSplit(s.money.entries, mk);
  const biz = bizMonth(s.business.items, s.business.expenses, mk);
  const kept = m.keptSen + biz.profitSen;
  // Each tab's content is only rebuilt when its data changes, so flipping Personal / Business is instant.
  const bizPane = useMemo(() => <Business mk={mk} />, [mk]);
  const personalPane = useMemo(() => (<>
      <div className="money-grid">
        {!m.hasBudget && !s.money.setupDone ? (
          <div className="money-hero" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: 12, padding: 36 }}>
            <Ambient size={160} />
            <h2>Set up your money</h2>
            <p className="dim" style={{ maxWidth: 440, lineHeight: 1.5 }}>One minute. No regular income? That's fine: you can just track for a while and Undr Ctrl will suggest a budget from your real spending.</p>
            <button className="btn primary lg" onClick={() => setSetup(0)}>Start money setup</button>
          </div>
        ) : !m.hasBudget ? (
          <TrackingHero mk={mk} isCurrent={isCurrent} onAdjust={() => setSetup(2)} />
        ) : (
          <div className="money-hero">
            <Ring value={m.outSen} max={m.budgetSen} size={210} stroke={16} color={used > 1 ? 'var(--bad)' : used > m.monthElapsed + 0.1 ? 'var(--warn)' : 'var(--in)'} track="var(--bg0)" marker={isCurrent ? m.monthElapsed : undefined}>
              <div>
                <div className="hero-label">Left to spend</div>
                <div className={`hero-num ${m.leftSen < 0 ? 'neg' : ''}`}><Count value={m.leftSen / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></div>
                <div className="hero-of">of {fmt.rm(m.budgetSen)}</div>
              </div>
            </Ring>
            <div className="hero-side">
              {isCurrent ? (
                <div className="hero-safe"><b><Count value={(m.safePerDaySen) / 100} format={(v) => fmt.rm(Math.round(v * 100))} /> a day</b><br />is safe to spend for the rest of {monthName(mk)}.</div>
              ) : (
                <div className="hero-safe"><b>{m.leftSen >= 0 ? `${fmt.rm(m.leftSen)} under` : `${fmt.rm(-m.leftSen)} over`}</b><br />budget in {monthName(mk)}.</div>
              )}
              <Bar value={Math.round(m.monthElapsed * daysInMonth(`${mk}-01`))} max={daysInMonth(`${mk}-01`)} label="Month so far" showNumbers format={(v) => `Day ${Math.round(v)}`} color="var(--t2)" height={6} />
              <Bar value={m.outSen} max={m.budgetSen} label="Budget used" showNumbers format={(v) => fmt.rm(v)} color={used > 1 ? 'var(--bad)' : 'var(--accent-fill)'} height={6} />
              <div className="row" style={{ gap: 8 }}>
                <button className="btn sm ghost" onClick={() => setSetup(0)}><Icon name="sliders" size={14} />Adjust budget</button>
                {s.money.savingsTargetSen > 0 && <span className="chip ok">Savings target {fmt.rm(s.money.savingsTargetSen)}/mo</span>}
              </div>
            </div>
          </div>
        )}

        <div className="mcard">
          <div className="mcard-h"><h3>In & out</h3><span className="muted">{monthName(mk)}</span></div>
          <InOut inSen={m.inSen} expectedSen={isCurrent ? m.expectedInSen : 0} outSen={m.outSen} bizSen={biz.salesSen || biz.expensesSen || biz.cogsSen ? biz.profitSen : undefined} />
          <div className="kept-line">{kept >= 0 ? <>You've kept <b><Count value={(kept) / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></b> so far{biz.profitSen ? <> (including <b style={{ color: biz.profitSen >= 0 ? 'var(--in)' : 'var(--bad)' }}>{fmt.rm(biz.profitSen)}</b> business profit)</> : ''}.</> : m.hasBudget ? <>You've spent <b style={{ color: 'var(--bad)' }}>{fmt.rm(-kept)}</b> more than came in.</> : <>That's <b style={{ color: 'var(--t1)' }}>{fmt.rm(-kept)}</b> more out than in. Fine while you're tracking; it shows where money goes.</>}</div>
          {split.tngSen > 0 && (
            <div className="wallet-split">
              <div className="ws-bar"><span className="ws-cash" style={{ flexGrow: split.cashSen }} /><span className="ws-tng" style={{ flexGrow: split.tngSen }} /></div>
              <div className="ws-legend">
                <span><i className="ws-cash" />Allowance (cash) <b><Count value={split.cashSen / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></b></span>
                <span><i className="ws-tng" />Business money (TnG) <b><Count value={split.tngSen / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></b></span>
              </div>
            </div>
          )}
        </div>

        <div className="mcard">
          <div className="mcard-h"><h3>Categories</h3><span className="muted">Tap one to see where it went</span><div className="grow" />{addingCat ? (
            <form className="row new-cat" onSubmit={(e) => { e.preventDefault(); if (catName.trim()) act(upsertCategory, { name: catName.trim() }); setCatName(''); setAddingCat(false); }}>
              <input className="input" autoFocus style={{ height: 32, width: 180 }} placeholder="Category name" value={catName} onChange={(e) => setCatName(e.target.value)} onBlur={() => { if (!catName.trim()) setAddingCat(false); }} />
            </form>
          ) : <button className="btn sm ghost" onClick={() => setAddingCat(true)}><Icon name="plus" size={14} />Category</button>}</div>
          <div className="bubbles">
            {s.money.categories.map((c) => <CategoryBubble key={c.id} c={c} sum={m.categories.find((x) => x.id === c.id)!} onClick={() => setCatId(c.id)} />)}
          </div>
        </div>

        {(m.inSen > 0 || m.outSen > 0) && (
          <div className="mcard">
            <div className="mcard-h"><h3>Where it went</h3></div>
            <Flow inSen={m.inSen} keptSen={m.keptSen} cats={s.money.categories.map((c) => ({ name: c.name, color: c.color, sen: m.categories.find((x) => x.id === c.id)!.spentSen }))} />
          </div>
        )}

        <div className="mcard">
          <div className="mcard-h"><h3>Savings goals</h3></div>
          <div className="goals">
            {s.money.goals.map((g) => <GoalCard key={g.id} id={g.id} />)}
            {newGoal ? <NewGoal onDone={() => setNewGoal(false)} /> : <button className="goal goal-new" onClick={() => setNewGoal(true)}><Icon name="plus" size={18} />New goal</button>}
          </div>
        </div>

        <div className="two">
          <div className="mcard">
            <div className="mcard-h"><h3>Activity</h3><span className="muted">{entries.length} entries</span></div>
            {entries.length === 0 && <div className="empty" style={{ padding: 20 }}><p>Nothing logged in {monthName(mk)} yet. Press <span className="kbd">Ctrl E</span> to log your first one.</p></div>}
            <div className="timeline" style={{ maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
              {byDay.map(([d, es]) => (
                <div key={d}>
                  <div className="tl-day-h"><span>{fmt.day(d)}</span><span>{fmt.rm(es.reduce((n, e) => n + (e.kind === 'out' ? -e.sen : e.sen), 0))}</span></div>
                  <div className="tl-items">
                    {es.map((e) => {
                      const c = e.kind === 'out' ? s.money.categories.find((x) => x.id === e.categoryId) : undefined;
                      const src = e.kind === 'in' ? s.money.sources.find((x) => x.id === e.sourceId) : undefined;
                      return (
                        <motion.div key={e.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="tl-item" onClick={() => setUI({ logSheet: { kind: e.kind, editId: e.id } })}>
                          <CatIcon c={c ?? { icon: src?.icon ?? 'coins', color: 'var(--in)' }} size={34} />
                          <div style={{ minWidth: 0 }}><div className="tl-note">{e.note || c?.name || src?.name}</div><div className="tl-sub">{c?.name ?? src?.name}{e.autoFrom ? ' · added automatically' : e.repeatMonthly ? ' · repeats monthly' : ''}{e.wallet === 'tng' && <span className="tng-tag">TnG</span>}</div></div>
                          <div className={`tl-amt ${e.kind}`}>{e.kind === 'in' ? '+' : ''}{fmt.rm(e.sen)}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mcard">
            <div className="mcard-h"><h3>Last 6 months</h3><span className="chip ok" style={{ marginLeft: 'auto' }}>In</span><span className="chip warn">Out</span></div>
            <SixMonths data={six} />
            {m.outSen > 0 && (
              <>
                <div className="mcard-h" style={{ marginTop: 26 }}><h3>{monthName(mk)} by category</h3></div>
                <div className="row" style={{ gap: 22, alignItems: 'center' }}>
                  <Donut parts={m.categories.filter((c) => c.spentSen > 0).sort((a, b) => b.spentSen - a.spentSen).map((c) => ({ color: s.money.categories.find((x) => x.id === c.id)!.color, value: c.spentSen }))} size={150} stroke={20}>
                    <div><div style={{ fontWeight: 800 }}>{fmt.rm(m.outSen)}</div><div className="muted" style={{ fontSize: '.7rem' }}>out</div></div>
                  </Donut>
                  <div className="stack grow" style={{ gap: 8 }}>
                    {m.categories.filter((c) => c.spentSen > 0).sort((a, b) => b.spentSen - a.spentSen).slice(0, 6).map((c) => { const cat = s.money.categories.find((x) => x.id === c.id)!; return (
                      <div key={c.id} className="row" style={{ gap: 8, fontSize: '.82rem' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: cat.color }} /><span className="grow dim">{cat.name}</span><b>{Math.round((c.spentSen / m.outSen) * 100)}%</b></div>
                    ); })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

  </>), [s, mk, catId, newGoal, addingCat, catName, setup]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page page-wide">
      <div className="ph ph-money">
        <div><h1>Money</h1><div className="sub">What comes in, what goes out, and what you keep</div></div>
        <div className="ph-actions" style={{ alignItems: 'center' }}>
          <div className="seg-ctl money-tabs"><button className={tab === 'personal' ? 'on' : ''} onClick={() => setTab('personal')}>Personal</button><button className={tab === 'business' ? 'on' : ''} onClick={() => setTab('business')}>Business</button></div>
          <div className="month-nav">
            <button className="icon-btn" disabled={mk <= monthKey(earliest)} onClick={() => setMk(addMonths(mk, -1))}><Icon name="left" size={16} /></button>
            <b>{monthName(mk)} {mk.slice(0, 4)}</b>
            <button className="icon-btn" disabled={isCurrent} onClick={() => setMk(addMonths(mk, 1))}><Icon name="right" size={16} /></button>
          </div>
          {!isCurrent && <button className="btn" onClick={() => setUI({ recapMonth: mk })}><Icon name="sparkle" size={16} />Recap</button>}
          {isCurrent && prevHas && <button className="btn ghost" onClick={() => setUI({ recapMonth: prevMk })}><Icon name="sparkle" size={16} />{monthName(prevMk)} recap</button>}
          {tab === 'personal' && <button className="btn primary" onClick={() => setUI({ logSheet: { kind: 'out' } })}><Icon name="plus" size={16} stroke={2.4} />Log <span className="kbd" style={{ background: 'transparent', color: 'inherit', opacity: 0.7 }}>Ctrl E</span></button>}
        </div>
      </div>

      <AnimatePresence>
        {tab === 'personal' && showNudge && nd && (
          <motion.div className="nudge" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}>
            <Icon name={nd.kind === 'warn' ? 'bell' : nd.kind === 'payday' ? 'coins' : 'clock'} size={18} />
            <div className="grow">{nd.text}</div>
            {nd.kind === 'payday' && nd.goalId && <button className="btn primary sm" onClick={() => { act(deposit, nd.goalId!, nd.suggestSen!, new Date()); act(dismissNudge, nd.id); }}>Put {fmt.rm(nd.suggestSen!)} aside</button>}
            {nd.kind === 'quiet' && <button className="btn sm" onClick={() => setUI({ logSheet: { kind: 'out' } })}>Log something</button>}
            <button className="icon-btn" onClick={() => act(dismissNudge, nd.id)} title="Dismiss"><Icon name="x" size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* both tabs stay ready once seen; the other one is prepared while the app is idle */}
      <Keep show={tab === 'business'} warm>{bizPane}</Keep>
      <Keep show={tab === 'personal'} warm>{personalPane}</Keep>

      {catId && <CategoryDetail id={catId} mk={mk} onClose={() => setCatId(null)} />}
      {setup !== false && <Setup startStep={setup} onDone={() => setSetup(false)} onSkip={() => setSetup(false)} />}
    </div>
  );
}

function TrackingHero({ mk, isCurrent, onAdjust }: { mk: string; isCurrent: boolean; onAdjust: () => void }) {
  const s = useStore((x) => x.s);
  const fmt = useFmt();
  const today = dayKey(new Date());
  const m = monthSummary(s.money, mk, today);
  const sug = isCurrent ? suggestFromHistory(s.money, today) : null;
  const outs = s.money.entries.filter((e) => e.kind === 'out');
  const first = outs.reduce((a, e) => (e.date < a ? e.date : a), today);
  const tracked = outs.length ? Math.min(14, Math.round((new Date(today).getTime() - new Date(first).getTime()) / 86400000)) : 0;
  const top = sug ? Object.entries(sug.limits).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]) : [];
  const total = top.reduce((n, [, v]) => n + v, 0);
  return (
    <div className="money-hero" style={{ alignItems: 'stretch' }}>
      <div style={{ minWidth: 240 }}>
        <div className="hero-label">Spent in {monthName(mk)}</div>
        <div className="hero-num" style={{ fontSize: '2.4rem' }}><Count value={m.outSen / 100} format={(v) => fmt.rm(Math.round(v * 100))} /></div>
        <div className="hero-of">{fmt.rm(m.inSen)} came in · tracking mode</div>
      </div>
      <div className="hero-side">
        {!sug ? (
          <>
            <div className="hero-safe" style={{ fontSize: '.95rem' }}>Keep logging what you spend. After about two weeks, Undr Ctrl suggests a budget based on your real spending.</div>
            <Bar value={tracked} max={14} label="Days tracked" showNumbers format={(v) => `${Math.round(v)} days`} height={8} color="var(--accent-fill)" />
            <div className="row"><button className="btn sm ghost" onClick={onAdjust}><Icon name="sliders" size={14} />Set limits myself</button></div>
          </>
        ) : (
          <>
            <div className="hero-safe" style={{ fontSize: '.95rem' }}>Based on your last <b style={{ fontSize: '1rem' }}>{sug.days} days</b>, here's a monthly budget that fits how you actually spend: <b style={{ fontSize: '1rem' }}>{fmt.rm(total)}</b>.</div>
            <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>{top.slice(0, 6).map(([id, v]) => { const c = s.money.categories.find((x) => x.id === id)!; return <span key={id} className="chip"><span className="sdot" style={{ background: c.color }} />{c.name} {fmt.rm(v)}</span>; })}</div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn primary" onClick={() => act(setBudget, { limits: sug.limits, savingsSen: 0, expected: {} }, new Date())}><Icon name="check" size={15} stroke={2.4} />Use this budget</button>
              <button className="btn ghost" onClick={onAdjust}><Icon name="sliders" size={14} />Set my own</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GoalCard({ id }: { id: string }) {
  const g = useStore((x) => x.s.money.goals.find((y) => y.id === id))!;
  const fmt = useFmt();
  const [adding, setAdding] = useState(false);
  const [raw, setRaw] = useState('');
  const today = dayKey(new Date());
  const doneG = g.savedSen >= g.targetSen;
  return (
    <div className="goal">
      <Liquid value={g.savedSen} max={g.targetSen} size={78} radius={22} />
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="goal-name">{g.name}{doneG && <span className="chip ok" style={{ marginLeft: 8 }}>Done</span>}</div>
        <div className="goal-amt"><b>{fmt.rm(g.savedSen)}</b> of {fmt.rm(g.targetSen)} · {Math.round((g.savedSen / g.targetSen) * 100)}%</div>
        <div className="goal-plan">{goalPlan(g, today)}</div>
        {adding ? (
          <form className="row" style={{ marginTop: 10, gap: 6 }} onSubmit={(e) => { e.preventDefault(); const sen = parseAmount(raw); if (sen) { act(deposit, id, sen, new Date()); setRaw(''); setAdding(false); } }}>
            <input className="input" autoFocus placeholder="RM" value={raw} onChange={(e) => setRaw(e.target.value)} style={{ height: 32, width: 110 }} />
            <button className="btn sm primary">Add</button><button type="button" className="btn sm ghost" onClick={() => setAdding(false)}>Cancel</button>
          </form>
        ) : (
          <div className="row" style={{ marginTop: 10, gap: 6 }}>
            {!doneG && <button className="btn sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} />Add to goal</button>}
            <button className="icon-btn" title="Delete goal" onClick={() => { if (confirm(`Delete “${g.name}”?`)) act(deleteGoal, id); }}><Icon name="trash" size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function NewGoal({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [date, setDate] = useState('');
  return (
    <form className="goal" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }} onSubmit={(e) => { e.preventDefault(); const t = parseAmount(target); if (name.trim() && t) { act(addGoal, { name, targetSen: t, deadline: date || undefined }, new Date()); onDone(); } }}>
      <input className="input" autoFocus placeholder="Goal name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="row"><input className="input" placeholder="Target RM" value={target} onChange={(e) => setTarget(e.target.value)} /><input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="row"><div className="grow" /><button type="button" className="btn sm ghost" onClick={onDone}>Cancel</button><button className="btn sm primary">Create</button></div>
    </form>
  );
}

function CategoryDetail({ id, mk, onClose }: { id: string; mk: string; onClose: () => void }) {
  const s = useStore((x) => x.s);
  const setUI = useStore((x) => x.setUI);
  const fmt = useFmt();
  const c = s.money.categories.find((x) => x.id === id)!;
  const today = dayKey(new Date());
  const m = monthSummary(s.money, mk, today);
  const sum = m.categories.find((x) => x.id === id)!;
  const days = daysInMonth(`${mk}-01`);
  const lastDay = mk === monthKey(today) ? dayOfMonth(today) : days;
  const es = s.money.entries.filter((e) => e.kind === 'out' && e.categoryId === id && inMonth(e, mk));
  const daily = Array.from({ length: lastDay }, (_, i) => es.filter((e) => e.date === addDays(monthStart(mk), i)).reduce((n, e) => n + e.sen, 0));
  const [limit, setLimit] = useState(String(c.limitSen / 100));
  const daysLeft = days - lastDay;
  const tip = sum.limitSen <= 0 ? 'No limit set. Give it one to see a pace line.'
    : sum.status === 'over' ? `${fmt.rm(sum.spentSen - sum.limitSen)} over. It happens; next month starts fresh.`
    : daysLeft > 0 ? `About ${fmt.rm(Math.floor((sum.limitSen - sum.spentSen) / daysLeft / 100) * 100)} a day keeps ${c.name} on track.` : `Finished ${fmt.rm(sum.limitSen - sum.spentSen)} under.`;
  return (
    <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="sheet wide" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
        <div className="sheet-h"><CatIcon c={c} size={44} /><div><h2>{c.name}</h2><div className="muted" style={{ fontSize: '.84rem' }}>{monthName(mk)} · {fmt.rm(sum.spentSen)}{sum.limitSen ? ` of ${fmt.rm(sum.limitSen)}` : ''}</div></div><div className="grow" /><button className="icon-btn" onClick={onClose}><Icon name="x" /></button></div>
        <Bar value={sum.spentSen} max={sum.limitSen || Math.max(1, sum.spentSen)} color={sum.status === 'over' ? 'var(--bad)' : sum.status === 'warn' ? 'var(--warn)' : c.color} height={12} />
        <div className="card flat row"><Icon name="sparkle" size={16} /><span className="dim">{tip}</span></div>
        <div><div className="section-label" style={{ marginTop: 0 }}>Spending vs. pace</div><PaceLine daily={daily} limitSen={sum.limitSen} days={days} color={c.color} /></div>
        <div className="row"><span className="dim" style={{ fontWeight: 600 }}>Monthly limit</span><div className="grow" /><span className="muted">RM</span><input className="input" style={{ width: 120 }} value={limit} onChange={(e) => setLimit(e.target.value)} onBlur={() => { const v = parseAmount(limit) ?? 0; act(upsertCategory, { ...c, limitSen: v }); }} /></div>
        <div className="tl-items" style={{ maxHeight: 240, overflowY: 'auto' }}>
          {es.sort((a, b) => b.date.localeCompare(a.date)).map((e) => (
            <div key={e.id} className="tl-item" onClick={() => { onClose(); setUI({ logSheet: { kind: 'out', editId: e.id } }); }}>
              <div className="grow"><div className="tl-note">{e.note || c.name}</div><div className="tl-sub">{fmt.day(e.date)}</div></div><div className="tl-amt">{fmt.rm(e.sen)}</div>
            </div>
          ))}
          {!es.length && <div className="muted" style={{ fontSize: '.86rem' }}>Nothing here this month.</div>}
        </div>
      </motion.div>
    </div>
  );
}

export function MoneyOverlays() {
  const ui = useStore((x) => x.ui);
  const setUI = useStore((x) => x.setUI);
  return (
    <>
      {ui.logSheet && <LogSheet key={ui.logSheet.editId ?? ui.logSheet.kind} />}
      <AnimatePresence>{ui.recapMonth && <Recap month={ui.recapMonth} onClose={() => setUI({ recapMonth: null })} />}</AnimatePresence>
    </>
  );
}
