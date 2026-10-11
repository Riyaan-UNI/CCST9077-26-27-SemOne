import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Lightbulb, Trash2, Undo2 } from 'lucide-react';
import {
  applyGate,
  applyS,
  applyT,
  cnot,
  createState,
  GATES,
  probabilities,
  toBitString,
  type StateVector,
} from '@/quantum/simulator';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

type GateName = 'H' | 'X' | 'Z' | 'S' | 'T' | 'CNOT';

interface Op {
  id: number;
  gate: GateName;
  target: number;
  control: number;
}

interface Puzzle {
  id: string;
  title: string;
  description: string;
  hint: string;
  qubits: number;
  allowedGates: GateName[];
  goalType: 'measurement' | 'state';
  goalDescription: string;
  verify: (state: StateVector) => { pass: boolean; message: string };
}

let opCounter = 0;
const op = (gate: GateName, target: number, control = 0): Op => ({
  id: ++opCounter,
  gate,
  target,
  control,
});

function runOps(numQubits: number, ops: Op[]): StateVector {
  return ops.reduce((state, o) => {
    if (o.gate === 'CNOT') return cnot(state, o.control, o.target, numQubits);
    if (o.gate === 'S') return applyS(state, o.target, numQubits);
    if (o.gate === 'T') return applyT(state, o.target, numQubits);
    return applyGate(state, GATES[o.gate], o.target, numQubits);
  }, createState(numQubits));
}

const PUZZLES: Puzzle[] = [
  {
    id: 'double-shake',
    title: 'The double shake',
    description: 'Start with the ball on the left. Shake it twice. Where does it end up?',
    hint: 'A shake is a Hadamard (H). Two Hadamards cancel each other out: H·H = I.',
    qubits: 1,
    allowedGates: ['H'],
    goalType: 'measurement',
    goalDescription: 'Measurement should always return |0⟩ (left).',
    verify: (state) => {
      const probs = probabilities(state);
      const pass = probs[0] > 0.999;
      return { pass, message: pass ? 'Correct! Two shakes cancel out.' : `P(|0⟩) = ${probs[0].toFixed(3)} — not quite 1.` };
    },
  },
  {
    id: 'double-flip',
    title: 'Flip it twice',
    description: 'Start on the left. Flip it, then flip it again.',
    hint: 'A flip is Pauli-X. Two flips bring you back to where you started.',
    qubits: 1,
    allowedGates: ['X'],
    goalType: 'measurement',
    goalDescription: 'Measurement should always return |0⟩.',
    verify: (state) => {
      const probs = probabilities(state);
      const pass = probs[0] > 0.999;
      return { pass, message: pass ? 'Correct! Two flips cancel out.' : `P(|0⟩) = ${probs[0].toFixed(3)}` };
    },
  },
  {
    id: 'phase-kick',
    title: 'The phase kick',
    description: 'Start on the left. Shake, flip the phase, then shake again. Where do you land?',
    hint: 'Shake (H), then Z, then shake (H) again. This sequence maps |0⟩ to |1⟩.',
    qubits: 1,
    allowedGates: ['H', 'Z'],
    goalType: 'measurement',
    goalDescription: 'Measurement should always return |1⟩ (right).',
    verify: (state) => {
      const probs = probabilities(state);
      const pass = probs[1] > 0.999;
      return { pass, message: pass ? 'Correct! H·Z·H = X, which flips |0⟩ to |1⟩.' : `P(|1⟩) = ${probs[1].toFixed(3)}` };
    },
  },
  {
    id: 'bell-pair',
    title: 'Create a Bell pair',
    description: 'Entangle two qubits so that measuring both always gives the same answer.',
    hint: 'Apply H to qubit 0, then CNOT with qubit 0 as control and qubit 1 as target.',
    qubits: 2,
    allowedGates: ['H', 'CNOT'],
    goalType: 'measurement',
    goalDescription: 'Measurement should only ever give |00⟩ or |11⟩.',
    verify: (state) => {
      const probs = probabilities(state);
      const pass = probs[0] > 0.49 && probs[0] < 0.51 && probs[3] > 0.49 && probs[3] < 0.51 && probs[1] < 0.001 && probs[2] < 0.001;
      return {
        pass,
        message: pass
          ? 'Correct! You made a Bell pair: (|00⟩ + |11⟩)/√2.'
          : `P(|00⟩) = ${probs[0].toFixed(3)}, P(|11⟩) = ${probs[3].toFixed(3)} — need both ≈ 0.5 and others ≈ 0.`,
      };
    },
  },
  {
    id: 'ghz',
    title: 'Three-qubit entanglement',
    description: 'Entangle three qubits so they all agree: only |000⟩ or |111⟩.',
    hint: 'H on qubit 0, then CNOT(0,1), then CNOT(1,2).',
    qubits: 3,
    allowedGates: ['H', 'CNOT'],
    goalType: 'measurement',
    goalDescription: 'Measurement should only ever give |000⟩ or |111⟩.',
    verify: (state) => {
      const probs = probabilities(state);
      const pass = probs[0] > 0.49 && probs[0] < 0.51 && probs[7] > 0.49 && probs[7] < 0.51 &&
        probs.slice(1, 7).every((p) => p < 0.001);
      return {
        pass,
        message: pass
          ? 'Correct! You made a GHZ state.'
          : `P(|000⟩) = ${probs[0].toFixed(3)}, P(|111⟩) = ${probs[7].toFixed(3)}`,
      };
    },
  },
];

export default function Level3Puzzles() {
  const react = useStore((s) => s.react);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [ops, setOps] = useState<Op[]>([]);
  const [target, setTarget] = useState(0);
  const [control, setControl] = useState(0);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const puzzle = PUZZLES[puzzleIndex];
  const state = useMemo(() => runOps(puzzle.qubits, ops), [puzzle.qubits, ops]);
  const probs = useMemo(() => probabilities(state), [state]);

  const addGate = (gate: GateName) => {
    if (gate === 'CNOT') {
      if (puzzle.qubits < 2) return;
      if (control === target) {
        react('thinking', 'Control and target must differ.');
        return;
      }
    }
    setOps((prev) => [...prev, op(gate, target, control)]);
    setChecked(false);
  };

  const removeOp = (id: number) => {
    setOps((prev) => prev.filter((o) => o.id !== id));
    setChecked(false);
  };

  const check = () => {
    const result = puzzle.verify(state);
    setChecked(true);
    react(result.pass ? 'excited' : 'thinking', result.message);
  };

  const reset = () => {
    setOps([]);
    setChecked(false);
    setShowHint(false);
  };

  const qubitIndexes = Array.from({ length: puzzle.qubits }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* puzzle selector */}
      <div className="flex flex-wrap gap-2">
        {PUZZLES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPuzzleIndex(i);
              reset();
            }}
            className={cn(
              'rounded-xl border px-4 py-2 text-sm transition',
              puzzleIndex === i
                ? 'border-neon bg-neon text-neon-ink'
                : 'border-line text-ink-soft hover:border-line-strong',
            )}
          >
            {i + 1}. {p.title}
          </button>
        ))}
      </div>

      {/* puzzle card */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-xl">{puzzle.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{puzzle.description}</p>
        <p className="mt-2 font-mono text-sm text-neon">Goal: {puzzle.goalDescription}</p>
      </div>

      {/* gate palette */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="ui-label text-neon">Gate palette</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {puzzle.allowedGates.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => addGate(g)}
              className="rounded-xl border border-line px-4 py-2 font-mono text-lg text-ink-soft transition hover:border-neon hover:text-neon"
            >
              {g}
            </button>
          ))}
        </div>
        {puzzle.qubits > 1 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-muted">
              Target qubit
              <select
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-line bg-elevated px-2 py-2 text-sm text-ink"
              >
                {qubitIndexes.map((q) => (
                  <option key={q} value={q}>q{q}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-muted">
              Control (CNOT)
              <select
                value={control}
                onChange={(e) => setControl(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-line bg-elevated px-2 py-2 text-sm text-ink"
              >
                {qubitIndexes.map((q) => (
                  <option key={q} value={q}>q{q}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* circuit */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <p className="ui-label text-neon">Your circuit</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOps((prev) => prev.slice(0, -1));
                setChecked(false);
              }}
              disabled={ops.length === 0}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition hover:border-neon hover:text-neon disabled:opacity-40"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onClick={reset}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition hover:border-neon hover:text-neon"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {qubitIndexes.map((q) => (
            <div key={q} className="flex items-center gap-3">
              <span className="w-6 font-mono text-xs text-muted">q{q}</span>
              <div className="relative flex h-9 flex-1 items-center gap-1.5 rounded-lg border border-line bg-elevated px-2">
                {ops.length === 0 && <span className="font-mono text-xs text-muted">|0⟩</span>}
                {ops.map((o) => {
                  const onThisWire = o.gate === 'CNOT' ? o.target === q || o.control === q : o.target === q;
                  if (!onThisWire) return <span key={o.id} className="h-px flex-1 bg-[var(--line)]" />;
                  const label = o.gate === 'CNOT' ? (o.control === q ? '●' : '⊕') : o.gate;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => removeOp(o.id)}
                      className={cn(
                        'grid h-7 min-w-7 place-items-center rounded-md border px-1.5 font-mono text-xs transition hover:bg-elevated',
                        o.gate === 'CNOT' ? 'border-cyan text-cyan' : 'border-line-strong text-neon',
                      )}
                      title="Click to remove"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* probabilities */}
      {ops.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">State probabilities</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {probs.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-16 font-mono text-sm text-ink-soft">
                  |{toBitString(i, puzzle.qubits)}⟩
                </span>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-neon transition-[width] duration-500"
                    style={{ width: `${Math.min(100, p * 100)}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-xs text-muted">
                  {(p * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* check + hint */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={check}
          disabled={ops.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110 disabled:opacity-50"
        >
          <Check size={17} aria-hidden="true" />
          Check solution
        </button>
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-neon hover:text-neon"
        >
          <Lightbulb size={15} aria-hidden="true" />
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-hype-amber/30 bg-hype-amber/10 p-4">
              <p className="text-sm text-ink-soft">{puzzle.hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {checked && (
        <div className="rounded-xl border border-line bg-elevated p-4">
          <p className="text-sm text-ink-soft">{puzzle.verify(state).message}</p>
        </div>
      )}
    </div>
  );
}
