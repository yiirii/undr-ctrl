import type { Category, IncomeSource, List, Recurrence, Size } from './types';
import { parseAmount } from './money';
import { addDays, weekday, weekStart } from './dates';

export interface ParseCtx { lists: List[]; categories: Category[]; sources: IncomeSource[]; today: string }
export type Candidate =
  | { kind: 'task'; title: string; listId?: string; due?: string; time?: string; size?: Size; recurrence?: Recurrence; habit?: boolean }
  | { kind: 'out'; sen: number; categoryId: string; note: string }
  | { kind: 'in'; sen: number; sourceId: string; note: string };

const WD: Record<string, number> = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };
const MON: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };

export const CATEGORY_ALIASES: Record<string, string[]> = {
  food: ['food', 'lunch', 'dinner', 'breakfast', 'brunch', 'makan', 'coffee', 'kopi', 'tea', 'boba', 'snack', 'snacks', 'groceries', 'grocery', 'mamak', 'nasi', 'meal', 'foodpanda', 'grabfood', 'drinks'],
  transport: ['transport', 'grab', 'lrt', 'mrt', 'bus', 'petrol', 'fuel', 'parking', 'toll', 'taxi', 'train', 'ktm', 'touchngo', 'fare'],
  shopping: ['shopping', 'shopee', 'lazada', 'clothes', 'shoes', 'uniqlo', 'mall'],
  bills: ['bills', 'bill', 'electricity', 'water', 'phone', 'internet', 'wifi', 'rent', 'unifi', 'postpaid', 'prepaid', 'topup', 'reload'],
  fun: ['fun', 'movie', 'movies', 'cinema', 'game', 'games', 'karaoke', 'concert', 'outing', 'trip'],
  health: ['health', 'panadol', 'clinic', 'doctor', 'medicine', 'pharmacy', 'gym', 'vitamins', 'dentist'],
  books: ['books', 'book', 'textbook', 'stationery', 'printing', 'print', 'uni', 'tuition', 'fees', 'course'],
  gifts: ['gifts', 'gift', 'present', 'birthday', 'donation', 'duit raya'],
  subs: ['subs', 'subscription', 'subscriptions', 'spotify', 'netflix', 'youtube', 'icloud', 'disney', 'chatgpt', 'apple'],
  other: ['other', 'misc'],
};
const SOURCE_ALIASES: Record<string, string[]> = {
  parttime: ['salary', 'gaji', 'parttime', 'part-time', 'shift', 'job', 'work', 'wage', 'pay', 'freelance'],
  allowance: ['allowance', 'elaun', 'parents', 'mum', 'mom', 'dad', 'family', 'pocket'],
  ptptn: ['ptptn', 'scholarship', 'jpa', 'mara', 'biasiswa', 'loan', 'yayasan'],
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function matchList(tag: string, lists: List[]): List | undefined {
  const t = norm(tag);
  return lists.find((l) => norm(l.name) === t) ?? lists.find((l) => norm(l.name).startsWith(t) && t.length >= 2);
}

function matchCategory(word: string, cats: Category[]): { cat: Category; explicit: boolean } | undefined {
  const w = norm(word);
  if (!w) return;
  const byName = cats.find((c) => norm(c.name) === w || norm(c.name).split(/(?=[A-Z])/)[0] === w);
  if (byName) return { cat: byName, explicit: true };
  for (const c of cats) {
    const aliases = CATEGORY_ALIASES[c.id] ?? [];
    if (aliases.some((a) => norm(a) === w)) return { cat: c, explicit: CATEGORY_ALIASES[c.id][0] === w };
  }
}

function parseTime(tok: string): string | undefined {
  let m = /^(\d{1,2})(?:[:.](\d{2}))?(am|pm)$/.exec(tok);
  if (m) {
    let h = Number(m[1]) % 12;
    if (m[3] === 'pm') h += 12;
    return `${String(h).padStart(2, '0')}:${m[2] ?? '00'}`;
  }
  m = /^(\d{1,2}):(\d{2})$/.exec(tok);
  if (m && Number(m[1]) < 24 && Number(m[2]) < 60) return `${m[1].padStart(2, '0')}:${m[2]}`;
}

function nextWeekday(today: string, wd: number): string {
  let d = addDays(today, 1);
  while (weekday(d) !== wd) d = addDays(d, 1);
  return d;
}

function ymd(today: string, day: number, month: number): string | undefined {
  if (month < 1 || month > 12 || day < 1 || day > 31) return;
  let y = Number(today.slice(0, 4));
  const k = (yy: number) => `${yy}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  if (k(y) < today) y++;
  return k(y);
}

function parseTask(text: string, ctx: ParseCtx): Candidate {
  const toks = text.split(/\s+/).filter(Boolean);
  const keep: string[] = [];
  let listId: string | undefined, due: string | undefined, time: string | undefined, size: Size | undefined, recurrence: Recurrence | undefined;
  for (let i = 0; i < toks.length; i++) {
    const raw = toks[i];
    const t = raw.toLowerCase();
    const nx = toks[i + 1]?.toLowerCase();
    if (t.startsWith('#') && t.length > 1) {
      const l = matchList(t.slice(1), ctx.lists);
      if (l) { listId = l.id; continue; }
      keep.push(raw); continue;
    }
    if (t === '!big' || t === '!quick' || t === '!normal') { size = t.slice(1) as Size; continue; }
    if (t === 'due' || t === 'by') continue;
    if (t === 'at' && nx && parseTime(nx)) continue;
    if (t === 'today') { due = ctx.today; continue; }
    if (t === 'tmr' || t === 'tmrw' || t === 'tomorrow') { due = addDays(ctx.today, 1); continue; }
    if (t === 'next' && nx === 'week') { due = addDays(ctx.today, 7); i++; continue; }
    if (t === 'next' && nx && nx in WD) { due = addDays(weekStart(ctx.today), 7 + ((WD[nx] + 6) % 7)); i++; continue; }
    if (t === 'in' && nx && /^\d+$/.test(nx) && /^days?$/.test(toks[i + 2]?.toLowerCase() ?? '')) { due = addDays(ctx.today, Number(nx)); i += 2; continue; }
    if (t === 'every' || t === 'daily' || t === 'weekdays' || t === 'monthly') {
      if (t === 'daily') { recurrence = { kind: 'daily' }; continue; }
      if (t === 'weekdays') { recurrence = { kind: 'weekdays' }; continue; }
      if (t === 'monthly') {
        const a = toks[i + 1]?.toLowerCase(), b = toks[i + 2];
        if (a === 'on' && b && /^\d{1,2}$/.test(b)) { recurrence = { kind: 'monthly', day: Number(b) }; i += 2; }
        else recurrence = { kind: 'monthly', day: Number(ctx.today.slice(8, 10)) };
        continue;
      }
      // every …
      if (nx === 'day') { recurrence = { kind: 'daily' }; i++; continue; }
      if (nx === 'weekday' || nx === 'weekdays') { recurrence = { kind: 'weekdays' }; i++; continue; }
      if (nx && /^\d+$/.test(nx) && /^days?$/.test(toks[i + 2]?.toLowerCase() ?? '')) { recurrence = { kind: 'everyN', n: Number(nx) }; i += 2; continue; }
      const days: number[] = [];
      let j = i + 1;
      while (j < toks.length && toks[j].toLowerCase().replace(/,$/, '') in WD) { days.push(WD[toks[j].toLowerCase().replace(/,$/, '')]); j++; }
      if (days.length) { recurrence = { kind: 'weekly', days: [...new Set(days)] }; i = j - 1; continue; }
      keep.push(raw); continue;
    }
    if (t in WD) { due = nextWeekday(ctx.today, WD[t]); continue; }
    if (t === 'on' && nx && /^\d{1,2}$/.test(nx) && toks[i + 2] && toks[i + 2].toLowerCase().slice(0, 3) in MON) {
      due = ymd(ctx.today, Number(nx), MON[toks[i + 2].toLowerCase().slice(0, 3)]); i += 2; continue;
    }
    if (/^\d{1,2}$/.test(t) && nx && nx.slice(0, 3) in MON && keep.length) {
      due = ymd(ctx.today, Number(t), MON[nx.slice(0, 3)]); i++; continue;
    }
    const dm = /^(\d{1,2})\/(\d{1,2})$/.exec(t);
    if (dm) { const d = ymd(ctx.today, Number(dm[1]), Number(dm[2])); if (d) { due = d; continue; } }
    const tm = parseTime(t);
    if (tm) { time = tm; continue; }
    keep.push(raw);
  }
  const habit = recurrence && recurrence.kind !== 'monthly' ? true : undefined;
  const c: Candidate = { kind: 'task', title: keep.join(' ').trim() || text.trim() };
  if (listId) c.listId = listId;
  if (due) c.due = due;
  if (time) c.time = time;
  if (size) c.size = size;
  if (recurrence) { c.recurrence = recurrence; if (habit) c.habit = true; }
  return c;
}

export function parseQuick(input: string, ctx: ParseCtx): Candidate[] {
  const text = input.trim();
  if (!text) return [];
  const out: Candidate[] = [];
  // money in: "+500 salary"
  const mi = /^\+\s*(?:rm\s*)?([\d.,]+)\s*(.*)$/i.exec(text);
  if (mi) {
    const sen = parseAmount(mi[1]);
    if (sen) {
      const words = mi[2].split(/\s+/).filter(Boolean);
      let sourceId = ctx.sources.find((s) => s.id === 'other-in')?.id ?? ctx.sources[0]?.id ?? 'other-in';
      for (const w of words) {
        const hit = Object.entries(SOURCE_ALIASES).find(([, al]) => al.includes(w.toLowerCase()));
        const byName = ctx.sources.find((s) => norm(s.name) === norm(w));
        if (byName) { sourceId = byName.id; break; }
        if (hit && ctx.sources.some((s) => s.id === hit[0])) { sourceId = hit[0]; break; }
      }
      out.push({ kind: 'in', sen, sourceId, note: words.join(' ') });
      return out;
    }
  }
  // money out: "12.50 lunch food", "rm8 grab"
  const mo = /^(?:rm\s*)?(\d[\d.,]*|\.\d+)(?:\s+(.*))?$/i.exec(text);
  if (mo && !parseTime(mo[1].toLowerCase()) && !/^\d{1,2}\/\d{1,2}$/.test(mo[1])) {
    const sen = parseAmount(mo[1]);
    if (sen) {
      const words = (mo[2] ?? '').split(/\s+/).filter(Boolean);
      let cat: Category | undefined;
      let explicitIdx = -1;
      words.forEach((w, i) => {
        const m = matchCategory(w, ctx.categories);
        if (!m) return;
        if (m.explicit && explicitIdx < 0) { cat = m.cat; explicitIdx = i; }
        else if (!cat) cat = m.cat;
      });
      const other = ctx.categories.find((c) => c.id === 'other') ?? ctx.categories[ctx.categories.length - 1];
      const noteWords = explicitIdx >= 0 && words.length > 1 ? words.filter((_, i) => i !== explicitIdx) : words;
      if (cat || other) {
        const money: Candidate = { kind: 'out', sen, categoryId: (cat ?? other)!.id, note: noteWords.join(' ') };
        out.push(money, parseTask(text, ctx));
        return out;
      }
    }
  }
  out.push(parseTask(text, ctx));
  return out;
}
