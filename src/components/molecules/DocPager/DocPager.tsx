import { Link } from '@tanstack/react-router';

import type { ContentEntry } from '@/lib/content/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type DocPagerProps = Readonly<{
  next: ContentEntry | undefined;
  previous: ContentEntry | undefined;
}>;

const cardClass =
  'group flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lift dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700';

const hintClass =
  'font-sans text-xs font-semibold tracking-[0.16em] text-accent-700 uppercase dark:text-accent-400';

const titleClass =
  'font-display text-xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50';

export function DocPager({ next, previous }: DocPagerProps) {
  const locale = useLocale();
  const messages = useMessages();

  if (next === undefined && previous === undefined) {
    return null;
  }

  return (
    <nav
      aria-label={messages.a11y.pager}
      className="mt-20 grid gap-4 border-t border-neutral-200 pt-10 sm:grid-cols-2 dark:border-neutral-800"
    >
      {previous === undefined ? (
        <span />
      ) : (
        <Link
          className={cardClass}
          params={{ locale, slug: previous.slug }}
          to="/$locale/docs/$slug"
        >
          <span className={hintClass}>← {messages.docs.previous}</span>
          <span className={titleClass}>{previous.title}</span>
        </Link>
      )}
      {next === undefined ? null : (
        <Link
          className={cn(cardClass, 'text-right', previous === undefined && 'sm:col-span-2')}
          params={{ locale, slug: next.slug }}
          to="/$locale/docs/$slug"
        >
          <span className={hintClass}>{messages.docs.next} →</span>
          <span className={titleClass}>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
