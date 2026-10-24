# My Learning Journey — implementation and release assessment

Date: 23 October 2026

## Architecture assessment

The checkout contains all 18 planned, playable Level 1 games in the central `lib/games/registry.ts` registry: 10 English, 2 Mathematics, 2 Science and 4 Geography. No Coming Soon or Planned entry is treated as playable.

The 10 English games share `GameEngine`. Addition uses its own related engine and retains its existing difficulty progress. Animal Habitats, Subtraction Adventure, Living or Non-Living, Continent Explorer, Ocean Explorer, Flag Detective and Landmark Explorer have distinct engines and scoring flows. The implementation therefore adds one small session hook to the existing start/result boundaries instead of rewriting game engines. Existing scoring, feedback, replay controls, GA4 gameplay events and Academy entitlement code remain in place.

The route `/games/my-learning-journey` is a server-rendered page shell containing a narrowly scoped client dashboard. Browser APIs are accessed only from client event handlers or `useEffect`, so the server render emits a stable loading state and does not read `localStorage`.

## Progress model and storage

Storage key: `zalea-learning-journey-v1`
Schema version: `1`

The top-level record contains:

- `version` and `updatedAt`;
- a game map keyed by the stable registry `gameId`;
- verified achievement IDs and award timestamps;
- a bounded list of 250 recent session identifiers used for idempotency.

Each game record stores the registry subject ID, sessions started, completed sessions, total correct answers, total questions from completed sessions, percentage-normalised personal best, last-played time and first-completed time. It does not store answers, question text, names, contact details, dates of birth or other personal identifiers.

A session is created only when the existing Start or Replay action succeeds. An abandoned session therefore counts as a tried session but not a completion. A completed result with any score—including a low score—counts as completed. Completion requires the matching session identifier, and a completed identifier cannot be recorded twice. This protects against rerenders, result remounts, duplicate callbacks and React Strict Mode behavior.

Sanitisation rejects unknown schema versions, ignores unknown/non-playable game IDs, clamps negative or impossible values, recalculates percentages, verifies achievements from the stored counters, bounds session metadata, and returns a safe empty state for missing/corrupt data. A version-0 migration path demonstrates forward migration support without inventing historical answer totals. New registry games remain available without rewriting existing records.

Storage exceptions and quota failures never prevent a game from running. The dashboard listens to both the browser `storage` event and a same-tab custom event, providing practical multi-tab and same-tab refresh behavior.

## Games integrated

| Subject | Games |
|---|---|
| English | A or An?, One or Many?, He She It, Is Am Are, Can or Can't?, Who Is It?, Whose Is It?, Where Is It?, This That These or Those?, Has or Have? |
| Mathematics | Addition Level 1, Subtraction Adventure |
| Science | Where Do I Live?, Living or Non-Living? |
| Geography | Continent Explorer, Ocean Explorer, Flag Detective, Landmark Explorer |

All 18 use stable registry IDs. Existing underscore-form analytics IDs on standalone games were deliberately left unchanged so historical GA4 gameplay reporting is not fragmented.

## Dashboard behavior

The dashboard distinguishes games tried from completed sessions and displays only reliable question totals from completed result flows. It includes subject progress calculated from currently available registry entries, per-game Played/Not Played state and personal best, recently played games, earned achievements, and a transparent next-game suggestion.

Suggestion order is:

1. an untried available game in the most recently played subject;
2. another untried available Level 1 game;
3. a played game with the lowest personal-best percentage.

Coming Soon and Planned games are excluded. The result is described as a simple suggestion, not an AI assessment.

## Achievements

Achievements are derived from validated progress rather than trusted as independent claims:

- **First Adventure:** at least one completed session.
- **Curious Explorer:** at least three different games genuinely started.
- **Subject Explorer:** every currently available game in one subject genuinely started.
- **Perfect Round:** a 100% personal best from a completed session.
- **Keep Practising:** ten completed sessions.
- **World Explorer:** three different Geography games completed.

Awards are deduplicated. Opening a game route does not earn anything.

## Export, import and clear

Export creates a local JSON download of the sanitised versioned record. No progress file is uploaded. Import accepts JSON up to 256 KB, requires a supported schema, discards unknown games, sanitises values and verifies achievements. The visitor explicitly chooses merge or replace. Merge takes the maximum compatible counters and best result instead of blindly adding a backup to itself, so importing the same file repeatedly does not inflate progress. This conservative merge may under-count genuinely independent histories from two devices; replace remains the exact-restore option.

Clear requires confirmation, writes a valid empty journey record and leaves every unrelated browser-storage key untouched.

## Privacy and accessibility review

The feature requires no account, identifier or backend. The visible notice states: “Your progress is saved on this device. Clearing browser data may remove it.” It also explains that names, emails, individual answers and export files are not sent to Zalea Studio.

The current Privacy Policy already covers local game scores/completion data, local storage, children's privacy, non-collection of child identifiers, GA4 and retention on the device. No policy amendment is required for this local-only release.

The route uses semantic headings, real links, labelled file input, live status text, keyboard-operable controls, visible focus styles, accessible progress bars and reduced-motion-compatible existing styles. Browser checks at 320, 375, 768 and 1440 pixels found no horizontal overflow.

## Analytics

Existing gameplay events remain unchanged. The learning feature adds only aggregate, non-identifying events:

- `learning_journey_view`
- `progress_export`
- `progress_import` with `mode`
- `achievement_earned` with achievement ID
- `recommended_game_click` with registry game ID

No score history, answers, exported JSON, timestamps, session IDs or device identifiers are added to these events.

## Public visitor-statistics feasibility

The current checkout contains a client-side GA4 measurement ID and gameplay events, but it does **not** contain:

- a Google Analytics Data API dependency or REST client;
- a GA4 property ID for server-side reporting;
- service-account credentials in Worker secrets;
- a Worker KV/D1 cache binding for aggregate results;
- a configured server-side aggregate endpoint.

Reliable public traffic statistics are therefore **not release-ready in this checkout**. No homepage widget, fake count or page-load counter was added.

A later implementation should grant a dedicated service account read-only access to the GA4 property, store the property ID/service-account email/private key only as Worker secrets, query `activeUsers` and `screenPageViews` server-side, and cache the aggregate result for at least 6–24 hours. The public labels should be “Active users in the last 30 days” and “Page views in the last 30 days”; `activeUsers`, sessions and page views must not be relabelled as unique people. “Available games” can be derived from the registry.

The endpoint should return a graceful unavailable state and the homepage should omit the section when no trustworthy cached result exists. Publishing totals does not introduce new personal collection, but it does disclose business traffic trends. The owner should decide whether that disclosure is desirable before release. The existing privacy policy already describes GA4 measurement; it should be re-reviewed if the later implementation changes collection or processing, not merely because an aggregate is displayed.

## Files added

- `app/games/my-learning-journey/page.tsx`
- `components/games/learning-journey-dashboard.tsx`
- `hooks/use-learning-session.ts`
- `lib/games/learning-journey.ts`
- `scripts/learning-journey.test.mjs`
- `scripts/capture-learning-journey-qa.mjs`
- `qa/learning-journey/learning-journey-320.png`
- `qa/learning-journey/learning-journey-375.png`
- `qa/learning-journey/learning-journey-768.png`
- `qa/learning-journey/learning-journey-1440.png`
- `qa/learning-journey/learning-journey-responsive-contact-sheet.jpg`

## Files modified for this feature

- `app/games/page.tsx`
- `app/sitemap.ts`
- `components/games/game-engine.tsx`
- `components/games/addition-game-engine.tsx`
- `components/games/animal-habitats-game.tsx`
- `components/games/subtraction-adventure-game.tsx`
- `components/games/living-or-non-living-game.tsx`
- `components/games/continent-explorer-game.tsx`
- `components/games/ocean-explorer-game.tsx`
- `components/games/flag-detective-game.tsx`
- `components/games/landmark-explorer-game.tsx`
- `lib/analytics.ts`
- `package.json`
- `eslint.config.mjs` (excludes generated `.wrangler` output from source linting)

The first three newly developed games named in the brief—Landmark Explorer, Subtraction Adventure and Living or Non-Living—were preserved and received only the same start/completion hook as the other standalone engines.

## Validation results

- TypeScript: pass.
- ESLint: pass with zero errors; one pre-existing `next/image` advisory in Animal Habitats remains.
- Learning Journey unit tests: 16/16 pass.
- Existing Addition tests: 4/4 pass.
- Subtraction, Living/Non-Living, Landmark, Continent, Ocean and Flag validators: pass.
- Next.js 16 production build: pass using the supported Webpack builder. The default Turbopack builder panics in this Windows execution environment while spawning the unchanged PostCSS/global CSS worker; this is an environment/tooling issue rather than a source compilation error.
- OpenNext Cloudflare build: pass using the successful Webpack Next build path; `.open-next/worker.js` generated.
- Wrangler `deploy --dry-run`: pass; 413 static assets and all configured bindings recognised, with no deployment.
- Wrangler startup check: pass; Worker bundle built and startup profile completed.
- Browser integration: pass. A shared-engine English game and the standalone Addition game were genuinely started and completed through their live local UIs; the refreshed dashboard recorded 2 tried games, 2 completed sessions and 20 answered questions.
- Responsive browser QA: pass at 320, 375, 768 and 1440 pixels; one H1 and no horizontal overflow at every size.
- Local routes: `/games` and `/games/my-learning-journey` return HTTP 200; the journey self-canonical is correct.
- Local sitemap: 89 URLs after adding the one new canonical route, with the journey route present exactly once.
- `git diff --check`: pass.

## Remaining limitations and release recommendation

- Progress remains browser/device-local and does not sync across devices.
- Private/incognito modes, browser clearing and storage restrictions can remove or prevent saving progress.
- Conservative merge avoids double-counting backups but cannot perfectly union independent histories without retaining a larger session ledger or adding accounts.
- Question totals are recorded only for completed sessions because abandoned engines do not expose a reliable shared answered-question callback.
- Public visitor statistics remain intentionally unimplemented until secure GA4 Data API access and caching exist.
- OpenNext warns that native Windows builds are less predictable than WSL/Linux; CI or release validation should continue in the production-like environment.

**Release recommendation:** My Learning Journey is locally release-ready after owner visual review. The optional public visitor-statistics section should remain out of this release. Do not deploy until the owner approves the screenshots and final diff.
