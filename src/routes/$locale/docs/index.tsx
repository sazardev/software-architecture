import { Link, createFileRoute } from '@tanstack/react-router';

import { Badge, Container, Eyebrow, Reveal } from '@/components/atoms';
import { CategoryFilter } from '@/components/molecules';
import { site } from '@/lib/config/site';
import { parseDocsSearchParams } from '@/lib/content/docs-search-params';
import { getDocsBySection } from '@/lib/content/registry';
import { getSectionText } from '@/lib/content/taxonomy';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { getMessages } from '@/lib/i18n/messages';
import { useMessages } from '@/lib/i18n/use-messages';
import { buildPageHead } from '@/lib/seo/meta';
import { formatDate } from '@/lib/utils/format-date';

export const Route = createFileRoute('/$locale/docs/')({
  component: DocsIndexPage,
  head: ({ params }) => {
    const locale = resolveLocaleParam(params.locale);
    const messages = getMessages(locale);

    return buildPageHead({
      description: messages.docs.indexDescription,
      locale,
      path: `/${locale}/docs`,
      title: `${messages.docs.title} · ${site.name}`,
    });
  },
  validateSearch: parseDocsSearchParams,
});

function DocsIndexPage() {
  const { locale: localeParam } = Route.useParams();
  const locale = resolveLocaleParam(localeParam);
  const messages = useMessages();
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const groups = getDocsBySection(locale, category);
  const total = groups.reduce((sum, group) => sum + group.docs.length, 0);

  return (
    <Container className="py-14 sm:py-20" size="reading">
      <div className="animate-rise space-y-5">
        <Eyebrow>{messages.nav.docs}</Eyebrow>
        <h1
          className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.03em] text-neutral-950 dark:text-neutral-50"
          style={{ fontVariationSettings: "'opsz' 144" }}
        >
          {messages.docs.title}
        </h1>
        <p className="max-w-xl font-serif text-xl leading-relaxed text-neutral-600 dark:text-neutral-300">
          {messages.docs.summary(total, groups.length)}
        </p>
        <CategoryFilter
          active={category}
          className="pt-3"
          onSelect={(nextCategory) => {
            void navigate({ search: { category: nextCategory } });
          }}
        />
      </div>

      {groups.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-neutral-300 p-10 text-center font-sans text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          {messages.docs.empty}
        </p>
      ) : (
        groups.map((group) => {
          const text = getSectionText(group.section, locale);

          return (
            <section className="mt-16" key={group.section.id}>
              <Reveal className="border-b border-neutral-300 pb-5 dark:border-neutral-700">
                <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                  {text.label}
                </h2>
                <p className="mt-1.5 font-serif text-lg text-neutral-600 dark:text-neutral-400">
                  {text.description}
                </p>
              </Reveal>
              <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {group.docs.map((doc, index) => (
                  <li key={doc.slug}>
                    <Reveal delay={index * 70}>
                      <Link
                        className="group grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[1fr_auto]"
                        params={{ locale, slug: doc.slug }}
                        to="/$locale/docs/$slug"
                      >
                        <div className="min-w-0">
                          <h3 className="font-display text-2xl leading-snug font-medium tracking-tight text-neutral-950 transition-colors group-hover:text-brand-700 dark:text-neutral-50 dark:group-hover:text-brand-300">
                            {doc.title}
                          </h3>
                          <p className="mt-2 max-w-2xl font-serif text-[1.05rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {doc.description}
                          </p>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {doc.tags.map((tag) => (
                              <li key={tag}>
                                <Badge tone="neutral">#{tag}</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-start gap-4 font-sans text-sm text-neutral-500 sm:flex-col sm:items-end sm:gap-1 sm:pt-1.5 dark:text-neutral-400">
                          <span>{messages.docs.readingTime(doc.readingMinutes)}</span>
                          <span>{formatDate(doc.updatedAt, locale)}</span>
                          <span
                            aria-hidden="true"
                            className="hidden text-lg text-accent-600 transition-transform duration-300 group-hover:translate-x-1.5 sm:mt-3 sm:block"
                          >
                            →
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </Container>
  );
}
