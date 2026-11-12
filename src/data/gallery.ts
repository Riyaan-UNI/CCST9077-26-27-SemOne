import { asset } from '@/lib/utils';

export interface GalleryItem {
  id: string;
  src: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  credit: string;
}

/**
 * Gallery plates. Files live in /public/gallery. Swap them for your own renders,
 * photos or production stills — the layout is a masonry grid with a lightbox.
 */
export const gallery: GalleryItem[] = [
  {
    id: 'unfiled-singularity',
    src: asset('/gallery/unfiled-singularity.svg'),
    width: 1200,
    height: 900,
    title: 'The Unfiled Singularity',
    caption: 'A fictional archive inside a black-hole shadow, with warped starlight, an incoming explorer stretched by tidal forces, and branching timelines as an original superhero-comic homage. The “secrets” and Qubi-like monitor inside the singularity are story devices: current physics does not establish a hidden archive there. Tidal stretching can occur before or after horizon crossing depending on the black hole’s mass. The sealed record evokes the black-hole information puzzle without suggesting a settled solution. Visual science references: NASA, “Isolated Black Hole Visualization,” “What Happens When Something Gets Too Close to a Black Hole?” and “Frequently Asked Questions on Black Holes.”',
    credit: 'Original SVG illustration · AI-assisted code and composition · no Marvel characters, logos, or official imagery',
  },
  {
    id: 'bloch',
    src: asset('/gallery/bloch-sphere.svg'),
    width: 1000,
    height: 1000,
    title: 'The Bloch sphere',
    caption: 'Every pure qubit state is a point on the surface of this sphere. The poles are |0⟩ and |1⟩.',
    credit: 'Procedural plate · scripts/make_gallery.py',
  },
  {
    id: 'entangled',
    src: asset('/gallery/entangled-pair.svg'),
    width: 1200,
    height: 800,
    title: 'An entangled pair',
    caption: 'Two qubits linked by a shared state — the (|00⟩ + |11⟩)/√2 Bell pair Qubi likes to show off.',
    credit: 'Procedural plate · scripts/make_gallery.py',
  },
  {
    id: 'crt',
    src: asset('/gallery/qubi-crt.svg'),
    width: 900,
    height: 1100,
    title: 'Qubi, the qubit terminal',
    caption: 'A retro CRT-monitor robot whose screen-face renders quantum states on demand.',
    credit: 'Procedural plate · scripts/make_gallery.py',
  },
  {
    id: 'interference',
    src: asset('/gallery/interference.svg'),
    width: 1100,
    height: 1100,
    title: 'Interference',
    caption: 'Amplitudes adding and cancelling — the quiet engine behind every quantum speed-up.',
    credit: 'Procedural plate · scripts/make_gallery.py',
  },
  {
    id: 'lattice',
    src: asset('/gallery/error-correction.svg'),
    width: 1200,
    height: 800,
    title: 'The surface code',
    caption: 'Physical qubits woven into a logical qubit, so that adding more can make things better.',
    credit: 'Procedural plate · scripts/make_gallery.py',
  },
  {
    id: 'photon-key',
    src: asset('/gallery/photon-key.svg'),
    width: 900,
    height: 1100,
    title: 'Photons carrying a key',
    caption: 'BB84 in one picture: polarised single photons, randomly chosen bases, and an eavesdropper who cannot hide.',
    credit: 'Procedural plate · scripts/make_gallery.py',
  },
];
