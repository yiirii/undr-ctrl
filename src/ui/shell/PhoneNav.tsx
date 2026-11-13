import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useStore, useProgress } from '../../store/store';
import { NAV_PAGES, type View } from '../../store/state';
import { Icon } from '../shapes/icons';
import { Bar, SPRING } from '../shapes/Progress';
import { useTitle } from './Sidebar';
import { sfx } from '../sound/synth';
import { haptic, stagger } from '../motion/juice';


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
    <button className="phone-top" onClick={() => go('profile')} aria-label={`Level ${p.char.level}, ${title}. Open profile`}>
      <span className="pt-lv"><Icon name="hex" size={12} stroke={2.6} />Lv {p.char.level}</span>
      <span className="pt-main">
        <span className="pt-row"><span className="phone-title">{title}</span><span className="pt-xp num">{p.char.into}<i>/{p.char.need} XP</i></span></span>
        <Bar className="xp-target" value={p.char.into} max={p.char.need} color="var(--xp)" height={6} />
      </span>
      <Icon name="right" size={16} />
    </button>
  );
}

/** Bottom tab bar: My Day · Money · + · Insights · More. */
export function PhoneNav() {
  const view = useStore((x) => x.ui.view);
  const setUI = useStore((x) => x.setUI);
  const go = useStore((x) => x.go);
  const moreActive = !['myday', 'money', 'insights'].includes(view);
  const qaOpen = useStore((x) => !!x.ui.quickActions);
  // One highlight slides under the active tab. Tab centres are measured once (and on resize),
  // so switching tabs only changes a transform: no layout work on the tap.
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const centres = useRef<number[]>([]);
  const activeIdx = view === 'myday' ? 0 : view === 'money' ? 1 : view === 'insights' ? 2 : 3;
  const activeIdxRef = useRef(activeIdx);
  activeIdxRef.current = activeIdx;
  useLayoutEffect(() => {
    const measure = () => {
      const tabs = navRef.current?.querySelectorAll<HTMLElement>('.pn-tab');
      centres.current = tabs ? Array.from(tabs, (t) => t.offsetLeft + t.offsetWidth / 2) : [];
      // the highlight wraps the whole tab: icon and label
      const t = tabs?.[0], pill = pillRef.current;
      if (t && pill) { const w = Math.min(t.offsetWidth - 6, 84); pill.style.width = `${w}px`; pill.style.marginLeft = `${-w / 2}px`; pill.style.top = `${t.offsetTop + 2}px`; pill.style.height = `${t.offsetHeight - 4}px`; }
      const el = pillRef.current, x = centres.current[activeIdxRef.current];
      if (el && x !== undefined) el.style.transform = `translateX(${x}px)`;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  useLayoutEffect(() => {
    const el = pillRef.current, x = centres.current[activeIdx];
    if (!el || x === undefined) return;
    el.style.transform = `translateX(${x}px)`;
    if (!el.classList.contains('ready')) requestAnimationFrame(() => el.classList.add('ready'));
  }, [activeIdx]);
  // Tabs switch the moment your finger touches them (like iOS), not when it lifts.
  // (Only tabs: a button that opens a sheet must wait for the lift, or the lift would land on the sheet.)
  // Tapping the tab you're already on scrolls back to the top.
  const touched = useRef(0);
  const nav = (v: View) => {
    if (useStore.getState().ui.view === v) { document.querySelector('.main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    haptic('light');
    go(v); setUI({ moreOpen: false, detailId: null });
  };
  const press = (f: () => void) => ({
    onPointerDown: (e: React.PointerEvent) => { if (e.pointerType !== 'mouse' && e.isPrimary) { touched.current = Date.now(); f(); } },
    onClick: () => { if (Date.now() - touched.current > 700) f(); },
  });
  const tab = (t: (typeof TABS)[number]) => (
    <button key={t.v} className={`pn-tab ${view === t.v ? 'on' : ''}`} {...press(() => nav(t.v))}>
      <motion.span className="pn-ico" initial={false} animate={view === t.v ? { scale: [1, 1.24, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }} transition={{ duration: 0.42, ease: 'easeOut' }}><Icon name={t.icon} size={22} /></motion.span><span>{t.label}</span>
    </button>
  );
  return (
    <nav className="phone-nav" aria-label="Main" ref={navRef}>
      <span className="pn-pill" ref={pillRef} aria-hidden />
      {tab(TABS[0])}{tab(TABS[1])}
      <button className="pn-plus" aria-label="Quick add" onClick={() => { sfx.pop(); haptic('medium'); setUI({ quickActions: true }); }}><motion.span style={{ display: 'grid' }} animate={{ rotate: qaOpen ? 135 : 0, scale: qaOpen ? 0.9 : 1 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}><Icon name="plus" size={26} stroke={2.6} /></motion.span></button>
      {tab(TABS[2])}
      <button className={`pn-tab ${moreActive ? 'on' : ''}`} onClick={() => { haptic('light'); setUI({ moreOpen: true }); }}><motion.span className="pn-ico" initial={false} animate={moreActive ? { scale: [1, 1.24, 1], y: [0, -3, 0] } : { scale: 1, y: 0 }} transition={{ duration: 0.42, ease: 'easeOut' }}><Icon name="dots" size={22} /></motion.span><span>More</span></button>
    </nav>
  );
}

function PhoneSheet({ onClose, children, title }: { onClose: () => void; children: React.ReactNode; title: string }) {
  const present = useIsPresent();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { stagger(ref.current, { selector: '.more-row, .more-sep', step: 22, max: 14, y: 14 }); }, []);
  return (
    <motion.div className="modal phone-sheet-bg" style={{ pointerEvents: present ? 'auto' : 'none' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.14 } }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div ref={ref} className="phone-sheet" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 40, transition: { duration: 0.14 } }} transition={SPRING}>
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
  const pick = (f: () => void) => { haptic('light'); close(); setTimeout(f, 60); };
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
  const to = (v: View) => { haptic('light'); go(v); setUI({ moreOpen: false, detailId: null }); };
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
