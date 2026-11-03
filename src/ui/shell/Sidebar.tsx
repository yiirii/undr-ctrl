import { useRef, useState } from 'react';
import { useStore, useProgress, act } from '../../store/store';
import { NAV_PAGES, type View } from '../../store/state';
import { Radar } from '../shapes/Radar';
import { Bar, Ring, SegBar } from '../shapes/Progress';
import { Icon } from '../shapes/icons';
import { STATS, STAT_META } from '../../core/types';
import { title as makeTitle } from '../../core/rules';
import { dayKey } from '../../core/dates';
import { myDayTasks, addList } from '../../store/logic';
import { MiniTimer } from './MiniTimer';
import { MiniPlayer } from '../music/MiniPlayer';

const PAGE_META: Record<string, { label: string; icon: string }> = {
  myday: { label: 'My Day', icon: 'sun' },
  planned: { label: 'Planned', icon: 'calendar' },
  habits: { label: 'Habits', icon: 'diamond' },
  money: { label: 'Money', icon: 'wallet' },
  insights: { label: 'Insights', icon: 'chart' },
  quests: { label: 'Quests', icon: 'flag' },
  profile: { label: 'Profile', icon: 'hex' },
};

export function useTitle() {
  const p = useProgress();
  const chosen = useStore((s) => s.s.settings.title);
  return chosen || makeTitle(p.char.level, p.topStat);
}

export function Sidebar() {
  const s = useStore((x) => x.s);
  const view = useStore((x) => x.ui.view);
  const go = useStore((x) => x.go);
  const setAppearance = useStore((x) => x.setAppearance);
  const p = useProgress();
  const title = useTitle();
  const today = dayKey(new Date());
  const md = myDayTasks(s, new Date());
  const mdDone = md.filter((t) => (t.habit ? t.completions.includes(today) : !!t.doneAt)).length;
  const levels = Object.fromEntries(STATS.map((k) => [k, p.stats[k].level])) as Record<(typeof STATS)[number], number>;
  const frac = Object.fromEntries(STATS.map((k) => [k, p.stats[k].into / p.stats[k].need])) as Record<(typeof STATS)[number], number>;
  const collapsed = s.appearance.sidebarCollapsed;
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const drag = useRef<{ x: number; w: number } | null>(null);

  const order = (s.settings.navOrder.length ? s.settings.navOrder : [...NAV_PAGES]).filter((k) => !s.settings.hiddenPages.includes(k) && PAGE_META[k]);
  const counts: Record<string, number> = {
    myday: md.filter((t) => (t.habit ? !t.completions.includes(today) : !t.doneAt)).length,
    planned: s.tasks.filter((t) => !t.habit && !t.doneAt && t.due).length,
    habits: s.tasks.filter((t) => t.habit && t.recurrence && !t.completions.includes(today) && md.includes(t)).length,
    quests: s.quests.filter((q) => !q.claimed && (q.kind === 'weekly' || q.period === today)).length,
  };

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, w: s.appearance.sidebarWidth };
    const move = (ev: PointerEvent) => { if (drag.current) setAppearance({ sidebarWidth: Math.round(Math.min(340, Math.max(220, drag.current.w + ev.clientX - drag.current.x))) }); };
    const up = () => { drag.current = null; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <aside className={`side ${collapsed ? 'collapsed' : ''}`}>
      <div className="me" onClick={() => go('profile')} title="Profile">
        <Radar levels={levels} progress={frac} size={collapsed ? 44 : 64} />
        <div className="me-text grow">
          <div className="me-name">{s.profile.name || 'You'}</div>
          <div className="me-title">{title}</div>
          <div className="me-lv"><Icon name="hex" size={11} stroke={2.6} />Lv {p.char.level}</div>
        </div>
      </div>

      <div className="side-bars">
        <div className="side-bar-row" title={`${p.char.into} / ${p.char.need} XP to level ${p.char.level + 1}`}>
          <span style={{ color: 'var(--xp)' }}>XP</span>
          <Bar value={p.char.into} max={p.char.need} color="var(--xp)" height={7} />
          <b className="num">{p.char.into}/{p.char.need}</b>
        </div>
        <div className="side-bar-row today-strip" title="My Day progress">
          <span>TODAY</span>
          <SegBar done={mdDone} total={md.length || 1} height={7} gap={3} color="var(--accent-fill)" />
          <b className="num">{md.length ? `${mdDone}/${md.length}` : '—'}</b>
        </div>
      </div>

      <MiniTimer />

      <nav className="nav-scroll">
        <div className="nav">
          {order.map((k) => (
            <button key={k} className={`nav-item ${view === k ? 'on' : ''}`} onClick={() => go(k as View)} title={PAGE_META[k].label}>
              <Icon name={PAGE_META[k].icon} />
              <span>{PAGE_META[k].label}</span>
              {counts[k] ? <span className="ct">{counts[k]}</span> : null}
            </button>
          ))}
        </div>
        <div className="nav-sec">Lists<button title="New list" onClick={() => setAdding(true)}><Icon name="plus" size={14} stroke={2.4} /></button></div>
        <div className="nav">
          {s.lists.map((l) => {
            const own = s.tasks.filter((t) => t.listId === l.id && !t.habit);
            const open = own.filter((t) => !t.doneAt).length;
            const doneN = own.length - open;
            return (
              <button key={l.id} className={`nav-item ${view === `list:${l.id}` ? 'on' : ''}`} onClick={() => go(`list:${l.id}`)} title={l.name}>
                <span className="list-dot" style={{ color: l.color }}>{l.emoji ? <span style={{ fontSize: 14 }}>{l.emoji}</span> : <Icon name={l.icon} size={16} />}</span>
                <span className="grow" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</span>
                <span className="ct row" style={{ gap: 6 }}>
                  {open > 0 && open}
                  {own.length > 0 && <Ring value={doneN} max={own.length} size={14} stroke={2.5} color={l.color} />}
                </span>
              </button>
            );
          })}
          {adding && (
            <form className="nav-item" onSubmit={(e) => { e.preventDefault(); act(addList, { name: newName, stat: null, icon: 'dot' }); setNewName(''); setAdding(false); }}>
              <span className="list-dot"><Icon name="dot" size={16} /></span>
              <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} onBlur={() => { if (!newName.trim()) setAdding(false); }} placeholder="List name" style={{ background: 'none', border: 0, outline: 'none', width: '100%' }} />
            </form>
          )}
        </div>
      </nav>

      <div className="side-foot">
        <MiniPlayer />
        <div className="row" style={{ gap: 2 }}>
          <button className={`nav-item ${view === 'settings' ? 'on' : ''}`} onClick={() => go('settings')} style={{ flex: 1 }} title="Settings"><Icon name="gear" /><span>Settings</span></button>
          {!collapsed && <button className="icon-btn" title="Collapse sidebar" onClick={() => setAppearance({ sidebarCollapsed: true })}><Icon name="sidebar" /></button>}
          {collapsed && <button className="icon-btn" title="Expand sidebar" onClick={() => setAppearance({ sidebarCollapsed: false })}><Icon name="sidebar" /></button>}
        </div>
      </div>
      {!collapsed && <div className="side-resize" onPointerDown={onDown} />}
    </aside>
  );
}

export { STAT_META };
