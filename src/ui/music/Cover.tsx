import { coverColors } from './service';
export function Cover({ id, size = 36 }: { id: string; size?: number }) {
  const [a, b, k] = coverColors(id);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ borderRadius: 8, flex: 'none', background: 'var(--bg0)' }}>
      {k === 0 && <><circle cx="16" cy="18" r="11" fill={a} opacity=".9" /><rect x="20" y="20" width="14" height="14" rx="4" fill={b} opacity=".8" /></>}
      {k === 1 && <><path d="M20 6 34 20 20 34 6 20Z" fill={a} opacity=".85" /><circle cx="28" cy="12" r="5" fill={b} /></>}
      {k === 2 && <><rect x="6" y="8" width="18" height="18" rx="5" fill={b} opacity=".85" /><circle cx="26" cy="26" r="9" fill={a} opacity=".85" /></>}
      {k === 3 && <><path d="M8 32 20 8 32 32Z" fill={a} opacity=".85" /><circle cx="20" cy="25" r="5" fill={b} /></>}
    </svg>
  );
}
