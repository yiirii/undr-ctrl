# iPhone app + Firebase sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Undr Ctrl runs as an iPhone Home Screen web app and shares data with the Windows app through Firebase, offline-first, record by record, with no double counting.

**Architecture:** A pure sync model (`src/sync/model.ts`) turns `AppState` into keyed records, diffs two states and merges remote records back in. A sync engine (`src/sync/engine.ts`) watches the store, pushes changed records to a `Remote`, and applies incoming ones. `FirebaseRemote` is the real one, `FakeRemote` is for tests (this container cannot reach Google). A responsive phone shell (bottom tabs plus a quick-action sheet) is added under 720 px, and the web build is a PWA deployed to GitHub Pages.

**Tech Stack:** React 18, TypeScript, Zustand, Vitest, Playwright; `firebase` JS SDK v11 (auth + firestore); Electron 38 for desktop.

**Spec:** `docs/superpowers/specs/2026-11-03-lofi-design.md` (Rev 11).

## Global Constraints
- Firebase project `undr-ctrl-9f672`; web config is committed in `src/sync/config.ts` (it is not a secret).
- Auth uses **email + password only**.
- Firestore paths: `users/{uid}/records/{key}` with doc `{ k: collection, id, data, updatedAt: number(ms), deleted?: true, device }`.
- Device-local, never synced: `music`, `focus` (live session), `combo`, `settings.backupFolder`, `settings.lastCloudBackup`, `settings.cloudBackupFailed`, `settings.startWithWindows`, the sync meta.
- Ledger: the union of all entries; `reversed` once true stays true. Auto entries (`drip`, `quest`, `achievement`, `recap`) are deduplicated by `(source, ref)`, keeping the lowest id.
- Phone breakpoint: `max-width: 720px`. Touch targets of at least 44 px. Safe-area insets.
- Web base path: `/undr-ctrl/`. Hosted at `https://yiirii.github.io/undr-ctrl/`.
- Desktop and every existing test keep passing (242 unit, 16 e2e, sweep).

## Review Focus
1. Both devices roll over the same midnight before syncing → no doubled drip, quest or achievement XP.
2. An offline edit on the phone and a different edit on the laptop to the same Funko → the newest wins on both after reconnect, and the other device's untouched records survive.
3. A delete on one device and an edit of the same record on the other → the newest action wins; a delete never resurrects.
4. First sign-in on a laptop that already has data uploads everything; first sign-in on an empty phone downloads everything without wiping it with the empty state.
5. Undo (reverse) on one device while the other is offline → after the merge the entry is reversed on both and Wealth matches.

---

### Task 1: Deterministic automatic entries + canonical ledger
**Files:** Modify `src/store/logic.ts` (rollover monthly repeats). Create `src/sync/ledger.ts`. Test `src/sync/ledger.test.ts`.
**Interfaces — Produces:** `canonicalLedger(entries: LedgerEntry[]): LedgerEntry[]` (dedupes auto sources by `(source, ref)` keeping the lowest id; stable order by `at`, then id). Monthly repeat ids become `` `${tmpl.id}@${mk}` ``.
- [ ] Test: two rollovers of the same day on copies of one state → union of their ledgers passed through `canonicalLedger` → the Wealth equals one device's value.
- [ ] Test: monthly repeat generated on two devices has the same id.
- [ ] Implement, run `npx vitest run src/sync`, commit.

### Task 2: Sync model (records, diff, apply/merge)
**Files:** Create `src/sync/model.ts`, test `src/sync/model.test.ts`.
**Interfaces — Produces:**
- `type Rec = { k: string; id: string; data: unknown; updatedAt: number; deleted?: boolean }`
- `toRecords(s: AppState): Map<string, { k: string; id: string; data: unknown }>` with keys `` `${k}/${id}` `` for collections (`lists, tasks, categories, sources, entries, goals, deposits, items, expenses, income, ledger, quests`) and `` `one/${field}` `` for singletons (`profile, appearance, settings*, savingsTargetSen, setupDone, dismissedNudges, recapsSeen, bizName, platforms, achievements, questsCompleted, rerollDay, focusLog, focusSettings, myDayCleared, reminded, lastRollover, bizVersion`).
- `diff(prev: AppState, next: AppState): { upserts: {key,k,id,data}[]; deletes: {key,k,id}[] }` (by reference, then by JSON for singletons).
- `applyRemote(s: AppState, recs: Rec[]): AppState`: per-key merge rules — union for string-array singletons (`achievements, dismissedNudges, recapsSeen, myDayCleared, reminded`), max for `questsCompleted`, OR-of-`reversed` for ledger, latest for the rest; deletes remove the record; the ledger is then `canonicalLedger`'d.
- [ ] Tests: round-trip `applyRemote(empty, all records of s)` ≈ s (synced fields); diff detects edit, add, delete; a singleton union; a ledger reversed-OR; a tombstone removes.
- [ ] Implement, test, commit.

### Task 3: Sync engine + FakeRemote (two-device convergence)
**Files:** Create `src/sync/engine.ts`, `src/sync/fakeRemote.ts`, test `src/sync/engine.test.ts`.
**Interfaces — Produces:**
- `interface Remote { push(recs: Rec[]): Promise<void>; subscribe(cb: (recs: Rec[]) => void): () => void; }`
- `class SyncEngine { constructor(o: { get(): AppState; set(s: AppState): void; remote: Remote; now?: () => number; meta: SyncMeta }); start(): void; stop(): void; onLocalChange(prev, next): void; flush(): Promise<void>; status: { pending: number; lastSync?: number; online: boolean } }`
- `SyncMeta` = `Record<key, number>` (last known updatedAt per key), persisted by the caller.
- Remote records older than or equal to the local meta for the key are ignored; local pushes stamp `now()`.
- First sync: when the remote is empty, push everything; otherwise apply the remote, then push the local keys missing remotely.
- [ ] Tests (Review Focus 1–5): two engines on one FakeRemote; offline queue (FakeRemote `online=false`); edits on both; reconnect; states converge and Wealth/profit are equal.
- [ ] Implement, test, commit.

### Task 4: Firebase remote, auth, store wiring, Settings → Sync
**Files:** Create `src/sync/config.ts`, `src/sync/firebase.ts`, `src/sync/useSync.ts`. Modify `src/store/store.ts` (hook the local-change callback), `src/ui/views/Settings.tsx` (Sync tab), `src/ui/shell/App.tsx` (start the engine).
- `FirebaseRemote(uid)`: `push` = batched `setDoc` (500/batch); `subscribe` = `onSnapshot(collection(users/uid/records))` → changed docs as `Rec[]`. Firestore persistent local cache on.
- Auth: `signIn(email, pw)`, `signUp(email, pw)`, `signOut()`, `resetPassword(email)`; `onAuthStateChanged` starts or stops the engine.
- Sync tab: signed out → email + password, "Create account" / "Sign in", "Forgot password"; signed in → email, last sync, pending count, online dot, "Sync now", "Sign out".
- `firestore.rules` file: `match /users/{uid}/{doc=**} { allow read, write: if request.auth != null && request.auth.uid == uid; }`.
- [ ] E2E (browser, with FakeRemote injected through `window.__lofiRemote` in dev): the Sync tab renders; sign-in UI validation.
- [ ] Commit.

### Task 5: Phone layout + quick actions
**Files:** Create `src/ui/shell/PhoneNav.tsx`, `src/ui/shell/QuickActions.tsx`. Modify `src/ui/shell/App.tsx`, `src/ui/styles.css`.
- Under 720 px: hide the sidebar; a bottom tab bar (My Day · Money · **+** · Insights · More); More = a sheet listing the other pages and lists; the header shows a compact level/XP strip.
- **+** opens QuickActions: Sold, Bought, Reserve, Expense, Income, Task. They reuse the existing sheets (export `BuySheet`, `SellSheet`, `ReserveSheet`, `CostSheet` from Business.tsx; the LogSheet for expense/income; QuickAdd for task) and render them full-screen on phone.
- CSS: one-column grids, `.two` stacks, sheets full-screen with a safe-area bottom, inputs at least 16 px (avoids iOS zoom).
- [ ] E2E at 390×844: the tab bar is visible and the sidebar hidden; **+ → Sold** records a sale; More → Settings opens; the sweep at phone size (`VIEWPORT=phone`) has no problems.
- [ ] Screenshots reviewed by eye. Commit.

### Task 6: PWA + GitHub Pages deploy
**Files:** Modify `vite.config.ts` (base `/undr-ctrl/` when `WEB=1`); create `public/manifest.webmanifest`, `public/icons/*` (the rounded sword at 180/192/512, maskable), `public/sw.js` (cache-first app shell, network-first `index.html`, versioned), register it in `src/main.tsx` (web only); `scripts/deploy-web.sh` (build → push `dist` to the `gh-pages` branch).
- [ ] Check: the manifest is valid and the icons exist; offline reload in Playwright with the SW serves the app.
- [ ] Commit.

### Task 7: Desktop auto-update (if the GitHub API is reachable) + final verification
- If `add_repo` gives API access: electron-updater with the GitHub provider on `yiirii/undr-ctrl`, publish v1.1.0. Otherwise ledger a Ruling and keep the manual installer.
- Full suite, sweep (desktop and phone sizes), Electron smoke/nav/quit, dist, spec Rev 11 marked built, project doc sync.
