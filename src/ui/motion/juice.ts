// The "juice" toolkit: small, fast feedback effects used all over the app.
// Everything here animates only transform and opacity (GPU work, no layout), and is skipped with Reduced motion.
import { useStore } from '../../store/store';
import { burst } from './particles';

export const reducedMotion = () => document.documentElement.classList.contains('reduced-motion');
const SPRINGY = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ---------------- haptics ----------------
// iPhone Safari has no vibration API, but toggling a native "switch" checkbox gives a real system tap.
// (iOS 18+; older versions simply do nothing.) Android uses navigator.vibrate. Desktops have none.
let switchLabel: HTMLLabelElement | null = null;
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
function ensureSwitch() {
  if (switchLabel) return switchLabel;
  const l = document.createElement('label');
  l.setAttribute('aria-hidden', 'true');
  l.style.cssText = 'position:fixed;left:-100px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none';
  const i = document.createElement('input');
  i.type = 'checkbox'; i.setAttribute('switch', ''); i.tabIndex = -1;
  l.appendChild(i); document.body.appendChild(l);
  return (switchLabel = l);
}
export type Haptic = 'light' | 'medium' | 'success' | 'heavy';
export function haptic(kind: Haptic = 'light') {
  try {
    if (useStore.getState().s.settings.haptics === false) return;
    const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
    if (!isIOS()) { if (nav.vibrate && matchMedia('(hover: none)').matches) nav.vibrate(kind === 'light' ? 8 : kind === 'medium' ? 14 : kind === 'success' ? [10, 50, 14] : 26); return; }
    const l = ensureSwitch();
    l.click();
    if (kind === 'success') setTimeout(() => l.click(), 85);
    if (kind === 'heavy') { setTimeout(() => l.click(), 60); setTimeout(() => l.click(), 120); }
  } catch { /* never let feedback break an action */ }
}

// ---------------- one-shot effects ----------------
let layer: HTMLDivElement | null = null;
function fxLayer() {
  if (layer && layer.isConnected) return layer;
  layer = document.createElement('div');
  layer.className = 'fx-layer';
  document.body.appendChild(layer);
  return layer;
}

/** A quick springy scale "pop" on an element. */
export function pop(el: Element | null | undefined, scale = 1.18, duration = 380) {
  if (!el || reducedMotion() || !(el as HTMLElement).animate) return;
  (el as HTMLElement).animate([{ transform: 'scale(1)' }, { transform: `scale(${scale})`, offset: 0.35 }, { transform: 'scale(1)' }], { duration, easing: 'ease-out' });
}

/** An expanding ring at a point (e.g. around a checkbox you just ticked). */
export function ripple(x: number, y: number, color: string, size = 56) {
  if (reducedMotion()) return;
  const d = document.createElement('div');
  d.className = 'fx-ripple';
  d.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-color:${color}`;
  fxLayer().appendChild(d);
  d.animate([{ transform: 'scale(.35)', opacity: 0.9 }, { transform: 'scale(1)', opacity: 0 }], { duration: 520, easing: EASE_OUT }).onfinish = () => d.remove();
}

/** A tiny spark burst (small particles) from a point. */
export function sparks(x: number, y: number, colors: string[], count = 12) {
  burst(x, y, colors, count, 4.2, false, 0.55);
}

export const centerOf = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

/**
 * A little label (e.g. "+20 XP") that flies on an arc from a point into a target element,
 * which then glows. Used to show XP landing in your XP bar.
 */
export function flyTo(from: { x: number; y: number }, target: Element | null, text: string, color = 'var(--xp)') {
  if (reducedMotion() || !target) return;
  const t = centerOf(target);
  const chip = document.createElement('div');
  chip.className = 'fx-fly';
  chip.textContent = text;
  chip.style.cssText = `left:${from.x}px;top:${from.y}px;color:${color}`;
  fxLayer().appendChild(chip);
  const dx = t.x - from.x, dy = t.y - from.y;
  const lift = Math.min(120, Math.abs(dx) * 0.25 + 50);
  const a = chip.animate([
    { transform: 'translate(-50%,-50%) translate(0,0) scale(.6)', opacity: 0 },
    { transform: `translate(-50%,-50%) translate(${dx * 0.12}px,${-lift * 0.6}px) scale(1.15)`, opacity: 1, offset: 0.22 },
    { transform: `translate(-50%,-50%) translate(${dx * 0.55}px,${dy * 0.4 - lift}px) scale(1)`, opacity: 1, offset: 0.55 },
    { transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(.45)`, opacity: 0.2 },
  ], { duration: 820, easing: 'cubic-bezier(.45,0,.55,1)' });
  a.onfinish = () => { chip.remove(); glow(target); };
}

/** Light sweep + pop on a progress bar (or any element) to show something just landed in it. */
export function glow(el: Element | null) {
  if (!el || reducedMotion()) return;
  el.classList.remove('fx-gain');
  void (el as HTMLElement).offsetWidth; // restart the CSS animation
  el.classList.add('fx-gain');
  setTimeout(() => el.classList.remove('fx-gain'), 900);
}

/** Staggered rise-in of an element's children (pages, sheets). Runs on the GPU. */
export function stagger(container: Element | null, opts: { selector?: string; step?: number; max?: number; y?: number; duration?: number } = {}) {
  if (!container || reducedMotion()) return;
  const { selector, step = 34, max = 12, y = 10, duration = 420 } = opts;
  const kids = (selector ? Array.from(container.querySelectorAll(selector)) : Array.from(container.children)) as HTMLElement[];
  let i = 0;
  for (const k of kids) {
    if (i >= max) break;
    if (!k.animate || k.offsetParent === null) continue;
    k.animate([{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], { duration, delay: i * step, easing: EASE_OUT, fill: 'backwards' });
    i++;
  }
}

export { SPRINGY, EASE_OUT };

/** Diamonds (habits) spin a half turn and pop when ticked. */
export function spinPop(el: Element | null | undefined) {
  if (!el || reducedMotion() || !(el as HTMLElement).animate) return;
  (el as HTMLElement).animate([{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(100deg) scale(1.45)', offset: 0.4 }, { transform: 'rotate(180deg) scale(1)' }], { duration: 560, easing: 'cubic-bezier(.22,1,.36,1)' });
}

/** All the feedback for ticking a habit, from its diamond. */
export function habitTick(diamond: Element | null, color: string, streakNext: number) {
  haptic(streakNext > 0 && streakNext % 7 === 0 ? 'heavy' : 'success');
  if (!diamond) return;
  const at = centerOf(diamond);
  spinPop(diamond);
  ripple(at.x, at.y, color, 50);
  sparks(at.x, at.y, [color, getComputedStyle(document.documentElement).getPropertyValue('--xp').trim()], streakNext >= 7 ? 18 : 10);
}

// ---------------- sliding thumbs on every segmented control ----------------
// Every ".seg-ctl" in the app gets a highlight that slides (with a little overshoot) to the chosen option,
// instead of the option's background just switching. One observer drives all of them.
let segObs: MutationObserver | null = null;
let segRaf = 0;
function placeThumbs() {
  segRaf = 0;
  document.querySelectorAll<HTMLElement>('.seg-ctl').forEach((ctl) => {
    if (ctl.offsetParent === null) return;
    const on = ctl.querySelector<HTMLElement>(':scope > button.on');
    if (!on) { ctl.classList.remove('has-thumb', 'thumb-ready'); return; }
    const x = on.offsetLeft, w = on.offsetWidth, y = on.offsetTop, h = on.offsetHeight;
    const prev = ctl.dataset.thumb;
    const next = `${x},${w},${y},${h}`;
    if (prev === next) return;
    ctl.dataset.thumb = next;
    ctl.style.setProperty('--tx', `${x}px`); ctl.style.setProperty('--tw', `${w}px`);
    ctl.style.setProperty('--ty', `${y}px`); ctl.style.setProperty('--th', `${h}px`);
    if (!ctl.classList.contains('has-thumb')) { ctl.classList.add('has-thumb'); requestAnimationFrame(() => ctl.classList.add('thumb-ready')); }
  });
}
const schedule = () => { if (!segRaf) segRaf = requestAnimationFrame(placeThumbs); };
export function startSegThumbs() {
  if (segObs || typeof MutationObserver === 'undefined') return;
  segObs = new MutationObserver(schedule);
  segObs.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', schedule);
  schedule();
}

