import { describe, test, expect, beforeEach } from 'vitest';
import { Player, type AudioLike } from './player';
import type { Track } from '../../core/types';

class FakeAudio implements AudioLike {
  src = ''; currentTime = 0; duration = 180; volume = 1; paused = true;
  private l: Record<string, (() => void)[]> = {};
  addEventListener(ev: string, fn: () => void) { (this.l[ev] ??= []).push(fn); }
  emit(ev: string) { (this.l[ev] ?? []).forEach((f) => f()); }
  play() { this.paused = false; this.emit('play'); return Promise.resolve(); }
  pause() { this.paused = true; this.emit('pause'); }
  load() {}
}
const tr = (id: string): Track => ({ id, title: id, artist: '', file: `${id}.mp3`, durationSec: 180 });

describe('player', () => {
  let a: FakeAudio; let p: Player;
  beforeEach(() => { a = new FakeAudio(); p = new Player(a, (f) => `lofi-music://${f}`); p.load([tr('a'), tr('b'), tr('c')]); });

  test('plays the current track', async () => {
    await p.play();
    expect(a.paused).toBe(false);
    expect(a.src).toBe('lofi-music://a.mp3');
  });
  test('pauses when hidden', async () => {
    await p.play();
    p.setVisible(false);
    expect(a.paused).toBe(true);
  });
  test('cannot start playing while hidden', async () => {
    p.setVisible(false);
    await p.play();
    expect(a.paused).toBe(true);
  });
  test('resumes on show only if it was playing', async () => {
    await p.play();
    p.setVisible(false);
    p.setVisible(true);
    expect(a.paused).toBe(false);
    p.pause();
    p.setVisible(false);
    p.setVisible(true);
    expect(a.paused).toBe(true);
  });
  test('does not resume when resumeOnReturn is off', async () => {
    p.resumeOnReturn = false;
    await p.play();
    p.setVisible(false);
    p.setVisible(true);
    expect(a.paused).toBe(true);
  });
  test('player skips missing track', async () => {
    const missing: string[] = [];
    p.onMissing = (id) => missing.push(id);
    await p.play();
    a.emit('error');
    expect(missing).toEqual(['a']);
    expect(p.current()?.id).toBe('b');
    expect(a.paused).toBe(false);
  });
  test('next wraps with repeat all and stops with repeat off', async () => {
    p.repeat = 'all';
    p.next(); p.next(); p.next();
    expect(p.current()?.id).toBe('a');
    p.repeat = 'off';
    p.next(); p.next();
    await p.play();
    a.emit('ended');
    expect(a.paused).toBe(true);
  });
  test('repeat one replays', async () => {
    p.repeat = 'one';
    await p.play();
    a.emit('ended');
    expect(p.current()?.id).toBe('a');
    expect(a.currentTime).toBe(0);
  });
  test('all tracks missing stops instead of looping forever', async () => {
    await p.play();
    a.emit('error'); a.emit('error'); a.emit('error');
    expect(a.paused).toBe(true);
  });
});
