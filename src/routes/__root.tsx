import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { NotFoundPage, SiteShell } from '@/components/templates';
import { site } from '@/lib/config/site';
import { websiteJsonLd } from '@/lib/seo/json-ld';
import { MdxProvider } from '@/mdx';

const RouterDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const { TanStackRouterDevtools } = await import('@tanstack/react-router-devtools');
      return { default: TanStackRouterDevtools };
    })
  : null;

export const Route = createRootRoute({
  component: RootRoute,
  head: () => ({
    meta: [{ title: site.name }, { content: site.description, name: 'description' }],
    scripts: [{ children: websiteJsonLd(), type: 'application/ld+json' }],
  }),
  notFoundComponent: NotFound,
});

function RootRoute() {
  return (
    <SiteShell>
      <HeadContent />
      <MdxProvider>
        <Outlet />
      </MdxProvider>
      {RouterDevtools ? <RouterDevtools /> : null}
    </SiteShell>
  );
}

function NotFound() {
  return <NotFoundPage />;
}
