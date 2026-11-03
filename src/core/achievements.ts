import { STATS } from './types';
import type { Facts } from './facts';

export type Tier = 'bronze' | 'silver' | 'gold';
export interface Achievement { id: string; name: string; desc: string; tier: Tier; metric: (f: Facts) => number; target: number; title?: string }
export const TIER_XP: Record<Tier, number> = { bronze: 25, silver: 75, gold: 200 };

const a = (id: string, name: string, desc: string, tier: Tier, target: number, metric: (f: Facts) => number, title?: string): Achievement => ({ id, name, desc, tier, target, metric, title });

export const ACHIEVEMENTS: Achievement[] = [
  a('first-steps', 'First Steps', 'Complete your first task', 'bronze', 1, (f) => f.tasksDoneTotal),
  a('ten-down', 'Ten Down', 'Complete 10 tasks', 'bronze', 10, (f) => f.tasksDoneTotal),
  a('fifty', 'Halfway There', 'Complete 50 tasks', 'silver', 50, (f) => f.tasksDoneTotal),
  a('centurion', 'Centurion', 'Complete 100 tasks', 'silver', 100, (f) => f.tasksDoneTotal, 'Centurion'),
  a('five-hundred', 'Unstoppable', 'Complete 500 tasks', 'gold', 500, (f) => f.tasksDoneTotal, 'The Unstoppable'),
  a('bookworm', 'Bookworm', 'Reach Intelligence 10', 'silver', 10, (f) => f.statLevels.int, 'Bookworm'),
  a('ironclad', 'Ironclad', 'Reach Strength 10', 'silver', 10, (f) => f.statLevels.str),
  a('tycoon', 'Little Tycoon', 'Reach Wealth 10', 'silver', 10, (f) => f.statLevels.wea),
  a('zen', 'Still Water', 'Reach Discipline 10', 'silver', 10, (f) => f.statLevels.dis),
  a('muse', 'Muse', 'Reach Creativity 10', 'silver', 10, (f) => f.statLevels.cre),
  a('socialite', 'Socialite', 'Reach Charisma 10', 'silver', 10, (f) => f.statLevels.cha),
  a('renaissance', 'Renaissance', 'Every stat at level 5 or higher', 'gold', 5, (f) => Math.min(...STATS.map((s) => f.statLevels[s])), 'Renaissance Soul'),
  a('lv5', 'Apprentice', 'Reach level 5', 'bronze', 5, (f) => f.charLevel),
  a('lv10', 'Journeyman', 'Reach level 10', 'silver', 10, (f) => f.charLevel),
  a('lv20', 'Adept', 'Reach level 20', 'gold', 20, (f) => f.charLevel),
  a('week-warrior', 'Week Warrior', 'Keep a habit streak for 7 days', 'bronze', 7, (f) => f.maxStreak),
  a('iron-will', 'Iron Will', 'Keep a habit streak for 30 days', 'silver', 30, (f) => f.maxStreak, 'Iron Will'),
  a('unbreakable', 'Unbreakable', 'Keep a habit streak for 100 days', 'gold', 100, (f) => f.maxStreak, 'The Unbreakable'),
  a('habit-builder', 'Habit Builder', 'Have 5 habits', 'bronze', 5, (f) => f.habitsCount),
  a('first-log', 'Penny Tracker', 'Log your first money entry', 'bronze', 1, (f) => f.entriesTotal),
  a('log-100', 'Bookkeeper', 'Log 100 money entries', 'silver', 100, (f) => f.entriesTotal),
  a('penny-pincher', 'Penny Pincher', 'Finish a month under budget in every category', 'silver', 1, (f) => f.monthsUnderBudget),
  a('steady-hands', 'Steady Hands', 'Finish 3 months under budget', 'gold', 3, (f) => f.monthsUnderBudget),
  a('nest-egg', 'Nest Egg', 'Complete your first savings goal', 'silver', 1, (f) => f.goalsCompleted),
  a('saver', 'Saver', 'Put RM 500 into savings', 'bronze', 50000, (f) => f.depositedTotalSen),
  a('big-saver', 'Big Saver', 'Put RM 2,000 into savings', 'gold', 200000, (f) => f.depositedTotalSen),
  a('first-focus', 'In the Zone', 'Finish a focus session', 'bronze', 1, (f) => f.focusSessionsTotal),
  a('deep-work', 'Deep Work', 'Focus for 10 hours in total', 'silver', 600, (f) => f.focusMinutesTotal),
  a('flow-state', 'Flow State', 'Focus for 50 hours in total', 'gold', 3000, (f) => f.focusMinutesTotal),
  a('night-owl', 'Night Owl', 'Complete a task after midnight', 'bronze', 1, (f) => f.nightOwlCount, 'Night Owl'),
  a('early-bird', 'Early Bird', 'Complete a task before 7am', 'bronze', 1, (f) => f.earlyBirdCount, 'Early Bird'),
  a('quester', 'Quester', 'Complete 10 quests', 'bronze', 10, (f) => f.questsCompleted),
  a('legend', 'Legend', 'Complete 100 quests', 'gold', 100, (f) => f.questsCompleted),
  a('clear-skies', 'Clear Skies', 'Clear My Day 10 times', 'silver', 10, (f) => f.myDayClearedCount),
  a('reflective', 'Reflective', 'Finish a monthly recap', 'bronze', 1, (f) => f.recapsDone),
  a('first-sale', 'First Sale', 'Sell your first business item', 'bronze', 1, (f) => f.bizSales),
  a('hustler', 'Hustler', 'Make RM 1,000 total business profit', 'gold', 100000, (f) => f.bizProfitTotalSen, 'The Hustler'),
];

export const achievementProgress = (x: Achievement, f: Facts) => ({ value: Math.min(x.target, Math.max(0, x.metric(f))), target: x.target });
export const newlyUnlocked = (prev: string[], f: Facts) => ACHIEVEMENTS.filter((x) => !prev.includes(x.id) && x.metric(f) >= x.target);
