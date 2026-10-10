import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Hero from '@/components/sections/Hero';
import Timeline from '@/components/sections/Timeline';
import ConceptGrid from '@/components/sections/ConceptGrid';
import HypeCheck from '@/components/sections/HypeCheck';
import GalleryGrid from '@/components/sections/GalleryGrid';
import VideoWall from '@/components/sections/VideoWall';
import Quiz from '@/components/sections/Quiz';
import Qubi from '@/components/Qubi';
import { site } from '@/data/site';

export default function Home() {
  return (
    <Page>
      <Hero />

      <Section
        id="timeline"
        eyebrow="The story"
        title="From secret codes to quantum computers"
        lead="Every quantum technology on this page exists because of a specific problem someone could not solve classically. Follow the thread."
      >
        <Timeline />
      </Section>

      <Section
        id="concepts"
        eyebrow="The ideas"
        title="Ten things worth actually understanding"
        lead="No hand-waving. Tap any card for the full picture, plus the analogy Qubi keeps in its screen."
      >
        <ConceptGrid />
      </Section>

      <Section
        id="hype-check"
        eyebrow="The reality check"
        title="Hype check"
        lead="Quantum computing attracts more nonsense than almost any other field. Here is what holds up."
      >
        <HypeCheck />
      </Section>

      <Section
        id="gallery"
        eyebrow="The gallery"
        title="Plates from the quantum world"
        lead="Concept art for the ideas that are hardest to picture. Click any plate to enlarge."
      >
        <GalleryGrid />
        <div className="mt-8">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-neon hover:text-neon"
          >
            Open the full gallery
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </Section>

      <Section
        id="videos"
        eyebrow="Watch"
        title="Video wall"
        lead="Short explainers hosted by Qubi. Cards load only when you click, so nothing is fetched from YouTube until you ask for it."
      >
        <VideoWall />
      </Section>

      <Section
        id="quiz"
        eyebrow="Test yourself"
        title="Five questions"
        lead="Answer honestly. Qubi is watching, and it has opinions."
      >
        <Quiz />
      </Section>

      {/* closing CTA */}
      <section className="relative overflow-hidden border-y border-line bg-surface">
        <div className="crt-lines pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-5 py-20 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-6">
            <Qubi mood="excited" message="GO!" size={120} float={false} />
            <div>
              <h2 className="text-3xl sm:text-4xl">Ready to build one?</h2>
              <p className="mt-2 max-w-lg text-ink-soft">
                The lab has a real statevector simulator and the CHSH game. {site.mascot.catchphrase}
              </p>
            </div>
          </div>
          <Link
            to="/lab"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-neon px-6 py-3.5 font-semibold text-neon-ink transition hover:brightness-110"
          >
            <FlaskConical size={18} aria-hidden="true" />
            Open the lab
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </Page>
  );
}
