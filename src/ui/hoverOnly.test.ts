import { describe, it, expect } from 'vitest';
import postcss from 'postcss';
import { hoverOnly } from './hoverOnly';

const run = (css: string) => postcss([hoverOnly()]).process(css, { from: undefined }).css;

describe('hoverOnly', () => {
  it('wraps hover rules in a hover media query', () => {
    expect(run('.a:hover{color:red}')).toContain('@media (hover: hover){.a:hover{color:red}}');
  });
  it('splits a selector list so the non-hover part still applies on touch', () => {
    const out = run('.a:hover, .a.on{color:red}');
    expect(out).toMatch(/^\.a\.on\{color:red\}/);
    expect(out).toContain('@media (hover: hover){.a:hover{color:red}}');
  });
  it('handles hover rules already inside other media queries', () => {
    const out = run('@media (max-width: 720px){.a:hover{transform:none}}');
    expect(out).toContain('@media (max-width: 720px){@media (hover: hover){.a:hover{transform:none}}}');
  });
  it('leaves other rules alone', () => {
    expect(run('.b{color:blue}')).toBe('.b{color:blue}');
  });
});
