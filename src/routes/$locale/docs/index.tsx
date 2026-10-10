import { Link, createFileRoute } from '@tanstack/react-router';

import { Badge } from '@/components/atoms';
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
    <section className="mx-auto max-w-3xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">{messages.docs.title}</h1>
        <p className="text-neutral-600 dark:text-neutral-300">
          {messages.docs.summary(total, groups.length)}
        </p>
        <CategoryFilter
          active={category}
          onSelect={(nextCategory) => {
            void navigate({ search: { category: nextCategory } });
          }}
        />
      </div>

      {groups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          {messages.docs.empty}
        </p>
      ) : (
        groups.map((group) => (
          <div className="mb-10" key={group.section.id}>
            <h2 className="text-lg font-semibold">{getSectionText(group.section, locale).label}</h2>
            <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
              {getSectionText(group.section, locale).description}
            </p>
            <ul className="grid gap-3">
              {group.docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-brand-400 dark:border-neutral-800 dark:hover:border-brand-600"
                    params={{ locale, slug: doc.slug }}
                    to="/$locale/docs/$slug"
                  >
                    <p className="font-medium">{doc.title}</p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {doc.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>
                        {messages.docs.readingTime(doc.readingMinutes)} ·{' '}
                        {formatDate(doc.updatedAt, locale)}
                      </span>
                      {doc.tags.map((tag) => (
                        <Badge key={tag} tone="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
