import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import { ERA_COLOR, ERA_LABEL, timeline, type TimelineEra } from '@/data/timeline';
import { useStore } from '@/store/useStore';

const ERAS: TimelineEra[] = ['codes', 'theory', 'algorithms', 'hardware'];

function EraLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {ERAS.map((era) => (
        <li key={era} className="flex items-center gap-2 ui-label text-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: ERA_COLOR[era] }}
            aria-hidden="true"
          />
          {ERA_LABEL[era]}
        </li>
      ))}
    </ul>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 60%'],
  });
  const rawHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const height = useSpring(rawHeight, { stiffness: 90, damping: 26, mass: 0.4 });

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Fifty years, from a factoring problem to a machine that can undo it. Scroll to advance the
          beam.
        </p>
        <EraLegend />
      </div>

      <div ref={containerRef} className="relative">
        {/* rail */}
        <div
          className="absolute left-4 top-0 h-full w-px bg-[var(--line)] md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />
        <motion.div
          style={reduceMotion ? { height: '100%' } : { height }}
          className="absolute left-4 top-0 w-px bg-neon shadow-[0_0_12px_var(--neon)] md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        <ol className="space-y-10 md:space-y-2">
          {timeline.map((entry, i) => {
            const right = i % 2 === 1;
            return (
              <li key={entry.id} className="relative md:grid md:grid-cols-2 md:gap-10">
                {/* node */}
                <span
                  className="absolute left-4 top-3 z-10 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full border-2 md:left-1/2"
                  style={{
                    borderColor: ERA_COLOR[entry.era],
                    backgroundColor: 'var(--canvas)',
                  }}
                  aria-hidden="true"
                />

                <motion.article
                  initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'ml-12 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong md:ml-0 md:p-6',
                    right ? 'md:col-start-2 md:mt-0' : 'md:col-start-1 md:text-right',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-3',
                      !right && 'md:flex-row-reverse',
                    )}
                  >
                    <span className="font-mono text-2xl text-neon">{entry.year}</span>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.12em]"
                      style={{
                        color: ERA_COLOR[entry.era],
                        border: `1px solid ${ERA_COLOR[entry.era]}`,
                      }}
                    >
                      {ERA_LABEL[entry.era]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl">{entry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{entry.blurb}</p>

                  <p
                    className={cn(
                      'mt-4 flex items-start gap-2 text-sm text-muted',
                      !right && 'md:flex-row-reverse md:text-right',
                    )}
                  >
                    <span className="ui-label text-neon">
                      Qubi says
                    </span>
                    <span className="font-hand text-lg leading-snug text-ink-soft">
                      “{entry.qubiSays}”
                    </span>
                  </p>
                </motion.article>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
