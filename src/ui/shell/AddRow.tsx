import { useMemo, useState } from 'react';
import { useStore, act } from '../../store/store';
import { parseQuick, type Candidate } from '../../core/parser';
import { addTask, logMoney } from '../../store/logic';
import { dayKey } from '../../core/dates';
import { Icon } from '../shapes/icons';
import { useFmt } from '../format';
import { describeRecurrence } from '../../core/recurrence';
import { sfx } from '../sound/synth';

export function CandidateChips({ c }: { c: Candidate }) {
  const s = useStore((x) => x.s);
  const fmt = useFmt();
  if (c.kind === 'out') {
    const cat = s.money.categories.find((x) => x.id === c.categoryId);
    const w = c.wallet ?? s.settings.lastWallet ?? 'cash';
    return <><span className="chip warn"><Icon name="wallet" size={12} stroke={2.2} />Money out</span><span className={`chip ${w === 'tng' ? 'tng-chip' : ''}`}>{w === 'tng' ? 'TnG' : 'Cash'}</span><span className="chip">{fmt.rm(c.sen)}</span><span className="chip"><span className="sdot" style={{ background: cat?.color }} />{cat?.name}</span>{c.note && <span className="chip">“{c.note}”</span>}</>;
  }
  if (c.kind === 'in') {
    const src = s.money.sources.find((x) => x.id === c.sourceId);
    const w = c.wallet ?? s.settings.lastWallet ?? 'cash';
    return <><span className="chip ok"><Icon name="wallet" size={12} stroke={2.2} />Money in</span><span className={`chip ${w === 'tng' ? 'tng-chip' : ''}`}>{w === 'tng' ? 'To TnG' : 'Cash'}</span><span className="chip">+{fmt.rm(c.sen)}</span><span className="chip">{src?.name}</span></>;
  }
  const list = s.lists.find((l) => l.id === c.listId);
  return (
    <>
      <span className="chip"><Icon name={c.habit ? 'diamond' : 'check'} size={12} stroke={2.2} />{c.habit ? 'Habit' : 'Task'}</span>
      {list && <span className="chip"><span className="sdot" style={{ background: list.color }} />{list.name}</span>}
      {c.due && <span className="chip"><Icon name="calendar" size={12} stroke={2.2} />{fmt.day(c.due)}</span>}
      {c.time && <span className="chip"><Icon name="clock" size={12} stroke={2.2} />{fmt.time(c.time)}</span>}
      {c.recurrence && <span className="chip"><Icon name="repeat" size={12} stroke={2.2} />{describeRecurrence(c.recurrence)}</span>}
      {c.size && c.size !== 'normal' && <span className="chip">{c.size === 'big' ? 'Big' : 'Quick'}</span>}
    </>
  );
}

export function commitCandidate(c: Candidate, defaults: { listId: string; myDay?: boolean }) {
  const now = new Date();
  if (c.kind === 'task') {
    act(addTask, { title: c.title, listId: c.listId ?? defaults.listId, due: c.due, time: c.time, size: c.size, recurrence: c.recurrence, habit: c.habit, myDay: defaults.myDay && !c.habit }, now);
  } else {
    // money: the wallet you named ("tng" / "cash"), otherwise the one you used last
    const st = useStore.getState();
    const wallet = c.wallet ?? st.s.settings.lastWallet ?? 'cash';
    if (c.wallet) st.setSettings({ lastWallet: c.wallet });
    if (c.kind === 'out') act(logMoney, { kind: 'out', sen: c.sen, categoryId: c.categoryId, note: c.note, date: dayKey(now), wallet }, now);
    else act(logMoney, { kind: 'in', sen: c.sen, sourceId: c.sourceId, note: c.note, date: dayKey(now), wallet }, now);
  }
  sfx.pop();
}

export function AddRow({ listId, myDay, placeholder = 'Add a task' }: { listId: string; myDay?: boolean; placeholder?: string }) {
  const s = useStore((x) => x.s);
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const cands = useMemo(() => parseQuick(text, { lists: s.lists, categories: s.money.categories, sources: s.money.sources, today: dayKey(new Date()) }), [text, s.lists, s.money.categories, s.money.sources]);
  const c = cands[Math.min(idx, cands.length - 1)];
  const interesting = c && (c.kind !== 'task' || c.due || c.time || c.recurrence || c.listId || (c.size && c.size !== 'normal'));
  return (
    <div>
      <form className="add-row" onSubmit={(e) => { e.preventDefault(); if (!c) return; commitCandidate(c, { listId, myDay }); setText(''); setIdx(0); }}>
        <span className="plus"><Icon name="plus" size={20} stroke={2.4} /></span>
        <input value={text} onChange={(e) => { setText(e.target.value); setIdx(0); }} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Tab' && cands.length > 1) { e.preventDefault(); setIdx((i) => (i + 1) % cands.length); } }} />
        {text && cands.length > 1 && <span className="kbd">Tab</span>}
        {text && <span className="kbd">Enter</span>}
      </form>
      {text && interesting && <div className="parse-preview"><CandidateChips c={c} /></div>}
    </div>
  );
}
