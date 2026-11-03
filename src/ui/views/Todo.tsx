import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { useStore, act, useProgress } from '../../store/store';
import { myDayTasks, completeTask, uncompleteTask, toggleMyDay, updateList, deleteList, addTask } from '../../store/logic';
import { taskStat } from '../../store/facts';
import { addDays, dayKey, weekStart, diffDays } from '../../core/dates';
import { isScheduled, describeRecurrence } from '../../core/recurrence';
import { STAT_META, STATS, type Stat, type Task, type Recurrence } from '../../core/types';
import { Bar, SegBar } from '../shapes/Progress';
import { Icon, LIST_ICONS } from '../shapes/icons';
import { Ambient } from '../shapes/Ambient';
import { TaskRow } from '../shell/TaskRow';
import { AddRow } from '../shell/AddRow';
import { longDate, useFmt } from '../format';
import { sfx } from '../sound/synth';

const isDone = (t: Task, today: string) => (t.habit ? t.completions.includes(today) : !!t.doneAt);

function Completed({ tasks, showList }: { tasks: Task[]; showList?: boolean }) {
  const [open, setOpen] = useState(true);
  if (!tasks.length) return null;
  return (
    <>
      <div className="section-label"><button onClick={() => setOpen(!open)}><Icon name={open ? 'down' : 'right'} size={12} stroke={2.6} />Completed · {tasks.length}</button></div>
      {open && <div className="tasks">{tasks.map((t) => <TaskRow key={t.id} task={t} showList={showList} focusable={false} />)}</div>}
    </>
  );
}

function Empty({ title, text }: { title: string; text: ReactNode }) {
  return <div className="empty"><Ambient /><h3>{title}</h3><p>{text}</p></div>;
}

export function HabitPill({ t }: { t: Task }) {
  const s = useStore((x) => x.s);
  const today = dayKey(new Date());
  const done = t.completions.includes(today);
  const stat = taskStat(s, t);
  const c = stat ? STAT_META[stat].hue : 'var(--accent)';
  return (
    <motion.button layout className={`habit-pill ${done ? 'done' : ''}`} onClick={() => { act(done ? uncompleteTask : completeTask, t.id, new Date()); done ? sfx.click() : sfx.streak(t.streak + 1); }} title={done ? 'Undo' : 'Mark done today'}>
      <span className={`diamond ${done ? 'on' : ''}`} style={{ ['--c' as string]: c }} />
      <span className="nm">{t.title}</span>
      {t.streak > 0 && <span className="st">{t.streak}</span>}
    </motion.button>
  );
}

// ---------------- My Day ----------------
export function MyDay() {
  const s = useStore((x) => x.s);
  const today = dayKey(new Date());
  const [suggest, setSuggest] = useState(false);
  const all = myDayTasks(s, new Date());
  const habits = all.filter((t) => t.habit);
  const tasks = all.filter((t) => !t.habit);
  const open = tasks.filter((t) => !t.doneAt).sort((a, b) => a.order - b.order);
  const doneTasks = tasks.filter((t) => !!t.doneAt);
  const doneCount = all.filter((t) => isDone(t, today)).length;
  const xpToday = s.ledger.filter((e) => e.lifetime && dayKey(new Date(e.at)) === today && e.amount > 0 && e.source !== 'reverse').reduce((n, e) => n + e.amount, 0);
  const suggestions = s.tasks.filter((t) => !t.habit && !t.doneAt && t.myDay !== today && ((t.due && t.due <= today) || (!t.due && t.size === 'big')));
  return (
    <div className="page">
      <div className="ph">
        <div>
          <h1>My Day</h1>
          <div className="sub">{longDate()}</div>
        </div>
        <div className="ph-actions">
          <button className={`btn ${suggest ? '' : 'ghost'}`} onClick={() => setSuggest(!suggest)}><Icon name="sparkle" size={16} />Suggestions{suggestions.length ? ` · ${suggestions.length}` : ''}</button>
        </div>
      </div>
      {all.length > 0 && (
        <div className="day-progress">
          <div className="meta"><span>{doneCount} of {all.length} done</span><span style={{ color: 'var(--xp)' }}>+{xpToday} XP today</span></div>
          <SegBar done={doneCount} total={all.length} height={10} gap={5} />
        </div>
      )}
      <AnimatePresence>
        {suggest && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div className="card flat" style={{ marginBottom: 18 }}>
              <div className="section-label" style={{ marginTop: 0 }}>Suggested for today</div>
              {suggestions.length === 0 ? <div className="muted" style={{ fontSize: '.86rem' }}>Nothing due. You're ahead.</div> : (
                <div className="tasks">
                  {suggestions.slice(0, 8).map((t) => (
                    <div key={t.id} className="row" style={{ gap: 10 }}>
                      <div className="grow"><TaskRow task={t} showList focusable={false} /></div>
                      <button className="icon-btn" title="Add to My Day" onClick={() => act(toggleMyDay, t.id, new Date())}><Icon name="plus" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {habits.length > 0 && (<><div className="section-label" style={{ marginTop: 0 }}>Habits today</div><div className="habit-strip">{habits.map((t) => <HabitPill key={t.id} t={t} />)}</div></>)}
      <div className="section-label">Tasks</div>
      <div className="tasks">
        <AddRow listId={s.lists.find((l) => l.id === 'personal')?.id ?? s.lists[0]?.id} myDay placeholder="Add a task… try “essay due fri 5pm #uni”" />
        <AnimatePresence initial={false}>{open.map((t) => <motion.div key={t.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginTop: -6 }}><TaskRow task={t} showList /></motion.div>)}</AnimatePresence>
      </div>
      {all.length === 0 && <Empty title="A calm, empty day" text={<>Add what matters today, or press <span className="kbd">Ctrl Space</span> to add anything: a task, a habit or an expense.</>} />}
      {all.length > 0 && open.length === 0 && habits.every((h) => isDone(h, today)) && <Empty title="My Day is clear" text="Everything's done. Enjoy the quiet." />}
      <Completed tasks={doneTasks} showList />
    </div>
  );
}

// ---------------- Planned ----------------
export function Planned() {
  const s = useStore((x) => x.s);
  const today = dayKey(new Date());
  const ws = weekStart(today, s.settings.weekStartsMonday);
  const we = addDays(ws, 6);
  const planned = s.tasks.filter((t) => !t.habit && t.due);
  const open = planned.filter((t) => !t.doneAt).sort((a, b) => (a.due! + (a.time ?? '')).localeCompare(b.due! + (b.time ?? '')));
  const weekTasks = planned.filter((t) => t.due! >= ws && t.due! <= we);
  const weekDone = weekTasks.filter((t) => t.doneAt).length;
  const groups: [string, Task[]][] = [
    ['Overdue', open.filter((t) => t.due! < today)],
    ['Today', open.filter((t) => t.due === today)],
    ['Tomorrow', open.filter((t) => t.due === addDays(today, 1))],
    ['This week', open.filter((t) => t.due! > addDays(today, 1) && t.due! <= we)],
    ['Later', open.filter((t) => t.due! > we && t.due! > addDays(today, 1))],
  ];
  return (
    <div className="page">
      <div className="ph"><div><h1>Planned</h1><div className="sub">Everything with a date</div></div></div>
      <div className="day-progress">
        <div className="meta"><span>This week</span><span>{weekDone} of {weekTasks.length} done</span></div>
        <Bar value={weekDone} max={Math.max(1, weekTasks.length)} height={10} />
      </div>
      <AddRow listId={s.lists[0]?.id} placeholder="Add a dated task… “lab report on 12 nov #uni”" />
      {groups.map(([label, ts]) => ts.length > 0 && (
        <div key={label}>
          <div className="section-label" style={label === 'Overdue' ? { color: 'var(--bad)' } : undefined}>{label} · {ts.length}</div>
          <div className="tasks">{ts.map((t) => <TaskRow key={t.id} task={t} showList />)}</div>
        </div>
      ))}
      {open.length === 0 && <Empty title="Nothing planned" text="Tasks with a due date show up here, grouped by when they're due." />}
    </div>
  );
}

// ---------------- List ----------------
export function ListView({ id }: { id: string }) {
  const s = useStore((x) => x.s);
  const go = useStore((x) => x.go);
  const [edit, setEdit] = useState(false);
  const list = s.lists.find((l) => l.id === id);
  if (!list) return <div className="page"><Empty title="List not found" text="It may have been deleted." /></div>;
  const today = dayKey(new Date());
  const ws = weekStart(today, s.settings.weekStartsMonday);
  const own = s.tasks.filter((t) => t.listId === id && !t.habit);
  const open = own.filter((t) => !t.doneAt).sort((a, b) => a.order - b.order);
  const done = own.filter((t) => !!t.doneAt).sort((a, b) => b.doneAt!.localeCompare(a.doneAt!));
  const doneWeek = done.filter((t) => dayKey(new Date(t.doneAt!)) >= ws).length;
  const habits = s.tasks.filter((t) => t.listId === id && t.habit);
  return (
    <div className="page">
      <div className="ph">
        <div className="row" style={{ gap: 14, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb, ${list.color} 18%, transparent)`, color: list.color, display: 'grid', placeItems: 'center' }}>
            {list.emoji ? <span style={{ fontSize: 22 }}>{list.emoji}</span> : <Icon name={list.icon} size={22} />}
          </div>
          <div>
            <h1>{list.name}</h1>
            <div className="sub">{list.stat ? <>Feeds <b style={{ color: STAT_META[list.stat].hue }}>{STAT_META[list.stat].name}</b></> : 'General XP'} · {open.length} open</div>
          </div>
        </div>
        <div className="ph-actions"><button className="btn ghost" onClick={() => setEdit(!edit)}><Icon name="sliders" size={16} />Edit list</button></div>
      </div>
      {edit && <ListEditor id={id} onDelete={() => { act(deleteList, id); go('myday'); }} />}
      <div className="day-progress">
        <div className="meta"><span>Done this week</span><span>{doneWeek} of {doneWeek + open.length}</span></div>
        <Bar value={doneWeek} max={Math.max(1, doneWeek + open.length)} height={10} color={s.appearance.useStatColours ? list.color : undefined} />
      </div>
      {habits.length > 0 && <><div className="section-label">Habits</div><div className="habit-strip">{habits.map((t) => <HabitPill key={t.id} t={t} />)}</div></>}
      <div className="tasks">
        <AddRow listId={id} placeholder={`Add to ${list.name}`} />
        <AnimatePresence initial={false}>{open.map((t) => <motion.div key={t.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}><TaskRow task={t} /></motion.div>)}</AnimatePresence>
      </div>
      {open.length === 0 && <Empty title="All clear" text={`Nothing open in ${list.name}.`} />}
      <Completed tasks={done.slice(0, 50)} />
    </div>
  );
}

const SWATCHES = ['#6ea8fe', '#ff7a6b', '#9fd36a', '#a79bff', '#f59ac6', '#ffc069', '#5fd3c4', '#b5bac1'];
function ListEditor({ id, onDelete }: { id: string; onDelete: () => void }) {
  const list = useStore((x) => x.s.lists.find((l) => l.id === id))!;
  const up = (p: Parameters<typeof updateList>[2]) => act(updateList, id, p);
  return (
    <div className="card flat stack" style={{ marginBottom: 20 }}>
      <div className="two">
        <label className="field"><span>Name</span><input className="input" value={list.name} onChange={(e) => up({ name: e.target.value })} /></label>
        <label className="field"><span>Emoji (optional)</span><input className="input" value={list.emoji ?? ''} maxLength={4} placeholder="Use an icon instead" onChange={(e) => up({ emoji: e.target.value || undefined })} /></label>
      </div>
      <div className="field"><span>Feeds stat</span>
        <div className="stat-pick">
          {STATS.map((st) => <button key={st} className={list.stat === st ? 'on' : ''} style={{ ['--c' as string]: STAT_META[st].hue }} onClick={() => up({ stat: st })}><span className="sdot" style={{ width: 8, height: 8, borderRadius: 4, background: STAT_META[st].hue }} />{STAT_META[st].name}</button>)}
          <button className={list.stat === null ? 'on' : ''} style={{ ['--c' as string]: 'var(--t2)' }} onClick={() => up({ stat: null })}>None</button>
        </div>
      </div>
      <div className="field"><span>Icon</span><div className="row" style={{ flexWrap: 'wrap', gap: 4 }}>{LIST_ICONS.map((ic) => <button key={ic} className={`icon-btn ${list.icon === ic ? 'on' : ''}`} style={list.icon === ic ? { color: list.color, background: 'var(--bg4)' } : undefined} onClick={() => up({ icon: ic, emoji: undefined })}><Icon name={ic} /></button>)}</div></div>
      <div className="field"><span>Colour</span><div className="row">{SWATCHES.map((c) => <button key={c} onClick={() => up({ color: c })} style={{ width: 26, height: 26, borderRadius: 8, background: c, boxShadow: list.color === c ? '0 0 0 2px var(--bg2), 0 0 0 4px ' + c : 'none' }} />)}</div></div>
      <div className="row"><div className="grow" /><button className="btn ghost danger" onClick={onDelete}><Icon name="trash" size={16} />Delete list</button></div>
    </div>
  );
}

// ---------------- Habits ----------------
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export function Habits() {
  const s = useStore((x) => x.s);
  const today = dayKey(new Date());
  const ws = weekStart(today, s.settings.weekStartsMonday);
  const habits = s.tasks.filter((t) => t.habit && t.recurrence);
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'daily' | 'weekdays' | 'custom'>('daily');
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [listId, setListId] = useState(s.lists.find((l) => l.stat === 'str')?.id ?? s.lists[0]?.id);
  const add = () => {
    if (!name.trim()) return;
    const recurrence: Recurrence = kind === 'daily' ? { kind: 'daily' } : kind === 'weekdays' ? { kind: 'weekdays' } : { kind: 'weekly', days };
    act(addTask, { title: name, listId, habit: true, recurrence, anchor: today }, new Date());
    setName('');
    sfx.pop();
  };
  return (
    <div className="page">
      <div className="ph"><div><h1>Habits</h1><div className="sub">Small things, every time. Streaks multiply XP up to ×2.</div></div></div>
      <div className="card flat stack" style={{ marginBottom: 22 }}>
        <form className="add-row" style={{ background: 'var(--bg0)' }} onSubmit={(e) => { e.preventDefault(); add(); }}>
          <span className="plus"><Icon name="diamond" size={18} stroke={2.2} /></span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit, like “Read 20 pages”" />
          <span className="kbd">Enter</span>
        </form>
        <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="seg-ctl">{(['daily', 'weekdays', 'custom'] as const).map((k) => <button key={k} type="button" className={kind === k ? 'on' : ''} onClick={() => setKind(k)}>{k === 'daily' ? 'Every day' : k === 'weekdays' ? 'Weekdays' : 'Pick days'}</button>)}</div>
          {kind === 'custom' && <div className="seg-ctl">{[1, 2, 3, 4, 5, 6, 0].map((d) => <button key={d} type="button" className={days.includes(d) ? 'on' : ''} onClick={() => setDays(days.includes(d) ? days.filter((x) => x !== d) : [...days, d])}>{DAY_LABELS[d]}</button>)}</div>}
          <select className="input" style={{ width: 180, height: 36 }} value={listId} onChange={(e) => setListId(e.target.value)}>{s.lists.map((l) => <option key={l.id} value={l.id}>{l.name}{l.stat ? ` · ${STAT_META[l.stat].name}` : ''}</option>)}</select>
        </div>
      </div>
      {habits.length === 0 && <Empty title="No habits yet" text="Add one above. Habits due today also appear at the top of My Day." />}
      <div className="stack">
        {habits.map((t) => <HabitCard key={t.id} t={t} ws={ws} today={today} />)}
      </div>
    </div>
  );
}

function HabitCard({ t, ws, today }: { t: Task; ws: string; today: string }) {
  const s = useStore((x) => x.s);
  const setUI = useStore((x) => x.setUI);
  const stat = taskStat(s, t);
  const c = stat ? STAT_META[stat].hue : 'var(--accent)';
  const anchor = t.anchor ?? today;
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  const sched = weekDays.filter((d) => isScheduled(t.recurrence!, anchor, d));
  const doneWeek = sched.filter((d) => t.completions.includes(d)).length;
  const hist = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const done = t.completions.includes(today);
  const dueToday = isScheduled(t.recurrence!, anchor, today);
  const best = t.completions.length;
  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 220px', gap: 18, alignItems: 'center', cursor: 'pointer' }} onClick={() => setUI({ detailId: t.id })}>
      <button className={`diamond ${done ? 'on' : ''}`} style={{ ['--c' as string]: c, width: 34, height: 34, opacity: dueToday || done ? 1 : 0.4 }} title={done ? 'Undo today' : 'Done today'}
        onClick={(e) => { e.stopPropagation(); act(done ? uncompleteTask : completeTask, t.id, new Date()); done ? sfx.click() : sfx.streak(t.streak + 1); }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{t.title}</div>
        <div className="row" style={{ gap: 8, marginTop: 6 }}>
          <span className="chip"><Icon name="repeat" size={12} stroke={2.2} />{describeRecurrence(t.recurrence!)}</span>
          {stat && <span className="chip"><span className="sdot" style={{ background: c }} />{STAT_META[stat].name}</span>}
          <span className="chip" style={{ color: t.streak ? 'var(--xp)' : undefined }}>Streak {t.streak}</span>
          <span className="chip">{best} total</span>
        </div>
        <div className="diamonds" style={{ marginTop: 10, gap: 5 }}>
          {hist.map((d) => {
            const sc = isScheduled(t.recurrence!, anchor, d);
            const on = t.completions.includes(d);
            return <span key={d} title={d} className={`d ${on ? 'on' : sc ? '' : 'off'}`} style={{ ['--c' as string]: c, outline: !sc && !on ? '1.5px solid var(--bg4)' : undefined, outlineOffset: -1.5 }} />;
          })}
        </div>
      </div>
      <div>
        <Bar value={doneWeek} max={Math.max(1, sched.length)} color={c} height={8} showNumbers label="This week" />
      </div>
    </div>
  );
}

export { diffDays, STATS };
export type { Stat };
