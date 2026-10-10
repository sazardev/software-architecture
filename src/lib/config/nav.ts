export const navItems = [
  { exact: true, id: 'home', path: '', to: '/$locale' },
  { exact: false, id: 'docs', path: '/docs', to: '/$locale/docs' },
  { exact: false, id: 'search', path: '/search', to: '/$locale/search' },
] as const;
