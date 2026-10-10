export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const quiz: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'A Bell state is measured in the computational basis. Which outcomes are possible?',
    options: ['00, 01, 10 and 11 equally', 'Only 00 and 11', 'Only 01 and 10', 'It never collapses'],
    answer: 1,
    explanation:
      '(|00⟩ + |11⟩)/√2 has amplitude only on those two basis states, so 01 and 10 can never appear. That is the correlation that makes entanglement useful.',
  },
  {
    id: 'q2',
    question: 'What is the best possible CHSH win rate for classical players?',
    options: ['50%', '75%', '85.4%', '100%'],
    answer: 1,
    explanation:
      'No classical strategy — shared randomness included — beats 3/4. Quantum players reach cos²(π/8) ≈ 85.4% using entanglement.',
  },
  {
    id: 'q3',
    question: 'Two Hadamard gates in a row do what to a single qubit?',
    options: ['Nothing at all', 'Return it to its original state', 'Put it in a Bell state', 'Collapse it'],
    answer: 1,
    explanation: 'H is its own inverse: H·H = I. This is exactly the interference trick at the heart of many algorithms.',
  },
  {
    id: 'q4',
    question: 'Why is BB84 secure against eavesdropping?',
    options: [
      'The key is mathematically hard to factor',
      'The no-cloning theorem means any interception disturbs the qubits',
      'The photons travel faster than light',
      'It uses a one-time pad',
    ],
    answer: 1,
    explanation:
      'An eavesdropper cannot copy an unknown quantum state, so measuring it leaves statistical fingerprints. Alice and Bob detect the disturbance in the error rate.',
  },
  {
    id: 'q5',
    question: "Shor's algorithm threatens which kind of cryptography?",
    options: ['Symmetric ciphers only', 'Public-key systems such as RSA and elliptic curves', 'Hash functions only', 'None — it is only theoretical'],
    answer: 1,
    explanation:
      'Shor factors integers and solves discrete logs in polynomial time, breaking RSA and elliptic-curve cryptography. Symmetric ciphers face only a quadratic speed-up from Grover.',
  },
];
