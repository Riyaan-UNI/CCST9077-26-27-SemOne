/**
 * Team content for the /team page.
 *
 * Every human-authored line carries `confirm: true`. Fun facts are short,
 * general quantum explanations rather than personal claims about members.
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
      { value: 'Website', confirm: true },
      { value: 'Video editing', confirm: true },
      { value: 'Mascot', confirm: true },
    ],
    funFact: {
      value:
        'Quantum algorithms use interference: possible paths can combine so wrong answers cancel while useful answers become more likely.',
      confirm: true,
    },
    deliverables: ['website', 'videos', 'mascot'],
    devices: [
      { device: 'Metaphor', example: 'rebuilds them from the ground up', note: 'Describes a way of thinking by comparing it to building.' },
      { device: 'Simile', example: 'like a physicist who insists on re-deriving gravity', note: 'A direct "like" comparison.' },
      { device: 'Hyperbole', example: 'thousands of kilometres', note: 'Deliberate overstatement for warmth.' },
      { device: 'Allusion', example: 'spooky action at a distance', note: 'A knowing reference to Einstein’s phrase.' },
      { device: 'Antithesis', example: 'architect … while the rest of us were still in superposition', note: 'A contrast placed side by side.' },
    ],
  },
  {
    id: 'damian',
    name: { value: 'Damian', confirm: true },
    title: { value: 'The Voice of Qubi', confirm: true },
    bio: {
      value:
        'Damian voices Qubi in the videos, leads video editing, writes scripts, and invented the Qubi mascot.',
      confirm: true,
    },
    contributions: [
      { value: 'Voice of Qubi in the videos', confirm: true },
      { value: 'Chief video editor', confirm: true },
      { value: 'Video script-writing', confirm: true },
      { value: 'Inventor of the Qubi mascot', confirm: true },
    ],
    funFact: {
      value:
        'A single qubit’s pure state can be pictured as a point on a sphere called the Bloch sphere; its poles represent 0 and 1.',
      confirm: true,
    },
    deliverables: ['mascot', 'videos', 'scripts'],
    devices: [],
  },
  {
    id: 'markus',
    name: { value: 'Markus', confirm: true },
    fullName: 'Markus Skjerstad Dølvik',
    location: 'Norway',
    title: { value: 'A Speaker in the Video Series', confirm: true },
    bio: {
      value:
        'Markus is a speaker in the video series.',
      confirm: true,
    },
    contributions: [{ value: 'Speaker in the videos', confirm: true }],
    funFact: {
      value:
        'Entangled particles can have strongly linked measurement results, but entanglement cannot send a message faster than light.',
      confirm: true,
    },
    deliverables: ['videos'],
    devices: [],
  },
  {
    id: 'cynthia',
    name: { value: 'Cynthia', confirm: true },
    fullName: 'Cynthia (Sun Siyan)',
    title: { value: 'The Scriptwriter and Video Speaker', confirm: true },
    bio: {
      value:
        'Cynthia (Sun Siyan) contributes to the video series through script-writing and as a speaker.',
      confirm: true,
    },
    contributions: [
      { value: 'Video script-writing', confirm: true },
      { value: 'Speaker in the videos', confirm: true },
    ],
    funFact: {
      value:
        'The no-cloning theorem says an unknown quantum state cannot be copied perfectly, so quantum information needs special ways to detect errors.',
      confirm: true,
    },
    deliverables: ['videos', 'scripts'],
    devices: [],
  },
];
