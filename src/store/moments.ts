import type { Moment } from './logic';
type Fn = (m: Moment) => void;
const subs = new Set<Fn>();
export const moments = {
  on(fn: Fn) { subs.add(fn); return () => { subs.delete(fn); }; },
  emit(list: Moment[]) { for (const m of list) for (const fn of subs) fn(m); },
};
