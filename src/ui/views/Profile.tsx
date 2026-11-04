import { useStore, useProgress } from '../../store/store';
import { STATS, STAT_META, type Stat } from '../../core/types';
import { Radar } from '../shapes/Radar';
import { Bar } from '../shapes/Progress';
import { HexBadge } from './Badges';
import { ACHIEVEMENTS, achievementProgress } from '../../core/achievements';
import { buildFacts } from '../../store/facts';
import { rank, title as makeTitle } from '../../core/rules';
import { addDays, dayKey, weekStart } from '../../core/dates';
import { Icon } from '../shapes/icons';
import { Select } from '../shapes/Select';
import { useTitle } from '../shell/Sidebar';

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 120, H = 28;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - 2 - (v / max) * (H - 4)}`).join(' ');
  return <svg width={W} height={H}><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" /></svg>;
}

export function Profile() {
  const s = useStore((x) => x.s);
  const setSettings = useStore((x) => x.setSettings);
  const p = useProgress();
  const title = useTitle();
  const facts = buildFacts(s, new Date());
  const today = dayKey(new Date());
  const ws = weekStart(today, s.settings.weekStartsMonday);
  const levels = Object.fromEntries(STATS.map((k) => [k, p.stats[k].level])) as Record<Stat, number>;
  const frac = Object.fromEntries(STATS.map((k) => [k, p.stats[k].into / p.stats[k].need])) as Record<Stat, number>;
  const days = Array.from({ length: 30 }, (_, i) => addDays(today, i - 29));
  const spark = (st: Stat) => days.map((d) => s.ledger.filter((e) => e.stat === st && dayKey(new Date(e.at)) === d && e.amount > 0 && e.source !== 'drip' && e.source !== 'reverse').reduce((n, e) => n + e.amount, 0));
  const focusWeek = s.focusLog.filter((f) => f.day >= ws).reduce((n, f) => n + f.minutes, 0);
  const titles = ['', ...ACHIEVEMENTS.filter((a) => a.title && s.achievements.includes(a.id)).map((a) => a.title!)];
  const unlocked = ACHIEVEMENTS.filter((a) => s.achievements.includes(a.id)).length;
  const tierColor = (t: string) => (t === 'gold' ? 'var(--xp)' : t === 'silver' ? '#c9d1dc' : '#d79a6b');
  return (
    <div className="page page-wide">
      <div className="ph"><div><h1>{s.profile.name || 'You'}</h1><div className="sub">{title} · Level {p.char.level}</div></div></div>
      <div className="two" style={{ gridTemplateColumns: '360px 1fr', alignItems: 'start' }}>
        <div className="mcard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Radar levels={levels} progress={frac} size={320} labels />
          <div style={{ width: '100%' }}><Bar value={p.char.into} max={p.char.need} color="var(--xp)" height={10} showNumbers label={`Level ${p.char.level} → ${p.char.level + 1}`} format={(v) => `${Math.round(v)} XP`} /></div>
          <div className="row muted" style={{ width: '100%', fontSize: '.8rem', fontWeight: 600 }}><span>Lifetime</span><div className="grow" /><b style={{ color: 'var(--t1)' }}>{p.lifetime.toLocaleString()} XP</b></div>
          <label className="field" style={{ width: '100%' }}><span>Title</span>
            <Select ariaLabel="Title" value={s.settings.title ?? ''} onChange={(v) => setSettings({ title: v || undefined })} options={titles.map((t) => ({ value: t, label: t || `${makeTitle(p.char.level, p.topStat)} (automatic)` }))} />
          </label>
        </div>
        <div className="stack">
          <div className="mcard stack" style={{ gap: 16 }}>
            {STATS.map((st) => (
              <div key={st} className="row" style={{ gap: 16 }}>
                <HexBadge color={STAT_META[st].hue} label={String(p.stats[st].level)} size={40} />
                <div className="grow">
                  <Bar value={p.stats[st].into} max={p.stats[st].need} color={STAT_META[st].hue} height={8} showNumbers label={<b style={{ color: 'var(--t1)' }}>{STAT_META[st].name}</b>} format={(v) => `${Math.round(v)}`} />
                </div>
                <div title="Last 30 days"><Sparkline values={spark(st)} color={STAT_META[st].hue} /></div>
              </div>
            ))}
            {p.statXp.wea === 0 && <div className="muted" style={{ fontSize: '.8rem' }}>Wealth grows when you spend less than your daily budget and when you save toward goals.</div>}
          </div>
          <div className="two">
            <div className="mcard"><div className="hero-label">Tasks done</div><div className="hero-num" style={{ fontSize: '2rem' }}>{facts.tasksDoneTotal}</div><Bar value={facts.tasksDoneWeek} max={Math.max(15, facts.tasksDoneWeek)} label="This week" showNumbers height={6} /></div>
            <div className="mcard"><div className="hero-label">Focus this week</div><div className="hero-num" style={{ fontSize: '2rem' }}>{Math.floor(focusWeek / 60)}h {focusWeek % 60}m</div><Bar value={focusWeek} max={Math.max(180, focusWeek)} label="Goal 3h" showNumbers format={(v) => `${Math.round(v)}m`} height={6} color="var(--ok)" /></div>
          </div>
        </div>
      </div>
      <div className="section-label" style={{ marginTop: 34 }}>Achievements · {unlocked} of {ACHIEVEMENTS.length}</div>
      <Bar value={unlocked} max={ACHIEVEMENTS.length} height={6} color="var(--xp)" />
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const got = s.achievements.includes(a.id);
          const pr = achievementProgress(a, facts);
          return (
            <div key={a.id} className={`ach ${got ? 'got' : ''}`} title={a.desc}>
              <HexBadge color={tierColor(a.tier)} icon={got ? 'star' : 'lock'} size={46} locked={!got} progress={got ? undefined : pr.value / pr.target} />
              <div className="ach-name">{a.name}</div>
              <div className="ach-desc">{got ? a.desc : `${a.target >= 1000 ? `${Math.round(pr.value / 100)}/${a.target / 100}` : `${Math.floor(pr.value)}/${a.target}`}`}</div>
            </div>
          );
        })}
      </div>
      <div className="muted" style={{ fontSize: '.78rem', marginTop: 18 }}><Icon name="hex" size={12} /> Ranks: Novice 1 · Apprentice 5 · Journeyman 10 · Adept 20 · Master 35 · Grandmaster 50. You are {rank(p.char.level)}.</div>
    </div>
  );
}
