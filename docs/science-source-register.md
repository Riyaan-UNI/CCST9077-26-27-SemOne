# Science source register

The team reports that it reviewed the current case explanations, activities, quiz questions, and team quantum facts for accuracy against the supplied course material. Reviewer names and exact slide numbers were not provided, so this register does not invent them. The references below preserve the lecture connections and sources used for the current wording.

## Case and lecture connections

| Site case | Course materials | Reviewed topics |
|---|---|---|
| 01 — Superposition and measurement | Lecture 2, *Entering the Quantum Realm* (`EntersTheQuantum.key.pdf`) | Distinguishing superposition from classical uncertainty; measurement outcomes and probabilities; the model’s limit of preparing a fresh state on each shot. |
| 02 — Entanglement and Bell correlations | Lecture 3, *Quantum Spookiness* (`QuantumSpookiness.pdf`); Lecture 4, *Winning Games with Quantum Tricks* (`WinningGames.key.pdf`) | Joint states and local results; no signalling; CHSH conditions and comparison of classical and quantum strategies. |
| 03 — No-cloning | Lecture 2, *Entering the Quantum Realm* (`EntersTheQuantum.key.pdf`) | Scope of the theorem: no universal operation can perfectly clone arbitrary unknown states; known preparations can be prepared again. |

## Team-page facts

Each team fact links to a source for readers who want to explore further. The team reports reviewing the wording for accuracy.

| Member | Fact | Reference |
|---|---|---|
| Riyaan | Interference can make some outcomes cancel while others become more likely in a quantum algorithm. | [IBM Quantum Learning: Quantum algorithmic foundations](https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/quantum-algorithmic-foundations) |
| Damian | A pure single-qubit state can be represented on the Bloch sphere; `|0⟩` and `|1⟩` are its poles. | [IBM Quantum Learning: Density matrices and the Bloch sphere](https://learning.quantum.ibm.com/course/general-formulation-of-quantum-information/density-matrices) |
| Markus | Entanglement correlations do not provide faster-than-light messaging. | [Pawłowski et al., “Information causality as a physical principle,” *Nature*](https://www.nature.com/articles/nature08400) |
| Cynthia | No universal operation can perfectly clone every arbitrary unknown quantum state. | [Wootters and Zurek, “A single quantum cannot be cloned,” *Nature*](https://doi.org/10.1038/299802A0) |

## AI-assisted course cross-check notes

These notes preserve the specific scope checks used while reviewing the current implementation. The team reports that the explanations below were checked for accuracy; the notes are not a substitute for the supplied lecture materials.

| Case | Course support and implementation boundary |
|---|---|
| 01 — Superposition and measurement | Lecture 2 describes definite measurement outcomes, state change on measurement, and an operation that distinguishes a coherent superposition from a 50/50 classical mixture. The demo prepares `|+⟩` anew for each shot: Z-basis samples are probabilistic and X-basis readout is deterministic in the ideal model. It does not model measuring the same system twice. |
| 02 — Entanglement and Bell correlations | Lecture 3 describes Bell-state correlations, unpredictable local results, and the no-signalling boundary; Lecture 4 covers Bell inequalities and CHSH. The comparison shown is a statistical game model, not a signal traveling between players. The team reports checking the displayed 75% classical and approximately 85.4% ideal quantum values against the course material. |
| 03 — No-cloning | Lecture 2 includes the Wootters–Zurek result and linearity argument. The interactive copier is a pedagogical example of a rule that copies basis states but fails for a superposition; it is not a proposed universal physical device. |

## Sources for the glossary accuracy pass

The glossary wording was narrowed to avoid implying conscious observation, controllable faster-than-light signalling, automatic QKD security, or that decoherence removes quantum behavior. The team reports checking the revised wording for accuracy.

| Topic | Source |
|---|---|
| No-cloning | [Wootters & Zurek, “A single quantum cannot be cloned,” *Nature* (1982)](https://doi.org/10.1038/299802A0) |
| BB84 security framing | [Bennett & Brassard, “Quantum cryptography: Public key distribution and coin tossing” (1984)](https://www.karlin.mff.cuni.cz/~holub/soubory/BB84original.pdf) |
| Decoherence and interference | [Zurek, “Decoherence, einselection, and the quantum origins of the classical,” *Reviews of Modern Physics* (2003)](https://doi.org/10.1103/RevModPhys.75.715) |
| Factoring and discrete logarithms | [Shor, “Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer,” *SIAM Journal on Computing* (1997)](https://doi.org/10.1137/S0097539795293172) |
| Unstructured search | [Grover, “A fast quantum mechanical algorithm for database search” (1996)](https://doi.org/10.48550/arXiv.quant-ph/9605043) |
| Bell inequality testing | [Clauser, Horne, Shimony & Holt, “Proposed Experiment to Test Local Hidden-Variable Theories,” *Physical Review Letters* (1969)](https://doi.org/10.1103/PhysRevLett.23.880) |

## Black-hole concept-art grounding

The Gallery’s *The Unfiled Singularity* is an original fictional concept illustration, not a fourth case or a claim that the black-hole information problem has a settled answer. Its curved starlight follows NASA’s black-hole lensing visualization; the stretched explorer represents tidal-force spaghettification. The story archive and Qubi-like glow inside the singularity are imaginative devices. The timing of tidal disruption depends on black-hole mass, so the figure is not placed at a universal event-horizon boundary.

- [NASA SVS, “Isolated Black Hole Visualization”](https://svs.gsfc.nasa.gov/14620) — gravitational lensing and bent light paths.
- [NASA Science, “What Happens When Something Gets ‘Too Close’ to a Black Hole?”](https://science.nasa.gov/universe/what-happens-when-something-gets-too-close-to-a-black-hole/) — tidal forces and spaghettification.
- [NASA Science, “Frequently Asked Questions on Black Holes”](https://science.nasa.gov/apod/frequently-asked-questions-faqs-on-black-holes/) — current physics does not describe what happens at the singularity.

If a case, quiz, simulation, or fact changes, update the corresponding lecture connection and source pointer. Exact slide citations and reviewer names can be added if the group wants a more detailed audit trail; they were not provided for this update.
