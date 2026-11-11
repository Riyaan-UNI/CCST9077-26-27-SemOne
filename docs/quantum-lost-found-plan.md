# Quantum Lost-and-Found Bureau — design and implementation plan

## Approved direction

- **Concept:** Quantum Lost-and-Found Bureau.
- **Audience and narrative:** First-time quantum explorers; case-conference story.
- **Course focus:** Three distinct limits on quantum information: measurement and what can be known, entanglement correlations without a controllable message channel, and the no-cloning theorem.
- **Information architecture:** Open case archive; case-conference evidence ledger.
- **Visual identity:** Public Record — clear public archive graphics with signal orange and ultramarine accents. Dark mode remains the default, with a working light-mode switch.
- **Homepage:** Public Registry; landing experience first, followed immediately by the video section.
- **Case pages:** Prediction → Test → Finding.
- **Accessibility and responsive design:** Guided Case Flow, with keyboard and touch access, reduced-motion support, readable stacking on small screens, captions/transcripts, and no drag-only controls.
- **Architecture:** Route-based React and TypeScript on Vite.
- **Group contribution approach:** Preserve the roles the group already stated; clarify the mascot contribution overlap before publishing it.
- **Git:** New branch `concept/quantum-lost-found` based on `feature/quantum-observatory-reskin`; leave prior branches untouched.
- **Review:** Science Evidence Review as the release gate, supported by responsive/accessibility checks and a first-time visitor review.
- **AI disclosure:** Brief statement only, describing actual AI use after implementation is complete.
- **Final assessment audit:** Rubric Traceability Matrix, with a submission checklist.
- **Continuity requirements:** Qubi stays the mascot. Three YouTube videos are available; the fourth episode remains marked as forthcoming. Preserve the existing feature set where it can be meaningfully re-expressed in the Bureau architecture.

## File-by-file implementation plan

### Product shell and navigation

- `src/components/Layout.tsx`: replace Observatory-only atmosphere, boot, and companion framing with the Bureau shell; keep theme application, reduced-motion detection, route focus handling, and an accessible skip link.
- `src/components/Nav.tsx`: rename navigation around the Public Registry, Cases, Evidence Ledger, Videos, Reference, Team, and Credits. Keep the responsive menu scrollable in short viewports and keep theme switching.
- `src/components/Footer.tsx`: present source, team, and credits links in the Public Record voice.
- `src/components/StartHere.tsx`: point first-time visitors to the registry and first case without blocking the page.
- `src/components/Qubi.tsx`, `QubiCompanion.tsx`: retain Qubi artwork and useful interactions, but remove presentation that competes with the Bureau experience; respect reduced motion.
- `src/index.css`: replace Observatory tokens and decorative orbit treatments with the Public Record system: high contrast, clear typography, documentary dividers, orange/ultramarine accents, dark default and light alternative.

### Home, cases, ledger, and video

- `src/pages/Home.tsx`: rebuild as the Public Registry. Keep the opening landing section first, place the three case index entries in the registry, and put the video section immediately after the landing experience.
- `src/content/cases.ts` (new): typed case metadata, student-authored copy slots, lecture connections, evidence summaries, videos, and explicit analogy/claim boundaries.
- `src/pages/CasePage.tsx` (new): shared route page for `/cases/:caseId` with Prediction → Test → Finding steps, preserving direct case links and a no-completion-required reading path.
- `src/components/cases/PredictionStep.tsx`, `TestStep.tsx`, `FindingStep.tsx` (new): keyboard/touch-operable case flow. Each step will explain its scientific scope and will not imply that conscious observation causes measurement.
- `src/components/cases/EvidenceLedger.tsx` (new): compare the case findings without suggesting a single shared mechanism; available as a page and from each case.
- `src/pages/Videos.tsx`, `src/data/videos.ts`, `src/components/sections/VideoWall.tsx`: retain all three YouTube IDs/titles and episode four's forthcoming state; ensure responsive playback, clear dismissal, click-to-load behavior, and transcript/caption status.
- `src/pages/Team.tsx`, `src/content/team.ts`: preserve verified names and stated contributions; avoid unapproved personal claims and resolve whether Riyaan's mascot work means visual integration while Damian is the inventor.

### Existing learning features and supporting pages

- `src/pages/Lab.tsx` and `src/components/lab/*`: retain the local quantum simulator, CHSH game, Bloch sphere, and no-cloning demonstration as Bureau test equipment; update their surrounding labels and presentation to match each case and preserve mathematical behavior.
- `src/pages/Timeline.tsx`, `src/content/timeline.ts`, `src/data/timeline.ts`: retain the course timeline as a supporting archive record, not the primary homepage narrative.
- `src/pages/CourseMap.tsx`, `src/content/courseMap.ts`: retain the lecture map as a reference page and check only selected topics are described as course-linked.
- `src/pages/Glossary.tsx`, `src/content/glossary.ts`: retain plain-language definitions and keyboard-operable term help.
- `src/pages/GalleryPage.tsx`, `src/data/gallery.ts`, `public/gallery/*`: retain attributed educational diagrams; remove decorative assets that do not explain a concept.
- `src/pages/Computer.tsx`, `UniverseComputer.tsx`, `src/components/computer/*`: keep or simplify existing computer interactions as supporting reference material; retain current routes unless a content audit demonstrates a route is redundant.
- `src/pages/Delight.tsx`, `src/data/quiz.ts`, `src/data/hypeCheck.ts`, `src/components/sections/Quiz.tsx`, `HypeCheck.tsx`: retain the quiz and misconception-check interactions under an archive/reference area, with no shame-based scoring.
- `src/pages/About.tsx`, `Credits.tsx`, `NotFound.tsx`: update concept explanation, concise AI disclosure, third-party attribution, and route recovery.
- `src/App.tsx`: add case and ledger routes while retaining useful existing routes and a working not-found route.
- `src/store/useStore.ts`: preserve dark as the initial theme, persisted preference, and sound/reduced-motion controls; remove obsolete observer state only when no retained feature uses it.
- `src/data/site.ts`, `src/config.ts`: update site title, links, and feature flags to match the Bureau without adding claims about institutional affiliation.

### Verification and release records

- `e2e/site.spec.ts` (existing): update end-to-end coverage for registry/case/video/team/reference navigation, direct case URLs, mobile menu, theme, and modal/player behavior.
- `src/content/validate.test.ts` and `src/quantum/simulator.test.ts`: retain content schema and physics tests; add focused assertions only when they verify the new case model or a real interaction invariant.
- `docs/human-decisions-log.md` (new): record selected and rejected directions and group decisions as they happen.
- `docs/assessment-traceability.md` (new, final phase): connect every assignment criterion to evidence in the site, code, Git history, group contributions, and AI statement.
- `.github/workflows/deploy.yml`: keep existing deployment behavior unchanged during the redesign. Add the new branch to deployment only if a deployment is intentionally requested and the GitHub Pages environment permits it.

## Planned work sequence

1. Record the design decisions and this implementation map.
2. Establish the Public Record tokens and the Bureau shell/navigation.
3. Build the Public Registry with landing-first/video-second ordering.
4. Build typed case content and accessible guided case pages plus the evidence ledger.
5. Integrate existing simulator functions, videos, Qubi, team, and supporting archive pages.
6. Review science claims against supplied lecture notes; collect team-authored copy and contributions.
7. Check layout at 320, 768, 1024, and 1440 CSS pixels, keyboard access, short-height mobile navigation, reduced motion, theme control, video dismissal, and direct routes.
8. Produce the final AI statement and rubric traceability matrix based on actual work, then make accurate milestone commits.

Commit messages must describe work that has actually occurred. Do not manufacture history or claim that AI-assisted code was written by a student.
