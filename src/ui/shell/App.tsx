import { AnimatePresence, motion, PresenceContext } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
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

function View() {
  const view = useStore((x) => x.ui.view);
  let el;
  if (view === 'myday') el = <MyDay />;
  else if (view === 'planned') el = <Planned />;
  else if (view === 'habits') el = <Habits />;
  else if (view === 'money') el = <Money />;
  else if (view === 'insights') el = <Insights />;
  else if (view === 'quests') el = <Quests />;
  else if (view === 'profile') el = <Profile />;
  else if (view === 'settings') el = <Settings />;
  else if (view === 'focus') el = <Focus />;
  else if (view.startsWith('list:')) el = <ListView id={view.slice(5)} />;
  // The new page swaps in at once and eases in; the old one never waits on an exit animation,
  // so a tab tap answers immediately and nothing can hold a page change open.
  return (
    <motion.div key={view} className="main-scroll" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}>
      <PresenceContext.Provider value={null}><Suspense fallback={null}>{el}</Suspense></PresenceContext.Provider>
    </motion.div>
  );
}

export function App() {
  const phone = useIsPhone();
  const ui = useStore((x) => x.ui);
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
        <View />
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
