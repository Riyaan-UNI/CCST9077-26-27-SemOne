export const SITE_INDEX_HREF = '/#site-index';

export const pageGroups = [
  {
    title: 'Start exploring',
    pages: [
      { href: '/cases', label: 'Case files', detail: 'Explore measurement, entanglement, and no-cloning.' },
      { href: '/videos', label: 'Video records', detail: 'Watch the group’s quantum episodes.' },
      { href: '/ledger', label: 'Case conference', detail: 'Compare the findings and your saved notes.' },
    ],
  },
  {
    title: 'Try an activity',
    pages: [
      { href: '/computer#level1', label: 'Computer playground', detail: 'Start with the Magic Box, then try entanglement and circuit puzzles.' },
      { href: '/lab', label: 'Reference lab', detail: 'Run the simulator and CHSH game.' },
      { href: '/universe-computer', label: 'Universe computer', detail: 'Explore the larger interactive computer activity.' },
      { href: '/delight', label: 'Quick checks', detail: 'Check common quantum claims and misconceptions.' },
    ],
  },
  {
    title: 'Look something up',
    pages: [
      { href: '/glossary', label: 'Term index', detail: 'Find plain-language explanations of quantum vocabulary.' },
      { href: '/gallery', label: 'Diagram archive', detail: 'Browse the project’s visual explainers.' },
      { href: '/timeline', label: 'Course timeline', detail: 'Trace selected ideas across the course.' },
      { href: '/course-map', label: 'Lecture map', detail: 'See where the case topics appear in the course.' },
    ],
  },
  {
    title: 'About the project',
    pages: [
      { href: '/team', label: 'Meet the team', detail: 'See the contributors and their project roles.' },
      { href: '/about', label: 'About the bureau', detail: 'Learn how to explore the archive and its case tests.' },
      { href: '/credits', label: 'Sources and credits', detail: 'Review the project’s sources, assets, and AI-use note.' },
    ],
  },
] as const;
