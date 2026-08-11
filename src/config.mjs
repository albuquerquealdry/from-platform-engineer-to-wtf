/**
 * Single place for everything that identifies the site.
 * Change it here, it changes everywhere.
 */
export const SITE = {
  title: 'From Platform Engineer to WTF',
  titleMark: 'FROM PLATFORM ENGINEER TO WTF',
  tagline: 'A Platform Engineer’s journey into MLOps, AI and questionable decisions.',
  description:
    'An engineering journal documenting a transition from Platform Engineering and SRE into MLOps, ML and AI systems — learning by building, breaking things, and occasionally figuring out why they broke.',
  url: 'https://albuquerquealdry.github.io',
  author: 'Aldry Albuquerque',
  locale: 'en',
  // Optional. Empty strings are simply not rendered — fill in what you use.
  social: {
    github: '',
    linkedin: '',
    x: '',
    email: '',
  },
};

/** The migration status block. Edit as the migration progresses. */
export const STATUS = {
  state: 'MIGRATING',
  from: 'PLATFORM ENGINEERING',
  to: 'MLOps / AI',
  currently: 'FIGURING IT OUT',
  node: 'MLOps',
};

/** Rough, honest, self-assessed. Not a skill tree. */
export const DEPTH = [
  { label: 'PLATFORM ENGINEERING', filled: 10 },
  { label: 'MLOPS', filled: 6 },
  { label: 'AI', filled: 4 },
  { label: 'WTF', filled: 10 },
];

/** Keep this list short on purpose. */
export const CATEGORIES = [
  'Migration',
  'MLOps',
  'AI',
  'ML',
  'Infrastructure',
  'Projects',
  'Notes',
];
