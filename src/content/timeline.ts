/**
 * Full timeline data for "From Bits to Qubits".
 *
 * Every entry needs a verified source. Mark contested claims honestly.
 * The tag field is optional: use "science", "hype", "contested", or "both"
 * to flag items that attract popular overstatement.
 */
export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  blurb: string;
  qubiSays: string;
  era: 'foundations' | 'quantum' | 'information' | 'technology';
  tag?: 'science' | 'hype' | 'contested' | 'both';
  source: { name: string; url: string };
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'planck',
    year: 1900,
    title: 'Planck quantises light',
    blurb:
      'Max Planck proposes that energy comes in discrete packets — quanta — to explain the spectrum of black-body radiation. This is the birth of quantum theory.',
    qubiSays: 'The idea that energy is lumpy, not smooth. Everything starts here.',
    era: 'foundations',
    source: { name: 'Wikipedia — Max Planck', url: 'https://en.wikipedia.org/wiki/Max_Planck' },
  },
  {
    id: 'einstein-photoelectric',
    year: 1905,
    title: 'Einstein and the photon',
    blurb:
      "Einstein explains the photoelectric effect by treating light as particles (photons), not waves. He wins the 1921 Nobel Prize for this — not for relativity.",
    qubiSays: 'Light is both wave and particle. The first superposition.',
    era: 'foundations',
    source: { name: 'Wikipedia — Photoelectric effect', url: 'https://en.wikipedia.org/wiki/Photoelectric_effect' },
  },
  {
    id: 'schrodinger-equation',
    year: 1926,
    title: "Schrödinger's equation",
    blurb:
      'Erwin Schrödinger writes the wave equation that describes how quantum states evolve. It is the central tool of quantum mechanics.',
    qubiSays: 'The maths of how possibilities dance through time.',
    era: 'foundations',
    source: { name: 'Wikipedia — Schrödinger equation', url: 'https://en.wikipedia.org/wiki/Schr%C3%B6dinger_equation' },
  },
  {
    id: 'heisenberg-uncertainty',
    year: 1927,
    title: 'Heisenberg uncertainty',
    blurb:
      'Werner Heisenberg shows that certain pairs of properties — like position and momentum — cannot both be known precisely. This is not a measurement limitation; it is built into nature.',
    qubiSays: 'The universe has a privacy policy.',
    era: 'foundations',
    source: { name: 'Wikipedia — Uncertainty principle', url: 'https://en.wikipedia.org/wiki/Uncertainty_principle' },
  },
  {
    id: 'epr',
    year: 1935,
    title: 'EPR paradox',
    blurb:
      "Einstein, Podolsky and Rosen publish a thought experiment designed to show quantum mechanics is incomplete. Schrödinger coins the word 'entanglement' in response. The paper sparks decades of debate.",
    qubiSays: 'Einstein asked a question that took 50 years to answer.',
    era: 'quantum',
    source: { name: 'Wikipedia — EPR paradox', url: 'https://en.wikipedia.org/wiki/EPR_paradox' },
  },
  {
    id: 'turing',
    year: 1936,
    title: 'Turing defines computation',
    blurb:
      "Alan Turing's paper 'On Computable Numbers' defines the Turing machine — the abstract model of every classical computer that has ever existed.",
    qubiSays: 'The blueprint for every laptop, phone and server.',
    era: 'information',
    source: { name: 'Wikipedia — Turing machine', url: 'https://en.wikipedia.org/wiki/Turing_machine' },
  },
  {
    id: 'transistor',
    year: 1947,
    title: 'The transistor',
    blurb:
      'Bardeen, Brattain and Shockley invent the transistor at Bell Labs. It replaces vacuum tubes and makes modern computing possible.',
    qubiSays: 'The switch that shrank the world.',
    era: 'technology',
    source: { name: 'Wikipedia — Transistor', url: 'https://en.wikipedia.org/wiki/Transistor' },
  },
  {
    id: 'shannon',
    year: 1948,
    title: 'Shannon quantifies information',
    blurb:
      "Claude Shannon's 'A Mathematical Theory of Communication' defines the bit and shows how to measure information. Modern digital communication rests on this paper.",
    qubiSays: 'One yes/no question = one bit. That is information.',
    era: 'information',
    source: { name: 'Wikipedia — Claude Shannon', url: 'https://en.wikipedia.org/wiki/Claude_Shannon' },
  },
  {
    id: 'bell-theorem',
    year: 1964,
    title: "Bell's theorem",
    blurb:
      "John Bell proves that no 'locally realistic' theory can reproduce all quantum predictions. The CHSH inequality is the practical version used in experiments.",
    qubiSays: 'Einstein hoped for hidden variables. Bell proved they cannot hide.',
    era: 'quantum',
    source: { name: 'Wikipedia — Bell\'s theorem', url: 'https://en.wikipedia.org/wiki/Bell%27s_theorem' },
  },
  {
    id: 'moore',
    year: 1965,
    title: "Moore's law",
    blurb:
      "Gordon Moore predicts that the number of transistors on a chip will double roughly every two years. It holds for decades — but it is an industry target, not a law of nature.",
    qubiSays: 'An observation that became a self-fulfilling prophecy.',
    era: 'technology',
    tag: 'both',
    source: { name: 'Wikipedia — Moore\'s law', url: 'https://en.wikipedia.org/wiki/Moore%27s_law' },
  },
  {
    id: 'wiesner',
    year: 1970,
    title: "Wiesner's quantum money",
    blurb:
      "Stephen Wiesner proposes quantum money — banknotes encoded in quantum states that cannot be counterfeited because of the no-cloning theorem. Published in 1983.",
    qubiSays: 'Money that photocopiers cannot copy.',
    era: 'quantum',
    source: { name: 'Wikipedia — Quantum money', url: 'https://en.wikipedia.org/wiki/Quantum_money' },
  },
  {
    id: 'wootters-zurek',
    year: 1982,
    title: 'No-cloning theorem',
    blurb:
      'Wootters and Zurek, and independently Dieks, prove that an unknown quantum state cannot be perfectly copied. Nature has copy-protection.',
    qubiSays: 'The universe says: one copy only.',
    era: 'quantum',
    source: { name: 'Nature 299, 802 (1982)', url: 'https://en.wikipedia.org/wiki/No-cloning_theorem' },
  },
  {
    id: 'feynman',
    year: 1982,
    title: 'Feynman: simulate physics with computers',
    blurb:
      "Richard Feynman argues in 'Simulating Physics with Computers' that classical machines cannot efficiently simulate quantum systems. The quantum computer is born as an idea.",
    qubiSays: 'If nature is quantum, our computers should be too.',
    era: 'quantum',
    source: { name: 'Wikipedia — Quantum computing', url: 'https://en.wikipedia.org/wiki/Quantum_computing' },
  },
  {
    id: 'aspect',
    year: 1982,
    title: 'Aspect tests Bell',
    blurb:
      "Alain Aspect's experiments with entangled photons show that Bell's inequality is violated. Local hidden variables are ruled out.",
    qubiSays: 'The first time spooky action left the thought experiment.',
    era: 'quantum',
    source: { name: 'Wikipedia — Alain Aspect', url: 'https://en.wikipedia.org/wiki/Alain_Aspect' },
  },
  {
    id: 'deutsch',
    year: 1985,
    title: "Deutsch's universal quantum computer",
    blurb:
      'David Deutsch proposes a universal quantum Turing machine — the theoretical blueprint for every quantum processor built since.',
    qubiSays: 'One machine to run every quantum program.',
    era: 'quantum',
    source: { name: 'Wikipedia — David Deutsch', url: 'https://en.wikipedia.org/wiki/David_Deutsch' },
  },
  {
    id: 'shor',
    year: 1994,
    title: "Shor's algorithm",
    blurb:
      'Peter Shor discovers a quantum algorithm that factors integers in polynomial time. RSA encryption is suddenly on a countdown timer.',
    qubiSays: 'The algorithm that made cryptographers nervous.',
    era: 'quantum',
    source: { name: 'Wikipedia — Shor\'s algorithm', url: 'https://en.wikipedia.org/wiki/Shor%27s_algorithm' },
  },
  {
    id: 'schumacher',
    year: 1995,
    title: 'Quantum data compression',
    blurb:
      "Benjamin Schumacher proves the quantum analogue of Shannon's source coding theorem, defining the 'qubit' as a measure of quantum information.",
    qubiSays: 'Compressing quantum data: harder, but possible.',
    era: 'information',
    source: { name: 'Wikipedia — Schumacher compression', url: 'https://en.wikipedia.org/wiki/Schumacher_compression' },
  },
  {
    id: 'lloyd',
    year: 2000,
    title: "Lloyd's ultimate laptop",
    blurb:
      "Seth Lloyd calculates the maximum computational power of a 1-kilogram, 1-litre computer: about 10^50 operations per second, limited by the Bekenstein bound.",
    qubiSays: 'The fastest laptop physics allows.',
    era: 'quantum',
    source: { name: 'Nature 406, 1047 (2000)', url: 'https://en.wikipedia.org/wiki/Seth_Lloyd' },
  },
  {
    id: 'micius',
    year: 2017,
    title: 'Micius satellite',
    blurb:
      "China's Micius satellite distributes entangled photon pairs over more than 1,200 kilometres, demonstrating quantum key distribution from space.",
    qubiSays: 'Entanglement, beamed from orbit.',
    era: 'technology',
    source: { name: 'Wikipedia — Quantum Experiments at Space Scale', url: 'https://en.wikipedia.org/wiki/Quantum_Experiments_at_Space_Scale' },
  },
  {
    id: 'loophole-free',
    year: 2015,
    title: 'Loophole-free Bell tests',
    blurb:
      'Three independent groups close the detection and locality loopholes in Bell tests, removing the last major classical escape routes.',
    qubiSays: 'No more hiding. The universe really is non-local.',
    era: 'quantum',
    source: { name: 'Wikipedia — Loopholes in Bell test experiments', url: 'https://en.wikipedia.org/wiki/Loopholes_in_Bell_test_experiments' },
  },
  {
    id: 'sycamore',
    year: 2019,
    title: "Google claims 'quantum supremacy'",
    blurb:
      "Google's 53-qubit Sycamore processor performs a sampling task they claim would take a classical supercomputer 10,000 years. IBM disputes the classical estimate. The milestone is real; the terminology is debated.",
    qubiSays: 'A hard problem solved. Just not, yet, a useful one.',
    era: 'technology',
    tag: 'contested',
    source: { name: 'Nature 574, 505–510 (2019)', url: 'https://en.wikipedia.org/wiki/Quantum_supremacy' },
  },
  {
    id: 'nobel-2022',
    year: 2022,
    title: 'Nobel Prize: entanglement experiments',
    blurb:
      'Aspect, Clauser and Zeilinger win the Nobel Prize in Physics for experiments with entangled photons, establishing the violation of Bell inequalities.',
    qubiSays: 'Einstein called it spooky. The Nobel committee called it physics.',
    era: 'quantum',
    source: { name: 'Nobel Prize 2022', url: 'https://www.nobelprize.org/prizes/physics/2022/summary/' },
  },
];

export const eraLabel: Record<TimelineEvent['era'], string> = {
  foundations: 'Foundations',
  quantum: 'Quantum theory',
  information: 'Information theory',
  technology: 'Technology',
};

export const eraColor: Record<TimelineEvent['era'], string> = {
  foundations: 'var(--era-codes)',
  quantum: 'var(--era-theory)',
  information: 'var(--era-algorithms)',
  technology: 'var(--era-hardware)',
};
