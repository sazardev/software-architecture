import { Link } from '@tanstack/react-router';

import { Container, Eyebrow, buttonVariants } from '@/components/atoms';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

import { HeroArtwork } from './HeroArtwork';

export type HomeStats = Readonly<{
  articles: number;
  minutes: number;
  sections: number;
}>;

type HomeHeroProps = Readonly<{
  stats: HomeStats;
}>;

function rise(delay: number) {
  return { animationDelay: `${delay}ms` };
}

export function HomeHero({ stats }: HomeHeroProps) {
  const locale = useLocale();
  const messages = useMessages();
  const { stats: labels } = messages.home;
  const statItems = [
    { label: labels.articles, value: stats.articles },
    { label: labels.sections, value: stats.sections },
    { label: labels.minutes, value: stats.minutes },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent-300/30 blur-3xl dark:bg-accent-700/15"
      />
      <div
        aria-hidden="true"
        className="absolute top-40 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-300/25 blur-3xl dark:bg-brand-700/15"
      />

      <Container className="grid items-center gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-28 lg:pb-24">
        <div>
          <Eyebrow className="animate-rise" style={rise(0)}>
            {messages.home.eyebrow}
          </Eyebrow>
          <h1
            className="mt-6 animate-rise font-display text-[clamp(2.7rem,7.2vw,5.6rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance text-neutral-950 dark:text-neutral-50"
            style={{ ...rise(120), fontVariationSettings: "'opsz' 144" }}
          >
            {messages.home.titleLead}{' '}
            <em className="relative inline-block text-accent-600 italic dark:text-accent-400">
              {messages.home.titleAccent}
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-3 w-full overflow-visible text-accent-500"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 200 12"
              >
                <path
                  className="animate-draw"
                  d="M2 8C40 2 80 2 120 6s56 3 78-2"
                  pathLength={1}
                  stroke="currentColor"
                  strokeDasharray="1"
                  strokeLinecap="round"
                  strokeWidth="3"
                  style={{ animationDelay: '900ms' }}
                />
              </svg>
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl animate-rise font-serif text-xl leading-relaxed text-pretty text-neutral-600 sm:text-[1.35rem] dark:text-neutral-300"
            style={rise(260)}
          >
            {messages.site.description}
          </p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3" style={rise(400)}>
            <Link className={buttonVariants({ size: 'lg' })} params={{ locale }} to="/$locale/docs">
              {messages.home.start}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/button:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              className={buttonVariants({ size: 'lg', variant: 'secondary' })}
              params={{ locale }}
              to="/$locale/search"
            >
              {messages.home.search}
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg animate-fade lg:max-w-none" style={rise(200)}>
          <HeroArtwork label={messages.home.heroAlt} />
        </div>
      </Container>

      <Container>
        <dl
          className="grid animate-rise grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800"
          style={rise(600)}
        >
          {statItems.map((item) => (
            <div className="px-3 py-6 text-center sm:px-8 sm:py-8" key={item.label}>
              <dd className="font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl dark:text-neutral-50">
                {item.value}
              </dd>
              <dt className="mt-1 font-sans text-xs tracking-[0.14em] text-neutral-500 uppercase sm:text-[0.8rem]">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
