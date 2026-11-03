# Lofi

A calm, gamified to-do, money and focus app for Windows. Real life levels you up.

## Install

1. Run `Lofi-Setup.exe`.
2. Windows SmartScreen will warn you, because the app isn't code-signed. Click **More info**, then **Run anyway**.
3. Lofi starts with Windows into the system tray. Closing the window hides it to the tray. To quit, use the tray menu.

Your data lives only on this PC, in `%APPDATA%\Lofi`. Lofi keeps 14 daily backups there and loads one automatically if `data.json` ever gets damaged.

## Everyday keys

| Key | Does |
|---|---|
| Ctrl + Space | Quick add anything: `essay due fri 5pm #uni`, `gym every mon wed fri`, `12.50 lunch`, `+500 allowance` |
| Tab (in quick add) | Switch to another reading of what you typed |
| Ctrl + E | Log money in or out |
| Esc | Close a panel |

## How levelling works

- **Lists feed stats.** For example, Uni feeds Intelligence and Fitness feeds Strength. You can change any list's stat in *Edit list*.
- **XP by task size:** Quick 10, Normal 20, Big 40.
  - Finishing before the due date gives +25%.
  - Habit streaks multiply XP, up to ×2.
- **Wealth:**
  - Every ringgit you spend lowers it.
  - Each day of your budget you don't use grows it.
  - Money you add to savings goals counts double.
- **Focus sessions:** a finished session gives +10 XP to the task's stat, then +5 for each further session, up to 4 sessions per task per day.
- **Unlocks:** levels and achievements unlock themes, accent colours and sound packs.

## Music

In Settings → Music, add your own audio files: mp3, m4a, ogg, opus, wav or flac. Music always pauses when Lofi is minimised or in the tray, and resumes when you come back if it was playing.

## Development

```bash
npm install
npm run dev:web      # browser build at http://localhost:5173 (?seed=demo for sample data)
npm test             # unit tests (vitest)
npm run e2e          # end-to-end flows (playwright)
npm run dist         # Windows installer → release/Lofi-Setup.exe (needs wine64 on Linux)
```

- **Spec:** `docs/superpowers/specs/2026-11-03-lofi-design.md`
- **Plan:** `docs/superpowers/plans/2026-11-03-lofi.md`
