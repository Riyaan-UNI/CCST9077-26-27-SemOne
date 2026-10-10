import { Suspense, lazy, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import confetti from 'canvas-confetti';
import { RotateCcw, Ruler, Trash2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Skeleton from '@/components/Skeleton';
import {
  applyGate,
  applyS,
  applyT,
  cnot,
  createState,
  GATES,
  magnitude,
  measure,
  probabilities,
  toBitString,
  type StateVector,
} from '@/quantum/simulator';
import { useStore } from '@/store/useStore';

const BlochSphere = lazy(() => import('@/components/lab/BlochSphere'));

type GateName = 'H' | 'X' | 'Z' | 'S' | 'T' | 'CNOT';

interface Op {
  id: number;
  gate: GateName;
  target: number;
  control: number;
}

interface Preset {
  id: string;
  label: string;
  qubits: number;
  build: () => Op[];
}

let opCounter = 0;
const op = (gate: GateName, target: number, control = 0): Op => ({
  id: ++opCounter,
  gate,
  target,
  control,
});

const PRESETS: Preset[] = [
  { id: 'h', label: 'Superposition', qubits: 1, build: () => [op('H', 0)] },
  { id: 'hh', label: 'H · H = I', qubits: 1, build: () => [op('H', 0), op('H', 0)] },
  { id: 'phase', label: 'Phase kick', qubits: 1, build: () => [op('H', 0), op('Z', 0), op('H', 0)] },
  { id: 'bell', label: 'Bell pair', qubits: 2, build: () => [op('H', 0), op('CNOT', 1, 0)] },
  {
    id: 'ghz',
    label: 'GHZ state',
    qubits: 3,
    build: () => [op('H', 0), op('CNOT', 1, 0), op('CNOT', 2, 1)],
  },
];

function runOps(numQubits: number, ops: Op[]): StateVector {
  return ops.reduce((state, o) => {
    if (o.gate === 'CNOT') return cnot(state, o.control, o.target, numQubits);
    if (o.gate === 'S') return applyS(state, o.target, numQubits);
    if (o.gate === 'T') return applyT(state, o.target, numQubits);
    return applyGate(state, GATES[o.gate], o.target, numQubits);
  }, createState(numQubits));
}

export default function Simulator() {
  const [numQubits, setNumQubits] = useState(2);
  const [ops, setOps] = useState<Op[]>(PRESETS[3].build());
  const [measured, setMeasured] = useState<number | null>(null);
  const [target, setTarget] = useState(0);
  const [control, setControl] = useState(0);
  const react = useStore((s) => s.react);
  const reduceMotion = useStore((s) => s.reduceMotion);

  const state = useMemo(() => runOps(numQubits, ops), [numQubits, ops]);
  const probs = useMemo(() => probabilities(state), [state]);

  const chartData = useMemo(
    () =>
      probs.map((p, i) => ({
        label: `|${toBitString(i, numQubits)}⟩`,
        probability: Number(p.toFixed(4)),
      })),
    [probs, numQubits],
  );

  const bloch = useMemo(() => {
    if (numQubits !== 1) return null;
    const a0 = state[0];
    const a1 = state[1];
    const cross = {
      re: a0.re * a1.re + a0.im * a1.im,
      im: a0.re * a1.im - a0.im * a1.re,
    };
    return {
      x: 2 * cross.re,
      y: 2 * cross.im,
      z: magnitude(a0) ** 2 - magnitude(a1) ** 2,
    };
  }, [state, numQubits]);

  function addOp(gate: GateName) {
    if (gate === 'CNOT') {
      if (numQubits < 2) {
        react('surprised', 'CNOT needs two qubits. Add one.');
        return;
      }
      if (control === target) {
        react('thinking', 'Control and target must differ.');
        return;
      }
    }
    setOps((prev) => [...prev, op(gate, target, control)]);
    setMeasured(null);
    react('happy', gate === 'CNOT' ? 'Entangling…' : `${gate} gate applied.`);
  }

  function reset() {
    setOps([]);
    setMeasured(null);
  }

  function loadPreset(p: Preset) {
    setNumQubits(p.qubits);
    setOps(p.build());
    setMeasured(null);
    setTarget(0);
    setControl(0);
    react('excited', `${p.label}. Let's get entangled!`);
  }

  function doMeasure() {
    const result = measure(state);
    setMeasured(result.outcome);
    const isEntangled = ops.some((o) => o.gate === 'CNOT') && ops.some((o) => o.gate === 'H');
    if (isEntangled && !reduceMotion) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39FF14', '#5BE3FF', '#F6F1E4'],
        disableForReducedMotion: true,
      });
    }
    react(
      isEntangled ? 'excited' : 'surprised',
      `Collapsed to |${toBitString(result.outcome, numQubits)}⟩.`,
    );
  }

  const qubitIndexes = Array.from({ length: numQubits }, (_, i) => i);

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      {/* ---------------- controls ---------------- */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Register</p>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setNumQubits(n);
                  setOps([]);
                  setMeasured(null);
                  setTarget(0);
                  setControl(0);
                }}
                className={cn(
                  'flex-1 rounded-xl border px-3 py-2 text-sm transition',
                  numQubits === n
                    ? 'border-neon bg-neon text-neon-ink'
                    : 'border-line text-ink-soft hover:border-line-strong hover:text-neon',
                )}
              >
                {n} qubit{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Gates</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(['H', 'X', 'Z', 'S', 'T'] as GateName[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => addOp(g)}
                className="rounded-xl border border-line py-2.5 font-mono text-lg text-ink-soft transition hover:border-neon hover:text-neon"
              >
                {g}
              </button>
            ))}
            <button
              type="button"
              onClick={() => addOp('CNOT')}
              className="rounded-xl border border-line py-2.5 font-mono text-sm text-ink-soft transition hover:border-neon hover:text-neon"
            >
              CNOT
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-muted">
              Target qubit
              <select
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-line bg-elevated px-2 py-2 text-sm text-ink"
              >
                {qubitIndexes.map((q) => (
                  <option key={q} value={q}>
                    q{q}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-muted">
              Control (CNOT)
              <select
                value={control}
                onChange={(e) => setControl(Number(e.target.value))}
                disabled={numQubits < 2}
                className="mt-1 w-full rounded-lg border border-line bg-elevated px-2 py-2 text-sm text-ink disabled:opacity-50"
              >
                {qubitIndexes.map((q) => (
                  <option key={q} value={q}>
                    q{q}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Presets</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPreset(p)}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft transition hover:border-neon hover:text-neon"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={doMeasure}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 font-semibold text-neon-ink transition hover:brightness-110"
          >
            <Ruler size={17} aria-hidden="true" />
            Measure
          </button>
          <button
            type="button"
            onClick={() => {
              setOps((prev) => prev.slice(0, -1));
              setMeasured(null);
            }}
            disabled={ops.length === 0}
            aria-label="Undo last gate"
            className="grid h-12 w-12 place-items-center rounded-xl border border-line text-ink-soft transition hover:border-neon hover:text-neon disabled:opacity-40"
          >
            <Undo2 size={17} />
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Clear circuit"
            className="grid h-12 w-12 place-items-center rounded-xl border border-line text-ink-soft transition hover:border-neon hover:text-neon"
          >
            <Trash2 size={17} />
          </button>
          <button
            type="button"
            onClick={() => loadPreset(PRESETS[3])}
            aria-label="Reset to Bell pair"
            className="grid h-12 w-12 place-items-center rounded-xl border border-line text-ink-soft transition hover:border-neon hover:text-neon"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>

      {/* ---------------- output ---------------- */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="ui-label text-neon">Circuit</p>
            <p className="font-mono text-xs text-muted">{ops.length} gate{ops.length === 1 ? '' : 's'}</p>
          </div>

          <div className="mt-4 space-y-2">
            {qubitIndexes.map((q) => (
              <div key={q} className="flex items-center gap-3">
                <span className="w-6 font-mono text-xs text-muted">q{q}</span>
                <div className="relative flex h-9 flex-1 items-center gap-1.5 rounded-lg border border-line bg-elevated px-2">
                  {ops.length === 0 && (
                    <span className="font-mono text-xs text-muted">|0⟩</span>
                  )}
                  {ops.map((o) => {
                    const onThisWire = o.gate === 'CNOT' ? o.target === q || o.control === q : o.target === q;
                    if (!onThisWire) {
                      return <span key={o.id} className="h-px flex-1 bg-[var(--line)]" />;
                    }
                    const label =
                      o.gate === 'CNOT'
                        ? o.control === q
                          ? '●'
                          : '⊕'
                        : o.gate;
                    return (
                      <span
                        key={o.id}
                        className={cn(
                          'grid h-7 min-w-7 place-items-center rounded-md border px-1.5 font-mono text-xs',
                          o.gate === 'CNOT'
                            ? 'border-cyan text-cyan'
                            : 'border-line-strong text-neon',
                        )}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="ui-label text-neon">Amplitudes</p>
            <ul className="mt-4 space-y-2.5">
              {state.map((amp, i) => {
                const m = magnitude(amp);
                const phase = Math.atan2(amp.im, amp.re);
                return (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-14 font-mono text-sm text-ink-soft">
                      |{toBitString(i, numQubits)}⟩
                    </span>
                    <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-neon transition-[width] duration-500"
                        style={{ width: `${Math.min(100, m * 100)}%` }}
                      />
                    </span>
                    <span className="w-16 text-right font-mono text-xs text-muted">
                      {m.toFixed(3)}
                    </span>
                    <span className="w-16 text-right font-mono text-xs text-cyan">
                      {phase >= 0 ? '+' : ''}
                      {phase.toFixed(2)}r
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Magnitude is the bar; the cyan number is the phase in radians. Two states with identical
              bars but different phases behave completely differently when they interfere.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="ui-label text-neon">
                Measurement statistics
              </p>
              {measured !== null && (
                <span className="num rounded-full border border-neon px-3 py-1 text-sm text-neon">
                  collapsed → |{toBitString(measured, numQubits)}⟩
                </span>
              )}
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -22 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-sans)' }}
                    axisLine={{ stroke: 'var(--line)' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tick={{ fill: 'var(--muted)', fontSize: 13 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RTooltip
                    contentStyle={{
                      background: 'var(--elevated)',
                      border: '1px solid var(--line)',
                      borderRadius: 12,
                      color: 'var(--ink)',
                      fontSize: 13,
                    }}
                    formatter={(value) => [Number(value).toFixed(4), 'probability'] as [string, string]}
                  />
                  <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={measured === i ? 'var(--cyan)' : 'var(--neon)'}
                        opacity={measured === null || measured === i ? 1 : 0.35}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Each bar is the probability of that outcome. A Bell pair puts all its weight on |00⟩ and
              |11⟩ — the other two can never appear.
            </p>
          </div>
        </div>

        {numQubits === 1 && bloch && (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="ui-label text-neon">
                Bloch sphere
              </p>
              <p className="font-mono text-xs text-muted">
                x {bloch.x.toFixed(2)} · y {bloch.y.toFixed(2)} · z {bloch.z.toFixed(2)}
              </p>
            </div>
            <div className="mt-4">
              <Suspense fallback={<Skeleton className="h-[22rem] w-full" />}>
                <BlochSphere x={bloch.x} y={bloch.y} z={bloch.z} />
              </Suspense>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Drag to rotate. The vector points at your state; the green pole is |0⟩, the blue pole is
              |1⟩.
            </p>
          </div>
        )}

        <p className="text-sm leading-relaxed text-muted">
          Running locally: a hand-written {numQubits}-qubit statevector simulator. Nothing is sent to
          a server, and the same engine is unit-tested in Vitest against the analytic results.
        </p>
      </div>
    </div>
  );
}
