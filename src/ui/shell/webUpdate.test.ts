import { describe, expect, test } from 'vitest';
import { buildId, isNewBuild } from './webUpdate';

describe('iPhone app self-update', () => {
  test('reads the build from the page: the hashed main script', () => {
    expect(buildId('<script type="module" crossorigin src="./assets/index-4-YT8_5h.js"></script>')).toBe('index-4-YT8_5h.js');
    expect(buildId('https://yiirii.github.io/undr-ctrl/assets/index-Ab_9.js')).toBe('index-Ab_9.js');
    expect(buildId('<html>no script</html>')).toBeNull();
  });
  test('a different hash is a new build; same hash or an unreadable page is not', () => {
    expect(isNewBuild('index-A.js', '<script src="./assets/index-B.js">')).toBe(true);
    expect(isNewBuild('index-A.js', '<script src="./assets/index-A.js">')).toBe(false);
    expect(isNewBuild('index-A.js', 'offline error page')).toBe(false);
    expect(isNewBuild(null, '<script src="./assets/index-B.js">')).toBe(false);
  });
});
