// Geometric line icon set (24×24, stroke = currentColor).
import type { CSSProperties } from 'react';

const P: Record<string, string> = {
  sun: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
  calendar: 'M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4',
  diamond: 'M12 3.5 20.5 12 12 20.5 3.5 12Z',
  wallet: 'M4 7.5h14.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 18V7.5Zm0 0 11-3v3M16 13.5h.01',
  flag: 'M6 20.5V4M6 4.5h11l-2.5 4 2.5 4H6',
  hex: 'M12 3 19.8 7.5v9L12 21l-7.8-4.5v-9Z',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM12 2.8l1.6 2.4 2.8-.6.6 2.8 2.4 1.6-1.4 2.6 1.4 2.6-2.4 1.6-.6 2.8-2.8-.6L12 21.2l-1.6-2.4-2.8.6-.6-2.8-2.4-1.6 1.4-2.6-1.4-2.6 2.4-1.6.6-2.8 2.8.6Z',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5 10 17.5 19 7',
  x: 'M6 6l12 12M18 6 6 18',
  left: 'M14.5 6 8.5 12l6 6',
  right: 'M9.5 6l6 6-6 6',
  down: 'M6 9.5l6 6 6-6',
  up: 'M6 14.5l6-6 6 6',
  play: 'M8 5.5v13l10.5-6.5Z',
  pause: 'M8.5 5.5v13M15.5 5.5v13',
  next: 'M6 5.5v13l9-6.5ZM18 5.5v13',
  prev: 'M18 5.5v13l-9-6.5ZM6 5.5v13',
  music: 'M9 18.5V6l11-2.5V16M9 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z',
  target: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 11.5v1',
  trash: 'M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13',
  bell: 'M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2H5ZM10 20.5h4',
  repeat: 'M5 10V8.5A2.5 2.5 0 0 1 7.5 6H18l-2.5-2.5M19 14v1.5a2.5 2.5 0 0 1-2.5 2.5H6l2.5 2.5',
  shuffle: 'M4 7h3.5l9 10H20M4 17h3.5l2.5-2.8M14 9.8 16.5 7H20M18 5l2 2-2 2M18 15l2 2-2 2',
  volume: 'M4.5 9.5h3.5L13 5.5v13l-5-4H4.5ZM16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11',
  mute: 'M4.5 9.5h3.5L13 5.5v13l-5-4H4.5ZM17 9.5l4.5 5M21.5 9.5 17 14.5',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  dot: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  book: 'M5 5.5A2 2 0 0 1 7 3.5h12v14H7a2 2 0 0 0-2 2Zm0 14a2 2 0 0 0 2 2h12M9 7.5h6',
  pen: 'M15.5 4.5l4 4L9 19H5v-4Z',
  bolt: 'M13 3 5.5 13.5H11L10 21l7.5-10.5H12Z',
  leaf: 'M5 19C5 10 11 5 19.5 4.5 19 13 14 19 5 19Zm0 0 7-7',
  spark: 'M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8Z',
  chat: 'M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3.5v-3.5h.5a2 2 0 0 1-2-2Z',
  bowl: 'M4 11.5h16a8 8 0 0 1-16 0ZM9 8c0-2 1.5-2 1.5-4M13.5 8c0-2 1.5-2 1.5-4',
  bus: 'M6 4.5h12a1.5 1.5 0 0 1 1.5 1.5v11H4.5V6A1.5 1.5 0 0 1 6 4.5ZM4.5 12h15M7.5 20v-3M16.5 20v-3M8 14.5h.01M16 14.5h.01',
  bag: 'M5.5 8h13l-1 12.5h-11ZM9 8V6.5a3 3 0 0 1 6 0V8',
  star: 'M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8Z',
  heart: 'M12 19.5s-7.5-4.4-7.5-10a4.1 4.1 0 0 1 7.5-2.3 4.1 4.1 0 0 1 7.5 2.3c0 5.6-7.5 10-7.5 10Z',
  gift: 'M4.5 9.5h15v3h-15zM6 12.5h12v8H6zM12 9.5v11M12 9.5c-1-3-5-4-5-1.5S12 9.5 12 9.5Zm0 0c1-3 5-4 5-1.5S12 9.5 12 9.5Z',
  home: 'M4.5 11 12 4.5 19.5 11v8.5h-15ZM10 19.5v-5h4v5',
  cap: 'M2.5 9.5 12 5l9.5 4.5L12 14Zm4 2v4.5c3 2 8 2 11 0v-4.5M21.5 9.5v5',
  clock: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM12 7.5V12l3 2',
  chart: 'M4 20h16M7 16.5v-5M12 16.5V6.5M17 16.5v-8',
  coins: 'M9 5.5c3 0 5.5 1 5.5 2.5S12 10.5 9 10.5 3.5 9.5 3.5 8 6 5.5 9 5.5ZM3.5 8v4c0 1.5 2.5 2.5 5.5 2.5M3.5 12v4c0 1.5 2.5 2.5 5.5 2.5M15 11.5c3 0 5.5 1 5.5 2.5s-2.5 2.5-5.5 2.5-5.5-1-5.5-2.5 2.5-2.5 5.5-2.5ZM9.5 14v4c0 1.5 2.5 2.5 5.5 2.5s5.5-1 5.5-2.5v-4',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  search: 'M10.5 4.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM15 15l5 5',
  list: 'M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01',
  undo: 'M8.5 8.5H15a4.5 4.5 0 0 1 0 9h-4M8.5 8.5 11.5 5.5M8.5 8.5l3 3',
  upload: 'M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 15.5v4h14v-4',
  download: 'M12 4.5v11M7.5 11 12 15.5 16.5 11M5 15.5v4h14v-4',
  palette: 'M12 3.5a8.5 8.5 0 0 0 0 17c1.5 0 2-1 1.5-2.2-.6-1.4.3-2.8 1.8-2.8h1.7a3.5 3.5 0 0 0 3.5-3.5c0-4.7-3.8-8.5-8.5-8.5ZM7.5 11h.01M10 7.5h.01M14.5 7.5h.01',
  sliders: 'M5 6.5h8M17 6.5h2M5 12h2M11 12h8M5 17.5h10M19 17.5h0M15 4.5v4M9 10v4M17 15.5v4',
  sidebar: 'M4.5 5.5h15v13h-15zM9.5 5.5v13',
  lock: 'M7 10.5V8a5 5 0 0 1 10 0v2.5M5.5 10.5h13v9.5h-13zM12 14.5v2',
  sparkle: 'M12 4l1.5 5 5 1.5-5 1.5L12 17l-1.5-5-5-1.5 5-1.5ZM18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z',
};
export const ICON_NAMES = Object.keys(P);
export const LIST_ICONS = ['book', 'pen', 'bolt', 'leaf', 'spark', 'chat', 'heart', 'star', 'home', 'cap', 'music', 'target', 'dot', 'bag', 'coins', 'clock'];

export function Icon({ name, size = 18, stroke = 1.8, style, className }: { name: string; size?: number; stroke?: number; style?: CSSProperties; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
      <path d={P[name] ?? P.dot} />
    </svg>
  );
}
