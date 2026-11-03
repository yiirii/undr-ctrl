// Deadline countdowns and "start early" nudges for tasks.
import type { FocusLogEntry, Task } from './types';
import { dayKey, diffDays } from './dates';

export interface Deadline { daysLeft: number; remaining: number; label: string; late: boolean }

/** Days left to the due date and the fraction of the window (created → due) still remaining. */
export function deadline(t: Pick<Task, 'createdAt' | 'due'>, today: string): Deadline | null {
  if (!t.due) return null;
  const daysLeft = diffDays(today, t.due);
  const start = dayKey(new Date(t.createdAt));
  const total = Math.max(1, diffDays(start, t.due));
  const remaining = Math.max(0, Math.min(1, daysLeft / total));
  const label =
    daysLeft < 0 ? `${-daysLeft} day${daysLeft === -1 ? '' : 's'} late`
      : daysLeft === 0 ? 'Due today'
        : daysLeft === 1 ? 'Tomorrow'
          : `${daysLeft} days left`;
  return { daysLeft, remaining, label, late: daysLeft < 0 };
}

export const NUDGE_DAYS = 5;

/** Big tasks due within 5 days that haven't been started (no steps done, no focus time). */
export function startNudges(tasks: Task[], focusLog: FocusLogEntry[], today: string) {
  const focused = new Set(focusLog.filter((f) => f.minutes > 0).map((f) => f.taskId));
  return tasks
    .filter((t) => t.size === 'big' && !t.habit && !t.doneAt && t.due)
    .map((t) => ({ task: t, daysLeft: diffDays(today, t.due!) }))
    .filter(({ task, daysLeft }) => daysLeft >= 1 && daysLeft <= NUDGE_DAYS && !focused.has(task.id) && !(task.steps ?? []).some((s) => s.done))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
