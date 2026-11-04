import { Suspense, startTransition, useEffect, useState, type ReactNode } from 'react';

// A promise that never settles: throwing it inside a Suspense boundary "freezes" that subtree.
// React keeps its DOM and state, hides it, and skips re-rendering it until it is unfrozen.
const never = new Promise<never>(() => {});
function Suspender({ frozen, children }: { frozen: boolean; children: ReactNode }) {
  if (frozen) throw never;
  return <>{children}</>;
}
/** Keeps `children` mounted but hidden and paused while `frozen`. */
export function Freeze({ frozen, children }: { frozen: boolean; children: ReactNode }) {
  return <Suspense fallback={null}><Suspender frozen={frozen}>{children}</Suspender></Suspense>;
}

/** Run `f` when the browser is idle (Safari has no requestIdleCallback, so fall back to a timer). */
export function whenIdle(f: () => void, timeout = 1500): () => void {
  const w = window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
  if (w.requestIdleCallback) { const id = w.requestIdleCallback(f, { timeout }); return () => w.cancelIdleCallback?.(id); }
  const id = setTimeout(f, 250);
  return () => clearTimeout(id);
}

/**
 * Renders its children the first time `show` is true (or ahead of time, while idle, with `warm`),
 * then keeps them: hidden and frozen when not shown, so showing them again is instant.
 */
export function Keep({ show, warm = false, children }: { show: boolean; warm?: boolean; children: ReactNode }) {
  const [alive, setAlive] = useState(show);
  const [committed, setCommitted] = useState(false);
  useEffect(() => { if (show && !alive) setAlive(true); }, [show, alive]);
  useEffect(() => { if (!warm || alive) return; return whenIdle(() => startTransition(() => setAlive(true))); }, [warm, alive]);
  useEffect(() => { if ((alive || show) && !committed) setCommitted(true); }, [alive, show, committed]);
  if (!alive && !show) return null;
  return <div className="keep" style={show ? undefined : { display: 'none' }}><Freeze frozen={!show && committed}>{children}</Freeze></div>;
}
