export type Verdict = 'myth' | 'fact' | 'nuance';

export interface HypeCard {
  id: string;
  claim: string;
  verdict: Verdict;
  correction: string;
  detail: string;
  qubiSays: string;
}

export const VERDICT_META: Record<Verdict, { label: string; tone: string; glyph: string }> = {
  myth: { label: 'Myth', tone: 'var(--verdict-myth)', glyph: '✕' },
  fact: { label: 'Fair', tone: 'var(--verdict-fact)', glyph: '✓' },
  nuance: { label: 'Nuance', tone: 'var(--verdict-nuance)', glyph: '≈' },
};

/**
 * The "hype check": claims you will meet in headlines, graded honestly.
 * Swipe through them on the home page.
 */
export const hypeCards: HypeCard[] = [
  {
    id: 'try-everything',
    claim: 'A quantum computer tries every answer at once.',
    verdict: 'myth',
    correction: 'It builds a weighted blend of answers and lets the wrong ones cancel out.',
    detail:
      'Superposition gives you amplitudes, not parallel answers you can read off. Measurement returns a single outcome. Speed-ups come from interference shaping which outcome is likely — which is why only a handful of problems have good quantum algorithms.',
    qubiSays: 'I am not a thousand calculators. I am one very strange one.',
  },
  {
    id: 'replace-laptop',
    claim: 'Quantum computers will replace your laptop.',
    verdict: 'myth',
    correction: 'They are specialised co-processors, not general-purpose replacements.',
    detail:
      'For email, video and spreadsheets a classical chip wins on every axis: cost, reliability, energy. Quantum machines are expected to be accelerators for a narrow set of tasks, accessed over the network like a supercomputer.',
    qubiSays: 'I will not run your spreadsheet. Please stop asking.',
  },
  {
    id: 'ftl',
    claim: 'Entanglement lets you send messages faster than light.',
    verdict: 'myth',
    correction: 'Correlations are instant, but the outcomes are random — no signal travels.',
    detail:
      'This is the no-communication theorem. Each side sees only random bits until they compare notes over an ordinary, light-speed channel. Entanglement is a correlation resource, not a telephone.',
    qubiSays: 'Spooky, yes. A phone line? No.',
  },
  {
    id: 'breaks-all-crypto',
    claim: "Shor's algorithm breaks all encryption.",
    verdict: 'nuance',
    correction: 'It breaks RSA and elliptic-curve crypto. Symmetric ciphers only get a quadratic dent.',
    detail:
      "Shor's algorithm targets the hard problems behind public-key cryptography. AES is attacked by Grover's algorithm instead, which merely halves the effective key length — so doubling key sizes restores the margin. Post-quantum cryptography is the migration path for the rest.",
    qubiSays: 'RSA, run. AES, just eat your vegetables and double up.',
  },
  {
    id: 'unbreakable',
    claim: 'Quantum cryptography is unbreakable.',
    verdict: 'nuance',
    correction: 'The protocol is, in principle. Real hardware has been attacked.',
    detail:
      'BB84 is provably secure against any eavesdropper allowed by physics. Implementations, however, have been defeated by detector blinding, photon-number-splitting and side channels. The maths is airtight; the soldering iron is not.',
    qubiSays: 'Perfect theory, imperfect screwdriver.',
  },
  {
    id: 'both-at-once',
    claim: 'A qubit is 0 and 1 at the same time.',
    verdict: 'nuance',
    correction: 'It is a direction in a continuous space — amplitudes with phases.',
    detail:
      'The "both at once" picture is a useful first step that quickly misleads, because it hides phase. Two states with identical probabilities can behave completely differently once they interfere.',
    qubiSays: 'Phase is the part everyone forgets. Phase is the whole point.',
  },
  {
    id: 'more-qubits',
    claim: 'More qubits always means a better computer.',
    verdict: 'myth',
    correction: 'Fidelity and connectivity matter more than raw count.',
    detail:
      'A thousand noisy qubits can be beaten by a hundred good ones. Useful machines need low gate error rates, long coherence and enough connectivity to run error correction — which itself costs many physical qubits per logical one.',
    qubiSays: 'Quality over quantity. I would know, I am one qubit.',
  },
  {
    id: 'supremacy-means-useful',
    claim: '"Quantum supremacy" means quantum computers are useful now.',
    verdict: 'myth',
    correction: 'It shows a hard-to-simulate task was sampled — not a useful computation.',
    detail:
      'Supremacy demonstrations sample random circuits, a task chosen precisely because it is hard for classical machines and produces no useful output. Practical advantage needs a real problem, better error rates, and a fair classical baseline.',
    qubiSays: 'Impressive. Useful? Ask me again in a decade.',
  },
  {
    id: 'faster-everything',
    claim: 'Quantum computers are simply faster computers.',
    verdict: 'myth',
    correction: 'They offer different asymptotic scaling for specific problem structures.',
    detail:
      'Quantum speed-ups are not uniform. Some problems gain exponentially (factoring), some quadratically (search), and many gain nothing at all. Choosing the right problem is most of the engineering.',
    qubiSays: 'Faster at the right question. Slower at everything else.',
  },
  {
    id: 'teleport-people',
    claim: 'Quantum teleportation can beam people across a room.',
    verdict: 'myth',
    correction: 'It transfers a quantum state, not matter or energy.',
    detail:
      'Teleportation consumes one entangled pair and two classical bits to reconstruct a quantum state at a distant site. The original is destroyed and nothing physical travels — a lovely piece of information theory, not a transport system.',
    qubiSays: 'I can send the state. You keep the atoms.',
  },
];
