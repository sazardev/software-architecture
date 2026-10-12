import { Link } from '@tanstack/react-router';

import { Badge, Container } from '@/components/atoms';
import { Breadcrumbs } from '@/components/molecules';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { searchParams } from '@/lib/search/search-params';
import { formatDate } from '@/lib/utils/format-date';

type DocHeaderProps = Readonly<{
  entry: ContentEntry;
}>;

export function DocHeader({ entry }: DocHeaderProps) {
  const messages = useMessages();

  return (
    <header className="relative isolate overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-24 -z-10 h-96 w-96 rounded-full bg-accent-200/40 blur-3xl dark:bg-accent-700/15"
      />
      <Container className="pt-10 pb-12 sm:pt-14 sm:pb-16">
        <Breadcrumbs
          className="animate-fade"
          items={[
            {
              label: messages.docs.breadcrumbHome,
              params: { locale: entry.locale },
              to: '/$locale/',
            },
            {
              label: messages.docs.breadcrumbDocs,
              params: { locale: entry.locale },
              to: '/$locale/docs',
            },
            { label: entry.title },
          ]}
        />
        <p className="mt-8 animate-rise font-sans text-xs font-semibold tracking-[0.18em] text-accent-700 uppercase dark:text-accent-400">
          {getSectionLabel(entry.category, entry.locale)}
        </p>
        <h1
          className="mt-4 max-w-4xl animate-rise font-display text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[1.04] font-medium tracking-[-0.03em] text-balance text-neutral-950 dark:text-neutral-50"
          style={{ animationDelay: '100ms', fontVariationSettings: "'opsz' 144" }}
        >
          {entry.title}
        </h1>
        <p
          className="mt-6 max-w-2xl animate-rise font-serif text-xl leading-relaxed text-pretty text-neutral-600 sm:text-[1.35rem] dark:text-neutral-300"
          style={{ animationDelay: '220ms' }}
        >
          {entry.description}
        </p>
        <div
          className="mt-8 flex animate-rise flex-wrap items-center gap-x-4 gap-y-3 font-sans text-sm text-neutral-500 dark:text-neutral-400"
          style={{ animationDelay: '340ms' }}
        >
          <span>{messages.docs.readingTime(entry.readingMinutes)}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-500" />
          <span>{messages.docs.updatedOn(formatDate(entry.updatedAt, entry.locale))}</span>
        </div>
        <ul className="mt-4 flex animate-rise flex-wrap gap-2" style={{ animationDelay: '420ms' }}>
          {entry.tags.map((tag) => (
            <li key={tag}>
              <Link
                params={{ locale: entry.locale }}
                search={searchParams({ tag })}
                to="/$locale/search"
              >
                <Badge tone="outline">#{tag}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </header>
  );
}
