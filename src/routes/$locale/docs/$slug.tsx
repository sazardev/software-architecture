import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import type { ComponentType } from 'react';

import { Badge } from '@/components/atoms';
import { Breadcrumbs, DocPager, TableOfContents } from '@/components/molecules';
import { NotFoundPage } from '@/components/templates';
import { site } from '@/lib/config/site';
import { getDocBySlug, getDocNeighbors } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { getMessages } from '@/lib/i18n/messages';
import { useMessages } from '@/lib/i18n/use-messages';
import { searchParams } from '@/lib/search/search-params';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildPageHead } from '@/lib/seo/meta';
import { formatDate } from '@/lib/utils/format-date';

type DocModule = {
  default: ComponentType;
};

const docModules = import.meta.glob<DocModule>('/src/content/docs/*/*.mdx');

export const Route = createFileRoute('/$locale/docs/$slug')({
  component: DocPage,
  loader: async ({ params }) => {
    const locale = resolveLocaleParam(params.locale);
    const entry = getDocBySlug(locale, params.slug);

    if (entry === undefined) {
      throw notFound();
    }

    const loadDoc = docModules[`/src/content/docs/${locale}/${entry.slug}.mdx`];

    if (loadDoc === undefined) {
      throw notFound();
    }

    return { docModule: await loadDoc(), entry };
  },
  head: ({ loaderData, params }) => {
    const locale = resolveLocaleParam(params.locale);
    const messages = getMessages(locale);
    const entry = loaderData?.entry;

    return {
      ...buildPageHead({
        description: entry?.description ?? messages.site.description,
        locale,
        path: entry?.route ?? `/${locale}/docs`,
        title: entry === undefined ? site.name : `${entry.title} · ${site.name}`,
        type: 'article',
      }),
      scripts:
        entry === undefined
          ? []
          : [
              { children: articleJsonLd(entry), type: 'application/ld+json' },
              {
                children: breadcrumbJsonLd([
                  { name: messages.docs.breadcrumbHome, path: `/${locale}` },
                  { name: messages.docs.breadcrumbDocs, path: `/${locale}/docs` },
                  { name: entry.title, path: entry.route },
                ]),
                type: 'application/ld+json',
              },
            ],
    };
  },
  notFoundComponent: DocNotFound,
});

function DocNotFound() {
  const messages = useMessages();

  return (
    <NotFoundPage
      description={messages.docs.notFoundDescription}
      title={messages.docs.notFoundTitle}
    />
  );
}

function DocPage() {
  const { docModule, entry } = Route.useLoaderData();
  const messages = useMessages();
  const { next, previous } = getDocNeighbors(entry.locale, entry.slug);
  const sectionLabel = getSectionLabel(entry.category, entry.locale);
  const DocContent = docModule.default;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10">
      <div className="min-w-0">
        <Breadcrumbs
          items={[
            {
              label: messages.docs.breadcrumbHome,
              params: { locale: entry.locale },
              to: '/$locale/',
            },
            {
              label: messages.docs.breadcrumbDocs,
              params: { locale: entry.locale },
              to: '/$locale/docs',
            },
            { label: entry.title },
          ]}
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="brand">{sectionLabel}</Badge>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {messages.docs.readingTime(entry.readingMinutes)} ·{' '}
            {messages.docs.updatedOn(formatDate(entry.updatedAt, entry.locale))}
          </span>
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Link
              key={tag}
              params={{ locale: entry.locale }}
              search={searchParams({ tag })}
              to="/$locale/search"
            >
              <Badge tone="outline">#{tag}</Badge>
            </Link>
          ))}
        </div>
        <div className="mb-8 lg:hidden">
          <TableOfContents collapsible headings={entry.headings} />
        </div>
        <article className="prose prose-neutral dark:prose-invert">
          <DocContent />
        </article>
        <DocPager next={next} previous={previous} />
      </div>
      <aside className="sticky top-20 hidden self-start lg:block">
        <TableOfContents headings={entry.headings} />
      </aside>
    </div>
  );
}
