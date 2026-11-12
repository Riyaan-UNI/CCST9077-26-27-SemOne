# Quantum Lost-and-Found Bureau

An interactive popular-science project for **CCST9077 · The Quantum Revolution**. The Bureau is a fictional archive frame for exploring three distinct topics in quantum information: measurement, entanglement correlations, and the no-cloning theorem. Qubi remains the guide.

The site uses the **Registrar’s Field Journal** visual identity: a dark, ruled notebook with margin marks, specimen tabs, handwritten notes, and warm signal-orange and mineral-teal accents. Dark mode is the default, with an optional light theme.

The public-facing text and diagrams in the case files are working drafts. The student group must review and revise them against the course material before submission.

## Run locally

```bash
npm install
npm run dev
```

The Vite development server runs at `http://127.0.0.1:5173`.

| Script | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run typecheck` | TypeScript checks |
| `npm run build` | Typecheck and production build |
| `npm test` | Quantum simulator and content validation tests |
| `npm run test:e2e` | Browser interactions, responsive checks, and axe accessibility scans |
| `npm run lint` | ESLint |

## Archive map

| Route | Content |
|---|---|
| `/` | Public Registry landing page, followed by the video records and an evidence-ledger preview |
| `/cases` | Index of the three cases |
| `/cases/measurement` | Superposition and measurement case flow |
| `/cases/entanglement` | Entanglement, Bell correlations, and the no-message boundary |
| `/cases/no-cloning` | Limits on copying arbitrary unknown states |
| `/ledger` | Side-by-side working findings and predictions stored locally in the visitor’s browser |
| `/videos` | Three ready YouTube episodes and one forthcoming episode |
| `/lab` | Local quantum simulator, CHSH game, Bloch sphere, and related experiments |
| `/timeline`, `/course-map` | Course timeline and lecture references |
| `/computer`, `/universe-computer`, `/delight` | Supporting interactive activities and quick checks |
| `/gallery`, `/glossary` | Visual and vocabulary references |
| `/team`, `/about`, `/credits` | Group contribution record, archive guide, sources, and AI-use statement |

## Interaction and accessibility notes

- A case follows **Prediction → Test → Finding**. Visitors can skip the test and read the working finding.
- Predictions and observations shown in the evidence ledger are saved in local browser storage; there is no project backend.
- Video thumbnails load a nonmodal player only after a visitor selects a live episode. YouTube captions/transcript availability still needs group review.
- Dark mode is the default for new visitors. A light theme switch is available.
- Site navigation, predictions, case tests, and video controls are keyboard reachable. The short-height mobile menu scrolls internally.
- The interface respects `prefers-reduced-motion`; explanatory content does not depend on animation or color alone.
- Responsive browser checks cover 320, 375, 414, 768, 1280, and 1440 CSS-pixel widths.

## Git and deployment

The Bureau work is on `concept/quantum-lost-found`, branched from `feature/quantum-observatory-reskin`. The prior branch and `main` remain unchanged. Commits should describe real work as it happens; do not invent or rewrite history.

GitHub Pages deployment for this new branch has not been configured. The existing Pages workflow currently runs for `main` and `feature/quantum-observatory-reskin`; the GitHub Pages environment’s allowed deployment branches must also include this branch before it can publish.

## Figma design reference

The Figma file linked from [`docs/figma-design-system.md`](docs/figma-design-system.md) documents the earlier Public Record direction. The current Field Journal design is implemented in CSS and was not applied to that Figma file.

## AI use

AI supported concept and copy brainstorming, review of supplied course materials, draft visual identity studies, a Figma mapping of interface tokens, gallery plates and video thumbnails, and React/TypeScript coding. The group selected the direction and is responsible for revising draft content, verifying scientific claims, and testing the site before submission. The same brief disclosure appears in the Credits page and should be updated if actual use changes.

## Sources and content review

The selected cases map to CCST9077 Lectures 2–4. A working topic-to-lecture map is in [`docs/science-source-register.md`](docs/science-source-register.md); exact slide references should be added after the group science review. Generated image studies are ideation references, not scientific sources.
