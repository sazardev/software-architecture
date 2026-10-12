import { Link } from '@tanstack/react-router';

import { Container, Eyebrow, Reveal } from '@/components/atoms';
import type { SectionWithDocs } from '@/lib/content/registry';
import { getSectionText } from '@/lib/content/taxonomy';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';

type SectionPathsProps = Readonly<{
  groups: SectionWithDocs[];
}>;

export function SectionPaths({ groups }: SectionPathsProps) {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <Container className="pt-20 sm:pt-28">
      <Reveal>
        <Eyebrow>{messages.home.sections.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-4xl leading-[1.08] font-medium tracking-[-0.025em] text-balance text-neutral-950 sm:text-5xl dark:text-neutral-50">
          {messages.home.sections.title}
        </h2>
      </Reveal>
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {groups.map((group, index) => {
          const text = getSectionText(group.section, locale);

          return (
            <li key={group.section.id}>
              <Reveal className="h-full" delay={index * 120}>
                <Link
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1.5 hover:border-neutral-300 hover:shadow-lift dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
                  params={{ locale }}
                  search={{ category: group.section.id }}
                  to="/$locale/docs"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-accent-200/50 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-accent-700/20"
                  />
                  <span
                    aria-hidden="true"
                    className="relative font-display text-6xl leading-none font-light text-accent-500 italic"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="relative mt-6 font-display text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                    {text.label}
                  </h3>
                  <p className="relative mt-2 font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {text.description}
                  </p>
                  <ul className="relative mt-5 space-y-1.5 font-sans text-sm text-neutral-700 dark:text-neutral-300">
                    {group.docs.slice(0, 3).map((doc) => (
                      <li className="flex items-baseline gap-2" key={doc.slug}>
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 shrink-0 -translate-y-0.5 rounded-full bg-accent-500"
                        />
                        <span className="truncate">{doc.title}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="relative mt-auto flex items-center justify-between pt-8 font-sans text-sm font-medium text-brand-700 dark:text-brand-300">
                    {messages.home.sections.explore}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
