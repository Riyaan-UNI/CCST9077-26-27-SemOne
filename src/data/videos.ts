/**
 * Video series data.
 *
 * Driven entirely by this file — drop a real YouTube id into `youtubeId` and set
 * `status: 'live'` and the wall will swap the placeholder for a click-to-load,
 * privacy-friendly (nocookie) facade. Nothing is fetched from YouTube until a
 * viewer clicks.
 *
 * Titles are WORKING DRAFTS (editable, not final) per the project brief.
 */
export interface VideoSlot {
  id: string;
  episode: number;
  title: string;
  description: string;
  youtubeId: string;
  status: 'coming-soon' | 'live';
  /** Optional start time, in seconds. */
  start?: number;
  /** Caption / transcript note shown beneath the card. */
  transcript: string;
}

export const videos: VideoSlot[] = [
  {
    id: 'the-magic-box',
    episode: 1,
    title: 'The Magic Box',
    description:
      'Qubi opens the box and shows why a qubit is not just a 0 or a 1 — it is a ball that is spinning until you look.',
    youtubeId: '',
    status: 'coming-soon',
    transcript: 'Captions and a transcript will appear here when this episode goes live.',
  },
  {
    id: 'spooky-twins-no-messages',
    episode: 2,
    title: 'Spooky Twins, No Messages',
    description:
      'Two entangled photons, one rule that breaks classical intuition — and why neither twin can send the other a text.',
    youtubeId: '',
    status: 'coming-soon',
    transcript: 'Captions and a transcript will appear here when this episode goes live.',
  },
  {
    id: 'the-game-show-that-broke-reality',
    episode: 3,
    title: 'The Game Show That Broke Reality',
    description:
      'Alice, Bob, a referee and a game no classical team can win more than 75% of the time. Entanglement changes the odds.',
    youtubeId: '',
    status: 'coming-soon',
    transcript: 'Captions and a transcript will appear here when this episode goes live.',
  },
  {
    id: 'cant-copy-cant-hack',
    episode: 4,
    title: "Can't Copy, Can't Hack",
    description:
      'The no-cloning theorem, quantum money, and why an eavesdropper always leaves footprints in the quantum world.',
    youtubeId: '',
    status: 'coming-soon',
    transcript: 'Captions and a transcript will appear here when this episode goes live.',
  },
  {
    id: 'rate-the-quantum-hype',
    episode: 5,
    title: 'Rate the Quantum Hype',
    description:
      'We grade real quantum claims from A to F. Bring your scepticism — the course does.',
    youtubeId: '',
    status: 'coming-soon',
    transcript: 'Captions and a transcript will appear here when this episode goes live.',
  },
];
