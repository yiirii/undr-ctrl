// The iPhone (Home Screen) app updates itself. iOS keeps the app paused in the background for days,
// so a fresh version would otherwise wait until the app is fully closed. Each time the app comes back
// to the front (and every 30 min while open) it asks the site which build is current; if it's newer,
// it reloads quietly at a calm moment: nothing open, nothing being typed, no change in the last 3 s.
import { useStore } from '../../store/store';

export const buildId = (s: string): string | null => s.match(/index-[\w-]+\.js/)?.[0] ?? null;
export const isNewBuild = (current: string | null, html: string) => { const next = buildId(html); return !!current && !!next && next !== current; };

const CHECK_GAP = 60_000, EVERY = 30 * 60_000;

export function startWebUpdates() {
  const script = document.querySelector<HTMLScriptElement>('script[type="module"][src*="index-"]');
  const current = script ? buildId(script.src) : null;
  if (!current) return;
  let lastCheck = Date.now(), pending = false, lastChange = Date.now(), timer: ReturnType<typeof setInterval> | null = null;
  useStore.subscribe(() => { lastChange = Date.now(); });

  const calm = () => {
    const ui = useStore.getState().ui as unknown as Record<string, unknown>;
    const open = ['logSheet', 'bizSheet', 'quickAdd', 'quickActions', 'moreOpen', 'detailId', 'recapMonth'].some((k) => !!ui[k]);
    const typing = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;
    return !open && !typing && !document.querySelector('.modal, .levelup, .recap') && Date.now() - lastChange > 3000;
  };
  const tryApply = () => {
    if (!pending || timer) return;
    timer = setInterval(() => { if (document.visibilityState === 'visible' && calm()) { if (timer) clearInterval(timer); location.reload(); } }, 1500);
  };
  const check = async () => {
    if (pending || Date.now() - lastCheck < CHECK_GAP || !navigator.onLine) return;
    lastCheck = Date.now();
    try {
      const html = await (await fetch(`./index.html?fresh=${Date.now()}`, { cache: 'no-store' })).text();
      if (isNewBuild(current, html)) { pending = true; tryApply(); }
    } catch { /* offline: try next time */ }
  };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void check(); });
  setInterval(() => { if (document.visibilityState === 'visible') void check(); }, EVERY);
}
