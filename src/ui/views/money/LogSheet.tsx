import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { stagger, haptic, pop, sparks, centerOf } from '../../motion/juice';
import { cssVar } from '../../motion/particles';
import { useStore, act, actUndoable } from '../../../store/store';
import { logMoney, editMoney, deleteMoney } from '../../../store/logic';
import { parseAmount } from '../../../core/money';
import { addDays, dayKey } from '../../../core/dates';
import { Icon } from '../../shapes/icons';
import { SPRING } from '../../shapes/Progress';
import { CatIcon } from './parts';
import { useFmt } from '../../format';
import { sfx } from '../../sound/synth';

export function LogSheet() {
  const s = useStore((x) => x.s);
  const sheet = useStore((x) => x.ui.logSheet);
  const setUI = useStore((x) => x.setUI);
  const fmt = useFmt();
  const editing = sheet && sheet.editId ? s.money.entries.find((e) => e.id === sheet.editId) : undefined;
  const today = dayKey(new Date());
  const [kind, setKind] = useState<'in' | 'out'>(editing?.kind ?? (sheet ? sheet.kind : 'out'));
  const [pick, setPick] = useState<string | null>(editing ? (editing.kind === 'out' ? editing.categoryId! : editing.sourceId!) : null);
  const [raw, setRaw] = useState(editing ? (editing.sen / 100).toString() : '');
  const [note, setNote] = useState(editing?.note ?? '');
  const [date, setDate] = useState(editing?.date ?? today);
  const [repeat, setRepeat] = useState(!!editing?.repeatMonthly);
  const [wallet, setWallet] = useState<'cash' | 'tng'>(editing ? editing.wallet ?? 'cash' : s.settings.lastWallet ?? 'cash');
  const [hint, setHint] = useState('');
  const close = () => setUI({ logSheet: false });
  const sheetRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { stagger(sheetRef.current, { step: 30, max: 8, y: 14 }); }, []);

  // most-used categories first
  const cats = useMemo(() => {
    const n: Record<string, number> = {};
    for (const e of s.money.entries) if (e.kind === 'out' && e.categoryId) n[e.categoryId] = (n[e.categoryId] ?? 0) + 1;
    return [...s.money.categories].sort((a, b) => (n[b.id] ?? 0) - (n[a.id] ?? 0));
  }, [s.money]);
  const options = kind === 'out' ? cats.map((c) => ({ id: c.id, name: c.name, c })) : s.money.sources.map((x) => ({ id: x.id, name: x.name, c: { icon: x.icon, color: 'var(--in)', emoji: undefined } }));

  const sen = parseAmount(raw);
  const save = () => {
    if (!pick) { setHint(kind === 'out' ? 'Pick a category first.' : 'Pick where it came from.'); return; }
    if (!sen) { setHint('Type an amount above RM 0.'); return; }
    const payload = { kind, sen, note, date, repeatMonthly: repeat, wallet, ...(kind === 'out' ? { categoryId: pick } : { sourceId: pick }) };
    if (!editing && wallet !== s.settings.lastWallet) useStore.getState().setSettings({ lastWallet: wallet });
    if (editing) actUndoable('Saved changes', editMoney, editing.id, payload, new Date()); else actUndoable(`Logged ${kind === 'in' ? '+' : ''}${fmt.rm(sen)}${wallet === 'tng' ? ' · TnG' : ''}`, logMoney, payload, new Date());
    sfx.tink();
    haptic('success');
    if (saveRef.current) { const at = centerOf(saveRef.current); sparks(at.x, at.y, [cssVar(kind === 'in' ? '--in' : '--xp'), cssVar('--t1')], 16); }
    close();
  };
  const press = (k: string) => {
    setHint('');
    haptic('light');
    pop(amountRef.current, k === '⌫' ? 0.94 : 1.07, 240);
    if (k === '⌫') return setRaw((r) => r.slice(0, -1));
    setRaw((r) => {
      if (k === '.' && r.includes('.')) return r;
      if (r.includes('.') && r.split('.')[1].length >= 2) return r;
      if (r.replace('.', '').length >= 7) return r;
      return (r === '0' && k !== '.' ? '' : r) + k;
    });
  };
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') { if (e.key === 'Enter') save(); return; }
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === '.' || e.key === ',') press('.');
      else if (e.key === 'Backspace') press('⌫');
      else if (e.key === 'Enter') save();
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  });

  return (
    <div className="modal" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <motion.div ref={sheetRef} className="sheet" initial={{ y: 30, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={SPRING}>
        <div className="sheet-h"><h2>{editing ? 'Edit entry' : 'Log money'}</h2><div className="grow" /><button className="icon-btn" onClick={close}><Icon name="x" /></button></div>
        <div className="inout-toggle">
          <motion.div className="pill" animate={{ x: kind === 'out' ? 0 : '100%' }} transition={SPRING} />
          <button className={kind === 'out' ? 'on' : ''} onClick={() => { setKind('out'); setPick(null); }}>Money out</button>
          <button className={kind === 'in' ? 'on' : ''} onClick={() => { setKind('in'); setPick(null); }}>Money in</button>
        </div>
        <div>
          <div className="section-label" style={{ marginTop: 0 }}>1 · {kind === 'out' ? 'What was it for?' : 'Where did it come from?'}</div>
          <div className="cat-cloud">
            {options.map((o) => (
              <button key={o.id} className={`cat-pick ${pick === o.id ? 'on' : ''}`} style={{ ['--c' as string]: o.c.color }} onClick={(e) => { setPick(o.id); setHint(''); sfx.click(); haptic('light'); pop(e.currentTarget.firstElementChild, 1.2); }}>
                <CatIcon c={o.c} size={36} />{o.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="section-label" style={{ marginTop: 0 }}>2 · How much?</div>
          <div ref={amountRef} className="amount-display" style={{ color: kind === 'in' ? 'var(--in)' : undefined }}><span>RM</span>{raw || '0'}</div>
          <div className="numpad">{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((k) => <button key={k} onClick={() => press(k)}>{k}</button>)}</div>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">{kind === 'out' ? 'Paid with' : 'Received in'}</span>
          <div className="seg-ctl wallet-pick">
            <button className={wallet === 'cash' ? 'on' : ''} onClick={() => { setWallet('cash'); haptic('light'); }}><Icon name="wallet" size={14} />Cash</button>
            <button className={wallet === 'tng' ? 'on' : ''} onClick={() => { setWallet('tng'); haptic('light'); }}><Icon name="coins" size={14} />TnG</button>
          </div>
          {wallet === 'tng' && <span className="wallet-hint">{kind === 'out' ? 'From your business money' : 'Goes into your business money'}</span>}
        </div>
        <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <input className="input grow" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} style={{ minWidth: 200 }} />
          <div className="seg-ctl">
            <button className={date === today ? 'on' : ''} onClick={() => setDate(today)}>Today</button>
            <button className={date === addDays(today, -1) ? 'on' : ''} onClick={() => setDate(addDays(today, -1))}>Yesterday</button>
          </div>
          <input type="date" className="input" style={{ width: 150, height: 36 }} value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} />
        </div>
        <button className="row" style={{ gap: 10, color: 'var(--t2)', fontSize: '.86rem', fontWeight: 600 }} onClick={() => setRepeat(!repeat)}>
          <span className={`toggle ${repeat ? 'on' : ''}`} /> Repeat monthly (rent, Spotify, allowance…)
        </button>
        {hint && <div className="chip warn" style={{ alignSelf: 'flex-start' }}>{hint}</div>}
        <div className="row">
          {editing && <button className="btn ghost danger" onClick={() => { actUndoable('Deleted the entry', deleteMoney, editing.id, new Date()); close(); }}><Icon name="trash" size={16} />Delete</button>}
          <div className="grow" />
          <button ref={saveRef} className="btn primary lg" onClick={save}><Icon name="check" size={18} stroke={2.4} />{editing ? 'Save' : sen ? `Log ${kind === 'in' ? '+' : ''}${fmt.rm(sen)}` : 'Log it'}</button>
        </div>
      </motion.div>
    </div>
  );
}
