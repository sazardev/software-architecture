import { Link } from '@tanstack/react-router';

import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

type NotFoundPageProps = Readonly<{
  className?: string;
  description?: string;
  title?: string;
}>;

export function NotFoundPage({ className, description, title }: NotFoundPageProps) {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <section
      className={cn(
        'mx-auto flex max-w-xl flex-col items-center gap-4 py-24 text-center',
        className,
      )}
    >
      <p className="text-sm font-semibold tracking-wider text-brand-600 uppercase dark:text-brand-400">
        {messages.notFound.code}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{title ?? messages.notFound.title}</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        {description ?? messages.notFound.description}
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          params={{ locale }}
          to="/$locale"
        >
          {messages.notFound.home}
        </Link>
        <Link
          className="inline-flex h-10 items-center rounded-lg border border-neutral-300 px-5 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-400 dark:border-neutral-700 dark:text-neutral-200"
          params={{ locale }}
          to="/$locale/search"
        >
          {messages.notFound.search}
        </Link>
      </div>
    </section>
  );
}
