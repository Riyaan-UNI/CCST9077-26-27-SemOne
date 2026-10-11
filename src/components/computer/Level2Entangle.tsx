import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link2, Ruler, RotateCcw } from 'lucide-react';
import {
  createState,
  hadamard,
  measure,
  cnot,
  probabilities,
  toBitString,
} from '@/quantum/simulator';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

export default function Level2Entangle() {
  const react = useStore((s) => s.react);
  const [state, setState] = useState(() => createState(2));
  const [entangled, setEntangled] = useState(false);
  const [measurements, setMeasurements] = useState<number[]>([]);
  const [lastOutcome, setLastOutcome] = useState<number | null>(null);

  const probs = useMemo(() => probabilities(state), [state]);

  const doEntangle = () => {
    const s = cnot(hadamard(createState(2), 0), 0, 1);
    setState(s);
    setEntangled(true);
    setMeasurements([]);
    setLastOutcome(null);
    react('excited', 'Entangled! The two qubits are now a Bell pair.');
  };

  const doMeasure = () => {
    const result = measure(state);
    setState(result.state);
    setLastOutcome(result.outcome);
    setMeasurements((prev) => [...prev, result.outcome]);
    const bits = toBitString(result.outcome, 2);
    react('happy', `Measured |${bits}⟩.`);
  };

  const reset = () => {
    setState(createState(2));
    setEntangled(false);
    setMeasurements([]);
    setLastOutcome(null);
  };

  const counts = [0, 1, 2, 3].map((i) => measurements.filter((m) => m === i).length);
  const chartData = [
    { label: '|00⟩', count: counts[0] },
    { label: '|01⟩', count: counts[1] },
    { label: '|10⟩', count: counts[2] },
    { label: '|11⟩', count: counts[3] },
  ];

  return (
    <div className="space-y-6">
      {/* two boxes */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="ui-label text-neon">Qubit A</p>
            {entangled && <span className="text-xs text-neon">● Entangled</span>}
          </div>
          <div className="relative mt-4 grid h-36 place-items-center rounded-xl border border-line bg-[#070b09]">
            <div className="crt-lines pointer-events-none absolute inset-0 rounded-xl opacity-40" />
            <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
            <div
              className={cn(
                'absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full transition-all',
                entangled ? 'left-1/2 -translate-x-1/2 blur-sm opacity-60' : 'left-[15%]',
              )}
              style={{
                backgroundColor: 'var(--neon)',
                boxShadow: '0 0 16px var(--neon)',
                left: entangled ? 'calc(50% - 1.25rem)' : `${15 + probs[0] * 55 + probs[1] * 55}%`,
              }}
            />
            <span className="absolute bottom-2 left-3 font-mono text-xs text-muted">|0⟩</span>
            <span className="absolute bottom-2 right-3 font-mono text-xs text-muted">|1⟩</span>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-lg border border-line bg-elevated px-3 py-2 text-center">
              <p className="font-mono text-sm text-neon">{(probs[0] + probs[1]).toFixed(2)}</p>
              <p className="text-xs text-muted">P(A=0)</p>
            </div>
            <div className="flex-1 rounded-lg border border-line bg-elevated px-3 py-2 text-center">
              <p className="font-mono text-sm text-cyan">{(probs[2] + probs[3]).toFixed(2)}</p>
              <p className="text-xs text-muted">P(A=1)</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="ui-label text-neon">Qubit B</p>
            {entangled && <span className="text-xs text-neon">● Entangled</span>}
          </div>
          <div className="relative mt-4 grid h-36 place-items-center rounded-xl border border-line bg-[#070b09]">
            <div className="crt-lines pointer-events-none absolute inset-0 rounded-xl opacity-40" />
            <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
            <div
              className={cn(
                'absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full transition-all',
                entangled ? 'left-1/2 -translate-x-1/2 blur-sm opacity-60' : 'left-[15%]',
              )}
              style={{
                backgroundColor: 'var(--neon)',
                boxShadow: '0 0 16px var(--neon)',
                left: entangled ? 'calc(50% - 1.25rem)' : `${15 + probs[0] * 55 + probs[2] * 55}%`,
              }}
            />
            <span className="absolute bottom-2 left-3 font-mono text-xs text-muted">|0⟩</span>
            <span className="absolute bottom-2 right-3 font-mono text-xs text-muted">|1⟩</span>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-lg border border-line bg-elevated px-3 py-2 text-center">
              <p className="font-mono text-sm text-neon">{(probs[0] + probs[2]).toFixed(2)}</p>
              <p className="text-xs text-muted">P(B=0)</p>
            </div>
            <div className="flex-1 rounded-lg border border-line bg-elevated px-3 py-2 text-center">
              <p className="font-mono text-sm text-cyan">{(probs[1] + probs[3]).toFixed(2)}</p>
              <p className="text-xs text-muted">P(B=1)</p>
            </div>
          </div>
        </div>
      </div>

      {/* entanglement link visual */}
      {entangled && (
        <div className="flex items-center justify-center gap-2 text-sm text-neon">
          <Link2 size={16} aria-hidden="true" />
          <span>The two qubits are linked. Measuring one instantly tells you about the other.</span>
        </div>
      )}

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={doEntangle}
          disabled={entangled}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110 disabled:opacity-50"
        >
          <Link2 size={17} aria-hidden="true" />
          Entangle
        </button>
        <button
          type="button"
          onClick={doMeasure}
          disabled={!entangled}
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon disabled:opacity-40"
        >
          <Ruler size={17} aria-hidden="true" />
          Measure both
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-neon hover:text-neon"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
        <span className="font-mono text-xs text-muted">{measurements.length} measurements</span>
      </div>

      {/* histogram */}
      {measurements.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Measurement histogram</p>
          <p className="mt-1 text-sm text-muted">
            A Bell pair should only ever give |00⟩ or |11⟩. You should never see |01⟩ or |10⟩.
          </p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 4, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-sans)' }}
                  axisLine={{ stroke: 'var(--line)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--muted)', fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <RTooltip
                  contentStyle={{
                    background: 'var(--elevated)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    color: 'var(--ink)',
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="count" fill="var(--neon)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {lastOutcome !== null && (
            <p className="mt-3 font-mono text-sm text-ink-soft">
              Last outcome: |{toBitString(lastOutcome, 2)}⟩
            </p>
          )}
        </div>
      )}

      {/* explanation */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="ui-label text-neon">What entanglement does</p>
          <p className="mt-2 text-sm text-ink-soft">
            When you entangle two qubits, they become a single system. Measuring one qubit
            immediately collapses the other to match — even if they were on opposite sides of the
            galaxy.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="ui-label text-neon">What it does NOT do</p>
          <p className="mt-2 text-sm text-ink-soft">
            You cannot use entanglement to send a message. The correlation only shows up when you
            compare both results later, using a classical channel.
          </p>
        </div>
      </div>
    </div>
  );
}
