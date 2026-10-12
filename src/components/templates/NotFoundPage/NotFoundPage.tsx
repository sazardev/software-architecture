import { Link } from '@tanstack/react-router';

import { Button, buttonVariants } from '@/components/atoms';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { useCommandPalette } from '@/lib/search/palette-context';
import { cn } from '@/lib/utils/cn';

type NotFoundPageProps = Readonly<{
  className?: string;
  description?: string;
  title?: string;
}>;

export function NotFoundPage({ className, description, title }: NotFoundPageProps) {
  const locale = useLocale();
  const messages = useMessages();
  const { open } = useCommandPalette();

  return (
    <section className={cn('bp-grid relative isolate px-5 py-20 sm:py-32', className)}>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
        <p
          aria-hidden="true"
          className="animate-rise font-display text-[8rem] leading-none font-light text-accent-500 italic sm:text-[11rem]"
        >
          {messages.notFound.code}
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
          {title ?? messages.notFound.title}
        </h1>
        <p className="font-serif text-lg text-neutral-600 dark:text-neutral-300">
          {description ?? messages.notFound.description}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <Link className={buttonVariants({ size: 'lg' })} params={{ locale }} to="/$locale">
            {messages.notFound.home}
          </Link>
          <Button
            onClick={() => {
              open();
            }}
            size="lg"
            variant="secondary"
          >
            {messages.notFound.search}
          </Button>
        </div>
      </div>
    </section>
  );
}
