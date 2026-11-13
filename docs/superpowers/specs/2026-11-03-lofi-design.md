# Undr Ctrl (formerly Lofi): design spec

*A personal, gamified to-do and budget app for Windows. Real-life progress levels you up like an RPG character, inside a calm, minimal 2D interface.*

Date: 2026-11-03 · Owner: Chloe · Status: **approved for build** (rev 6: name, student defaults, focus timer, own-music player, startup behaviour, first run)

---

## 1. Intent

**Who:** one person (Chloe), on one Windows PC, for daily use.

**Why:** ordinary to-do and budget apps don't make you *want* to come back. Lofi turns real-life progress (studying, working out, saving money) into visible character growth, wrapped in an interface calm enough to live in all day.

**Success looks like:**
- Opening it every day is a habit.
- Logging a task or expense takes under 3 seconds.
- Stats feel like an honest mirror of real life.
- Milestones feel genuinely rewarding.
- It feels like a polished, zen app (Microsoft To Do × Discord × Not Boring), not a utility.

### What Chloe decided (source of truth)

| Topic | Decision |
|---|---|
| Name | **Undr Ctrl** (renamed from Lofi). App icon: a black sword on white, cut from Chloe's reference image. |
| Platform | Windows desktop app (.exe). Starts with Windows into the system tray; closing the window hides it to the tray. |
| Who | Student |
| Data | Stored on this PC only. Export and import for backup. No sync. |
| To-do | My Day + custom lists, due dates & reminders, recurring tasks & habits |
| Money | Beginner-friendly. Tracks money in and money out (RM), with categories, monthly budgets set through a guided setup, savings goals, a live month page and a monthly recap story. **Never looks like a spreadsheet.** |
| Game | RPG levelling only. No HP, no knockout, **no coins**. |
| Stats | Intelligence (studying), Strength (working out), Wealth (saving raises it, every ringgit spent lowers it), Discipline, Creativity, Charisma |
| Task → stat | Each list has a stat. Tasks inherit it and can override it individually. |
| Decay | None. Only streaks reset. |
| RPG layers | Daily & weekly quests, achievements & titles. Unlocks come from levels and achievements. |
| Character visual | A stat radar (hexagon) that morphs as stats change |
| Customisation | Themes, accent colours, fonts, text size, layout & density. Practical options are free from day one; special themes, accents and sound packs are earned. |
| Art | **2D only:** geometric shapes, no illustrations or 3D assets |
| Layout | Two columns, like Microsoft To Do |
| UI look | Minimal and zen. Dark Discord-style greys by default, monochrome accent by default (free accents available; special ones earned). |
| Feel | **Calm by default, big on moments.** Everyday actions get soft springs and subtle sound; celebrations are saved for milestones. |
| Focus | Pomodoro-style focus timer attached to a task; finished sessions give bonus XP |
| Music | No bundled music. A player for **your own audio files**. Music **never plays while the window is minimised or hidden in the tray.** |
| Budget month | Calendar month (1st → end) |
| Wallets | None, kept simple |
| First run | Short welcome, then an empty, clean app |

## 2. Experience overview

**Two-column window:**
1. **Sidebar (left, 272 px):**
   - Character card: a mini stat radar, your name, title, level and XP bar.
   - Navigation: My Day, Planned, Habits, Money, Quests, Profile.
   - Then your lists, each with its stat colour dot and an open-task count.
   - Settings at the bottom.
2. **Main area:** the current view, with generous whitespace and one clear focal point per screen.

**Visual language:**
- **Default theme greys:** background `#1e1f22`, sidebar `#2b2d31`, main `#313338`, cards `#383a40`.
- **Typography:** Inter by default (changeable, §3.6), with a tight heading scale (28 / 15 / 13 / 11).
- **Colour discipline:** colour appears only where it means something. Each stat has a hue; gold means XP, green means done, red means over budget. Plus your chosen accent.
- **Shapes as a language:**
  - Circles are tasks.
  - Hexagons are character and stats.
  - Rounded squares are money.
  - Diamonds are habits and streaks.
- **Empty states:** slow, ambient shape compositions (a few drifting forms), never clip-art.

**Progress everywhere:** Chloe loves progress bars, so progress visualisation is a core part of the design language. Anything with a goal shows how close you are.

**Where progress appears:**

| Where | Progress shown |
|---|---|
| Sidebar | Character XP bar; a slim "today" bar (tasks done ÷ tasks in My Day) |
| My Day header | A wide day-progress bar that fills segment by segment, one segment per task |
| Each list in the sidebar | A tiny completion ring next to the open-task count |
| Lists | A header bar showing the share of tasks done this week |
| Habits | A weekly bar per habit (for example 3 of 5) plus the streak diamonds |
| Planned | A "this week" bar across all tasks due this week |
| Profile | A bar per stat toward its next level |
| Quests | A bar per quest; daily and weekly overall bars |
| Achievements | Locked badges show a progress arc (for example Centurion 64/100) |
| Money | Hero ring (budget used against month elapsed), category fills, in/out bars, goal fills, a month-elapsed bar |
| Unlocks | "Next unlock" bar in Settings → Appearance (for example "Dusk theme: Lv 9 → 12") |

**Rules:**
- **One shared progress component family** used everywhere: bar, segmented bar, ring and liquid fill. Same thickness, radius and motion, so the app feels like one system.
- **Fills animate with a spring** when they change, never jumping. A bar that reaches 100% plays a soft shimmer sweep, and in the moment tier a brief glow.
- **Segmented bars** for countable things (tasks, habit days, quests). **Smooth bars** for continuous things (XP, money).
- **Overflow:** bars past 100% (an over-budget category) show the extra as a darker striped tail, never a broken layout.
- **Colour:** each bar uses the colour of what it measures: the stat's hue, the category's colour, or the accent for general progress.
- **Numbers:** every bar can show its numbers on hover; key bars always show them.

**Quick-add (Ctrl+Space, available everywhere):** one input that understands both tasks and expenses.
- `essay due fri 5pm #uni` creates a task in the Uni list, due Friday at 17:00.
- `12.50 lunch food` logs an RM 12.50 expense, described as "lunch", in the Food category. `+500 salary` logs income.
- `gym every mon wed fri` creates a recurring habit.
- A preview chip shows how it was understood before you press Enter. Tab cycles through other interpretations.

## 3. Features

### 3.1 To-do

- **Lists:** user-created, each with a name, icon (from a small geometric icon set), colour and **stat** (one of the six, or "None", which still earns character XP).
  - Default lists on first run (student): Uni (Intelligence), Assignments (Intelligence), Fitness (Strength), Personal (Discipline), Creative (Creativity), Social (Charisma).
- **Task fields:**
  - Title and notes.
  - Due date and optional time, with an optional reminder (Windows toast notification).
  - **Size**, which sets the XP: Quick 10 / Normal 20 / Big 40.
  - Stat override.
  - Recurrence rule.
  - "In My Day" flag.
- **My Day:** a daily focus list.
  - **Habits scheduled for today appear at the top automatically**, as a habits strip of diamonds you tick off.
  - Below them, tasks you pick. This part is empty each morning, and a "Suggestions" drawer offers tasks that are due today, overdue, or Big tasks with no due date.
- **Planned:** every task with a due date, grouped into Overdue, Today, Tomorrow, This week and Later.
- **Recurring tasks:** daily, weekdays, weekly on chosen days, every N days, or monthly on a given day. Completing one creates the next instance.
- **Habits** are a recurring task with a **streak**, shown as a row of diamonds for the last 14 occurrences.
  - Missing one resets the streak to 0. That is the only consequence.
- **Task detail:** a slide-in panel from the right, like Microsoft To Do.
- **Done:** completed tasks move to a collapsible "Completed" section. Undo reverses the XP exactly.

### 3.2 Money (budget tracker)

**Design principles:**
- **Built for a beginner.**
  - Plain words: "Money in", "Money out", "Left to spend". No accounting jargon.
  - **One big number at a time.**
  - **No tables, grids or spreadsheet rows anywhere.** Money is shown as shapes, bars, bubbles and cards with generous spacing.
- **Colour has meaning:** green-ish for money in, the category's colour for money out, and amber or red only as a gentle warning.
- **Encouraging, not judgmental.** Warnings are framed as a plan, for example "RM 12 a day keeps Food on track", never as scolding.

**Guided setup:** runs once, about a minute, and can be redone from Settings.
1. **Money in:** "How much comes in each month?"
   - Add one or more sources, each with an icon and an expected monthly amount: Allowance, PTPTN/Scholarship, Part-time, Other (student defaults).
   - "It changes every month" is allowed; in that case enter a typical amount.
2. **Categories:** a loose cloud of friendly category bubbles (shape icon + name). Tap to select and long-press to rename. Suggested picks:
   - Food, Transport, Shopping, Bills, Fun, Health, Books & Uni, Gifts, Subscriptions, Other.
   - You can add your own with an icon, colour and emoji.
3. **Split:** the app suggests a starting split from the 50/30/20 idea, explained in one sentence: needs, wants, savings.
   - It's shown as **one horizontal stacked bar** of your monthly income with draggable handles, plus per-category sliders below.
   - The savings slice becomes your monthly **savings target**.
   - A friendly checker shows "RM 140 not assigned yet" or "RM 60 over your income", with a one-tap "fix it" that scales everything to fit.
4. **First goal (optional):** "Saving for something?" Name it, set a target and an optional date. The app works out the monthly amount needed.

**Logging (two steps):**
- A large **+** button sits on the Money page, and **Ctrl+E** works anywhere. It opens a sheet:
  - A toggle at the top between **Out** (default) and **In**.
  - **Step 1:** tap a big category bubble (or an income source when **In** is selected). Your most-used categories come first.
  - **Step 2:** type the amount on a large on-screen number pad. Keyboard digits work too.
  - Optional extras: a note, a date chip (defaults to today, with a quick pick for yesterday) and a "repeat monthly" toggle.
  - Enter or the check button saves it. The entry lands in the timeline with a soft drop animation.
- **Quick-add text still works** for speed: `12.50 lunch food` logs an expense, and `+500 salary` logs income.
- **Editing:** click any entry to edit or delete it.
- **Monthly repeats:** repeating entries are added on their day each month with a quiet "added automatically" note.

**Money page (the live month):** a single scrolling page with month arrows at the top to step back through past months.
1. **Hero card:** **Left to spend this month**, shown as one large number.
   - A ring around it shows how much of the month's spending budget is used, against how much of the month has passed.
   - Underneath, in small text: "**RM 21 a day** is safe to spend for the rest of the month."
2. **In & Out:** two horizontal bars on the same scale. **Money in** (actual so far, with the expected amount ghosted) and **Money out**. The difference reads as "You've kept RM 320 so far".
3. **Categories:** bubble cards in a flowing wrap layout, not a grid of cells.
   - Each card shows the icon, name, "RM 412 of 600" and a fill that rises inside the bubble shape.
   - The fill is calm grey/colour below 80%, amber from 80% to 100%, and soft red when over.
   - Clicking a card opens that category's entries and a short tip.
4. **Where it went:** a flow picture.
   - Money in streams on the left split into category streams on the right, with whatever is left over flowing into "Kept".
   - Built with soft curved bands (a simplified Sankey diagram). Hovering a band shows its amount.
5. **Activity:** a timeline grouped by day ("Today", "Yesterday", "Mon 2 Nov").
   - Each entry is a soft card with the category shape and colour, the note, and the amount.
   - Income shows a "+" with a green tint. Each day shows its total.
6. **Savings goals:**
   - Rounded squares filling with gently moving liquid.
   - "RM 1,200 of 4,000 · RM 400 a month gets you there by March".
   - "Add to goal" moves money in.

**Gentle nudges:** at most one at a time, shown as a dismissible card at the top of the Money page.
- **A category passes 80%:** "Food is at 82% with 10 days left. About RM 11 a day keeps it on track."
- **Payday logged:** "Nice, RM 1,500 in. Want to put RM 300 toward *New laptop*?" Clicking the button makes the deposit.
- **No entries for 3 days:** "Haven't logged spending since Friday. Anything to add?"

**Monthly recap story:** appears on the 1st of each month, and every recap stays available from the month arrows. It's a short set of swipeable full-screen cards: arrow keys, click or scroll. Each card has one idea, a big number and a geometric shape animation.
1. "October: RM 1,850 came in."
2. "RM 1,430 went out." A donut assembles from the category slices.
3. "You kept RM 420." This is compared with last month: "RM 90 more than September".
4. "Your top three": the categories that grew the most or shrank the most against last month.
5. "Budgets": how many categories stayed within budget, each shown as a bubble that pops green or amber.
6. "Goals": progress on each savings goal.
7. "Next month": a one-tap "Keep the same budget" or "Adjust" (which reopens the split step), plus the Wealth XP change for the month.

**Charts:** custom SVG, minimal, with no gridlines or axes clutter.
- The flow picture.
- A month donut.
- A 6-month in-versus-out bar pair.
- A cumulative spending line against the budget pace line, shown on a category's detail page.

### 3.2b Focus timer

- **Starting a session:** every task has a ▶ **Focus** button, also on the detail panel and as `F` on a selected task.
- **Sessions:** a Pomodoro-style focus session. Defaults are 25 minutes focus and 5 minutes break; you can set focus to 15, 25, 45, 50 or a custom length.
- **Focus view:** a calm full-main-area view.
  - A large ring drains smoothly as time passes, with the task name underneath.
  - Pause and stop controls, plus "+5 min".
  - A segmented progress bar of the sessions done today on this task.
- **Mini timer:** when you navigate away mid-session, a small timer appears in the sidebar under the character card. Its ring keeps draining.
- **Rewards:**
  - A completed focus session gives **+10 XP** to the task's stat. Each additional session on the same task the same day gives +5, capped at 4 sessions per task per day.
  - An abandoned session (stopped before 80%) gives nothing and has no penalty.
- **End-of-session:** a soft chime and a Windows toast if the window isn't focused. Optionally starts the break automatically.
- **Profile:** shows "Focus minutes this week" as a bar.
- **Quests:** a template "Focus for 50 minutes today" joins the quest pool.

### 3.2c Music (your own tracks)

- **No bundled music or ambient sounds.** Lofi plays only audio you add yourself.
- **Adding music:** Settings → Music → **Add tracks**, or drag files onto the app. Supported formats: mp3, m4a/aac, ogg, opus, wav and flac.
  - Files are **copied** into `%APPDATA%/Undr Ctrl/music/`, so they keep working even if the originals move. A "link instead of copy" option is available for large libraries.
  - Title and artist are read from the file's tags, falling back to the file name. Cover art is shown if embedded; otherwise a generated geometric cover.
- **Playlists:** a default "All tracks" plus user playlists, with reorder by drag, shuffle, repeat (off, all, one) and volume.
- **Mini player:** pinned at the bottom of the sidebar.
  - Track title, play/pause and next.
  - A thin **progress bar** you can scrub.
  - It expands into a small panel with the queue.
- **Focus link (optional setting):** music starts automatically when a focus session starts and pauses on breaks.
- **Hard rule: music never plays while the window is minimised or hidden in the tray.**
  - Minimising, closing to tray or hiding pauses playback immediately, and focus sessions keep their state.
  - Restoring the window resumes only if it was playing before (setting "Resume when I come back", on by default).
  - Starting with Windows never auto-plays.
  - Media keys work only while the window is visible.

### 3.2d Windows behaviour

- **Start with Windows:** on by default, toggled in Settings → General. Lofi launches **hidden to the tray** at login.
- **Closing the window** hides it to the tray (with a one-time tooltip explaining this). Quitting is done from the tray menu: Open, Quick add, Quit.
- **Reminders and focus-session toasts** keep working from the tray.
- **Keyboard:** Ctrl+Space opens quick-add (inside the app), and Ctrl+E opens the logging sheet.

### 3.2e First run

1. **Welcome:** "Hi, what should we call you?" A name field, with an ambient shape composition behind it.
2. **How Lofi works:** 3 swipeable cards.
   - Tasks feed your stats.
   - Money moves Wealth.
   - Level up to unlock themes and more.
3. **Money setup** (§3.2). It can be skipped with "Set up later".
4. **Done:** the app lands on an empty My Day with a gentle hint toward quick-add. Default lists and categories exist, but there are no sample tasks or entries.

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
- **Start page:** My Day (default), Planned, any list, Money or Profile.
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

- Income never changes Wealth by itself, so a bigger salary isn't "levelling". What you do with money is what counts.
- Every expense **subtracts** Wealth XP, at 1 XP per RM 1.
- **Daily allowance drip:** each local day adds Wealth XP equal to (total monthly budget ÷ days in month).
  - It's applied at midnight, or caught up on the next app open.
  - Net effect: you gain Wealth when you spend less than your budget and lose it when you overspend.
- **Savings deposits:** +2 Wealth XP per RM 1. Deposits also count toward character lifetime XP.
- **Limits:**
  - Wealth XP can't drop below 0. The Wealth *level* can go down.
  - Spending and the drip never touch character level.
- **Bookkeeping reward:** logging an expense or income entry on the day it happened gives +2 character XP.
- **Recap reward:** finishing the monthly recap gives +25 character XP.

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
    types.ts       Task, List, Entry (in/out), IncomeSource, Category, Goal, LedgerEntry, Quest, Achievement…
    ledger.ts      append and derive: stat XP, levels, lifetime XP
    rules.ts       XP formulas, Wealth rules, level curves (all numbers from §4)
    recurrence.ts  next-occurrence calculation, streak evaluation
    parser.ts      quick-add natural-language parser
    quests.ts      quest templates, rolling, progress evaluation
    achievements.ts
    unlocks.ts     earned themes, accents, sound packs, titles by level/achievement
    appearance.ts  settings schema, defaults, token sets per theme, validation
    budget.ts      month aggregation, in/out totals, safe-to-spend, category status, split suggestion, nudges, recap data, allowance drip
    focus.ts       focus session state machine, rewards and caps
    clock.ts       injectable clock for midnight jobs and tests
  store/           Zustand store; actions call core, emit "moments", persist
  persistence/     adapter interface + electron-ipc and localStorage implementations
  ui/
    shell/         two-column layout, sidebar, quick-add, detail panel
    theme/         design tokens, theme provider, font loading (bundled woff2)
    views/         MyDay, Planned, List, Habits, Money (+ setup, logging sheet, recap), Quests, Profile, Settings
    shapes/        radar, progress family (bar, segmented, ring, liquid), diamond streak, icon set
    motion/        spring presets, moment overlays, particle canvas
    sound/         WebAudio synth and packs
    music/         audio-element player, playlists, mini player, visibility pause rule
electron/
  main.ts          window, IPC file storage, music import (copy + tag read), notification scheduler, tray, login item, minimise/hide → pause-music signal
  preload.ts       typed, narrow contextBridge API
```

**Moments bus:**
- The store emits typed events: `taskCompleted`, `statLevelUp`, `levelUp`, `questCompleted`, `achievementUnlocked` and `streakMilestone`.
- The motion layer queues them, so several moments at once play in sequence instead of on top of each other.

**Data and persistence:**
- One JSON document, stored in `%APPDATA%/Undr Ctrl/data.json`.
- Writes are atomic (write to a temp file, then rename) and debounced by 500 ms.
- Rolling daily backups keep 14 copies.
- A schema `version` field, with migrations, protects existing data when the app updates.
- Export and import are a single `.undrctrl.json` file.

**Reminders:**
- The main process keeps a timer per upcoming reminder and shows a native Windows toast. Clicking it focuses the task.
- Missed reminders are shown once on the next launch.
- Lofi lives in the tray (§3.2d), so reminders keep firing.

**Midnight jobs:** an idempotent roll-over, keyed by local date. It runs on a timer and also catches up on launch, and it:
1. Applies the allowance drip.
2. Evaluates habit streaks.
3. Rolls quests.
4. Resets My Day.

**Packaging:**
- electron-builder targets an NSIS installer (`Undr-Ctrl-Setup.exe`), with a portable `.exe` as a fallback.
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
  - Golden flows:
    - Add task → complete → XP and level up.
    - Guided money setup → log out/in → hero and bars update.
    - Log expense → Wealth drop.
    - Deposit → Wealth gain.
    - Recap story.
    - Quest completion.
    - Focus session → XP.
    - Music pauses on minimise/hide and resumes on restore.
  - Screenshots of every view and every moment overlay at 1600×1000, reviewed by eye.
- **Packaging:** build the NSIS installer and verify it.

## 8. Out of scope for v1

The 3D town and any illustrated assets, coins and shops, sync, a mobile app, bank or e-wallet import, subtasks, multiple currencies, and social or AI features.

## 9. Build phases (for the implementation plan)

1. **Foundation:** the core rules engine, ledger, persistence and the Electron shell, with tests.
2. **Shell & to-do:** the two-column layout, lists, My Day (including the habits strip), Planned, task detail, recurring tasks, habits, reminders, quick-add, the focus timer and first run.
3. **Money:** guided setup, logging sheet, money in and out, categories, the live month page, flow picture, nudges, savings goals, the monthly recap story and the Wealth rules.
4. **Character:** stats, the radar, levels, titles, Profile and the everyday motion tier.
5. **Quests, achievements & unlocks,** plus the moment tier (overlays, particles, sound).
6. **Music, customisation & polish:** the music player, tray and startup behaviour, the Appearance settings with live preview (themes, accents, fonts, size, density, sidebar), onboarding, reduced motion, the installer and a full visual QA pass.

## Update — no regular income, Funko side business, rounded icon (2026-11-03)

**Track first, budget later.** Setup no longer needs income. On the income step, "Skip, my income isn't regular" is always available; with no income the budget step offers *Track first* (recommended) or *Set my own limits*. In tracking mode the Money hero shows what was spent this month and a "Days tracked" bar out of 14. After 14 days it suggests category limits from real spending (last ≤90 days, scaled to 30.4 days, rounded up to RM 10), with "Use this budget" or "Set my own". With no budget: spending does not lower Wealth, categories never show "over", and the in/out line is neutral rather than red. Money from parents is the "Parents / family" income source.

**Business tab (item by item).** Money has Personal | Business tabs. Bought adds N pieces to stock with cost and an optional asking price. Sold records the price, fees and date for one piece, with a live profit preview. Other cost is for packaging, shipping supplies and similar. The tab shows profit this month (sales vs. item cost + fees + other costs), stock on hand (cost, asking, oldest piece, sell-through bar), profit over the last 6 months, stock cards grouped by name and cost with search, sold this month, and other costs. Business profit raises Wealth (RM 1 profit = +1), a loss lowers it, and other costs lower it. Business profit counts in "You kept" and on the recap. Achievements: First sale (bronze) and The Hustler (gold, RM 1,000 profit, title).

**Icon.** The sword icon now has slightly rounded corners (radius 18%, transparent outside).

## Rev 8 — Refinement round (2026-11-03, approved and built)

Priorities: **Funko business** and **To-do / My Day** first. Goals: faster, more delight, better insights.

### Wealth follows cash for Funkos (changed by Chloe)
This replaces the earlier "a sale adds its profit" rule.
- **Buying a piece** lowers Wealth by its cost, at 1 XP per RM 1. This applies to stock and to the collection.
- **Money received** raises Wealth: sale price minus fees, a deposit when it's taken, and a kept deposit.
- **Refunds and other costs** lower it.
- **Over a piece's life**, Wealth moves by exactly its profit. Profit is still computed per piece (price − cost − fees), whichever way the piece came.
- **Migration:** older data gets cost entries for past purchases and revenue in place of profit. Bookkeeping XP is kept.
- **Exact undo:** an undone entry and its compensation are both ignored when computing progress. Deleting a mistaken purchase while Wealth is at 0 can't create Wealth.

### Business
- **Platforms:** every sale has a platform: Carousell, Threads, Facebook Marketplace or WhatsApp (editable list). The Business tab shows sales, profit and count per platform for the month. No buyer names.
- **Reservations (deposit required):**
  - Reserve a piece in stock with a deposit, platform, balance-due date and optional note.
  - A reserved piece shows a "Reserved" tag and drops out of available stock and the Sell list.
  - An optional agreed price prefills the balance.
  - **Balance paid** turns it into a sale: sold price = deposit + balance, and fees are optional. Profit counts only at that point.
  - **Cancel:** the piece returns to stock. Choose "deposit kept" (counts as other income in the business, which raises profit) or "deposit refunded".
  - Deposits held are shown as a liability line ("Deposits held: RM X"), not as profit.
  - **Overdue balance:** the reservation shows an amber "N d overdue" chip, and its Collect balance task shows as late in My Day and Planned.
- **Personal collection:**
  - Pieces you keep, each with what you paid and your own value estimate (editable, with the date it was last updated).
  - Shows total cost, total estimated value and the gain or loss, as a gallery of cards (never a table).
  - Move a piece from stock to the collection and back (moving changes neither profit nor Wealth). A piece can be sold or reserved straight from the collection.
- **Linked tasks (auto):**
  - Reserving creates "Collect balance — <item>", due on the balance date.
  - Selling via a delivery platform creates "Ship <item>", due tomorrow.
  - The tasks sit in an auto-created **Business** list (stat: Wealth). Completing a task doesn't change the sale. Cancelling a reservation removes its open task.

### Tasks
- **Steps inside tasks:**
  - Add, check, reorder and delete steps in the detail panel.
  - A small progress ring on the task row shows steps done out of the total.
  - Each step done gives +2 XP to the task's stat. Undoing a step reverses it.
- **Deadline countdowns:**
  - A task with a due date shows a "days left" chip.
  - Normal and Big tasks also show a thin bar that drains from when the task was created to its due date.
  - **Early nudge:** a Big task due within 5 days, with no steps done and no focus time, gets a card at the top of My Day with "Add steps", "Start now" (a focus session) and "Not today". It is also listed in Suggestions.

### Delight
- **Sale moment scales with profit:**
  - Under RM 10: chime and coin-shape burst.
  - RM 10–49: a bigger burst and "+RM X" floating up.
  - RM 50 or more, or a new monthly profit record: a full overlay moment.
- **Completion combo:**
  - Finishing tasks within 90 s of each other builds a combo (×2, ×3…) with a rising pitch and a combo chip.
  - Bonus XP: +2 per combo step, capped at +10.
- **Streak and milestone moments** at 7, 30 and 100 days (cascade plus overlay at 30 and 100), and for monthly profit records.

### Insights (new Insights page)
- **Where your money goes:**
  - Six-month trend per category as small bars.
  - This month versus your average.
  - Biggest changes.
  - A weekday-versus-weekend spending pattern.
  - Comparisons are paced: this month so far is set against what you usually spend by the same day of the month.
- **Productivity:**
  - Tasks finished versus planned in My Day each day.
  - Best weekday and best time of day.
  - Focus minutes per week.
  - Stat growth over 90 days.

### Backup to Google Drive
- Chloe will install **Google Drive for desktop** and sign in with her Google account. Drive for desktop shows which account is signed in, so she confirms the email there.
- In Settings → Data → *Daily backup to Google Drive*, she **chooses the folder** (for example `G:\My Drive\Undr Ctrl`). Nothing is copied until a folder is chosen and confirmed. Settings shows the full path and the time of the last backup.
- **One file, replaced daily:** `Undr Ctrl backup.json`, written atomically. Drive keeps it as a single file, so old copies don't pile up. The 14 local backups on this PC stay as they are.

## Rev 9: Catalogue-ready and stability (2026-11-04)

- **Catalogue mode:** the Bought window has **Add & next**, and Enter does the same. The piece is saved, the window stays open with the name cleared, and a "N added · last: …" chip keeps count. Choosing a name already used prefills its last cost and asking price. **Done** closes the window.
- **Big inventories:**
  - Search matches every word in any order, ignoring case and "#", across the name and the note.
  - Lists show 48 cards, then "Show more".
  - The pick list shows 40 matches, then "keep typing".
  - Filtering is deferred so typing stays instant. This was tested with 1,500 pieces.
- **Money remembers its tab** (Personal or Business) while the app is open.
- **Plain placeholders everywhere** ("Add a task", "Item name", "Search"), with no example text.
- **Fixed (critical):**
  - Leaving Money after switching tabs left the old page invisible and stuck over the app. Page contents are now isolated from the page transition.
  - A sale could leave an invisible window blocking all clicks. Windows are now keyed, never block clicks while closing, and keep showing the sold piece while they close.
- **Big moments:** the full-screen blur behind them is gone, and they use fewer particles, so they're smoother on Windows.
- **Checks:** `npm run sweep` performs every main action and then visits every page, checking for errors, stuck windows and invisible pages.

## Rev 10: Free pieces (2026-11-04)

- A piece's cost can be **RM 0**, for stock or the collection. The Bought window has a one-tap **Free** button, and typing `0` or "free" also works.
- **Free pieces leave Wealth alone.** When one sells, the whole price minus fees is profit and raises Wealth.
- Free pieces show as **"Free"** instead of "Cost RM 0". A piece's cost can also be edited down to 0.
- Negative costs are still refused. Expenses and sale prices must still be more than RM 0.

## Rev 11: iPhone app and sync (built 2026-11-05)

**Goal:** Undr Ctrl on Chloe's iPhone as a Home Screen web app that shares the same data as the laptop. A sale logged at a meetup shows up on the PC, and the reverse.

### Pieces
- **One codebase, two shells.** The existing React app gains a phone layout at narrow widths. The Electron desktop app stays as it is.
- **Firebase (Spark, free) for sync and sign-in.** Firestore holds the data. Firebase Auth uses **email + password**, which works the same in the desktop app and on the phone (Google's sign-in popup is blocked inside desktop apps like Electron).
- **Hosting:** the phone app is a static site with a web manifest, Apple touch icon (the sword) and a service worker for offline use. It is hosted on **GitHub Pages** from a repo in Chloe's GitHub account, which I can deploy to directly with no secrets handed over. The site's address is added to Firebase Auth's authorised domains.
- **Security:** Firestore rules let only the signed-in owner read or write their data (`users/{uid}/**`). The Firebase web config is not a secret.

### Sync model (offline-first, record by record)
- Data is stored as records under `users/{uid}/{collection}/{id}`. Collections: tasks, lists, money entries, categories, sources, goals, deposits, business items, business expenses, business income, ledger entries, quests and focus log. Settings, appearance and profile are each a single document.
- **Every record carries `updatedAt` and `deleted?`.** Deletes are tombstones so they sync too. The local copy is the working copy; changes queue while offline and are sent when online. Remote changes stream in live and merge record by record.
- **Conflicts:** the newest `updatedAt` wins, per record. Ledger entries are append-only, apart from the `reversed` flag, which once set stays set. Two devices therefore can never double-count XP, Wealth or profit.
- **First sync:**
  - Signing in on the laptop uploads the existing data, nothing lost.
  - Signing in on the phone downloads it.
  - If both already have data, the two copies are merged record by record, never overwritten wholesale.
- The midnight rollover, quest rolls and recurring repeats are idempotent and keyed by date and id, so running them on two devices produces the same records once.
- The local backups and the Google Drive daily backup stay as safety nets.

### Phone layout
- **Bottom tab bar:** My Day · Money (Personal/Business) · **+** · Insights · More (Planned, Habits, Lists, Quests, Profile, Settings).
- **+ opens a quick action sheet:** Sold · Bought · Reserve · Expense · Income · Task. Each is a full-screen sheet with large inputs and a numeric keypad.
- **Cards and lists:** one column, 44 pt minimum touch targets, safe-area insets.
- **Same look and feel:** themes, progress bars and moments, with lighter particle effects.
- **Desktop-only:** the music player, tray, start-with-Windows, the folder picker for Drive backup and Windows notifications. Due-date reminders on the phone come later, through web push.

### Settings → Sync
- Shows sign-in state, the account email, the last sync time, an "Offline: N changes waiting" count and "Sign out".
- Signing out keeps a local copy.

### Testing
- **Unit tests:** merge rules (newest wins, tombstones, ledger append and reversed-OR, idempotent rollover across two devices).
- **Two-device tests:** two simulated devices against the Firebase emulator — offline edits on both, then reconnect and converge.
- **Phone flows:** Playwright at iPhone size (390×844) for the quick actions.
- **Install:** the manifest and service worker are checked to make the site installable.

## Rev 12: Launch polish (built 2026-11-05, version 1.2.0)

**Text entry.** Every text field has an accent-coloured caret. The add-task bar shows a focus ring when you're typing in it, and its + turns.

**Dropdowns.** No native `<select>` is left. Every picker is the app's own menu: a floating menu on the laptop, a bottom sheet on the iPhone. They work with the mouse, the keyboard (arrows, Home/End, type-ahead, Esc) and touch.

**iPhone layout:**
- Habit cards stack: title and chips, then the week bar across the full width.
- In Log money, the categories sit four to a row so the amount and keypad are in view. Sheet footers stay pinned above the home bar.
- Quick add gets a ✓ button. On the phone it hides the keyboard hints and shows the title above its chips.
- Settings tabs scroll sideways and never shift the page. Category and source rows wrap.
- Settings that only mean anything on the laptop are hidden on the web app: Start with Windows, sidebar options, Music, the Google Drive backup and the %APPDATA% note.
- A test checks that no page is wider than the screen.

**Touch:**
- Hover effects apply only on devices that can hover, so taps never leave things stuck in a hover look. A build step handles this.
- No grey tap flash and no double-tap zoom. Buttons give pressed feedback.
- A field you start typing in is scrolled clear of the keyboard.
- The day rolls over the moment you reopen the app.

**Speed:**
- Fonts load Latin only: CSS falls from 54 kB to 11 kB gzipped and assets from 5.4 MB to 2.4 MB.
- Insights, Settings, Profile and Quests load as separate chunks, fetched while the app is idle.
- Page changes no longer wait for the old page to fade out.
- The sound engine starts at idle instead of on the first tap.
- Confetti runs on time instead of frames, so it looks the same at 120 Hz.
- On a phone emulated at 4× CPU slowdown, changing tabs is about 40% faster (average 460 → 275 ms) and the stall when ticking a task fell from 220 ms + 133 ms to about 95 ms.

**Offline worker.** It deletes the previous release's cache. If the network takes more than 2.5 s it opens the cached app, so a weak signal never holds up launch.

**Safety.** `?reset=1` only wipes data in development builds.

## Rev 13: Smoother iPhone (built 2026-11-05, version 1.2.1)

Chloe still felt a delay moving between tabs on the iPhone. The fix is measured with `scripts/perf-tap.cjs`: tap → new screen, emulated iPhone, CPU slowed 4×.

- **Pages stay ready.**
  - Once visited, a page stays alive in the background, hidden and paused (React Suspense "freeze"), so coming back to it is instant.
  - Up to 8 pages are kept; the least recently used is let go.
  - A short while after start-up, Money, Insights and Planned are prepared in the background while the phone is idle.
  - Each page remembers its scroll position.
  - Tapping the tab you're already on scrolls back to the top, as in iOS apps.
- **Personal and Business** on Money are also both kept, and each is rebuilt only when its data changes.
- **Instant tabs.** Bottom-bar tabs switch as soon as your finger touches them, not when it lifts. Pages appear at once with no fade. Buttons that open sheets (+, More) still act on the lift.
- **No background work.**
  - The savings-goal waves and the empty-state shapes animate in CSS instead of JavaScript on every frame. They pause by themselves while hidden.
  - The focus clock only ticks while a session is running.
  - The app shell no longer redraws when a sheet opens.
- **Lighter cards.** Category bubbles, stock and collection cards, and activity rows no longer track their layout. That was costly with a big catalogue.
- **Sync start-up.** Sign-in is email and password only, so the unused Google pop-up helper is no longer loaded (it was also blocked by the CSP).
- **Result.**

  | Measure | Before | After |
  |---|---|---|
  | Average tap → new screen shown | ~120 ms | ~47 ms |
  | Average tap → fully settled | ~200 ms | ~56 ms |
  | Money ↔ Business | ~100 ms | ~50 ms |

## Rev 14: Animations back (built 2026-11-05, version 1.2.2)

Chloe had asked to keep the animations. Rev 13 dropped three of them for speed, and all three are restored:
- **Page change:** the fade with a small rise, 180 ms, is back.
  - It now runs on the GPU (Web Animations) over a page that is already there, so it never delays the tap.
  - Reduced motion gives a short fade instead.
- **More and + sheets:** the spring slide-up is back.
- **Layout animations:** category bubbles, Money activity rows, and stock and collection cards glide to their new places again.

The goal waves and the empty-state shapes kept their motion throughout; only the way they are drawn changed (CSS).

Measured with perf-tap at 4× slowdown, a tap still shows the new page in about 50 ms, against about 120 ms before Rev 13. The page then finishes easing in over 180 ms.

**Rule from now on:** performance work never removes or weakens an animation without asking Chloe first.

## Rev 15: Juice (built 2026-11-05, version 1.3.0)

Chloe asked for more juice: richer animation and feedback on both laptop and iPhone, good enough that people would pay for it, while keeping performance.

**Toolkit (`src/ui/motion/juice.ts`):**
- iPhone haptics, using the native "switch" checkbox trick on iOS 18+ and `navigator.vibrate` on Android.
- Ripple, pop, sparks, fly-to and glow effects.
- Sliding thumbs for segmented controls.
- Everything animates transform and opacity only (Web Animations or CSS), and Reduced motion switches it off.

**Ticking a task:**
1. The tick plays out in place for 420 ms: the check pops with a springy fill, a ring ripples out in the stat colour, sparks burst, the row flashes in its colour, a strike-through draws across the title, and the iPhone gives a success tap.
2. The task is then saved, and "+N XP" flies on an arc into the XP bar (the sidebar on the laptop, the top strip on the phone). The bar lights up with a sweep.
3. With Reduced motion on, the task is saved at once with no effects.

**Swipe to tick (iPhone):** drag a task to the right and a check slides in from the left. You feel a tap when you pass the threshold, and letting go ticks the task. A swipe never opens the task.

**Habits:** the diamond spins half a turn and pops, with ripple and sparks. A 7-day multiple gives a stronger haptic.

**My Day cleared:** the last tick lights up the day bar, throws confetti and plays a chime, and the counter becomes "All done for today" with a spring.

**Pages:**
- On every visit, the header, cards and rows rise in one after another. This is CSS only, so nothing is measured at tap time.
- The laptop sidebar highlight slides between pages.
- The iPhone tab bar has a sliding highlight. It moves by transform only, using tab positions measured once. Icons bounce on selection, the + turns into × while its sheet is open, and every tab tap gives a light haptic.

**Controls:**
- Every segmented control in the app (Personal/Business, Settings tabs, Insights tabs, the size and format pickers) has a highlight that slides, with a little overshoot.
- Every button gives way under your finger and springs back.
- On the laptop, primary buttons get a sheen on hover, buttons lift 1 px, and cards lift.

**Numbers and bars:**
- Rolling numbers write straight to the screen (no React render per frame) and pop when they go up. Rolling numbers were added to: XP today, safe-per-day, You've kept, stock cost/asking/deposits, collection paid/worth, and Insights spent.
- Bars sweep with light when they grow, and newly filled day segments pop.

**Sheets:**
- Log money, the business sheets and More build in one row after another.
- On the number pad, the amount bounces with each key and each key gives a light tap. The chosen category's icon pops.
- Saving throws sparks from the button with a success haptic.

**Toasts:** they spring in with a slight tilt and show a shrinking timer line. Achievements, quests, sales and level-ups each have their own haptic.

**Quick add:** the chips for each part it understands pop in as you type.

**Settings:** a new Haptics on/off switch appears on the iPhone. It is stored per device and not synced.

**Performance:**
- The first version used a shared-layout (`layoutId`) tab highlight. It made framer re-measure every animated element (about 88 ms at 4× slowdown), so it was replaced with a transform-only slide.
- Restoring the page's scroll position now only forces a layout when there is one to restore.
- Measured at 4× CPU slowdown on an emulated iPhone:
  - Tap → new screen: about 60 ms, against 50 ms before Rev 15, while carrying all the added motion.
  - Ticking a task: the worst frame fell from 233 ms to about 133 ms, because the tick's effects now run before the save.
  - The new `scripts/perf-frames.cjs` measures frame times during these animations.

## Rev 16: Business money (TnG) (built 2026-11-05, version 1.4.0)

**Chloe's situation.** Cash comes from her dad's allowance. TnG is effectively the business wallet: customers almost always pay into TnG, and every Funko is bought with TnG. So personal spending paid with TnG is money taken out of the business. She wants to see the numbers; no limits for now.

**The model (`src/core/wallet.ts`, all pure and tested):**
- Every money entry has `wallet: 'cash' | 'tng'`. A missing value means cash, which covers all older entries.
- Personal spending with TnG is an owner's draw. It is not a business cost, so profit is unchanged, and Wealth and XP are unchanged too.
- **Business money** is everything that has gone into or out of TnG, plus an adjustment:
  - In: sales (price − fees), deposits held, and other business income.
  - Out: every piece's cost (free pieces cost 0) and other business costs.
  - Both ways: personal TnG spending (out), money-in received to TnG (in), and moves.
- **Match my TnG:** you type your real TnG balance, and the app stores `adjustSen = balance − flows`. There is no balance until you do this once.
- **Moves** (`business.moves`): put money into TnG (for example a cash top-up), or take money out of TnG. These change business money only.
- **This month** shows: from sales & deposits, pieces & business costs, taken out for you (personal TnG spending + moves out), and put in.

**Where you see it:**
- **Log money:** "Paid with / Received in: Cash | TnG". It remembers the last choice, and for TnG it says "From your business money".
- **Quick add:** "tng", "touch n go", "ewallet" or "cash" sets the wallet, and the parsed chips show it.
- **Business tab:** the Business money card shows the balance (a rolling number), the month's rows, Move money (with recent moves you can delete) and Match my TnG. Before the balance is set, the card offers to set it up.
- **Personal tab, In & out:** a two-colour bar splits spending into Allowance (cash) and Business money (TnG).
- **Activity rows:** TnG entries get a tag.
- **Recap:** "RM X of it came out of your business money (TnG)".

**Sync:** `moves` is a record collection and `bizWallet` is a single setting. The last wallet used is a regular setting, so it syncs.

**Known approximation:** for monthly rows, a sold piece's whole price counts in the month it sold, even if its deposit came in an earlier month. The overall balance is exact.

## Rev 17: Undo, shop insights, laptop updates (built 2026-11-13, version 1.5.0)

**Chloe's choices (from the improvement list):** no bulk asking prices, since she changes prices on the platforms and won't keep them in step. Reminders on the iPhone were dropped ("seems like a hassle"). Photos were built and then dropped at her request ("the search is fine already"). Nothing about photos ships.

**Undo** (`src/store/undo.ts`, `UndoToast`):
- Undoable actions put a 6-second toast at the bottom with an Undo button. Ctrl+Z does the same outside text fields.
- Covered: logging, editing and deleting money; adding a task; ticking and unticking; deleting a task; buying, selling, reserving, balance paid, cancelling a reservation, deleting a piece, unselling, keep/unkeep, business costs and income, and moves.
- `revertTo(before, after)` restores tasks, lists, money, business and focus from just before the action.
- The ledger stays append-only. XP the action added is reversed with a compensation entry, and XP the action had reversed is added back. Quest, achievement, drip and recap XP are never taken back, and achievements, quests and settings are left as they are.
- Only the latest action can be undone.

**Sitting a while** (`staleStock`): pieces in stock for 30 days or more, grouped by name and sorted oldest first. They appear on Business above In stock, with days and a warning chip from 60 days. The card shows 5 rows, with Show all.

**Funko shop insights** (`shopStats`), on a new Insights tab, covering all time:
- Three totals: pieces sold, average days to sell, and average profit per piece.
- The top 5 best sellers (by count) and the 5 most profitable, each with bars.
- A platforms table with sold, profit and average days, and a Fastest chip.
- A summary of the "sitting a while" pieces.

**Laptop auto-update** (`electron/updater.ts`, `electron-updater`):
- Checks GitHub Releases on yiirii/undr-ctrl 15 s after start and then every 4 h.
- Downloads in the background.
- When the download is done, "Update ready · v… · Restart" appears in the sidebar.
- Settings has an Updates row showing the version, its status and Check now.
- If she never presses Restart, the update installs when the app quits.
- Dev runs never update.
- To release: bump the version, then run `./scripts/release.sh`. It builds and uploads `Undr-Ctrl-Setup.exe`, the `.blockmap` and `latest.yml` to release `vX.Y.Z`.
- 1.5.0 has to be installed by hand once; updates are automatic from then on.
- Claude's sessions are not allowed to create GitHub releases (HTTP 403). Chloe chose the GitHub Actions route: `.github/workflows/release.yml` builds on `windows-latest` and publishes with `electron-builder --publish always` whenever a `v*` tag is pushed. `./scripts/release.sh` tags the current version and pushes the tag.

## Rev 18: iPhone top strip and tab highlight (2026-11-13, web 1.5.1)

- **Top strip:** it is now taller, with a gold "Lv N" badge on the left. Next to it, the title is in full white with "into/need XP" beside it, and there is a 6 px XP bar under them. A chevron shows that tapping opens Profile. The strip leaves the iPhone's top safe area clear, with 10 px above and 12 px below. The old sidebar margin had pushed the level chip off-centre; that is fixed.
- **Tab highlight:** it now wraps the whole tab, icon and label. Its size is measured from the tab, at most 84 px wide, and it still moves by transform only.
- Only the phone layout changed, so the laptop app stays at 1.5.0.

## Rev 19: Clear of the iOS 26 top blur (2026-11-13, web 1.5.2)

iOS 26 draws a progressive blur over the top edge of Home Screen web apps, and it reaches about 25–30 pt below the status bar. The level strip sat inside it and looked smudged. A new token `--top-clear` = safe-area-top + 38 px now sets the phone strip's top padding, the top of full-screen sheets and the task detail panel, and the combo chip's position, so no text sits in the blurred band.

## Rev 20: Level moves to the tab bar (2026-11-13, web 1.5.3)

Chloe still found the top strip soft under the iOS 26 blur and asked for it to become a bottom tab.

- **The top strip is removed on the phone.** Pages start at `--top-clear` (safe-area-top + 38 px) plus 6 px, so titles begin below the blurred band and scroll under it like a normal iOS app.
- **The More tab becomes the level tab.** Its icon is a ring that fills with XP towards the next level, with the level number inside, and its label is "Lv N". The tab bar stays balanced: My Day · Money · + · Insights · Lv.
- **The level tab opens the "You" sheet.** At the top is a card with a large XP ring, your title, "into / need XP to Lv N+1" and an XP bar; tapping the card opens Profile. Under it come the old More items (Planned, Habits, Quests), Lists and Settings. Profile is no longer a row in the sheet, because the card replaces it.
- **The "+N XP" fly-in** now lands on the level tab's ring and makes it glow.
