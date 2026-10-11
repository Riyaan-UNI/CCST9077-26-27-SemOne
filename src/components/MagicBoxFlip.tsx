import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { useStore } from '@/store/useStore';

/**
 * The magic box — the course's toy model of a single qubit, used as the Home
 * hero interactive. Open it and the "spinning" ball collapses to left (|0⟩) or
 * right (|1⟩); we keep a running tally so the 50/50 nature shows up over many
 * opens. This is a classical coin-flip demo of the *idea* of measurement; the
 * real quantum simulator lives in the lab.
 */
export default function MagicBoxFlip() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const react = useStore((s) => s.react);
  const [result, setResult] = useState<0 | 1 | null>(null);
  const [counts, setCounts] = useState({ 0: 0, 1: 0 });
  const [shaking, setShaking] = useState(false);
  const timer = useRef<number | null>(null);

  const openBox = () => {
    if (shaking) return;
    setShaking(true);
    setResult(null);
    const settle = reduceMotion ? 0 : 520;
    timer.current = window.setTimeout(() => {
      const outcome: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
      setResult(outcome);
      setCounts((c) => ({ ...c, [outcome]: c[outcome] + 1 }));
      setShaking(false);
      react(outcome === 0 ? 'curious' : 'excited', outcome === 0 ? 'Landed left: |0⟩.' : 'Landed right: |1⟩.');
    }, settle);
  };

  const reset = () => {
    setResult(null);
    setCounts({ 0: 0, 1: 0 });
  };

  const landed = result !== null;

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-surface/70 p-6 backdrop-blur-md">
      <p className="ui-label text-neon">The magic box · a qubit in plain English</p>

      {/* the box */}
      <div className="relative mt-4 grid h-44 place-items-center rounded-2xl border border-line-strong bg-[#070b09]">
        <div className="crt-lines pointer-events-none absolute inset-0 rounded-2xl opacity-50" />

        <motion.div
          animate={shaking && !reduceMotion ? { rotate: [-2, 2, -2, 2, 0], scale: [1, 1.02, 1] } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-24 w-24"
          aria-hidden="true"
        >
          {/* track */}
          <div className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
          {/* ball / qubit */}
          <motion.div
            className="absolute top-1/2 h-12 w-12 -translate-y-1/2 rounded-full"
            animate={{
              left: landed ? (result === 0 ? '6%' : 'calc(100% - 3rem)') : 'calc(50% - 1.5rem)',
              filter: landed ? 'blur(0px)' : 'blur(6px)',
              opacity: landed ? 1 : 0.7,
              backgroundColor: 'var(--neon)',
            }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 18 }}
            style={{ boxShadow: '0 0 18px var(--neon)' }}
          />
        </motion.div>

        {landed && (
          <span className="absolute bottom-3 right-3 font-mono text-2xl text-neon text-glow">
            |{result}⟩
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openBox}
          disabled={shaking}
          className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {landed ? 'Open again' : 'Open the box'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-ink-soft transition hover:border-line-strong"
        >
          <RotateCcw size={15} aria-hidden="true" />
          Reset tally
        </button>
      </div>

      {/* tally */}
      <dl className="mt-5 grid grid-cols-2 gap-3" aria-live="polite">
        <div className="rounded-xl border border-line bg-elevated px-4 py-3">
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">|0⟩ left</dt>
          <dd className="mt-1 font-mono text-2xl text-neon">{counts[0]}</dd>
        </div>
        <div className="rounded-xl border border-line bg-elevated px-4 py-3">
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">|1⟩ right</dt>
          <dd className="mt-1 font-mono text-2xl text-neon">{counts[1]}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">
        <strong className="text-ink">What just happened?</strong>{' '}
        {landed
          ? `The ball landed ${result === 0 ? 'left' : 'right'}. While it was spinning it was neither — that is superposition.`
          : 'The ball is spinning: it is neither left nor right until you open the box.'}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        <strong className="text-ink-soft">Why this matters:</strong> a qubit is not just a 0 or a 1.
        It can hold both at once, and measurement is what forces a choice.
      </p>
    </div>
  );
}
