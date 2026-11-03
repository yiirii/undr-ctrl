import { motion } from 'framer-motion';
import { useStore } from '../../store/store';

/** Slow drifting geometric composition used for empty states and onboarding. */
export function Ambient({ size = 180, tone = 'var(--t3)' }: { size?: number; tone?: string }) {
  const reduced = useStore((s) => s.s.settings.reducedMotion);
  const float = (dx: number, dy: number, dur: number, rot = 0) =>
    reduced ? {} : { animate: { x: [0, dx, 0], y: [0, dy, 0], rotate: [0, rot, 0] }, transition: { duration: dur, repeat: Infinity, ease: 'easeInOut' as const } };
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 200 144" fill="none" style={{ overflow: 'visible' }}>
      <motion.circle cx="70" cy="70" r="34" stroke={tone} strokeWidth="2" opacity=".55" {...float(6, -5, 9)} />
      <motion.rect x="104" y="40" width="44" height="44" rx="12" stroke="var(--accent)" strokeWidth="2" opacity=".75" style={{ originX: '126px', originY: '62px' }} {...float(-5, 7, 11, 12)} />
      <motion.path d="M150 96 L166 112 L150 128 L134 112 Z" fill={tone} opacity=".35" {...float(4, -6, 8, -10)} />
      <motion.path d="M40 118 l10 -17 l10 17 z" stroke={tone} strokeWidth="2" opacity=".5" {...float(-4, -4, 10, 8)} />
      <motion.circle cx="160" cy="30" r="4" fill="var(--xp)" opacity=".8" {...float(3, 5, 7)} />
      <motion.circle cx="30" cy="40" r="2.5" fill={tone} opacity=".6" {...float(-3, 4, 6)} />
    </svg>
  );
}
