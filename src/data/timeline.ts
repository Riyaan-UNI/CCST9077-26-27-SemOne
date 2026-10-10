/**
 * The story arc of the course: from secret codes to quantum computers.
 * Everything here is plain, typed data so teammates can edit copy without
 * touching a single component.
 */

export type TimelineEra = 'codes' | 'theory' | 'algorithms' | 'hardware';

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  blurb: string;
  era: TimelineEra;
  /** One memorable line, the kind Qubi would put in a fact bubble. */
  qubiSays: string;
}

export const ERA_LABEL: Record<TimelineEra, string> = {
  codes: 'Secret codes',
  theory: 'Quantum theory',
  algorithms: 'Algorithms',
  hardware: 'Hardware',
};

export const ERA_COLOR: Record<TimelineEra, string> = {
  codes: 'var(--era-codes)',
  theory: 'var(--era-theory)',
  algorithms: 'var(--era-algorithms)',
  hardware: 'var(--era-hardware)',
};

export const timeline: TimelineEntry[] = [
  {
    id: 'rsa',
    year: '1977',
    era: 'codes',
    title: 'RSA locks the internet',
    blurb:
      'Rivest, Shamir and Adleman publish a public-key cryptosystem whose security rests on how hard it is to factor enormous numbers. It still guards most of the traffic you send today.',
    qubiSays: 'Multiply two primes: easy. Undo it: very, very hard.',
  },
  {
    id: 'bb84',
    year: '1984',
    era: 'codes',
    title: 'BB84 — the first quantum key',
    blurb:
      'Bennett and Brassard show that a key can be distributed using single photons, so that any eavesdropper is detectable in principle. Security stops being a maths problem and becomes a physics one.',
    qubiSays: 'Eve cannot copy what she cannot clone. Physics is watching.',
  },
  {
    id: 'feynman',
    year: '1981–82',
    era: 'theory',
    title: 'Feynman asks the right question',
    blurb:
      'In "Simulating Physics with Computers", Feynman argues that nature is quantum, so a classical machine will always struggle to simulate it. Build the computer out of quantum parts instead.',
    qubiSays: 'Nature is not classical. Why should our computers be?',
  },
  {
    id: 'deutsch',
    year: '1985',
    era: 'theory',
    title: "Deutsch's universal quantum computer",
    blurb:
      'David Deutsch describes a universal quantum Turing machine, the theoretical ancestor of every quantum processor in a lab today.',
    qubiSays: 'One machine to run every quantum program.',
  },
  {
    id: 'e91',
    year: '1991',
    era: 'theory',
    title: 'E91 — entanglement as a key',
    blurb:
      'Artur Ekert realises that the correlations of an entangled pair — the very thing Einstein called "spooky action" — can be turned into a cryptographic key.',
    qubiSays: "Spooky action, but make it a business model.",
  },
  {
    id: 'teleportation',
    year: '1993',
    era: 'theory',
    title: 'Quantum teleportation',
    blurb:
      'Bennett, Brassard, Crépeau, Jozsa, Peres and Wootters show how to move a quantum state using entanglement and two classical bits — no matter is moved at all.',
    qubiSays: 'The state travels. The particle stays home.',
  },
  {
    id: 'shor',
    year: '1994',
    era: 'algorithms',
    title: "Shor's algorithm",
    blurb:
      'Peter Shor finds a quantum algorithm that factors large integers in polynomial time. Every RSA key on the planet suddenly has an expiry date.',
    qubiSays: 'RSA had a good run. It is on the clock now.',
  },
  {
    id: 'grover',
    year: '1996',
    era: 'algorithms',
    title: "Grover's search",
    blurb:
      'Lov Grover gives a quadratic speed-up for searching an unstructured list — less dramatic than Shor, but far more broadly useful.',
    qubiSays: 'Not faster at everything. Faster at the right things.',
  },
  {
    id: 'qec',
    year: '1995–96',
    era: 'algorithms',
    title: 'Error correction arrives',
    blurb:
      'Shor and Steane show that quantum errors can be corrected without measuring — and therefore without destroying — the data. Without this, quantum computing would be a curiosity.',
    qubiSays: 'Fixing a qubit without looking at it. Try that with a laptop.',
  },
  {
    id: 'two-qubit',
    year: '1998',
    era: 'hardware',
    title: 'The first real two-qubit machine',
    blurb:
      'A two-qubit NMR quantum computer runs Deutsch–Jozsa. It is tiny, but it is a quantum computer doing a quantum algorithm.',
    qubiSays: 'Two qubits. The universe noticed.',
  },
  {
    id: 'shor15',
    year: '2001',
    era: 'hardware',
    title: '15 = 3 × 5, by quantum',
    blurb:
      "IBM's seven-qubit NMR machine runs Shor's algorithm and factors the number 15. The smallest possible demonstration — and a headline everywhere.",
    qubiSays: 'Fifteen factored. Cryptographers went very quiet.',
  },
  {
    id: 'steering',
    year: '2006–07',
    era: 'theory',
    title: 'Quantum steering gets its name',
    blurb:
      'Wiseman, Jones and Doherty formalise Schrödinger\'s "steering" idea, a middle ground between entanglement and Bell nonlocality — and a practical tool for one-sided device-independent cryptography.',
    qubiSays: 'Entanglement, Bell, steering: three flavours of spooky.',
  },
  {
    id: 'nobel2012',
    year: '2012',
    era: 'hardware',
    title: 'Nobel Prize: trapping and probing quanta',
    blurb:
      'Serge Haroche and David Wineland share the Nobel Prize in Physics for measuring and controlling individual quantum systems — the craft that made qubits possible.',
    qubiSays: 'Catching one atom and keeping it still. Respect.',
  },
  {
    id: 'sycamore',
    year: '2019',
    era: 'hardware',
    title: 'Sycamore and "quantum supremacy"',
    blurb:
      "Google's 53-qubit processor samples a circuit that, by their estimate, would take a classical supercomputer thousands of years. The claim is contested — the goalposts keep moving — but the milestone is real.",
    qubiSays: 'A hard problem solved. Just not, yet, a useful one.',
  },
  {
    id: 'nobel2022',
    year: '2022',
    era: 'theory',
    title: 'Nobel Prize: entanglement experiments',
    blurb:
      'Aspect, Clauser and Zeilinger win the Nobel Prize for experiments with entangled photons, closing the loopholes in Bell tests and founding quantum information science.',
    qubiSays: 'Einstein called it spooky. The Nobel committee called it physics.',
  },
  {
    id: 'willow',
    year: '2024–25',
    era: 'hardware',
    title: 'Below-threshold error correction',
    blurb:
      'Superconducting processors demonstrate that adding more physical qubits can make a logical qubit *better*, not worse — the long-sought threshold that turns error correction from theory into engineering.',
    qubiSays: 'More qubits, fewer mistakes. That is the whole ball game.',
  },
];
