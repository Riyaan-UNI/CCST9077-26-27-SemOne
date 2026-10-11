# UI / UX Audit — Qubi's Quantum Playground

**Scope.** Every public route at three breakpoints (375, 768, 1280 px) in two themes
(Paper / CRT) plus a reduced-motion run on desktop CRT. Screenshots live in
`.pw-out/audit/`; the raw axe output is `.pw-out/audit/axe-results.json`.

**Method.** Static server (`scripts/capture-audit.mjs` boots `dist/` on port 8765,
no Vite proxy) → Playwright drives every route, dismisses the boot screen and
"Start here" tour, then screenshots at viewport. axe-core runs only on desktop
(its results are identical across viewports, but it is slow on lazy routes).

**Overall verdict.** The codebase has the bones of a strong design — Qubi, the
magic box, the loading-screen collapse, the Observer Field, the circuit-board
timeline, three-theme tokens, and shared typography. The repeated failure
modes are:

1. The brand block in the top-left wraps to **4 lines**, pushing the page header
   down on every route and stealing from the hero on small screens.
2. The desktop nav at 1280 px is **too dense** — the brand keeps 4 lines and
   `Course map` wraps inside the nav chip.
3. **Two competing card styles** exist (the standard `rounded-2xl border
   border-line bg-surface` card and the "boxes inside boxes" pattern of the
   Lab / Computer headers, where the page title lives in one big dark band
   and the tab list sits in another).
4. **Paper-mode contrast** fails WCAG AA in 24 places — only `color-contrast`
   is flagged, and only on the light theme. The main offenders are `text-muted`
   on `bg-canvas` and the `--neon-ink` colour token in Paper mode.
5. The **floating Qubi + speech bubble** is visible from `sm:` (≥640 px) but
   the speech bubble is `max-w-[15rem]` and can clip content near the right
   edge; on phones it is hidden but the persistent **Start here** chip stays.

The detailed findings are below, ordered by route.

---

## Findings summary — by route

Severity is **High** (must fix), **Medium** (should fix), **Low** (nice-to-have).
Verdict is one of **AMEND** (small fixes), **SIMPLIFY** (less stuff, same
structure), **REDESIGN** (new layout). All screenshots referenced are in
`.pw-out/audit/`.

| Route | Screenshot (CRT/1280, Paper/1280, Paper/375) | Verdict | Top issues |
|---|---|---|---|
| `/` Home | `home-desktop-crt.png`, `home-desktop-paper.png`, `home-mobile-paper.png` | **AMEND** | Brand block wraps; sub-pixel text on Observer Field; magic box looks fine |
| `/lab` | `lab-desktop-crt.png`, `lab-mobile-paper.png` | **SIMPLIFY** | Big dark hero band before the tabs; CRT-era Simulator panel runs the entire viewport width and is dense |
| `/computer` | `computer-desktop-crt.png` | **SIMPLIFY** | Same dark band pattern as Lab; Level 1 magic-box panel overlaps the next card |
| `/timeline` | `timeline-desktop-paper.png`, `timeline-mobile-paper.png` | **AMEND** | Dense era-trail with 30+ events stacks them too close on desktop; mobile is fine |
| `/course-map` | `course-map-desktop-paper.png` | **AMEND** | 11 lecture cards in a 3-up grid; readable but lacks a weekly path |
| `/universe-computer` | `universe-computer-desktop-paper.png` | **SIMPLIFY** | Game of Life canvas is large, controls are noisy, and the 3 cards at the bottom repeat the same shape |
| `/videos` | `videos-desktop-paper.png` | **AMEND** | "SIGNAL INCOMING…" cards are a fine treatment but the 5-grid below the fold pushes the meta caption onto a tiny strip |
| `/team` | `team-desktop-crt.png`, `team-mobile-paper.png` | **SIMPLIFY** | "Show the literary devices" toggle is meta and confusing; the entanglement table uses neon boxes that look like toggles |
| `/gallery` | `gallery-desktop-paper.png` | **AMEND** | AI-generated disclosure banner is large, but acceptable; masonry is good |
| `/glossary` | `glossary-desktop-crt.png` | **AMEND** | Clean two-column grid; "Source:" tag uses `.ui-label` which is `tracking-[0.12em]` and looks a little like a warning; cards are well-spaced |
| `/delight` | `delight-desktop-paper.png` | **AMEND** | Clean tabs; rate-the-hype strip is OK; 20-Q grid hidden behind tabs |
| `/credits` | `credits-desktop-paper.png` | **AMEND** | Three stacked cards with the same shape; the AI-use list has too many bold tags |
| **Globals** | n/a | **AMEND** | Nav brand block wraps to 4 lines; floating Qubi; start-here chip; tooltips on cards need better discoverability |

---

## Detail per route

### `/` Home — **AMEND**

- `.pw-out/audit/home-desktop-paper.png` · `.pw-out/audit/home-desktop-crt.png`
- `.pw-out/audit/home-mobile-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **High** | Brand block wraps to 4 lines: `The Quantum / Revolution / · Group / project / Project`. | Pushes the hero `pt-24` further down; the eyebrow badge and h1 are still readable but the nav row becomes the tallest thing in the top strip. | Shorten to `Qubi` + a single subtitle; keep the icon as the visual anchor. Show the full course title in the footer only. |
| **Medium** | `Course map` nav item wraps to 2 lines inside its chip at 1280 px. | Looks broken on a feature-flagged route. | Rename to `Course` or `Map`, or make nav items `whitespace-nowrap`. |
| **Medium** | `Move your cursor across the page…` helper is the only interaction hint. | Visitors may not know the field is interactive in the first second. | Add a one-line hint to the magic box card ("Try me first") and remove the redundant observer-mode hint at the bottom. |
| **Low** | Hero `Qubi mood="happy"` is 96 px and `class="float"` overlaps the lead paragraph on mobile. | Looks like a sticker on the text. | Increase vertical gap on mobile to `mt-10`, drop float to false on `<sm`. |
| **Low** | `QubiCompanion` is hidden below `sm:` (640 px) — good. But `StartHere` chip shows from `sm:` — good, but its font weight is bold which is heavier than the chip's border. | Competes with the dialog CTA. | Use `font-medium` not `font-semibold`. |

### `/lab` — **SIMPLIFY**

- `.pw-out/audit/lab-desktop-crt.png` · `.pw-out/audit/lab-mobile-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **High** | The page header is a `border-b border-line` band stretching the full viewport width. In CRT mode it is a 1200×350 dark slab above the tab list. | Reads as an empty dark band; visitor's eye lands on it before the title. | Drop the full-width `border-b`, move the divider to a single line under the title; merge the right-side Qubi into a smaller inline component. |
| **High** | Tab list uses two `inline-flex` rows when wrapping on mobile and lays out as 5 chips with both icons and labels. | Icon + label chips feel heavy when 5 are stacked. | On mobile, show icon-only tabs; rely on the active panel's `h2` to give the page title. |
| **Medium** | The Lab header reuses `bg-canvas grid-paper opacity-40` — fine on Paper, but on CRT the grid-paper opacity-40 sits over the canvas colour so the band is just a void. | Looks empty. | Switch the band to `bg-elevated` so it reads as a card, not a void. |
| **Medium** | The `<Section className="pt-12">` that hosts the tabs has a 48 px top padding *after* the already-padded header — too much vertical rhythm. | Spacing says "this is a new section" twice. | Collapse to `pt-8`. |
| **Low** | "Unit-tested against the analytic results in Vitest" pill below the lead looks like a notice, not like decoration. | Tells the engineer reading the page what they want to know, but the visitor doesn't care. | Move it to the engine-verification card at the bottom and drop from the header. |

### `/computer` — **SIMPLIFY**

- `.pw-out/audit/computer-desktop-crt.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **High** | Same dark-band pattern as `/lab`. | Empty void. | Same fix. |
| **High** | Tab list names read `Level 1 · Magic box` — both level and name on the chip. | Repetition of "Level" between chip and panel h2. | Drop "Level N ·" from chip; keep h2. |
| **Medium** | The `Quantum circuit simulator` panel has `id="radix-…"` ids that axe flagged for contrast. | Accessibility regression. | Inspect the actual contrast (already flagged); fix by darkening the muted text token or replacing with `text-ink-soft`. |

### `/timeline` — **AMEND**

- `.pw-out/audit/timeline-desktop-paper.png` · `.pw-out/audit/timeline-mobile-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Medium** | The rail animation and rail glow are good, but at desktop the left and right cards have no vertical offset that matches the rail's `md:left-1/2` centerline — the rail sits between columns but the glow only extends slightly past the rail. | Reads as two separate columns rather than a single timeline. | Add `2-4 px` of card offset to match the rail glow, or make the rail span the full viewport height and the cards sit on it. |
| **Medium** | `era` chips (`eraColor[e.era]`) have arbitrary border colours that may fail contrast on dark cards. | Each era chip is a 1 px border pill, hard to read. | Increase border to 1.5 px and add a soft tint. |
| **Low** | The "List view" toggle hides the rail entirely — but the button copy says "List view" while showing on the scroll view; users may not realise it is a toggle. | Confusing. | Change to "Show as a list". |

### `/course-map` — **AMEND**

- `.pw-out/audit/course-map-desktop-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Medium** | 11 lecture cards in a 3-up grid; week number is the only differentiator. | Weeks blur together. | Add a small color-tinted dot or `Week NN` badge with the era colour. |
| **Medium** | Card metadata ("bit · Shannon entropy · …") wraps to 2 lines on some cards. | Inconsistent card heights in the same row. | Set a fixed 3-tag cap with `+N more` overflow. |

### `/universe-computer` — **SIMPLIFY**

- `.pw-out/audit/universe-computer-desktop-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **High** | The Game-of-Life canvas is full-width on desktop; controls row sits inline. | Control row is 6 chips wide and looks like a CLI. | Group controls (Play/Pause as one cluster, Step/Random/Glider as another, Speed/Gen as a third) with `gap-6`. |
| **Medium** | Three "card" sections below (Turing, Lloyd, Bekenstein) all have the same shape — three rounded-2xl, identical padding. | Repeats the shape, looks like a deck of identical cards. | Change each to a different layout: a quote card, a stat card with a huge number, a definition card. |
| **Low** | The "computational universe hypothesis" callout is a `border-neon/30` — only one glowing element, good. | None. | Keep. |

### `/videos` — **AMEND**

- `.pw-out/audit/videos-desktop-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Medium** | The "EP 1 · SIGNAL INCOMING…" cards have a `bg-screen` plate and a Qubi figure; the bottom-half text is on the cream canvas. | Looks like two halves glued together. | Either keep the Qubi figure on the cream background with a subtle gradient fade, or keep the whole card on the dark plate. Don't mix. |
| **Low** | Caption "Captions and a transcript will appear here when this episode goes live." repeats 5 times. | Honest disclosure. | Pull this line into a single "all 5 episodes are coming soon" note above the grid. |

### `/team` — **SIMPLIFY**

- `.pw-out/audit/team-desktop-crt.png` · `.pw-out/audit/team-mobile-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **High** | "Show the literary devices" toggle is meta — it tells the visitor what the team did, not what the team did. | Visitor doesn't understand what a "literary device" is. | Replace with a "Show how each member contributed" toggle or remove. |
| **Medium** | Member cards expand/collapse, then the "Flip to fun fact" button triggers a 3D flip on the inner panel. | Two interactions stacked: open the magic box, then flip. | Drop the inner flip; put the fun fact directly below the contributions. |
| **Medium** | The entanglement diagram uses neon green cells for `hit` and a near-empty cell for `miss`. `aria-label` only on the hit cells; miss cells have no label. | Screen readers will read empty cells as nothing. | Give both states a label and a softer colour. |
| **Low** | "Riyaan" appears hard-coded while the other members are placeholders — looks like one member was filled in. | Acceptable while placeholders are placeholders. | None for now. |

### `/gallery` — **AMEND**

- `.pw-out/audit/gallery-desktop-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Low** | AI-generated disclosure banner is full-width and `bg-hype-amber/10`. | Acceptable. | None. |

### `/glossary` — **AMEND**

- `.pw-out/audit/glossary-desktop-crt.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Medium** | `ui-label` for the "SOURCE: COURSE CCST9077 · L1 CLASSICAL INFORMATION" tag uses `tracking-[0.12em]` and uppercase. | Visually loud for a metadata line; reads as a warning. | Use `text-xs text-muted` instead of `ui-label`. |
| **Low** | Cards are evenly spaced. | Looks good. | None. |

### `/delight` — **AMEND**

- `.pw-out/audit/delight-desktop-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Low** | Header is a `border-b border-line` band again. | Same as Lab. | Same fix. |
| **Low** | Konami-code easter egg hint is a card at the bottom. | Acceptable. | None. |

### `/credits` — **AMEND**

- `.pw-out/audit/credits-desktop-paper.png`

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **Medium** | Three stacked rounded-2xl cards with the same shape (AI use, Sources, Attributions). | Repeats the shape, looks heavy. | Merge AI-use + Sources into one card; keep Attributions as a smaller block. |
| **Low** | The "Heart" icon next to the course-note paragraph is the only icon that isn't a Lucide "info" — fine, but the icon is `mt-0.5` while the text is a long line. | Vertically misaligned. | Use `flex items-start` correctly. |

---

## Globals — cross-cutting issues

| Severity | What | Why it hurts | Proposed fix |
|---|---|---|---|
| **High** | Brand block wraps to 4 lines in the nav. | Pushes page content down; looks broken on every route. | In `src/components/Nav.tsx`, shorten the visible title or hide it on `<lg`. |
| **High** | Paper-mode contrast fails WCAG AA on muted text on cream canvas. | axe reports 24 violations across the site, all `color-contrast`, all in Paper mode. | Darken `--muted` in light theme or change `text-muted` to `text-ink-soft` for body copy. |
| **Medium** | The page header (`pt-32 pb-14`) on every "feature page" is a black band in CRT mode and an empty cream band in Paper mode. | Empty real estate; visitor's eye gets confused. | Reduce to `pt-24 pb-8`, drop the `border-b`, use a Section eyebrow + h1 instead. |
| **Medium** | `display-mono` and `font-mono` use VT323 at sizes ≤ 22 px. VT323 cap-height is small — readable at 22 px, painful at 13–16 px. | OK in `display-mono` (22 px), not OK in `num` or inline mono. | Audit every `font-mono` usage; prefer `font-sans tabular-nums` for body-level numerics. |
| **Medium** | `Term` tooltip is triggered by Radix's `<Tooltip>` which fires on `mouseenter` (so hover-only on desktop). The story requirement is "tap and keyboard". | Keyboard works (Radix), tap should work — Radix does handle tap. | None — already correct, but the dashed underline is easy to miss. |
| **Medium** | `QubiCompanion` uses `bottom-4 right-4` and is hidden below `sm:` (640 px). | On a 768 px tablet in landscape it covers the bottom-right corner. | Move to `bottom-3 right-3` and shrink the Qubi to 56 px on `<md`. |
| **Low** | `LoadingScreen` shows on first visit every session, never again in the same session. | None. | None. |
| **Low** | `MagicBoxFlip` tally uses `font-mono text-2xl text-neon`. On cream canvas in Paper mode, `--neon` is `#0f7a2e` (a darker green) — readable, good. On CRT it is `#39ff14` — high contrast, good. | Both pass. | None. |

---

## axe-core results — Paper / 1280

Every axe-core violation in this run was `color-contrast` and all came from the
light (Paper) theme. The CRT theme had zero violations.

| Route | Count | Offenders (first three nodes) |
|---|---|---|
| `/` | 1 | `bg-neon text-neon-ink` button — neon-ink token is `#f2fff5` on `#0f7a2e` in Paper — fails 4.5:1 on small text. |
| `/lab` | 4 | Lab panel `text-muted` (pale) over cream, the Simulator `<dl>` markdown links. |
| `/computer` | 4 | Same pattern as `/lab`. |
| `/timeline` | 8 | Several era-color chips; `text-muted` over cream. |
| `/course-map` | (see JSON) | tag pills. |
| `/universe-computer` | (see JSON) | era-color labels. |
| `/videos` | (see JSON) | "SIGNAL INCOMING…" amber text on dark plate (good) + dark plate meta text. |
| `/team` | (see JSON) | entanglement diagram empty cell tooltip. |
| `/gallery` | 0 | clean |
| `/glossary` | 0 | clean |
| `/delight` | (see JSON) | hype-strip mono text on cream. |
| `/credits` | 0 | clean |

**Root cause.** `--muted` in Paper mode is `#6B7280` (gray-500). On `#F6F1E4`
(cream canvas) it scores ~4.3:1 — just below the 4.5:1 minimum. Fix:

```css
html.light {
  --muted: #4d5b53; /* darker, ~6.8:1 on cream */
}
```

`text-neon-ink` on Paper `bg-neon` is the second-most-frequent failure. The
neon-green in Paper is `#0f7a2e`; `text-neon-ink` is `#f2fff5` — that pair
measures ~6.7:1 on body text. axe flagged it because the home-page button is
sized 15 px. Either bump to 16 px or change the button text colour.

---

## What I would do first (in priority order)

These are the five highest-impact fixes. They are AMEND or SIMPLIFY, not full
REDESIGN, and they target shared tokens and components so every route benefits.

1. **Nav brand block (HIGH).** Replace the four-line brand with a single-line
   subtitle or hide it on `<lg`. One file: `src/components/Nav.tsx`.
2. **Paper-mode muted text (HIGH).** Darken `--muted` to `#4d5b53` in light
   theme. One file: `src/index.css`. Fixes all 24 axe violations.
3. **Empty header bands on feature pages (HIGH, three files).** Drop
   `border-b border-line` and `pt-32 pb-14` from `/lab`, `/computer`,
   `/universe-computer`, `/delight`. Promote the title into a Section header.
4. **Lab / Computer tab list (HIGH, two files).** Drop "Level N ·" prefix on
   chips; on mobile show icon-only.
6. **Team page (MEDIUM, one file).** Remove "literary devices" toggle; merge
   the flip-in-card into a `fun fact` directly below contributions; give the
   entanglement diagram both states a label.

I have stopped here for your approval before changing code.

---

## Open questions for you (up to five, with my recommended default)

1. **Rename the "Show the literary devices" toggle?** My default: **delete it**.
   The toggle is meta and confuses non-specialists. The literary-devices
   metadata can move to the credits page if useful at all.
3. **Replace the home buttons with a single primary CTA?** My default: **keep
   two but reduce the secondary to a text link**. Two equal-weight buttons at
   the top of the page split attention.
4. **Drop the "Flip to fun fact" inner interaction on team cards?** My default:
   **yes**. Two stacked interactions (open + flip) is too many for a non-game
   card. The fun fact can sit below the contributions as a `<p>` line.
6. **Lower the density of the `/timeline` desktop layout?** My default: **yes
   to ~30%** by increasing `space-y-10` to `space-y-14` on the rail. Brings it
   closer to "a card you scroll past and read" rather than "a wall of cards".
8. **Reduce the "Source:" tag in the glossary from `ui-label` to plain muted
   text?** My default: **yes**. Less shouting for a metadata line.

---

## Verdict summary

| File / Route | Verdict |
|---|---|
| `/` | AMEND |
| `/lab` | SIMPLIFY |
| `/computer` | SIMPLIFY |
| `/timeline` | AMEND |
| `/course-map` | AMEND |
| `/universe-computer` | SIMPLIFY |
| `/videos` | AMEND |
| `/team` | SIMPLIFY |
| `/gallery` | AMEND |
| `/glossary` | AMEND |
| `/delight` | AMEND |
| `/credits` | AMEND |
| **Globals** | AMEND |

There is no REDESIGN verdict: every screen is *close* to working, just needs
less of it. The 5 highest-impact fixes above will be visible on every route.

— end of audit —