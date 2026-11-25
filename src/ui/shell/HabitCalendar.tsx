// A month calendar for one habit, with streak stats. Lives at the top of the habit's detail panel.
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { useStore } from '../../store/store';
import { habitMonth, habitStats, type DayState } from '../../core/habitCalendar';
import { addMonths, dayKey, dayOfMonth, monthKey, monthName, WEEKDAYS } from '../../core/dates';
import type { Task } from '../../core/types';
import { Icon } from '../shapes/icons';
import { haptic } from '../motion/juice';

const LABEL: Record<DayState, string> = { done: 'Done', missed: 'Missed', off: 'Not scheduled', today: 'Today, not done yet', future: 'Coming up', before: 'Before you started this habit' };

export function HabitCalendar({ t, color }: { t: Task; color: string }) {
  const startsMonday = useStore((x) => x.s.settings.weekStartsMonday);
  const today = dayKey(new Date());
  const anchor = t.anchor ?? today;
  const thisMonth = monthKey(today), firstMonth = monthKey(anchor < today ? anchor : today);
  const [mk, setMk] = useState(thisMonth);
  const [dir, setDir] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const h = { recurrence: t.recurrence!, anchor, completions: t.completions };
  const m = useMemo(() => habitMonth(h, mk, today, startsMonday), [t.completions, t.recurrence, anchor, mk, today, startsMonday]); // eslint-disable-line react-hooks/exhaustive-deps
  const st = useMemo(() => habitStats(h, today), [t.completions, t.recurrence, anchor, today]); // eslint-disable-line react-hooks/exhaustive-deps
  const canBack = mk > firstMonth, canNext = mk < thisMonth;
  const step = (n: number) => { if ((n < 0 && !canBack) || (n > 0 && !canNext)) return; setDir(n); setMk(addMonths(mk, n)); setPicked(null); haptic('light'); };
  const heads = startsMonday ? [1, 2, 3, 4, 5, 6, 0] : [0, 1, 2, 3, 4, 5, 6];
  const pickedDay = picked ? m.days.find((d) => d.day === picked) : null;
  const sx = useRef<number | null>(null);
  const year = mk.slice(0, 4) !== thisMonth.slice(0, 4) ? ` ${mk.slice(0, 4)}` : '';
  return (
    <div className="hcal" style={{ ['--c' as string]: color }}>
      <div className="hcal-stats">
        <div><b>{st.current}</b><span>Streak</span></div>
        <div><b>{st.longest}</b><span>Best</span></div>
        <div><b>{Math.round(st.rate * 100)}%</b><span>Done</span></div>
        <div><b>{st.total}</b><span>Total</span></div>
      </div>
      <div className="hcal-head">
        <button className="icon-btn" aria-label="Previous month" disabled={!canBack} onClick={() => step(-1)}><Icon name="left" size={16} /></button>
        <span className="hcal-month">{monthName(mk)}{year}</span>
        <button className="icon-btn" aria-label="Next month" disabled={!canNext} onClick={() => step(1)}><Icon name="right" size={16} /></button>
      </div>
      <div className="hcal-grid hcal-dow">{heads.map((d) => <span key={d}>{WEEKDAYS[d].slice(0, 1)}</span>)}</div>
      <div className="hcal-clip"
        onPointerDown={(e) => { sx.current = e.clientX; }}
        onPointerUp={(e) => { if (sx.current === null) return; const dx = e.clientX - sx.current; sx.current = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }}>
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <motion.div key={mk} className="hcal-grid" custom={dir}
            initial={{ x: dir * 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir * -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}>
            {Array.from({ length: m.lead }, (_, i) => <span key={`l${i}`} />)}
            {m.days.map((d, i) => (
              <button key={d.day} className={`hcal-day ${d.state} ${picked === d.day ? 'picked' : ''}`} style={{ ['--i' as string]: i }}
                aria-label={`${d.day}: ${LABEL[d.state]}`} onClick={() => setPicked(picked === d.day ? null : d.day)}>
                {d.state === 'off' ? <i /> : dayOfMonth(d.day)}
              </button>
            ))}
            {Array.from({ length: m.trail }, (_, i) => <span key={`t${i}`} />)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hcal-note">
        {pickedDay ? <><b>{new Date(pickedDay.day + 'T12:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</b> · {LABEL[pickedDay.state]}</> : <span className="muted">Tap a day to see it</span>}
      </div>
    </div>
  );
}
