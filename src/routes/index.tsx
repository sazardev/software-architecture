import { Link, createFileRoute } from '@tanstack/react-router';

import { buttonVariants } from '@/components/atoms';
import { site } from '@/lib/config/site';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-balance">
        Arquitectura de software, en serio
      </h1>
      <p className="max-w-2xl text-lg text-pretty text-neutral-600 dark:text-neutral-300">
        {site.description}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          className={buttonVariants({ size: 'lg' })}
          params={{ slug: 'getting-started' }}
          to="/docs/$slug"
        >
          Empezar
        </Link>
        <Link className={buttonVariants({ size: 'lg', variant: 'secondary' })} to="/search">
          Buscar recursos
        </Link>
      </div>
    </section>
  );
}
