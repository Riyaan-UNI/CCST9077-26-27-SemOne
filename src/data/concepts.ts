export interface Concept {
  id: string;
  glyph: string;
  name: string;
  tagline: string;
  body: string;
  /** The analogy Qubi carries in its screen. */
  analogy: string;
  /** Where this concept shows up in the interactive lab. */
  lab?: { label: string; href: string };
}

export const concepts: Concept[] = [
  {
    id: 'qubit',
    glyph: '|ψ⟩',
    name: 'The qubit',
    tagline: 'A bit that can be in a blend of 0 and 1.',
    body:
      'A classical bit is a switch: 0 or 1. A qubit is a direction — a vector on the Bloch sphere, written a|0⟩ + b|1⟩. Until you measure it, that blend is real information, not ignorance.',
    analogy: 'A coin mid-spin, not a coin face-down on a table.',
    lab: { label: 'Build a state', href: '/lab#simulator' },
  },
  {
    id: 'superposition',
    glyph: '⊕',
    name: 'Superposition',
    tagline: 'Two answers, weighted, until you look.',
    body:
      'Superposition is a weighted combination of basis states. Crucially it is not "both at once" in the way people imagine — it is an amplitude with a phase, and those phases can interfere.',
    analogy: 'Two ripples on a pond: where their crests meet, they add; where they cancel, nothing.',
    lab: { label: 'Fire a Hadamard', href: '/lab#simulator' },
  },
  {
    id: 'entanglement',
    glyph: '∞',
    name: 'Entanglement',
    tagline: 'One state, two particles, no local story.',
    body:
      'Write (|00⟩ + |11⟩)/√2 and the pair has no individual descriptions at all. Measure one and the other is instantly correlated — but you cannot use that to send a message.',
    analogy: 'Two dancers who have rehearsed so long that neither can be described without the other.',
    lab: { label: 'Measure a Bell pair', href: '/lab#chsh' },
  },
  {
    id: 'measurement',
    glyph: '◉',
    name: 'Measurement',
    tagline: 'The moment the blend becomes a single answer.',
    body:
      'Measuring collapses a superposition onto one outcome, with probability given by the squared amplitude. It is irreversible, and it is why quantum programs must be designed so the right answer is the likely one.',
    analogy: 'A photograph, not a window. Once taken, the moment is a single frame.',
    lab: { label: 'Collapse a state', href: '/lab#simulator' },
  },
  {
    id: 'no-cloning',
    glyph: '⧉',
    name: 'No-cloning',
    tagline: 'You cannot photocopy an unknown qubit.',
    body:
      'The no-cloning theorem says there is no machine that copies an arbitrary unknown quantum state. This is not a limitation to be engineered away — it is what makes quantum key distribution secure.',
    analogy: 'A secret that changes the moment you try to write it down.',
  },
  {
    id: 'interference',
    glyph: '≈',
    name: 'Interference',
    tagline: 'The engine behind every quantum speed-up.',
    body:
      'Quantum algorithms arrange amplitudes so wrong answers cancel and right answers reinforce. Shor and Grover are, at heart, elaborate interference patterns.',
    analogy: 'Noise-cancelling headphones, but for wrong answers.',
    lab: { label: 'Watch amplitudes', href: '/lab#simulator' },
  },
  {
    id: 'chsh',
    glyph: '⚔',
    name: 'The CHSH game',
    tagline: 'A referee, two players, and a 85% ceiling.',
    body:
      'Alice and Bob, unable to talk, must satisfy a ⊕ b = x ∧ y. Classical players top out at 75%. Share an entangled pair and the ceiling rises to cos²(π/8) ≈ 85.4%. That gap is a laboratory-proof of nonlocality.',
    analogy: 'Two teammates winning a game no classical strategy can win.',
    lab: { label: 'Play the game', href: '/lab#chsh' },
  },
  {
    id: 'qkd',
    glyph: '🔑',
    name: 'Quantum key distribution',
    tagline: 'Eavesdropping that cannot hide.',
    body:
      'In BB84, Alice sends qubits in randomly chosen bases. Any interception disturbs the statistics, and the error rate betrays Eve. Security is guaranteed by physics rather than by an unproven hardness assumption.',
    analogy: 'A sealed envelope that visibly smudges if anyone opens it.',
    lab: { label: 'Trace the protocol', href: '/lab#chsh' },
  },
  {
    id: 'decoherence',
    glyph: '≋',
    name: 'Decoherence',
    tagline: "Why qubits are so hard to keep.",
    body:
      'A qubit leaking information into its environment stops behaving quantumly. Coherence times, gate fidelities and error correction are the three numbers that decide whether a machine is useful.',
    analogy: 'A soap bubble in a sandstorm.',
  },
  {
    id: 'shor-grover',
    glyph: '∑',
    name: 'Shor and Grover',
    tagline: 'What quantum computers are actually for.',
    body:
      "Shor's algorithm factors integers in polynomial time, threatening RSA and elliptic-curve cryptography. Grover's gives a quadratic speed-up for search, halving effective key lengths. Everything else is still catching up.",
    analogy: 'Shor picks the lock; Grover searches the room faster.',
    lab: { label: 'See the histogram', href: '/lab#simulator' },
  },
];
