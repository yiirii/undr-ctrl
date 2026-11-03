import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore, act } from '../../store/store';
import { updateTask, deleteTask, toggleMyDay, focusStart, addStep, toggleStep, renameStep, deleteStep } from '../../store/logic';
import { taskStat } from '../../store/facts';
import { CheckCircle } from './TaskRow';
import { sfx } from '../sound/synth';
import { STAT_META, STATS, type Recurrence, type Size, type Task } from '../../core/types';
import { SIZE_XP } from '../../core/rules';
import { dayKey } from '../../core/dates';
import { Icon } from '../shapes/icons';
import { SPRING, Bar } from '../shapes/Progress';

function recKind(r?: Recurrence) { return r ? r.kind : 'none'; }

export function TaskDetail({ id }: { id: string }) {
  const s = useStore((x) => x.s);
  const setUI = useStore((x) => x.setUI);
  const go = useStore((x) => x.go);
  const t = s.tasks.find((x) => x.id === id);
  if (!t) return null;
  const today = dayKey(new Date());
  const up = (p: Partial<Task>) => act(updateTask, id, p);
  const list = s.lists.find((l) => l.id === t.listId);
  const inherited = list?.stat ?? null;
  const effective = t.stat !== undefined ? t.stat : inherited;
  const setRec = (k: string) => {
    if (k === 'none') return up({ recurrence: undefined, habit: false });
    const r: Recurrence = k === 'daily' ? { kind: 'daily' } : k === 'weekdays' ? { kind: 'weekdays' } : k === 'weekly' ? { kind: 'weekly', days: [new Date().getDay()] } : k === 'everyN' ? { kind: 'everyN', n: 2 } : { kind: 'monthly', day: Number((t.due ?? today).slice(8, 10)) };
    up({ recurrence: r, anchor: t.anchor ?? t.due ?? today });
  };
  return (
    <motion.aside className="detail" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={SPRING} key={id}>
      <div className="row">
        <span className="chip"><span className="sdot" style={{ background: list?.color }} />{list?.name}</span>
        <div className="grow" />
        <button className="icon-btn" title="Close (Esc)" onClick={() => setUI({ detailId: null })}><Icon name="x" /></button>
      </div>
      <input className="detail-title" value={t.title} onChange={(e) => up({ title: e.target.value })} />
      {!t.habit && <Steps task={t} color={(() => { const st = taskStat(s, t); return st && s.appearance.useStatColours ? STAT_META[st].hue : 'var(--accent)'; })()} />}

      {!t.habit && (
        <button className="opt" onClick={() => act(toggleMyDay, id, new Date())} style={{ color: t.myDay === today ? 'var(--accent)' : undefined }}>
          <Icon name="sun" /><span className="grow" style={{ textAlign: 'left' }}>{t.myDay === today ? 'In My Day' : 'Add to My Day'}</span>
        </button>
      )}
      {!t.doneAt && (
        <button className="opt" onClick={() => { act(focusStart, id, s.focusSettings.focusMin, Date.now()); go('focus'); }}>
          <Icon name="target" /><span className="grow" style={{ textAlign: 'left' }}>Focus on this · {s.focusSettings.focusMin} min</span>
        </button>
      )}

      <div className="field"><span>Size · sets XP</span>
        <div className="size-pick">
          {(['quick', 'normal', 'big'] as Size[]).map((z) => <button key={z} className={t.size === z ? 'on' : ''} onClick={() => up({ size: z })}>{z[0].toUpperCase() + z.slice(1)}<b>+{SIZE_XP[z]} XP</b></button>)}
        </div>
      </div>

      <div className="field"><span>List</span>
        <div className="opt"><Icon name="list" /><select value={t.listId} onChange={(e) => up({ listId: e.target.value })}>{s.lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
      </div>

      <div className="field"><span>Stat {t.stat === undefined ? '· from list' : ''}</span>
        <div className="stat-pick">
          <button className={t.stat === undefined ? 'on' : ''} style={{ ['--c' as string]: 'var(--t2)' }} onClick={() => { const { stat: _drop, ...rest } = t; void _drop; act(updateTask, id, { ...rest, stat: undefined }); }}>From list{inherited ? ` (${STAT_META[inherited].name})` : ''}</button>
          {STATS.map((st) => <button key={st} className={t.stat === st ? 'on' : ''} style={{ ['--c' as string]: STAT_META[st].hue }} onClick={() => up({ stat: st })}><span style={{ width: 8, height: 8, borderRadius: 4, background: STAT_META[st].hue }} />{STAT_META[st].name}</button>)}
        </div>
        {!effective && <div className="muted" style={{ fontSize: '.78rem' }}>Gives general XP only.</div>}
      </div>

      <div className="field"><span>Due</span>
        <div className="opt"><Icon name="calendar" /><input type="date" value={t.due ?? ''} onChange={(e) => up({ due: e.target.value || undefined })} />{t.due && <button className="icon-btn" onClick={() => up({ due: undefined })}><Icon name="x" size={14} /></button>}</div>
        <div className="opt"><Icon name="clock" /><input type="time" value={t.time ?? ''} onChange={(e) => up({ time: e.target.value || undefined, remind: !!e.target.value })} />{t.time && <button className="icon-btn" onClick={() => up({ time: undefined, remind: false })}><Icon name="x" size={14} /></button>}</div>
        {t.time && t.due && (
          <button className="opt" onClick={() => up({ remind: !t.remind })}><Icon name="bell" /><span className="grow" style={{ textAlign: 'left' }}>Remind me</span><span className={`toggle ${t.remind ? 'on' : ''}`} /></button>
        )}
      </div>

      <div className="field"><span>Repeat</span>
        <div className="opt"><Icon name="repeat" />
          <select value={recKind(t.recurrence)} onChange={(e) => setRec(e.target.value)}>
            <option value="none">Doesn't repeat</option><option value="daily">Every day</option><option value="weekdays">Weekdays</option><option value="weekly">Weekly on…</option><option value="everyN">Every N days</option><option value="monthly">Monthly</option>
          </select>
        </div>
        {t.recurrence?.kind === 'weekly' && (
          <div className="seg-ctl">{[1, 2, 3, 4, 5, 6, 0].map((d) => { const days = (t.recurrence as { days: number[] }).days; const on = days.includes(d); return <button key={d} className={on ? 'on' : ''} onClick={() => up({ recurrence: { kind: 'weekly', days: on ? days.filter((x) => x !== d) : [...days, d] } })}>{'SMTWTFS'[d]}</button>; })}</div>
        )}
        {t.recurrence?.kind === 'everyN' && <div className="opt"><span className="muted">Every</span><input type="number" min={2} max={60} value={t.recurrence.n} onChange={(e) => up({ recurrence: { kind: 'everyN', n: Math.max(2, Number(e.target.value) || 2) } })} /><span className="muted">days</span></div>}
        {t.recurrence?.kind === 'monthly' && <div className="opt"><span className="muted">On day</span><input type="number" min={1} max={31} value={t.recurrence.day} onChange={(e) => up({ recurrence: { kind: 'monthly', day: Math.min(31, Math.max(1, Number(e.target.value) || 1)) } })} /></div>}
        {t.recurrence && t.recurrence.kind !== 'monthly' && (
          <button className="opt" onClick={() => up({ habit: !t.habit })}><Icon name="diamond" /><span className="grow" style={{ textAlign: 'left' }}>Track as a habit (streaks)</span><span className={`toggle ${t.habit ? 'on' : ''}`} /></button>
        )}
      </div>

      <div className="field"><span>Notes</span><textarea className="input" value={t.notes} placeholder="Add a note" onChange={(e) => up({ notes: e.target.value })} /></div>

      <div className="grow" />
      <div className="row">
        <span className="muted" style={{ fontSize: '.74rem' }}>Created {new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
        <div className="grow" />
        <button className="btn ghost danger sm" onClick={() => { act(deleteTask, id); setUI({ detailId: null }); }}><Icon name="trash" size={15} />Delete</button>
      </div>
    </motion.aside>
  );
}

function Steps({ task, color }: { task: Task; color: string }) {
  const [draft, setDraft] = useState('');
  const steps = task.steps ?? [];
  const done = steps.filter((x) => x.done).length;
  const add = () => { if (draft.trim()) { act(addStep, task.id, draft); setDraft(''); } };
  return (
    <div className="steps">
      {steps.length > 0 && <Bar value={done} max={steps.length} color={color} height={4} />}
      <Reorder.Group axis="y" values={steps.map((x) => x.id)} onReorder={(ids: string[]) => act(updateTask, task.id, { steps: ids.map((id) => steps.find((x) => x.id === id)!).filter(Boolean) })} className="steps-list">
        <AnimatePresence initial={false}>
          {steps.map((st) => (
            <Reorder.Item key={st.id} value={st.id} className={`step ${st.done ? 'done' : ''}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <CheckCircle done={st.done} color={color} size={18} onToggle={() => { act(toggleStep, task.id, st.id, new Date()); if (!st.done) sfx.tink(); }} />
              <input className="step-input" defaultValue={st.title} onBlur={(e) => e.target.value.trim() && e.target.value !== st.title && act(renameStep, task.id, st.id, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
              <button className="icon-btn step-x" title="Remove step" onClick={() => act(deleteStep, task.id, st.id, new Date())}><Icon name="x" size={13} /></button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <div className="step add"><Icon name="plus" size={16} /><input className="step-input" placeholder="Add a step" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} onBlur={add} /></div>
    </div>
  );
}
