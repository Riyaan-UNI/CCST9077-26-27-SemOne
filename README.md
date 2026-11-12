# Quantum Lost-and-Found Bureau

An interactive popular-science project for **CCST9077 · The Quantum Revolution**. The Bureau is a fictional archive frame for exploring three distinct topics in quantum information: measurement, entanglement correlations, and the no-cloning theorem. Qubi remains the guide.

**Published site:** [Open the Quantum Lost-and-Found Bureau](https://riyaan-uni.github.io/CCST9077-26-27-SemOne/)

For assessment, use the `concept/quantum-bureau-field-journal` branch. It contains the current Field Journal experience and the complete project history from `main` onward.

The site uses the **Registrar’s Field Journal** visual identity: a dark, ruled notebook with margin marks, specimen tabs, handwritten notes, and warm signal-orange and mineral-teal accents. Dark mode is the default, with an optional light theme.

The group reports reviewing the current science explanations for accuracy against the supplied course material. AI assistance and source pointers are documented in Credits and the science source register.

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
| `/ledger` | Side-by-side case findings and predictions stored locally in the visitor’s browser |
| `/videos` | Three ready YouTube episodes and one forthcoming episode |
| `/lab` | Local quantum simulator, CHSH game, Bloch sphere, and related experiments |
| `/timeline`, `/course-map` | Course timeline and lecture references |
| `/computer`, `/universe-computer`, `/delight` | Supporting interactive activities and quick checks |
| `/gallery`, `/glossary` | Visual and vocabulary references |
| `/team`, `/about`, `/credits` | Group contribution record, archive guide, sources, and AI-use statement |

## Interaction and accessibility notes

- A case follows **Prediction → Test → Finding**. Visitors can skip the test and read the case finding.
- Predictions and observations shown in the evidence ledger are saved in local browser storage; there is no project backend.
- Video thumbnails load a nonmodal player only after a visitor selects a live episode. Caption and transcript availability should be checked on the published YouTube videos before submission.
- Dark mode is the default for new visitors. A light theme switch is available.
- Site navigation, predictions, case tests, and video controls are keyboard reachable. The short-height mobile menu scrolls internally.
- The interface respects `prefers-reduced-motion`; explanatory content does not depend on animation or color alone.
- Responsive browser checks cover 320, 375, 414, 768, 1280, and 1440 CSS-pixel widths.

## Git and deployment

### How the project reached the Bureau

The commit history shows the project’s actual progression. The Bureau was developed as a continuation of the existing site, so the earlier work and decisions remain visible rather than being replaced:

```text
main
└─ feature/quantum-scifi-ui-overhaul
   └─ feature/quantum-observatory-reskin
      └─ concept/quantum-bureau-field-journal  ← current assessment version
```

| Stage | Starting point | What changed |
|---|---|---|
| `main` · `6914cf0` | Project baseline | Preserved the working quantum site and fixed team cards so expanding one card does not stretch its neighbors. |
| `feature/quantum-scifi-ui-overhaul` · `a2ae792` | `main` | Introduced the first substantial science-fiction interface redesign while carrying forward the site’s existing content and features. |
| `feature/quantum-observatory-reskin` · `136fcd9` | Sci-fi redesign | Refined the visual system into the Quantum Observatory and set up the branch’s Pages deployment. |
| `concept/quantum-bureau-field-journal` · `49be66c` → current `eed57dc` | Observatory reskin | Reframed the site as the Quantum Lost-and-Found Bureau: a guided Field Journal with linked investigations, evidence-ledger interactions, video wayfinding, and clearer explanations. Subsequent commits document review, deployment, and refinements. |

This timeline is derived from the branch ancestry and commit history. Branches were kept so a grader can inspect how the interface evolved from `main` to the current version. `concept/quantum-bureau-field-journal` is now the repository’s default branch and is the recommended starting point for assessment; `main` and the two earlier design branches remain available for comparison. Commits describe the work as it happened; history has not been rewritten.

The Pages workflow runs for `main`, `feature/quantum-observatory-reskin`, and this branch. The repository’s `github-pages` environment must also allow `concept/quantum-bureau-field-journal`; see [`DEPLOY.md`](DEPLOY.md).

## Design guide and previews

The implemented Field Journal system and responsive screenshots are documented in [`docs/design-system.md`](docs/design-system.md) and [`docs/design-previews/`](docs/design-previews/).

## AI use

AI supported concept and copy brainstorming, review of supplied course materials, visual identity studies, a Figma token map, gallery plates and video thumbnails, and substantial React/TypeScript coding. The group reports reviewing the current science content for accuracy. Student-authored contributions should be documented separately from AI assistance; first-time visitor, accessibility, and media-caption checks remain to be recorded. The same brief disclosure appears on the Credits page and should be updated if actual use changes.

## Sources and content review

The selected cases map to CCST9077 Lectures 2–4. The topic-to-lecture map and supporting references are in [`docs/science-source-register.md`](docs/science-source-register.md). Exact slide numbers and reviewer names were not provided. Generated image studies are ideation references, not scientific sources.
