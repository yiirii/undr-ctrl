import { AnimatePresence, motion } from 'framer-motion';
import { useStore, act } from '../../store/store';
import { rerollQuest } from '../../store/logic';
import { questProgress, questUnit, questStat } from '../../core/quests';
import { buildFacts } from '../../store/facts';
import { dayKey, weekStart, addDays, diffDays } from '../../core/dates';
import { QUEST_XP } from '../../core/rules';
import { STAT_META, type Quest } from '../../core/types';
import { Bar, SegBar, SPRING } from '../shapes/Progress';
import { Icon } from '../shapes/icons';
import { HexBadge } from './Badges';
import { formatRM } from '../../core/money';
import { useNow } from '../shell/MiniTimer';

function QuestCard({ q, canReroll }: { q: Quest; canReroll: boolean }) {
  const s = useStore((x) => x.s);
  const f = buildFacts(s, new Date());
  const pr = questProgress(q, f);
  const unit = questUnit(q);
  const st = questStat(q);
  const color = q.claimed ? 'var(--ok)' : st ? STAT_META[st].hue : 'var(--xp)';
  const fmtV = (v: number) => (unit === 'sen' ? formatRM(v) : unit === 'min' ? `${Math.round(v)}m` : String(Math.round(v)));
  return (
    <motion.div layout className={`quest ${q.claimed ? 'claimed' : ''}`} initial={{ rotateX: 0 }} animate={{ rotateX: q.claimed ? 360 : 0 }} transition={{ duration: 0.7, ease: [0.3, 1.2, 0.4, 1] }}>
      <HexBadge color={color} icon={q.claimed ? 'check' : 'flag'} size={42} />
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 8 }}><b style={{ fontSize: '.95rem' }}>{q.label}</b>{q.claimed && <span className="chip ok">Done</span>}</div>
        <div style={{ marginTop: 10 }}>
          {pr.target <= 10 && !unit ? <SegBar done={pr.done} total={pr.target} color={color} height={8} /> : <Bar value={pr.done} max={pr.target} color={color} height={8} />}
        </div>
        <div className="row muted" style={{ fontSize: '.76rem', fontWeight: 700, marginTop: 7 }}><span>{fmtV(pr.done)} / {fmtV(pr.target)}</span><div className="grow" /><span style={{ color: 'var(--xp)' }}>+{QUEST_XP[q.kind]} XP</span></div>
      </div>
      {canReroll && !q.claimed && <button className="icon-btn" title="Reroll (1 free per day)" onClick={() => act(rerollQuest, q.id, new Date())}><Icon name="repeat" /></button>}
    </motion.div>
  );
}

export function Quests() {
  const s = useStore((x) => x.s);
  const now = useNow(30000);
  const today = dayKey(new Date(now));
  const ws = weekStart(today, s.settings.weekStartsMonday);
  const daily = s.quests.filter((q) => q.kind === 'daily' && q.period === today);
  const weekly = s.quests.filter((q) => q.kind === 'weekly' && q.period === ws);
  const canReroll = s.rerollDay !== today;
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  const hrs = Math.max(0, Math.round((midnight.getTime() - now) / 3600000));
  const weekLeft = diffDays(today, addDays(ws, 7));
  return (
    <div className="page">
      <div className="ph"><div><h1>Quests</h1><div className="sub">Small missions that reward showing up. {canReroll ? 'One free reroll today.' : 'Reroll used today.'}</div></div></div>
      <div className="section-label" style={{ marginTop: 0 }}>Daily · resets in {hrs}h<div className="grow" /><span style={{ letterSpacing: 0 }}>{daily.filter((q) => q.claimed).length}/{daily.length}</span></div>
      <SegBar done={daily.filter((q) => q.claimed).length} total={daily.length || 3} height={10} gap={6} color="var(--xp)" />
      <div className="stack" style={{ marginTop: 14 }}><AnimatePresence>{daily.map((q) => <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}><QuestCard q={q} canReroll={canReroll} /></motion.div>)}</AnimatePresence></div>
      <div className="section-label">Weekly · {weekLeft} day{weekLeft === 1 ? '' : 's'} left<div className="grow" /><span style={{ letterSpacing: 0 }}>{weekly.filter((q) => q.claimed).length}/{weekly.length}</span></div>
      <SegBar done={weekly.filter((q) => q.claimed).length} total={weekly.length || 2} height={10} gap={6} color="var(--xp)" />
      <div className="stack" style={{ marginTop: 14 }}>{weekly.map((q) => <QuestCard key={q.id} q={q} canReroll={canReroll} />)}</div>
      <div className="card flat row" style={{ marginTop: 28, gap: 14 }}><Icon name="sparkle" /><span className="dim" style={{ fontSize: '.88rem' }}>Quests lean toward the lists you actually use. {s.questsCompleted} completed so far.</span></div>
    </div>
  );
}
