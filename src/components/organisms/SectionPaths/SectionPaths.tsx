import { Link } from '@tanstack/react-router';

import {
  BlueprintFrame,
  Container,
  Eyebrow,
  Reveal,
  SectionGlyph,
  buttonVariants,
} from '@/components/atoms';
import type { SectionWithDocs } from '@/lib/content/registry';
import { getSectionText } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

/**
Temas visibles en la portada (los de más artículos); el resto se explora desde /docs.
*/
const HOME_TOPIC_LIMIT = 3;

type SectionPathsProps = Readonly<{
  groups: SectionWithDocs[];
}>;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function SectionPaths({ groups }: SectionPathsProps) {
  const locale = useLocale();
  const messages = useMessages();
  const visible = groups
    .toSorted((a, b) => b.docs.length - a.docs.length)
    .slice(0, HOME_TOPIC_LIMIT);

  return (
    <Container className="pt-20 sm:pt-28">
      <Reveal>
        <Eyebrow>
          {messages.home.sections.eyebrow} · {pad(groups.length)}
        </Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] font-medium tracking-[-0.025em] text-balance text-neutral-950 sm:text-5xl dark:text-neutral-50">
          {messages.home.sections.title}
        </h2>
      </Reveal>
      <ul className="mt-12 grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-7">
        {visible.map((group, index) => {
          const text = getSectionText(group.section, locale);

          return (
            <li key={group.section.id}>
              <Reveal className="h-full" delay={index * 90}>
                <BlueprintFrame className="group h-full bg-neutral-50 transition-colors duration-300 hover:border-neutral-900 dark:bg-neutral-950 dark:hover:border-neutral-300">
                  <Link
                    className="flex h-full flex-col p-6"
                    params={{ locale }}
                    search={{ category: group.section.id }}
                    to="/$locale/docs"
                  >
                    <span className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center border border-neutral-300 text-neutral-800 transition-colors duration-300 group-hover:border-accent-500 group-hover:text-accent-700 dark:border-neutral-700 dark:text-neutral-200 dark:group-hover:text-accent-400">
                        <SectionGlyph
                          className="h-6 w-6"
                          icon={group.section.icon}
                          id={group.section.id}
                        />
                      </span>
                      <span className="font-mono text-xs tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
                        T-{pad(index + 1)}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="my-5 flex items-center text-neutral-300 dark:text-neutral-700"
                    >
                      <span className="h-2 border-l border-current" />
                      <span className="h-px flex-1 bg-current" />
                      <span className="h-2 border-l border-current" />
                    </span>
                    <h3 className="font-display text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                      {text.label}
                    </h3>
                    <p className="mt-2 line-clamp-3 font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {text.description}
                    </p>
                    <ul className="mt-5 space-y-1.5 font-sans text-sm text-neutral-700 dark:text-neutral-300">
                      {group.docs.slice(0, 3).map((doc, docIndex) => (
                        <li className="flex items-baseline gap-3" key={doc.slug}>
                          <span
                            aria-hidden="true"
                            className="font-mono text-[0.68rem] text-accent-600 dark:text-accent-400"
                          >
                            {pad(docIndex + 1)}
                          </span>
                          <span className="truncate">{doc.title}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto flex items-center justify-between pt-8 font-mono text-xs tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">
                      {messages.docs.articleCount(group.docs.length)}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </BlueprintFrame>
              </Reveal>
            </li>
          );
        })}
      </ul>
      {groups.length > HOME_TOPIC_LIMIT ? (
        <Reveal className="mt-10 flex justify-center">
          <Link
            className={buttonVariants({ size: 'lg', variant: 'secondary' })}
            params={{ locale }}
            to="/$locale/docs"
          >
            {messages.home.sections.all(groups.length)}
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      ) : null}
    </Container>
  );
}
