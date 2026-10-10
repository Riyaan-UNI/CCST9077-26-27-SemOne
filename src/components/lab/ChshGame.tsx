import { useCallback, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Play, RotateCcw } from 'lucide-react';
import {
  CHSH_ANGLES,
  CHSH_CLASSICAL_MAX,
  chshQuantumWinRate,
  playChshClassical,
  playChshQuantum,
  type ChshTrial,
} from '@/quantum/simulator';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const BATCH = 400;

interface BatchPoint {
  batch: number;
  classical: number;
  quantum: number;
}

export default function ChshGame() {
  const [batches, setBatches] = useState<BatchPoint[]>([]);
  const [quantumWins, setQuantumWins] = useState(0);
  const [classicalWins, setClassicalWins] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [last, setLast] = useState<{ q: ChshTrial; c: ChshTrial } | null>(null);
  const react = useStore((s) => s.react);

  const optimal = useMemo(() => chshQuantumWinRate(), []);

  const runBatch = useCallback(
    (n = BATCH) => {
      let qw = 0;
      let cw = 0;
      let lastQ: ChshTrial | null = null;
      let lastC: ChshTrial | null = null;
      for (let i = 0; i < n; i++) {
        const q = playChshQuantum();
        const c = playChshClassical();
        if (q.win) qw++;
        if (c.win) cw++;
        lastQ = q;
        lastC = c;
      }
      const newQuantum = quantumWins + qw;
      const newClassical = classicalWins + cw;
      const newRounds = rounds + n;

      setQuantumWins(newQuantum);
      setClassicalWins(newClassical);
      setRounds(newRounds);
      setBatches((prev) => [
        ...prev,
        {
          batch: prev.length + 1,
          classical: Number(((newClassical / newRounds) * 100).toFixed(2)),
          quantum: Number(((newQuantum / newRounds) * 100).toFixed(2)),
        },
      ]);
      if (lastQ && lastC) setLast({ q: lastQ, c: lastC });

      if (newRounds >= 2000 && newQuantum / newRounds > CHSH_CLASSICAL_MAX) {
        react('excited', 'Quantum beats the classical ceiling. Again.');
      } else {
        react('curious', `${n} rounds played.`);
      }
    },
    [classicalWins, quantumWins, react, rounds],
  );

  function reset() {
    setBatches([]);
    setQuantumWins(0);
    setClassicalWins(0);
    setRounds(0);
    setLast(null);
  }

  const qRate = rounds ? (quantumWins / rounds) * 100 : 0;
  const cRate = rounds ? (classicalWins / rounds) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* rules */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">1 · The referee</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Sends a random bit x to Alice and a random bit y to Bob. Neither knows the other's bit, and
            they cannot communicate.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">2 · The answers</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Alice replies a, Bob replies b — each a single bit. They may agree on a strategy in
            advance, and share randomness.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">3 · Winning</p>
          <p className="mt-3 font-mono text-sm text-ink-soft">a ⊕ b = x ∧ y</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Only the (1,1) case demands different answers. That single case is what limits every
            classical strategy to 75%.
          </p>
        </div>
      </div>

      {/* scoreboard */}
      <div className="grid gap-5 md:grid-cols-2">
        {[
          {
            key: 'classical',
            title: 'Classical strategy',
            sub: 'Both always answer 0 — the best shared-randomness plan',
            rate: cRate,
            ceiling: 75,
            tone: 'var(--era-codes)',
          },
          {
            key: 'quantum',
            title: 'Quantum strategy',
            sub: `Angles A = 0, ${(CHSH_ANGLES.A1 / Math.PI).toFixed(2)}π · B = ${(CHSH_ANGLES.B0 / Math.PI).toFixed(2)}π, −${(Math.abs(CHSH_ANGLES.B1) / Math.PI).toFixed(2)}π`,
            rate: qRate,
            ceiling: optimal * 100,
            tone: 'var(--neon)',
          },
        ].map((s) => (
          <div key={s.key} className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-lg">{s.title}</p>
              <p className="font-mono text-3xl" style={{ color: s.tone }}>
                {s.rate.toFixed(1)}%
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">{s.sub}</p>
            <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-elevated">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
                style={{ width: `${s.rate}%`, backgroundColor: s.tone }}
              />
              <div
                className="absolute inset-y-0 w-px bg-ink/60"
                style={{ left: `${s.ceiling}%` }}
                title={`Theoretical ceiling: ${s.ceiling.toFixed(2)}%`}
              />
            </div>
            <p className="mt-2 text-sm text-muted">
              Ceiling: {s.ceiling.toFixed(2)}%
              {s.key === 'quantum' && ' = cos²(π/8)'}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => runBatch()}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
        >
          <Play size={17} aria-hidden="true" />
          Play {BATCH} rounds
        </button>
        <button
          type="button"
          onClick={() => runBatch(4000)}
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon"
        >
          Fast-forward 4,000
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={rounds === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-neon hover:text-neon disabled:opacity-40"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
        <span className="font-mono text-xs text-muted">{rounds.toLocaleString()} rounds played</span>
      </div>

      {/* convergence chart */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="ui-label text-neon">
          Cumulative win rate
        </p>
        <div className="mt-4 h-72">
          {batches.length === 0 ? (
            <div className="grid h-full place-items-center text-sm text-muted">
              Press play — the quantum line should settle near 85.4%, the classical one near 75%.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batches} margin={{ top: 8, right: 8, bottom: 4, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis
                  dataKey="batch"
                  tick={{ fill: 'var(--muted)', fontSize: 13 }}
                  axisLine={{ stroke: 'var(--line)' }}
                  tickLine={false}
                  label={{
                    value: 'batch of 400',
                    position: 'insideBottomRight',
                    offset: -2,
                    fill: 'var(--muted)',
                    fontSize: 12,
                  }}
                />
                <YAxis
                  domain={[60, 95]}
                  unit="%"
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
                  formatter={(value) => `${Number(value)}%`}
                />
                <Legend wrapperStyle={{ fontSize: 13, color: 'var(--muted)' }} />
                <Bar dataKey="classical" name="Classical" fill="var(--era-codes)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="quantum" name="Quantum" fill="var(--neon)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* last round */}
      {last && (
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-neon">Last round</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Quantum', trial: last.q, tone: 'var(--neon)' },
              { label: 'Classical', trial: last.c, tone: 'var(--era-codes)' },
            ].map(({ label, trial, tone }) => (
              <div key={label} className="rounded-xl border border-line bg-elevated p-4">
                <p className="text-sm font-semibold" style={{ color: tone }}>
                  {label}
                </p>
                <p className="mt-2 font-mono text-sm text-ink-soft">
                  x = {trial.x}, y = {trial.y} → a = {trial.a}, b = {trial.b}
                </p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {trial.a} ⊕ {trial.b} = {trial.a ^ trial.b} · x ∧ y = {trial.x & trial.y}
                </p>
                <p
                  className={cn(
                    'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    trial.win
                      ? 'bg-verdict-fact/15 text-verdict-fact'
                      : 'bg-verdict-myth/15 text-verdict-myth',
                  )}
                >
                  {trial.win ? 'Win' : 'Lose'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
