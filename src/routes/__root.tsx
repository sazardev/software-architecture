import { HeadContent, Outlet, createRootRoute, useRouterState } from '@tanstack/react-router';
import { lazy } from 'react';

import { NotFoundPage, SiteShell } from '@/components/templates';
import { site } from '@/lib/config/site';
import { LocaleProvider } from '@/lib/i18n/locale-provider';
import { localeFromPathname, defaultLocale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { MdxProvider } from '@/mdx';

const RouterDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const { TanStackRouterDevtools } = await import('@tanstack/react-router-devtools');
      return { default: TanStackRouterDevtools };
    })
  : null;

const rootMessages = getMessages(defaultLocale);

export const Route = createRootRoute({
  component: RootRoute,
  head: () => ({
    meta: [{ title: site.name }, { content: rootMessages.site.description, name: 'description' }],
  }),
  notFoundComponent: NotFound,
});

function RootRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <LocaleProvider locale={localeFromPathname(pathname)}>
      <SiteShell>
        <HeadContent />
        <MdxProvider>
          <Outlet />
        </MdxProvider>
        {RouterDevtools ? <RouterDevtools /> : null}
      </SiteShell>
    </LocaleProvider>
  );
}

function NotFound() {
  return <NotFoundPage />;
}
