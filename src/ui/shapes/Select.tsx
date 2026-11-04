import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons';

export interface SelectOption<V extends string = string> { value: V; label: string; dot?: string; icon?: string; font?: string; hint?: string }

const isPhone = () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 720px)').matches;

/**
 * App-styled dropdown (replaces the browser's built-in <select>, which ignores the theme on Windows).
 * Keyboard: ↑/↓, Home/End, Enter/Space, Esc, and type to jump. On phones it opens as a bottom sheet.
 */
export function Select<V extends string>({ value, options, onChange, ariaLabel, className = '', style, prefix, compact }: {
  value: V; options: SelectOption<V>[]; onChange: (v: V) => void; ariaLabel?: string; className?: string; style?: CSSProperties; prefix?: ReactNode; compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ left: number; top?: number; bottom?: number; width: number; maxH: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ s: '', t: 0 });
  const cur = options.find((o) => o.value === value) ?? options[0];
  const phone = open && isPhone();

  const place = () => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom - 12, above = r.top - 12;
    const want = Math.min(320, options.length * 40 + 12);
    const width = Math.max(r.width, 180);
    const left = Math.min(r.left, window.innerWidth - width - 8);
    setPos(below >= Math.min(want, 200) || below >= above ? { left, top: r.bottom + 6, width, maxH: Math.min(want, below) } : { left, bottom: window.innerHeight - r.top + 6, width, maxH: Math.min(want, above) });
  };
  useLayoutEffect(() => { if (open) { place(); setActive(Math.max(0, options.findIndex((o) => o.value === value))); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => { if (!list.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    // follow the button when something scrolls (e.g. the panel scrolling it into view); close only if it leaves the screen
    const onScroll = (e: Event) => {
      if (list.current?.contains(e.target as Node)) return;
      const r = btn.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) setOpen(false); else place();
    };
    window.addEventListener('pointerdown', close, true);
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('pointerdown', close, true); window.removeEventListener('resize', onScroll); window.removeEventListener('scroll', onScroll, true); };
  }, [open]);
  useEffect(() => { if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' }); }, [active, open]);

  const pick = (i: number) => { const o = options[i]; if (o) { if (o.value !== value) onChange(o.value); } setOpen(false); btn.current?.focus(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); btn.current?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
    else if (e.key === 'Tab') setOpen(false);
    else if (e.key.length === 1) {
      const now = Date.now();
      typed.current = { s: (now - typed.current.t < 700 ? typed.current.s : '') + e.key.toLowerCase(), t: now };
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.s));
      if (i >= 0) setActive(i);
    }
  };

  const row = (o: SelectOption<V>, i: number) => (
    <div key={o.value} data-i={i} role="option" aria-selected={o.value === value} className={`dd-opt ${i === active ? 'active' : ''} ${o.value === value ? 'on' : ''}`}
      onPointerEnter={() => setActive(i)} onClick={() => pick(i)} style={o.font ? { fontFamily: o.font } : undefined}>
      {o.dot && <span className="sdot" style={{ background: o.dot }} />}
      {o.icon && <Icon name={o.icon} size={16} />}
      <span className="grow">{o.label}{o.hint && <span className="muted"> · {o.hint}</span>}</span>
      {o.value === value && <Icon name="check" size={15} stroke={2.6} />}
    </div>
  );

  return (
    <>
      <button ref={btn} type="button" className={`dd ${compact ? 'compact' : ''} ${open ? 'open' : ''} ${className}`} style={style}
        aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen(!open)} onKeyDown={onKey}>
        {prefix}
        {cur?.dot && <span className="sdot" style={{ background: cur.dot }} />}
        <span className="grow dd-val" style={cur?.font ? { fontFamily: cur.font } : undefined}>{cur?.label}</span>
        <motion.span className="dd-chev" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}><Icon name="down" size={15} /></motion.span>
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (phone ? (
            <motion.div key="sheet" className="dd-sheet-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <motion.div ref={list} className="dd-sheet" role="listbox" aria-label={ariaLabel} initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 30, transition: { duration: 0.12 } }} transition={{ type: 'spring', stiffness: 520, damping: 40 }} onKeyDown={onKey}>
                <div className="ps-grab" />
                {ariaLabel && <div className="ps-title">{ariaLabel}</div>}
                {options.map(row)}
              </motion.div>
            </motion.div>
          ) : pos && (
            <motion.div key="menu" ref={list} className="dd-menu" role="listbox" aria-label={ariaLabel}
              style={{ left: pos.left, top: pos.top, bottom: pos.bottom, width: pos.width, maxHeight: pos.maxH }}
              initial={{ opacity: 0, y: pos.top !== undefined ? -4 : 4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ type: 'spring', stiffness: 600, damping: 38 }}>
              {options.map(row)}
            </motion.div>
          ))}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
