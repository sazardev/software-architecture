import { Link } from '@tanstack/react-router';

import { BlueprintFrame, Eyebrow } from '@/components/atoms';
import { FigureThumb } from '@/components/molecules';
import type { ContentEntry } from '@/lib/content/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

type RelatedDocsProps = Readonly<{
  docs: ContentEntry[];
}>;

export function RelatedDocs({ docs }: RelatedDocsProps) {
  const locale = useLocale();
  const messages = useMessages();

  if (docs.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <Eyebrow>{messages.docs.keepReading}</Eyebrow>
      <p className="mt-3 font-serif text-lg text-neutral-600 dark:text-neutral-400">
        {messages.docs.relatedDescription}
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <BlueprintFrame className="group h-full transition-colors duration-300 hover:border-neutral-900 dark:hover:border-neutral-300">
              <Link
                className="block h-full p-6"
                params={{ locale, slug: doc.slug }}
                to="/$locale/docs/$slug"
              >
                <FigureThumb className="mb-5" slug={doc.slug} />
                <span className="font-mono text-xs tracking-[0.14em] text-neutral-500 uppercase dark:text-neutral-400">
                  {messages.docs.minutesShort(doc.readingMinutes)}
                </span>
                <span className="mt-2 block font-display text-xl leading-snug font-medium text-neutral-950 dark:text-neutral-50">
                  {doc.title}
                </span>
                <span className="mt-2 line-clamp-2 block font-serif text-[0.95rem] text-neutral-600 dark:text-neutral-400">
                  {doc.description}
                </span>
              </Link>
            </BlueprintFrame>
          </li>
        ))}
      </ul>
    </section>
  );
}
