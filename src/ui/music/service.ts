// Singleton that connects the Player to the store, the window visibility and the UI.
import { create } from 'zustand';
import { Player, type PlayerState } from './player';
import { useStore } from '../../store/store';
import { bridge } from '../../bridge';

export const useMusic = create<PlayerState>(() => ({ trackId: null, playing: false, time: 0, duration: 0 }));

let player: Player | null = null;
export function getPlayer(): Player {
  if (player) return player;
  const audio = new Audio();
  audio.preload = 'metadata';
  player = new Player(audio, (f) => (f.startsWith('blob:') || f.startsWith('data:') ? f : bridge()?.musicUrl(f) ?? f));
  player.onState = (st) => useMusic.setState(st);
  player.onMissing = (id) => useStore.getState().patch((s) => ({ ...s, music: { ...s.music, tracks: s.music.tracks.map((t) => (t.id === id ? { ...t, missing: true } : t)) } }));
  const sync = () => {
    const m = useStore.getState().s.music;
    const ids = m.activePlaylist === 'all' ? m.tracks.map((t) => t.id) : m.playlists.find((p) => p.id === m.activePlaylist)?.trackIds ?? [];
    const tracks = ids.map((id) => m.tracks.find((t) => t.id === id)).filter((t): t is NonNullable<typeof t> => !!t);
    player!.load(tracks, undefined, m.shuffle);
    player!.repeat = m.repeat;
    player!.resumeOnReturn = m.resumeOnReturn;
    player!.setVolume(m.volume);
  };
  sync();
  let last = useStore.getState().s.music;
  useStore.subscribe((st) => { if (st.s.music !== last) { last = st.s.music; sync(); } });
  // the hard rule: hidden or minimised → paused
  const vis = () => player!.setVisible(!document.hidden && (bridge()?.isWindowVisible() ?? true));
  document.addEventListener('visibilitychange', vis);
  bridge()?.onWindowHidden(() => player!.setVisible(false));
  bridge()?.onWindowShown(() => player!.setVisible(true));
  vis();
  return player;
}

export function coverColors(id: string): [string, string, number] {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hues = ['#6ea8fe', '#ff7a6b', '#9fd36a', '#a79bff', '#f59ac6', '#ffc069', '#5fd3c4'];
  return [hues[h % hues.length], hues[(h >> 3) % hues.length], h % 4];
}
export const fmtSec = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
