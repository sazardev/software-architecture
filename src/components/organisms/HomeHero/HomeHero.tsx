import { Link } from '@tanstack/react-router';

import { BlueprintFrame, Button, Container, Eyebrow, buttonVariants } from '@/components/atoms';
import { TitleBlock } from '@/components/molecules';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { useCommandPalette } from '@/lib/search/palette-context';
import { formatDate } from '@/lib/utils/format-date';

import { HeroArtwork } from './HeroArtwork';

export type HomeStats = Readonly<{
  articles: number;
  /**
  Fecha ISO de la última revisión de contenido.
  */
  updatedAt: string;
}>;

type HomeHeroProps = Readonly<{
  stats: HomeStats;
}>;

function rise(delay: number) {
  return { animationDelay: `${delay}ms` };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function HomeHero({ stats }: HomeHeroProps) {
  const locale = useLocale();
  const messages = useMessages();
  const { open } = useCommandPalette();
  const { blueprint, home } = messages;

  return (
    <section className="bp-grid relative isolate border-b border-neutral-200 dark:border-neutral-800">
      <Container className="grid items-center gap-14 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-28 lg:pb-24">
        <div>
          <Eyebrow className="animate-rise" style={rise(0)}>
            {home.eyebrow}
          </Eyebrow>
          <h1
            className="mt-6 animate-rise font-display text-[clamp(2.7rem,7.2vw,5.6rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance text-neutral-950 dark:text-neutral-50"
            style={{ ...rise(120), fontVariationSettings: "'opsz' 144" }}
          >
            {home.titleLead}{' '}
            <em className="relative inline-block text-accent-600 italic dark:text-accent-400">
              {home.titleAccent}
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
              {home.start}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/button:translate-x-1"
              >
                →
              </span>
            </Link>
            <Button
              onClick={() => {
                open();
              }}
              size="lg"
              variant="secondary"
            >
              {home.search}
            </Button>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-lg animate-fade lg:max-w-none" style={rise(200)}>
          <BlueprintFrame className="bg-neutral-50 p-4 sm:p-6 dark:bg-neutral-950">
            <HeroArtwork label={home.heroAlt} />
            <figcaption className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <span className="font-mono text-[0.68rem] tracking-[0.14em] text-neutral-500 uppercase">
                {blueprint.figure} 01 — {home.heroAlt}
              </span>
              <TitleBlock
                className="min-w-44"
                rows={[
                  { label: blueprint.sheet, value: `01/${pad(stats.articles)}` },
                  { label: blueprint.scale, value: '1:50' },
                  { label: blueprint.rev, value: formatDate(stats.updatedAt, locale) },
                ]}
              />
            </figcaption>
          </BlueprintFrame>
        </figure>
      </Container>
    </section>
  );
}
