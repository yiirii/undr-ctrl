import { describe, test, expect } from 'vitest';
import { THEMES, TOKEN_KEYS, contrast, fixAccent, toCssVars, DEFAULT_APPEARANCE, ACCENTS, FONTS, resolveAccent } from './appearance';

describe('themes', () => {
  test.each(Object.keys(THEMES))('%s defines every token', (id) => {
    for (const k of TOKEN_KEYS) expect(THEMES[id as keyof typeof THEMES][k], `${id}.${k}`).toMatch(/^#[0-9a-f]{6}$/i);
  });
  test.each(Object.keys(THEMES))('%s text meets AA on main surface', (id) => {
    const t = THEMES[id as keyof typeof THEMES];
    expect(contrast(t.t1, t.bg2)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.t2, t.bg2)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.t1, t.bg1)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.t3, t.bg2)).toBeGreaterThanOrEqual(3);
  });
});

describe('accent', () => {
  test('contrast sanity', () => expect(contrast('#ffffff', '#000000')).toBeCloseTo(21, 0));
  test('fixAccent lifts a dark accent on dark theme', () => expect(contrast(fixAccent('#202020', THEMES.discord.bg2), THEMES.discord.bg2)).toBeGreaterThanOrEqual(3));
  test('fixAccent darkens a light accent on light theme', () => expect(contrast(fixAccent('#f0f0f0', THEMES.light.bg2), THEMES.light.bg2)).toBeGreaterThanOrEqual(3));
  test('monochrome accent resolves to text colour', () => expect(resolveAccent('mono', THEMES.discord)).toBe(THEMES.discord.t1));
  test('accent list includes free + earned', () => {
    expect(ACCENTS.map((a) => a.id)).toEqual(expect.arrayContaining(['mono', 'mint', 'violet', 'sky', 'coral', 'gold', 'rose', 'sunset', 'aurora']));
  });
});

describe('css vars', () => {
  test('defaults produce full var set', () => {
    const v = toCssVars(DEFAULT_APPEARANCE, false);
    expect(v['--bg0']).toBe(THEMES.discord.bg0);
    expect(v['--font-ui']).toContain('Inter');
    expect(v['--radius']).toBe('10px');
    expect(v['--scale']).toBe('1');
    expect(v['--sidebar-w']).toBe('272px');
  });
  test('system theme follows os dark flag', () => {
    expect(toCssVars({ ...DEFAULT_APPEARANCE, theme: 'system' }, false)['--bg0']).toBe(THEMES.light.bg0);
    expect(toCssVars({ ...DEFAULT_APPEARANCE, theme: 'system' }, true)['--bg0']).toBe(THEMES.discord.bg0);
  });
  test('six fonts', () => expect(FONTS.length).toBe(6));
});
