# Science source register

This is a source-finding aid for the group’s science review, not an approval of the site’s explanations. The lecture materials below were supplied by the group. Verify claims in the original slides, record exact slide numbers, and note any changes made to the site.

| Site case | Course material to review | Claims or interactions to check | Group reviewer / exact slides |
|---|---|---|---|
| 01 — Superposition and measurement | Lecture 2, *Entering the Quantum Realm* (`EntersTheQuantum.key.pdf`) | Whether the example distinguishes a superposition from classical uncertainty; what the measurement demo does and does not show; whether its probabilities are correctly described. | Pending |
| 02 — Entanglement and Bell correlations | Lecture 3, *Quantum Spookiness* (`QuantumSpookiness.pdf`); Lecture 4, *Winning Games with Quantum Tricks* (`WinningGames.key.pdf`) | The joint-state and local-outcome descriptions; the no-signalling boundary; the CHSH rules and classical/quantum comparison used by the case and video. | Pending |
| 03 — No-cloning | Lecture 2, *Entering the Quantum Realm* (`EntersTheQuantum.key.pdf`) | The theorem’s scope: arbitrary unknown states cannot be perfectly copied by a universal operation; distinguish this from preparing another copy of a known state. | Pending |

## Additional team-page facts

These links are research aids for the four short quantum facts on the team page. They support a first-pass wording check; they do not establish that every topic was taught in CCST9077. The group should check lecture relevance and revise the language before submission.

| Team member card | Draft claim | Reference to check | Review status |
|---|---|---|---|
| Riyaan | Interference can make some outcomes cancel and others more likely in a quantum algorithm. | [IBM Quantum Learning: Quantum algorithmic foundations](https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/quantum-algorithmic-foundations) | Group review pending |
| Damian | Pure states of a single qubit can be represented on the Bloch sphere; `|0⟩` and `|1⟩` are its poles. | [IBM Quantum Learning: Density matrices and the Bloch sphere](https://learning.quantum.ibm.com/course/general-formulation-of-quantum-information/density-matrices) | Group review pending |
| Markus | Entanglement correlations do not provide faster-than-light messaging. | [Pawłowski et al., “Information causality as a physical principle,” *Nature*](https://www.nature.com/articles/nature08400) | Group review pending |
| Cynthia | No universal operation can perfectly clone every arbitrary unknown quantum state. | [Wootters and Zurek, “A single quantum cannot be cloned,” *Nature*](https://doi.org/10.1038/299802A0) | Group review pending |

## Preliminary AI-assisted cross-check — not group approval

I compared the current case draft and simulator with the supplied text exports on 2026-11-12. These notes identify what the student reviewers should verify; they do not count as the required science review. The exports do not preserve reliable slide numbers, so no slide references are inferred from text line numbers or headings.

| Case | What the supplied course text supports | Review points for the group | Text landmark (slide number still pending) |
|---|---|---|---|
| 01 — Superposition and measurement | Lecture 2 describes definite measurement outcomes, state change on measurement, and a coherent operation before measurement that can distinguish a superposition from a 50/50 classical mixture. | The demo freshly prepares `|+⟩` for each shot. Its Z-basis sample and deterministic X-basis readout illustrate basis-dependent statistics, but do not simulate a measurement followed by a second measurement on the same system. Check that the interface and narration do not imply it does. Confirm how the lecture names the chosen basis and describes the probabilities. | Lecture 2: “An experiment that falsifies Hypothesis 2”; “A magic way of shaking the box”; “State collapse.” |
| 02 — Entanglement and Bell correlations | Lecture 3 describes a Bell state with random local outcomes, correlations between joint outcomes, steering, and why steering cannot be used for faster-than-light communication. The supplied Lecture 4 notes discuss Bell inequalities and name CHSH. | Verify the exact CHSH input distribution, win condition, classical bound, quantum strategy, and probability against the original Lecture 4 slides. The readable notes export does not include the CHSH derivation/rules. Treat the displayed 75% and approximately 85.4% as values to check in that deck. Check that the local simulation is introduced as a game/statistical model, not a spacetime mechanism. | Lecture 3: “Opening the boxes”; “No faster-than-light communication”; Lecture 4 notes: “Bell’s Theorem”; “CHSH.” |
| 03 — No-cloning | Lecture 2 includes the Wootters–Zurek theorem excerpt and identifies linearity as the reason arbitrary unknown states cannot be replicated. | Confirm the demonstration is explicitly a particular copier defined for `|0⟩` and `|1⟩`, not a general physical implementation. Verify its linear output for `|+⟩` against the slide derivation. Keep the distinction between repeating a known preparation and universally copying an unknown input. | Lecture 2: “Can we build a quantum copy machine?”; “The no-cloning theorem.” |

**Required before submission:** a group member should inspect each original PDF, add exact slide numbers, record their name or initials, and note corrections made to the site. The archive remains in draft status until that review is complete.

Before submission, the group should replace each “Pending” entry with reviewer initials or name and the verified slide references. Add external sources only if the group actually uses them, and cite them where the relevant explanation appears.

## Glossary accuracy pass — AI-assisted, group review pending

On 2026-11-12, several inherited glossary statements were narrowed because they implied conscious observation, instant signaling, automatic cryptographic security, or that decoherence removes quantum behavior. The site text was adjusted to distinguish these ideas more carefully. This is a preliminary wording correction, not course approval; the group should confirm lecture fit and technical detail.

| Topic | Primary source to verify | Group review |
|---|---|---|
| No-cloning | [Wootters & Zurek, “A single quantum cannot be cloned,” Nature (1982)](https://doi.org/10.1038/299802A0) | Pending |
| BB84 security framing | [Bennett & Brassard, “Quantum cryptography: Public key distribution and coin tossing” (1984)](https://www.karlin.mff.cuni.cz/~holub/soubory/BB84original.pdf) | Pending |
| Decoherence and interference | [Zurek, “Decoherence, einselection, and the quantum origins of the classical,” Reviews of Modern Physics (2003)](https://doi.org/10.1103/RevModPhys.75.715) | Pending |
| Factoring and discrete logarithms | [Shor, “Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer,” SIAM Journal on Computing (1997)](https://doi.org/10.1137/S0097539795293172) | Pending |
| Unstructured search | [Grover, “A fast quantum mechanical algorithm for database search” (1996)](https://doi.org/10.48550/arXiv.quant-ph/9605043) | Pending |
| Bell inequality testing | [Clauser, Horne, Shimony & Holt, “Proposed Experiment to Test Local Hidden-Variable Theories,” Physical Review Letters (1969)](https://doi.org/10.1103/PhysRevLett.23.880) | Pending |
