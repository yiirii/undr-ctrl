import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useStore } from '../../store/store';
import { parseQuick } from '../../core/parser';
import { dayKey } from '../../core/dates';
import { Icon } from '../shapes/icons';
import { CandidateChips, commitCandidate } from './AddRow';
import { SPRING } from '../shapes/Progress';

export function QuickAdd() {
  const s = useStore((x) => x.s);
  const setUI = useStore((x) => x.setUI);
  const view = useStore((x) => x.ui.view);
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const cands = useMemo(() => parseQuick(text, { lists: s.lists, categories: s.money.categories, sources: s.money.sources, today: dayKey(new Date()) }), [text, s.lists, s.money]);
  const close = () => setUI({ quickAdd: false });
  const listId = view.startsWith('list:') ? view.slice(5) : s.lists.find((l) => l.id === 'personal')?.id ?? s.lists[0].id;
  const commit = (at = idx) => {
    const c = cands[at];
    if (!c) return;
    commitCandidate(c, { listId, myDay: view === 'myday' });
    setText('');
    setIdx(0);
    close();
  };
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <motion.div className="qa" initial={{ y: -14, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={SPRING}>
        <div className="qa-input">
          <Icon name="plus" size={22} stroke={2.4} style={{ color: 'var(--accent)' }} />
          <input autoFocus value={text} placeholder="Add a task or expense"
            onChange={(e) => { setText(e.target.value); setIdx(0); }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close();
              else if (e.key === 'Tab') { e.preventDefault(); if (cands.length) setIdx((i) => (i + (e.shiftKey ? cands.length - 1 : 1)) % cands.length); }
              else if (e.key === 'Enter') commit();
            }} enterKeyHint="done" />
          {text.trim() && <button className="qa-go show-phone" aria-label="Add" onMouseDown={(e) => e.preventDefault()} onClick={() => commit()}><Icon name="check" size={18} stroke={2.6} /></button>}
        </div>
        {cands.length > 0 && (
          <div className="qa-cands">
            {cands.map((c, i) => (
              <div key={i} className={`qa-cand ${i === idx ? 'on' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => commit(i)}>
                <div className="parse-preview" style={{ margin: 0 }}><CandidateChips c={c} /></div>
                <div className="grow" />
                {c.kind === 'task' && <span className="qa-title">{c.title}</span>}
              </div>
            ))}
          </div>
        )}
        <div className="qa-hint"><span className="hide-phone"><span className="kbd">Enter</span> add</span><span className="hide-phone"><span className="kbd">Tab</span> other meaning</span><span className="hide-phone"><span className="kbd">Esc</span> close</span><span className="grow hide-phone" /><span>#list · fri 5pm · every mon · !big · +income</span></div>
      </motion.div>
    </div>
  );
}
