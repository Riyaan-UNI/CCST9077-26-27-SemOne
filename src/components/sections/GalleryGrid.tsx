import { useCallback, useState } from 'react';
import { MasonryPhotoAlbum, type Photo } from 'react-photo-album';
import 'react-photo-album/masonry.css';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
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

export default function GalleryGrid() {
  const [index, setIndex] = useState(-1);
  const open = useCallback((i: number) => setIndex(i), []);

  return (
    <>
      <MasonryPhotoAlbum
        photos={photos}
        columns={(containerWidth) => (containerWidth < 640 ? 1 : containerWidth < 1024 ? 2 : 3)}
        spacing={16}
        onClick={({ index: i }) => open(i)}
      />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((p) => ({ src: p.src, title: p.title, description: p.caption }))}
        plugins={[Captions]}
        carousel={{ finite: false, padding: 0 }}
        styles={{ container: { backgroundColor: 'rgba(4, 8, 6, 0.94)' } }}
      />
    </>
  );
}
