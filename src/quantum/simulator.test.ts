import { describe, expect, it } from 'vitest';
import {
  CHSH_ANGLES,
  CHSH_CLASSICAL_MAX,
  bellState,
  chshQuantumWinRate,
  chshWinRate,
  correlation,
  correlationExact,
  createState,
  distance,
  hadamard,
  makeRng,
  measure,
  pauliX,
  probabilities,
  sameProbability,
  toBitString,
} from './simulator';

const TOL = 1e-9;

describe('statevector simulator', () => {
  it('starts in |00...0> and normalises probabilities', () => {
    const s = createState(2);
    expect(probabilities(s)).toEqual([1, 0, 0, 0]);
  });

  it('two Hadamards return the original state (H is its own inverse)', () => {
    const start = createState(1);
    const once = hadamard(start, 0);
    const twice = hadamard(once, 0);

    // H|0> = (|0> + |1>)/sqrt(2)
    expect(distance(once[0], { re: Math.SQRT1_2, im: 0 })).toBeLessThan(TOL);
    expect(distance(once[1], { re: Math.SQRT1_2, im: 0 })).toBeLessThan(TOL);

    // H H |0> = |0>
    expect(distance(twice[0], start[0])).toBeLessThan(TOL);
    expect(distance(twice[1], start[1])).toBeLessThan(TOL);
  });

  it('H H = I on every basis state of a 3-qubit register', () => {
    for (let basis = 0; basis < 8; basis++) {
      const s = createState(3).map(() => ({ re: 0, im: 0 }));
      s[basis] = { re: 1, im: 0 };
      const round = hadamard(hadamard(s, 1), 1);
      s.forEach((amp, i) => expect(distance(round[i], amp)).toBeLessThan(TOL));
    }
  });

  it('X flips |0> to |1>', () => {
    const s = pauliX(createState(1), 0);
    expect(probabilities(s)).toEqual([0, 1]);
  });

  it('the Bell state only ever yields 00 or 11', () => {
    const rng = makeRng(20261010);
    const seen = new Set<string>();
    for (let i = 0; i < 5000; i++) {
      const { outcome } = measure(bellState(), rng);
      seen.add(toBitString(outcome, 2));
    }
    expect([...seen].sort()).toEqual(['00', '11']);
  });

  it('the Bell state is maximally correlated at equal angles', () => {
    // P(same) = cos^2(0) = 1 -> correlation = +1
    expect(sameProbability(0.7, 0.7)).toBeCloseTo(1, 12);
    expect(correlationExact(0.7, 0.7)).toBeCloseTo(1, 12);

    // Monte-Carlo sanity check with a fixed seed.
    const rng = makeRng(7);
    expect(correlation(0.4, 0.4, 20000, rng)).toBeGreaterThan(0.99);
  });

  it('follows P(same) = cos^2(angleA - angleB)', () => {
    const pairs: Array<[number, number]> = [
      [0, Math.PI / 8],
      [Math.PI / 4, Math.PI / 8],
      [0, Math.PI / 2],
      [1.1, -0.4],
      [0.3, 2.9],
    ];
    for (const [a, b] of pairs) {
      const expected = Math.cos(a - b) ** 2;
      expect(sameProbability(a, b)).toBeCloseTo(expected, 12);
      // And the Monte-Carlo estimate should land near it.
      const rng = makeRng(Math.round((a + b) * 1000) + 1);
      expect(correlation(a, b, 40000, rng)).toBeCloseTo(correlationExact(a, b), 1);
    }
  });

  it('reproduces the quantum CHSH win rate of about 0.854', () => {
    // The analytic optimum is cos^2(pi/8).
    expect(chshQuantumWinRate()).toBeCloseTo(Math.cos(Math.PI / 8) ** 2, 12);
    expect(chshQuantumWinRate()).toBeCloseTo(0.853553, 5);

    const rng = makeRng(4242);
    const rate = chshWinRate(200000, rng, true);
    expect(rate).toBeGreaterThan(0.845);
    expect(rate).toBeLessThan(0.862);
    expect(rate).toBeCloseTo(0.8536, 2);
  });

  it('confirms the classical CHSH ceiling is 3/4', () => {
    expect(CHSH_CLASSICAL_MAX).toBe(0.75);
    const rng = makeRng(99);
    expect(chshWinRate(100000, rng, false)).toBeCloseTo(0.75, 2);
  });

  it('beats the classical bound: quantum strictly greater than 0.75', () => {
    expect(chshQuantumWinRate()).toBeGreaterThan(CHSH_CLASSICAL_MAX);
    // Alice's and Bob's angles are the ones that make every case optimal.
    expect(sameProbability(CHSH_ANGLES.A0, CHSH_ANGLES.B0)).toBeCloseTo(0.853553, 5);
    expect(1 - sameProbability(CHSH_ANGLES.A1, CHSH_ANGLES.B1)).toBeCloseTo(0.853553, 5);
  });
});
