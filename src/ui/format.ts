import { useStore } from '../store/store';
import { formatRM } from '../core/money';
import { addDays, dayKey, diffDays, MONTHS, WEEKDAYS } from '../core/dates';

export function fmtDay(k: string, today = dayKey(new Date()), style: 'short' | 'dmy' | 'iso' = 'short'): string {
  const d = diffDays(today, k);
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  if (d === -1) return 'Yesterday';
  const [y, m, dd] = k.split('-').map(Number);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()];
  if (style === 'iso') return k;
  if (style === 'dmy') return `${String(dd).padStart(2, '0')}/${String(m).padStart(2, '0')}${y !== Number(today.slice(0, 4)) ? `/${y}` : ''}`;
  if (d > 1 && d < 7) return wd;
  return `${wd} ${dd} ${MONTHS[m - 1].slice(0, 3)}${y !== Number(today.slice(0, 4)) ? ` ${y}` : ''}`;
}
export function fmtTime(t: string, h24: boolean): string {
  if (h24) return t;
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`;
}
export function useFmt() {
  const compact = useStore((s) => s.s.appearance.compactRM);
  const settings = useStore((s) => s.s.settings);
  return {
    rm: (sen: number) => formatRM(sen, compact),
    day: (k: string) => fmtDay(k, dayKey(new Date()), settings.dateFormat),
    time: (t: string) => fmtTime(t, settings.time24),
  };
}
export const longDate = (d = new Date()) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
export { addDays };
