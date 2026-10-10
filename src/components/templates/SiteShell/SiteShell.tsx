import { Link, useRouterState } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { LanguageSwitcher, ThemeSwitcher } from '@/components/molecules';
import { navItems } from '@/lib/config/nav';
import { site } from '@/lib/config/site';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

type NavItem = (typeof navItems)[number];

function isNavItemActive(pathname: string, item: NavItem, locale: string): boolean {
  const target = `/${locale}${item.path}`;

  return item.exact
    ? pathname === target || pathname === `${target}/`
    : pathname === target || pathname.startsWith(`${target}/`);
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = useLocale();
  const messages = useMessages();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-20 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        href="#contenido"
      >
        {messages.a11y.skipToContent}
      </a>
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
          <Link className="font-semibold tracking-tight" params={{ locale }} to="/$locale">
            {site.name}
          </Link>
          <nav className="flex items-center gap-5 text-sm text-neutral-600 dark:text-neutral-300">
            {navItems.map((item) => (
              <Link
                className={cn(
                  'transition-colors hover:text-brand-600 dark:hover:text-brand-400',
                  isNavItemActive(pathname, item, locale) &&
                    'font-medium text-brand-600 dark:text-brand-400',
                )}
                key={item.id}
                params={{ locale }}
                to={item.to}
              >
                {messages.nav[item.id]}
              </Link>
            ))}
            <LanguageSwitcher />
            <ThemeSwitcher />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10" id="contenido">
        {children}
      </main>
      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 dark:border-neutral-800">
        {site.name}
      </footer>
    </div>
  );
}
