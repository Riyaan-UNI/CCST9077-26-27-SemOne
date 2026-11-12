# Quantum Bureau interface review

**Review date:** 2026-11-12 · **Branch:** `concept/quantum-bureau-field-journal`
**Review type:** source review, Playwright browser suite, and targeted screenshot inspection.

## Evidence reviewed

- `src/pages/Home.tsx`, `src/pages/CasePage.tsx`, `src/components/Layout.tsx`, `src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`, and the Bureau styles in `src/index.css`.
- On 2026-11-12, all 177 Playwright browser tests passed. Coverage includes responsive overflow checks on 18 routes at 320, 375, 414, 768, 1280, and 1440 CSS-pixel widths, screenshot runs for Home/Lab/Delight, guided routes, the sealed-gallery unlock path, and axe checks on 10 routes.
- On 2026-11-12, `npm test` passed (30 tests), `npm run lint` passed, and `npm run build` passed. Vite still reports the existing large Three.js chunk warning.
- Inspected the generated Home screenshots at 320, 768, and 1440 CSS-pixel widths in `.pw-out/responsive/`. The 320-pixel capture shows the primary video action; the 768- and 1440-pixel captures show the landing route and the videos immediately after it. This is a targeted visual spot check, not a full review of every page and state.

The previous version of this file described the Observatory / Quantum Playground interface. Its route findings and screenshots did not apply to the Bureau. The selected interface identity is Registrar’s Field Journal; the Public Record Figma file is historical.

## Current interface behavior visible in source and test coverage

| Area | Current evidence | Review status |
|---|---|---|
| Landing order | Home renders the Public Registry first and the video section immediately after it (`src/pages/Home.tsx`). | Verified in source; ordering is also asserted by the browser suite. |
| Direct case routes | `/cases/:caseId` renders the guided case page. Unknown IDs render an archive lookup message and return link rather than an empty page (`src/App.tsx`, `src/pages/CasePage.tsx`). | Verified in source; current runtime screenshot is pending. |
| Case flow | Prediction is available first; testing and the finding appear after the visitor proceeds. A reading path can skip the test (`src/pages/CasePage.tsx`). | Verified in source; the group should check that the copy and pacing feel clear. |
| Welcome and tour | A first-visit introduction uses an accessible dialog, offers a skip, and can lead into Qubi's tour. The navigation provides a replay action (`src/components/QuantumIntro.tsx`, `src/components/Nav.tsx`). | Verified in source and prior recorded browser checks; group review of the analogy and pacing remains pending. |
| Short mobile menu | Menu is a viewport-height dialog. Its navigation area has `overflow-y: auto`, `min-height: 0`, and touch scrolling; compact-height rules reduce row spacing (`src/index.css`). | Verified in source and covered by the recorded browser suite; a current hands-on check remains useful. |
| Responsive layout | Home, case header, reference register, and footer switch to single-column layouts at narrower widths; the evidence ledger has its own horizontal scroller. | The 177-test run found no horizontal overflow on 18 routes at 320, 375, 414, 768, 1280, and 1440 CSS pixels. Home screenshot spot checks were reviewed at 320, 768, and 1440; visual review of other pages/states remains useful. |
| First-time wayfinding | The home hero identifies the videos as the main media, offers a prominent jump to them, and presents a Watch → Investigate → Compare route. Each episode links to its matching case. | Verified in the current browser at phone and wide sizes; the primary CTA and video section were visually reviewed. |
| Episode unlock feedback | A correct check states how many plates opened and provides a direct Gallery Wall action. A short confetti burst is suppressed when reduced motion is enabled. | Episode 1 was completed in the browser; the success panel displayed “3 plates are now open” and linked to the gallery. |
| Sealed-file journey | Selecting a sealed gallery plate opens its associated episode and quiz; the completion action returns to that exact plate. | Episode 2 flow manually verified in the current preview: the selected gallery record was declassified and opened at `/gallery#entangled`. |
| Case-to-video nudge | The case page offers a related watch-along; it opens the associated player directly instead of requiring another selection on the video index. | Passed in the current Playwright suite. |
| Team records | Cards list supplied contributions; the four short science facts are labeled as drafts and link to a research reference (`src/content/team.ts`, `src/pages/Team.tsx`). | Verified in source and build; the group must check each fact and confirm the roles before submission. |
| Theme and motion | Dark is the initial theme; light mode is available. Shared reduced-motion styles suppress animation and transitions. | Code and automated checks exist; group should confirm contrast and comfort in both themes. |

## Follow-up before submission

1. Run a fresh visual pass at 320, 768, 1024, and 1440 CSS pixels, including a short-height phone viewport. Capture the Public Registry, a case in each step, the evidence ledger, the menu, and the video player.
2. Ask a first-time visitor without quantum-course experience to explore for ten minutes. Record actual observations in `docs/USER-TEST.md`; do not fill its rubric from developer expectations.
3. Check keyboard-only navigation, screen-reader labels, reduced motion, light-mode contrast, and the video captions or transcripts with the group.
4. Re-run the browser suite after future UI changes. The current suite passes, but the group should still check keyboard-only use, theme contrast, captions/transcripts, and the quality of the science explanations.

The connected Figma account was unable to edit the historical Public Record file. A new Field Journal Figma file now contains the matching dark/light theme colors and spacing tokens. Its homepage frame and visual validation remain pending.

This review does not approve scientific explanations, replace the group's science review, or claim a user test has occurred.
