export interface Unlock { id: string; kind: 'theme' | 'accent' | 'sound' | 'title'; value: string; label: string; req: { level?: number; achievement?: string } }

export const UNLOCKS: Unlock[] = [
  { id: 'sound-glass', kind: 'sound', value: 'glass', label: 'Glass sounds', req: { level: 8 } },
  { id: 'theme-dusk', kind: 'theme', value: 'dusk', label: 'Dusk theme', req: { level: 12 } },
  { id: 'sound-wood', kind: 'sound', value: 'wood', label: 'Wood sounds', req: { level: 12 } },
  { id: 'accent-gold', kind: 'accent', value: 'gold', label: 'Gold accent', req: { level: 20 } },
  { id: 'accent-sunset', kind: 'accent', value: 'sunset', label: 'Sunset gradient', req: { level: 25 } },
  { id: 'theme-aurora', kind: 'theme', value: 'aurora', label: 'Aurora theme', req: { level: 35 } },
  { id: 'accent-aurora', kind: 'accent', value: 'aurora', label: 'Aurora gradient', req: { level: 35 } },
  { id: 'theme-forest', kind: 'theme', value: 'forest', label: 'Forest theme', req: { achievement: 'iron-will' } },
  { id: 'accent-rose', kind: 'accent', value: 'rose', label: 'Rose accent', req: { achievement: 'nest-egg' } },
  { id: 'sound-chime', kind: 'sound', value: 'chime', label: 'Chime sounds', req: { achievement: 'quester' } },
];

export const isUnlocked = (u: Unlock, level: number, achievements: string[]) =>
  u.req.level !== undefined ? level >= u.req.level : u.req.achievement ? achievements.includes(u.req.achievement) : true;

export const nextUnlock = (level: number): Unlock | undefined =>
  UNLOCKS.filter((u) => u.req.level !== undefined && u.req.level > level).sort((a, b) => a.req.level! - b.req.level!)[0];

export const unlocksAt = (level: number) => UNLOCKS.filter((u) => u.req.level === level);
export const unlocksForAchievement = (id: string) => UNLOCKS.filter((u) => u.req.achievement === id);
export const lockedValue = (kind: Unlock['kind'], value: string, level: number, achievements: string[]) => {
  const u = UNLOCKS.find((x) => x.kind === kind && x.value === value);
  return u ? !isUnlocked(u, level, achievements) : false;
};
