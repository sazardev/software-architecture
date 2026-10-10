import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/routeTree.gen';

const basepath = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createRouter({
  basepath,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 30_000,
  routeTree,
  scrollRestoration: true,
});

declare module '@tanstack/router-core' {
  interface Register {
    router: typeof router;
  }
}
