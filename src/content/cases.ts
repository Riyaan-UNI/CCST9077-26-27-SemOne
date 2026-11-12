export type CaseId = 'measurement' | 'entanglement' | 'no-cloning';

export interface BureauCase {
  id: CaseId;
  number: string;
  title: string;
  topic: string;
  question: string;
  summary: string;
  predictionQuestion: string;
  predictions: string[];
  testLabel: string;
  finding: string;
  boundary: string;
  lectureSource: string;
  videoIds: string[];
}

/**
 * Short draft prompts and summaries used to make the interface testable.
 * The group must review and rewrite the explanatory copy before submission.
 */
export const bureauCases: BureauCase[] = [
  {
    id: 'measurement',
    number: '01',
    title: 'The answer that changes when checked',
    topic: 'Superposition and measurement',
    question: 'What does a measurement tell us about a prepared qubit?',
    summary: 'A definite readout can come from a state prepared with more than one possible measurement outcome.',
    predictionQuestion: 'If the same equally weighted state is measured many times, what pattern do you expect?',
    predictions: ['The same result every time', 'Two possible results across repeated trials', 'The measurement reveals a hidden classical label'],
    testLabel: 'Explore measurement settings and collect shots',
    finding: 'Each trial produces one definite result. Repeated measurements reveal the outcome statistics for the prepared state.',
    boundary: 'This simplified test demonstrates outcome probabilities. A qubit is not a tiny classical coin, and measurement is a physical interaction—not a conscious observer looking.',
    lectureSource: 'CCST9077 Lecture 2: Entering the Quantum Realm · group review pending',
    videoIds: ['the-magic-box'],
  },
  {
    id: 'entanglement',
    number: '02',
    title: 'The distant results that agree',
    topic: 'Entanglement and Bell correlations',
    question: 'Can strong correlations be used as a faster-than-light message?',
    summary: 'Entangled systems can show correlations that challenge classical explanations, while each local outcome remains unpredictable.',
    predictionQuestion: 'Could one side choose a result and use it to send a controllable message to the other?',
    predictions: ['Yes, the partner can read the chosen message', 'No, correlations do not make a controllable message channel', 'Only when both observers use the same device'],
    testLabel: 'Run a CHSH comparison',
    finding: 'The CHSH test compares correlations across measurement settings. Its results do not provide a way to choose and transmit a message faster than light.',
    boundary: 'The demo is a simplified local simulation of a Bell-test game. Do not interpret the visual link as a signal traveling between particles.',
    lectureSource: 'CCST9077 Lecture 3: Quantum Spookiness; Lecture 4: Winning Games with Quantum Tricks · group review pending',
    videoIds: ['spooky-twins-no-messages', 'the-game-show-that-broke-reality'],
  },
  {
    id: 'no-cloning',
    number: '03',
    title: 'The original that cannot be duplicated',
    topic: 'The no-cloning theorem',
    question: 'Can an unknown quantum state be copied perfectly while leaving the original unchanged?',
    summary: 'Quantum theory places a limit on making identical copies of an arbitrary unknown state.',
    predictionQuestion: 'What can a general-purpose device promise for every unknown input state?',
    predictions: ['A perfect independent copy', 'An approximate copy with no trade-off', 'No universal perfect copier for arbitrary unknown states'],
    testLabel: 'Challenge the universal copier',
    finding: 'A state known to the preparer can be prepared again. The no-cloning theorem rules out a universal operation that perfectly copies every arbitrary unknown quantum state.',
    boundary: 'This does not say that quantum information can never be reproduced in any circumstance. It concerns perfect copying of arbitrary unknown states.',
    lectureSource: 'CCST9077 Lecture 2: Entering the Quantum Realm · group review pending',
    videoIds: ['cant-copy-cant-hack'],
  },
];

export const getBureauCase = (id: string | undefined) =>
  bureauCases.find((item) => item.id === id);
