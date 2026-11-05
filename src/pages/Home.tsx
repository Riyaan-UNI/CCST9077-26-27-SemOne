import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Reveal from '@/components/Reveal';
import ObserverField from '@/components/ObserverField';
import Qubi from '@/components/Qubi';
import MagicBoxFlip from '@/components/MagicBoxFlip';
import JourneyStrip, { type JourneyItem } from '@/components/JourneyStrip';
import VideoWall from '@/components/sections/VideoWall';
import { site } from '@/data/site';
import { useStore } from '@/store/useStore';

const JOURNEY: JourneyItem[] = [
  {
    href: '/lab',
    label: 'The Quantum Lab',
    blurb: 'Entangle photons, play the CHSH game, and watch a real simulator collapse.',
    tag: 'Play',
  },
  {
    href: '/timeline',
    label: 'From Bits to Qubits',
    blurb: 'A century of ideas, scroll-driven, ending on a node that is yours.',
    tag: 'Story',
  },
  {
    href: '/videos',
    label: 'The Video Series',
    blurb: 'Four short episodes hosted by Qubi — three ready to watch, one coming soon.',
    tag: 'Watch',
  },
  {
    href: '/team',
    label: 'The Team',
    blurb: 'Four students, one entangled mascot, no physics degrees required.',
    tag: 'Meet',
  },
  {
    href: '/glossary',
    label: 'The Glossary',
    blurb: 'Tap any bold term anywhere to get a one-line plain-English definition.',
    tag: 'Learn',
  },
];

const TEASERS = [
  { href: '/lab', title: 'Quantum Lab', blurb: 'Hands-on entanglement, the CHSH game and the no-cloning theorem.' },
  { href: '/videos', title: 'Videos', blurb: 'Four explainer episodes; three are ready to watch.' },
  { href: '/team', title: 'Team', blurb: 'The four people (and one robot) behind this site.' },
  { href: '/timeline', title: 'Timeline', blurb: 'From a factoring problem to a machine that can undo it.' },
  { href: '/course-map', title: 'Course Map', blurb: 'The exact lecture order of CCST9077, week by week.' },
  { href: '/gallery', title: 'Gallery', blurb: 'AI-generated plates for the ideas hardest to picture.' },
  { href: '/glossary', title: 'Glossary', blurb: 'Every course term, defined in a sentence.' },
  { href: '/credits', title: 'Credits', blurb: 'Sources, attributions and an honest AI-use disclosure.' },
];

export default function Home() {
  const observerMode = useStore((s) => s.observerMode);

  return (
    <Page>
      {/* ------------------------------------------------------------------ *
       * Hero
       * ------------------------------------------------------------------ */}
      <header className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-canvas" />
          <div className="absolute inset-0 grid-paper opacity-40" />
          <ObserverField />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 ui-label text-neon backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
              {site.course} · Group project
            </p>

            <h1 className="mt-6 text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              What if the universe is made of information?
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              That one question opens quantum information — the science behind the most
              misunderstood technology of our time. We teach it with a waving robot and a magic
              box, not equations.
            </p>

            <Link
              to="/#videos"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-neon px-5 py-3 text-sm font-semibold text-neon-ink transition hover:brightness-110"
            >
              Watch the videos <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <div className="mt-7 flex items-center gap-4">
              <Qubi mood="happy" size={96} className="hidden sm:block" float />
              <p className="font-hand text-xl text-neon">“{site.mascot.catchphrase}”</p>
            </div>

            <p className="mt-6 text-xs text-muted">
              {observerMode
                ? 'Move your cursor — the field collapses where you observe.'
                : ''}
            </p>
          </div>

          <div id="magic-box" className="mx-auto w-full max-w-md scroll-mt-24">
            <p className="mb-2 text-center text-sm text-muted">
              Try me first — flip the box
            </p>
            <MagicBoxFlip />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ *
       * Video series
       * ------------------------------------------------------------------ */}
      <section id="videos" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <Reveal className="max-w-3xl">
            <p className="ui-label text-neon">Watch</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">
              The Quantum Revolution, in four videos
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
              Three episodes are ready to watch; the fourth is coming soon. Start with a video,
              then keep exploring below.
            </p>
          </Reveal>
          <div className="mt-12">
            <VideoWall />
          </div>
          <Link
            to="/#journey"
            className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm text-ink-soft transition hover:border-line-strong hover:text-neon"
          >
            Continue exploring <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------------ *
       * Journey strip
       * ------------------------------------------------------------------ */}
      <Section
        id="journey"
        eyebrow="Your journey"
        title="Five stops worth your time"
        lead="A quick preview of the labs, the timeline and the explainers. Everything is built to be tried, not just read."
      >
        <JourneyStrip items={JOURNEY} />
      </Section>

      {/* ------------------------------------------------------------------ *
       * Page teasers
       * ------------------------------------------------------------------ */}
      <Section
        id="explore"
        eyebrow="Explore"
        title="Every page, in one glance"
        lead="Jump to whichever stop you like. There are no dead ends — every link leads somewhere you can do something."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEASERS.map((t, i) => (
            <Reveal key={t.href} delay={i * 0.04}>
              <Link
                to={t.href}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-line-strong hover:bg-elevated"
              >
                <h3 className="flex items-center gap-1 text-lg">
                  {t.title}
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </Page>
  );
}
