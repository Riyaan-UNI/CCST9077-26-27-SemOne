# The Quantum Revolution — interactive microsite

An interactive, scroll-driven website for the **CCST9077 · The Quantum Revolution: From Secret Codes to Quantum Computers** group project (HKU Common Core), hosted by the mascot **Qubi**.

Everything on the page runs locally in the browser. There is no backend, no analytics, and no third-party request until you click a video.

---

## Quick start

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck (`tsc --noEmit`) then production build into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run typecheck` | TypeScript only |
| `npm test` | Vitest suite for the quantum engine |
| `npm run test:e2e` | Playwright end-to-end + axe-core accessibility checks |
| `npm run lint` | ESLint (see `eslint.config.js`) |

Deploy the `dist/` folder to any static host — Vercel, Netlify, Cloudflare Pages or GitHub Pages. Because routing is client-side, configure a SPA fallback (rewrite all paths to `index.html`).

---

## What is on the site

| Route | Contents |
|---|---|
| `/` | Observer Field hero, the timeline from RSA to below-threshold error correction, ten concept cards, the swipeable **hype check**, gallery, video wall, and a five-question quiz |
| `/lab` | The **quantum circuit simulator** (1–3 qubits, H/X/Z/S/T/CNOT, live amplitudes, measurement histogram, lazy Bloch sphere) and the **CHSH game** |
| `/gallery` | Full masonry gallery with a lightbox |
| `/about` | The Qubi concept, the technology stack, and credits |

### Signature interactions

- **Observer Field** — a custom canvas effect (~200 lines, no particle library). Particles drift as diffuse superpositions and *collapse* into sharp points near the cursor; collapsed neighbours light up as entangled links. Toggle it with the eye icon in the top bar. Disabled under `prefers-reduced-motion`.
- **Scroll-linked timeline** — the progress beam is driven by `useScroll` + `useSpring`.
- **Swipeable hype-check cards** — drag with Motion, or use the arrow buttons; a `canvas-confetti` burst when you reset.
- **Live quantum simulation** — every amplitude, phase and probability you see is computed by `src/quantum/simulator.ts`.

---

## Project structure

```
src/
  quantum/
    simulator.ts          # typed statevector engine (no dependencies)
    simulator.test.ts     # Vitest suite pinned to closed-form physics
  data/                   # all copy lives here — edit without touching components
    timeline.ts  concepts.ts  hypeCheck.ts  videos.ts  gallery.ts  quiz.ts  site.ts
  store/useStore.ts       # Zustand: theme, sound, observer mode, Qubi's reaction bus
  components/
    Layout.tsx  Nav.tsx  Footer.tsx  LoadingScreen.tsx  RouteFallback.tsx
    ObserverField.tsx  Qubi.tsx  QubiCompanion.tsx  Reveal.tsx  Section.tsx  Page.tsx  Skeleton.tsx
    sections/             # Hero, Timeline, ConceptGrid, HypeCheck, VideoWall, Quiz, GalleryGrid
    lab/                  # Simulator, ChshGame, BlochSphere (lazy)
  pages/                  # Home, Lab, GalleryPage, About, NotFound
public/gallery/           # procedural SVG plates
scripts/make_gallery.py   # regenerates those plates
e2e/site.spec.ts          # Playwright: boot hand-off, routes, lab, axe a11y
```

---

## The quantum engine

`src/quantum/simulator.ts` is a dependency-free statevector simulator for up to three qubits. Qubit 0 is the most significant bit, so a basis index reads `|q0 q1 … qn-1⟩` left to right.

Supported: `I, X, Z, H, S, T`, `R_y(θ)`, `CNOT`, `CZ`, measurement with collapse, and the CHSH game (both classical and optimal quantum strategies).

`npm test` verifies it against closed-form physics rather than against itself:

| Test | Assertion |
|---|---|
| Two Hadamards | `H·H = I` on every basis state |
| Bell state | only ever yields `00` or `11` |
| Equal-angle correlation | `= 1` |
| Outcome agreement | `P(same) = cos²(angleA − angleB)` |
| CHSH quantum | win rate `= cos²(π/8) ≈ 0.8536` |
| CHSH classical | win rate `= 0.75` |

`npm run test:e2e` drives a real Chromium against the dev server and covers:

- the static splash handing off to the app and being **removed from the DOM** (it once trapped the page);
- the splash progress bar being clipped inside its frame;
- all four routes, the `/lab#chsh` deep link and the 404 page;
- measuring a Bell pair in the UI only ever collapsing to `|00⟩` or `|11⟩`;
- the CHSH game converging above the classical ceiling;
- axe-core scans (WCAG 2.0/2.1 A + AA) on every route, failing on any serious or critical violation.

---

## Editing content

All copy is typed data under `src/data/`. To add a timeline entry, a concept, a hype-check card or a quiz question, edit the relevant file — no component changes needed.

**Videos.** Add real YouTube ids to `src/data/videos.ts`. Slots without an id render a branded placeholder. Cards use a facade, so YouTube is contacted only after a click.

**Gallery.** Replace the SVGs in `public/gallery/` and update `src/data/gallery.ts` (path plus intrinsic `width`/`height`). Regenerate the current plates with `python scripts/make_gallery.py`.

---

## Accessibility

- Keyboard reachable controls throughout; Radix primitives handle focus trapping and ARIA wiring.
- Toggles expose `aria-pressed`; the mobile menu is a proper dialog with a title and description.
- A skip link precedes the navigation.
- `prefers-reduced-motion` disables the boot animation, smooth scrolling, the Observer Field, reveal transitions and confetti.
- Colour tokens are defined for both light and dark themes with contrast in mind.

## Typography

Type is deliberately large, because the retro-terminal look tempts you into sizes that are unreadable.

| Rule | Detail |
|---|---|
| Floor | Nothing meaningful renders below **13px**. `--text-xs` is 13px, `--text-sm` is 15px, `--text-base` is 17px. |
| Pixel font | **VT323 is only ever used at display sizes.** It has a small cap-height, so a nominal 13px renders like ~8px. A base-layer rule floors `.font-mono` at 17px so it can never be used small again. |
| Small labels | Use the `ui-label` utility — the sans stack at 13px, semibold, wide tracking, uppercase. Never the pixel font. |
| Numerals | Use the `num` utility (`tabular-nums`) so columns of figures line up. |
| Charts | Recharts ticks and legends are 12–13px and set in the sans stack, not the pixel font. |

Two escape hatches if you need to tune it: change the `--text-*` values in the `@theme` block in `src/index.css`, or adjust the `.font-mono` floor in the same file.

## Performance

- Route-level code splitting via `React.lazy`.
- `three.js` and `recharts` are split into their own chunks; the Bloch sphere is lazily mounted.
- Fonts are self-hosted through Fontsource — no third-party font requests.
- The video wall loads nothing from YouTube until clicked.

---

## Licensing

Project code is MIT licensed (see `LICENSE`). Third-party packages are used under their own licences: MIT for React, Vite, Tailwind CSS, Motion, Radix UI, Zustand, Recharts, three.js and react-three-fiber; ISC for `canvas-confetti` and `lucide-react`; OFL for the Fontsource typefaces. The mascot concept and gallery plates are original work created for this project.
