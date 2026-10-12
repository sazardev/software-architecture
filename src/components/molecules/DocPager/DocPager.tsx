import { Link } from '@tanstack/react-router';

import { BlueprintFrame } from '@/components/atoms';
import type { ContentEntry } from '@/lib/content/types';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type DocPagerProps = Readonly<{
  next: ContentEntry | undefined;
  previous: ContentEntry | undefined;
}>;

const frameClass =
  'group transition-colors duration-300 hover:border-neutral-900 dark:hover:border-neutral-300';

const hintClass =
  'font-mono text-xs tracking-[0.16em] text-accent-700 uppercase dark:text-accent-400';

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
      className="mt-20 grid gap-6 border-t border-neutral-200 pt-10 sm:grid-cols-2 dark:border-neutral-800"
    >
      {previous === undefined ? (
        <span />
      ) : (
        <BlueprintFrame className={frameClass}>
          <Link
            className="flex flex-col gap-1 p-6"
            params={{ locale, slug: previous.slug }}
            to="/$locale/docs/$slug"
          >
            <span className={hintClass}>← {messages.docs.previous}</span>
            <span className={titleClass}>{previous.title}</span>
          </Link>
        </BlueprintFrame>
      )}
      {next === undefined ? null : (
        <BlueprintFrame className={cn(frameClass, previous === undefined && 'sm:col-span-2')}>
          <Link
            className="flex flex-col gap-1 p-6 text-right"
            params={{ locale, slug: next.slug }}
            to="/$locale/docs/$slug"
          >
            <span className={hintClass}>{messages.docs.next} →</span>
            <span className={titleClass}>{next.title}</span>
          </Link>
        </BlueprintFrame>
      )}
    </nav>
  );
}
