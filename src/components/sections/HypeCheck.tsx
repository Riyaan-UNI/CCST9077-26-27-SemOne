import { useCallback, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import Qubi from '@/components/Qubi';
import { VERDICT_META, hypeCards } from '@/data/hypeCheck';
import { useStore } from '@/store/useStore';

const SWIPE_THRESHOLD = 90;

export default function HypeCheck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const react = useStore((s) => s.react);

  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((i) => (i + dir + hypeCards.length) % hypeCards.length);
    },
    [],
  );

  const card = hypeCards[index];
  const meta = VERDICT_META[card.verdict];

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  }

  function celebrate() {
    if (reduceMotion) return;
    confetti({
      particleCount: 70,
      spread: 62,
      origin: { y: 0.7 },
      colors: ['#39FF14', '#5BE3FF', '#F6F1E4', '#0F402E'],
      disableForReducedMotion: true,
    });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div>
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.article
              key={card.id}
              custom={direction}
              initial={reduceMotion ? undefined : { opacity: 0, x: direction * 60, rotate: direction * 2 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: direction * -60, rotate: direction * -2 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              drag={reduceMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={onDragEnd}
              className="cursor-grab rounded-2xl border border-line bg-surface p-6 shadow-lift active:cursor-grabbing sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 ui-label"
                  style={{ color: meta.tone, border: `1px solid ${meta.tone}` }}
                >
                  <span aria-hidden="true">{meta.glyph}</span>
                  {meta.label}
                </span>
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, '0')} / {String(hypeCards.length).padStart(2, '0')}
                </span>
              </div>

              <p className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
                “{card.claim}”
              </p>

              <p className="mt-5 text-base font-semibold" style={{ color: meta.tone }}>
                {card.correction}
              </p>
              <p className="mt-3 leading-relaxed text-ink-soft">{card.detail}</p>

              <p className="mt-6 border-t border-line pt-4 font-hand text-xl text-muted">
                Qubi: “{card.qubiSays}”
              </p>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous card"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink-soft transition hover:border-neon hover:text-neon"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next card"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink-soft transition hover:border-neon hover:text-neon"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setDirection(-1);
              celebrate();
              react('excited', 'Hype checked. Stay superposed.');
            }}
            className="ml-1 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink-soft transition hover:border-neon hover:text-neon"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
          <span className="ml-auto hidden text-sm text-muted sm:block">
            Drag the card, or use the arrows.
          </span>
        </div>
      </div>

      <aside className="rounded-2xl border border-line bg-surface p-6">
        <Qubi mood={card.verdict === 'myth' ? 'surprised' : 'thinking'} size={132} className="mx-auto" />
        <p className="mt-4 text-center ui-label text-neon">
          Hype check
        </p>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted">
          Ten claims you will meet in headlines, graded honestly. Qubi keeps score.
        </p>
        <dl className="mt-6 space-y-2 text-sm">
          {(['myth', 'nuance', 'fact'] as const).map((v) => {
            const count = hypeCards.filter((c) => c.verdict === v).length;
            return (
              <div key={v} className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: VERDICT_META[v].tone }}
                    aria-hidden="true"
                  />
                  {VERDICT_META[v].label}
                </dt>
                <dd className="font-mono text-muted">{count}</dd>
              </div>
            );
          })}
        </dl>
      </aside>
    </div>
  );
}
