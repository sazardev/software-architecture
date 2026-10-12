import { Link } from '@tanstack/react-router';

import { Badge, Container, Eyebrow, Reveal } from '@/components/atoms';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { formatDate } from '@/lib/utils/format-date';

type LatestDocsProps = Readonly<{
  docs: ContentEntry[];
}>;

export function LatestDocs({ docs }: LatestDocsProps) {
  const locale = useLocale();
  const messages = useMessages();
  const [featured, ...rest] = docs;

  if (featured === undefined) {
    return null;
  }

  return (
    <Container className="pt-24 sm:pt-32">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>{messages.home.latest.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-medium tracking-[-0.025em] text-neutral-950 sm:text-5xl dark:text-neutral-50">
            {messages.home.latest.title}
          </h2>
        </div>
        <Link
          className="link-underline pb-1 font-sans text-sm font-medium text-brand-700 dark:text-brand-300"
          params={{ locale }}
          to="/$locale/docs"
        >
          {messages.home.latest.all} →
        </Link>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <Link
            className="group relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-3xl bg-neutral-900 p-8 text-neutral-50 transition-shadow duration-500 hover:shadow-lift sm:p-10 dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-800"
            params={{ locale, slug: featured.slug }}
            to="/$locale/docs/$slug"
          >
            <span
              aria-hidden="true"
              className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-accent-500/40 blur-3xl transition-transform duration-700 ease-out-soft group-hover:scale-125"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl"
            />
            <Badge
              className="relative w-fit border-white/25 bg-white/10 text-neutral-50"
              tone="neutral"
            >
              {messages.docs.featured} · {getSectionLabel(featured.category, locale)}
            </Badge>
            <h3 className="relative mt-5 font-display text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
              {featured.title}
            </h3>
            <p className="relative mt-3 max-w-xl font-serif text-lg leading-relaxed text-neutral-300">
              {featured.description}
            </p>
            <p className="relative mt-6 flex items-center gap-3 font-sans text-sm text-neutral-400">
              <span>{messages.docs.minutesShort(featured.readingMinutes)}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(featured.updatedAt, locale)}</span>
              <span className="ml-auto font-medium text-neutral-50 transition-transform duration-300 group-hover:translate-x-1.5">
                {messages.docs.readArticle} →
              </span>
            </p>
          </Link>
        </Reveal>

        <ol className="flex flex-col divide-y divide-neutral-200 lg:col-span-2 dark:divide-neutral-800">
          {rest.map((doc, index) => (
            <li className="flex-1" key={doc.slug}>
              <Reveal className="h-full" delay={(index + 1) * 100}>
                <Link
                  className="group flex h-full gap-5 py-6 first:pt-0 lg:py-5"
                  params={{ locale, slug: doc.slug }}
                  to="/$locale/docs/$slug"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl leading-none font-light text-accent-500 italic"
                  >
                    {String(index + 2).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="font-sans text-xs tracking-[0.14em] text-neutral-500 uppercase">
                      {getSectionLabel(doc.category, locale)} ·{' '}
                      {messages.docs.minutesShort(doc.readingMinutes)}
                    </span>
                    <span className="link-underline mt-1.5 block font-display text-xl leading-snug font-medium text-neutral-950 dark:text-neutral-50">
                      {doc.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block font-serif text-[0.95rem] text-neutral-600 dark:text-neutral-400">
                      {doc.description}
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}
