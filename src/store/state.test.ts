import { describe, test, expect } from 'vitest';
import { initialState, migrate } from './state';

describe('sidebar pages added later', () => {
  test('Insights is slotted after Money in a saved order without disturbing the rest', () => {
    const old = { ...initialState('C'), settings: { ...initialState('C').settings, navOrder: ['money', 'myday', 'planned', 'habits', 'quests', 'profile'] } };
    expect(migrate(JSON.parse(JSON.stringify(old))).settings.navOrder).toEqual(['money', 'insights', 'myday', 'planned', 'habits', 'quests', 'profile']);
  });
});
