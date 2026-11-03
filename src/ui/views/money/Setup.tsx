import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { useStore, act } from '../../../store/store';
import { setBudget, addGoal } from '../../../store/logic';
import { fitToIncome, parseAmount, suggestSplit, unassigned } from '../../../core/money';
import { Icon } from '../../shapes/icons';
import { SegBar, SPRING } from '../../shapes/Progress';
import { CatIcon } from './parts';
import { useFmt } from '../../format';

const round10 = (sen: number) => Math.max(0, Math.round(sen / 1000) * 1000);

export function Setup({ onDone, onSkip, embedded, startStep = 0 }: { onDone: () => void; onSkip?: () => void; embedded?: boolean; startStep?: number }) {
  const s = useStore((x) => x.s);
  const fmt = useFmt();
  const [step, setStep] = useState(startStep);
  const [mode, setMode] = useState<'track' | 'manual'>(() => (s.money.categories.some((c) => c.limitSen > 0) ? 'manual' : 'track'));
  const [expected, setExpected] = useState<Record<string, string>>(() => Object.fromEntries(s.money.sources.map((x) => [x.id, x.expectedSen ? String(x.expectedSen / 100) : ''])));
  const [picked, setPicked] = useState<string[]>(() => s.money.categories.map((c) => c.id));
  const [limits, setLimits] = useState<Record<string, number>>(() => Object.fromEntries(s.money.categories.filter((c) => c.limitSen > 0).map((c) => [c.id, c.limitSen])));
  const [savings, setSavings] = useState(s.money.savingsTargetSen);
  const [goal, setGoal] = useState({ name: '', target: '', date: '' });
  const income = Object.values(expected).reduce((n, v) => n + (parseAmount(v) ?? 0), 0);
  const cats = s.money.categories.filter((c) => picked.includes(c.id));

  const enterSplit = () => {
    if (income > 0 && (!Object.keys(limits).length || Object.keys(limits).some((id) => !picked.includes(id)))) {
      const sp = suggestSplit(income, cats);
      setLimits(sp.limits);
      setSavings(sp.savingsSen);
    }
    setStep(2);
  };
  const finish = () => {
    const tracking = income <= 0 && mode === 'track';
    const lim = Object.fromEntries(cats.map((c) => [c.id, tracking ? 0 : limits[c.id] ?? 0]));
    act(setBudget, { limits: lim, savingsSen: income <= 0 && mode === 'track' ? 0 : savings, expected: Object.fromEntries(Object.entries(expected).map(([k, v]) => [k, parseAmount(v) ?? 0])), categoryIds: picked }, new Date());
    const target = parseAmount(goal.target);
    if (goal.name.trim() && target) act(addGoal, { name: goal.name, targetSen: target, deadline: goal.date || undefined }, new Date());
    onDone();
  };
  const titles = ['How much comes in each month?', 'What do you spend on?', income > 0 ? 'Give every ringgit a job' : 'How do you want to budget?', 'Saving for something?'];

  return (
    <div className={embedded ? '' : 'modal'}>
      <motion.div className="sheet wide" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING} style={{ minHeight: 560 }}>
        <div className="steps"><SegBar done={step + 1} total={4} height={6} gap={6} /></div>
        <div className="sheet-h">
          <div><div className="muted" style={{ fontSize: '.78rem', fontWeight: 700 }}>Money setup · step {step + 1} of 4</div><h2 style={{ marginTop: 4, fontSize: '1.5rem' }}>{titles[step]}</h2></div>
          <div className="grow" />
          {onSkip && <button className="btn ghost sm" onClick={onSkip}>Set up later</button>}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }} transition={{ duration: 0.2 }} className="stack" style={{ flex: 1 }}>
            {step === 0 && (
              <>
                <p className="dim" style={{ lineHeight: 1.5 }}>Add what you usually get in a month. If it changes, a typical amount is fine. <b style={{ color: 'var(--t1)' }}>No regular income? That's okay, skip this.</b> Log money from parents or sales whenever it comes in.</p>
                {s.money.sources.map((src) => (
                  <div key={src.id} className="row" style={{ gap: 14 }}>
                    <CatIcon c={{ icon: src.icon, color: 'var(--in)' }} size={38} />
                    <div className="grow" style={{ fontWeight: 600 }}>{src.name}</div>
                    <div className="row" style={{ gap: 6 }}><span className="muted">RM</span><input className="input" style={{ width: 140, textAlign: 'right', fontWeight: 700 }} inputMode="decimal" placeholder="0" value={expected[src.id] ?? ''} onChange={(e) => setExpected({ ...expected, [src.id]: e.target.value })} /></div>
                  </div>
                ))}
                <div className="card flat row" style={{ marginTop: 'auto' }}><span className="muted">Monthly total</span><div className="grow" /><b style={{ fontSize: '1.3rem', color: 'var(--in)' }}>{fmt.rm(income)}</b></div>
              </>
            )}
            {step === 1 && (
              <>
                <p className="dim">Tap to keep or remove. You can rename and add your own later.</p>
                <div className="cat-cloud" style={{ justifyContent: 'center', padding: '10px 0' }}>
                  {s.money.categories.map((c, i) => (
                    <motion.button key={c.id} className={`cat-pick ${picked.includes(c.id) ? 'on' : ''}`} style={{ ['--c' as string]: c.color, opacity: picked.includes(c.id) ? 1 : 0.5 }}
                      initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: picked.includes(c.id) ? 1 : 0.5 }} transition={{ ...SPRING, delay: i * 0.03 }}
                      onClick={() => setPicked(picked.includes(c.id) ? picked.filter((x) => x !== c.id) : [...picked, c.id])}>
                      <CatIcon c={c} size={40} />{c.name}
                      <span className="muted" style={{ fontSize: '.66rem' }}>{c.need ? 'Need' : 'Want'}</span>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
            {step === 2 && income > 0 && <Split income={income} cats={cats} limits={limits} setLimits={setLimits} savings={savings} setSavings={setSavings} />}
            {step === 2 && income <= 0 && <NoIncome mode={mode} setMode={setMode} cats={cats} limits={limits} setLimits={setLimits} savings={savings} setSavings={setSavings} />}
            {step === 3 && (
              <>
                <p className="dim">Optional. Give it a name and a target. Undr Ctrl works out how much to put aside each month.</p>
                <label className="field"><span>Goal</span><input className="input" placeholder="Goal name" value={goal.name} onChange={(e) => setGoal({ ...goal, name: e.target.value })} /></label>
                <div className="two">
                  <label className="field"><span>Target (RM)</span><input className="input" inputMode="decimal" placeholder="Target RM" value={goal.target} onChange={(e) => setGoal({ ...goal, target: e.target.value })} /></label>
                  <label className="field"><span>By (optional)</span><input className="input" type="date" value={goal.date} onChange={(e) => setGoal({ ...goal, date: e.target.value })} /></label>
                </div>
                {savings > 0 && <div className="card flat dim" style={{ fontSize: '.88rem' }}>Your monthly savings slice is <b style={{ color: 'var(--in)' }}>{fmt.rm(savings)}</b>.</div>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="row">
          {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}><Icon name="left" size={16} />Back</button>}
          <div className="grow" />
          {step === 0 && <button className="btn primary lg" onClick={() => setStep(1)}>{income > 0 ? 'Next' : "Skip, my income isn't regular"}<Icon name="right" size={16} /></button>}
          {step === 1 && <button className="btn primary lg" disabled={!picked.length} onClick={enterSplit}>Next<Icon name="right" size={16} /></button>}
          {step === 2 && <button className="btn primary lg" onClick={() => setStep(3)}>Next<Icon name="right" size={16} /></button>}
          {step === 3 && <button className="btn primary lg" onClick={finish}><Icon name="check" size={16} stroke={2.4} />Done</button>}
        </div>
      </motion.div>
    </div>
  );
}

function Split({ income, cats, limits, setLimits, savings, setSavings }: { income: number; cats: { id: string; name: string; icon: string; color: string; need: boolean }[]; limits: Record<string, number>; setLimits: (l: Record<string, number>) => void; savings: number; setSavings: (n: number) => void }) {
  const fmt = useFmt();
  const bar = useRef<HTMLDivElement>(null);
  const needs = cats.filter((c) => c.need), wants = cats.filter((c) => !c.need);
  const sum = (g: typeof cats) => g.reduce((n, c) => n + (limits[c.id] ?? 0), 0);
  const N = sum(needs), W = sum(wants);
  const u = unassigned(income, Object.fromEntries(cats.map((c) => [c.id, limits[c.id] ?? 0])), savings);
  const scale = Math.max(income, N + W + savings, 1);
  const spread = (g: typeof cats, total: number, base: Record<string, number>) => {
    if (!g.length) return base;
    const each = Math.floor(total / g.length / 1000) * 1000;
    const out = { ...base };
    g.forEach((c) => (out[c.id] = each));
    return out;
  };
  const drag = (which: 1 | 2) => (e: React.PointerEvent) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const r = bar.current!.getBoundingClientRect();
      const at = round10(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * scale);
      if (which === 1) {
        const nN = Math.min(at, N + W);
        setLimits(spread(wants, N + W - nN, spread(needs, nN, limits)));
      } else {
        const end = Math.max(N, Math.min(at, N + W + savings));
        setLimits(spread(wants, end - N, limits));
        setSavings(N + W + savings - end);
      }
    };
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const seg = (v: number, color: string, label: string) => v > 0 && <motion.div className="stack-seg" style={{ background: color }} animate={{ width: `${(v / scale) * 100}%` }} transition={{ duration: 0.12 }}>{v / scale > 0.12 ? label : ''}</motion.div>;
  const fix = () => { const f = fitToIncome(income, Object.fromEntries(cats.map((c) => [c.id, limits[c.id] ?? 0])), savings); setLimits(f.limits); setSavings(f.savingsSen); };
  return (
    <>
      <p className="dim" style={{ lineHeight: 1.5 }}>A simple starting point: about <b>half for needs</b>, <b>30% for wants</b>, <b>20% for savings</b>. Drag the handles or the sliders to make it yours.</p>
      <div>
        <div className="stack-bar" ref={bar}>
          {seg(N, 'var(--int)', `Needs ${fmt.rm(N)}`)}
          {seg(W, 'var(--cre)', `Wants ${fmt.rm(W)}`)}
          {seg(savings, 'var(--in)', `Savings ${fmt.rm(savings)}`)}
          <div className="stack-handle" style={{ left: `${(N / scale) * 100}%` }} onPointerDown={drag(1)} title="Drag to move money between needs and wants" />
          <div className="stack-handle" style={{ left: `${((N + W) / scale) * 100}%` }} onPointerDown={drag(2)} title="Drag to move money between wants and savings" />
        </div>
        <div className="row muted" style={{ fontSize: '.74rem', fontWeight: 700, marginTop: 6 }}><span>RM 0</span><div className="grow" /><span>{fmt.rm(income)} a month</span></div>
      </div>
      <div className={`checker`} style={{ background: u === 0 ? 'color-mix(in srgb, var(--ok) 14%, transparent)' : u > 0 ? 'color-mix(in srgb, var(--warn) 14%, transparent)' : 'color-mix(in srgb, var(--bad) 14%, transparent)' }}>
        <Icon name={u === 0 ? 'check' : 'bell'} size={16} />
        {u === 0 ? 'Every ringgit has a job.' : u > 0 ? `${fmt.rm(u)} not assigned yet.` : `${fmt.rm(-u)} over your income.`}
        <div className="grow" />
        {u > 0 && <button className="btn sm" onClick={() => setSavings(savings + u)}>Put it in savings</button>}
        {u !== 0 && <button className="btn sm primary" onClick={fix}>Fix it</button>}
      </div>
      <div className="stack" style={{ maxHeight: 250, overflowY: 'auto', paddingRight: 6 }}>
        {cats.map((c) => (
          <div key={c.id} className="slider-row">
            <CatIcon c={c} size={28} /><span style={{ fontWeight: 600, fontSize: '.88rem' }}>{c.name}</span>
            <input type="range" min={0} max={Math.max(income, 10000)} step={1000} value={limits[c.id] ?? 0} onChange={(e) => setLimits({ ...limits, [c.id]: Number(e.target.value) })} />
            <b style={{ textAlign: 'right', fontSize: '.88rem' }}>{fmt.rm(limits[c.id] ?? 0)}</b>
          </div>
        ))}
        <div className="slider-row">
          <CatIcon c={{ icon: 'coins', color: 'var(--in)' }} size={28} /><span style={{ fontWeight: 600, fontSize: '.88rem' }}>Savings</span>
          <input type="range" min={0} max={Math.max(income, 10000)} step={1000} value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
          <b style={{ textAlign: 'right', fontSize: '.88rem', color: 'var(--in)' }}>{fmt.rm(savings)}</b>
        </div>
      </div>
    </>
  );
}

function NoIncome({ mode, setMode, cats, limits, setLimits, savings, setSavings }: { mode: 'track' | 'manual'; setMode: (m: 'track' | 'manual') => void; cats: { id: string; name: string; icon: string; color: string }[]; limits: Record<string, number>; setLimits: (l: Record<string, number>) => void; savings: number; setSavings: (n: number) => void }) {
  const fmt = useFmt();
  const total = cats.reduce((n, c) => n + (limits[c.id] ?? 0), 0);
  const opt = (m: 'track' | 'manual', title: string, text: string, icon: string) => (
    <button className={`choice ${mode === m ? 'on' : ''}`} onClick={() => setMode(m)}>
      <Icon name={icon} size={22} />
      <div><b>{title}</b><p>{text}</p></div>
    </button>
  );
  return (
    <>
      <div className="row" style={{ gap: 12, alignItems: 'stretch' }}>
        {opt('track', 'Track first (recommended)', 'Just log for a couple of weeks. Then Undr Ctrl suggests limits from what you really spend.', 'sparkle')}
        {opt('manual', 'Set my own limits', 'Pick a monthly limit for each category now. You can change them any time.', 'sliders')}
      </div>
      {mode === 'manual' && (
        <div className="stack" style={{ maxHeight: 260, overflowY: 'auto', paddingRight: 6 }}>
          {cats.map((c) => (
            <div key={c.id} className="slider-row">
              <CatIcon c={c} size={28} /><span style={{ fontWeight: 600, fontSize: '.88rem' }}>{c.name}</span>
              <input type="range" min={0} max={200000} step={1000} value={limits[c.id] ?? 0} onChange={(e) => setLimits({ ...limits, [c.id]: Number(e.target.value) })} />
              <b style={{ textAlign: 'right', fontSize: '.88rem' }}>{fmt.rm(limits[c.id] ?? 0)}</b>
            </div>
          ))}
          <div className="slider-row">
            <CatIcon c={{ icon: 'coins', color: 'var(--in)' }} size={28} /><span style={{ fontWeight: 600, fontSize: '.88rem' }}>Savings target</span>
            <input type="range" min={0} max={200000} step={1000} value={savings} onChange={(e) => setSavings(Number(e.target.value))} />
            <b style={{ textAlign: 'right', fontSize: '.88rem', color: 'var(--in)' }}>{fmt.rm(savings)}</b>
          </div>
          <div className="card flat row"><span className="dim">Monthly spending budget</span><div className="grow" /><b>{fmt.rm(total)}</b></div>
        </div>
      )}
    </>
  );
}

export { useMemo };
