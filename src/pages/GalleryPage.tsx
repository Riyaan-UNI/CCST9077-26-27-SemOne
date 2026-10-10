import Page from '@/components/Page';
import Section from '@/components/Section';
import GalleryGrid from '@/components/sections/GalleryGrid';
import Qubi from '@/components/Qubi';

export default function GalleryPage() {
  return (
    <Page>
      <header className="relative overflow-hidden border-b border-line pt-32 pb-14">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="ui-label text-neon">Gallery</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">Plates from the quantum world</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Some of these ideas resist language. These plates are the visual shorthand the team uses
              when a diagram has to do the explaining.
            </p>
          </div>
          <Qubi mood="happy" size={132} className="shrink-0" />
        </div>
      </header>

      <Section className="pt-12">
        <GalleryGrid />
        <p className="mt-8 text-sm leading-relaxed text-muted">
          Concept art generated for this project. Swap the files in{' '}
          <code className="text-neon">public/gallery</code> and update{' '}
          <code className="text-neon">src/data/gallery.ts</code> to use your own renders, production
          stills or photography — the masonry layout and lightbox adapt automatically.
        </p>
      </Section>
    </Page>
  );
}
