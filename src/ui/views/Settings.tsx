import { useRef, useState } from 'react';
import { useStore, useProgress, act } from '../../store/store';
import { NAV_PAGES } from '../../store/state';
import { THEMES, THEME_LABELS, ACCENTS, FONTS, DEFAULT_APPEARANCE, type ThemeId, type Appearance } from '../../core/appearance';
import { UNLOCKS, isUnlocked, nextUnlock, lockedValue } from '../../core/unlocks';
import { upsertCategory, addSource } from '../../store/logic';
import { Icon } from '../shapes/icons';
import { Select } from '../shapes/Select';
import { Bar, SegBar, Ring } from '../shapes/Progress';
import { cloudBackup } from '../../persistence/cloud';
import { bridge } from '../../bridge';
import { SyncPanel } from './SyncPanel';
import { sfx } from '../sound/synth';
import { getPlayer, useMusic, fmtSec } from '../music/service';
import { Cover } from '../music/Cover';
import { Setup } from './money/Setup';
import { CatIcon } from './money/parts';
import { useFmt } from '../format';
import { uid } from '../../core/id';
import { parseAmount } from '../../core/money';
import type { Track } from '../../core/types';

const TABS = ['General', 'Appearance', 'Money', 'Music', 'Sync', 'Data'] as const;

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div className="set-row"><div className="grow"><div className="set-l">{label}</div>{hint && <div className="set-h">{hint}</div>}</div>{children}</div>;
}
const Toggle = ({ on, set }: { on: boolean; set: (v: boolean) => void }) => <button className={`toggle ${on ? 'on' : ''}`} onClick={() => set(!on)} aria-pressed={on} />;

export function Settings() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('General');
  return (
    <div className="page page-wide">
      <div className="ph"><div><h1>Settings</h1><div className="sub">Make Undr Ctrl yours</div></div></div>
      <div className="seg-ctl" style={{ marginBottom: 22 }}>{TABS.map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      {tab === 'General' && <General />}
      {tab === 'Appearance' && <AppearanceTab />}
      {tab === 'Money' && <MoneyTab />}
      {tab === 'Music' && <MusicTab />}
      {tab === 'Sync' && <SyncPanel />}
      {tab === 'Data' && <DataTab />}
    </div>
  );
}

function General() {
  const s = useStore((x) => x.s);
  const st = s.settings;
  const set = useStore((x) => x.setSettings);
  const patch = useStore((x) => x.patch);
  const p = useProgress();
  const PAGE_LABEL: Record<string, string> = { myday: 'My Day', planned: 'Planned', habits: 'Habits', money: 'Money', quests: 'Quests', profile: 'Profile' };
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <div className="mcard stack">
        <Row label="Your name"><input className="input" style={{ width: 240 }} value={s.profile.name} onChange={(e) => patch((x) => ({ ...x, profile: { ...x.profile, name: e.target.value } }))} /></Row>
        <Row label="Start with Windows" hint="Opens quietly to the tray when you log in, so reminders always work. Music never auto-plays."><Toggle on={st.startWithWindows} set={(v) => { set({ startWithWindows: v }); bridge()?.setStartup(v); }} /></Row>
        <Row label="Start page"><Select ariaLabel="Start page" style={{ width: 200 }} value={st.startPage as string} onChange={(v) => set({ startPage: v as never })} options={[...NAV_PAGES.filter((k) => k !== 'quests'), ...s.lists.map((l) => `list:${l.id}`)].map((k) => ({ value: k as string, label: PAGE_LABEL[k] ?? s.lists.find((l) => `list:${l.id}` === k)?.name ?? k }))} /></Row>
        <Row label="Week starts on"><div className="seg-ctl"><button className={st.weekStartsMonday ? 'on' : ''} onClick={() => set({ weekStartsMonday: true })}>Monday</button><button className={!st.weekStartsMonday ? 'on' : ''} onClick={() => set({ weekStartsMonday: false })}>Sunday</button></div></Row>
        <Row label="Date format"><div className="seg-ctl">{(['short', 'dmy', 'iso'] as const).map((f) => <button key={f} className={st.dateFormat === f ? 'on' : ''} onClick={() => set({ dateFormat: f })}>{f === 'short' ? '3 Nov' : f === 'dmy' ? '03/11' : '2026-11-03'}</button>)}</div></Row>
        <Row label="Time format"><div className="seg-ctl"><button className={!st.time24 ? 'on' : ''} onClick={() => set({ time24: false })}>5 PM</button><button className={st.time24 ? 'on' : ''} onClick={() => set({ time24: true })}>17:00</button></div></Row>
      </div>
      <div className="mcard stack">
        <Row label="Sound pack" hint="Earn more by levelling up.">
          <div className="seg-ctl">{(['soft', 'glass', 'wood', 'chime'] as const).map((k) => { const locked = lockedValue('sound', k, p.char.level, s.achievements); return <button key={k} disabled={locked} title={locked ? UNLOCKS.find((u) => u.value === k)?.req.level ? `Reach Lv ${UNLOCKS.find((u) => u.value === k)!.req.level}` : 'Earned from an achievement' : ''} className={st.sound === k ? 'on' : ''} onClick={() => { set({ sound: k }); sfx.preview(k); }}>{locked && <Icon name="lock" size={12} />} {k[0].toUpperCase() + k.slice(1)}</button>; })}</div>
        </Row>
        <Row label="Volume"><input type="range" min={0} max={1} step={0.05} value={st.volume} onChange={(e) => set({ volume: Number(e.target.value) })} style={{ width: 200 }} onMouseUp={() => sfx.check()} /></Row>
        <Row label="Mute all sounds"><Toggle on={st.muted} set={(v) => set({ muted: v })} /></Row>
        <Row label="Reduced motion" hint="Swaps springs and particles for simple fades."><Toggle on={st.reducedMotion} set={(v) => set({ reducedMotion: v })} /></Row>
      </div>
      <div className="mcard stack">
        <Row label="Focus length"><div className="seg-ctl">{[15, 25, 45, 50].map((m) => <button key={m} className={s.focusSettings.focusMin === m ? 'on' : ''} onClick={() => patch((x) => ({ ...x, focusSettings: { ...x.focusSettings, focusMin: m } }))}>{m}m</button>)}</div></Row>
        <Row label="Break length"><div className="seg-ctl">{[5, 10, 15].map((m) => <button key={m} className={s.focusSettings.breakMin === m ? 'on' : ''} onClick={() => patch((x) => ({ ...x, focusSettings: { ...x.focusSettings, breakMin: m } }))}>{m}m</button>)}</div></Row>
        <Row label="Start breaks automatically"><Toggle on={s.focusSettings.autoBreak} set={(v) => patch((x) => ({ ...x, focusSettings: { ...x.focusSettings, autoBreak: v } }))} /></Row>
      </div>
    </div>
  );
}

function ThemeTile({ id, on, locked, req, pick }: { id: Exclude<ThemeId, 'system'> | 'system'; on: boolean; locked: boolean; req?: string; pick: () => void }) {
  const t = id === 'system' ? THEMES.discord : THEMES[id];
  const t2 = id === 'system' ? THEMES.light : t;
  return (
    <button className={`theme-tile ${on ? 'on' : ''} ${locked ? 'locked' : ''}`} onClick={() => !locked && pick()} title={locked ? req : THEME_LABELS[id]}>
      <div className="theme-prev" style={{ background: t.bg0 }}>
        <div style={{ background: id === 'aurora' ? (t as typeof THEMES.aurora).sidebarGradient : t.bg1, width: '32%' }} />
        <div style={{ flex: 1, background: (t as { gradient?: string }).gradient ?? (id === 'system' ? `linear-gradient(90deg, ${t.bg2} 50%, ${t2.bg2} 50%)` : t.bg2), padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <i style={{ background: t.t1, width: '60%' }} /><i style={{ background: t.t3, width: '40%' }} /><i style={{ background: t.int, width: '75%' }} />
        </div>
      </div>
      <div className="row" style={{ gap: 6, fontSize: '.78rem', fontWeight: 700 }}>{locked && <Icon name="lock" size={12} />}{THEME_LABELS[id]}</div>
      {locked && <div className="muted" style={{ fontSize: '.68rem' }}>{req}</div>}
    </button>
  );
}

function AppearanceTab() {
  const s = useStore((x) => x.s);
  const a = s.appearance;
  const set = useStore((x) => x.setAppearance);
  const setS = useStore((x) => x.setSettings);
  const p = useProgress();
  const nu = nextUnlock(p.char.level);
  const reqLabel = (kind: 'theme' | 'accent', v: string) => { const u = UNLOCKS.find((x) => x.kind === kind && x.value === v); return u?.req.level ? `Reach Lv ${u.req.level}` : u?.req.achievement ? `Achievement` : ''; };
  const locked = (kind: 'theme' | 'accent', v: string) => lockedValue(kind, v, p.char.level, s.achievements);
  const scales = [0.9, 1, 1.1, 1.25, 1.4];
  return (
    <div className="two" style={{ gridTemplateColumns: '1fr 340px', alignItems: 'start' }}>
      <div className="stack">
        {nu && (
          <div className="mcard row" style={{ gap: 16 }}>
            <Ring value={p.char.level} max={nu.req.level!} size={46} stroke={5} color="var(--xp)"><Icon name="lock" size={16} /></Ring>
            <div className="grow"><Bar value={p.char.level} max={nu.req.level!} label={<>Next unlock: <b style={{ color: 'var(--t1)' }}>{nu.label}</b></>} showNumbers format={(v) => `Lv ${Math.round(v)}`} color="var(--xp)" height={8} /></div>
          </div>
        )}
        <div className="mcard">
          <div className="section-label" style={{ marginTop: 0 }}>Theme</div>
          <div className="theme-grid">
            {(['discord', 'midnight', 'light', 'nord', 'sepia', 'system', 'dusk', 'forest', 'aurora'] as const).map((id) => (
              <ThemeTile key={id} id={id} on={a.theme === id} locked={id !== 'system' && locked('theme', id)} req={id !== 'system' ? reqLabel('theme', id) : undefined} pick={() => set({ theme: id })} />
            ))}
          </div>
          <div className="section-label">Accent</div>
          <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
            {ACCENTS.map((ac) => {
              const l = locked('accent', ac.id);
              return (
                <button key={ac.id} className={`swatch ${a.accent === ac.id ? 'on' : ''} ${l ? 'locked' : ''}`} title={l ? `${ac.label} · ${reqLabel('accent', ac.id)}` : ac.label} onClick={() => !l && set({ accent: ac.id })}
                  style={{ background: ac.gradient ?? ac.color ?? 'linear-gradient(135deg, var(--t1) 50%, var(--bg0) 50%)' }}>{l && <Icon name="lock" size={12} />}</button>
              );
            })}
            <label className={`swatch ${a.accent === 'custom' ? 'on' : ''}`} title="Custom colour" style={{ background: a.customAccent, position: 'relative' }}>
              <Icon name="palette" size={14} style={{ color: '#fff', mixBlendMode: 'difference' }} />
              <input type="color" value={a.customAccent} onChange={(e) => set({ accent: 'custom', customAccent: e.target.value })} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </label>
          </div>
          <div className="set-row" style={{ marginTop: 14 }}><div className="grow"><div className="set-l">Colour checkboxes by stat</div><div className="set-h">Off: use your accent everywhere.</div></div><Toggle on={a.useStatColours} set={(v) => set({ useStatColours: v })} /></div>
        </div>
        <div className="mcard stack">
          <div className="section-label" style={{ marginTop: 0 }}>Fonts & text</div>
          <Row label="Interface font"><Select ariaLabel="Interface font" style={{ width: 220 }} value={a.uiFont as string} onChange={(v) => set({ uiFont: v as Appearance['uiFont'] })} options={FONTS.map((f) => ({ value: f as string, label: f, font: f }))} /></Row>
          <Row label="Heading font"><Select ariaLabel="Heading font" style={{ width: 220 }} value={a.headingFont as string} onChange={(v) => set({ headingFont: v as Appearance['headingFont'] })} options={FONTS.map((f) => ({ value: f as string, label: f, font: f }))} /></Row>
          <Row label="Text size"><div className="seg-ctl">{scales.map((sc) => <button key={sc} className={a.scale === sc ? 'on' : ''} onClick={() => set({ scale: sc })}>{Math.round(sc * 100)}%</button>)}</div></Row>
          <Row label="Numbers"><div className="seg-ctl"><button className={a.tabularNums ? 'on' : ''} onClick={() => set({ tabularNums: true })}>Tabular</button><button className={!a.tabularNums ? 'on' : ''} onClick={() => set({ tabularNums: false })}>Proportional</button></div></Row>
          <Row label="Ringgit format"><div className="seg-ctl"><button className={!a.compactRM ? 'on' : ''} onClick={() => set({ compactRM: false })}>RM 12.50</button><button className={a.compactRM ? 'on' : ''} onClick={() => set({ compactRM: true })}>RM12.50</button></div></Row>
        </div>
        <div className="mcard stack">
          <div className="section-label" style={{ marginTop: 0 }}>Layout</div>
          <Row label="Density"><div className="seg-ctl">{(['compact', 'cozy', 'spacious'] as const).map((d) => <button key={d} className={a.density === d ? 'on' : ''} onClick={() => set({ density: d })}>{d[0].toUpperCase() + d.slice(1)}</button>)}</div></Row>
          <Row label="Corners"><div className="seg-ctl">{(['sharp', 'soft', 'round'] as const).map((r) => <button key={r} className={a.radius === r ? 'on' : ''} onClick={() => set({ radius: r })}>{r[0].toUpperCase() + r.slice(1)}</button>)}</div></Row>
          <Row label="Sidebar width" hint="You can also drag its edge."><input type="range" min={220} max={340} value={a.sidebarWidth} onChange={(e) => set({ sidebarWidth: Number(e.target.value), sidebarCollapsed: false })} style={{ width: 200 }} /></Row>
          <Row label="Collapse sidebar to icons"><Toggle on={a.sidebarCollapsed} set={(v) => set({ sidebarCollapsed: v })} /></Row>
          <div className="set-row" style={{ alignItems: 'flex-start' }}>
            <div className="grow"><div className="set-l">Sidebar pages</div><div className="set-h">Show, hide and reorder.</div></div>
            <div className="stack" style={{ gap: 4, width: 260 }}>
              {s.settings.navOrder.map((k, i) => (
                <div key={k} className="row" style={{ gap: 6, background: 'var(--bg2)', borderRadius: 8, padding: '4px 8px' }}>
                  <span className="grow" style={{ fontWeight: 600, fontSize: '.85rem', opacity: s.settings.hiddenPages.includes(k) ? 0.4 : 1 }}>{({ myday: 'My Day', planned: 'Planned', habits: 'Habits', money: 'Money', quests: 'Quests', profile: 'Profile' } as Record<string, string>)[k]}</span>
                  <button className="icon-btn" disabled={i === 0} onClick={() => { const o = [...s.settings.navOrder]; [o[i - 1], o[i]] = [o[i], o[i - 1]]; setS({ navOrder: o }); }}><Icon name="up" size={14} /></button>
                  <button className="icon-btn" disabled={i === s.settings.navOrder.length - 1} onClick={() => { const o = [...s.settings.navOrder]; [o[i + 1], o[i]] = [o[i], o[i + 1]]; setS({ navOrder: o }); }}><Icon name="down" size={14} /></button>
                  <Toggle on={!s.settings.hiddenPages.includes(k)} set={(v) => setS({ hiddenPages: v ? s.settings.hiddenPages.filter((x) => x !== k) : [...s.settings.hiddenPages, k] })} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row"><div className="grow" /><button className="btn ghost" onClick={() => set({ ...DEFAULT_APPEARANCE })}><Icon name="undo" size={16} />Reset appearance</button></div>
      </div>
      <div className="preview-wrap">
        <div className="section-label" style={{ marginTop: 0 }}>Live preview</div>
        <div className="preview">
          <div className="preview-side">
            <div className="row" style={{ gap: 8 }}><div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent-fill)' }} /><b style={{ fontSize: '.8rem' }}>{s.profile.name || 'You'}</b></div>
            <Bar value={2} max={3} height={5} color="var(--xp)" />
            {['My Day', 'Planned', 'Money'].map((n, i) => <div key={n} className={`nav-item ${i === 0 ? 'on' : ''}`} style={{ height: 26, fontSize: '.74rem' }}><span>{n}</span></div>)}
          </div>
          <div className="preview-main">
            <h3 style={{ fontSize: '1.05rem' }}>My Day</h3>
            <SegBar done={2} total={4} height={6} gap={3} />
            {['Read chapter 4', 'Gym, leg day', 'Reply to email'].map((t, i) => (
              <div key={t} className="task" style={{ minHeight: 'calc(var(--row-h) * .8)', padding: '6px 10px', gap: 10 }}>
                <span className="check" style={{ width: 16, height: 16, background: i === 0 ? 'var(--int)' : undefined, borderColor: i === 0 ? 'var(--int)' : undefined }} />
                <span className="task-title" style={{ fontSize: '.8rem' }}>{t}</span><span className="xp-tag" style={{ marginLeft: 'auto', fontSize: '.66rem' }}>+20 XP</span>
              </div>
            ))}
            <button className="btn primary sm" style={{ alignSelf: 'flex-start' }}>Button</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyTab() {
  const s = useStore((x) => x.s);
  const fmt = useFmt();
  const patch = useStore((x) => x.patch);
  const [setup, setSetup] = useState(false);
  const [src, setSrc] = useState('');
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <div className="mcard row"><div className="grow"><div className="set-l">Money setup</div><div className="set-h">Rerun the guided setup: money in, categories and your split.</div></div><button className="btn primary" onClick={() => setSetup(true)}>Run setup</button></div>
      <div className="mcard stack">
        <div className="section-label" style={{ marginTop: 0 }}>Categories</div>
        {s.money.categories.map((c) => (
          <div key={c.id} className="row" style={{ gap: 12 }}>
            <CatIcon c={c} size={32} />
            <input className="input" style={{ flex: 1 }} value={c.name} onChange={(e) => act(upsertCategory, { ...c, name: e.target.value })} />
            <input className="input" style={{ width: 70 }} placeholder="Emoji" value={c.emoji ?? ''} maxLength={4} onChange={(e) => act(upsertCategory, { ...c, emoji: e.target.value || undefined })} />
            <input type="color" value={c.color.startsWith('#') ? c.color : '#b5bac1'} onChange={(e) => act(upsertCategory, { ...c, color: e.target.value })} style={{ width: 36, height: 36, border: 0, background: 'none' }} />
            <div className="seg-ctl"><button className={c.need ? 'on' : ''} onClick={() => act(upsertCategory, { ...c, need: true })}>Need</button><button className={!c.need ? 'on' : ''} onClick={() => act(upsertCategory, { ...c, need: false })}>Want</button></div>
            <span className="muted" style={{ width: 90, textAlign: 'right', fontSize: '.82rem' }}>{c.limitSen ? `${fmt.rm(c.limitSen)}/mo` : 'No limit'}</span>
          </div>
        ))}
        <button className="btn ghost" style={{ alignSelf: 'flex-start' }} onClick={() => act(upsertCategory, { name: 'New category' })}><Icon name="plus" size={16} />Add category</button>
      </div>
      <div className="mcard stack">
        <div className="section-label" style={{ marginTop: 0 }}>Money in sources</div>
        {s.money.sources.map((x) => (
          <div key={x.id} className="row" style={{ gap: 12 }}>
            <CatIcon c={{ icon: x.icon, color: 'var(--in)' }} size={32} />
            <input className="input" style={{ flex: 1 }} value={x.name} onChange={(e) => patch((st) => ({ ...st, money: { ...st.money, sources: st.money.sources.map((y) => (y.id === x.id ? { ...y, name: e.target.value } : y)) } }))} />
            <span className="muted">Expected RM</span>
            <input className="input" style={{ width: 120 }} defaultValue={x.expectedSen ? x.expectedSen / 100 : ''} onBlur={(e) => { const v = parseAmount(e.target.value) ?? 0; patch((st) => ({ ...st, money: { ...st.money, sources: st.money.sources.map((y) => (y.id === x.id ? { ...y, expectedSen: v } : y)) } })); }} />
          </div>
        ))}
        <form className="row" onSubmit={(e) => { e.preventDefault(); if (src.trim()) { act(addSource, src.trim()); setSrc(''); } }}><input className="input" placeholder="Add a source" value={src} onChange={(e) => setSrc(e.target.value)} /><button className="btn">Add</button></form>
      </div>
      {setup && <Setup onDone={() => setSetup(false)} onSkip={() => setSetup(false)} />}
    </div>
  );
}

function MusicTab() {
  const s = useStore((x) => x.s);
  const m = s.music;
  const patch = useStore((x) => x.patch);
  const st = useMusic();
  const fileRef = useRef<HTMLInputElement>(null);
  const [plName, setPlName] = useState('');
  const [drag, setDrag] = useState(false);
  const setM = (p: Partial<typeof m>) => patch((x) => ({ ...x, music: { ...x.music, ...p } }));
  const addTracks = (tracks: Track[]) => { if (tracks.length) setM({ tracks: [...useStore.getState().s.music.tracks, ...tracks] }); };
  const importNative = async () => { const b = bridge(); if (b) addTracks(await b.music.import(m.linkInsteadOfCopy)); else fileRef.current?.click(); };
  const fromFiles = (files: FileList | null) => {
    if (!files) return;
    const b = bridge();
    const paths = Array.from(files).map((f) => (f as File & { path?: string }).path).filter(Boolean) as string[];
    if (b && paths.length) { b.music.importPaths(paths, m.linkInsteadOfCopy).then(addTracks); return; }
    addTracks(Array.from(files).filter((f) => f.type.startsWith('audio') || /\.(mp3|m4a|aac|ogg|opus|wav|flac)$/i.test(f.name)).map((f) => ({ id: uid(), title: f.name.replace(/\.[^.]+$/, ''), artist: '', file: URL.createObjectURL(f), durationSec: 0 })));
  };
  const remove = (t: Track) => { bridge()?.music.remove(t.id, t.file); setM({ tracks: m.tracks.filter((x) => x.id !== t.id), playlists: m.playlists.map((p) => ({ ...p, trackIds: p.trackIds.filter((i) => i !== t.id) })) }); };
  const active = m.playlists.find((p) => p.id === m.activePlaylist);
  return (
    <div className="stack" style={{ maxWidth: 820 }} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); fromFiles(e.dataTransfer.files); }}>
      <div className={`mcard drop ${drag ? 'over' : ''}`}>
        <div className="row" style={{ gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--bg0)', display: 'grid', placeItems: 'center' }}><Icon name="music" size={24} /></div>
          <div className="grow"><div className="set-l">Your music</div><div className="set-h">Undr Ctrl plays only tracks you add (mp3, m4a, ogg, opus, wav, flac). Drop files here or add them. Music always pauses when Undr Ctrl is minimised or in the tray.</div></div>
          <button className="btn primary" onClick={importNative}><Icon name="plus" size={16} />Add tracks</button>
          <input ref={fileRef} type="file" accept="audio/*,.mp3,.m4a,.aac,.ogg,.opus,.wav,.flac" multiple hidden onChange={(e) => fromFiles(e.target.files)} />
        </div>
      </div>
      <div className="mcard stack">
        <Row label="Volume"><input type="range" min={0} max={1} step={0.02} value={m.volume} onChange={(e) => setM({ volume: Number(e.target.value) })} style={{ width: 220 }} /></Row>
        <Row label="Shuffle"><Toggle on={m.shuffle} set={(v) => setM({ shuffle: v })} /></Row>
        <Row label="Repeat"><div className="seg-ctl">{(['off', 'all', 'one'] as const).map((r) => <button key={r} className={m.repeat === r ? 'on' : ''} onClick={() => setM({ repeat: r })}>{r === 'off' ? 'Off' : r === 'all' ? 'All' : 'One'}</button>)}</div></Row>
        <Row label="Resume when I come back" hint="After minimising or hiding to the tray, pick up where you left off."><Toggle on={m.resumeOnReturn} set={(v) => setM({ resumeOnReturn: v })} /></Row>
        <Row label="Play during focus sessions" hint="Starts with a focus session and pauses on breaks."><Toggle on={s.focusSettings.musicLink} set={(v) => patch((x) => ({ ...x, focusSettings: { ...x.focusSettings, musicLink: v } }))} /></Row>
        <Row label="Link files instead of copying" hint="For big libraries. Linked tracks stop working if you move the originals."><Toggle on={m.linkInsteadOfCopy} set={(v) => setM({ linkInsteadOfCopy: v })} /></Row>
      </div>
      <div className="mcard">
        <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <div className="seg-ctl">
            <button className={m.activePlaylist === 'all' ? 'on' : ''} onClick={() => setM({ activePlaylist: 'all' })}>All tracks</button>
            {m.playlists.map((p) => <button key={p.id} className={m.activePlaylist === p.id ? 'on' : ''} onClick={() => setM({ activePlaylist: p.id })}>{p.name}</button>)}
          </div>
          <form className="row" onSubmit={(e) => { e.preventDefault(); if (plName.trim()) { const id = uid(); setM({ playlists: [...m.playlists, { id, name: plName.trim(), trackIds: [] }], activePlaylist: id }); setPlName(''); } }}>
            <input className="input" style={{ height: 34, width: 170 }} placeholder="New playlist" value={plName} onChange={(e) => setPlName(e.target.value)} />
          </form>
          {active && <button className="btn sm ghost danger" onClick={() => setM({ playlists: m.playlists.filter((p) => p.id !== active.id), activePlaylist: 'all' })}>Delete playlist</button>}
        </div>
        {m.tracks.length === 0 && <div className="empty" style={{ padding: 24 }}><p>No tracks yet.</p></div>}
        <div className="stack" style={{ gap: 4 }}>
          {m.tracks.map((t, i) => {
            const inPl = active ? active.trackIds.includes(t.id) : true;
            const playing = st.trackId === t.id && st.playing;
            return (
              <div key={t.id} className="track-row" style={{ opacity: t.missing ? 0.5 : 1 }}>
                <button className="icon-btn" onClick={() => getPlayer().play(t.id)} disabled={t.missing || !inPl}><Icon name={playing ? 'pause' : 'play'} size={14} /></button>
                <Cover id={t.id} size={32} />
                <div className="grow" style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: '.88rem' }}>{t.title}</div><div className="muted" style={{ fontSize: '.74rem' }}>{t.missing ? 'File missing. Skipped.' : t.artist || 'Unknown artist'}</div></div>
                <span className="muted" style={{ fontSize: '.78rem' }}>{t.durationSec ? fmtSec(t.durationSec) : ''}</span>
                {active && <button className={`btn sm ${inPl ? '' : 'ghost'}`} onClick={() => setM({ playlists: m.playlists.map((p) => (p.id === active.id ? { ...p, trackIds: inPl ? p.trackIds.filter((x) => x !== t.id) : [...p.trackIds, t.id] } : p)) })}>{inPl ? 'In playlist' : 'Add'}</button>}
                <button className="icon-btn" disabled={i === 0} onClick={() => { const a = [...m.tracks]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; setM({ tracks: a }); }}><Icon name="up" size={14} /></button>
                <button className="icon-btn" title="Remove" onClick={() => remove(t)}><Icon name="trash" size={14} /></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DataTab() {
  const s = useStore((x) => x.s);
  const replace = useStore((x) => x.replace);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const doExport = async () => {
    const json = JSON.stringify(s, null, 1);
    const b = bridge();
    if (b) { if (await b.exportData(json)) setMsg('Exported.'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = `undr-ctrl-backup-${new Date().toISOString().slice(0, 10)}.undrctrl.json`;
    a.click();
    setMsg('Exported.');
  };
  const load = (json: string) => {
    try { const data = JSON.parse(json); if (!data || typeof data !== 'object' || !('tasks' in data)) throw new Error(); if (confirm('Replace everything in Undr Ctrl with this backup?')) { replace(data); setMsg('Imported.'); } }
    catch { setMsg("That file isn't an Undr Ctrl backup."); }
  };
  const doImport = async () => { const b = bridge(); if (b) { const j = await b.importData(); if (j) load(j); } else fileRef.current?.click(); };
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <div className="mcard stack">
        <Row label="Export a backup" hint="Everything: tasks, money, progress and settings, in one .undrctrl.json file."><button className="btn" onClick={doExport}><Icon name="download" size={16} />Export</button></Row>
        <Row label="Import a backup" hint="Replaces what's here now. Undr Ctrl keeps 14 daily backups automatically too."><button className="btn" onClick={doImport}><Icon name="upload" size={16} />Import</button></Row>
        <input ref={fileRef} type="file" accept=".json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) load(await f.text()); }} />
        {msg && <div className="chip ok" style={{ alignSelf: 'flex-start' }}>{msg}</div>}
      </div>
      <CloudBackup />
      <div className="mcard dim" style={{ fontSize: '.86rem', lineHeight: 1.6 }}>
        Your data lives on this PC in <code>%APPDATA%\Undr Ctrl</code>. {s.tasks.length} tasks · {s.money.entries.length} money entries · {s.ledger.length} XP events.
      </div>
    </div>
  );
}

function CloudBackup() {
  const st = useStore((x) => x.s.settings);
  const patch = useStore((x) => x.patch);
  const [pending, setPending] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const b = bridge();
  const set = (o: Partial<typeof st>) => patch((s) => ({ ...s, settings: { ...s.settings, ...o } }));
  const choose = async () => { if (!b) return; const f = await b.backup.chooseFolder(); if (f) setPending(f); };
  const confirmFolder = async () => { set({ backupFolder: pending!, lastCloudBackup: undefined, cloudBackupFailed: false }); setPending(null); const ok = await cloudBackup(true); setMsg(ok ? 'Backed up. Google Drive will upload it.' : "Couldn't write there. Is Google Drive running?"); };
  const now = async () => { const ok = await cloudBackup(true); setMsg(ok ? 'Backed up just now.' : "Couldn't write there. Is Google Drive running?"); };
  const last = st.lastCloudBackup ? new Date(st.lastCloudBackup) : null;
  return (
    <div className="mcard stack cloud-card">
      <div className="row" style={{ gap: 12 }}>
        <div className="cloud-ico"><Icon name="upload" size={18} /></div>
        <div className="grow"><div style={{ fontWeight: 700 }}>Daily backup to Google Drive</div><div className="muted" style={{ fontSize: '.84rem', lineHeight: 1.5 }}>Once a day Undr Ctrl writes one file, <b>Undr Ctrl backup.json</b>, into a folder you choose and replaces yesterday's, so it never piles up. The Google Drive app uploads it.</div></div>
      </div>
      {!b && <div className="muted" style={{ fontSize: '.84rem' }}>Available in the desktop app.</div>}
      {b && pending && (
        <div className="confirm-box stack">
          <div style={{ fontSize: '.9rem' }}>Back up into <code>{pending}</code>?</div>
          <div className="muted" style={{ fontSize: '.8rem', lineHeight: 1.5 }}>Check this is inside your Google Drive (usually <code>G:\My Drive\…</code>) and that the Drive app is signed in to the account you want: click the Drive icon in the tray, then the gear, then Preferences.</div>
          <div className="row" style={{ gap: 8 }}><button className="btn primary" onClick={confirmFolder}>Yes, back up here</button><button className="btn ghost" onClick={() => setPending(null)}>Cancel</button></div>
        </div>
      )}
      {b && !pending && (st.backupFolder ? (
        <>
          <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <span className={`chip ${st.cloudBackupFailed ? 'bad' : 'ok'}`}>{st.cloudBackupFailed ? 'Last try failed' : 'On'}</span>
            <code className="grow" style={{ fontSize: '.82rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.backupFolder}</code>
          </div>
          <div className="muted" style={{ fontSize: '.84rem' }}>{last ? `Last backup ${last.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}, ${last.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}` : 'No backup yet'}{st.cloudBackupFailed ? '. Undr Ctrl will keep trying every minute; make sure Google Drive is running.' : ''}</div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={now}>Back up now</button>
            <button className="btn ghost" onClick={() => b.backup.open(st.backupFolder!)}>Open folder</button>
            <button className="btn ghost" onClick={choose}>Change folder</button>
            <button className="btn ghost" onClick={() => set({ backupFolder: undefined, lastCloudBackup: undefined, cloudBackupFailed: false })}>Turn off</button>
          </div>
        </>
      ) : <div><button className="btn primary" onClick={choose}><Icon name="upload" size={16} />Choose folder</button></div>)}
      {msg && <div className="chip ok" style={{ alignSelf: 'flex-start' }}>{msg}</div>}
    </div>
  );
}
