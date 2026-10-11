import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface HypeItem {
  id: string;
  claim: string;
  courseGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  reason: string;
  source: string;
}

const ITEMS: HypeItem[] = [
  {
    id: 'parallel-universes',
    claim: 'Quantum computers are infinitely faster because they use parallel universes.',
    courseGrade: 'F',
    reason:
      'The "many worlds" interpretation is one philosophical view, not an engineering blueprint. Quantum speedups come from interference, not from borrowing power from other universes.',
    source: 'Course L8 · Quantum in Popular Culture',
  },
  {
    id: 'cure-cancer',
    claim: 'Quantum computers will cure cancer or teleport armies.',
    courseGrade: 'F',
    reason:
      'Quantum computers excel at specific mathematical problems (factoring, search, simulation). They are not general-purpose miracle machines.',
    source: 'Course L8 · Quantum in Popular Culture',
  },
  {
    id: 'dead-alive',
    claim: "Schrödinger's cat is literally dead and alive at the same time.",
    courseGrade: 'D',
    reason:
      'Schrödinger proposed the cat as a thought experiment to show the absurdity of applying quantum superposition to macroscopic objects. The cat is a teaching tool, not a factual description.',
    source: 'Course L2 · Quantum Information',
  },
  {
    id: 'teleport-matter',
    claim: 'Quantum teleportation moves matter instantly across space.',
    courseGrade: 'F',
    reason:
      'Teleportation transfers a quantum state, not matter or energy. It needs a classical channel and destroys the original. You cannot beam a person.',
    source: 'Course L3 · Quantum Entanglement',
  },
  {
    id: 'moores-law',
    claim: "Moore's law is a law of nature.",
    courseGrade: 'D',
    reason:
      "Moore's law is an industry observation and target, not a physical law. It has already slowed as transistors approach atomic scales.",
    source: 'Course L1 · Classical Information',
  },
  {
    id: 'shor-rsa',
    claim: "Shor's algorithm threatens RSA encryption.",
    courseGrade: 'A',
    reason:
      'This is accurate. Shor\'s algorithm factors integers in polynomial time, which breaks RSA. Post-quantum cryptography research is active because of this.',
    source: 'Course L6 · Quantum Computers',
  },
  {
    id: 'no-communication',
    claim: 'Entanglement cannot be used to send messages faster than light.',
    courseGrade: 'A',
    reason:
      'This is a theorem, not an opinion. The no-communication theorem proves that entanglement correlations alone cannot transmit information.',
    source: 'Course L3 · Quantum Entanglement',
  },
];

const GRADES = ['A', 'B', 'C', 'D', 'F'] as const;

const gradeColor: Record<string, string> = {
  A: 'text-verdict-fact',
  B: 'text-cyan',
  C: 'text-hype-amber',
  D: 'text-hype-amber',
  F: 'text-verdict-myth',
};

export default function RateTheHype() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const react = useStore((s) => s.react);
  const [index, setIndex] = useState(0);
  const [graded, setGraded] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [showTaxonomy, setShowTaxonomy] = useState(false);

  const item = ITEMS[index];
  const userGrade = graded[item.id];
  const isRevealed = revealed[item.id];
  const done = Object.keys(revealed).length === ITEMS.length;

  const grade = (g: string) => {
    setGraded((prev) => ({ ...prev, [item.id]: g }));
    setRevealed((prev) => ({ ...prev, [item.id]: true }));
    const match = g === item.courseGrade;
    react(match ? 'excited' : 'thinking', match ? 'Spot on!' : `The course gave it ${item.courseGrade}.`);
  };

  const reset = () => {
    setIndex(0);
    setGraded({});
    setRevealed({});
  };

  return (
    <div className="space-y-6">
      {/* progress */}
      <div className="flex items-center gap-1.5">
        {ITEMS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= index ? 'bg-neon' : 'bg-line'
            }`}
          />
        ))}
      </div>

      {/* card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.28 }}
          className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <span className="ui-label text-muted">
              Claim {index + 1} of {ITEMS.length}
            </span>
            {isRevealed && (
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-sm font-bold',
                  gradeColor[item.courseGrade],
                  'border border-current',
                )}
              >
                Course grade: {item.courseGrade}
              </span>
            )}
          </div>

          <p className="mt-5 font-display text-2xl leading-snug sm:text-3xl">
            “{item.claim}”
          </p>

          {!isRevealed ? (
            <div className="mt-8">
              <p className="text-sm text-muted">Grade this claim:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => grade(g)}
                    className={cn(
                      'h-12 w-12 rounded-xl border text-lg font-bold transition',
                      'border-line text-ink-soft hover:border-neon hover:text-neon',
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">
                A = accurate and well-sourced · F = pure hype or false
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-line bg-elevated p-4">
                <p className="text-sm font-semibold text-ink">Your grade: {userGrade}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.reason}
                </p>
                <p className="mt-2 text-xs text-muted">Source: {item.source}</p>
              </div>

              <div className="flex gap-3">
                {index < ITEMS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setIndex((i) => i + 1)}
                    className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
                  >
                    Next claim
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
                  >
                    <RotateCcw size={15} />
                    Play again
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* taxonomy toggle */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <button
          type="button"
          onClick={() => setShowTaxonomy((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-neon"
        >
          <Star size={15} aria-hidden="true" />
          {showTaxonomy ? 'Hide' : 'Show'} the good, bad and ugly of popular science
        </button>

        <AnimatePresence>
          {showTaxonomy && (
            <motion.div
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-verdict-fact/30 bg-verdict-fact/10 p-4">
                  <p className="font-semibold text-verdict-fact">Good</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Accurate AND vivid. Gets the science right and makes it memorable without
                    distortion.
                  </p>
                </div>
                <div className="rounded-xl border border-verdict-myth/30 bg-verdict-myth/10 p-4">
                  <p className="font-semibold text-verdict-myth">Bad</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Distorts or mixes speculation with fact. Often oversimplifies to the point of
                    being wrong.
                  </p>
                </div>
                <div className="rounded-xl border border-muted/30 bg-elevated p-4">
                  <p className="font-semibold text-muted">Ugly</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Accurate but jargon-heavy and dull. Technically correct but unreadable for
                    non-experts.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-hype-amber/30 bg-hype-amber/10 p-4">
                <p className="font-semibold text-hype-amber">The Gartner Hype Cycle</p>
                <p className="mt-1 text-sm text-ink-soft">
                  New technologies ride a rollercoaster: a spike of excited overestimation, a trough
                  of disappointment, then steady real value. Quantum computing is climbing out of
                  the trough.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {done && (
        <div className="rounded-2xl border border-neon/30 bg-surface p-6 text-center">
          <p className="font-display text-xl">You rated all {ITEMS.length} claims!</p>
          <p className="mt-2 text-sm text-muted">
            Score: {Object.entries(graded).filter(([id, g]) => g === ITEMS.find((i) => i.id === id)?.courseGrade).length} / {ITEMS.length} matched the course grade.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm transition hover:border-neon hover:text-neon"
          >
            <RotateCcw size={15} />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
