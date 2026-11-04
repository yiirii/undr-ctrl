import { createRoot } from 'react-dom/client';
import './ui/theme/fonts';
import './ui/styles.css';
import { ThemeProvider } from './ui/theme/ThemeProvider';
import { App } from './ui/shell/App';
import { useStore } from './store/store';
import { warmAudio } from './ui/sound/synth';

async function boot() {
  const q = new URLSearchParams(location.search);
  if (q.get('reset') && import.meta.env.DEV) localStorage.clear();
  const seed = q.get('seed');
  if (seed && import.meta.env.DEV) {
    const { seedDemo } = await import('./dev/seed');
    localStorage.setItem('lofi-data', JSON.stringify(seedDemo(seed)));
  }
  await useStore.getState().load();
  if (q.get('view')) useStore.getState().go(q.get('view') as never);
  createRoot(document.getElementById('root')!).render(<ThemeProvider><App /></ThemeProvider>);
  (window as unknown as { __lofi: unknown }).__lofi = useStore;
  warmAudio();
  // Home Screen app: offline support (web build only, never inside the desktop app)
  if (import.meta.env.PROD && !navigator.userAgent.includes('Electron') && (location.protocol === 'https:' || location.hostname === 'localhost') && 'serviceWorker' in navigator) void navigator.serviceWorker.register('./sw.js').catch(() => {});
  // Sync runs in the real app; in dev only when asked (?syncfake uses an in-memory server).
  if (!import.meta.env.DEV || q.has('syncfake') || q.has('sync')) void import('./sync/service').then((m) => m.startSyncService());
}
boot();
