import { describe, test, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadWithFallback, saveAtomic, pruneBackups, writeCloudBackup, CLOUD_FILE } from './storage';

let dir: string;
beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lofi-')); });

describe('storage', () => {
  test('save then load round-trips', () => {
    saveAtomic(dir, JSON.stringify({ tasks: [1] }), '2026-11-03');
    expect(loadWithFallback(dir)).toEqual({ data: { tasks: [1] }, recovered: false });
  });
  test('no file returns null', () => expect(loadWithFallback(dir)).toBeNull());
  test('first save each day writes a dated backup', () => {
    saveAtomic(dir, '{"a":1}', '2026-11-03');
    saveAtomic(dir, '{"a":2}', '2026-11-03');
    const b = fs.readdirSync(path.join(dir, 'backups'));
    expect(b).toEqual(['data-2026-11-03.json']);
    expect(JSON.parse(fs.readFileSync(path.join(dir, 'backups', b[0]), 'utf8'))).toEqual({ a: 1 });
  });
  test('loadWithFallback uses the newest valid backup when data.json is corrupt', () => {
    fs.mkdirSync(path.join(dir, 'backups'));
    fs.writeFileSync(path.join(dir, 'backups', 'data-2026-11-01.json'), '{"v":1}');
    fs.writeFileSync(path.join(dir, 'backups', 'data-2026-11-02.json'), '{"v":2}');
    fs.writeFileSync(path.join(dir, 'backups', 'data-2026-11-03.json'), '{broken');
    fs.writeFileSync(path.join(dir, 'data.json'), '{"tasks": [');
    const r = loadWithFallback(dir)!;
    expect(r.data).toEqual({ v: 2 });
    expect(r.recovered).toBe(true);
    expect(fs.readdirSync(dir).some((f) => f.startsWith('data.corrupt-'))).toBe(true);
  });
  test('pruning keeps 14 backups', () => {
    fs.mkdirSync(path.join(dir, 'backups'));
    for (let i = 1; i <= 20; i++) fs.writeFileSync(path.join(dir, 'backups', `data-2026-10-${String(i).padStart(2, '0')}.json`), '{}');
    pruneBackups(dir, 14);
    const left = fs.readdirSync(path.join(dir, 'backups')).sort();
    expect(left.length).toBe(14);
    expect(left[0]).toBe('data-2026-10-07.json');
  });
  test('atomic write leaves no temp file', () => {
    saveAtomic(dir, '{}', '2026-11-03');
    expect(fs.existsSync(path.join(dir, 'data.json.tmp'))).toBe(false);
  });
});

describe('cloud folder backup', () => {
  test('writes one file and replaces it each time (no pile-up)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-'));
    expect(writeCloudBackup(dir, '{"a":1}')).toBe(true);
    expect(writeCloudBackup(dir, '{"a":2}')).toBe(true);
    expect(fs.readdirSync(dir)).toEqual([CLOUD_FILE]);
    expect(fs.readFileSync(path.join(dir, CLOUD_FILE), 'utf8')).toBe('{"a":2}');
  });
  test('refuses a folder that does not exist (e.g. Drive not running) and invalid JSON', () => {
    expect(writeCloudBackup('/nope/not/here', '{}')).toBe(false);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-'));
    expect(writeCloudBackup(dir, 'not json')).toBe(false);
    expect(fs.readdirSync(dir)).toEqual([]);
  });
});
