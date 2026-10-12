import { createFileRoute, notFound } from '@tanstack/react-router';
import type { ComponentType } from 'react';

import { Container } from '@/components/atoms';
import { DocPager, ReadingProgress, TableOfContents } from '@/components/molecules';
import { DocHeader, RelatedDocs } from '@/components/organisms';
import { NotFoundPage } from '@/components/templates';
import { site } from '@/lib/config/site';
import { getDocBySlug, getDocNeighbors, getRelatedDocs } from '@/lib/content/registry';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { getMessages } from '@/lib/i18n/messages';
import { useMessages } from '@/lib/i18n/use-messages';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildPageHead } from '@/lib/seo/meta';

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
  const { next, previous } = getDocNeighbors(entry.locale, entry.slug);
  const neighborSlugs = [next?.slug, previous?.slug].filter(
    (slug): slug is string => slug !== undefined,
  );
  const DocContent = docModule.default;

  return (
    <>
      <ReadingProgress />
      <DocHeader entry={entry} />
      <Container className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16 lg:py-16">
        <div className="min-w-0">
          <div className="mb-10 lg:hidden">
            <TableOfContents collapsible headings={entry.headings} />
          </div>
          <article className="prose">
            <DocContent />
          </article>
          <DocPager next={next} previous={previous} />
          <RelatedDocs docs={getRelatedDocs(entry, 2, neighborSlugs)} />
        </div>
        <aside className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] [scrollbar-width:thin] self-start overflow-y-auto lg:block">
          <TableOfContents headings={entry.headings} />
        </aside>
      </Container>
    </>
  );
}
