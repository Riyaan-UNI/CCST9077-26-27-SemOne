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
  fullName?: string;
  location?: string;
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
    fullName: 'Patan Mohammed Riyaan',
    location: 'India',
    title: { value: 'The First-Principles Tinkerer', confirm: true },
    bio: {
      value:
        'Chicha doesn’t borrow answers; he rebuilds them from the ground up, like a physicist who insists on re-deriving gravity before agreeing to fall. Born in Bengaluru, India’s Silicon Valley, and now studying Computer Science at HKU, he travelled thousands of kilometres to a lecture on spooky action at a distance, proof that some distances really do not matter. On this team he is the architect: he drew the blueprint, directed the machines, and kept the site standing while the rest of us were still in superposition about lunch.',
      confirm: true,
    },
    contributions: [
      { value: 'Website design and build direction (with a disclosed AI coding assistant)', confirm: true },
      { value: 'Project coordination', confirm: true },
    ],
    funFact: { value: '[Add a fun fact about yourself]', confirm: true },
    deliverables: ['website', 'mascot' ,'scripts'],
    devices: [
      { device: 'Metaphor', example: 'rebuilds them from the ground up', note: 'Describes a way of thinking by comparing it to building.' },
      { device: 'Simile', example: 'like a physicist who insists on re-deriving gravity', note: 'A direct "like" comparison.' },
      { device: 'Hyperbole', example: 'thousands of kilometres', note: 'Deliberate overstatement for warmth.' },
      { device: 'Allusion', example: 'spooky action at a distance', note: 'A knowing reference to Einstein’s phrase.' },
      { device: 'Antithesis', example: 'architect … while the rest of us were still in superposition', note: 'A contrast placed side by side.' },
    ],
  },
  {
    id: 'long',
    name: { value: 'Long', confirm: true },
    nickname: { value: 'Damian', confirm: true },
    fullName: 'Long Yat Damian Lau',
    location: 'Hong Kong',
    title: { value: 'The Mascot Maker of Qubi', confirm: true },
    bio: {
      value:
        'Long doesn’t just draw; he gives Qubi a soul. Before each iteration the mascot exists only as a sketch on paper; one careful pass through the SVG later, and Qubi is blinking on the page, alive and unmistakably himself. Armed with the patient and a good eye for pixel grids, he turns rough ideas into the friendly CRT-monitor robot you see in every page header.',
      confirm: true,
    },
    contributions: [
      { value: 'Qubi mascot design and SVG build', confirm: true },
      { value: 'Editing and pacing', confirm: true },
      { value: 'Motion graphics', confirm: true },
      { value: 'Captions', confirm: true },
    ],
    funFact: { value: '[Add a fun fact about yourself]', confirm: true },
    deliverables: ['mascot', 'videos'],
    devices: [
      { device: 'Metaphor', example: 'gives Qubi a soul', note: 'Drawing described as animating something to life.' },
      { device: 'Simile', example: 'alive and unmistakably himself', note: 'A direct "as if" comparison.' },
      { device: 'Personification', example: 'Qubi is blinking on the page', note: 'A static drawing given human-like action.' },
    ],
  },
  {
    id: 'markus',
    name: { value: 'Markus', confirm: true },
    fullName: 'Markus Skjerstad Dølvik',
    location: 'Norway',
    title: { value: 'The Voice of the Quantum', confirm: true },
    bio: {
      value:
        'Markus explains entanglement without a single equation and without a single tear, a feat rarer than a photon with a day off. His voice is the thread that ties the series together: calm as a ground state, clear as a perfectly measured qubit.',
      confirm: true,
    },
    contributions: [
      { value: 'On-camera or voiceover delivery', confirm: true },
      { value: 'Script polishing', confirm: true },
      { value: 'Pronunciation checks', confirm: true },
    ],
    funFact: { value: '[Add a fun fact about yourself]', confirm: true },
    deliverables: ['videos'],
    devices: [
      { device: 'Metaphor', example: 'the thread that ties the series together', note: 'A voice compared to a connecting thread.' },
      { device: 'Simile', example: 'calm as a ground state, clear as a perfectly measured qubit', note: 'Two "as" comparisons at once.' },
      { device: 'Hyperbole', example: 'rarer than a photon with a day off', note: 'Playful overstatement.' },
    ],
  },
];
