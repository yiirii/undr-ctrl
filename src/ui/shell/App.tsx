import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
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
import { Icon } from '../shapes/icons';
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
  else if (view === 'quests') el = <Quests />;
  else if (view === 'profile') el = <Profile />;
  else if (view === 'settings') el = <Settings />;
  else if (view === 'focus') el = <Focus />;
  else if (view.startsWith('list:')) el = <ListView id={view.slice(5)} />;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={view} className="main-scroll" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}>
        {el}
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
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
    const iv = setInterval(() => act(rollover, new Date()), 60000);
    return () => { window.removeEventListener('keydown', key); offs.forEach((o) => o?.()); clearInterval(iv); };
  }, [setUI]);

  if (!onboarded) return <><Onboarding /><Moments /></>;
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        {(ui.saveError || ui.recovered) && (
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
            <div className="banner">
              <Icon name="bell" size={16} />
              {ui.saveError ? 'Not saved yet. Lofi will keep trying.' : 'Your data file was damaged, so Lofi loaded the latest backup.'}
              {ui.recovered && <button className="icon-btn" onClick={() => setUI({ recovered: false })}><Icon name="x" size={14} /></button>}
            </div>
          </div>
        )}
        <View />
        <AnimatePresence>{ui.detailId && <TaskDetail id={ui.detailId} />}</AnimatePresence>
      </main>
      {ui.quickAdd && <QuickAdd />}
      <MoneyOverlays />
      <FocusTicker />
      <Moments />
    </div>
  );
}
