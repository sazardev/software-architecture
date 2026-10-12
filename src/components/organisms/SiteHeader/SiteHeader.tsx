import { Link, useRouterState } from '@tanstack/react-router';

import { BrandMark, Container } from '@/components/atoms';
import { LanguageSwitcher, ThemeSwitcher } from '@/components/molecules';
import { navItems } from '@/lib/config/nav';
import { site } from '@/lib/config/site';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type NavItem = (typeof navItems)[number];

function isNavItemActive(pathname: string, item: NavItem, locale: string): boolean {
  const target = `/${locale}${item.path}`;

  return item.exact
    ? pathname === target || pathname === `${target}/`
    : pathname === target || pathname.startsWith(`${target}/`);
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = useLocale();
  const messages = useMessages();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-neutral-50/80 backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/80">
      <Container className="flex flex-col gap-1 py-3 md:h-16 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="group flex items-center gap-2.5 font-display text-base font-medium tracking-tight whitespace-nowrap text-neutral-900 sm:text-lg dark:text-neutral-50"
            params={{ locale }}
            to="/$locale"
          >
            <BrandMark className="text-neutral-900 transition-transform duration-500 ease-out-soft group-hover:scale-110 group-hover:-rotate-6 dark:text-neutral-50" />
            {site.name}
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
        <nav
          aria-label={messages.a11y.mainNavigation}
          className="flex items-center gap-1 font-sans text-sm md:gap-2"
        >
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item, locale);

            return (
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3 py-1.5 transition-colors duration-300 after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent-500 after:transition-transform after:duration-500 after:ease-out-soft hover:text-neutral-950 dark:hover:text-neutral-50',
                  isActive
                    ? 'font-medium text-neutral-950 after:scale-x-100 dark:text-neutral-50'
                    : 'text-neutral-600 dark:text-neutral-400',
                )}
                key={item.id}
                params={{ locale }}
                to={item.to}
              >
                {messages.nav[item.id]}
              </Link>
            );
          })}
          <div className="ml-3 hidden items-center gap-2 border-l border-neutral-200 pl-4 md:flex dark:border-neutral-800">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </nav>
      </Container>
    </header>
  );
}
