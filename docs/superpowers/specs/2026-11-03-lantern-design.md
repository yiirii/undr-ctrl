# Lantern: design spec

*Working title. A personal, gamified to-do and budget app for Windows. Real-life progress levels you up like an RPG character, inside a calm, minimal 2D interface.*

Date: 2026-11-03 · Owner: Chloe · Status: awaiting review (rev 3: added customisation)

---

## 1. Intent

**Who:** one person (Chloe), on one Windows PC, for daily use.

**Why:** ordinary to-do and budget apps don't make you *want* to come back. Lantern turns real-life progress (studying, working out, saving money) into visible character growth, wrapped in an interface calm enough to live in all day.

**Success looks like:**
- Opening it every day is a habit.
- Logging a task or expense takes under 3 seconds.
- Stats feel like an honest mirror of real life.
- Milestones feel genuinely rewarding.
- It feels like a polished, zen app (Microsoft To Do × Discord × Not Boring), not a utility.

### What Chloe decided (source of truth)

| Topic | Decision |
|---|---|
| Platform | Windows desktop app (.exe) |
| Data | Stored on this PC only. Export and import for backup. No sync. |
| To-do | My Day + custom lists, due dates & reminders, recurring tasks & habits |
| Budget | Category budgets (monthly limits) and savings goals with charts. Expenses only, in RM. |
| Game | RPG levelling only. No HP, no knockout, **no coins**. |
| Stats | Intelligence (studying), Strength (working out), Wealth (saving raises it, every ringgit spent lowers it), Discipline, Creativity, Charisma |
| Task → stat | Each list has a stat. Tasks inherit it and can override it individually. |
| Decay | None. Only streaks reset. |
| RPG layers | Daily & weekly quests, achievements & titles. Unlocks come from levels and achievements. |
| Character visual | A stat radar (hexagon) that morphs as stats change |
| Customisation | Themes, accent colours, fonts, text size, layout & density. Practical options are free from day one; special themes, accents and sound packs are earned. |
| Art | **2D only:** geometric shapes, no illustrations or 3D assets |
| Layout | Two columns, like Microsoft To Do |
| UI look | Minimal and zen. Dark Discord-style greys. Starts monochrome; accent colours are unlocked by playing. |
| Feel | **Calm by default, big on moments.** Everyday actions get soft springs and subtle sound; celebrations are saved for milestones. |

## 2. Experience overview

**Two-column window:**
1. **Sidebar (left, 272 px):**
   - Character card: a mini stat radar, your name, title, level and XP bar.
   - Navigation: My Day, Planned, Habits, Budget, Quests, Profile.
   - Then your lists, each with its stat colour dot and an open-task count.
   - Settings at the bottom.
2. **Main area:** the current view, with generous whitespace and one clear focal point per screen.

**Visual language:**
- **Greys:** background `#1e1f22`, sidebar `#2b2d31`, main `#313338`, cards `#383a40`.
- **Typography:** Inter, with a tight heading scale (28 / 15 / 13 / 11).
- **Colour discipline:** colour appears only where it means something. Each stat has a hue; gold means XP, green means done, red means over budget. Plus the accent once unlocked.
- **Shapes as a language:**
  - Circles are tasks.
  - Hexagons are character and stats.
  - Rounded squares are money.
  - Diamonds are habits and streaks.
- **Empty states:** slow, ambient shape compositions (a few drifting forms), never clip-art.

**Quick-add (Ctrl+Space, available everywhere):** one input that understands both tasks and expenses.
- `essay due fri 5pm #uni` creates a task in the Uni list, due Friday at 17:00.
- `12.50 lunch food` logs an RM 12.50 expense, described as "lunch", in the Food category.
- `gym every mon wed fri` creates a recurring habit.
- A preview chip shows how it was understood before you press Enter. Tab cycles through other interpretations.

## 3. Features

### 3.1 To-do

- **Lists:** user-created, each with a name, icon (from a small geometric icon set), colour and **stat** (one of the six, or "None", which still earns character XP).
  - Default lists on first run: Uni (Intelligence), Fitness (Strength), Work (Discipline), Personal (Discipline), Creative (Creativity), Social (Charisma).
- **Task fields:**
  - Title and notes.
  - Due date and optional time, with an optional reminder (Windows toast notification).
  - **Size**, which sets the XP: Quick 10 / Normal 20 / Big 40.
  - Stat override.
  - Recurrence rule.
  - "In My Day" flag.
- **My Day:** a daily focus list. It's empty each morning, and a "Suggestions" drawer offers tasks that are due today, overdue, or Big tasks with no due date.
- **Planned:** every task with a due date, grouped into Overdue, Today, Tomorrow, This week and Later.
- **Recurring tasks:** daily, weekdays, weekly on chosen days, every N days, or monthly on a given day. Completing one creates the next instance.
- **Habits** are a recurring task with a **streak**, shown as a row of diamonds for the last 14 occurrences.
  - Missing one resets the streak to 0. That is the only consequence.
- **Task detail:** a slide-in panel from the right, like Microsoft To Do.
- **Done:** completed tasks move to a collapsible "Completed" section. Undo reverses the XP exactly.

### 3.2 Budget

- **Categories:** name, icon, colour and **monthly limit (RM)**.
  - Defaults: Food 600, Transport 200, Shopping 300, Bills 400, Fun 200, Other 150. All editable.
- **Expense:** amount, category, note and date (defaults to now). Logged via quick-add or a form.
- **Month view:**
  - One large focal number: **RM left this month**.
  - Category bars below it. Each is neutral below 80%, amber from 80% to 100%, and red over 100%.
  - A recent-expenses list, editable inline.
- **Savings goals:** name, target and optional deadline.
  - Shown as a rounded square that fills with liquid (a wave animation).
  - "Add to goal" logs a deposit.
- **Charts** (custom SVG, styled like the rest of the app):
  - A donut of spend by category this month.
  - A line of cumulative daily spend against the budget pace line.
  - A 6-month bar history.

### 3.3 Character & stats

- **Six stats**, each with its own XP and level:

  | Stat | Hue | Fed by | Title noun |
  |---|---|---|---|
  | Intelligence | blue `#6ea8fe` | Study and learning lists | Scholar |
  | Strength | coral `#ff7a6b` | Workouts and fitness lists | Warrior |
  | Wealth | gold-green `#9fd36a` | Money (see §4.2) | Merchant |
  | Discipline | slate violet `#a79bff` | Chores, work, errands and habits from lists marked Discipline | Monk |
  | Creativity | pink `#f59ac6` | Hobbies, art, music and side projects | Artisan |
  | Charisma | amber `#ffc069` | Social plans, calls and networking | Bard |

- **Character level** comes from **lifetime XP gained from actions**: tasks, habits, quests, achievements, savings deposits and bookkeeping. It never goes down.
- **Title** = rank (from character level) + noun (from your highest stat). For example "Adept Scholar".
  - Ranks: Novice (Lv 1–4), Apprentice (5–9), Journeyman (10–19), Adept (20–34), Master (35–49), Grandmaster (50+).
  - Achievements unlock extra special titles you can choose to wear.
- **Stat radar:** a hexagon with one axis per stat.
  - It's the character's visual identity: shown in miniature in the sidebar and large on Profile.
  - The filled shape morphs with a spring whenever a stat changes, and its vertices pulse in the stat's colour when that stat gains XP.
- **Profile view:**
  - The large radar, with each axis labelled with its level.
  - Per-stat rows with level, progress and a 30-day sparkline.
  - Lifetime numbers, the achievements grid and the title picker.

### 3.4 Quests

- **Daily:** 3 quests, rolled at local midnight, picked from a template pool weighted toward lists you actually use. Examples:
  - "Complete 2 Intelligence tasks"
  - "Clear My Day"
  - "Log your spending today"
  - "Keep a habit streak alive"
  - "Finish a Big task before noon"
- **Weekly:** 2 quests, rolled Monday 00:00. Examples:
  - "Work out 3 times"
  - "Stay under budget in every category this week (so far)"
  - "Add RM 50 to savings"
- **Rewards:** dailies give 30 XP and weeklies give 120 XP. Quest XP is general character XP; it doesn't go to any stat.
- **Reroll:** 1 free reroll per day.

### 3.5 Achievements

About 35 at launch, in tiers (bronze, silver, gold), shown as a grid of hexagon badges. Each gives XP, and some unlock a title or an accent colour. Examples:
- First Steps: first task.
- Centurion: 100 tasks.
- Bookworm: Intelligence 10.
- Iron Will: 30-day habit streak.
- Penny Pincher: a month under budget in every category.
- Nest Egg: first savings goal completed.
- Night Owl: a task completed after midnight.
- Renaissance: every stat at level 5 or higher.

### 3.6 Customisation

**Principle:** practical customisation is **free from day one**. The *special* extras are **earned** through levels and achievements (§3.7). Everything lives in **Settings → Appearance**, with a live preview pane that updates instantly as you change things.

**Themes:** each theme sets the background, surface, text and line colours. The meaning colours (stats, XP, done, over budget) are retuned per theme to keep contrast.

| Theme | Availability | Feel |
|---|---|---|
| Discord Grey (default) | free | the current greys |
| Midnight | free | near-black, for OLED and late nights |
| Light | free | soft off-white with grey surfaces |
| Nord | free | cool blue-grey |
| Sepia | free | warm paper tones, easy on the eyes |
| Follow system | free | switches between Discord Grey and Light with Windows |
| Dusk gradient | earned: Lv 12 | a subtle violet-to-ink gradient behind the main area |
| Forest | earned: achievement "Iron Will" | deep green-greys |
| Aurora | earned: Lv 35 | a slowly shifting gradient sidebar |

**Accent colour:**
- **Free:** Monochrome (default), Mint, Violet, Sky, Coral, plus a custom accent picker with any hex value, which automatically adjusts lightness for contrast.
- **Earned:** Gold (Lv 20), Rose (achievement), animated gradient accents such as Sunset (Lv 25) and Aurora (Lv 35).
- The accent tints the focus rings, the selected nav item, the XP bar, buttons, checkbox fills (when "use stat colours" is off) and celebration effects.

**Fonts & text:**
- **Bundled fonts**, offline, all free:
  - Inter (default)
  - Manrope (geometric, friendly)
  - Nunito (rounded, soft)
  - Space Grotesk (quirky, techy)
  - IBM Plex Sans (crisp, neutral)
  - JetBrains Mono (mono, for a terminal feel)
- **Separate choices** for the UI font and the heading font, so headings can use a display face.
- **Text size:** 90%, 100%, 110%, 125% or 140%. The whole UI scales from one root size.
- **Number style:** tabular or proportional figures, and an RM format of "RM 12.50" or "RM12.50".

**Layout & density:**
- **Density:** Compact, Cozy (default) or Spacious. Changes row height, padding and gaps.
- **Corner roundness:** Sharp (4 px), Soft (10 px, default) or Round (18 px). Applies to cards, buttons and chips.
- **Sidebar:** drag to resize between 220 and 340 px, collapse to an icon rail, and choose which pages appear (hide Planned, Quests and so on) and in what order.
- **Start page:** My Day (default), Planned, any list, Budget or Profile.
- **Week starts on** Monday (default) or Sunday. This affects weekly quests, Planned grouping and charts.
- **Date format:** 3 Nov, 03/11 or 2026-11-03. **Time format:** 12-hour or 24-hour.

**Per-list appearance:** each list's colour, icon (from the geometric icon set) and an optional emoji in place of the icon.

**Basics (kept from motion & sound):**
- Sound pack, master volume and mute.
- Reduced motion.

**Storage:**
- Appearance settings are saved with the data file and included in export and import.
- "Reset appearance" restores the defaults without touching any tasks or data.

**How it's built:**
- Every visual property comes from CSS custom properties (design tokens: colour, radius, spacing, font and size).
- A theme is just a token set, and changing a setting swaps tokens at the root with a 200 ms cross-fade. Nothing reloads.

### 3.7 Earned unlocks (no currency)

Levelling up and achievements unlock the special extras automatically:
- **Earned themes and accents** from §3.6.
- **Completion sound packs:** Soft (default), Glass (Lv 8), Wood (Lv 12), Chime (achievement).
- **Titles:** from ranks and achievements.

A new unlock appears in the level-up overlay with an **"Apply now"** button. Locked items show in Settings as faded tiles labelled with their requirement (for example "Reach Lv 20"), so there's always something visible to work toward.

### 3.8 Motion & feel: "calm by default, big on moments"

**Everyday tier (subtle):**
- Every state change uses spring physics. Nothing snaps, nothing bounces too much.
- **Completing a task:**
  - The circle fills with the stat's colour and the checkmark draws itself.
  - The row softly collapses, and a small "+20" drifts up and fades.
  - The sidebar XP bar eases forward.
  - A soft click plays.
- Hover lifts by 1 px, pressing scales to 0.98, and lists reorder with layout animation.

**Moment tier (big):**
- **Character level up:** a full-window overlay.
  - The background dims and a hexagon assembles from six shards flying in from the edges.
  - The level number rolls, a ring of geometric particles blooms outward, and any new unlocks list in.
  - A rising arpeggio plays. Any key dismisses it.
- **Stat level up:** a toast in the stat's colour, with that radar vertex flaring and a two-note chime.
- **Quest complete:** the quest card flips, sheds shards and slides into a "done" stack.
- **Achievement:** a hexagon badge stamps in with a shimmer sweep.
- **Streak milestones (7, 30, 100):** the streak diamonds light up in a cascade.

**Sound:** synthesized with WebAudio, so no audio files are needed. There are three packs, a master volume and mute.

**Reduced motion:** swaps every effect for simple fades.

## 4. Game rules (exact numbers)

### 4.1 XP from tasks & habits

- **Base XP by size:** Quick 10, Normal 20, Big 40.
- **On-time bonus:** +25% if the task had a due date and was completed by it.
- **Habit streak multiplier:** ×(1 + 0.1 × min(streak, 10)), so ×2 at a streak of 10 or more.
- **Where the XP goes:** to the task's stat and also to character lifetime XP. If the stat is "None", it goes to character XP only.
- **Rounding:** all XP is rounded to the nearest integer.

### 4.2 Wealth ("every ringgit counts")

- Every expense **subtracts** Wealth XP, at 1 XP per RM 1.
- **Daily allowance drip:** each local day adds Wealth XP equal to (total monthly budget ÷ days in month).
  - It's applied at midnight, or caught up on the next app open.
  - Net effect: you gain Wealth when you spend less than your budget and lose it when you overspend.
- **Savings deposits:** +2 Wealth XP per RM 1. Deposits also count toward character lifetime XP.
- **Limits:**
  - Wealth XP can't drop below 0. The Wealth *level* can go down.
  - Spending and the drip never touch character level.
- **Bookkeeping reward:** logging an expense on the day it happened gives +2 character XP.

### 4.3 Level curves

- **Stat level s** requires a cumulative stat XP of 25·s·(s−1).
  - Level 2 needs 50, level 5 needs 500, level 10 needs 2,250, level 20 needs 9,500.
- **Character level L** requires a lifetime XP of 50·L·(L−1).
  - Level 2 needs 100, level 5 needs 1,000, level 10 needs 4,500, level 20 needs 19,000, level 50 needs 122,500.
- **Expected pace:** about 100–200 XP a day gives level 10 in roughly 1 month and level 20 in roughly 4 months.

### 4.4 Undo & integrity

- Every XP change is written to an append-only **ledger**: id, time, source, stat, amount, whether it counts toward lifetime XP, and reference.
- Undoing a task, deleting an expense or editing an amount adds compensating entries.
- Stats and levels are always derived from the ledger, so the numbers can't drift.

## 5. Architecture

- **Stack:**
  - Electron (main + preload + renderer).
  - Vite, React 18 and TypeScript.
  - Zustand for state, Framer Motion for springs.
  - Custom SVG for the radar, charts and shapes, plus a lightweight canvas particle layer for milestone moments.
  - Vitest for unit tests and Playwright for UI checks.
- **The renderer runs in a plain browser too.** A storage adapter swaps Electron IPC for localStorage, which allows automated UI testing and screenshots without Electron.

**Module layout:**

```
src/
  core/            pure TypeScript, no React or DOM, fully unit-tested
    types.ts       Task, List, Expense, Category, Goal, LedgerEntry, Quest, Achievement…
    ledger.ts      append and derive: stat XP, levels, lifetime XP
    rules.ts       XP formulas, Wealth rules, level curves (all numbers from §4)
    recurrence.ts  next-occurrence calculation, streak evaluation
    parser.ts      quick-add natural-language parser
    quests.ts      quest templates, rolling, progress evaluation
    achievements.ts
    unlocks.ts     earned themes, accents, sound packs, titles by level/achievement
    appearance.ts  settings schema, defaults, token sets per theme, validation
    budget.ts      month aggregation, category status, allowance drip
    clock.ts       injectable clock for midnight jobs and tests
  store/           Zustand store; actions call core, emit "moments", persist
  persistence/     adapter interface + electron-ipc and localStorage implementations
  ui/
    shell/         two-column layout, sidebar, quick-add, detail panel
    theme/         design tokens, theme provider, font loading (bundled woff2)
    views/         MyDay, Planned, List, Habits, Budget, Quests, Profile, Settings
    shapes/        radar, progress ring, liquid fill, diamond streak, icon set
    motion/        spring presets, moment overlays, particle canvas
    sound/         WebAudio synth and packs
electron/
  main.ts          window, IPC file storage, notification scheduler, tray
  preload.ts       typed, narrow contextBridge API
```

**Moments bus:**
- The store emits typed events: `taskCompleted`, `statLevelUp`, `levelUp`, `questCompleted`, `achievementUnlocked` and `streakMilestone`.
- The motion layer queues them, so several moments at once play in sequence instead of on top of each other.

**Data and persistence:**
- One JSON document, stored in `%APPDATA%/Lantern/data.json`.
- Writes are atomic (write to a temp file, then rename) and debounced by 500 ms.
- Rolling daily backups keep 14 copies.
- A schema `version` field, with migrations, protects existing data when the app updates.
- Export and import are a single `.lantern.json` file.

**Reminders:**
- The main process keeps a timer per upcoming reminder and shows a native Windows toast. Clicking it focuses the task.
- Missed reminders are shown once on the next launch.
- The app can minimise to the tray so reminders keep firing.

**Midnight jobs:** an idempotent roll-over, keyed by local date. It runs on a timer and also catches up on launch, and it:
1. Applies the allowance drip.
2. Evaluates habit streaks.
3. Rolls quests.
4. Resets My Day.

**Packaging:**
- electron-builder targets an NSIS installer (`Lantern-Setup.exe`), with a portable `.exe` as a fallback.
- The app is unsigned, so Windows SmartScreen shows "More info → Run anyway" the first time.

## 6. Error handling

- **Corrupted data file:** the app loads the newest valid backup automatically and shows a banner offering to export the broken file. It never overwrites without a backup.
- **Storage write failure:** a retry with backoff, then a persistent "Not saved" indicator. Nothing is lost while the app stays open.
- **Quick-add ambiguity:** a preview is always shown, and nothing is created without it.
- **Clock changes and timezone shifts:** midnight jobs are idempotent per local date, so nothing applies twice.

## 7. Testing

- **Core (Vitest, test-driven):**
  - Every rule in §4 with exact numbers.
  - Ledger derivation and undo symmetry.
  - Recurrence (including month ends).
  - Streaks.
  - The parser (at least 40 phrasings).
  - Quest rolling and progress, achievements and unlocks.
  - Appearance settings validation and theme token completeness (every theme defines every token, with WCAG AA contrast for text).
  - Drip catch-up.
  - Migrations.
- **UI (Playwright, against the browser build):**
  - Screenshots of every view in every free theme and at all three densities.
  - Golden flows: add task → complete → XP and level up; log expense → Wealth drop; deposit → Wealth gain; quest completion.
  - Screenshots of every view and every moment overlay at 1600×1000, reviewed by eye.
- **Packaging:** build the NSIS installer and verify it.

## 8. Out of scope for v1

The 3D town and any illustrated assets, coins and shops, sync, a mobile app, income tracking, recurring bills, subtasks, multiple currencies, and social or AI features.

## 9. Build phases (for the implementation plan)

1. **Foundation:** the core rules engine, ledger, persistence and the Electron shell, with tests.
2. **Shell & to-do:** the two-column layout, lists, My Day, Planned, task detail, recurring tasks, habits, reminders and quick-add.
3. **Budget:** categories, expenses, savings goals, charts and the Wealth rules.
4. **Character:** stats, the radar, levels, titles, Profile and the everyday motion tier.
5. **Quests, achievements & unlocks,** plus the moment tier (overlays, particles, sound).
6. **Customisation & polish:** the Appearance settings with live preview (themes, accents, fonts, size, density, sidebar), onboarding, reduced motion, the installer and a full visual QA pass.
