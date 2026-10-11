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
  CHSH_CLASSICAL_MAX,
  chshQuantumWinRate,
  playChshClassical,
  playChshQuantum,
  type ChshTrial,
} from '@/quantum/simulator';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const BATCH = 400;

type Part = 1 | 2 | 3;

interface BatchPoint {
  batch: number;
  classical: number;
  quantum: number;
}

export default function ChshGame() {
  const [part, setPart] = useState<Part>(1);
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
      {/* part tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { n: 1 as Part, label: 'Part 1 · Beat the odds' },
          { n: 2 as Part, label: 'Part 2 · Flip the quantum trick' },
          { n: 3 as Part, label: 'Part 3 · So what?' },
        ]).map((p) => (
          <button
            key={p.n}
            type="button"
            onClick={() => setPart(p.n)}
            className={cn(
              'rounded-xl border px-4 py-2 text-sm transition',
              part === p.n
                ? 'border-neon bg-neon text-neon-ink'
                : 'border-line text-ink-soft hover:border-line-strong',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {part === 1 && (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="ui-label text-neon">1 · The referee</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Sends a random bit x to Alice and a random bit y to Bob. Neither knows the other's
                bit, and they cannot communicate.
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

          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="ui-label text-era-codes">Classical strategy · both always answer 0</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              This is the best any classical team can do. They win when (x,y) is (0,0), (0,1) or
              (1,0) — three out of four cases. No amount of cleverness beats this ceiling.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => runBatch(1000)}
                className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
              >
                <Play size={17} aria-hidden="true" />
                Run 1,000 rounds
              </button>
              <button
                type="button"
                onClick={() => runBatch(4000)}
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon"
              >
                Fast-forward 4,000
              </button>
            </div>
            {rounds > 0 && (
              <div className="mt-4 rounded-xl border border-line bg-elevated p-4">
                <p className="font-mono text-2xl text-era-codes">{cRate.toFixed(1)}%</p>
                <p className="text-sm text-muted">Classical win rate · ceiling = 75%</p>
              </div>
            )}
          </div>
        </div>
      )}

      {part === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="ui-label text-neon">The quantum trick</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Alice and Bob share an entangled Bell pair before the game starts. When the referee
              sends a question, each measures their photon at a specific angle. The angles are
              chosen so that every case wins with probability cos²(π/8) ≈ 85.4%.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-elevated p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">Alice's angles</p>
                <p className="mt-1 font-mono text-sm text-ink-soft">
                  Q=1: 0° · Q=2: 45°
                </p>
              </div>
              <div className="rounded-xl border border-line bg-elevated p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">Bob's angles</p>
                <p className="mt-1 font-mono text-sm text-ink-soft">
                  Q=1: 22.5° · Q=2: −22.5°
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-display text-lg">Classical strategy</p>
                <p className="font-mono text-3xl" style={{ color: 'var(--era-codes)' }}>
                  {cRate.toFixed(1)}%
                </p>
              </div>
              <p className="mt-1 text-sm text-muted">Both always answer 0 — the best shared-randomness plan</p>
              <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-elevated">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
                  style={{ width: `${cRate}%`, backgroundColor: 'var(--era-codes)' }}
                />
                <div className="absolute inset-y-0 w-px bg-ink/60" style={{ left: '75%' }} />
              </div>
              <p className="mt-2 text-sm text-muted">Ceiling: 75%</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-display text-lg">Quantum strategy</p>
                <p className="font-mono text-3xl text-neon">{qRate.toFixed(1)}%</p>
              </div>
              <p className="mt-1 text-sm text-muted">
                Angles A = 0, π/4 · B = π/8, −π/8
              </p>
              <div className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-elevated">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
                  style={{ width: `${qRate}%`, backgroundColor: 'var(--neon)' }}
                />
                <div className="absolute inset-y-0 w-px bg-ink/60" style={{ left: `${optimal * 100}%` }} />
              </div>
              <p className="mt-2 text-sm text-muted">Ceiling: {(optimal * 100).toFixed(2)}% = cos²(π/8)</p>
            </div>
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
            <p className="ui-label text-neon">Cumulative win rate</p>
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
                    <YAxis domain={[60, 95]} unit="%" tick={{ fill: 'var(--muted)', fontSize: 13 }} axisLine={false} tickLine={false} />
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

          {last && (
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="ui-label text-neon">Last round</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Quantum', trial: last.q, tone: 'var(--neon)' },
                  { label: 'Classical', trial: last.c, tone: 'var(--era-codes)' },
                ].map(({ label, trial, tone }) => (
                  <div key={label} className="rounded-xl border border-line bg-elevated p-4">
                    <p className="text-sm font-semibold" style={{ color: tone }}>{label}</p>
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
      )}

      {part === 3 && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="ui-label text-neon">What the game proves</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The CHSH game shows that the world is not "locally real." Einstein assumed two things:
              realism (particles have definite properties before measurement) and locality (no
              influence travels faster than light). Bell's theorem says any theory with both must
              lose the CHSH game at most 75% of the time. Quantum mechanics wins about 85.4% — so
              at least one of Einstein's assumptions must be wrong.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-elevated p-4">
              <p className="ui-label text-era-theory">Bell 1964</p>
              <p className="mt-2 text-sm text-ink-soft">
                John Bell proved that no locally realistic theory can reproduce all quantum
                predictions. The CHSH inequality is the practical version.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-elevated p-4">
              <p className="ui-label text-era-theory">Aspect 1980s · loophole-free 2015</p>
              <p className="mt-2 text-sm text-ink-soft">
                Alain Aspect's early experiments first violated Bell's bound. By 2015, three groups
                closed the last major loopholes.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-elevated p-4">
              <p className="ui-label text-era-theory">2022 Nobel Prize</p>
              <p className="mt-2 text-sm text-ink-soft">
                Aspect, Clauser and Zeilinger shared the Physics Nobel for experiments with entangled
                photons, establishing the violation of Bell inequalities.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="ui-label text-hype-amber">What it does NOT show</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hype-amber" aria-hidden="true" />
                It does not prove "spooky action" sends messages faster than light.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hype-amber" aria-hidden="true" />
                It does not prove consciousness creates reality.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hype-amber" aria-hidden="true" />
                It does not prove every particle is secretly connected to every other.
              </li>
            </ul>
            <p className="mt-3 text-sm text-muted">
              It proves only that the universe is not both local and realistic. Which assumption to
              drop is still debated — but the 85.4% win rate is not.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
