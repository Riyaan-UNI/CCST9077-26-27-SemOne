# Quantum Bureau interface review

**Review date:** 2026-11-12 · **Branch:** `concept/quantum-bureau-field-journal`
**Review type:** source and automated-check review; current visual browser inspection was unavailable in this environment.

## Evidence reviewed

- `src/pages/Home.tsx`, `src/pages/CasePage.tsx`, `src/components/Layout.tsx`, `src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`, and the Bureau styles in `src/index.css`.
- The current branch's latest recorded browser run: 169 end-to-end tests passed on 2026-11-11, including case navigation, mobile menu scrolling, guided tour routes, and horizontal-overflow checks from 320 to 1440 CSS pixels. The detailed record is in `docs/rubric-traceability-matrix.md`.
- Checks run on 2026-11-12: lint passed, 21 unit tests passed, and the production build passed. The build still reports a large Three.js chunk warning.
- A fresh local browser review was attempted on 2026-11-12. The preview server started, but the browser tool timed out and the shell denied local socket access. No screenshots from that attempt are presented as evidence.

The previous version of this file described the Observatory / Quantum Playground interface. Its route findings and screenshots did not apply to the Bureau. The selected interface identity is Registrar’s Field Journal; the Public Record Figma file is historical.

## Current interface behavior visible in source and test coverage

| Area | Current evidence | Review status |
|---|---|---|
| Landing order | Home renders the Public Registry first and the video section immediately after it (`src/pages/Home.tsx`). | Verified in source; ordering is also asserted by the browser suite. |
| Direct case routes | `/cases/:caseId` renders the guided case page. Unknown IDs render an archive lookup message and return link rather than an empty page (`src/App.tsx`, `src/pages/CasePage.tsx`). | Verified in source; current runtime screenshot is pending. |
| Case flow | Prediction is available first; testing and the finding appear after the visitor proceeds. A reading path can skip the test (`src/pages/CasePage.tsx`). | Verified in source; the group should check that the copy and pacing feel clear. |
| Welcome and tour | A first-visit introduction uses an accessible dialog, offers a skip, and can lead into Qubi's tour. The navigation provides a replay action (`src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`). | Verified in source and prior recorded browser checks; group review of the analogy and pacing remains pending. |
| Short mobile menu | Menu is a viewport-height dialog. Its navigation area has `overflow-y: auto`, `min-height: 0`, and touch scrolling; compact-height rules reduce row spacing (`src/index.css`). | Verified in source and covered by the recorded browser suite; a current hands-on check remains useful. |
| Responsive layout | Home, case header, reference register, and footer switch to single-column layouts at narrower widths; the evidence ledger has its own horizontal scroller. | Verified in source and prior automated overflow checks; current visual fit at 320, 768, 1024, and 1440 CSS pixels needs screenshot review. |
| First-time wayfinding | The home hero identifies the videos as the main media, offers a prominent jump to them, and presents a Watch → Investigate → Compare route. Each episode links to its matching case. | Verified in the current browser at phone and wide sizes; the primary CTA and video section were visually reviewed. |
| Episode unlock feedback | A correct check states how many plates opened and provides a direct Gallery Wall action. A short confetti burst is suppressed when reduced motion is enabled. | Episode 1 was completed in the browser; the success panel displayed “3 plates are now open” and linked to the gallery. |
| Sealed-file journey | Selecting a sealed gallery plate opens its associated episode and quiz; the completion action returns to that exact plate. | Implemented; end-to-end browser confirmation is pending. |
| Team records | Cards list supplied contributions; the four short science facts are labeled as drafts and link to a research reference (`src/content/team.ts`, `src/pages/Team.tsx`). | Verified in source and build; the group must check each fact and confirm the roles before submission. |
| Theme and motion | Dark is the initial theme; light mode is available. Shared reduced-motion styles suppress animation and transitions. | Code and automated checks exist; group should confirm contrast and comfort in both themes. |

## Follow-up before submission

1. Run a fresh visual pass at 320, 768, 1024, and 1440 CSS pixels, including a short-height phone viewport. Capture the Public Registry, a case in each step, the evidence ledger, the menu, and the video player.
2. Ask a first-time visitor without quantum-course experience to explore for ten minutes. Record actual observations in `docs/USER-TEST.md`; do not fill its rubric from developer expectations.
3. Check keyboard-only navigation, screen-reader labels, reduced motion, light-mode contrast, and the video captions or transcripts with the group.
4. Re-run the Playwright browser suite in an environment where the local preview can be opened. A current run could not reuse localhost and tried to start a second server on an occupied port; its result is unverified, never a pass.

The connected Figma account was unable to edit the historical Public Record file. The new Field Journal direction is implemented in the website and documented in this repository, but is not represented in that Figma file.

This review does not approve scientific explanations, replace the group's science review, or claim a user test has occurred.
