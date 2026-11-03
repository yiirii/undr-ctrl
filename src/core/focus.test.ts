import { describe, test, expect } from 'vitest';
import { start, pause, resume, addFive, remaining, finish, elapsed } from './focus';

const MIN = 60000;
describe('focus', () => {
  test('remaining counts down', () => {
    const s = start('t', 25, 0);
    expect(remaining(s, 10 * MIN)).toBe(15 * MIN);
  });
  test('pause accounting', () => {
    let s = start('t', 25, 0);
    s = pause(s, 5 * MIN);
    expect(remaining(s, 20 * MIN)).toBe(20 * MIN);
    s = resume(s, 20 * MIN);
    expect(remaining(s, 25 * MIN)).toBe(15 * MIN);
    expect(elapsed(s, 25 * MIN)).toBe(10 * MIN);
  });
  test('80% rule', () => {
    const s = start('t', 25, 0);
    expect(finish(s, 0.79 * 25 * MIN).completed).toBe(false);
    expect(finish(s, 0.8 * 25 * MIN).completed).toBe(true);
    expect(finish(s, 0.8 * 25 * MIN).minutes).toBe(20);
  });
  test('addFive', () => expect(addFive(start('t', 25, 0)).durationMs).toBe(30 * MIN));
  test('never negative', () => expect(remaining(start('t', 1, 0), 10 * MIN)).toBe(0));
});
