import { Link } from '@tanstack/react-router';

import { Badge, Container } from '@/components/atoms';
import { Breadcrumbs, TitleBlock } from '@/components/molecules';
import { getDocSheet } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import { searchParams } from '@/lib/search/search-params';
import { readingGridClass } from '@/lib/ui/reading-layout';
import { cn } from '@/lib/utils/cn';
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
      <Container className={cn(readingGridClass, 'pt-10 pb-12 sm:pt-14 sm:pb-14')}>
        <div className="lg:col-start-2">
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
            className="mt-4 animate-rise font-display text-[clamp(2.3rem,5vw,3.9rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance text-neutral-950 dark:text-neutral-50"
            style={{ animationDelay: '100ms', fontVariationSettings: "'opsz' 144" }}
          >
            {entry.title}
          </h1>
          <p
            className="mt-6 animate-rise font-serif text-xl leading-relaxed text-pretty text-neutral-600 sm:text-[1.3rem] dark:text-neutral-300"
            style={{ animationDelay: '220ms' }}
          >
            {entry.description}
          </p>
          <TitleBlock
            className="mt-9 animate-fade bg-neutral-50 dark:bg-neutral-950"
            layout="row"
            rows={[
              { label: blueprint.topic, value: sectionLabel },
              { label: blueprint.sheet, value: `${pad(sheet.index)}/${pad(sheet.total)}` },
              { label: blueprint.reading, value: messages.docs.minutesShort(entry.readingMinutes) },
              { label: blueprint.rev, value: formatDate(entry.updatedAt, entry.locale) },
            ]}
          />
          <ul
            className="mt-5 flex animate-rise flex-wrap gap-2"
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
      </Container>
    </header>
  );
}
