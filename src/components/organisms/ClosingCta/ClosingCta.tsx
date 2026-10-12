import { Link } from '@tanstack/react-router';

import { Container, Reveal, buttonVariants } from '@/components/atoms';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

export function ClosingCta() {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <Container className="py-24 sm:py-32" size="narrow">
      <Reveal className="text-center">
        <h2 className="font-display text-4xl leading-[1.08] font-medium tracking-[-0.03em] text-balance text-neutral-950 sm:text-6xl dark:text-neutral-50">
          {messages.home.cta.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-neutral-600 dark:text-neutral-300">
          {messages.home.cta.body}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link className={buttonVariants({ size: 'lg' })} params={{ locale }} to="/$locale/docs">
            {messages.home.start}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            className={buttonVariants({ size: 'lg', variant: 'secondary' })}
            params={{ locale }}
            to="/$locale/search"
          >
            {messages.home.search}
          </Link>
        </div>
      </Reveal>
    </Container>
  );
}
