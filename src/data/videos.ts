export interface VideoSlot {
  id: string;
  title: string;
  blurb: string;
  /** YouTube video id. Leave empty to render a branded placeholder slot. */
  youtubeId: string;
  /** Optional start time, in seconds. */
  start?: number;
  tag: string;
}

/**
 * Video wall. Drop real YouTube ids into `youtubeId` and the facade will load
 * the thumbnail on click (nothing is fetched from YouTube until you click).
 */
export const videos: VideoSlot[] = [
  {
    id: 'what-is-a-qubit',
    title: 'What is a qubit, really?',
    blurb: 'Qubi walks through the Bloch sphere and why a qubit is a direction, not a switch.',
    youtubeId: '',
    tag: 'Foundations',
  },
  {
    id: 'entanglement-explained',
    title: 'Entanglement without the hand-waving',
    blurb: 'Bell states, correlations, and the one thing entanglement cannot do.',
    youtubeId: '',
    tag: 'Foundations',
  },
  {
    id: 'chsh-game',
    title: 'Playing the CHSH game',
    blurb: 'Alice, Bob, a referee, and the 85% that classical physics cannot reach.',
    youtubeId: '',
    tag: 'Deep dive',
  },
  {
    id: 'bb84',
    title: 'BB84: catching Eve in the act',
    blurb: 'A step-by-step walk through the first quantum key distribution protocol.',
    youtubeId: '',
    tag: 'Cryptography',
  },
  {
    id: 'shor-grover',
    title: "Shor, Grover, and what's left",
    blurb: 'Which cryptography actually falls, and which cryptography just needs bigger keys.',
    youtubeId: '',
    tag: 'Cryptography',
  },
  {
    id: 'hardware-tour',
    title: 'Inside a quantum processor',
    blurb: 'Superconducting circuits, trapped ions, and why they all live in a fridge.',
    youtubeId: '',
    tag: 'Hardware',
  },
];

export const videoTags: string[] = ['All', ...Array.from(new Set(videos.map((v) => v.tag)))];
