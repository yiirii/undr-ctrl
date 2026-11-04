import { AnimatePresence, motion, PresenceContext } from 'framer-motion';
import { lazy, memo, startTransition, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Freeze, whenIdle } from '../shapes/Keep';
import type { View } from '../../store/state';
import { useStore } from '../../store/store';
import { Sidebar } from './Sidebar';
import { TaskDetail } from './TaskDetail';
import { QuickAdd } from './QuickAdd';
import { MyDay, Planned, ListView, Habits } from '../views/Todo';
import { Money, MoneyOverlays } from '../views/Money';
import { Focus, FocusTicker } from '../views/Focus';
import { Onboarding } from '../views/Onboarding';
import { Moments } from '../motion/Moments';
import { Reminders } from './Reminders';
import { BizSheets } from '../views/money/Business';
import { useSync } from '../../sync/service';
import { SyncPanel } from '../views/SyncPanel';
import { Ambient } from '../shapes/Ambient';
import { PhoneNav, PhoneTop, QuickActions, MoreSheet, useIsPhone } from './PhoneNav';
import { Icon } from '../shapes/icons';
import { cloudBackup } from '../../persistence/cloud';
import { bridge } from '../../bridge';
import { act } from '../../store/store';
import { rollover } from '../../store/logic';

// Less-visited pages load in their own chunks, fetched while the app is idle after start-up.
const loadInsights = () => import('../views/Insights');
const loadSettings = () => import('../views/Settings');
const loadProfile = () => import('../views/Profile');
const loadQuests = () => import('../views/Quests');
const Insights = lazy(() => loadInsights().then((m) => ({ default: m.Insights })));
const Settings = lazy(() => loadSettings().then((m) => ({ default: m.Settings })));
const Profile = lazy(() => loadProfile().then((m) => ({ default: m.Profile })));
const Quests = lazy(() => loadQuests().then((m) => ({ default: m.Quests })));
export function prefetchPages() { for (const f of [loadInsights, loadSettings, loadProfile, loadQuests]) void f().catch(() => {}); }

function pageFor(view: string) {
  if (view === 'myday') return <MyDay />;
  if (view === 'planned') return <Planned />;
  if (view === 'habits') return <Habits />;
  if (view === 'money') return <Money />;
  if (view === 'insights') return <Insights />;
  if (view === 'quests') return <Quests />;
  if (view === 'profile') return <Profile />;
  if (view === 'settings') return <Settings />;
  if (view === 'focus') return <Focus />;
  if (view.startsWith('list:')) return <ListView id={view.slice(5)} />;
  return null;
}

/**
 * One page, kept alive once visited. When you leave it, it stays in memory, hidden and paused,
 * so coming back is instant and keeps your scroll position. Only the visible page is ".main-scroll".
 */
const PageSlot = memo(function PageSlot({ view, active }: { view: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const top = useRef(0);
  const [committed, setCommitted] = useState(false);
  useEffect(() => setCommitted(true), []);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    if (top.current) el.scrollTop = top.current; // (setting it forces a layout; a page shown again starts at the top anyway)
    // the page eases in (fade + small rise), as before. It runs on the GPU and never holds up the tap:
    // the new page is there from the first frame.
    const reduced = document.documentElement.classList.contains('reduced-motion');
    el.animate?.(reduced ? [{ opacity: 0.6 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: reduced ? 120 : 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    // then the page builds in: header, cards and rows rise into place one after another (pure CSS, no measuring)
    if (!reduced) { el.classList.add('entering'); const t = setTimeout(() => el.classList.remove('entering'), 900); return () => { clearTimeout(t); el.classList.remove('entering'); }; }
  }, [active]);
  // the same element every time, so showing a kept page again doesn't redraw it from scratch
  const page = useMemo(() => pageFor(view), [view]);
  return (
    <div ref={ref} className={active ? 'main-scroll' : 'page-kept'} data-view={view} onScroll={(e) => { top.current = e.currentTarget.scrollTop; }}>
      <PresenceContext.Provider value={null}>
        <Freeze frozen={!active && committed}><Suspense fallback={null}>{page}</Suspense></Freeze>
      </PresenceContext.Provider>
    </div>
  );
});

const KEEP = 8; // pages kept alive at once (least recently used are let go)
const WARM: View[] = ['money', 'insights', 'planned'];

const Pages = memo(function Pages() {
  const view = useStore((x) => x.ui.view);
  const order = useRef<string[]>([]);
  const [, bump] = useState(0);
  if (order.current[order.current.length - 1] !== view) {
    order.current = [...order.current.filter((v) => v !== view), view].slice(-KEEP);
  }
  // after start-up, quietly prepare the pages you're most likely to open next
  useEffect(() => {
    let cancel = () => {};
    const next = (i: number) => {
      if (i >= WARM.length) return;
      cancel = whenIdle(() => {
        const v = WARM[i];
        if (!order.current.includes(v)) { order.current = [v, ...order.current].slice(-KEEP); startTransition(() => bump((n) => n + 1)); }
        const t = setTimeout(() => next(i + 1), 400);
        cancel = () => clearTimeout(t);
      });
    };
    const t = setTimeout(() => next(0), 1200);
    return () => { clearTimeout(t); cancel(); };
  }, []);
  // a stable order keeps React from moving DOM around when you switch
  const slots = [...order.current].sort();
  return <>{slots.map((v) => <PageSlot key={v} view={v} active={v === view} />)}</>;
});

export function App() {
  const phone = useIsPhone();
  // subscribe only to what this shell shows, so opening a sheet doesn't redraw the whole app
  const saveError = useStore((x) => x.ui.saveError);
  const recovered = useStore((x) => x.ui.recovered);
  const detailId = useStore((x) => x.ui.detailId);
  const quickAdd = useStore((x) => x.ui.quickAdd);
  const ui = { saveError, recovered, detailId, quickAdd };
  const onboarded = useStore((x) => x.s.profile.onboarded);
  const setUI = useStore((x) => x.setUI);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') { e.preventDefault(); setUI({ quickAdd: true }); }
      else if (e.ctrlKey && e.key.toLowerCase() === 'e') { e.preventDefault(); setUI({ logSheet: { kind: 'out' } }); }
      else if (e.key === 'Escape') { const u = useStore.getState().ui; if (u.quickAdd) setUI({ quickAdd: false }); else if (u.logSheet) setUI({ logSheet: false }); else if (u.detailId) setUI({ detailId: null }); }
    };
    window.addEventListener('keydown', key);
    const offs = [bridge()?.onOpenQuickAdd(() => setUI({ quickAdd: true })), bridge()?.onFocusTask((id) => setUI({ detailId: id }))];
    // midnight roll-over: check every minute
    // also: once a day, copy a single backup into the chosen Google Drive folder
    const iv = setInterval(() => { act(rollover, new Date()); void cloudBackup(); }, 60000);
    const first = setTimeout(() => void cloudBackup(), 5000);
    // coming back to the app (iPhone wakes it from the background): roll the day over at once
    const pf = setTimeout(prefetchPages, 1500);
    const vis = () => { if (document.visibilityState === 'visible') act(rollover, new Date()); };
    document.addEventListener('visibilitychange', vis);
    // iPhone: keep the field you're typing in clear of the on-screen keyboard
    let kbT: ReturnType<typeof setTimeout> | undefined;
    const focusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      if (!el.matches?.('input:not([type=checkbox]):not([type=range]), textarea') || !window.visualViewport || !matchMedia('(hover: none)').matches) return;
      clearTimeout(kbT);
      kbT = setTimeout(() => {
        const r = el.getBoundingClientRect(), vv = window.visualViewport!;
        if (r.bottom > vv.height - 12 || r.top < 0) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 320);
    };
    document.addEventListener('focusin', focusIn);
    return () => { window.removeEventListener('keydown', key); offs.forEach((o) => o?.()); clearInterval(iv); clearTimeout(first); clearTimeout(pf); clearTimeout(kbT); document.removeEventListener('visibilitychange', vis); document.removeEventListener('focusin', focusIn); };
  }, [setUI]);

  if (!onboarded) return <><FirstScreen /><Moments /></>;
  return (
    <div className={`app ${phone ? 'is-phone' : ''}`}>
      {phone ? <PhoneTop /> : <Sidebar />}
      <main className="main">
        {(ui.saveError || ui.recovered) && (
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
            <div className="banner">
              <Icon name="bell" size={16} />
              {ui.saveError ? 'Not saved yet. Undr Ctrl will keep trying.' : 'Your data file was damaged, so Undr Ctrl loaded the latest backup.'}
              {ui.recovered && <button className="icon-btn" onClick={() => setUI({ recovered: false })}><Icon name="x" size={14} /></button>}
            </div>
          </div>
        )}
        <Pages />
        <AnimatePresence>{ui.detailId && <TaskDetail id={ui.detailId} />}</AnimatePresence>
      </main>
      {ui.quickAdd && <QuickAdd />}
      <MoneyOverlays />
      <BizSheets />
      {phone && <><PhoneNav /><QuickActions /><MoreSheet /></>}
      <FocusTicker />
      <Reminders />
      <Moments />
    </div>
  );
}

/** Before onboarding: on the iPhone app, sign in first so your laptop's data comes down instead of starting blank. */
function FirstScreen() {
  const { enabled, ready, user, firstData } = useSync();
  const web = !bridge();
  const [skipped, setSkipped] = useState(() => { try { return localStorage.getItem('undr-skip-sync') === '1'; } catch { return false; } });
  const [waited, setWaited] = useState(false);
  useEffect(() => { if (user) { const t = setTimeout(() => setWaited(true), 9000); return () => clearTimeout(t); } }, [user]);
  if (!web || !enabled || skipped) return <Onboarding />;
  if (!ready) return <div className="first-screen"><Ambient size={140} /></div>;
  if (!user) return (
    <div className="first-screen">
      <div className="first-brand"><img src="./icons/icon-192.png" alt="" width={64} height={64} /><h1>Undr Ctrl</h1></div>
      <SyncPanel compact onSkip={() => { try { localStorage.setItem('undr-skip-sync', '1'); } catch { /* private mode */ } setSkipped(true); }} />
    </div>
  );
  if (!firstData && !waited) return <div className="first-screen"><Ambient size={140} /><div className="muted">Getting your data…</div></div>;
  return <Onboarding />;
}
