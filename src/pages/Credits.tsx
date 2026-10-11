import { BookOpen, Code2, Heart, Sparkles } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import { isHkuBrand } from '@/config';
import { site } from '@/data/site';

const ATTRIBUTIONS = [
  ['React', 'MIT'],
  ['Vite', 'MIT'],
  ['TypeScript', 'Apache-2.0'],
  ['Tailwind CSS', 'MIT'],
  ['Motion (Framer Motion)', 'MIT'],
  ['Radix UI', 'MIT'],
  ['Zustand', 'MIT'],
  ['lucide-react', 'ISC'],
  ['Recharts', 'MIT'],
  ['react-lite-youtube-embed', 'MIT'],
  ['Fontsource (Baloo 2, Inter, VT323, Caveat)', 'OFL-1.1'],
];

const SOURCES = [
  {
    label: 'Course CCST9077 — The Quantum Revolution (lecturer: Yuxiang Yang)',
    note: 'The ideas, vocabulary and structure of this site are inspired by, and credit, this course.',
  },
  {
    label: 'The 2022 Nobel Prize in Physics — Aspect, Clauser, Zeilinger',
    note: 'For experiments with entangled photons, establishing the violation of Bell inequalities.',
    url: 'https://www.nobelprize.org/prizes/physics/2022/summary/',
  },
  {
    label: 'Wootters & Zurek, “A single quantum cannot be cloned”, Nature 299, 802 (1982)',
    note: 'The no-cloning theorem.',
    url: 'https://en.wikipedia.org/wiki/No-cloning_theorem',
  },
  {
    label: 'Bell, “On the Einstein Podolsky Rosen paradox” (1964)',
    note: 'Bell’s theorem and the CHSH inequality family.',
    url: 'https://en.wikipedia.org/wiki/Bell%27s_theorem',
  },
];

export default function Credits() {
  return (
    <Page>
      <Section
        eyebrow="Credits"
        title="Sources, attributions & AI use"
        lead="An honest account of where things came from. We cite the course, name the tools, and say plainly what used AI."
      >
        {/* AI disclosure */}
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="flex items-center gap-2 text-xl">
            <Sparkles size={18} className="text-neon" aria-hidden="true" />
            How AI was used
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li>
              <strong className="text-ink">Code.</strong> An AI coding assistant helped write and
              review parts of the React/TypeScript frontend. The team directed it and is responsible
              for the result. The course permits a <em>disclosed</em> assistant.
            </li>
            <li>
              <strong className="text-ink">Mascot.</strong> Qubi is currently a hand-built CSS/SVG
              placeholder. No AI-generated art ships in Phase 1.
            </li>
            <li>
              <strong className="text-ink">Copy.</strong> The plain-English explanations were written
              by the team and lightly polished with an AI assistant. All factual claims cite a source.
            </li>
            <li>
              <strong className="text-ink">Gallery (planned, Phase 5).</strong> AI-generated plates
              will be clearly labelled “AI-generated” on that page; nothing is claimed as human art.
            </li>
          </ul>
        </div>

        {/* Sources */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
          <h3 className="flex items-center gap-2 text-xl">
            <BookOpen size={18} className="text-neon" aria-hidden="true" />
            Sources
          </h3>
          <ul className="mt-4 space-y-4 text-sm">
            {SOURCES.map((s) => (
              <li key={s.label}>
                <p className="text-ink-soft">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-neon underline-offset-2 hover:underline"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span className="text-ink">{s.label}</span>
                  )}
                </p>
                <p className="mt-1 text-muted">{s.note}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Attributions */}
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
          <h3 className="flex items-center gap-2 text-xl">
            <Code2 size={18} className="text-neon" aria-hidden="true" />
            Third-party attributions
          </h3>
          <p className="mt-2 text-sm text-muted">
            This project is built on free, open-source software (the full list is in package.json):
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {ATTRIBUTIONS.map(([name, license]) => (
              <li
                key={name}
                className="flex items-center justify-between rounded-lg border border-line bg-elevated px-3 py-2 text-sm"
              >
                <span className="text-ink-soft">{name}</span>
                <span className="ui-label text-muted">{license}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Course note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-surface p-6">
          <Heart size={18} className="mt-0.5 shrink-0 text-neon" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink-soft">
            {isHkuBrand
              ? `This is a student group project for ${site.course} at ${site.institution}. It is original work that credits the course as inspiration and is not an official publication.`
              : `This is a student group project inspired by the course ${site.course}. It is original work that credits the course and is not affiliated with or endorsed by any institution.`}
          </p>
        </div>
      </Section>
    </Page>
  );
}
