/**
 * A small, dependency-free statevector simulator for up to 3 qubits.
 *
 * Design notes
 * ------------
 * - Qubit 0 is the MOST significant bit, so the binary representation of a basis
 *   index reads |q0 q1 ... qn-1> left to right. This keeps the UI honest.
 * - Amplitudes are kept in a flat array of complex numbers of length 2^n.
 * - Everything is pure: functions return new state vectors, they never mutate.
 *
 * The maths here is verified by `simulator.test.ts` (Vitest).
 */

export interface Complex {
  re: number;
  im: number;
}

/** Row-major 2x2 matrix of real numbers (all gates we need are real). */
export type Matrix2 = readonly [readonly [number, number], readonly [number, number]];

export type StateVector = Complex[];

export const MAX_QUBITS = 3;

/* ------------------------------------------------------------------ *
 * Complex helpers
 * ------------------------------------------------------------------ */

export const cx = (re: number, im = 0): Complex => ({ re, im });

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function mul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function scale(a: Complex, k: number): Complex {
  return { re: a.re * k, im: a.im * k };
}

export function magnitude(a: Complex): number {
  return Math.hypot(a.re, a.im);
}

/** |a - b| for complex numbers, used by the tests. */
export function distance(a: Complex, b: Complex): number {
  return Math.hypot(a.re - b.re, a.im - b.im);
}

/* ------------------------------------------------------------------ *
 * Register construction
 * ------------------------------------------------------------------ */

/** |00...0> */
export function createState(numQubits: number): StateVector {
  assertQubitCount(numQubits);
  const size = 1 << numQubits;
  const state: StateVector = Array.from({ length: size }, () => cx(0));
  state[0] = cx(1);
  return state;
}

export function assertQubitCount(n: number): void {
  if (!Number.isInteger(n) || n < 1 || n > MAX_QUBITS) {
    throw new RangeError(`numQubits must be an integer in 1..${MAX_QUBITS}, got ${n}`);
  }
}

export function numQubitsOf(state: StateVector): number {
  return Math.log2(state.length);
}

/* ------------------------------------------------------------------ *
 * Gates
 * ------------------------------------------------------------------ */

/**
 * Real-valued gates. S and T carry imaginary entries, so they live in their own
 * `applyS` / `applyT` helpers below.
 */
export const GATES: Record<'I' | 'X' | 'Z' | 'H', Matrix2> = {
  I: [
    [1, 0],
    [0, 1],
  ],
  X: [
    [0, 1],
    [1, 0],
  ],
  Z: [
    [1, 0],
    [0, -1],
  ],
  H: [
    [Math.SQRT1_2, Math.SQRT1_2],
    [Math.SQRT1_2, -Math.SQRT1_2],
  ],
};

/** The bit of `index` that belongs to qubit `q` (qubit 0 = most significant). */
export function bitOf(index: number, q: number, numQubits: number): number {
  return (index >> (numQubits - 1 - q)) & 1;
}

/**
 * Apply a single-qubit gate to `target`, returning a new state vector.
 * The gate is real-valued (H, X, Z, or a real rotation) which covers everything
 * this site needs.
 */
export function applyGate(
  state: StateVector,
  gate: Matrix2,
  target: number,
  numQubits = numQubitsOf(state),
): StateVector {
  const next: StateVector = state.map((c) => ({ ...c }));
  const size = state.length;
  const [[g00, g01], [g10, g11]] = gate;
  for (let i = 0; i < size; i++) {
    if (bitOf(i, target, numQubits) !== 0) continue;
    const j = i | (1 << (numQubits - 1 - target));
    const a = state[i];
    const b = state[j];
    next[i] = { re: g00 * a.re + g01 * b.re, im: g00 * a.im + g01 * b.im };
    next[j] = { re: g10 * a.re + g11 * b.re, im: g10 * a.im + g11 * b.im };
  }
  return next;
}

/** Controlled single-qubit gate: applies `gate` to `target` only when `control` is 1. */
export function applyControlledGate(
  state: StateVector,
  gate: Matrix2,
  control: number,
  target: number,
  numQubits = numQubitsOf(state),
): StateVector {
  if (control === target) throw new RangeError('control and target must differ');
  const next: StateVector = state.map((c) => ({ ...c }));
  const size = state.length;
  const [[g00, g01], [g10, g11]] = gate;
  for (let i = 0; i < size; i++) {
    if (bitOf(i, control, numQubits) !== 1) continue;
    if (bitOf(i, target, numQubits) !== 0) continue;
    const j = i | (1 << (numQubits - 1 - target));
    const a = state[i];
    const b = state[j];
    next[i] = { re: g00 * a.re + g01 * b.re, im: g00 * a.im + g01 * b.im };
    next[j] = { re: g10 * a.re + g11 * b.re, im: g10 * a.im + g11 * b.im };
  }
  return next;
}

export const hadamard = (s: StateVector, t: number, n = numQubitsOf(s)) => applyGate(s, GATES.H, t, n);
export const pauliX = (s: StateVector, t: number, n = numQubitsOf(s)) => applyGate(s, GATES.X, t, n);
export const pauliZ = (s: StateVector, t: number, n = numQubitsOf(s)) => applyGate(s, GATES.Z, t, n);
export const cnot = (s: StateVector, c: number, t: number, n = numQubitsOf(s)) =>
  applyControlledGate(s, GATES.X, c, t, n);
export const cz = (s: StateVector, c: number, t: number, n = numQubitsOf(s)) =>
  applyControlledGate(s, GATES.Z, c, t, n);

/** Rotation about the y-axis, R_y(2*theta) as a real matrix. */
export function ry(theta: number): Matrix2 {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  return [
    [c, -s],
    [s, c],
  ];
}

/** Phase gate S = diag(1, i). */
export function applyS(state: StateVector, target: number, numQubits = numQubitsOf(state)): StateVector {
  const next: StateVector = state.map((c) => ({ ...c }));
  const size = state.length;
  for (let i = 0; i < size; i++) {
    if (bitOf(i, target, numQubits) === 1) {
      // multiply by i: (a+bi) * i = -b + ai
      const a = next[i];
      next[i] = { re: -a.im, im: a.re };
    }
  }
  return next;
}

/** T gate = diag(1, e^{i pi/4}). */
export function applyT(state: StateVector, target: number, numQubits = numQubitsOf(state)): StateVector {
  const next: StateVector = state.map((c) => ({ ...c }));
  const size = state.length;
  const c = Math.SQRT1_2;
  for (let i = 0; i < size; i++) {
    if (bitOf(i, target, numQubits) === 1) {
      const a = next[i];
      next[i] = { re: c * (a.re - a.im), im: c * (a.re + a.im) };
    }
  }
  return next;
}

/* ------------------------------------------------------------------ *
 * Measurement
 * ------------------------------------------------------------------ */

export function probabilities(state: StateVector): number[] {
  const p = state.map((c) => c.re * c.re + c.im * c.im);
  const total = p.reduce((a, b) => a + b, 0);
  return total === 0 ? p : p.map((x) => x / total);
}

export type Rng = () => number;

/** Deterministic, seedable RNG (mulberry32) so tests are reproducible. */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sampleIndex(p: number[], rng: Rng = Math.random): number {
  const r = rng();
  let acc = 0;
  for (let i = 0; i < p.length; i++) {
    acc += p[i];
    if (r < acc) return i;
  }
  return p.length - 1;
}

export interface MeasurementResult {
  outcome: number;
  state: StateVector;
}

/** Measure every qubit, collapsing the state onto the observed basis vector. */
export function measure(state: StateVector, rng: Rng = Math.random): MeasurementResult {
  const outcome = sampleIndex(probabilities(state), rng);
  const collapsed: StateVector = state.map(() => cx(0));
  collapsed[outcome] = cx(1);
  return { outcome, state: collapsed };
}

export function toBitString(outcome: number, numQubits: number): string {
  return outcome.toString(2).padStart(numQubits, '0');
}

/* ------------------------------------------------------------------ *
 * Entanglement helpers (used by the CHSH game and the correlation tests)
 * ------------------------------------------------------------------ */

/** |Phi+> = (|00> + |11>) / sqrt(2) */
export function bellState(): StateVector {
  return [cx(Math.SQRT1_2), cx(0), cx(0), cx(Math.SQRT1_2)];
}

/**
 * Analytic probability that two measurements of |Phi+>, taken at angles `a` and
 * `b` (radians), return the SAME outcome bit: cos^2(a - b).
 */
export function sameProbability(a: number, b: number): number {
  const c = Math.cos(a - b);
  return c * c;
}

/** Analytic correlation E(a,b) = P(same) - P(diff) = cos(2(a - b)). */
export function correlationExact(a: number, b: number): number {
  return Math.cos(2 * (a - b));
}

/**
 * Simulate one joint measurement of a Bell pair along angles `a` and `b`.
 * Returns true when both detectors agree.
 */
export function measurePairAtAngles(a: number, b: number, rng: Rng = Math.random): boolean {
  const pSame = sameProbability(a, b);
  return rng() < pSame;
}

/** Monte-Carlo correlation, for tests and for the live demo. */
export function correlation(a: number, b: number, trials: number, rng: Rng = Math.random): number {
  let same = 0;
  for (let i = 0; i < trials; i++) if (measurePairAtAngles(a, b, rng)) same++;
  return (2 * same) / trials - 1;
}

/* ------------------------------------------------------------------ *
 * CHSH game
 * ------------------------------------------------------------------ */

/**
 * Optimal quantum strategy angles. Alice uses A0/A1, Bob uses B0/B1.
 * With these, all four (x,y) cases win with probability cos^2(pi/8).
 */
export const CHSH_ANGLES = {
  A0: 0,
  A1: Math.PI / 4,
  B0: Math.PI / 8,
  B1: -Math.PI / 8,
} as const;

/** Classical players can do no better than 3/4. */
export const CHSH_CLASSICAL_MAX = 0.75;

/** The quantum bound: cos^2(pi/8) ~= 0.853553. */
export function chshQuantumWinRate(): number {
  return sameProbability(CHSH_ANGLES.A0, CHSH_ANGLES.B0);
}

export interface ChshTrial {
  x: number;
  y: number;
  a: number;
  b: number;
  win: boolean;
}

/**
 * Play the CHSH game once using the optimal quantum strategy.
 * Win condition: a XOR b === (x AND y).
 */
export function playChshQuantum(rng: Rng = Math.random): ChshTrial {
  const x = rng() < 0.5 ? 0 : 1;
  const y = rng() < 0.5 ? 0 : 1;
  const angleA = x === 0 ? CHSH_ANGLES.A0 : CHSH_ANGLES.A1;
  const angleB = y === 0 ? CHSH_ANGLES.B0 : CHSH_ANGLES.B1;
  const same = measurePairAtAngles(angleA, angleB, rng);
  // "same" => a = b = 0; "different" => a = 1, b = 0 (a representative choice)
  const a = 0;
  const b = same ? 0 : 1;
  return { x, y, a, b, win: (a ^ b) === (x & y) };
}

/** Best classical strategy: both always answer 0, winning 3 of the 4 cases. */
export function playChshClassical(rng: Rng = Math.random): ChshTrial {
  const x = rng() < 0.5 ? 0 : 1;
  const y = rng() < 0.5 ? 0 : 1;
  const a = 0;
  const b = 0;
  return { x, y, a, b, win: (a ^ b) === (x & y) };
}

export function chshWinRate(trials: number, rng: Rng = Math.random, quantum = true): number {
  const play = quantum ? playChshQuantum : playChshClassical;
  let wins = 0;
  for (let i = 0; i < trials; i++) if (play(rng).win) wins++;
  return wins / trials;
}
