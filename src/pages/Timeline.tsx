import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ExternalLink, List } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import { timelineEvents, eraLabel, eraColor } from '@/content/timeline';
import { useStore } from '@/store/useStore';

function Tag({ type }: { type?: 'science' | 'hype' | 'contested' | 'both' }) {
  if (!type) return null;
  const styles: Record<string, string> = {
    science: 'border-verdict-fact/40 bg-verdict-fact/10 text-verdict-fact',
    hype: 'border-verdict-myth/40 bg-verdict-myth/10 text-verdict-myth',
    contested: 'border-hype-amber/40 bg-hype-amber/10 text-hype-amber',
    both: 'border-cyan/40 bg-cyan/10 text-cyan',
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[type]}`}>
      {type === 'both' ? 'science + hype' : type}
    </span>
  );
}

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [listView, setListView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 70%'],
  });
  const rawHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const height = useSpring(rawHeight, { stiffness: 90, damping: 26, mass: 0.4 });

  if (listView) {
    return (
      <Page>
        <Section
          eyebrow="The story"
          title="From Bits to Qubits"
          lead="A century of ideas, listed for easy reading."
        >
          <button
            type="button"
            onClick={() => setListView(false)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm transition hover:border-neon hover:text-neon"
          >
            Show scroll view
          </button>
          <ol className="space-y-4">
            {timelineEvents.map((e) => (
              <li key={e.id} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-lg text-neon">{e.year}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs uppercase tracking-[0.12em]"
                    style={{
                      color: eraColor[e.era],
                      border: `1px solid ${eraColor[e.era]}`,
                    }}
                  >
                    {eraLabel[e.era]}
                  </span>
                  <Tag type={e.tag} />
                </div>
                <h3 className="mt-2 text-lg">{e.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{e.blurb}</p>
                <p className="mt-2 font-hand text-base text-ink-soft">“{e.qubiSays}”</p>
                <a
                  href={e.source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-neon underline-offset-2 hover:underline"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  {e.source.name}
                </a>
              </li>
            ))}
          </ol>
        </Section>
      </Page>
    );
  }

  return (
    <Page>
      <Section
        eyebrow="The story"
        title="From Bits to Qubits"
        lead="A century of ideas, scroll-driven, ending on a node that is yours."
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            From Planck's quanta to the 2022 Nobel Prize. Every entry links to a source.
            Items marked "contested" attracted debate; "hype" attracted overstatement.
          </p>
          <button
            type="button"
            onClick={() => setListView(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm transition hover:border-neon hover:text-neon"
          >
            <List size={15} aria-hidden="true" />
            List view
          </button>
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
            {timelineEvents.map((entry, i) => {
              const right = i % 2 === 1;
              return (
                <li key={entry.id} className="relative md:grid md:grid-cols-2 md:gap-10">
                  {/* node */}
                  <span
                    className="absolute left-4 top-3 z-10 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full border-2 md:left-1/2"
                    style={{
                      borderColor: eraColor[entry.era],
                      backgroundColor: 'var(--canvas)',
                    }}
                    aria-hidden="true"
                  />

                  <motion.article
                    initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="ml-12 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong md:ml-0 md:p-6"
                    style={{ gridColumn: right ? '2' : '1' }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-2xl text-neon">{entry.year}</span>
                      <span
                        className="rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.12em]"
                        style={{
                          color: eraColor[entry.era],
                          border: `1px solid ${eraColor[entry.era]}`,
                        }}
                      >
                        {eraLabel[entry.era]}
                      </span>
                      <Tag type={entry.tag} />
                    </div>

                    <h3 className="mt-3 text-xl">{entry.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{entry.blurb}</p>

                    <p className="mt-4 flex items-start gap-2 text-sm text-muted">
                      <span className="ui-label text-neon">Qubi says</span>
                      <span className="font-hand text-lg leading-snug text-ink-soft">
                        “{entry.qubiSays}”
                      </span>
                    </p>

                    <a
                      href={entry.source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-neon underline-offset-2 hover:underline"
                    >
                      <ExternalLink size={12} aria-hidden="true" />
                      {entry.source.name}
                    </a>
                  </motion.article>
                </li>
              );
            })}
          </ol>

          {/* final node */}
          <div className="relative mt-10 md:grid md:grid-cols-2 md:gap-10">
            <span
              className="absolute left-4 top-3 z-10 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full border-2 border-neon bg-neon md:left-1/2"
              aria-hidden="true"
            />
            <div className="ml-12 rounded-2xl border border-neon bg-surface p-5 md:col-start-2 md:ml-0">
              <h3 className="text-xl text-neon">Your move</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                The timeline is not over. The next node could be your discovery, your company,
                your question. The field is young — most of the quantum story is still unwritten.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Page>
  );
}
