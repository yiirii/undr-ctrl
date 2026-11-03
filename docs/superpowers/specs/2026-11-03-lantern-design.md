# Lantern: design spec

*Working title. A personal, gamified to-do and budget app for Windows that levels you up like an RPG character and lets you build a cozy floating town.*

Date: 2026-11-03 · Owner: Chloe · Status: awaiting review

---

## 1. Intent

**Who:** one person (Chloe), on one Windows PC, for daily use.

**Why:** ordinary to-do and budget apps don't make you *want* to come back. Lantern turns real-life progress (studying, working out, saving money) into visible character growth and a little town you care about, so finishing things feels rewarding.

**Success looks like:**
- Opening it every day is a habit.
- Logging a task or expense takes under 3 seconds.
- Stats feel like an honest mirror of real life.
- The town is something you're proud of after a few months.
- It looks and feels like a polished indie game, not a utility.

### What Chloe decided (source of truth)

| Topic | Decision |
|---|---|
| Platform | Windows desktop app (.exe) |
| Data | Stored on this PC only. Export and import for backup. No sync. |
| To-do | My Day + custom lists, due dates & reminders, recurring tasks & habits |
| Budget | Category budgets (monthly limits) and savings goals with charts. Expenses only, in RM. |
| Game | RPG levelling only. **No HP, no knockout, no penalties apart from those listed in §4.** |
| Stats | Intelligence (studying), Strength (working out), Wealth (saving raises it, every ringgit spent lowers it), Discipline, Creativity, Charisma |
| Task → stat | Each list has a stat. Tasks inherit it and can override it individually. |
| Decay | None. Only streaks reset. |
| RPG layers | Daily & weekly quests, achievements & titles, coins spent on building a town |
| Town art | Low-poly, cozy, cel-shaded indie style, at the level of detail of the approved samples (`samples/out/v2_*.png`) |
| UI look | Minimal, dark Discord-style greys, smooth shape-based motion like the Not Boring apps. Starts monochrome; accent colours are unlocked by playing. |
| Feel | Full juice: springy animation, particles, synthesized sounds (can be muted) |

## 2. Experience overview

The window has three columns. Each side panel can be collapsed.

1. **Left sidebar (character):**
   - A hexagon avatar ringed by level progress, your name and title.
   - The overall level with its XP bar, and a coins counter.
   - Navigation: My Day, Habits, Budget, Town, Quests, Profile, then your lists.
2. **Main panel:** the current view.
3. **Right rail (context):** today's quests, this month's budget snapshot, and a live mini view of the town. Clicking the town opens Town.

**Quick-add (Ctrl+Space, available everywhere):** one input that understands both tasks and expenses.
- `essay due fri 5pm #uni` creates a task in the Uni list, due Friday at 17:00.
- `12.50 lunch food` logs an RM 12.50 expense, described as "lunch", in the Food category.
- `gym every mon wed fri` creates a recurring habit.
- A preview chip shows how it was understood before you press Enter. Tab cycles through other interpretations.

## 3. Features

### 3.1 To-do

- **Lists:** user-created, each with a name, icon, colour and **stat** (one of the six, or "None", which still earns character XP).
  - Default lists on first run: Uni (Intelligence), Fitness (Strength), Work (Discipline), Personal (Discipline), Creative (Creativity), Social (Charisma).
- **Task fields:**
  - Title and notes.
  - Due date and optional time, with an optional reminder (Windows toast notification).
  - **Size**, which sets the XP: Quick 10 / Normal 20 / Big 40.
  - Stat override.
  - Recurrence rule.
  - "In My Day" flag.
- **My Day:** a daily focus list. It's empty each morning, and a "Suggestions" drawer offers tasks that are due today, overdue, or Big tasks with no due date. Any task can be added from anywhere.
- **Recurring tasks:** daily, weekdays, weekly on chosen days, every N days, or monthly on a given day. Completing one creates the next instance.
- **Habits** are a recurring task with a **streak**.
  - The streak counts consecutive scheduled occurrences completed on their day.
  - Missing one resets the streak to 0. That is the only consequence.
- **Done:** a completed task animates out, with a particle burst and an XP float. A "Completed" section lets you undo, which reverses the XP exactly.

### 3.2 Budget

- **Categories:** name, icon, colour and **monthly limit (RM)**.
  - Defaults: Food 600, Transport 200, Shopping 300, Bills 400, Fun 200, Other 150. All editable.
- **Expense:** amount, category, note and date (defaults to now). Logged via quick-add or a form.
- **Month view:**
  - Total spent against the total budget.
  - Per-category progress bars. Each is neutral below 80%, amber from 80% to 100%, and red over 100%.
- **Savings goals:** name, target, optional deadline and an icon.
  - Shown as a jar that fills with animated coins.
  - "Add to goal" logs a deposit.
- **Charts:**
  - A donut of spend by category this month.
  - A line of cumulative daily spend against the budget pace line.
  - A 6-month bar history.
  - Savings goal progress.

### 3.3 Character & stats

- **Six stats**, each with its own XP and level:

  | Stat | Fed by | Title noun |
  |---|---|---|
  | Intelligence | Study and learning lists | Scholar |
  | Strength | Workouts and fitness lists | Warrior |
  | Wealth | Money (see §4.2) | Merchant |
  | Discipline | Chores, work, errands and habits from lists marked Discipline | Monk |
  | Creativity | Hobbies, art, music and side projects | Artisan |
  | Charisma | Social plans, calls and networking | Bard |

- **Character level** comes from **lifetime XP gained from actions**: tasks, habits, quests, achievements, savings deposits and bookkeeping. It never goes down.
- **Title** = rank (from character level) + noun (from your highest stat). For example "Adept Scholar".
  - Ranks: Novice (Lv 1–4), Apprentice (5–9), Journeyman (10–19), Adept (20–34), Master (35–49), Grandmaster (50+).
  - Achievements unlock extra special titles you can choose to wear.
- **Profile view:**
  - A **hexagon radar** of the six stat levels, morphing smoothly when values change.
  - Each stat's level and progress, with a 30-day sparkline.
  - Lifetime stats, achievements and the title picker.

### 3.4 Quests

- **Daily:** 3 quests, rolled at local midnight, picked from a template pool weighted toward lists you actually use. Examples:
  - "Complete 2 Intelligence tasks"
  - "Clear My Day"
  - "Log your spending today" (at least 1 expense logged today)
  - "Keep a habit streak alive"
  - "Finish a Big task before noon"
- **Weekly:** 2 quests, rolled Monday 00:00. Examples:
  - "Work out 3 times"
  - "Stay under budget in every category this week (so far)"
  - "Add RM 50 to savings"
- **Rewards:** dailies give 30 XP + 15 coins. Weeklies give 120 XP + 60 coins. Quest XP is general character XP; it doesn't go to any stat.
- **Reroll:** 1 free reroll per day.

### 3.5 Achievements

About 40 at launch, in tiers (bronze, silver, gold). Each gives coins and some unlock a title or an accent colour. Examples:
- First Steps: first task.
- Centurion: 100 tasks.
- Bookworm: Intelligence 10.
- Iron Will: 30-day habit streak.
- Penny Pincher: a month under budget in every category.
- Nest Egg: first savings goal completed.
- Architect: 10 buildings placed.
- Night Owl: a task completed after midnight.
- Renaissance: every stat at level 5 or higher.

### 3.6 Town

- A **floating island** in the approved art style, built from the Blender asset kit (§6).
- **Shop:**
  - Buildings, nature and decorations, priced in coins.
  - Some are gated by **character level**, others by a **stat level**, which ties the town to who you're becoming.
  - Examples: Library (Intelligence 5), Training Yard (Strength 5), Market Stall (Wealth 5), Shrine (Discipline 5), Artist's Studio (Creativity 5), Tavern (Charisma 5), Observatory (Intelligence 15), Bank (Wealth 15).
- **Placing:**
  - Drag from the shop onto a grid of 0.5-unit cells. A footprint ghost shows green or red.
  - R rotates. Click to place.
  - Buildings pop in with a squash-and-stretch bounce and a puff of dust.
  - A placed item can be moved, rotated or put back into storage. Storing refunds nothing but keeps the item.
- **Expansion:** the island starts small, at radius 3. Expansions bought with coins (radius 4, then 4.6, then a second islet joined by a bridge) unlock as levels rise.
- **Life:**
  - The windmill turns, smoke drifts, the water ripples, and little lanterns sway.
  - The time of day follows the real clock: dawn, golden hour, dusk, and night with lit windows.
  - Optional ambient sound.
- **Camera:** orbit and zoom within limits. Double-click a building to focus on it.
- **No penalties:** the town never decays.

### 3.7 Accent colours (unlockable theme)

- The UI starts **monochrome**: greys and white.
- Game-meaning colours are always present:
  - XP and coins: gold.
  - Done: green.
  - Over budget: red.
  - Each stat has its own hue, used only in stat chips and the radar.
- Accents are unlocked by level or achievement:
  - Mint (Lv 3), Violet (Lv 6), Coral (Lv 10), Sky (Lv 15), Gold (Lv 20), Rose (achievement), Aurora gradient (Lv 35).
- An accent tints: the focus rings, the selected nav item, the progress ring, buttons and the particle colours.

### 3.8 Juice & feel

- **Motion:**
  - Spring physics on every state change (stiffness and damping tuned per element). Nothing pops without easing.
  - Task completion: the check morphs to a circle, the card collapses, 8–14 shape particles (circles, triangles, squares and rings in stat colours) burst out, and an XP float flies to the sidebar XP bar. The bar ticks up with a counter roll.
- **Level up:** a full-window overlay.
  - A hexagon assembles from shards, the level number flips, and the new unlocks list in.
  - It's skippable with any key. A stat level up is a smaller toast with that stat's colour.
- **Sound:** synthesized with WebAudio, so no audio files are needed.
  - Soft clicks, a pitch-rising chime for streaks, a coin tink and a level-up arpeggio.
  - Master volume and mute are in settings.
- **Reduced motion** setting: swaps particle and spring effects for fades.

## 4. Game rules (exact numbers)

### 4.1 XP from tasks & habits

- **Base XP by size:** Quick 10, Normal 20, Big 40.
- **On-time bonus:** +25% if the task had a due date and was completed by it.
- **Habit streak multiplier:** ×(1 + 0.1 × min(streak, 10)), so ×2 at a streak of 10 or more.
- **Where the XP goes:** to the task's stat. If the stat is "None", it goes to character XP only.
- **Coins:** floor(XP / 2).

### 4.2 Wealth ("every ringgit counts")

- Every expense **subtracts** Wealth XP, at 1 XP per RM 1, rounded to the nearest whole XP.
- **Daily allowance drip:**
  - At local midnight, or on the next app open to catch up on missed days, each day adds Wealth XP equal to (total monthly budget ÷ days in month), at 1 XP per RM.
  - Net effect: you gain Wealth when you spend less than your budget and lose it when you overspend. Every ringgit visibly moves the number.
- **Savings deposits:** +2 XP per RM 1. Deposits also give coins of floor(RM / 2).
- **Limits on Wealth XP:**
  - It can't drop below 0.
  - The Wealth *level* can go down.
  - Spending and the allowance drip only ever move the Wealth stat. They never count toward character level.
  - Savings deposits do count toward character level, because they're an action you took.
- **Bookkeeping reward:** logging an expense on the day it happened gives +2 *character* XP (not Wealth), which rewards the habit of logging.

### 4.3 Level curves

- **Stat level s** requires a cumulative stat XP of 25·s·(s−1).
  - Level 2 needs 50, level 5 needs 500, level 10 needs 2,250, level 20 needs 9,500.
- **Character level L** requires a lifetime XP of 50·L·(L−1).
  - Level 2 needs 100, level 5 needs 1,000, level 10 needs 4,500, level 20 needs 19,000, level 50 needs 122,500.
- **Expected pace:** about 100–200 XP a day gives level 10 in roughly 1 month and level 20 in roughly 4 months, with a long tail after that.

### 4.4 Undo & integrity

- Every XP and coin change is written to an append-only **ledger**: id, time, source, stat, amount and reference.
- Undoing a task, deleting an expense or editing an amount adds compensating ledger entries.
- Stats, levels and coins are always derived from the ledger, so the numbers can't drift.

## 5. Architecture

- **Stack:**
  - Electron (main + preload + renderer).
  - Vite, React 18 and TypeScript.
  - Zustand for state, Framer Motion for UI springs.
  - three.js with `postprocessing` and `n8ao` for the town.
  - Vitest for unit tests and Playwright for UI checks.
- **The renderer runs in a plain browser too.** A storage adapter swaps Electron IPC for an in-memory or localStorage backend, which allows automated UI testing without Electron.

**Module layout:**

```
src/
  core/            pure TypeScript, no React or DOM, fully unit-tested
    types.ts       Task, List, Expense, Category, Goal, LedgerEntry, Quest, Achievement, TownItem…
    ledger.ts      append and derive: stat XP, levels, coins, lifetime XP
    rules.ts       XP formulas, Wealth rules, level curves (all numbers from §4)
    recurrence.ts  next-occurrence calculation, streak evaluation
    parser.ts      quick-add natural-language parser
    quests.ts      quest templates, rolling, progress evaluation
    achievements.ts
    budget.ts      month aggregation, category status, allowance drip
    clock.ts       injectable clock for midnight jobs and tests
  store/           Zustand store; actions call core and persist
  persistence/     adapter interface + electron-ipc and browser implementations
  ui/              React views, components, motion primitives, sound engine
  town/            three.js scene, asset loader, toon materials, placement, day/night
electron/
  main.ts          window, IPC file storage, notification scheduler, tray
  preload.ts       typed, narrow contextBridge API
assets/
  blender/         build_assets.py (the asset kit source) → public/models/*.glb + kit.json
```

**Data and persistence:**
- One JSON document per profile, stored in `%APPDATA%/Lantern/data.json`.
- Writes are atomic (write to a temp file, then rename) and debounced by 500 ms.
- Rolling daily backups keep 14 copies.
- A schema `version` field, with migrations, protects existing data when the app updates.
- Export and import are a single `.lantern.json` file.

**Reminders:**
- The main process keeps a timer per upcoming reminder and shows a native Windows toast. Clicking it opens the task.
- Missed reminders (app closed) are shown once on the next launch.
- The app can minimise to the tray so reminders keep firing.

**Midnight jobs:** a midnight roll-over runs on a timer and also catches up on launch. It:
1. Applies the allowance drip.
2. Evaluates habit streaks.
3. Rolls quests.
4. Clears My Day, while keeping its suggestions.

**Packaging:**
- electron-builder targets an NSIS installer (`Lantern-Setup.exe`), with a portable `.exe` as a fallback.
- The app is unsigned, so Windows SmartScreen shows "More info → Run anyway" the first time.

## 6. Art & asset pipeline

- **Source of truth:** `assets/blender/build_assets.py`. It builds every model procedurally in Blender (bpy) to the approved standard:
  - Chunky proportions, bevelled edges, layered construction details and deliberate asymmetry.
  - A small hand-made wobble on parts and the shared cozy palette.
  - Output is GLB plus `kit.json` (palette and animation anchors).
- **Look:** a 4-band toon ramp, warm hemisphere and sun lights with soft shadows, N8AO ambient occlusion, bloom on emissive surfaces, a subtle vignette and SMAA.
  - No tone-mapping pass, because it shifted the greys toward navy in testing.
- **Asset list for v1:** about 40 models.
  - Housing: 3 cottages, the bakery, the windmill, the lighthouse and the well.
  - Stat buildings: library, training yard, market stall, shrine, artist's studio, tavern, observatory and bank.
  - Nature: 4 tree types, pine, bush, flowers, rocks, grass tufts and mushrooms.
  - Decoration: lantern post, fence, bench, barrels and crates, signpost, flower arch, pond and bridge.
  - Terrain: island tiers and expansions.
- **Animated parts** are exported as separate meshes with anchors: windmill sails, smoke puffs, water and lantern glow.
- **Performance:** under 6k triangles per building and under 150k for a full late-game town. 60 fps on integrated graphics. The town view pauses rendering when hidden, and the mini view renders at a low frame rate.

## 7. Error handling

- **Corrupted data file:** on parse failure, the app loads the newest valid backup automatically and shows a banner offering to view or export the broken file. It never overwrites without a backup.
- **IPC or storage write failure:** a retry with backoff, then a persistent "Not saved" indicator. Nothing is lost while the app stays open.
- **Quick-add ambiguity:** the parser always returns candidates. A wrong guess costs at most one Tab or edit, and nothing is created without the preview.
- **Clock changes and timezone shifts:** midnight jobs are idempotent, keyed by local date, so nothing applies twice.
- **WebGL unavailable:** the town falls back to a static pre-rendered image with a notice. The rest of the app is unaffected.

## 8. Testing

- **Core (Vitest, test-driven):**
  - Every rule in §4 with exact numbers.
  - Ledger derivation and undo symmetry.
  - Recurrence (including month ends and DST-free local dates).
  - Streak evaluation.
  - Parser cases (at least 40 phrasings).
  - Quest rolling and progress, and achievement triggers.
  - Allowance drip catch-up.
  - Schema migration.
- **UI (Playwright, against the browser build):**
  - Golden flows: add task → complete → XP and level; log expense → Wealth drop; deposit → Wealth gain; buy and place a building.
  - Screenshots of every view at 1600×1000, reviewed by eye.
- **Visual check of assets:** turntable renders of every model before it ships.
- **Packaging check:** build the NSIS installer and verify the bundle structure and that the app starts.

## 9. Out of scope for v1

Sync across devices, a mobile app, income tracking, recurring bills, subtasks, boss battles, multiple currencies, multiplayer or social features, and AI features.

## 10. Build phases (for the implementation plan)

1. **Foundation:** the core rules engine, ledger, persistence and the Electron shell, with tests.
2. **To-do:** lists, My Day, recurring tasks, habits, reminders and quick-add.
3. **Budget:** categories, expenses, savings goals, charts and the Wealth rules.
4. **Character:** stats, levels, titles, the profile radar, the level-up overlay, juice and sound.
5. **Quests & achievements.**
6. **Town:** the full asset kit, scene, shop, placement, expansions and day/night.
7. **Polish & package:** accent unlocks, settings, onboarding, the installer, and a full visual QA pass.
