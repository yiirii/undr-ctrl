import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useStore, act } from '../../store/store';
import { completeOnboarding } from '../../store/logic';
import { Ambient } from '../shapes/Ambient';
import { Radar } from '../shapes/Radar';
import { Bar, SegBar, SPRING } from '../shapes/Progress';
import { Icon } from '../shapes/icons';
import { Setup } from './money/Setup';
import { STAT_META } from '../../core/types';

const CARDS = [
  { t: 'Tasks feed your stats', d: 'Every list feeds a stat. Studying grows Intelligence, workouts grow Strength, plus Discipline, Creativity and Charisma.', art: 'radar' },
  { t: 'Money moves Wealth', d: 'Each day under budget grows Wealth. Every ringgit spent lowers it a little, and saving toward goals grows it fastest.', art: 'money' },
  { t: 'Level up, unlock more', d: 'XP fills your level. Levels and achievements unlock themes, colours and sounds. Quests keep each day interesting.', art: 'level' },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [card, setCard] = useState(0);
  const finish = () => { act(completeOnboarding, name); };
  if (step === 2) return <div className="onb" style={{ background: 'var(--bg0)' }}><Setup onDone={finish} onSkip={finish} /></div>;
  return (
    <div className="onb">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.form key="name" className="onb-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={SPRING} onSubmit={(e) => { e.preventDefault(); if (name.trim()) setStep(1); }}>
            <Ambient size={240} />
            <h1>Welcome to Undr Ctrl.</h1>
            <p>A calm place for your tasks, your money and your focus, where real life levels you up.</p>
            <input className="input onb-name" autoFocus placeholder="What should we call you?" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn primary lg" disabled={!name.trim()}>Continue<Icon name="right" size={16} /></button>
          </motion.form>
        )}
        {step === 1 && (
          <motion.div key="cards" className="onb-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={SPRING}>
            <div style={{ width: 220 }}><SegBar done={card + 1} total={3} height={5} gap={6} /></div>
            <AnimatePresence mode="wait">
              <motion.div key={card} className="col" style={{ alignItems: 'center', gap: 18, minHeight: 360, justifyContent: 'center' }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={SPRING}>
                {CARDS[card].art === 'radar' && <Radar levels={{ int: 6, str: 4, wea: 5, dis: 3, cre: 4, cha: 2 }} size={220} />}
                {CARDS[card].art === 'money' && (
                  <div className="col" style={{ width: 300, gap: 14, padding: 20 }}>
                    <Bar value={540} max={600} label="Food" showNumbers format={(v) => `RM ${Math.round(v)}`} color="#ffb86b" height={10} />
                    <Bar value={80} max={200} label="Transport" showNumbers format={(v) => `RM ${Math.round(v)}`} color="#6ec6ff" height={10} />
                    <Bar value={180} max={150} label="Fun" showNumbers format={(v) => `RM ${Math.round(v)}`} color="#b39dff" height={10} />
                    <div className="chip ok" style={{ alignSelf: 'center' }}>Wealth +60 today</div>
                  </div>
                )}
                {CARDS[card].art === 'level' && (
                  <div className="col" style={{ alignItems: 'center', gap: 10 }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">{Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3, b = a + Math.PI / 3; const c = Object.values(STAT_META)[i].hue; return <motion.path key={i} d={`M60 60 L${60 + 54 * Math.cos(a)} ${60 + 54 * Math.sin(a)} L${60 + 54 * Math.cos(b)} ${60 + 54 * Math.sin(b)}Z`} fill={c} stroke="var(--bg1)" strokeWidth={2} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...SPRING, delay: i * 0.07 }} style={{ originX: '60px', originY: '60px' }} />; })}</svg>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', fontWeight: 900 }}>Lv 2</div>
                    <div style={{ width: 260 }}><Bar value={70} max={100} color="var(--xp)" height={8} /></div>
                  </div>
                )}
                <h1 style={{ fontSize: '1.8rem' }}>{CARDS[card].t}</h1>
                <p>{CARDS[card].d}</p>
              </motion.div>
            </AnimatePresence>
            <div className="row" style={{ gap: 10 }}>
              {card > 0 && <button className="btn ghost lg" onClick={() => setCard(card - 1)}><Icon name="left" size={16} />Back</button>}
              <button className="btn primary lg" onClick={() => (card < 2 ? setCard(card + 1) : setStep(2))}>{card < 2 ? 'Next' : 'Set up money'}<Icon name="right" size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
