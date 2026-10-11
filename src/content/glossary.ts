/**
 * Glossary — the course's plain-English vocabulary.
 *
 * Every entry carries a `source` triple. The content-validation test
 * (src/content/validate.test.ts) fails the build if a public factual claim is
 * missing a source, so keep this honest: if you are unsure, set `verified: false`
 * and link to the course rather than inventing a citation.
 */
export interface GlossarySource {
  source: string;
  sourceUrl: string;
  verified: boolean;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  /** One plain-English sentence a non-physicist can repeat. */
  plain: string;
  source: GlossarySource;
}

export const glossary: GlossaryEntry[] = [
  {
    id: 'bit',
    term: 'bit',
    plain:
      'The smallest piece of ordinary information: a switch that is either 0 or 1, on or off, yes or no.',
    source: {
      source: 'Course CCST9077 · L1 Classical Information',
      sourceUrl: 'https://en.wikipedia.org/wiki/Bit',
      verified: true,
    },
  },
  {
    id: 'qubit',
    term: 'qubit',
    plain:
      'A quantum bit. Unlike a coin that is heads or tails, a qubit can be a blend of both until you look — then it snaps to one.',
    source: {
      source: 'Course CCST9077 · L2 Quantum Information',
      sourceUrl: 'https://en.wikipedia.org/wiki/Qubit',
      verified: true,
    },
  },
  {
    id: 'superposition',
    term: 'superposition',
    plain:
      'A qubit’s in-between state: it holds many possibilities at once, like a spinning coin that is neither heads nor tails until it lands.',
    source: {
      source: 'Course CCST9077 · L2 Quantum Information',
      sourceUrl: 'https://en.wikipedia.org/wiki/Quantum_superposition',
      verified: true,
    },
  },
  {
    id: 'measurement',
    term: 'measurement',
    plain:
      'Looking at a qubit. The act of observing forces the blur to collapse into a single definite answer, 0 or 1.',
    source: {
      source: 'Course CCST9077 · L2 Quantum Information',
      sourceUrl: 'https://en.wikipedia.org/wiki/Measurement_in_quantum_mechanics',
      verified: true,
    },
  },
  {
    id: 'entanglement',
    term: 'entanglement',
    plain:
      'Two qubits can be linked so that measuring one instantly tells you about the other, no matter how far apart — yet no message is sent.',
    source: {
      source: 'Course CCST9077 · L3 Quantum Entanglement · 2022 Nobel Prize',
      sourceUrl: 'https://www.nobelprize.org/prizes/physics/2022/summary/',
      verified: true,
    },
  },
  {
    id: 'steering',
    term: 'steering',
    plain:
      'A lopsided kind of entanglement: one side can steer what the other sees, which is why cloning plus steering would spell trouble.',
    source: {
      source: 'Course CCST9077 · L3 Quantum Entanglement (EPR steering)',
      sourceUrl: 'https://en.wikipedia.org/wiki/EPR_paradox',
      verified: true,
    },
  },
  {
    id: 'no-cloning',
    term: 'no-cloning',
    plain:
      'The universe has a copy-protection law: you cannot make an exact duplicate of an unknown quantum state. No quantum photocopier exists.',
    source: {
      source: 'Wootters & Zurek, "A single quantum cannot be cloned", Nature 299, 802 (1982)',
      sourceUrl: 'https://en.wikipedia.org/wiki/No-cloning_theorem',
      verified: true,
    },
  },
  {
    id: 'bell-inequality',
    term: 'Bell inequality',
    plain:
      "A math rule that says how correlated two ordinary coins can be. Quantum particles break it, proving the world is not locally real.",
    source: {
      source: 'Bell, "On the Einstein Podolsky Rosen paradox", 1964',
      sourceUrl: 'https://en.wikipedia.org/wiki/Bell%27s_theorem',
      verified: true,
    },
  },
  {
    id: 'chsh',
    term: 'CHSH',
    plain:
      'A two-player game built on Bell’s idea. Classical teams win at most 75% of the time; entangled teams reach about 85.4%.',
    source: {
      source: 'Clauser, Horne, Shimony, Holt, 1969',
      sourceUrl: 'https://en.wikipedia.org/wiki/CHSH_inequality',
      verified: true,
    },
  },
  {
    id: 'hype-cycle',
    term: 'hype cycle',
    plain:
      'The rollercoaster a new technology rides: a spike of excited overestimation, a trough of disappointment, then steady real value.',
    source: {
      source: 'Gartner hype cycle (concept)',
      sourceUrl: 'https://en.wikipedia.org/wiki/Hype_cycle',
      verified: true,
    },
  },
];

export const glossaryById = Object.fromEntries(glossary.map((g) => [g.id, g])) as Record<
  string,
  GlossaryEntry
>;
