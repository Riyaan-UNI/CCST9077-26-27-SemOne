import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, FlaskConical, MousePointerClick } from 'lucide-react';
import ObserverField from '@/components/ObserverField';
import Qubi from '@/components/Qubi';
import { site } from '@/data/site';
import { useStore } from '@/store/useStore';

const STATS = [
  { value: '85.4%', label: 'CHSH win rate with entanglement', hint: 'vs. a classical ceiling of 75%' },
  { value: '3', label: 'qubits simulated in your browser', hint: 'statevector, gate by gate' },
  { value: '15 = 3 × 5', label: 'the first famous factorisation', hint: 'IBM, 2001, seven qubits' },
];

export default function Hero() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const observerMode = useStore((s) => s.observerMode);

  return (
    <header className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      {/* the signature effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-canvas" />
        <div className="absolute inset-0 grid-paper opacity-40" />
        <ObserverField />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 ui-label text-neon backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            {site.course} · {site.faculty}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-5xl leading-[0.98] sm:text-6xl md:text-7xl"
          >
            The Quantum
            <br />
            <span className="text-neon text-glow">Revolution</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl font-display text-xl text-ink-soft sm:text-2xl"
          >
            From secret codes to quantum computers.
          </motion.p>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-5 max-w-xl leading-relaxed text-muted"
          >
            {site.tagline} Build superpositions, entangle a Bell pair, play the CHSH game and watch
            a real statevector simulator collapse — all in the browser.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/lab"
              className="group inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
            >
              <FlaskConical size={18} aria-hidden="true" />
              Enter the lab
              <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <a
              href="#timeline"
              className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 font-semibold text-ink transition hover:border-neon hover:text-neon"
            >
              Follow the timeline
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-7 flex items-center gap-2 text-sm text-muted"
          >
            <MousePointerClick size={14} aria-hidden="true" />
            {observerMode
              ? 'Move your cursor across the page — the field collapses where you observe.'
              : 'Observer mode is off. Switch it on in the top bar to collapse the field.'}
          </motion.p>
        </div>

        {/* Qubi greeting */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="relative rounded-3xl border border-line bg-surface/70 p-7 backdrop-blur-md">
            <div className="absolute -top-3 left-7 rounded-full border border-line bg-elevated px-3 py-1 ui-label text-neon">
              Co-host
            </div>
            <Qubi mood="happy" message="HI" size={230} className="mx-auto" />
            <p className="mt-6 text-center font-display text-2xl">
              {site.mascot.name}
              <span className="ml-2 align-middle text-sm font-normal text-muted">
                {site.mascot.pronunciation}
              </span>
            </p>
            <p className="mt-1 text-center font-hand text-2xl text-neon">
              “{site.mascot.catchphrase}”
            </p>
            <p className="mt-4 text-center text-sm leading-relaxed text-muted">
              A qubit terminal that asks the questions you are already thinking.
            </p>

            {/* Notation, kept inside the card so the larger type can never
                collide with the surrounding layout. */}
            <div className="mt-5 flex flex-wrap justify-center gap-2 border-t border-line pt-5">
              <span className="rounded-lg border border-line bg-elevated px-3 py-1.5 font-mono text-cyan">
                |ψ⟩ = a|0⟩ + b|1⟩
              </span>
              <span className="rounded-lg border border-line bg-elevated px-3 py-1.5 font-mono text-neon">
                (|00⟩ + |11⟩)/√2
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* stats strip */}
      <div className="absolute inset-x-0 bottom-0 hidden border-t border-line bg-canvas/60 backdrop-blur-md md:block">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-3 divide-x divide-[var(--line)] px-5">
          {STATS.map((s) => (
            <div key={s.label} className="px-6 py-5">
              <dt className="font-mono text-2xl text-neon">{s.value}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{s.label}</dd>
              <dd className="text-sm text-muted">{s.hint}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
