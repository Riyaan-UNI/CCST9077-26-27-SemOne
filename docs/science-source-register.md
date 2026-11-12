# Science source register

This is a source-finding aid for the group’s science review, not an approval of the site’s explanations. The lecture materials below were supplied by the group. Verify claims in the original slides, record exact slide numbers, and note any changes made to the site.

| Site case | Course material to review | Claims or interactions to check | Group reviewer / exact slides |
|---|---|---|---|
| 01 — Superposition and measurement | Lecture 2, *Entering the Quantum Realm* (`EntersTheQuantum.key.pdf`) | Whether the example distinguishes a superposition from classical uncertainty; what the measurement demo does and does not show; whether its probabilities are correctly described. | Pending |
| 02 — Entanglement and Bell correlations | Lecture 3, *Quantum Spookiness* (`QuantumSpookiness.pdf`); Lecture 4, *Winning Games with Quantum Tricks* (`WinningGames.key.pdf`) | The joint-state and local-outcome descriptions; the no-signalling boundary; the CHSH rules and classical/quantum comparison used by the case and video. | Pending |
| 03 — No-cloning | Lecture 2, *Entering the Quantum Realm* (`EntersTheQuantum.key.pdf`) | The theorem’s scope: arbitrary unknown states cannot be perfectly copied by a universal operation; distinguish this from preparing another copy of a known state. | Pending |

## Preliminary AI-assisted cross-check — not group approval

I compared the current case draft and simulator with the supplied text exports on 2026-11-12. These notes identify what the student reviewers should verify; they do not count as the required science review. The exports do not preserve reliable slide numbers, so no slide references are inferred from text line numbers or headings.

| Case | What the supplied course text supports | Review points for the group | Text landmark (slide number still pending) |
|---|---|---|---|
| 01 — Superposition and measurement | Lecture 2 describes definite measurement outcomes, state change on measurement, and a coherent operation before measurement that can distinguish a superposition from a 50/50 classical mixture. | The demo freshly prepares `|+⟩` for each shot. Its Z-basis sample and deterministic X-basis readout illustrate basis-dependent statistics, but do not simulate a measurement followed by a second measurement on the same system. Check that the interface and narration do not imply it does. Confirm how the lecture names the chosen basis and describes the probabilities. | Lecture 2: “An experiment that falsifies Hypothesis 2”; “A magic way of shaking the box”; “State collapse.” |
| 02 — Entanglement and Bell correlations | Lecture 3 describes a Bell state with random local outcomes, correlations between joint outcomes, steering, and why steering cannot be used for faster-than-light communication. The supplied Lecture 4 notes discuss Bell inequalities and name CHSH. | Verify the exact CHSH input distribution, win condition, classical bound, quantum strategy, and probability against the original Lecture 4 slides. The readable notes export does not include the CHSH derivation/rules. Treat the displayed 75% and approximately 85.4% as values to check in that deck. Check that the local simulation is introduced as a game/statistical model, not a spacetime mechanism. | Lecture 3: “Opening the boxes”; “No faster-than-light communication”; Lecture 4 notes: “Bell’s Theorem”; “CHSH.” |
| 03 — No-cloning | Lecture 2 includes the Wootters–Zurek theorem excerpt and identifies linearity as the reason arbitrary unknown states cannot be replicated. | Confirm the demonstration is explicitly a particular copier defined for `|0⟩` and `|1⟩`, not a general physical implementation. Verify its linear output for `|+⟩` against the slide derivation. Keep the distinction between repeating a known preparation and universally copying an unknown input. | Lecture 2: “Can we build a quantum copy machine?”; “The no-cloning theorem.” |

**Required before submission:** a group member should inspect each original PDF, add exact slide numbers, record their name or initials, and note corrections made to the site. The archive remains in draft status until that review is complete.

Before submission, the group should replace each “Pending” entry with reviewer initials or name and the verified slide references. Add external sources only if the group actually uses them, and cite them where the relevant explanation appears.
