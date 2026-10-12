import { Link } from '@tanstack/react-router';

import { Badge, Container } from '@/components/atoms';
import { Breadcrumbs, TitleBlock } from '@/components/molecules';
import { getDocSheet } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { searchParams } from '@/lib/search/search-params';
import { formatDate } from '@/lib/utils/format-date';

type DocHeaderProps = Readonly<{
  entry: ContentEntry;
}>;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function DocHeader({ entry }: DocHeaderProps) {
  const messages = useMessages();
  const { blueprint } = messages;
  const sheet = getDocSheet(entry.locale, entry.slug);
  const sectionLabel = getSectionLabel(entry.category, entry.locale);

  return (
    <header className="bp-grid border-b border-neutral-200 dark:border-neutral-800">
      <Container className="grid gap-10 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
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
          <p className="mt-8 animate-rise font-mono text-xs font-medium tracking-[0.18em] text-accent-700 uppercase dark:text-accent-400">
            {sectionLabel}
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
          <ul
            className="mt-8 flex animate-rise flex-wrap gap-2"
            style={{ animationDelay: '340ms' }}
          >
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
        </div>
        <TitleBlock
          className="w-full animate-fade bg-neutral-50 lg:w-72 dark:bg-neutral-950"
          rows={[
            { label: blueprint.topic, value: sectionLabel },
            { label: blueprint.sheet, value: `${pad(sheet.index)}/${pad(sheet.total)}` },
            { label: blueprint.reading, value: messages.docs.minutesShort(entry.readingMinutes) },
            { label: blueprint.rev, value: formatDate(entry.updatedAt, entry.locale) },
          ]}
        />
      </Container>
    </header>
  );
}
