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
    tagline: 'A quantum state can combine basis states.',
    body:
      'A classical bit is a switch: 0 or 1. A pure qubit state can be written a|0⟩ + b|1⟩, with complex amplitudes a and b. A superposition is not just uncertainty about a hidden classical label; its relative phase can affect later measurement statistics.',
    analogy: 'A coin mid-spin, not a coin face-down on a table.',
    lab: { label: 'Build a state', href: '/lab#simulator' },
  },
  {
    id: 'superposition',
    glyph: '⊕',
    name: 'Superposition',
    tagline: 'A coherent combination, with phase that matters.',
    body:
      'Superposition is a coherent combination of basis states. It is not simply a classical bit with two hidden answers: relative phases can affect the probabilities seen in a later measurement.',
    analogy: 'Two ripples on a pond: where their crests meet, they add; where they cancel, nothing.',
    lab: { label: 'Fire a Hadamard', href: '/lab#simulator' },
  },
  {
    id: 'entanglement',
    glyph: '∞',
    name: 'Entanglement',
    tagline: 'One state, two particles, no local story.',
    body:
      'For the joint state (|00⟩ + |11⟩)/√2, the pair cannot be described as two independent pure states. Measurements can reveal strong correlations, but each local result is not controllable, so the correlations cannot send a faster-than-light message.',
    analogy: 'Two dancers who have rehearsed so long that neither can be described without the other.',
    lab: { label: 'Measure a Bell pair', href: '/lab#chsh' },
  },
  {
    id: 'measurement',
    glyph: '◉',
    name: 'Measurement',
    tagline: 'A physical interaction yields a recorded outcome.',
    body:
      'In the standard measurement rule, a measurement produces one outcome with probabilities set by the squared amplitudes in the chosen basis. Changing the measurement basis can change those probabilities. Measurement is a physical interaction, not a conscious act of looking.',
    analogy: 'A photograph, not a window. Once taken, the moment is a single frame.',
    lab: { label: 'Collapse a state', href: '/lab#simulator' },
  },
  {
    id: 'no-cloning',
    glyph: '⧉',
    name: 'No-cloning',
    tagline: 'You cannot photocopy an unknown qubit.',
    body:
      'The no-cloning theorem rules out a universal operation that perfectly copies every arbitrary unknown quantum state. It is relevant to quantum cryptography, but it does not by itself guarantee that a real key-distribution system is secure.',
    analogy: 'A copier that cannot promise a perfect copy of every unknown original.',
  },
  {
    id: 'interference',
    glyph: '≈',
    name: 'Interference',
    tagline: 'A mechanism used by many quantum algorithms.',
    body:
      'Some quantum algorithms use interference to increase the chance of useful outcomes and reduce others. Phase relationships are part of how algorithms such as Shor’s and Grover’s produce their results.',
    analogy: 'Noise-cancelling headphones, but for wrong answers.',
    lab: { label: 'Watch amplitudes', href: '/lab#simulator' },
  },
  {
    id: 'chsh',
    glyph: '⚔',
    name: 'The CHSH game',
    tagline: 'A referee, two players, and an 85.4% quantum strategy.',
    body:
      'In the standard CHSH game, Alice and Bob receive separate inputs and win when a ⊕ b = x ∧ y. The best classical strategy wins 75% of uniformly sampled rounds; an ideal quantum strategy reaches cos²(π/8), about 85.4%. Experiments testing Bell inequalities provide evidence against local hidden-variable models under their stated assumptions.',
    analogy: 'Two teammates whose quantum strategy improves their best win rate.',
    lab: { label: 'Play the game', href: '/lab#chsh' },
  },
  {
    id: 'qkd',
    glyph: '🔑',
    name: 'Quantum key distribution',
    tagline: 'A protocol that can reveal signs of interception.',
    body:
      'In the BB84 protocol, Alice encodes bits using randomly chosen bases. Eavesdropping can introduce detectable errors in the tested data. Security claims depend on the protocol assumptions, proof, and implementation; the disturbance idea alone is not a complete security guarantee.',
    analogy: 'A tamper-evident channel that can reveal interference under stated conditions.',
    lab: { label: 'Trace the protocol', href: '/lab#chsh' },
  },
  {
    id: 'decoherence',
    glyph: '≋',
    name: 'Decoherence',
    tagline: 'Why preserving coherence is difficult.',
    body:
      'Interactions with the environment can reduce coherence and suppress interference between parts of a quantum state. Decoherence helps explain why quantum effects are difficult to preserve, but the system is still described by quantum mechanics. Performance depends on several factors, including coherence, gate quality, and error correction.',
    analogy: 'A soap bubble in a sandstorm.',
  },
  {
    id: 'shor-grover',
    glyph: '∑',
    name: 'Shor and Grover',
    tagline: 'Two algorithms with distinct kinds of speed-up.',
    body:
      "Shor's algorithm gives polynomial-time quantum algorithms for integer factoring and discrete logarithms, which are relevant to RSA and elliptic-curve public-key systems. Grover's algorithm offers a quadratic query speed-up for unstructured search; its implications depend on the problem and security model.",
    analogy: 'Shor picks the lock; Grover searches the room faster.',
    lab: { label: 'See the histogram', href: '/lab#simulator' },
  },
];
