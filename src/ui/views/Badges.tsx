import { Icon } from '../shapes/icons';
export function HexBadge({ color, label, icon, size = 40, shimmer, locked, progress }: { color: string; label?: string; icon?: string; size?: number; shimmer?: boolean; locked?: boolean; progress?: number }) {
  const c = size / 2, R = size / 2 - 2;
  const pts = Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 3; return `${c + R * Math.cos(a)},${c + R * Math.sin(a)}`; }).join(' ');
  const per = 6 * R; // hexagon perimeter (side = R)
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }} className={shimmer ? 'hex-shimmer' : ''}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon points={pts} fill={locked ? 'var(--bg0)' : color} opacity={locked ? 1 : 0.95} />
        {locked && <polygon points={pts} fill="none" stroke="var(--bg4)" strokeWidth={2} />}
        {locked && progress !== undefined && progress > 0 && <polygon points={pts} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray={`${per * progress} ${per}`} strokeLinecap="round" />}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: locked ? 'var(--t3)' : 'var(--bg0)', fontWeight: 900, fontSize: size * 0.3 }}>
        {icon ? <Icon name={icon} size={size * 0.42} stroke={2.4} /> : label}
      </div>
    </div>
  );
}
