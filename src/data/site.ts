export const site = {
  course: 'CCST9077',
  courseTitle: 'The Quantum Revolution',
  courseSubtitle: 'From Secret Codes to Quantum Computers',
  institution: 'The University of Hong Kong',
  faculty: 'Common Core · Sci-Tech Literacy',
  tagline: 'An interactive journey from classical ciphers to entangled qubits — hosted by Qubi.',
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
    neon: '#39FF14',
    black: '#111111',
    cream: '#F6F1E4',
    hkuGreen: '#0F402E',
  },
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Lab', href: '/lab' },
  { label: 'Videos', href: '/videos' },
  { label: 'Team', href: '/team' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Course map', href: '/course-map' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Sandbox', href: '/computer' },
  { label: 'Delight', href: '/delight' },
  { label: 'Credits', href: '/credits' },
] as const;
