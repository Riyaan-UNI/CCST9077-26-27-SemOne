export const site = {
  course: 'CCST9077',
  courseTitle: 'The Quantum Revolution',
  courseSubtitle: 'From Secret Codes to Quantum Computers',
  institution: 'The University of Hong Kong',
  faculty: 'Common Core · Sci-Tech Literacy',
  title: 'Quantum Lost-and-Found Bureau',
  tagline: 'An open case archive for first-time quantum explorers — with Qubi on the desk.',
  mascot: {
    name: 'Qubi',
    pronunciation: 'KYOO-bee',
    from: 'qubit',
    species: 'Qubit terminal — a friendly retro CRT-monitor robot',
    catchphrase: "Let's get entangled!",
    catchphrases: [
      "Let's get entangled!",
      'Stay superposed.',
      'Measurement time!',
      '…that\u2019s spooky.',
    ],
  },
  palette: {
    signalOrange: '#F05A28',
    ultramarine: '#2946D8',
    black: '#10141A',
    cream: '#F5F6F8',
    hkuGreen: '#0F402E',
  },
} as const;

export const nav = [
  { label: 'Public Registry', href: '/' },
  { label: 'Cases', href: '/cases' },
  { label: 'Evidence Ledger', href: '/ledger' },
  { label: 'Videos', href: '/videos' },
  { label: 'Reference Lab', href: '/lab' },
  { label: 'Team', href: '/team' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Credits', href: '/credits' },
] as const;
