import { describe, test, expect } from 'vitest';
import fs from 'node:fs';

describe('content security policy', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const csp = html.match(/Content-Security-Policy" content="([^"]+)"/)![1];
  test('allows the Firebase endpoints sync needs (otherwise sync silently fails)', () => {
    const connect = csp.split(';').map((s) => s.trim()).find((d) => d.startsWith('connect-src'))!;
    expect(connect).toBeTruthy();
    for (const host of ['https://firestore.googleapis.com', 'https://identitytoolkit.googleapis.com', 'https://securetoken.googleapis.com']) {
      const ok = connect.split(/\s+/).some((src) => src === host || (src.startsWith('https://*.') && host.endsWith(src.slice('https://*'.length))));
      expect(ok, host).toBe(true);
    }
  });
  test('still blocks scripts from anywhere else', () => {
    expect(csp).not.toMatch(/script-src[^;]*https:/);
  });
  test('links the web app manifest and the iPhone icon', () => {
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('rel="apple-touch-icon"');
  });
});
