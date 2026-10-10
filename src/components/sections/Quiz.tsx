import { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Qubi from '@/components/Qubi';
import { quiz } from '@/data/quiz';
import { useStore } from '@/store/useStore';

export default function Quiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const reduceMotion = useStore((s) => s.reduceMotion);
  const react = useStore((s) => s.react);

  const answeredCount = Object.keys(answers).length;
  const correctCount = quiz.filter((q) => answers[q.id] === q.answer).length;
  const allDone = answeredCount === quiz.length;
  const score = correctCount / quiz.length;

  function choose(qid: string, option: number, correct: number) {
    if (answers[qid] !== undefined) return;
    const next = { ...answers, [qid]: option };
    setAnswers(next);

    const isRight = option === correct;
    react(isRight ? 'happy' : 'thinking', isRight ? 'Correct. Nice.' : 'Close. Read the explanation.');

    const nowAllDone = Object.keys(next).length === quiz.length;
    if (nowAllDone && !reduceMotion) {
      const finalCorrect = quiz.filter((q) => next[q.id] === q.answer).length;
      if (finalCorrect === quiz.length) {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#39FF14', '#5BE3FF', '#F6F1E4'],
          disableForReducedMotion: true,
        });
      }
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
      <ol className="space-y-5">
        {quiz.map((q, qi) => {
          const chosen = answers[q.id];
          const done = chosen !== undefined;
          return (
            <li key={q.id} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line font-mono text-sm text-neon">
                  {qi + 1}
                </span>
                <p className="font-display text-lg leading-snug">{q.question}</p>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.answer;
                  const isChosen = chosen === oi;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={done}
                      onClick={() => choose(q.id, oi, q.answer)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                        !done && 'border-line text-ink-soft hover:border-line-strong hover:text-ink',
                        done && isCorrect && 'border-verdict-fact bg-verdict-fact/10 text-ink',
                        done && isChosen && !isCorrect && 'border-verdict-myth bg-verdict-myth/10 text-ink',
                        done && !isCorrect && !isChosen && 'border-line text-muted opacity-60',
                      )}
                    >
                      {done && isCorrect && (
                        <CheckCircle2 size={16} className="shrink-0 text-verdict-fact" aria-hidden="true" />
                      )}
                      {done && isChosen && !isCorrect && (
                        <XCircle size={16} className="shrink-0 text-verdict-myth" aria-hidden="true" />
                      )}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {done && (
                <motion.p
                  initial={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1, height: 'auto' }}
                  className="mt-4 overflow-hidden border-l-2 border-neon pl-4 text-sm leading-relaxed text-muted"
                >
                  {q.explanation}
                </motion.p>
              )}
            </li>
          );
        })}
      </ol>

      <aside className="sticky top-24 rounded-2xl border border-line bg-surface p-6 text-center">
        <Qubi mood={allDone ? (score === 1 ? 'excited' : 'thinking') : 'curious'} size={124} className="mx-auto" />
        <p className="mt-4 ui-label text-neon">Your score</p>
        <p className="mt-1 font-display text-4xl">
          {correctCount}
          <span className="text-xl text-muted">/{quiz.length}</span>
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full border border-line bg-elevated">
          <motion.div
            className="h-full bg-neon"
            animate={{ width: `${Math.round((answeredCount / quiz.length) * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-muted">
          {allDone
            ? score === 1
              ? 'Perfect. Qubi is genuinely impressed.'
              : 'Answered. Re-read the ones you missed.'
            : `${quiz.length - answeredCount} question${quiz.length - answeredCount === 1 ? '' : 's'} left`}
        </p>
        {answeredCount > 0 && (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm text-ink-soft transition hover:border-neon hover:text-neon"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Try again
          </button>
        )}
      </aside>
    </div>
  );
}
