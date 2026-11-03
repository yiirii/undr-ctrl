// Design tokens, themes and appearance settings → CSS variables.

export const TOKEN_KEYS = ['bg0', 'bg1', 'bg2', 'bg3', 'bg4', 'line', 't1', 't2', 't3', 'xp', 'ok', 'warn', 'bad', 'in', 'int', 'str', 'wea', 'dis', 'cre', 'cha'] as const;
export type TokenKey = (typeof TOKEN_KEYS)[number];
export type Tokens = Record<TokenKey, string> & { dark: boolean; gradient?: string; sidebarGradient?: string };

const statsDark = { int: '#6ea8fe', str: '#ff7a6b', wea: '#9fd36a', dis: '#a79bff', cre: '#f59ac6', cha: '#ffc069' };
const statsLight = { int: '#2f6fd6', str: '#d9483a', wea: '#4f8f22', dis: '#6a5bd6', cre: '#c94a8a', cha: '#b9770e' };
const meaningDark = { xp: '#f6c453', ok: '#3ddc97', warn: '#f0a35e', bad: '#f2546b', in: '#5fd3a0' };
const meaningLight = { xp: '#b8860b', ok: '#1f9d63', warn: '#c26a1b', bad: '#d33a52', in: '#1f9d63' };

export const THEMES = {
  discord: { dark: true, bg0: '#1e1f22', bg1: '#2b2d31', bg2: '#313338', bg3: '#383a40', bg4: '#404249', line: '#3f4147', t1: '#f2f3f5', t2: '#b5bac1', t3: '#80848e', ...meaningDark, ...statsDark },
  midnight: { dark: true, bg0: '#050506', bg1: '#0d0e10', bg2: '#121316', bg3: '#1a1c20', bg4: '#23252a', line: '#22242a', t1: '#eceef1', t2: '#a9aeb7', t3: '#7a7f89', ...meaningDark, ...statsDark },
  light: { dark: false, bg0: '#e6e7ea', bg1: '#f2f3f5', bg2: '#fbfbfc', bg3: '#eef0f3', bg4: '#e3e5e9', line: '#dcdfe4', t1: '#1e1f22', t2: '#4e5058', t3: '#6d717a', ...meaningLight, ...statsLight },
  nord: { dark: true, bg0: '#242933', bg1: '#2e3440', bg2: '#353c4a', bg3: '#3b4252', bg4: '#434c5e', line: '#434c5e', t1: '#eceff4', t2: '#c8cfdb', t3: '#929cb0', ...meaningDark, ...statsDark },
  sepia: { dark: false, bg0: '#e9dfcc', bg1: '#f1e8d6', bg2: '#f8f1e3', bg3: '#efe5d1', bg4: '#e6dac3', line: '#ddd0b6', t1: '#3b2f22', t2: '#5c4a37', t3: '#7f6a52', ...meaningLight, ...statsLight },
  dusk: { dark: true, bg0: '#17151f', bg1: '#221f2d', bg2: '#2a2638', bg3: '#332e44', bg4: '#3c3650', line: '#3a3450', t1: '#f1eef9', t2: '#bdb5d4', t3: '#8a83a3', ...meaningDark, ...statsDark, gradient: 'linear-gradient(160deg, #2e2843 0%, #1d1a29 70%)' },
  forest: { dark: true, bg0: '#151b18', bg1: '#1d2521', bg2: '#232d28', bg3: '#2a3630', bg4: '#334139', line: '#304038', t1: '#ecf3ee', t2: '#b3c2b8', t3: '#7f9286', ...meaningDark, ...statsDark },
  aurora: { dark: true, bg0: '#14161c', bg1: '#1b1e26', bg2: '#22252f', bg3: '#2a2e3a', bg4: '#333847', line: '#323746', t1: '#eef1f7', t2: '#b6bccb', t3: '#828a9c', ...meaningDark, ...statsDark, sidebarGradient: 'linear-gradient(200deg, #1c2a33, #231d33, #1b2a26)' },
} satisfies Record<string, Tokens>;
export type ThemeId = keyof typeof THEMES | 'system';
export const THEME_LABELS: Record<ThemeId, string> = { discord: 'Discord Grey', midnight: 'Midnight', light: 'Light', nord: 'Nord', sepia: 'Sepia', system: 'Follow system', dusk: 'Dusk', forest: 'Forest', aurora: 'Aurora' };

export interface Accent { id: string; label: string; color?: string; gradient?: string }
export const ACCENTS: Accent[] = [
  { id: 'mono', label: 'Monochrome' },
  { id: 'mint', label: 'Mint', color: '#3ddc97' },
  { id: 'violet', label: 'Violet', color: '#8b7cff' },
  { id: 'sky', label: 'Sky', color: '#5ab8ff' },
  { id: 'coral', label: 'Coral', color: '#ff6b5b' },
  { id: 'gold', label: 'Gold', color: '#f6c453' },
  { id: 'rose', label: 'Rose', color: '#ff7aa8' },
  { id: 'sunset', label: 'Sunset', color: '#ff8a5c', gradient: 'linear-gradient(90deg,#ff6b8b,#ffb36b)' },
  { id: 'aurora', label: 'Aurora', color: '#5fe0c0', gradient: 'linear-gradient(90deg,#5fe0c0,#8b7cff,#ff7aa8)' },
];

export const FONTS = ['Inter', 'Manrope', 'Nunito', 'Space Grotesk', 'IBM Plex Sans', 'JetBrains Mono'] as const;
export type FontName = (typeof FONTS)[number];

export interface Appearance {
  theme: ThemeId;
  accent: string; // accent id or 'custom'
  customAccent: string;
  uiFont: FontName;
  headingFont: FontName;
  scale: number; // 0.9 | 1 | 1.1 | 1.25 | 1.4
  tabularNums: boolean;
  compactRM: boolean;
  density: 'compact' | 'cozy' | 'spacious';
  radius: 'sharp' | 'soft' | 'round';
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  useStatColours: boolean;
}

export const DEFAULT_APPEARANCE: Appearance = {
  theme: 'discord', accent: 'mono', customAccent: '#8b7cff', uiFont: 'Inter', headingFont: 'Inter', scale: 1, tabularNums: true, compactRM: false,
  density: 'cozy', radius: 'soft', sidebarWidth: 272, sidebarCollapsed: false, useStatColours: true,
};

// ---------- colour maths ----------
const hexRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lum = (h: string) => { const c = hexRgb(h).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

function toHsl(h: string): [number, number, number] {
  const [r, g, b] = hexRgb(h);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const hue = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [hue / 6, s, l];
}
function fromHsl(h: number, s: number, l: number): string {
  const f = (n: number) => { const k = (n + h * 12) % 12; const a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return '#' + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}
export function fixAccent(hex: string, bg: string): string {
  if (contrast(hex, bg) >= 3) return hex;
  const [h, s, l0] = toHsl(hex);
  const up = lum(bg) < 0.4;
  for (let i = 1; i <= 100; i++) {
    const l = Math.min(1, Math.max(0, l0 + (up ? 1 : -1) * i * 0.01));
    const c = fromHsl(h, s, l);
    if (contrast(c, bg) >= 3) return c;
  }
  return up ? '#ffffff' : '#000000';
}
export const mix = (a: string, b: string, t: number) => {
  const x = hexRgb(a), y = hexRgb(b);
  return '#' + x.map((v, i) => Math.round((v + (y[i] - v) * t) * 255).toString(16).padStart(2, '0')).join('');
};

export function resolveTheme(id: ThemeId, osDark: boolean): Tokens {
  if (id === 'system') return osDark ? THEMES.discord : THEMES.light;
  return THEMES[id];
}
export function resolveAccent(id: string, t: Tokens, custom = '#8b7cff'): string {
  if (id === 'mono') return t.t1;
  const hex = id === 'custom' ? custom : ACCENTS.find((a) => a.id === id)?.color ?? t.t1;
  return fixAccent(hex, t.bg2);
}

const FONT_STACK = (f: FontName) => `'${f}', 'Inter', system-ui, sans-serif`;
const DENSITY = { compact: { row: '38px', pad: '10px', gap: '6px' }, cozy: { row: '48px', pad: '14px', gap: '8px' }, spacious: { row: '58px', pad: '18px', gap: '12px' } };
const RADIUS = { sharp: '4px', soft: '10px', round: '18px' };

export function toCssVars(a: Appearance, osDark: boolean): Record<string, string> {
  const t = resolveTheme(a.theme, osDark);
  const v: Record<string, string> = {};
  for (const k of TOKEN_KEYS) v[`--${k}`] = t[k];
  const accent = resolveAccent(a.accent, t, a.customAccent);
  const acc = ACCENTS.find((x) => x.id === a.accent);
  v['--accent'] = accent;
  v['--accent-fill'] = acc?.gradient ?? accent;
  v['--accent-ink'] = contrast(accent, '#000000') > contrast(accent, '#ffffff') ? '#111214' : '#ffffff';
  v['--main-bg'] = t.gradient ?? t.bg2;
  v['--side-bg'] = t.sidebarGradient ?? t.bg1;
  v['--font-ui'] = FONT_STACK(a.uiFont);
  v['--font-head'] = FONT_STACK(a.headingFont);
  v['--scale'] = String(a.scale);
  v['--nums'] = a.tabularNums ? 'tabular-nums' : 'proportional-nums';
  const d = DENSITY[a.density];
  v['--row-h'] = d.row; v['--pad'] = d.pad; v['--gap'] = d.gap;
  v['--radius'] = RADIUS[a.radius];
  v['--radius-sm'] = a.radius === 'sharp' ? '3px' : a.radius === 'soft' ? '7px' : '12px';
  v['--sidebar-w'] = `${a.sidebarCollapsed ? 68 : Math.min(340, Math.max(220, a.sidebarWidth))}px`;
  v['--shadow'] = t.dark ? '0 12px 32px rgba(0,0,0,.38)' : '0 10px 28px rgba(40,40,60,.14)';
  v['--scheme'] = t.dark ? 'dark' : 'light';
  return v;
}
