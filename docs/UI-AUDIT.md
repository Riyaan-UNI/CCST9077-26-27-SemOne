# Quantum Bureau interface review

**Review date:** 2026-11-12 · **Branch:** `concept/quantum-lost-found`
**Review type:** source and automated-check review; current visual browser inspection was unavailable in this environment.

## Evidence reviewed

- `src/pages/Home.tsx`, `src/pages/CasePage.tsx`, `src/components/Layout.tsx`, `src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`, and the Bureau styles in `src/index.css`.
- The current branch's latest recorded browser run: 169 end-to-end tests passed on 2026-11-11, including case navigation, mobile menu scrolling, guided tour routes, and horizontal-overflow checks from 320 to 1440 CSS pixels. The detailed record is in `docs/rubric-traceability-matrix.md`.
- Checks run on 2026-11-12: lint passed, 21 unit tests passed, and the production build passed. The build still reports a large Three.js chunk warning.
- A fresh local browser review was attempted on 2026-11-12. The preview server started, but the browser tool timed out and the shell denied local socket access. No screenshots from that attempt are presented as evidence.

The previous version of this file described the Observatory / Quantum Playground interface. Its route findings and screenshots did not apply to this Public Record design, so they have been removed rather than carried forward as current findings.

## Current interface behavior visible in source and test coverage

| Area | Current evidence | Review status |
|---|---|---|
| Landing order | Home renders the Public Registry first and the video section immediately after it (`src/pages/Home.tsx`). | Verified in source; ordering is also asserted by the browser suite. |
| Direct case routes | `/cases/:caseId` renders the guided case page. Unknown IDs render an archive lookup message and return link rather than an empty page (`src/App.tsx`, `src/pages/CasePage.tsx`). | Verified in source; current runtime screenshot is pending. |
| Case flow | Prediction is available first; testing and the finding appear after the visitor proceeds. A reading path can skip the test (`src/pages/CasePage.tsx`). | Verified in source; the group should check that the copy and pacing feel clear. |
| Welcome and tour | A first-visit introduction uses an accessible dialog, offers a skip, and can lead into Qubi's tour. The navigation provides a replay action (`src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`). | Verified in source and prior recorded browser checks; group review of the analogy and pacing remains pending. |
| Short mobile menu | Menu is a viewport-height dialog. Its navigation area has `overflow-y: auto`, `min-height: 0`, and touch scrolling; compact-height rules reduce row spacing (`src/index.css`). | Verified in source and covered by the recorded browser suite; a current hands-on check remains useful. |
| Responsive layout | Home, case header, reference register, and footer switch to single-column layouts at narrower widths; the evidence ledger has its own horizontal scroller. | Verified in source and prior automated overflow checks; current visual fit at 320, 768, 1024, and 1440 CSS pixels needs screenshot review. |
| Theme and motion | Dark is the initial theme; light mode is available. Shared reduced-motion styles suppress animation and transitions. | Code and automated checks exist; group should confirm contrast and comfort in both themes. |

## Follow-up before submission

1. Run a fresh visual pass at 320, 768, 1024, and 1440 CSS pixels, including a short-height phone viewport. Capture the Public Registry, a case in each step, the evidence ledger, the menu, and the video player.
2. Ask a first-time visitor without quantum-course experience to explore for ten minutes. Record actual observations in `docs/USER-TEST.md`; do not fill its rubric from developer expectations.
3. Check keyboard-only navigation, screen-reader labels, reduced motion, light-mode contrast, and the video captions or transcripts with the group.
4. Re-run the browser suite in an environment where the local preview can be opened. Report a timeout or unavailable browser as unverified, never as a pass.

This review does not approve scientific explanations, replace the group's science review, or claim a user test has occurred.
