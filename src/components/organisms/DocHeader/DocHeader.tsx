import { Container } from '@/components/atoms';
import { ArticleFigure } from '@/components/molecules';
import { getDocSheet } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { getFigure } from '@/lib/figures/registry';

type DocHeaderProps = Readonly<{
  entry: ContentEntry;
}>;

export function DocHeader({ entry }: DocHeaderProps) {
  const sheet = getDocSheet(entry.locale, entry.slug);
  const sectionLabel = getSectionLabel(entry.category, entry.locale);
  const figure = getFigure(entry.slug);

  return (
    <header className="bp-grid border-b border-neutral-200 dark:border-neutral-800">
      <Container className="grid items-center gap-x-12 gap-y-9 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="animate-rise font-mono text-xs font-medium tracking-[0.18em] text-accent-700 uppercase dark:text-accent-400">
            {sectionLabel}
          </p>
          <h1
            className="mt-4 animate-rise font-display text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance text-neutral-950 dark:text-neutral-50"
            style={{ animationDelay: '100ms', fontVariationSettings: "'opsz' 144" }}
          >
            {entry.title}
          </h1>
          <p
            className="mt-6 animate-rise font-serif text-xl leading-relaxed text-pretty text-neutral-600 sm:text-[1.3rem] dark:text-neutral-300"
            style={{ animationDelay: '220ms' }}
          >
            {entry.description}
          </p>
        </div>
        {figure === undefined ? null : (
          <ArticleFigure
            caption={entry.figureCaption}
            className="mx-auto w-full max-w-xl lg:max-w-none"
            figure={figure}
            number={sheet.index}
          />
        )}
      </Container>
    </header>
  );
}
