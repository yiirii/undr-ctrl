import type { Plugin, Rule, AtRule } from 'postcss';

/**
 * PostCSS plugin: moves every rule whose selector uses :hover into
 * `@media (hover: hover)`, so on touch screens (iPhone) a tap never
 * leaves a button stuck in its hover look. Mixed selector lists are split.
 */
export function hoverOnly(): Plugin {
  return {
    postcssPlugin: 'hover-only',
    Once(root, { atRule }) {
      root.walkRules((rule: Rule) => {
        if (!rule.selector.includes(':hover')) return;
        const parent = rule.parent as AtRule | undefined;
        if (parent?.type === 'atrule' && parent.name === 'media' && parent.params.includes('hover')) return;
        if (parent?.type === 'atrule' && parent.name === 'keyframes') return;
        const sels = rule.selectors;
        const hov = sels.filter((x) => x.includes(':hover'));
        const rest = sels.filter((x) => !x.includes(':hover'));
        const moved = rule.clone({ selectors: hov });
        const wrap = atRule({ name: 'media', params: '(hover: hover)' });
        wrap.append(moved);
        rule.after(wrap);
        if (rest.length) rule.selectors = rest; else rule.remove();
      });
    },
  };
}
hoverOnly.postcss = true;
