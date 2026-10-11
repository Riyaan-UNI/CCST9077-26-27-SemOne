import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

/**
 * Hypothesis Lab — the magic box with 100 trials.
 *
 * Open-only: the ball is either left (|0⟩) or right (|1⟩), about 50/50.
 * Shake-then-open: the shake is a coherent rotation; opening after a shake
 * always lands left (the rotation maps |0⟩ back to |0⟩ in this simplified toy).
 *
 * This is a classical *demonstration* of the idea, not a quantum simulation.
 */
export default function HypothesisLab() {
  const react = useStore((s) => s.react);
  const [mode, setMode] = useState<'open' | 'shake'>('open');
  const [results, setResults] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  const runTrials = (n = 100) => {
    setRunning(true);
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mode === 'open') {
        // Just open: 50/50
        out.push(Math.random() < 0.5 ? 0 : 1);
      } else {
        // Shake then open: always left (the "magic shake" is a coherent op)
        out.push(0);
      }
    }
    setResults((prev) => [...prev, ...out].slice(-200));
    setRunning(false);
    react(mode === 'open' ? 'surprised' : 'excited', `${n} trials done.`);
  };

  const reset = () => {
    setResults([]);
  };

  const leftCount = results.filter((r) => r === 0).length;
  const rightCount = results.filter((r) => r === 1).length;
  const total = results.length;

  return (
    <div className="space-y-6">
      {/* mode selector */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => { setMode('open'); reset(); }}
          className={cn(
            'rounded-xl border px-5 py-3 text-sm font-semibold transition',
            mode === 'open'
              ? 'border-neon bg-neon text-neon-ink'
              : 'border-line text-ink-soft hover:border-line-strong',
          )}
        >
          Open only
        </button>
        <button
          type="button"
          onClick={() => { setMode('shake'); reset(); }}
          className={cn(
            'rounded-xl border px-5 py-3 text-sm font-semibold transition',
            mode === 'shake'
              ? 'border-neon bg-neon text-neon-ink'
              : 'border-line text-ink-soft hover:border-line-strong',
          )}
        >
          Shake, then open
        </button>
      </div>

      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
        {mode === 'open'
          ? 'You open the box without touching it first. The ball has already "decided" which side it is on.'
          : 'You shake the box (a coherent operation), then open it. The shake makes the ball always land on the same side.'}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => runTrials(100)}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110 disabled:opacity-60"
        >
          <Play size={17} aria-hidden="true" />
          Run 100 trials
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={total === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-neon hover:text-neon disabled:opacity-40"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
        <span className="font-mono text-xs text-muted">{total} trials run</span>
      </div>

      {/* results */}
      {total > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Left (|0⟩)</p>
            <p className="mt-1 font-mono text-2xl text-neon">{leftCount}</p>
            <p className="text-sm text-muted">{total > 0 ? ((leftCount / total) * 100).toFixed(1) : 0}%</p>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Right (|1⟩)</p>
            <p className="mt-1 font-mono text-2xl text-neon">{rightCount}</p>
            <p className="text-sm text-muted">{total > 0 ? ((rightCount / total) * 100).toFixed(1) : 0}%</p>
          </div>
          <div className="rounded-xl border border-line bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">Expected</p>
            <p className="mt-1 font-mono text-2xl text-neon">
              {mode === 'open' ? '≈ 50/50' : '100% left'}
            </p>
            <p className="text-sm text-muted">
              {mode === 'open'
                ? 'The "fluid" and "ignorance" hypotheses predict the same thing here.'
                : 'Only quantum superposition explains this.'}
            </p>
          </div>
        </div>
      )}

      {/* hypothesis cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-verdict-myth">Hypothesis A · "It's a fluid"</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            The ball is actually spread across both sides like a fog. Opening the box forces it to
            one side.
          </p>
          <p className="mt-2 text-sm text-muted">
            <strong>Why it fails:</strong> If the ball were a fluid, shaking before opening should
            make it <em>more</em> spread out, not lock it to one side every time.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-verdict-myth">Hypothesis B · "We just don't know"</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            The ball was always on one side; we simply didn't look before opening.
          </p>
          <p className="mt-2 text-sm text-muted">
            <strong>Why it fails:</strong> If the ball were already decided, shaking could not change
            the outcome. Yet shake-then-open always lands left, while open-only is 50/50.
          </p>
        </div>
      </div>
    </div>
  );
}
