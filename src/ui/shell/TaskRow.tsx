import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { haptic, ripple, sparks, centerOf, flyTo, reducedMotion } from '../motion/juice';
import { cssVar } from '../motion/particles';
import { useIsPhone } from './PhoneNav';

const SWIPE = 84; // px to the right that ticks a task off on the phone
/** The XP bar that's on screen now (sidebar on the laptop, top strip on the phone). */
export const xpTarget = () => Array.from(document.querySelectorAll('.xp-target .pbar-track')).find((e) => (e as HTMLElement).offsetParent !== null) ?? null;
/** CSS colour (may be a var()) → a concrete colour for canvas and inline effects. */
export const resolveColor = (c: string) => { const m = /^var\((--[\w-]+)\)$/.exec(c.trim()); return m ? cssVar(m[1]) || '#fff' : c; };
import type { Task } from '../../core/types';
import { STAT_META } from '../../core/types';
import { useStore, act, actUndoable } from '../../store/store';
import { completeTask, uncompleteTask, focusStart } from '../../store/logic';
import { taskStat } from '../../store/facts';
import { taskXp } from '../../core/rules';
import { dayKey } from '../../core/dates';
import { describeRecurrence } from '../../core/recurrence';
import { Icon } from '../shapes/icons';
import { useFmt } from '../format';
import { sfx } from '../sound/synth';
import { SPRING, Ring } from '../shapes/Progress';
import { deadline } from '../../core/deadline';

const CHECK_POP = { type: 'spring' as const, stiffness: 520, damping: 17, mass: 0.7 };
export function CheckCircle({ done, color, onToggle, size = 22 }: { done: boolean; color: string; onToggle: (el: HTMLElement) => void; size?: number }) {
  return (
    <button className="check" style={{ width: size, height: size, borderColor: done ? color : undefined }} onClick={(e) => { e.stopPropagation(); onToggle(e.currentTarget); }} aria-label={done ? 'Mark not done' : 'Complete'}>
      <motion.span className="fill" style={{ background: color }} initial={false} animate={{ scale: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={done ? CHECK_POP : SPRING} />
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12">
        <motion.path d="M2 6.5l2.6 2.6L10 3.4" fill="none" stroke="var(--bg0)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
          initial={false} animate={{ pathLength: done ? 1 : 0 }} transition={{ duration: 0.26, delay: done ? 0.1 : 0, ease: [0.65, 0, 0.35, 1] }} />
      </svg>
    </button>
  );
}

export function TaskRow({ task, showList = false, focusable = true }: { task: Task; showList?: boolean; focusable?: boolean }) {
  const s = useStore((x) => x.s);
  const selected = useStore((x) => x.ui.detailId === task.id);
  const setUI = useStore((x) => x.setUI);
  const go = useStore((x) => x.go);
  const fmt = useFmt();
  // A tick plays out in place (check pops, strike-through draws, row flashes) before the task moves to Completed.
  const [pending, setPending] = useState(false);
  const [flash, setFlash] = useState(false);
  const dragged = useRef(false);
  const swipeArmed = useRef(false);
  const x = useMotionValue(0);
  const hintOpacity = useTransform(x, [8, SWIPE], [0, 1]);
  const hintScale = useTransform(x, [0, SWIPE, SWIPE * 1.6], [0.5, 1, 1.15]);
  const phone = useIsPhone();
  const today = dayKey(new Date());
  const list = s.lists.find((l) => l.id === task.listId);
  const stat = taskStat(s, task);
  const color = stat && s.appearance.useStatColours ? STAT_META[stat].hue : 'var(--accent)';
  const done = pending || (task.habit ? task.completions.includes(today) : !!task.doneAt);
  const overdue = !done && task.due && task.due < today;
  const preview = taskXp(task.size, { onTime: !!task.due && today <= task.due, streak: task.habit ? task.streak + 1 : 0 });
  const focusMin = s.focusLog.filter((f) => f.taskId === task.id).reduce((n, f) => n + f.minutes, 0);
  const dl = !done && !task.habit ? deadline(task, today) : null;
  const steps = task.steps ?? [];
  const stepsDone = steps.filter((x) => x.done).length;
  const drain = dl && !dl.late && task.size !== 'quick' && !task.recurrence;

  const toggle = (el?: HTMLElement | null) => {
    if (pending) return;
    if (done) { actUndoable(`Unticked “${task.title}”`, uncompleteTask, task.id, new Date()); sfx.click(); haptic('light'); return; }
    sfx.check();
    haptic('success');
    const at = el ? centerOf(el) : null;
    if (at) {
      const c = resolveColor(color);
      ripple(at.x, at.y, c, 58);
      sparks(at.x, at.y, [c, cssVar('--xp'), cssVar('--t1')], 12);
    }
    setPending(true); setFlash(true);
    const commit = () => {
      const before = useStore.getState().s.ledger.length;
      actUndoable(`Ticked off “${task.title}”`, completeTask, task.id, new Date());
      const added = useStore.getState().s.ledger.slice(before).find((e) => e.source === 'task' || e.source === 'habit');
      if (added && at) flyTo(at, xpTarget(), `+${added.amount} XP`);
      setPending(false);
    };
    if (reducedMotion()) commit(); else setTimeout(commit, 420);
    setTimeout(() => setFlash(false), 800);
  };

  return (
    <motion.div layout="position" transition={SPRING} className={`task ${done ? 'done' : ''} ${pending ? 'striking' : ''} ${flash ? 'just-done' : ''} ${selected ? 'sel' : ''}`} style={{ ['--c' as string]: color, x }}
      onClick={() => { if (dragged.current) return; setUI({ detailId: task.id }); }}
      // iPhone: swipe a task to the right to tick it off
      drag={phone && !pending ? 'x' : false} dragDirectionLock dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.04, right: 0.55 }} dragSnapToOrigin
      onDragStart={() => { dragged.current = true; }}
      onDrag={(_, i) => { const over = i.offset.x > SWIPE; if (over !== swipeArmed.current) { swipeArmed.current = over; if (over) haptic('light'); } }}
      onDragEnd={(e, i) => { const go = i.offset.x > SWIPE; swipeArmed.current = false; setTimeout(() => { dragged.current = false; }, 50); if (go) toggle((e.currentTarget as HTMLElement | null)?.querySelector?.('.check') as HTMLElement ?? document.querySelector(`[data-task="${task.id}"] .check`)); }}
      data-task={task.id}>
      {phone && !done && <motion.span className="swipe-hint" style={{ opacity: hintOpacity, scale: hintScale }}><Icon name="check" size={18} stroke={2.8} /></motion.span>}
      <CheckCircle done={done} color={color} onToggle={toggle} />
      <div className="task-main">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {showList && list && <span className="chip"><span className="sdot" style={{ background: list.color }} />{list.name}</span>}
          {task.due && <span className={`chip ${overdue ? 'bad' : dl && dl.daysLeft <= 1 ? 'warn' : ''}`}><Icon name="calendar" size={12} stroke={2.2} />{overdue ? `${dl?.label ?? 'Overdue'} · ${fmt.day(task.due)}` : dl && dl.daysLeft <= 1 ? dl.label : fmt.day(task.due)}{task.time ? ` ${fmt.time(task.time)}` : ''}{dl && dl.daysLeft >= 2 ? <span className="dl-left"> · {dl.label}</span> : null}</span>}
          {steps.length > 0 && <span className="chip steps-chip"><Ring value={stepsDone} max={steps.length} size={13} stroke={2.5} color={color} />{stepsDone}/{steps.length}</span>}
          {!task.due && task.time && <span className="chip"><Icon name="clock" size={12} stroke={2.2} />{fmt.time(task.time)}</span>}
          {task.recurrence && <span className="chip"><Icon name="repeat" size={12} stroke={2.2} />{describeRecurrence(task.recurrence)}</span>}
          {task.habit && task.streak > 0 && <span className="chip"><span className="diamonds"><span className="d on" style={{ ['--c' as string]: color }} /></span>{task.streak}</span>}
          {task.size !== 'normal' && <span className="chip">{task.size === 'big' ? 'Big' : 'Quick'}</span>}
          {focusMin > 0 && <span className="chip"><Icon name="target" size={12} stroke={2.2} />{focusMin}m</span>}
          {task.notes && <span className="chip"><Icon name="list" size={12} stroke={2.2} /></span>}
        </div>
        {drain && (
          <div className="dl-bar" title={`${dl!.label}: the bar empties as the due date gets closer`}>
            <motion.div style={{ background: dl!.remaining < 0.25 ? 'var(--warn)' : color }} initial={false} animate={{ width: `${Math.max(3, dl!.remaining * 100)}%` }} transition={SPRING} />
          </div>
        )}
      </div>
      <div className="task-right">
        {!done && <span className="xp-tag">+{preview} XP</span>}
        {focusable && !done && (
          <button className="icon-btn focus-btn" title="Focus on this (F)" onClick={(e) => { e.stopPropagation(); act(focusStart, task.id, s.focusSettings.focusMin, Date.now()); go('focus'); }}>
            <Icon name="target" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
