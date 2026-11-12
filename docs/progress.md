# Implementation progress

This log records work against the user-provided draft brief in `docs/game-design-brief.md`. The brief explicitly says the group must review and rewrite its design before it counts as group-authored work. AI-generated quiz text is marked for human review; no group review is claimed here.

## Changes

| Date | Input prompt | Change | Evidence / status |
|---|---|---|---|
| 2026-11-12 | User supplied “Game Design Brief: Quantum Lost-and-Found Bureau” and asked to implement it in the existing repo. | Copied the supplied draft into `docs/game-design-brief.md`; checked current branch and existing source/assets before implementation. | Branch is `concept/quantum-lost-found`; no other branch was changed. Baseline `npm test` (21 tests), `npm run lint`, and `npm run build` passed. The build reports an existing large Three.js chunk warning. |
| 2026-11-12 | Milestone 1 — progression and content layer | Added typed episode/artwork/progress/question records, pure reducer/selectors, safe localStorage read/write with malformed/unavailable fallback, and quiz review metadata. Added focused progression and quiz schema tests. | `npm test`: 29 passing; `npm run lint`: passed; `npm run build`: passed. Existing Three.js bundle-size warning remains. |
| 2026-11-12 | Milestones 2–5 — Board, Observer Mode, episode checks, Gallery Wall, polish | Added responsive case board, always-visible Observer Mode control, five-point confidence logging and finding-read state, non-blocking 3-question checks for the three live episodes, and a six-plate Gallery Wall with locks, unlock explanations, supplied alt text and existing images. Updated browser tests for unlocks, observer view, reduced motion and target widths. | Unit tests, lint, production build and `git diff --check` pass. Playwright could not reach its local Vite server; direct local HTTP access is denied by the environment’s socket permissions, so visual/E2E assertions remain unverified here. |

## Decisions for the team

- **Episode mapping mismatch:** the draft maps Episode 3 to no-cloning, but the current published Episode 3 is *The Game Show That Broke Reality* (CHSH), and the existing Episode 4 slot is *No Perfect Copy* (forthcoming). Implementation will align Episode 1 quizzes with measurement, Episode 2 with entanglement/no-message, and Episode 3 with the CHSH content actually published. Keep Episode 4 forthcoming and its quiz absent until the team confirms its topic, title, and status. The draft’s “Case Conference” label remains provisional.
- **Episode titles:** preserve the three published titles and the current Episode 4 placeholder from `src/data/videos.ts`; confirm final titles with the team before release.
- **Artwork inventory:** use the six existing SVG files in `public/gallery`; do not generate replacements. Initial mappings will follow the closest visible topic and remain provisional until the team confirms which plates belong to which episode. In particular, `photon-key.svg` and `error-correction.svg` do not directly match the three published video descriptions.
- **Transcripts:** no full transcript is present for Episodes 1–3. Do not invent one or enable transcript search. Show the existing episode descriptions as notes and identify missing transcripts as a team follow-up. Caption availability must be checked in YouTube by the team.
- **Watched transition:** the draft defines selection/opening the player as the watched transition. Use that trigger because playback completion telemetry is not available through the current player. The team can revise this if it wants completion-based progress.
- **Quiz pass rule:** three questions per available episode; require all three correct to pass. Wrong answers show the explanation and can be retried without a score penalty.
- **Prediction confidence:** use a five-step confidence control (1–5) because the brief asks for confidence but gives no scale.
- **Observer Mode:** start off for new visitors; persist the selection with other local progress. In Observer Mode, hide game/progression chrome and reveal all existing artwork, while keeping routes, case explanations, videos, and simulations available. Episode 4 remains visibly forthcoming because no video exists to reveal.
- **Case Conference:** keep it reachable at all times through the existing ledger route. Show its complete comparison after all three current case findings are marked read; otherwise explain the remaining readings and provide direct “Read anyway” links.
- **Episode release state:** initialize progress from the current `videos.ts` live/coming-soon statuses. If a formerly locked slot becomes live, a fresh or existing saved progress record can become available without changing routes.
- **Audio:** add no optional sounds. The brief calls sound optional, and the project has no approved sound assets.
- **Progress acceptance:** selecting a live video marks it watched because the existing YouTube embed does not expose trusted playback-completion state. The episode check is optional, may be retried, and has no penalty; passing all three items unlocks its mapped existing plates.
- **Artwork mapping:** all six existing Gallery SVGs are available as plates. Their episode links and alt descriptions are working drafts based on existing captions and should be confirmed by the group, especially the surface-code and photon-key plates.
- **Question review:** all nine quiz items have `needs-review`; no original PDF slide number or group science approval is claimed. The team must check wording/explanations against original slides and record reviewer, slide and corrections in the science source register.
- **Observer Mode:** starts off; it hides progression counters/checks and reveals all supplied plates, while routes, case reading, videos and experiments remain accessible. Turning it off restores the saved progression view.

Decisions above are implementation defaults for the team to confirm, not new student-group approvals.
