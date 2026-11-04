import { useRef } from 'react';
import { Icon } from './icons';

/** Search box with a magnifier, a one-click × to clear, and Esc to clear (Esc only bubbles when already empty). */
export function SearchField({ value, onChange, placeholder = 'Search', autoFocus, onEnter, width, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean; onEnter?: () => void; width?: number; className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const clear = () => { onChange(''); ref.current?.focus(); };
  return (
    <div className={`search-field ${className}`} style={width ? { width } : undefined}>
      <span className="search-ico"><Icon name="search" size={15} /></span>
      <input
        ref={ref}
        className="input"
        type="text"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) { e.preventDefault(); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); clear(); }
          else if (e.key === 'Enter') onEnter?.();
        }}
      />
      {value && <button type="button" className="search-clear" title="Clear search" aria-label="Clear search" onMouseDown={(e) => e.preventDefault()} onClick={clear}><Icon name="x" size={13} stroke={2.4} /></button>}
    </div>
  );
}
