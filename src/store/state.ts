import type { Category, Deposit, FocusLogEntry, Goal, IncomeSource, LedgerEntry, List, MoneyEntry, Playlist, Quest, Task, Track } from '../core/types';
import { STAT_META } from '../core/types';
import type { FocusState } from '../core/focus';
import { DEFAULT_PLATFORMS, migrateToCashFlow, type BizItem, type BizExpense, type BizIncome } from '../core/business';
import { DEFAULT_APPEARANCE, type Appearance } from '../core/appearance';
import { defaultCategories, defaultSources } from '../core/money';

export type View = 'myday' | 'planned' | 'habits' | 'money' | 'insights' | 'quests' | 'profile' | 'settings' | 'focus' | `list:${string}`;
export const NAV_PAGES = ['myday', 'planned', 'habits', 'money', 'insights', 'quests', 'profile'] as const;

export interface Settings {
  sound: 'soft' | 'glass' | 'wood' | 'chime';
  volume: number;
  muted: boolean;
  reducedMotion: boolean;
  startWithWindows: boolean;
  startPage: View;
  weekStartsMonday: boolean;
  dateFormat: 'short' | 'dmy' | 'iso';
  time24: boolean;
  hiddenPages: string[];
  navOrder: string[];
  title?: string; // chosen special title
  backupFolder?: string; // cloud folder (e.g. Google Drive) for the single daily backup
  lastCloudBackup?: string; // ISO time of last successful cloud backup
  cloudBackupFailed?: boolean;
}

export interface MusicState { tracks: Track[]; playlists: Playlist[]; volume: number; shuffle: boolean; repeat: 'off' | 'all' | 'one'; resumeOnReturn: boolean; linkInsteadOfCopy: boolean; activePlaylist: string }

export interface AppState {
  version: 1;
  profile: { name: string; onboarded: boolean; createdAt: string };
  lists: List[];
  tasks: Task[];
  money: { categories: Category[]; sources: IncomeSource[]; entries: MoneyEntry[]; goals: Goal[]; deposits: Deposit[]; savingsTargetSen: number; setupDone: boolean; dismissedNudges: string[]; recapsSeen: string[] };
  business: { items: BizItem[]; expenses: BizExpense[]; income: BizIncome[]; platforms: string[]; name: string };
  bizVersion?: number; // 2 = cash-flow Wealth
  ledger: LedgerEntry[];
  quests: Quest[];
  questsCompleted: number;
  rerollDay?: string;
  achievements: string[];
  focus: FocusState | null;
  focusLog: FocusLogEntry[];
  focusSettings: { focusMin: number; breakMin: number; autoBreak: boolean; musicLink: boolean };
  music: MusicState;
  appearance: Appearance;
  settings: Settings;
  myDayCleared: string[];
  reminded: string[];
  lastRollover?: string;
  combo?: { count: number; lastMs: number };
}

export function defaultLists(): List[] {
  const l = (id: string, name: string, icon: string, stat: List['stat']): List => ({ id, name, icon, stat, color: stat ? STAT_META[stat].hue : '#b5bac1' });
  return [
    l('uni', 'Uni', 'book', 'int'),
    l('assignments', 'Assignments', 'pen', 'int'),
    l('fitness', 'Fitness', 'bolt', 'str'),
    l('personal', 'Personal', 'leaf', 'dis'),
    l('creative', 'Creative', 'spark', 'cre'),
    l('social', 'Social', 'chat', 'cha'),
  ];
}

export function initialState(name = ''): AppState {
  return {
    version: 1,
    profile: { name, onboarded: false, createdAt: new Date().toISOString() },
    lists: defaultLists(),
    tasks: [],
    money: { categories: defaultCategories(), sources: defaultSources(), entries: [], goals: [], deposits: [], savingsTargetSen: 0, setupDone: false, dismissedNudges: [], recapsSeen: [] },
    business: { items: [], expenses: [], income: [], platforms: [...DEFAULT_PLATFORMS], name: 'Funko shop' },
    bizVersion: 2,
    ledger: [],
    quests: [],
    questsCompleted: 0,
    achievements: [],
    focus: null,
    focusLog: [],
    focusSettings: { focusMin: 25, breakMin: 5, autoBreak: true, musicLink: false },
    music: { tracks: [], playlists: [], volume: 0.7, shuffle: false, repeat: 'all', resumeOnReturn: true, linkInsteadOfCopy: false, activePlaylist: 'all' },
    appearance: { ...DEFAULT_APPEARANCE },
    settings: { sound: 'soft', volume: 0.6, muted: false, reducedMotion: false, startWithWindows: true, startPage: 'myday', weekStartsMonday: true, dateFormat: 'short', time24: false, hiddenPages: [], navOrder: [...NAV_PAGES] },
    myDayCleared: [],
    reminded: [],
  };
}

/** Fill in any fields a stored document is missing (forward-compatible load). */
export function migrate(raw: unknown): AppState {
  const base = initialState();
  const s = (raw ?? {}) as Partial<AppState>;
  const business = { ...base.business, ...(s.business ?? {}) };
  let ledger = s.ledger ?? base.ledger;
  if (s.bizVersion !== 2 && s.business) ledger = migrateToCashFlow(business.items, ledger, new Date().toISOString());
  return {
    ...base,
    ...s,
    ledger,
    bizVersion: 2,
    profile: { ...base.profile, ...(s.profile ?? {}) },
    money: { ...base.money, ...(s.money ?? {}) },
    business,
    focusSettings: { ...base.focusSettings, ...(s.focusSettings ?? {}) },
    music: { ...base.music, ...(s.music ?? {}) },
    appearance: { ...base.appearance, ...(s.appearance ?? {}) },
    settings: withAllPages({ ...base.settings, ...(s.settings ?? {}) }),
    version: 1,
  };
}

/** Pages added in later versions get slotted into a saved sidebar order (right after the page before them). */
function withAllPages(st: Settings): Settings {
  const order = [...st.navOrder];
  NAV_PAGES.forEach((k, i) => {
    if (order.includes(k)) return;
    const prev = NAV_PAGES[i - 1];
    const at = prev ? order.indexOf(prev) + 1 : 0;
    order.splice(at > 0 ? at : order.length, 0, k);
  });
  return { ...st, navOrder: order };
}
