import { Link } from '@tanstack/react-router';

import { Container, Eyebrow, Reveal } from '@/components/atoms';
import type { TagCount } from '@/lib/content/registry';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { searchParams } from '@/lib/search/search-params';

type TagIndexProps = Readonly<{
  tags: TagCount[];
}>;

/**
Índice de etiquetas generado del contenido: nuevas etiquetas aparecen solas.
*/
export function TagIndex({ tags }: TagIndexProps) {
  const locale = useLocale();
  const messages = useMessages();

  if (tags.length === 0) {
    return null;
  }

  return (
    <Container className="pt-24 sm:pt-32">
      <Reveal>
        <Eyebrow>{messages.home.tags.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-3xl leading-[1.1] font-medium tracking-[-0.02em] text-balance text-neutral-950 sm:text-4xl dark:text-neutral-50">
          {messages.home.tags.title}
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {tags.map(({ count, tag }) => (
            <li key={tag}>
              <Link
                className="group flex items-center border border-neutral-300 font-mono text-sm text-neutral-700 transition-colors duration-300 hover:border-accent-500 hover:text-accent-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-accent-400"
                params={{ locale }}
                search={searchParams({ tag })}
                to="/$locale/search"
              >
                <span className="px-3 py-1.5">#{tag}</span>
                <span className="border-l border-neutral-300 px-2 py-1.5 text-xs text-neutral-500 transition-colors duration-300 group-hover:border-accent-500 dark:border-neutral-700">
                  {count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  );
}
