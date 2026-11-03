import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Task } from '../../core/types';
import { STAT_META } from '../../core/types';
import { useStore, act } from '../../store/store';
import { completeTask, uncompleteTask, focusStart } from '../../store/logic';
import { taskStat } from '../../store/facts';
import { taskXp } from '../../core/rules';
import { dayKey } from '../../core/dates';
import { describeRecurrence } from '../../core/recurrence';
import { Icon } from '../shapes/icons';
import { useFmt } from '../format';
import { sfx } from '../sound/synth';
import { SPRING } from '../shapes/Progress';

export function CheckCircle({ done, color, onToggle, size = 22 }: { done: boolean; color: string; onToggle: () => void; size?: number }) {
  return (
    <button className="check" style={{ width: size, height: size, borderColor: done ? color : undefined }} onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-label={done ? 'Mark not done' : 'Complete'}>
      <motion.span className="fill" style={{ background: color }} initial={false} animate={{ scale: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={SPRING} />
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12">
        <motion.path d="M2 6.5l2.6 2.6L10 3.4" fill="none" stroke="var(--bg0)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
          initial={false} animate={{ pathLength: done ? 1 : 0 }} transition={{ duration: 0.28, delay: done ? 0.08 : 0 }} />
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
  const [float, setFloat] = useState<number | null>(null);
  const today = dayKey(new Date());
  const list = s.lists.find((l) => l.id === task.listId);
  const stat = taskStat(s, task);
  const color = stat && s.appearance.useStatColours ? STAT_META[stat].hue : 'var(--accent)';
  const done = task.habit ? task.completions.includes(today) : !!task.doneAt;
  const overdue = !done && task.due && task.due < today;
  const preview = taskXp(task.size, { onTime: !!task.due && today <= task.due, streak: task.habit ? task.streak + 1 : 0 });
  const focusMin = s.focusLog.filter((f) => f.taskId === task.id).reduce((n, f) => n + f.minutes, 0);

  const toggle = () => {
    if (done) { act(uncompleteTask, task.id, new Date()); sfx.click(); return; }
    const before = useStore.getState().s.ledger.length;
    act(completeTask, task.id, new Date());
    const added = useStore.getState().s.ledger.slice(before).find((e) => e.source === 'task' || e.source === 'habit');
    if (added) { setFloat(added.amount); setTimeout(() => setFloat(null), 1100); }
    sfx.check();
  };

  return (
    <motion.div layout="position" transition={SPRING} className={`task ${done ? 'done' : ''} ${selected ? 'sel' : ''}`} onClick={() => setUI({ detailId: task.id })}>
      <CheckCircle done={done} color={color} onToggle={toggle} />
      <AnimatePresence>
        {float !== null && (
          <motion.span className="xp-float" initial={{ opacity: 0, y: 6, scale: 0.8 }} animate={{ opacity: 1, y: -16, scale: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>+{float}</motion.span>
        )}
      </AnimatePresence>
      <div className="task-main">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {showList && list && <span className="chip"><span className="sdot" style={{ background: list.color }} />{list.name}</span>}
          {task.due && <span className={`chip ${overdue ? 'bad' : ''}`}><Icon name="calendar" size={12} stroke={2.2} />{overdue ? `Overdue · ${fmt.day(task.due)}` : fmt.day(task.due)}{task.time ? ` ${fmt.time(task.time)}` : ''}</span>}
          {!task.due && task.time && <span className="chip"><Icon name="clock" size={12} stroke={2.2} />{fmt.time(task.time)}</span>}
          {task.recurrence && <span className="chip"><Icon name="repeat" size={12} stroke={2.2} />{describeRecurrence(task.recurrence)}</span>}
          {task.habit && task.streak > 0 && <span className="chip"><span className="diamonds"><span className="d on" style={{ ['--c' as string]: color }} /></span>{task.streak}</span>}
          {task.size !== 'normal' && <span className="chip">{task.size === 'big' ? 'Big' : 'Quick'}</span>}
          {focusMin > 0 && <span className="chip"><Icon name="target" size={12} stroke={2.2} />{focusMin}m</span>}
          {task.notes && <span className="chip"><Icon name="list" size={12} stroke={2.2} /></span>}
        </div>
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
