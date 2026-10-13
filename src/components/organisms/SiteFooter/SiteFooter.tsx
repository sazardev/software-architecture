import { Link } from '@tanstack/react-router';

import { BrandMark, Container } from '@/components/atoms';
import { navItems } from '@/lib/config/nav';
import { site } from '@/lib/config/site';
import { getSectionText, sections } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

/**
Temas listados en el pie; el resto queda tras el enlace "Todos los temas".
*/
const FOOTER_TOPIC_LIMIT = 6;

const currentYear = new Date().getFullYear();

const linkClass =
  'text-neutral-600 transition-colors hover:text-brand-700 dark:text-neutral-400 dark:hover:text-brand-300';

const labelClass =
  'font-mono text-[0.68rem] tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400';

const cellClass = 'space-y-4 p-6 sm:p-8';

export function SiteFooter() {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <footer className="mt-24 border-t border-neutral-200 dark:border-neutral-800">
      <Container className="py-14">
        <div className="grid divide-y divide-neutral-400 border border-neutral-400 bg-neutral-50 md:grid-cols-[1.4fr_1fr_1fr] md:divide-x md:divide-y-0 dark:divide-neutral-600 dark:border-neutral-600 dark:bg-neutral-950">
          <div className={cellClass}>
            <p className={labelClass}>{messages.blueprint.project}</p>
            <p className="flex items-center gap-2.5 font-display text-xl font-medium">
              <BrandMark className="h-8 w-8" />
              {site.name}
            </p>
            <p className="max-w-sm font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              {messages.site.description}
            </p>
          </div>
          <nav aria-label={messages.footer.explore} className={`${cellClass} font-sans text-sm`}>
            <p className={labelClass}>{messages.footer.explore}</p>
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
          <nav aria-label={messages.footer.sections} className={`${cellClass} font-sans text-sm`}>
            <p className={labelClass}>{messages.footer.sections}</p>
            <ul className="space-y-2">
              {sections.slice(0, FOOTER_TOPIC_LIMIT).map((section) => (
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
              {sections.length > FOOTER_TOPIC_LIMIT ? (
                <li>
                  <Link
                    className="font-medium text-brand-700 dark:text-brand-300"
                    params={{ locale }}
                    to="/$locale/docs"
                  >
                    {messages.footer.allTopics} →
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-3 font-mono text-[0.68rem] tracking-[0.12em] text-neutral-500 uppercase sm:flex-row sm:items-center sm:justify-between dark:text-neutral-400">
          <span>{messages.footer.rights(currentYear)}</span>
          <nav aria-label={messages.footer.machine} className="flex items-center gap-4">
            <a className={linkClass} href={`/${locale}/feed.xml`}>
              {messages.footer.rss}
            </a>
            <a className={linkClass} href={`/${locale}/llms.txt`}>
              {messages.footer.llms}
            </a>
            <a className={linkClass} href="/sitemap.xml">
              {messages.footer.sitemap}
            </a>
          </nav>
          <span>{messages.footer.note}</span>
        </div>
      </Container>
    </footer>
  );
}
