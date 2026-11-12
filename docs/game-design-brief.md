# Game Design Brief: Quantum Lost-and-Found Bureau

**Project:** CCST9077 website (React + TypeScript + Vite)
**Branch:** `concept/quantum-bureau-field-journal`
**Status:** AI-assisted working draft; not final group-authored copy or science approval.

> **Decision precedence:** This document began as an AI-assisted design draft and
> contains outdated suggestions. Use `docs/human-decisions-log.md` and
> `docs/copilot-project-prompt.md` for the group's recorded selections. In
> particular, the selected identity is **Registrar’s Field Journal**, the site
> has three published videos and one forthcoming slot, and the case conference
> compares the three investigations rather than being a fourth case. The linked
> Public Record Figma file is historical and has not been updated. Do not treat
> generated implementation or copy as student-authored final work. The group
> must make substantial creative contributions, rewrite draft content, verify
> science against original lectures, and disclose AI assistance accurately.

This draft is retained as planning history. It is not an instruction to have AI
write the complete assessed product or implement every unreviewed suggestion
below. When it conflicts with a recorded group decision or source-verified
content, the recorded decision and verified content take precedence.

---

## 1. Concept

You are a new Registrar at a public archive, the Bureau of Lost Information. Four case files have arrived. Each is a video episode about information that seems to have gone missing. For each case you **predict, test, and file a finding**. The archive rewards good work with **declassification**: sealed AI artworks become visible on the Gallery Wall.

**The main showpieces are the 4 videos and the AI-generated artworks.** The game layer exists to present them, not to compete with them.

**Linked limits on information (course throughline):**
1. Measurement and what can be known.
2. Entanglement correlations without controllable faster-than-light messaging.
3. The no-cloning theorem.

**Episode mapping (confirm):**

| Case | Topic | Video |
|---|---|---|
| 01 | Superposition and measurement | Episode 1 |
| 02 | Entanglement, Bell correlations, no-message boundary | Episode 2 |
| 03 | No-cloning | Episode 3 |
| 04 | Case Conference (comparing all three findings) | Episode 4 (forthcoming) |

> **TEAM TO CONFIRM:** the topic and status of Episode 4, and the final episode titles.

---

## 2. Aesthetic direction

- **Identity:** "Public Record". Public-archive graphics, documentary dividers, case numbers, clear typography.
- **Colour:** dark mode is the default, with a light-mode option. Signal-orange marks unfinished business. Ultramarine marks confirmed knowledge.
- **Diegetic elements (the game feel):** stamps, folders, redaction bars, index cards, the ledger, Qubi as the counter clerk.
- **Plain elements (never decorated):** video controls, captions, transcript, Observer Mode toggle, theme switch.
- **Metaphor rule:** every science metaphor carries a small visible "Metaphor" label. Example: "Sealed file = superposition (a metaphor, not physics)". The site must never imply that conscious observation causes measurement, or that entanglement sends messages.

### Benchmarks (what we borrow)

| Game | Idea we borrow | How we use it |
|---|---|---|
| Outer Wilds | Progress is knowledge, shown as a graph with markers for unfinished clues | Case Board with orange "unresolved" markers. No XP or stats |
| Return of the Obra Dinn | Deductions confirmed together, not one at a time | Predictions are compared with findings together at the end of a case |
| Her Story | One simple input that reveals depth over time | Optional transcript search across the videos |

---

## 3. Screen flow

Title / Public Registry, then Welcome (skippable), then Case Board (hub), then Case File, then Episode Viewer, then Stamp Check, then Finding, then Gallery Wall, then Ledger, then Case Conference (endgame).

| Screen | Purpose | Key rules |
|---|---|---|
| Title / Public Registry | Landing section, then videos right after | One main button, "Open the archive". Small link "Read without playing" enters Observer Mode |
| Welcome | Qubi's guided tour | Skippable at every step. Test length with first-time visitors |
| Case Board | Hub with 4 folders joined by strings | Locked folders are dimmed and readable, never hidden. Each shows a one-line reason and a "Read anyway" link |
| Case File | Prediction, Test and Finding tabs plus the video | Finding can always be read directly. Test can be skipped |
| Episode Viewer | Video, transcript and notes | Player loads only on selection. No pop-ups over the video |
| Stamp Check | 3-4 short questions after a video | Never blocking. No penalties. Retry allowed |
| Finding | Prediction and finding side by side | Records the comparison in the Ledger |
| Gallery Wall | All artwork plates, sealed or declassified | Each plate has alt text. Sealed plates show the unlock condition |
| Ledger | Predictions, confidence and findings across cases | Local browser storage, no backend |
| Case Conference | Endgame comparison across all findings | Readable at any time, with the full comparison shown once the other findings are read |

### HUD during the Episode Viewer
- Video is central and largest.
- Thin top bar: case number, progress marker, Observer toggle.
- Transcript and notes in a side panel on desktop. Collapsed drawer on mobile.
- Checkpoint prompts appear beside the video, never on top of it.
- Audio is optional and off by default: one soft stamp sound, one paper-slide sound, nothing else.

### Wireframes

**Case Board (desktop, 768px and wider)**
```
+----------------------------------------------------------+
| BUREAU OF LOST INFORMATION     [Ledger] [Gallery] [Observer]|
+----------------------------------------------------------+
|                                                          |
|   [CASE 01]----red string----[CASE 02]                   |
|   Measurement  *             Entanglement                |
|        \                       /                         |
|         \                     /                          |
|          +---[CASE 03]-------+                            |
|            No-cloning (sealed)                           |
|                    |                                     |
|              [CASE 04: Conference]  (locked, readable)   |
|                                                          |
|  * orange = unresolved     blue = filed                  |
|  Qubi: "Pick any file. Order is a suggestion."           |
+----------------------------------------------------------+
```

**Case File / Episode (desktop)**
```
+----------------------------------------------------------+
| < Board   CASE 02 · Entanglement      [Read finding] [Obs.]|
+----------------------------------------------------------+
| [1 PREDICT]  [2 TEST]  [3 FINDING]      confidence: o---|
+--------------------------------+-------------------------+
|                                | Transcript / Notes      |
|        EPISODE VIDEO           | - searchable text       |
|                                | - captions on           |
|                                |                         |
+--------------------------------+-------------------------+
| [ Stamp check: 3 questions ]   Plate unlocks: ▒▒▒ sealed  |
+----------------------------------------------------------+
```

**Gallery Wall (mobile collapses to a vertical list below 768px)**
```
+------------------------------------------+
| THE PUBLIC RECORD        plates: 2 / N   |
+------------------------------------------+
| [ART 01 declassified]  [ART 02 ████ ]    |
| "Plate 01 · Case 01"   sealed by Case 02 |
|                                          |
| [ART 03 ████ ]         [ART 04 ████ ]    |
|  tap a sealed plate -> shows how to open |
+------------------------------------------+
```
Redaction bars are decorative. Screen readers announce the plate's unlock condition, not the hidden artwork.

---

## 4. Actions and feedback

| Action | Trigger | Visual response | Optional sound | Outcome |
|---|---|---|---|---|
| Open a case | Click or tap a folder | Folder lifts and slides open | paper slide | Case File opens; status = opened |
| Make a prediction | Choose an answer and set confidence | Sealed-envelope stamp closes over it | soft stamp | Locked into the Ledger |
| Run a test | Use the interactive test | Trial counter ticks up, results fill in | tick | Evidence added to the case |
| Skip the test | "Read finding" button | Folder flips straight to Finding | none | Finding visible, marked "read without testing" |
| Watch an episode | Select the video | Progress marker advances beside the player | none | Episode = watched |
| Stamp check | Answer 3-4 questions | Correct answers stamp in blue. Wrong ones show the explanation, no penalty | stamp | Unlocks a plate, even after a retry |
| Read the finding | Open Finding tab | Seal opens; prediction and finding appear side by side | envelope open | Comparison recorded in the Ledger |
| Unlock a plate | Meet its condition | Redaction bars lift | soft whoosh | Artwork joins the Gallery Wall |
| Visit the Ledger | Header link | Table of predictions, confidence, findings | none | Review |
| Toggle Observer Mode | Header toggle, always visible | All game chrome hides | none | Everything unlocked, plain reading path |

### Confusion points and fixes
- **"Do I have to go in order?"** No. Locked items give a one-line reason and a "Read anyway" link.
- **"Is this science or a metaphor?"** Metaphor label (see section 2).
- **"What counts as progress?"** A tooltip on each orange marker says what is left.
- **"Did a wrong answer hurt me?"** No penalties. Show the explanation and allow retry.
- **No drag-only interactions.** Everything works by tap or keyboard.

---

## 5. Progression

- **Micro-loop (minutes):** predict, test, see a result, stamp. Feedback in under a second.
- **Meso-loop (a session):** finish one case (watch, test, finding, stamp check). Earn a plate. A string on the board turns from orange to blue. About 15-20 minutes per case.
- **Macro-loop (whole experience):** the board fills in, the three limits link up, the Gallery Wall fills, and the Case Conference compares predictions with findings. Progress means what you understand, not points.

---

## 6. Signature features

1. **The Sealed Prediction.** Before each test, commit a prediction and a confidence level in a stamped envelope. At the Finding it opens beside the result. The Ledger shows how well confidence matched reality.
2. **Declassification of the Plates.** Each AI artwork starts under redaction bars that lift as the visitor progresses, so the art feels earned and sits at the centre of the site.
3. **The Red String.** Strings between the three limits on the Case Board light up only once both linked findings are read. It is a knowledge graph in the style of Outer Wilds. It must carry the Metaphor label, because nothing travels between cases.

---

## 7. Rules for implementation (Codex)

- Animate only `transform` and `opacity`. Reserve space so there is no layout shift.
- Respect `prefers-reduced-motion`: no animation, instant state changes.
- WCAG AA contrast in dark and light themes.
- Keyboard and touch operable. No drag-only controls. Alt text on every artwork.
- No canvas or WebGL on video or case routes.
- Observer Mode hides all game UI, unlocks everything, and leaves every page fully usable.
- Board collapses to a vertical list below 768px. Test at 320, 375, 414, 768, 1280 and 1440 CSS px.
- Do not modify existing routes, video players or the simulator beyond importing the new layer.
- Video players load only on selection.
- Progress is stored in local browser storage inside try/catch, with an empty-state fallback. No backend.

---

## 8. Content and accuracy

- AI may write the quiz questions. Each question records its source lecture and a review status (`needs-review` or `reviewed`).
- The team must check every question and explanation against the original lecture PDFs before release, especially CHSH values and what no-cloning does and does not forbid.
- Log each check (reviewer, slide number, fix) in `docs/science-source-register.md`.
- Artworks are supplied by the team. Codex must not generate images.

---

## 9. Team decisions needed

- [ ] Episode 4 topic, title and release status.
- [ ] Final titles for all four episodes.
- [ ] List of artworks: file names, titles, alt text, and which case unlocks each.
- [ ] Whether to include optional sound at all.
- [ ] Whether transcripts and captions exist for every video (needed for transcript search and accessibility).
- [ ] Rewrite sections 1-6 in the team's own voice.
- [ ] Confirm Qubi's role and credit between Riyaan and Damian.
