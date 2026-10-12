import { Link } from '@tanstack/react-router';

import { BrandMark, Container } from '@/components/atoms';
import { navItems } from '@/lib/config/nav';
import { site } from '@/lib/config/site';
import { getSectionText, sections } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

const currentYear = new Date().getFullYear();

const linkClass =
  'text-neutral-600 transition-colors hover:text-brand-700 dark:text-neutral-400 dark:hover:text-brand-300';

export function SiteFooter() {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-100/60 dark:border-neutral-800 dark:bg-neutral-900/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <p className="flex items-center gap-2.5 font-display text-xl font-medium">
            <BrandMark className="h-8 w-8" />
            {site.name}
          </p>
          <p className="font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {messages.site.description}
          </p>
        </div>
        <nav aria-label={messages.footer.explore} className="space-y-3 font-sans text-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
            {messages.footer.explore}
          </p>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link className={linkClass} params={{ locale }} to={item.to}>
                  {messages.nav[item.id]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={messages.footer.sections} className="space-y-3 font-sans text-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500 uppercase">
            {messages.footer.sections}
          </p>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <Link
                  className={linkClass}
                  params={{ locale }}
                  search={{ category: section.id }}
                  to="/$locale/docs"
                >
                  {getSectionText(section, locale).label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        <Container className="flex flex-col gap-1 py-5 font-sans text-xs text-neutral-500 sm:flex-row sm:justify-between">
          <span>{messages.footer.rights(currentYear)}</span>
          <span>{messages.footer.note}</span>
        </Container>
      </div>
    </footer>
  );
}
