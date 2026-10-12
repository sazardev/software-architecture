import type { Messages } from '@/lib/i18n/messages/es';

export const en: Messages = {
  a11y: {
    backToTop: 'Back to top',
    mainNavigation: 'Main navigation',
    readingProgress: 'Reading progress',
    breadcrumbs: 'Breadcrumbs',
    categoryFilter: 'Filter by section',
    pager: 'Document navigation',
    searchField: 'Search resources',
    skipToContent: 'Skip to content',
    tableOfContents: 'On this page',
  },
  docs: {
    articleCount: (count: number) => (count === 1 ? '1 article' : `${count} articles`),
    topics: 'Topics',
    viewAllIn: (count: number, topic: string) => `See all ${count} articles in ${topic}`,
    allArticles: 'All articles',
    featured: 'Featured',
    keepReading: 'Keep reading',
    minutesShort: (minutes: number) => `${minutes} min`,
    readArticle: 'Read article',
    relatedDescription: 'More reads from the same section.',
    breadcrumbDocs: 'Documentation',
    breadcrumbHome: 'Home',
    empty: 'There are no documents in this section yet.',
    indexDescription:
      'Explore foundations, system design and engineering practices resources for software architects.',
    notFoundDescription: 'The requested document does not exist in the content index.',
    next: 'Next',
    notFoundTitle: 'Document not found',
    previous: 'Previous',
    readingTime: (minutes: number) => `${minutes} min read`,
    summary: (count: number, sections: number) =>
      `${count} resources organized in ${sections} sections.`,
    title: 'Documentation',
    updatedOn: (date: string) => `updated on ${date}`,
  },
  home: {
    cta: {
      body: 'Foundations save you months of refactoring. Start with the first article and go at your own pace.',
      title: 'Start with the foundations',
    },
    eyebrow: 'An engineering notebook',
    heroAlt: 'Animated diagram of a layered architecture',
    latest: {
      all: 'Browse all documentation',
      eyebrow: 'Recent reads',
      title: 'Latest from the notebook',
    },
    principles: {
      items: [
        {
          body: 'Every article starts from a real problem and ends in an idea you can sketch on a napkin.',
          title: 'Clarity over cleverness',
        },
        {
          body: 'Diagrams, maps and interactive examples: you watch the system move instead of just reading about it.',
          title: 'Living diagrams',
        },
        {
          body: 'Comfortable typography, dark mode, instant search and offline support.',
          title: 'Made for reading',
        },
      ],
      title: 'A calmer way to learn architecture',
    },
    search: 'Search resources',
    sections: {
      all: (count: number) => `See all ${count} topics`,
      eyebrow: 'Topics',
      explore: 'Explore topic',
      title: 'Explore by topic',
    },
    tags: {
      eyebrow: 'Tags',
      title: 'Or follow the thread by tag',
    },
    start: 'Start reading',
    stats: {
      articles: 'articles',
      minutes: 'minutes of reading',
      sections: 'sections',
    },
    titleAccent: 'done right',
    titleLead: 'Software architecture,',
  },
  footer: {
    allTopics: 'All topics',
    explore: 'Explore',
    note: 'Crafted with care for people who design systems.',
    rights: (year: number) => `© ${year} Software Architecture`,
    sections: 'Sections',
  },
  blueprint: {
    figure: 'FIG.',
    project: 'PROJECT',
    reading: 'READING',
    rev: 'REV.',
    scale: 'SCALE',
    sheet: 'SHEET',
    topic: 'TOPIC',
  },
  code: {
    copied: 'Copied',
    copy: 'Copy code',
  },
  languageSwitcher: {
    label: 'Language',
  },
  map: {
    error: 'The interactive map could not be loaded.',
    label: 'Interactive map',
  },
  nav: {
    docs: 'Documentation',
    home: 'Home',
    search: 'Search',
  },
  notFound: {
    code: '404',
    description:
      'The page you are looking for does not exist or has moved. Try the search or go back home.',
    home: 'Back home',
    search: 'Search',
    title: '404 · Not found',
  },
  solid: {
    fragileInheritanceBody:
      'Inheritance shares much more than methods: it shares expectations. If a subclass needs to disable inherited behavior, the hierarchy is inverted or unnecessary. When in doubt, prefer composing over inheriting.',
    fragileInheritanceTitle: 'Fragile inheritance',
  },
  search: {
    allCategories: 'All',
    available: (count: number) => `${count} resources available`,
    hint: 'Local search across titles, tags, descriptions and headings.',
    shortcut: 'Keyboard shortcut:',
    metaDescription:
      'Instant search across titles, descriptions, tags and headings of every resource.',
    noResults: (query: string) => `No results for “${query}”.`,
    placeholder: 'Search the documentation…',
    removeTag: (tag: string) => `Remove the #${tag} filter`,
    results: (count: number, query: string) => `${count} result(s) for “${query}”`,
    title: 'Search',
  },
  site: {
    description:
      'Ultra interactive resources, living diagrams and deep documentation to design systems that scale.',
  },
  theme: {
    dark: 'dark',
    label: 'Theme',
    light: 'light',
    switchTo: (next: string) => `Switch to ${next} theme`,
    system: 'system',
  },
};
