// Local-date helpers on 'YYYY-MM-DD' keys (computed via UTC math so DST never shifts a day).
const pad = (n: number) => String(n).padStart(2, '0');
export const dayKey = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toUTC = (k: string) => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const fromUTC = (t: number) => { const d = new Date(t); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`; };
export const addDays = (k: string, n: number): string => fromUTC(toUTC(k) + n * 86400000);
export const diffDays = (a: string, b: string): number => Math.round((toUTC(b) - toUTC(a)) / 86400000);
export const weekday = (k: string): number => new Date(toUTC(k)).getUTCDay();
export const monthKey = (k: string): string => k.slice(0, 7);
export const daysInMonth = (k: string): number => { const [y, m] = k.split('-').map(Number); return new Date(Date.UTC(y, m, 0)).getUTCDate(); };
export const dayOfMonth = (k: string): number => Number(k.slice(8, 10));
export const monthStart = (mk: string): string => `${mk.slice(0, 7)}-01`;
export const monthEnd = (mk: string): string => `${mk.slice(0, 7)}-${pad(daysInMonth(`${mk.slice(0, 7)}-01`))}`;
export const addMonths = (mk: string, n: number): string => { const [y, m] = mk.split('-').map(Number); const t = new Date(Date.UTC(y, m - 1 + n, 1)); return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}`; };
export const weekStart = (k: string, startsMonday = true): string => { const wd = weekday(k); const back = startsMonday ? (wd + 6) % 7 : wd; return addDays(k, -back); };
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthName = (mk: string) => MONTHS[Number(mk.slice(5, 7)) - 1];
