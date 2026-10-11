/**
 * Team content for the /team page.
 *
 * Every human-authored line carries `confirm: true` — these are the strings the
 * project owner must approve before the site goes live. Placeholders
 * ([MEMBER_2_NAME], [MEMBER_3_NAME], [ADD]) are left visibly in the copy on
 * purpose; they are NOT invented.
 *
 * `devices` lists the literary devices used in each bio so the page can surface
 * them under the optional "Show the literary devices" toggle.
 */

export type Deliverable = 'website' | 'videos' | 'mascot' | 'scripts';

export interface Confirmed<T> {
  value: T;
  confirm: true;
}

export interface DeviceNote {
  device: string;
  example: string;
  note: string;
}

export interface TeamMember {
  id: string;
  name: Confirmed<string>;
  nickname?: Confirmed<string>;
  title: Confirmed<string>;
  bio: Confirmed<string>;
  contributions: Confirmed<string>[];
  funFact: Confirmed<string>;
  deliverables: Deliverable[];
  devices: DeviceNote[];
}

export const DELIVERABLES: { id: Deliverable; label: string }[] = [
  { id: 'website', label: 'Website' },
  { id: 'videos', label: 'Videos' },
  { id: 'mascot', label: 'Mascot' },
  { id: 'scripts', label: 'Scripts' },
];

export const team: TeamMember[] = [
  {
    id: 'riyaan',
    name: { value: 'Riyaan', confirm: true },
    nickname: { value: 'Chicha', confirm: true },
    title: { value: 'The First-Principles Tinkerer', confirm: true },
    bio: {
      value:
        'Chicha doesn’t borrow answers; he rebuilds them from the ground up, like a physicist who insists on re-deriving gravity before agreeing to fall. Born in Bengaluru, India’s Silicon Valley, and now studying Computer Science at HKU, he travelled thousands of kilometres to a lecture on spooky action at a distance, proof that some distances really do not matter. On this team he is the architect: he drew the blueprint, directed the machines, and kept the site standing while the rest of us were still in superposition about lunch.',
      confirm: true,
    },
    contributions: [
      { value: 'Website design and build direction (with a disclosed AI coding assistant)', confirm: true },
      { value: 'Mascot direction', confirm: true },
      { value: 'Project coordination', confirm: true },
    ],
    funFact: { value: '[ADD]', confirm: true },
    deliverables: ['website', 'mascot', 'scripts'],
    devices: [
      { device: 'Metaphor', example: 'rebuilds them from the ground up', note: 'Describes a way of thinking by comparing it to building.' },
      { device: 'Simile', example: 'like a physicist who insists on re-deriving gravity', note: 'A direct "like" comparison.' },
      { device: 'Hyperbole', example: 'thousands of kilometres', note: 'Deliberate overstatement for warmth.' },
      { device: 'Allusion', example: 'spooky action at a distance', note: 'A knowing reference to Einstein’s phrase.' },
      { device: 'Antithesis', example: 'architect … while the rest of us were still in superposition', note: 'A contrast placed side by side.' },
    ],
  },
  {
    id: 'member-2',
    name: { value: '[MEMBER_2_NAME]', confirm: true },
    title: { value: 'The Time Lord of the Timeline (video editor)', confirm: true },
    bio: {
      value:
        '[MEMBER_2_NAME] doesn’t just edit; they bend time. Before the edit, every video exists in a superposition of masterpiece and mess; one export button collapses it, and [MEMBER_2_NAME] is the one holding the button. Armed with scissors made of pixels and patience made of steel, they turn hours of raw footage into minutes you actually want to watch.',
      confirm: true,
    },
    contributions: [
      { value: 'Editing and pacing', confirm: true },
      { value: 'Motion graphics', confirm: true },
      { value: 'Captions', confirm: true },
      { value: 'Qubi animation in the videos', confirm: true },
    ],
    funFact: { value: '[ADD]', confirm: true },
    deliverables: ['videos'],
    devices: [
      { device: 'Metaphor', example: 'bend time', note: 'Editing described as controlling time.' },
      { device: 'Simile', example: 'patience made of steel', note: 'A "made of" comparison.' },
      { device: 'Hyperbole', example: 'hours of raw footage into minutes', note: 'Exaggeration for effect.' },
      { device: 'Alliteration', example: 'made of pixels … patience made of steel', note: 'Repeated initial sounds.' },
    ],
  },
  {
    id: 'member-3',
    name: { value: '[MEMBER_3_NAME]', confirm: true },
    title: { value: 'The Voice of the Quantum (video speaker)', confirm: true },
    bio: {
      value:
        '[MEMBER_3_NAME] explains entanglement without a single equation and without a single tear, a feat rarer than a photon with a day off. Their voice is the thread that ties the series together: calm as a ground state, clear as a perfectly measured qubit.',
      confirm: true,
    },
    contributions: [
      { value: 'On-camera or voiceover delivery', confirm: true },
      { value: 'Script polishing', confirm: true },
      { value: 'Pronunciation checks', confirm: true },
    ],
    funFact: { value: '[ADD]', confirm: true },
    deliverables: ['videos'],
    devices: [
      { device: 'Metaphor', example: 'the thread that ties the series together', note: 'A voice compared to a connecting thread.' },
      { device: 'Simile', example: 'calm as a ground state, clear as a perfectly measured qubit', note: 'Two "as" comparisons at once.' },
      { device: 'Hyperbole', example: 'rarer than a photon with a day off', note: 'Playful overstatement.' },
    ],
  },
];
