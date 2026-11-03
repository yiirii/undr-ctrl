export interface FocusState { taskId: string; phase: 'focus' | 'break'; startedAt: number; durationMs: number; pausedAt?: number; pausedTotal: number }

export const start = (taskId: string, mins: number, now: number, phase: 'focus' | 'break' = 'focus'): FocusState => ({ taskId, phase, startedAt: now, durationMs: mins * 60000, pausedTotal: 0 });
export const pause = (s: FocusState, now: number): FocusState => (s.pausedAt !== undefined ? s : { ...s, pausedAt: now });
export const resume = (s: FocusState, now: number): FocusState => (s.pausedAt === undefined ? s : { ...s, pausedTotal: s.pausedTotal + (now - s.pausedAt), pausedAt: undefined });
export const addFive = (s: FocusState): FocusState => ({ ...s, durationMs: s.durationMs + 300000 });
export const elapsed = (s: FocusState, now: number) => Math.max(0, (s.pausedAt ?? now) - s.startedAt - s.pausedTotal);
export const remaining = (s: FocusState, now: number) => Math.max(0, s.durationMs - elapsed(s, now));
export function finish(s: FocusState, now: number): { completed: boolean; minutes: number } {
  const e = Math.min(elapsed(s, now), s.durationMs);
  return { completed: e >= s.durationMs * 0.8 - 1, minutes: Math.round(e / 60000) };
}
