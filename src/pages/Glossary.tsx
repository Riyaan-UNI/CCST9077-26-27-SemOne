import Page from '@/components/Page';
import Section from '@/components/Section';
import Reveal from '@/components/Reveal';
import { glossary } from '@/content/glossary';

export default function Glossary() {
  return (
    <Page>
      <Section
        eyebrow="The words"
        title="Glossary"
        lead="Every course term, defined in one plain-English sentence. Tap any bold term anywhere on the site to summon these in place."
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          {glossary.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.03}>
              <div className="h-full rounded-2xl border border-line bg-surface p-5">
                <dt className="font-display text-lg text-ink">{g.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{g.plain}</dd>
                <dd className="mt-3 text-xs uppercase tracking-[0.12em] text-muted">
                  Source: {g.source.source}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Section>
    </Page>
  );
}
