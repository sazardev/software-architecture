import { Link } from '@tanstack/react-router';

import { BlueprintFrame, Container, Eyebrow, Reveal } from '@/components/atoms';
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

      <div className="mt-12 grid gap-8 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <BlueprintFrame className="group h-full border-brand-950 dark:border-brand-950">
            <Link
              className="bp-panel flex h-full min-h-80 flex-col justify-end p-8 sm:p-10"
              params={{ locale, slug: featured.slug }}
              to="/$locale/docs/$slug"
            >
              <span className="w-fit border border-white/30 px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.16em] uppercase">
                {messages.docs.featured} · {getSectionLabel(featured.category, locale)}
              </span>
              <h3 className="mt-5 font-display text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-xl font-serif text-lg leading-relaxed text-neutral-300">
                {featured.description}
              </p>
              <p className="mt-6 flex items-center gap-3 border-t border-white/20 pt-4 font-mono text-xs tracking-[0.12em] text-neutral-300 uppercase">
                <span>{messages.docs.minutesShort(featured.readingMinutes)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(featured.updatedAt, locale)}</span>
                <span className="ml-auto font-medium text-accent-300 transition-transform duration-300 group-hover:translate-x-1.5">
                  {messages.docs.readArticle} →
                </span>
              </p>
            </Link>
          </BlueprintFrame>
        </Reveal>

        <ol className="flex flex-col divide-y divide-neutral-300 lg:col-span-2 dark:divide-neutral-700">
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
                    className="font-mono text-sm leading-7 text-accent-600 dark:text-accent-400"
                  >
                    {String(index + 2).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="font-mono text-[0.68rem] tracking-[0.14em] text-neutral-500 uppercase">
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
