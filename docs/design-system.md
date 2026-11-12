# Registrar’s Field Journal design guide

This guide documents the implemented website design in the repository. It replaces a separate design-file handoff and points to responsive screenshots captured from the running site.

## Visual direction

- **Identity:** a working scientific field journal inside the Quantum Lost-and-Found Bureau.
- **Page language:** notebook rules, margin markers, specimen tabs, file numbers, and occasional handwritten annotations make the archive feel authored. Keep explanatory paragraphs and media controls plain and readable.
- **Color roles:** midnight charcoal is the default surface; warm orange marks actions and unresolved records; mineral blue marks labels and information; lime is reserved for success signals.
- **Composition:** lead with the Bureau’s three linked information limits, then the three published videos, then their investigations and shared evidence ledger. Supporting activities remain available from the main navigation.

## Typography

| Role | Typeface | Use |
| --- | --- | --- |
| Reading and primary headings | Inter | Body copy, buttons, accessible labels, and large page titles |
| Instrument labels | VT323 | Case numbers, metadata, and compact archive markers |
| Handwritten annotations | Caveat | Qubi notes and selected journal headings; never long passages |

## Theme tokens

Dark mode is the first-visit default. The light theme uses the same semantic roles.

| CSS token | Dark | Light | Role |
| --- | --- | --- | --- |
| `--canvas` | `#14171c` | `#f5f6f8` | Page background |
| `--surface` | `#1d232b` | `#ffffff` | Main panels |
| `--elevated` | `#282f38` | `#edf0f4` | Nested surfaces and hover states |
| `--ink` | `#f5f6f8` | `#171c23` | Primary text |
| `--ink-soft` | `#d8dde3` | `#36414e` | Secondary text |
| `--muted` | `#adb6c1` | `#536170` | Tertiary text and metadata |
| `--neon` | `#ff8756` | `#a83a0c` | Primary action and alert accent |
| `--cyan` | `#9bacff` | `#2946c7` | Information accent |
| `--green-signal` | `#c5ed7a` | `#486b00` | Positive progress |

The source of truth for colors and spacing is [`src/index.css`](../src/index.css), not this table. Check contrast after any theme-token change.

## Responsive behavior

- At phone widths, content stacks into a readable single column. Navigation opens as a scrollable panel, including on short screens.
- Tablet and desktop layouts use wider columns for the landing introduction and visitor route; they collapse before the content becomes cramped.
- Video players retain a 16:9 ratio. The evidence ledger scrolls within its own horizontal region when a wide comparison table cannot fit.
- Responsive checks run at 320, 375, 414, 768, 1280, and 1440 CSS pixels. They verify no unintended page-level horizontal overflow.

## Interaction and motion

- The home path is **Watch → Investigate → Compare**: the landing section comes first, followed immediately by the team videos.
- Case pages use **Prediction → Test → Finding**, with a direct reading path.
- A sealed gallery plate opens its related video and three-question check. Passing opens the file and returns the visitor to the selected plate.
- The video overlay leaves the surrounding page usable and closes with Escape or its visible close button.
- Dark mode, keyboard operation, visible focus, text labels, and reduced-motion handling are part of the interface. Sound is opt-in.

## Responsive screen captures

These screenshots were captured from the current implementation during the 177-test browser run. They are review evidence, not finished student artwork.

| Viewport | Capture |
| --- | --- |
| Phone · 320 × 568 | [Home at 320 px](design-previews/home-phone-320.png) |
| Tablet · 768 × 1024 | [Home at 768 px](design-previews/home-tablet-768.png) |
| Wide desktop · 1440 × 900 | [Home at 1440 px](design-previews/home-wide-1440.png) |

## Separate checks

The user reports that the group reviewed the current science explanations for accuracy. Video caption/transcript availability, a first-time visitor review, and a full accessibility review are separate checks that still need evidence. See [`science-source-register.md`](science-source-register.md), [`human-decisions-log.md`](human-decisions-log.md), and [`rubric-traceability-matrix.md`](rubric-traceability-matrix.md).
