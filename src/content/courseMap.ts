/**
 * Course map for CCST9077 — exact lecture titles and structure.
 *
 * Summaries are written only from facts given in the course brief.
 * Where the brief had no detail, the summary says "Summary coming".
 */

export interface Lecture {
  id: string;
  week: number;
  title: string;
  summary: string;
  keyConcepts: string[];
}

export interface CoursePart {
  id: string;
  title: string;
  lectures: Lecture[];
}

export const courseParts: CoursePart[] = [
  {
    id: 'part1',
    title: 'Part 1 · A new type of information',
    lectures: [
      {
        id: 'l1',
        week: 1,
        title: 'L1 · Classical Information',
        summary:
          'Bits, Shannon entropy, the minimum number of yes/no questions needed to identify a state. The 20-questions game as an intuition pump.',
        keyConcepts: ['bit', 'Shannon entropy', 'information as surprise', '20 questions'],
      },
      {
        id: 'l2',
        week: 2,
        title: 'L2 · Quantum Information',
        summary:
          'The magic box toy model: open = measurement/collapse, shake = coherent operation. Superposition, the qubit as a direction not a switch.',
        keyConcepts: ['qubit', 'superposition', 'measurement', 'magic box', 'coherent operation'],
      },
      {
        id: 'l3',
        week: 3,
        title: 'L3 · Quantum Entanglement',
        summary:
          'Entangled pairs, Bell states, the EPR paradox. Steering: a lopsided kind of entanglement. The no-cloning theorem and the FLASH argument.',
        keyConcepts: ['entanglement', 'Bell state', 'EPR', 'steering', 'no-cloning', 'FLASH'],
      },
      {
        id: 'l4',
        week: 4,
        title: 'L4 · Bell Inequalities',
        summary:
          "Bell's theorem: local realism cannot reproduce quantum predictions. The CHSH game: classical ceiling 75%, quantum reaches ~85.4%. Aspect's experiments, loophole-free tests 2015, 2022 Nobel.",
        keyConcepts: ["Bell's theorem", 'CHSH', 'local realism', 'loophole-free', '2022 Nobel'],
      },
    ],
  },
  {
    id: 'part2',
    title: 'Part 2 · Quantum technologies',
    lectures: [
      {
        id: 'l5',
        week: 5,
        title: 'L5 · Quantum Cryptography',
        summary: 'Summary coming.',
        keyConcepts: ['BB84', 'quantum key distribution', 'Eve'],
      },
      {
        id: 'l6',
        week: 6,
        title: 'L6 · Quantum Computers',
        summary: 'Summary coming.',
        keyConcepts: ['quantum circuit', 'gate', 'NISQ'],
      },
      {
        id: 'l7',
        week: 7,
        title: 'L7 · Quantum Sensors',
        summary: 'Summary coming.',
        keyConcepts: ['quantum sensing', 'metrology', 'interferometry'],
      },
      {
        id: 'l8',
        week: 8,
        title: 'L8 · Quantum in Popular Culture',
        summary:
          'The good, the bad and the ugly of quantum popular science. Claims debunked: infinitely faster, parallel universes, teleporting armies. The Gartner hype cycle.',
        keyConcepts: ['hype cycle', 'popular science', 'misconceptions', 'good/bad/ugly'],
      },
    ],
  },
  {
    id: 'part3',
    title: 'Part 3 · Quantum information in spacetime',
    lectures: [
      {
        id: 'l9',
        week: 9,
        title: 'L9 · Spacetime',
        summary: 'Summary coming.',
        keyConcepts: ['spacetime', 'general relativity', 'quantum gravity'],
      },
      {
        id: 'l10',
        week: 10,
        title: 'L10 · Black Holes and Information',
        summary: 'Summary coming.',
        keyConcepts: ['black hole', 'information paradox', 'Hawking radiation'],
      },
      {
        id: 'l11',
        week: 11,
        title: 'L11 · The Universe as a Quantum Computer',
        summary:
          'The computational universe: from clockwork to computation. Conway\'s Game of Life. Lloyd\'s ultimate laptop (10^50 ops/s). The Bekenstein bound: black holes as the ultimate hard disk.',
        keyConcepts: ['computational universe', 'Game of Life', 'Lloyd', 'Bekenstein bound'],
      },
    ],
  },
];
