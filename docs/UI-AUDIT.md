# Quantum Bureau interface review

**Review date:** 2026-11-12 · **Branch:** `concept/quantum-bureau-field-journal`
**Review type:** source review, Playwright browser suite, and targeted screenshot inspection.

## Evidence reviewed

- `src/pages/Home.tsx`, `src/pages/CasePage.tsx`, `src/components/Layout.tsx`, `src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`, and the Bureau styles in `src/index.css`.
- On 2026-11-12, all 177 existing Playwright browser tests passed. After the latest player and copy updates, both focused browser checks passed; they verify the YouTube fallback link and the video jump position.
- On 2026-11-12, `npm test` passed (30 tests), `npm run lint` passed, and `npm run build` passed. Vite still reports the existing large Three.js chunk warning.
- Captured and inspected Home at 320, 768, and 1440 CSS-pixel widths. Also captured the video list, nonmodal player, measurement Prediction/Test/Finding states, evidence ledger, and a 375 × 320 mobile menu. The accepted flow captures are retained in [`design-previews/visitor-flow/`](design-previews/visitor-flow/). The YouTube stream itself was black in the local capture, so the player is verified structurally, not for actual playback; an “Open directly on YouTube” fallback is available.

The previous version of this file described the Observatory / Quantum Playground interface. Its route findings and screenshots did not apply to the Bureau. The selected interface identity is Registrar’s Field Journal; the Public Record Figma file is historical.

## Current interface behavior visible in source and test coverage

| Area | Current evidence | Review status |
|---|---|---|
| Landing order | Home renders the Public Registry first and the video section immediately after it (`src/pages/Home.tsx`). | Verified in source; ordering is also asserted by the browser suite. |
| Direct case routes | `/cases/:caseId` renders the guided case page. Unknown IDs render an archive lookup message and return link rather than an empty page (`src/App.tsx`, `src/pages/CasePage.tsx`). | Browser suite passed; the measurement case was captured in the current visual pass. |
| Case flow | Prediction is available first; testing and the finding appear after the visitor proceeds. A reading path can skip the test (`src/pages/CasePage.tsx`). | Prediction, Test, and Finding states were captured at 1440px. The user reports the team reviewed current science wording for accuracy. |
| Welcome and tour | A first-visit introduction uses an accessible dialog, offers a skip, and can lead into Qubi's tour. The navigation provides a replay action (`src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`). | Verified in source and prior recorded browser checks; the team reports its science wording is accurate. First-time visitor feedback on tour pacing remains uncollected. |
| Short mobile menu | Menu is a viewport-height dialog. Its navigation area has `overflow-y: auto`, `min-height: 0`, and touch scrolling; compact-height rules reduce row spacing (`src/index.css`). | Browser suite passed; the open menu was captured at 375 × 320. |
| Responsive layout | Home, case header, reference register, and footer switch to single-column layouts at narrower widths; the evidence ledger has its own horizontal scroller. | The 177-test run found no horizontal overflow on 18 routes at 320, 375, 414, 768, 1280, and 1440 CSS pixels. Home screenshot spot checks were reviewed at 320, 768, and 1440; visual review of other pages/states remains useful. |
| First-time wayfinding | The home hero identifies the videos as the main media, offers a prominent jump to them, and presents a Watch → Investigate → Compare route. Each episode links to its matching case. | Current captures show the Home and video sections at phone, tablet, and desktop sizes; the CTA lands with the section heading below the sticky header. |
| Episode unlock feedback | A correct check states how many plates opened and provides a direct Gallery Wall action. A short confetti burst is suppressed when reduced motion is enabled. | Episode 1 was completed in the browser; the success panel displayed “3 plates are now open” and linked to the gallery. |
| Sealed-file journey | Selecting a sealed gallery plate opens its associated episode and quiz; the completion action returns to that exact plate. | Episode 2 flow manually verified in the current preview: the selected gallery record was declassified and opened at `/gallery#entangled`. |
| Case-to-video nudge | The case page offers a related watch-along; it opens the associated player directly instead of requiring another selection on the video index. | Passed in the current Playwright suite. |
| Team records | Cards list supplied contributions; each science fact links to a research reference (`src/content/team.ts`, `src/pages/Team.tsx`). | Verified in source and build; the user reports that the team checked the fact wording and role details for accuracy. |
| Theme and motion | Dark is the initial theme; light mode is available. Shared reduced-motion styles suppress animation and transitions. | Automated checks passed; a human comfort and contrast review in both themes remains useful. |

## Follow-up before submission

1. Ask a first-time visitor without quantum-course experience to explore for ten minutes. Record actual observations in `docs/USER-TEST.md`; do not fill its rubric from developer expectations.
2. Check keyboard-only navigation, screen-reader labels, light-mode contrast, and the availability of video captions or transcripts with the group. Reduced-motion behavior has automated coverage.
3. Re-run the browser suite after future UI changes. Existing responsive checks cover 18 routes at six widths; latest focused checks cover the changed player and home jump.

The repo-native design handoff is in `docs/design-system.md`; Home and accepted visitor-flow captures are retained in `docs/design-previews/`. These are implementation screenshots, not a substitute for a first-time visitor study.

## Accepted visitor-flow captures

- [01 · Public Registry](design-previews/visitor-flow/01-public-registry.png)
- [02 · Video episodes](design-previews/visitor-flow/02-video-episodes.png)
- [03 · Video player](design-previews/visitor-flow/03-video-player.png)
- [04 · Case prediction](design-previews/visitor-flow/04-case-prediction.png)
- [05 · Case test](design-previews/visitor-flow/05-case-test.png)
- [06 · Case finding](design-previews/visitor-flow/06-case-finding.png)
- [07 · Evidence ledger](design-previews/visitor-flow/07-evidence-ledger.png)
- [08 · Short-height mobile menu](design-previews/visitor-flow/08-mobile-menu-short-height.png)

This review does not approve scientific explanations, replace the group's science review, or claim a user test has occurred.
