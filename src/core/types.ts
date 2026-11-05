// Domain types for Undr Ctrl. Money is integer sen. Dates are local 'YYYY-MM-DD' keys.

export type Stat = 'int' | 'str' | 'wea' | 'dis' | 'cre' | 'cha';
export const STATS: Stat[] = ['int', 'str', 'wea', 'dis', 'cre', 'cha'];
export const STAT_META: Record<Stat, { name: string; noun: string; hue: string }> = {
  int: { name: 'Intelligence', noun: 'Scholar', hue: '#6ea8fe' },
  str: { name: 'Strength', noun: 'Warrior', hue: '#ff7a6b' },
  wea: { name: 'Wealth', noun: 'Merchant', hue: '#9fd36a' },
  dis: { name: 'Discipline', noun: 'Monk', hue: '#a79bff' },
  cre: { name: 'Creativity', noun: 'Artisan', hue: '#f59ac6' },
  cha: { name: 'Charisma', noun: 'Bard', hue: '#ffc069' },
};

export type Size = 'quick' | 'normal' | 'big';

export type Recurrence =
  | { kind: 'daily' }
  | { kind: 'weekdays' }
  | { kind: 'weekly'; days: number[] } // 0 = Sunday
  | { kind: 'everyN'; n: number }
  | { kind: 'monthly'; day: number };

export interface List {
  id: string;
  name: string;
  icon: string;
  color: string;
  emoji?: string;
  stat: Stat | null;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  listId: string;
  size: Size;
  stat?: Stat | null; // override; undefined = inherit from list
  due?: string; // day key
  time?: string; // 'HH:MM'
  remind?: boolean;
  recurrence?: Recurrence;
  anchor?: string; // recurrence anchor day key
  habit?: boolean;
  completions: string[]; // habit: day keys completed
  streak: number;
  myDay?: string; // day key it was added to My Day
  doneAt?: string; // ISO timestamp (non-habit)
  spawnedId?: string; // next instance created when a recurring task was completed
  createdAt: string;
  order: number;
  steps?: Step[];
  link?: { kind: 'biz-collect' | 'biz-ship'; itemId: string }; // auto-created by the business
}
export interface Step { id: string; title: string; done: boolean }

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  emoji?: string;
  limitSen: number;
  need: boolean; // 50/30/20 group
}

export interface IncomeSource {
  id: string;
  name: string;
  icon: string;
  expectedSen: number;
}

export interface MoneyEntry {
  id: string;
  kind: 'in' | 'out';
  sen: number;
  categoryId?: string; // out
  sourceId?: string; // in
  note: string;
  date: string; // day key
  loggedOn: string; // day key it was logged
  repeatMonthly?: boolean;
  autoFrom?: string; // id of the repeating entry this was generated from
  wallet?: 'cash' | 'tng'; // what paid (out) or received (in); missing = cash. TnG is the business wallet.
}

export interface Goal {
  id: string;
  name: string;
  targetSen: number;
  deadline?: string;
  savedSen: number;
  createdAt: string;
}

export interface Deposit {
  id: string;
  goalId: string;
  sen: number;
  date: string;
}

export interface LedgerEntry {
  id: string;
  at: string; // ISO
  source: string; // 'task' | 'habit' | 'quest' | 'achievement' | 'deposit' | 'spend' | 'drip' | 'bookkeeping' | 'recap' | 'focus' | 'reverse'
  stat: Stat | null;
  amount: number;
  lifetime: boolean;
  ref: string;
  reversed?: boolean;
}

export interface Quest {
  id: string;
  templateId: string;
  kind: 'daily' | 'weekly';
  period: string; // day key (daily) or week-start key (weekly)
  label: string;
  target: number;
  claimed: boolean;
}

export interface FocusLogEntry {
  taskId: string;
  day: string;
  minutes: number;
  completed: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  file: string; // stored file name or linked absolute path
  durationSec: number;
  missing?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
}
