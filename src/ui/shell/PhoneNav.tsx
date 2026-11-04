import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useStore, useProgress } from '../../store/store';
import { NAV_PAGES, type View } from '../../store/state';
import { Icon } from '../shapes/icons';
import { Bar, SPRING } from '../shapes/Progress';
import { useTitle } from './Sidebar';
import { sfx } from '../sound/synth';

/** True on a phone-sized screen (the phone layout replaces the sidebar). */
export function useIsPhone() {
  const q = '(max-width: 720px)';
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(q).matches);
  useEffect(() => { const mm = window.matchMedia(q); const f = () => setM(mm.matches); mm.addEventListener('change', f); return () => mm.removeEventListener('change', f); }, []);
  return m;
}

const TABS: { v: View; label: string; icon: string }[] = [
  { v: 'myday', label: 'My Day', icon: 'sun' },
  { v: 'money', label: 'Money', icon: 'wallet' },
  { v: 'insights', label: 'Insights', icon: 'chart' },
];
const MORE_META: Record<string, { label: string; icon: string }> = {
  planned: { label: 'Planned', icon: 'calendar' }, habits: { label: 'Habits', icon: 'diamond' }, quests: { label: 'Quests', icon: 'flag' }, profile: { label: 'Profile', icon: 'hex' },
};

/** Top strip on phone: level + XP, tap for Profile. */
export function PhoneTop() {
  const p = useProgress();
  const title = useTitle();
  const go = useStore((x) => x.go);
  return (
    <button className="phone-top" onClick={() => go('profile')}>
      <span className="me-lv"><Icon name="hex" size={11} stroke={2.6} />Lv {p.char.level}</span>
      <span className="phone-title">{title}</span>
      <span className="grow"><Bar value={p.char.into} max={p.char.need} color="var(--xp)" height={5} /></span>
    </button>
  );
}

/** Bottom tab bar: My Day · Money · + · Insights · More. */
export function PhoneNav() {
  const view = useStore((x) => x.ui.view);
  const setUI = useStore((x) => x.setUI);
  const go = useStore((x) => x.go);
  const moreActive = !['myday', 'money', 'insights'].includes(view);
  // Tabs switch the moment your finger touches them (like iOS), not when it lifts.
  // (Only tabs: a button that opens a sheet must wait for the lift, or the lift would land on the sheet.)
  // Tapping the tab you're already on scrolls back to the top.
  const touched = useRef(0);
  const nav = (v: View) => {
    if (useStore.getState().ui.view === v) { document.querySelector('.main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    go(v); setUI({ moreOpen: false, detailId: null });
  };
  const press = (f: () => void) => ({
    onPointerDown: (e: React.PointerEvent) => { if (e.pointerType !== 'mouse' && e.isPrimary) { touched.current = Date.now(); f(); } },
    onClick: () => { if (Date.now() - touched.current > 700) f(); },
  });
  const tab = (t: (typeof TABS)[number]) => (
    <button key={t.v} className={`pn-tab ${view === t.v ? 'on' : ''}`} {...press(() => nav(t.v))}>
      <Icon name={t.icon} size={22} /><span>{t.label}</span>
    </button>
  );
  return (
    <nav className="phone-nav" aria-label="Main">
      {tab(TABS[0])}{tab(TABS[1])}
      <button className="pn-plus" aria-label="Quick add" onClick={() => { sfx.pop(); setUI({ quickActions: true }); }}><Icon name="plus" size={26} stroke={2.6} /></button>
      {tab(TABS[2])}
      <button className={`pn-tab ${moreActive ? 'on' : ''}`} onClick={() => setUI({ moreOpen: true })}><Icon name="dots" size={22} /><span>More</span></button>
    </nav>
  );
}

function PhoneSheet({ onClose, children, title }: { onClose: () => void; children: React.ReactNode; title: string }) {
  const present = useIsPresent();
  return (
    <motion.div className="modal phone-sheet-bg" style={{ pointerEvents: present ? 'auto' : 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div className="phone-sheet" initial={{ y: 48 }} animate={{ y: 0 }} exit={{ y: 40, transition: { duration: 0.12 } }} transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0.9, 0.25, 1] }}>
        <div className="ps-grab" />
        <div className="ps-title">{title}</div>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** The + sheet: the things you log on the go. */
export function QuickActions() {
  const open = useStore((x) => !!x.ui.quickActions);
  const setUI = useStore((x) => x.setUI);
  const close = () => setUI({ quickActions: false });
  const pick = (f: () => void) => { close(); setTimeout(f, 60); };
  const items: { label: string; icon: string; tone: string; run: () => void }[] = [
    { label: 'Sold', icon: 'coins', tone: 'var(--in)', run: () => setUI({ bizSheet: { kind: 'sell' } }) },
    { label: 'Bought', icon: 'bag', tone: 'var(--wea)', run: () => setUI({ bizSheet: { kind: 'buy' } }) },
    { label: 'Reserve', icon: 'lock', tone: 'var(--xp)', run: () => setUI({ bizSheet: { kind: 'reserve' } }) },
    { label: 'Expense', icon: 'wallet', tone: 'var(--warn)', run: () => setUI({ logSheet: { kind: 'out' } }) },
    { label: 'Income', icon: 'download', tone: 'var(--in)', run: () => setUI({ logSheet: { kind: 'in' } }) },
    { label: 'Task', icon: 'check', tone: 'var(--int)', run: () => setUI({ quickAdd: true }) },
  ];
  return (
    <AnimatePresence>
      {open && (
        <PhoneSheet key="qa" title="Log something" onClose={close}>
          <div className="qa-grid">
            {items.map((it, i) => (
              <motion.button key={it.label} className="qa-btn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: i * 0.03 }} onClick={() => pick(it.run)}>
                <span className="qa-ico" style={{ color: it.tone, background: `color-mix(in srgb, ${it.tone} 16%, transparent)` }}><Icon name={it.icon} size={22} /></span>
                {it.label}
              </motion.button>
            ))}
          </div>
        </PhoneSheet>
      )}
    </AnimatePresence>
  );
}

/** The More sheet: every other page and your lists. */
export function MoreSheet() {
  const open = useStore((x) => !!x.ui.moreOpen);
  const s = useStore((x) => x.s);
  const setUI = useStore((x) => x.setUI);
  const go = useStore((x) => x.go);
  const close = () => setUI({ moreOpen: false });
  const to = (v: View) => { go(v); setUI({ moreOpen: false, detailId: null }); };
  const pages = (s.settings.navOrder.length ? s.settings.navOrder : [...NAV_PAGES]).filter((k) => MORE_META[k] && !s.settings.hiddenPages.includes(k));
  return (
    <AnimatePresence>
      {open && (
        <PhoneSheet key="more" title="More" onClose={close}>
          <div className="more-list">
            {pages.map((k) => <button key={k} className="more-row" onClick={() => to(k as View)}><Icon name={MORE_META[k].icon} size={19} />{MORE_META[k].label}</button>)}
            <div className="more-sep">Lists</div>
            {s.lists.map((l) => <button key={l.id} className="more-row" onClick={() => to(`list:${l.id}`)}><span className="sdot" style={{ background: l.color }} />{l.name}</button>)}
            <div className="more-sep" />
            <button className="more-row" onClick={() => to('settings')}><Icon name="gear" size={19} />Settings</button>
          </div>
        </PhoneSheet>
      )}
    </AnimatePresence>
  );
}
