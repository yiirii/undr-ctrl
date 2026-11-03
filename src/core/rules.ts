import { STAT_META, type Size, type Stat } from './types';

export const SIZE_XP: Record<Size, number> = { quick: 10, normal: 20, big: 40 };
export const QUEST_XP = { daily: 30, weekly: 120 } as const;
export const BOOKKEEPING_XP = 2;
export const RECAP_XP = 25;
export const SAVINGS_XP_PER_RM = 2;

export function taskXp(size: Size, opts: { onTime?: boolean; streak?: number }): number {
  let xp = SIZE_XP[size];
  if (opts.onTime) xp *= 1.25;
  if (opts.streak) xp *= 1 + 0.1 * Math.min(opts.streak, 10);
  return Math.round(xp);
}

export interface LevelInfo { level: number; into: number; need: number }

// threshold(L) = k * L * (L - 1); solve for the largest L with threshold <= xp.
function levelFrom(xp: number, k: number): LevelInfo {
  const x = Math.max(0, xp);
  let level = Math.floor((1 + Math.sqrt(1 + (4 * x) / k)) / 2);
  while (k * (level + 1) * level <= x) level++;
  while (level > 1 && k * level * (level - 1) > x) level--;
  const base = k * level * (level - 1);
  return { level, into: x - base, need: k * (level + 1) * level - base };
}

export const statLevel = (xp: number) => levelFrom(xp, 25);
export const charLevel = (lifetime: number) => levelFrom(lifetime, 50);

export function rank(level: number): string {
  if (level >= 50) return 'Grandmaster';
  if (level >= 35) return 'Master';
  if (level >= 20) return 'Adept';
  if (level >= 10) return 'Journeyman';
  if (level >= 5) return 'Apprentice';
  return 'Novice';
}

export const title = (level: number, top: Stat) => `${rank(level)} ${STAT_META[top].noun}`;

export function focusXp(sessionIndexToday: number): number {
  if (sessionIndexToday === 0) return 10;
  if (sessionIndexToday < 4) return 5;
  return 0;
}
