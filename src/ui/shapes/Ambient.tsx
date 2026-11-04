import { useStore } from '../../store/store';

/** Slow drifting geometric composition used for empty states and onboarding (CSS-animated). */
export function Ambient({ size = 180, tone = 'var(--t3)' }: { size?: number; tone?: string }) {
  const reduced = useStore((s) => s.s.settings.reducedMotion);
  const float = (dx: number, dy: number, dur: number, rot = 0) =>
    reduced ? {} : { className: 'amb-float', style: { ['--dx' as string]: `${dx}px`, ['--dy' as string]: `${dy}px`, ['--rot' as string]: `${rot}deg`, animationDuration: `${dur}s`, transformBox: 'fill-box' as const, transformOrigin: 'center' } };
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 200 144" fill="none" style={{ overflow: 'visible' }}>
      <circle cx="70" cy="70" r="34" stroke={tone} strokeWidth="2" opacity=".55" {...float(6, -5, 9)} />
      <rect x="104" y="40" width="44" height="44" rx="12" stroke="var(--accent)" strokeWidth="2" opacity=".75" {...float(-5, 7, 11, 12)} />
      <path d="M150 96 L166 112 L150 128 L134 112 Z" fill={tone} opacity=".35" {...float(4, -6, 8, -10)} />
      <path d="M40 118 l10 -17 l10 17 z" stroke={tone} strokeWidth="2" opacity=".5" {...float(-4, -4, 10, 8)} />
      <circle cx="160" cy="30" r="4" fill="var(--xp)" opacity=".8" {...float(3, 5, 7)} />
      <circle cx="30" cy="40" r="2.5" fill={tone} opacity=".6" {...float(-3, 4, 6)} />
    </svg>
  );
}
