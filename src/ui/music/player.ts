// Framework-free audio player for the user's own tracks.
// Hard rule: never plays while the window is hidden/minimised.
import type { Track } from '../../core/types';

export interface AudioLike {
  src: string; currentTime: number; duration: number; volume: number; paused: boolean;
  play(): Promise<void>; pause(): void; load(): void;
  addEventListener(ev: string, fn: () => void): void;
}

export interface PlayerState { trackId: string | null; playing: boolean; time: number; duration: number }

export class Player {
  private tracks: Track[] = [];
  private order: number[] = [];
  private pos = 0;
  private visible = true;
  private wasPlaying = false;
  private errorsInRow = 0;
  repeat: 'off' | 'all' | 'one' = 'all';
  resumeOnReturn = true;
  onState: (s: PlayerState) => void = () => {};
  onMissing: (id: string) => void = () => {};

  constructor(private audio: AudioLike, private url: (file: string) => string) {
    audio.addEventListener('ended', () => this.ended());
    audio.addEventListener('error', () => this.failed());
    audio.addEventListener('timeupdate', () => this.emit());
    audio.addEventListener('play', () => this.emit());
    audio.addEventListener('pause', () => this.emit());
    audio.addEventListener('loadedmetadata', () => { this.errorsInRow = 0; this.emit(); });
  }

  load(tracks: Track[], startId?: string, shuffle = false) {
    const keep = this.current()?.id;
    this.tracks = tracks.filter((t) => !t.missing);
    this.order = this.tracks.map((_, i) => i);
    if (shuffle) for (let i = this.order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [this.order[i], this.order[j]] = [this.order[j], this.order[i]]; }
    const want = startId ?? keep;
    const idx = want ? this.order.findIndex((i) => this.tracks[i].id === want) : -1;
    this.pos = idx >= 0 ? idx : 0;
    this.emit();
  }

  current(): Track | undefined { return this.tracks[this.order[this.pos]]; }
  isPlaying() { return !this.audio.paused; }

  private setSrc() {
    const t = this.current();
    if (!t) return false;
    const u = this.url(t.file);
    if (this.audio.src !== u) { this.audio.src = u; this.audio.load(); }
    return true;
  }

  async play(id?: string) {
    if (id) { const i = this.order.findIndex((k) => this.tracks[k].id === id); if (i >= 0) { this.pos = i; this.audio.src = ''; } }
    if (!this.visible) { this.wasPlaying = true; return; }
    if (!this.setSrc()) return;
    try { await this.audio.play(); } catch { /* blocked or failed; error event handles missing */ }
    this.emit();
  }

  pause() { this.wasPlaying = false; this.audio.pause(); this.emit(); }
  toggle() { return this.isPlaying() ? this.pause() : this.play(); }

  next(auto = false) {
    if (!this.tracks.length) return;
    const atEnd = this.pos >= this.order.length - 1;
    if (atEnd && this.repeat === 'off' && auto) { this.audio.pause(); this.emit(); return; }
    this.pos = atEnd ? 0 : this.pos + 1;
    const playing = auto || this.isPlaying();
    this.audio.src = '';
    if (playing) this.play(); else this.emit();
  }

  prev() {
    if (!this.tracks.length) return;
    if (this.audio.currentTime > 3) { this.audio.currentTime = 0; return; }
    this.pos = this.pos > 0 ? this.pos - 1 : this.order.length - 1;
    const playing = this.isPlaying();
    this.audio.src = '';
    if (playing) this.play(); else this.emit();
  }

  seek(fraction: number) { if (this.audio.duration) this.audio.currentTime = Math.max(0, Math.min(1, fraction)) * this.audio.duration; this.emit(); }
  setVolume(v: number) { this.audio.volume = Math.max(0, Math.min(1, v)); }

  /** Called on minimise/hide/show. */
  setVisible(v: boolean) {
    if (v === this.visible) return;
    this.visible = v;
    if (!v) {
      this.wasPlaying = this.isPlaying();
      if (this.wasPlaying) this.audio.pause();
    } else if (this.wasPlaying && this.resumeOnReturn) {
      this.wasPlaying = false;
      this.play();
    } else this.wasPlaying = false;
    this.emit();
  }

  private ended() {
    if (this.repeat === 'one') { this.audio.currentTime = 0; this.play(); return; }
    this.next(true);
  }

  private failed() {
    const t = this.current();
    if (!t || !this.audio.src) return;
    this.onMissing(t.id);
    this.errorsInRow++;
    if (this.errorsInRow >= this.tracks.length) { this.audio.pause(); this.audio.src = ''; this.errorsInRow = 0; this.emit(); return; }
    this.pos = this.pos >= this.order.length - 1 ? 0 : this.pos + 1;
    this.audio.src = '';
    this.play();
  }

  private emit() {
    this.onState({ trackId: this.current()?.id ?? null, playing: this.isPlaying(), time: this.audio.currentTime || 0, duration: this.audio.duration || this.current()?.durationSec || 0 });
  }
}
