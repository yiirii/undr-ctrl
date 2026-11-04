import { AnimatePresence, motion , PresenceContext } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { Sidebar } from './Sidebar';
import { TaskDetail } from './TaskDetail';
import { QuickAdd } from './QuickAdd';
import { MyDay, Planned, ListView, Habits } from '../views/Todo';
import { Money, MoneyOverlays } from '../views/Money';
import { Profile } from '../views/Profile';
import { Quests } from '../views/Quests';
import { Settings } from '../views/Settings';
import { Focus, FocusTicker } from '../views/Focus';
import { Onboarding } from '../views/Onboarding';
import { Moments } from '../motion/Moments';
import { Reminders } from './Reminders';
import { Insights } from '../views/Insights';
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
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={view} className="main-scroll" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}>
        {/* Isolate the page's contents from the page transition: a layout card unmounting inside a page
            (e.g. switching Money tabs) must never be able to hold the page's exit open and freeze navigation. */}
        <PresenceContext.Provider value={null}>{el}</PresenceContext.Provider>
      </motion.div>
    </AnimatePresence>
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
    return () => { window.removeEventListener('keydown', key); offs.forEach((o) => o?.()); clearInterval(iv); clearTimeout(first); };
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
