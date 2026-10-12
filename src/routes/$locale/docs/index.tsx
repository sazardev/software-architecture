import { Link, createFileRoute } from '@tanstack/react-router';

import { Badge, Container, Eyebrow, Reveal, SectionGlyph } from '@/components/atoms';
import { CategoryFilter, TopicNav } from '@/components/molecules';
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

/**
Artículos por tema en la vista general; con un tema filtrado se muestran todos.
*/
const PREVIEW_LIMIT = 5;

function DocsIndexPage() {
  const { locale: localeParam } = Route.useParams();
  const locale = resolveLocaleParam(localeParam);
  const messages = useMessages();
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const allGroups = getDocsBySection(locale);
  const groups = getDocsBySection(locale, category);
  const total = groups.reduce((sum, group) => sum + group.docs.length, 0);

  function selectCategory(nextCategory: string | undefined) {
    void navigate({ search: { category: nextCategory } });
  }

  return (
    <div className="bp-grid border-b border-neutral-200 dark:border-neutral-800">
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-x-14 gap-y-10 py-14 sm:py-20 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="animate-rise space-y-5 lg:col-span-2">
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
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <CategoryFilter active={category} className="lg:hidden" onSelect={selectCategory} />
          <TopicNav
            active={category}
            className="hidden lg:block"
            groups={allGroups}
            onSelect={selectCategory}
          />
        </aside>

        <div className="min-w-0">
          {groups.length === 0 ? (
            <p className="border border-dashed border-neutral-400 p-10 text-center font-sans text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
              {messages.docs.empty}
            </p>
          ) : (
            groups.map((group) => {
              const text = getSectionText(group.section, locale);
              const shown =
                category === undefined ? group.docs.slice(0, PREVIEW_LIMIT) : group.docs;

              return (
                <section className="mb-16 last:mb-0" key={group.section.id}>
                  <Reveal className="flex items-start gap-4 border-b border-neutral-400 pb-5 dark:border-neutral-600">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-400 text-neutral-800 dark:border-neutral-600 dark:text-neutral-200">
                      <SectionGlyph icon={group.section.icon} id={group.section.id} />
                    </span>
                    <div>
                      <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                        {text.label}
                      </h2>
                      <p className="mt-1.5 font-serif text-lg text-neutral-600 dark:text-neutral-400">
                        {text.description}
                      </p>
                    </div>
                  </Reveal>
                  <ul className="divide-y divide-neutral-300 dark:divide-neutral-700">
                    {shown.map((doc, index) => (
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
                            <div className="flex items-start gap-4 font-mono text-xs tracking-[0.08em] text-neutral-500 uppercase sm:flex-col sm:items-end sm:gap-1 sm:pt-1.5 dark:text-neutral-400">
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
                  {shown.length < group.docs.length ? (
                    <button
                      className="link-underline mt-2 pb-1 font-sans text-sm font-medium text-brand-700 dark:text-brand-300"
                      onClick={() => {
                        selectCategory(group.section.id);
                      }}
                      type="button"
                    >
                      {messages.docs.viewAllIn(group.docs.length, text.label)} →
                    </button>
                  ) : null}
                </section>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
}
