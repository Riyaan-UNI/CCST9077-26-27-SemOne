/**
 * Team names and contribution details supplied by the project group.
 * The group reports that the quantum facts have been reviewed for accuracy.
 */
export type Deliverable = 'website' | 'videos' | 'mascot' | 'scripts';

export interface QuantumFact {
  text: string;
  reviewStatus: 'reviewed';
  reference: {
    label: string;
    url: string;
  };
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
  funFact: QuantumFact;
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
      reviewStatus: 'reviewed',
      reference: {
        label: 'IBM Quantum Learning · Quantum algorithmic foundations',
        url: 'https://learning.quantum.ibm.com/course/fundamentals-of-quantum-algorithms/quantum-algorithmic-foundations',
      },
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
      reviewStatus: 'reviewed',
      reference: {
        label: 'IBM Quantum Learning · Bloch sphere',
        url: 'https://learning.quantum.ibm.com/course/general-formulation-of-quantum-information/density-matrices',
      },
    },
    deliverables: ['mascot', 'videos', 'scripts'],
  },
  {
    id: 'markus',
    name: 'Markus',
    title: 'Video speaker',
    contributions: ['Speaker in the videos'],
    funFact: {
      text: 'Entangled particles can have strongly linked measurement results, but entanglement cannot send a message faster than light.',
      reviewStatus: 'reviewed',
      reference: {
        label: 'Pawłowski et al. · Nature',
        url: 'https://www.nature.com/articles/nature08400',
      },
    },
    deliverables: ['videos'],
  },
  {
    id: 'cynthia',
    name: 'Cynthia',
    fullName: 'Cynthia (Sun Siyan)',
    title: 'Video speaker · Scriptwriter',
    contributions: ['Video script-writing', 'Speaker in the videos'],
    funFact: {
      text: 'The no-cloning theorem rules out perfectly copying every arbitrary unknown quantum state with one universal copier.',
      reviewStatus: 'reviewed',
      reference: {
        label: 'Wootters and Zurek · Nature',
        url: 'https://doi.org/10.1038/299802A0',
      },
    },
    deliverables: ['videos', 'scripts'],
  },
];
