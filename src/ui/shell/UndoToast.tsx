import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useStore, undoLast, dismissUndo } from '../../store/store';
import { Icon } from '../shapes/icons';
import { haptic } from '../motion/juice';
import { sfx } from '../sound/synth';

const SHOW_MS = 6000;

/** "Logged RM 12 · Undo": a small bar for a few seconds after an action, so a mistake is one tap to fix. */
export function UndoToast() {
  const undo = useStore((x) => x.ui.undo ?? null);
  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => dismissUndo(undo.id), SHOW_MS);
    // laptop: Ctrl+Z undoes too (but never steals undo from a text field)
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !/^(INPUT|TEXTAREA)$/.test(el.tagName) && !el.isContentEditable) { e.preventDefault(); doUndo(); }
    };
    window.addEventListener('keydown', key);
    return () => { clearTimeout(t); window.removeEventListener('keydown', key); };
  }, [undo?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const doUndo = () => { undoLast(); haptic('medium'); sfx.click(); };
  return (
    <div className="undo-wrap">
      <AnimatePresence>
        {undo && (
          <motion.div key={undo.id} className="undo-toast" role="status" initial={{ y: 24, opacity: 0, scale: 0.94 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 16, opacity: 0, scale: 0.96, transition: { duration: 0.16 } }} transition={{ type: 'spring', stiffness: 460, damping: 30 }}>
            <Icon name="check" size={15} stroke={2.6} />
            <span className="undo-label">{undo.label}</span>
            <button className="undo-btn" onClick={doUndo}><Icon name="undo" size={14} stroke={2.4} />Undo</button>
            <span className="undo-timer" style={{ animationDuration: `${SHOW_MS}ms` }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
