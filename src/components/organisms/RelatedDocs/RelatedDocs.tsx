import { Link } from '@tanstack/react-router';

import { Eyebrow } from '@/components/atoms';
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
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <Link
              className="group block h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lift dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
              params={{ locale, slug: doc.slug }}
              to="/$locale/docs/$slug"
            >
              <span className="font-sans text-xs tracking-[0.14em] text-neutral-500 uppercase">
                {messages.docs.minutesShort(doc.readingMinutes)}
              </span>
              <span className="mt-2 block font-display text-xl leading-snug font-medium text-neutral-950 dark:text-neutral-50">
                {doc.title}
              </span>
              <span className="mt-2 line-clamp-2 block font-serif text-[0.95rem] text-neutral-600 dark:text-neutral-400">
                {doc.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
