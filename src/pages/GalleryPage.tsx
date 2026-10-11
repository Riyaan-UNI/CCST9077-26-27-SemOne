import { useState } from 'react';
import { MasonryPhotoAlbum, type Photo } from 'react-photo-album';
import 'react-photo-album/masonry.css';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import { gallery } from '@/data/gallery';

type Plate = Photo & { title: string; caption: string; credit: string };

const photos: Plate[] = gallery.map((item) => ({
  src: item.src,
  width: item.width,
  height: item.height,
  alt: item.title,
  title: item.title,
  caption: item.caption,
  credit: item.credit,
}));

export default function GalleryPage() {
  const [index, setIndex] = useState(-1);

  return (
    <Page>
      <Section
        eyebrow="Gallery"
        title="Plates from the quantum world"
        lead="Some of these ideas resist language. These plates are the visual shorthand the team uses when a diagram has to do the explaining."
      >
        <div className="mb-6 flex items-center justify-end">
          <Qubi mood="happy" size={80} className="hidden shrink-0 sm:block" />
        </div>
        <div className="rounded-xl border border-hype-amber/30 bg-hype-amber/10 p-4">
          <p className="text-sm text-ink-soft">
            <strong className="text-hype-amber">AI-generated art disclosure:</strong>{' '}
            The plates below were generated with AI assistance for this educational project.
            They are concept art, not scientific illustrations. If you use them elsewhere,
            please credit the project.
          </p>
        </div>

        <div className="mt-6">
          <MasonryPhotoAlbum
            photos={photos}
            columns={(containerWidth) => (containerWidth < 640 ? 1 : containerWidth < 1024 ? 2 : 3)}
            spacing={16}
            onClick={({ index: i }) => setIndex(i)}
          />
        </div>

        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={photos.map((p) => ({ src: p.src, title: p.title, description: p.caption }))}
          plugins={[Captions]}
          carousel={{ finite: false, padding: 0 }}
          styles={{ container: { backgroundColor: 'rgba(4, 8, 6, 0.94)' } }}
        />

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
