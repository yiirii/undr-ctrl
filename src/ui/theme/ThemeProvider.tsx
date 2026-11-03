import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useStore } from '../../store/store';
import { toCssVars } from '../../core/appearance';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const appearance = useStore((s) => s.s.appearance);
  const reduced = useStore((s) => s.s.settings.reducedMotion);
  const [osDark, setOsDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true);
  const first = useRef(true);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent) => setOsDark(e.matches);
    mq?.addEventListener('change', on);
    return () => mq?.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (!first.current) { root.classList.add('theme-fade'); setTimeout(() => root.classList.remove('theme-fade'), 260); }
    first.current = false;
    for (const [k, v] of Object.entries(toCssVars(appearance, osDark))) root.style.setProperty(k, v);
  }, [appearance, osDark]);
  useEffect(() => { document.documentElement.classList.toggle('reduced-motion', reduced); }, [reduced]);
  return <>{children}</>;
}
