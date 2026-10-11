import type { Messages } from '@/lib/i18n/messages/es';

export const en: Messages = {
  a11y: {
    breadcrumbs: 'Breadcrumbs',
    categoryFilter: 'Filter by section',
    pager: 'Document navigation',
    searchField: 'Search resources',
    skipToContent: 'Skip to content',
    tableOfContents: 'On this page',
  },
  docs: {
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
    search: 'Search resources',
    start: 'Get started',
    title: 'Software architecture, for real',
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
