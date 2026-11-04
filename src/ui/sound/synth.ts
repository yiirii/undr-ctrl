// UI sounds synthesized with WebAudio. No audio files. Four packs.
import { useStore } from '../../store/store';

type Pack = 'soft' | 'glass' | 'wood' | 'chime';
let ctx: AudioContext | null = null;
const ac = () => {
  ctx ??= new AudioContext();
  // iPhone suspends audio until a tap, and again after the app goes to the background
  if (ctx.state !== 'running') void ctx.resume().catch(() => {});
  return ctx;
};
/** Build the audio engine while the app is idle, so the first tick sound doesn't stall a tap. */
export function warmAudio() {
  if (typeof window === 'undefined' || ctx) return;
  const make = () => { try { ac(); } catch { /* no audio */ } };
  const idle = (window as unknown as { requestIdleCallback?: (f: () => void) => void }).requestIdleCallback;
  if (idle) idle(make); else setTimeout(make, 1200);
  // a suspended context can only be started from a user gesture
  const wake = () => { if (ctx && ctx.state !== 'running') void ctx.resume().catch(() => {}); };
  window.addEventListener('pointerdown', wake, { passive: true });
  window.addEventListener('keydown', wake);
}

function cfg() {
  const s = useStore.getState().s.settings;
  return { pack: s.sound as Pack, vol: s.muted ? 0 : s.volume };
}

function tone(freq: number, at: number, dur: number, gain: number, type: OscillatorType, pack: Pack) {
  const c = ac();
  const o = c.createOscillator();
  const g = c.createGain();
  const f = c.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = pack === 'wood' ? 1800 : pack === 'glass' ? 9000 : 4200;
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (pack === 'wood') o.frequency.exponentialRampToValueAtTime(freq * 0.7, at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(f).connect(g).connect(c.destination);
  o.start(at);
  o.stop(at + dur + 0.05);
  if (pack === 'glass' || pack === 'chime') {
    const o2 = c.createOscillator(), g2 = c.createGain();
    o2.type = 'sine'; o2.frequency.value = freq * (pack === 'glass' ? 2.76 : 2.01);
    g2.gain.setValueAtTime(0.0001, at); g2.gain.exponentialRampToValueAtTime(gain * 0.35, at + 0.01); g2.gain.exponentialRampToValueAtTime(0.0001, at + dur * 1.4);
    o2.connect(g2).connect(c.destination); o2.start(at); o2.stop(at + dur * 1.5);
  }
}

const voice: Record<Pack, { type: OscillatorType; base: number; len: number }> = {
  soft: { type: 'sine', base: 660, len: 0.12 },
  glass: { type: 'sine', base: 1046, len: 0.35 },
  wood: { type: 'triangle', base: 420, len: 0.09 },
  chime: { type: 'sine', base: 784, len: 0.6 },
};

function play(notes: [number, number][], scale = 1) {
  const { pack, vol } = cfg();
  if (vol <= 0) return;
  try {
    const c = ac();
    if (c.state === 'suspended') c.resume();
    const v = voice[pack];
    const t0 = c.currentTime + 0.01;
    for (const [mult, delay] of notes) tone(v.base * mult, t0 + delay, v.len * scale, 0.18 * vol, v.type, pack);
  } catch { /* audio unavailable */ }
}

export const sfx = {
  click: () => play([[1, 0]]),
  check: () => play([[1, 0], [1.5, 0.06]]),
  tink: () => play([[2, 0]], 0.8),
  chime2: () => play([[1, 0], [1.25, 0.12]], 1.6),
  arpeggio: () => play([[1, 0], [1.25, 0.09], [1.5, 0.18], [2, 0.27], [2.5, 0.4]], 2.2),
  pop: () => play([[1.5, 0]], 0.6),
  streak: (n: number) => play(Array.from({ length: Math.min(6, 2 + Math.floor(n / 7)) }, (_, i) => [1 + i * 0.25, i * 0.07] as [number, number]), 1.4),
  /** Rising pitch with each combo step. */
  combo: (n: number) => play([[1 + Math.min(8, n) * 0.125, 0], [1.5 + Math.min(8, n) * 0.125, 0.05]], 0.9),
  /** Coin-like "cha-ching": brighter and longer with bigger profit tier (0 small, 1 good, 2 big). */
  sale: (tier: number) => play(tier === 0 ? [[2, 0], [2.5, 0.07]] : tier === 1 ? [[1.5, 0], [2, 0.06], [2.5, 0.12], [3, 0.2]] : [[1, 0], [1.5, 0.07], [2, 0.14], [2.5, 0.21], [3, 0.3], [4, 0.42]], tier === 2 ? 2.4 : 1.2),
  focusEnd: () => play([[1, 0], [1.5, 0.2], [2, 0.4]], 3),
  preview: (pack: Pack) => {
    const prev = useStore.getState().s.settings.sound;
    useStore.setState((st) => ({ s: { ...st.s, settings: { ...st.s.settings, sound: pack } } }));
    play([[1, 0], [1.5, 0.07]]);
    useStore.setState((st) => ({ s: { ...st.s, settings: { ...st.s.settings, sound: prev } } }));
  },
};
