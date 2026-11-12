import { useMemo, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { useNavigate } from 'react-router-dom';
import Page from '@/components/Page';
import { artworks } from '@/content/artworks';
import { gallery } from '@/data/gallery';
import { videos } from '@/data/videos';
import { useProgression } from '@/features/progression/ProgressionProvider';
import { asset } from '@/lib/utils';

export default function GalleryPage() {
  const { progress } = useProgression();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  const unlockableArtworks = artworks.filter((plate) => Boolean(plate.unlockEpisodeId));
  const visibleArt = useMemo(() => artworks.filter((plate) => !plate.unlockEpisodeId || progress.observerMode || progress.unlockedArtworks.includes(plate.id)), [progress]);
  const activeIndex = visibleArt.findIndex((plate) => plate.id === activeId);
  const declassifiedCount = unlockableArtworks.filter((plate) => progress.unlockedArtworks.includes(plate.id)).length;

  return (
    <Page>
      <div className="record-page mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Bureau / public record</p>
        <h1 className="record-title mt-4">The Gallery Wall</h1>
        <p className="record-lead mt-5 max-w-3xl">Explore the featured concept art, or choose a sealed plate to watch its episode and answer the check; passing opens that file here. These images are illustrations, not scientific proof.</p>
        <div className="gallery-wall-counter progression-chrome" aria-live="polite">
          <strong>{progress.observerMode ? unlockableArtworks.length : declassifiedCount} / {unlockableArtworks.length}</strong>
          <span>{progress.observerMode ? 'Observer Mode · all sealed plates open' : 'sealed plates declassified'}</span>
        </div>
        <div className="gallery-wall">
          {artworks.map((plate, index) => {
            const isFeatured = !plate.unlockEpisodeId;
            const isUnlocked = isFeatured || progress.observerMode || progress.unlockedArtworks.includes(plate.id);
            const source = gallery.find((item) => item.id === plate.id);
            const unlockVideo = plate.unlockEpisodeId ? videos.find((video) => video.id === plate.unlockEpisodeId) : undefined;
            return (
              <article id={plate.id} className={`gallery-plate${isUnlocked ? ' is-declassified' : ' is-sealed'}`} key={plate.id}>
                <button type="button" className="gallery-plate-image" onClick={() => {
                  if (isUnlocked) setActiveId(plate.id);
                  else if (unlockVideo?.status === 'live') navigate(`/videos?play=${encodeURIComponent(unlockVideo.id)}&returnTo=${encodeURIComponent(plate.id)}`);
                }} aria-label={isUnlocked ? `View artwork: ${plate.title}` : `Sealed artwork ${String(index + 1).padStart(2, '0')}. Watch Episode ${unlockVideo?.episode ?? ''} and pass its check to open this file.`}>
                  <img src={asset(plate.imagePath)} alt={isUnlocked ? plate.altText : ''} aria-hidden={!isUnlocked} loading="lazy" />
                  {!isUnlocked && <span className="gallery-redaction" aria-hidden="true"><i /><i /><i /><b>SEALED</b></span>}
                  <span className="gallery-plate-number">PLATE / {String(index + 1).padStart(2, '0')}</span>
                </button>
                <div className="gallery-plate-copy">
                  <p className="record-kicker progression-chrome">{isFeatured ? 'Featured concept art' : isUnlocked ? 'Declassified' : 'Redacted'}</p>
                  <h2>{isUnlocked ? plate.title : 'Redacted record'}</h2>
                  <p>{isUnlocked ? source?.caption ?? 'An educational visual supplied with the project.' : 'This plate’s title and image are sealed until declassification.'}</p>
                  {isUnlocked && source?.credit && <p className="record-note mt-3">{source.credit}</p>}
                  {!isUnlocked && <span className="gallery-unlock-reason">Select to watch Episode {unlockVideo?.episode ?? ''} and answer its check. Passing opens this file.</span>}
                </div>
              </article>
            );
          })}
        </div>
        <Lightbox
          open={activeIndex >= 0}
          index={activeIndex}
          close={() => setActiveId(null)}
          slides={visibleArt.map((plate) => {
            const source = gallery.find((item) => item.id === plate.id);
            return { src: asset(plate.imagePath), title: plate.title, description: source?.caption };
          })}
          plugins={[Captions]}
          carousel={{ finite: false, padding: 0 }}
          styles={{ container: { backgroundColor: 'rgba(4, 8, 6, 0.94)' } }}
        />
      </div>
    </Page>
  );
}
