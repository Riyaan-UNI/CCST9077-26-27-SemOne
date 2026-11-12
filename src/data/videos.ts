/**
 * Video series data.
 *
 * Driven entirely by this file — drop a real YouTube id into `youtubeId` and set
 * `status: 'live'` and the wall will open a lightweight, nonmodal player on
 * click. Nothing is fetched from YouTube until a viewer starts a video.
 *
 * The first three titles match the uploaded YouTube episodes; episode four is
 * still being prepared.
 */
export interface VideoSlot {
  id: string;
  episode: number;
  title: string;
  description: string;
  /** Case that continues the idea introduced in this episode. */
  caseId: 'measurement' | 'entanglement' | 'no-cloning';
  caseLabel: string;
  thumbnail: string;
  youtubeId: string;
  status: 'coming-soon' | 'live';
  /** Optional start time, in seconds. */
  start?: number;
  /** Caption / transcript note shown beneath the card. */
  transcript?: string;
}

export const videos: VideoSlot[] = [
  {
    id: 'the-magic-box',
    episode: 1,
    title: 'The Magic Box',
    description:
      'Qubi opens a magic box to introduce qubit states and measurement. The box is a teaching analogy; a qubit is not a tiny classical ball.',
    caseId: 'measurement',
    caseLabel: 'measurement',
    thumbnail: 'videos/the-magic-box.png',
    youtubeId: 'ZNNB-lHQsfI',
    status: 'live',
  },
  {
    id: 'spooky-twins-no-messages',
    episode: 2,
    title: 'Spooky Twins, No Messages',
    description:
      'An introduction to entanglement correlations and why they do not provide a controllable message channel.',
    caseId: 'entanglement',
    caseLabel: 'entanglement',
    thumbnail: 'videos/spooky-twins.png',
    youtubeId: 'vdufocF6Mjs',
    status: 'live',
  },
  {
    id: 'the-game-show-that-broke-reality',
    episode: 3,
    title: 'The Game Show That Broke Reality',
    description:
      'A CHSH game illustrates how quantum correlations can exceed the 75% ceiling for classical strategies in this game.',
    caseId: 'entanglement',
    caseLabel: 'Bell correlations',
    thumbnail: 'videos/game-show.png',
    youtubeId: '8QNQDiFKVyg',
    status: 'live',
  },
  {
    id: 'cant-copy-cant-hack',
    episode: 4,
    title: 'No Perfect Copy',
    description:
      'Planned episode about the no-cloning theorem. The group will review its examples and science before release.',
    caseId: 'no-cloning',
    caseLabel: 'no-cloning',
    thumbnail: 'videos/no-cloning.png',
    youtubeId: '',
    status: 'coming-soon',
    transcript: 'Captions and a transcript will appear here when this episode goes live.',
  },
];
