import { Link, createFileRoute } from '@tanstack/react-router';

import { buttonVariants } from '@/components/atoms';
import { site } from '@/lib/config/site';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { getMessages } from '@/lib/i18n/messages';
import { useMessages } from '@/lib/i18n/use-messages';
import { buildPageHead } from '@/lib/seo/meta';

export const Route = createFileRoute('/$locale/')({
  component: HomePage,
  head: ({ params }) => {
    const locale = resolveLocaleParam(params.locale);
    const messages = getMessages(locale);

    return buildPageHead({
      description: messages.site.description,
      locale,
      path: `/${locale}`,
      title: site.name,
    });
  },
});

function HomePage() {
  const { locale } = Route.useParams();
  const messages = useMessages();

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-balance">{messages.home.title}</h1>
      <p className="max-w-2xl text-lg text-pretty text-neutral-600 dark:text-neutral-300">
        {messages.site.description}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className={buttonVariants({ size: 'lg' })} params={{ locale }} to="/$locale/docs">
          {messages.home.start}
        </Link>
        <Link
          className={buttonVariants({ size: 'lg', variant: 'secondary' })}
          params={{ locale }}
          to="/$locale/search"
        >
          {messages.home.search}
        </Link>
      </div>
    </section>
  );
}
