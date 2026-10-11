import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Ruler, RotateCcw, Shuffle, FlipHorizontal } from 'lucide-react';
import {
  createState,
  hadamard,
  measure,
  pauliX,
  probabilities,
} from '@/quantum/simulator';
import { useStore } from '@/store/useStore';

export default function Level1MagicBox() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const react = useStore((s) => s.react);
  const [state, setState] = useState(() => createState(1));
  const [measured, setMeasured] = useState<number | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const probs = useMemo(() => probabilities(state), [state]);
  const p0 = probs[0];
  const p1 = probs[1];

  const shake = () => {
    setState((s) => hadamard(s, 0));
    setMeasured(null);
    setHistory((h) => [...h, 'Shake']);
    react('curious', 'Shake! The ball is now spinning — neither left nor right.');
  };

  const flip = () => {
    setState((s) => pauliX(s, 0));
    setMeasured(null);
    setHistory((h) => [...h, 'Flip']);
    react('surprised', 'Flip! Left becomes right and vice versa.');
  };

  const doMeasure = () => {
    const result = measure(state);
    setMeasured(result.outcome);
    setState(result.state);
    setHistory((h) => [...h, `Measure → |${result.outcome}⟩`]);
    react(
      result.outcome === 0 ? 'happy' : 'excited',
      `Collapsed to |${result.outcome}⟩!`,
    );
  };

  const reset = () => {
    setState(createState(1));
    setMeasured(null);
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* the box visual */}
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* box */}
          <div className="relative grid h-52 w-full max-w-sm place-items-center rounded-2xl border-2 border-line-strong bg-[#070b09]">
            <div className="crt-lines pointer-events-none absolute inset-0 rounded-2xl opacity-50" />
            {/* track */}
            <div className="absolute inset-x-8 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
            {/* ball */}
            <motion.div
              className="absolute top-1/2 h-14 w-14 -translate-y-1/2 rounded-full"
              animate={{
                left: measured !== null
                  ? measured === 0 ? '12%' : 'calc(88% - 3.5rem)'
                  : `${12 + p0 * 64}%`,
                filter: measured !== null ? 'blur(0px)' : `blur(${Math.min(8, 4 + p0 * p1 * 16)}px)`,
                opacity: measured !== null ? 1 : 0.6 + p0 * p1 * 0.8,
                backgroundColor: 'var(--neon)',
              }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 20 }}
              style={{ boxShadow: '0 0 24px var(--neon)' }}
            />
            {/* labels */}
            <span className="absolute bottom-3 left-4 font-mono text-sm text-muted">|0⟩</span>
            <span className="absolute bottom-3 right-4 font-mono text-sm text-muted">|1⟩</span>
            {measured !== null && (
              <span className="absolute top-3 right-3 font-mono text-xl text-neon text-glow">
                |{measured}⟩
              </span>
            )}
          </div>

          {/* probability bars */}
          <div className="w-full max-w-sm space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-ink-soft">|0⟩ left</span>
                <span className="font-mono text-neon">{(p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="relative mt-1.5 h-3 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-neon"
                  animate={{ width: `${p0 * 100}%` }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-ink-soft">|1⟩ right</span>
                <span className="font-mono text-neon">{(p1 * 100).toFixed(1)}%</span>
              </div>
              <div className="relative mt-1.5 h-3 overflow-hidden rounded-full bg-elevated">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-cyan"
                  animate={{ width: `${p1 * 100}%` }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
                />
              </div>
            </div>
            <p className="text-xs text-muted">
              {measured !== null
                ? 'The ball has collapsed to one side. Shake to put it back in superposition.'
                : 'The ball is in superposition: it holds both possibilities at once until you measure.'}
            </p>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={shake}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
        >
          <Shuffle size={17} aria-hidden="true" />
          Shake (H)
        </button>
        <button
          type="button"
          onClick={flip}
          className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon"
        >
          <FlipHorizontal size={17} aria-hidden="true" />
          Flip (X)
        </button>
        <button
          type="button"
          onClick={doMeasure}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon"
        >
          <Ruler size={17} aria-hidden="true" />
          Measure
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-neon hover:text-neon"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* history */}
      {history.length > 0 && (
        <div className="rounded-xl border border-line bg-elevated p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">History</p>
          <p className="mt-2 font-mono text-sm text-ink-soft">{history.join(' → ')}</p>
        </div>
      )}

      {/* plain-english explanation */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="ui-label text-neon">Shake</p>
          <p className="mt-2 text-sm text-ink-soft">
            A Hadamard gate. Puts the ball in superposition — equal chance of left or right.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="ui-label text-neon">Flip</p>
          <p className="mt-2 text-sm text-ink-soft">
            A Pauli-X gate. Swaps left and right. If the ball was spinning, it stays spinning but
            mirrored.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="ui-label text-neon">Measure</p>
          <p className="mt-2 text-sm text-ink-soft">
            Opens the box. The spinning ball collapses to either left (|0⟩) or right (|1⟩).
          </p>
        </div>
      </div>
    </div>
  );
}
