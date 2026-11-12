/**
 * Team names and contribution details supplied by the project group.
 * Quantum facts are short explanatory drafts and remain pending group science review.
 */
export type Deliverable = 'website' | 'videos' | 'mascot' | 'scripts';

export interface DraftQuantumFact {
  text: string;
  reviewStatus: 'group-review-pending';
}

export interface TeamMember {
  id: string;
  name: string;
  /** Full name is shown only when the member requested it. */
  fullName?: string;
  /** Name the member goes by. */
  nickname?: string;
  title: string;
  contributions: string[];
  funFact: DraftQuantumFact;
  deliverables: Deliverable[];
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
    name: 'Riyaan',
    title: 'Website · Video editing · Mascot',
    contributions: ['Website', 'Video editing', 'Mascot'],
    funFact: {
      text: 'Quantum algorithms can use interference so that some possible outcomes cancel while others become more likely.',
      reviewStatus: 'group-review-pending',
    },
    deliverables: ['website', 'videos', 'mascot'],
  },
  {
    id: 'damian',
    name: 'Damian',
    fullName: 'Long Yat Damian Lau',
    nickname: 'Damian',
    title: 'Voice of Qubi · Chief video editor · Scriptwriter · Mascot inventor',
    contributions: [
      'Voice of Qubi in the videos',
      'Chief video editor',
      'Video script-writing',
      'Inventor of the Qubi mascot',
    ],
    funFact: {
      text: 'A single qubit’s pure state can be pictured as a point on a sphere called the Bloch sphere; its poles represent 0 and 1.',
      reviewStatus: 'group-review-pending',
    },
    deliverables: ['mascot', 'videos', 'scripts'],
  },
  {
    id: 'markus',
    name: 'Markus',
    title: 'Video speaker · Script contributor',
    contributions: ['Speaker in the videos', 'Video script-writing'],
    funFact: {
      text: 'Entangled particles can have strongly linked measurement results, but entanglement cannot send a message faster than light.',
      reviewStatus: 'group-review-pending',
    },
    deliverables: ['videos', 'scripts'],
  },
  {
    id: 'cynthia',
    name: 'Cynthia',
    fullName: 'Cynthia (Sun Siyan)',
    title: 'Video speaker · Scriptwriter',
    contributions: ['Video script-writing', 'Speaker in the videos'],
    funFact: {
      text: 'The no-cloning theorem rules out perfectly copying every arbitrary unknown quantum state with one universal copier.',
      reviewStatus: 'group-review-pending',
    },
    deliverables: ['videos', 'scripts'],
  },
];
