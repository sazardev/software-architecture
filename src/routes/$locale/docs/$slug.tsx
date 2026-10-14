import { createFileRoute, notFound } from '@tanstack/react-router';
import type { ComponentType } from 'react';

import { Container } from '@/components/atoms';
import {
  DocPager,
  ReadingProgress,
  RoadmapTrail,
  SelectionToolbar,
  ShareActions,
  TableOfContents,
} from '@/components/molecules';
import { ArticleFooter, DocHeader, RelatedDocs } from '@/components/organisms';
import { NotFoundPage } from '@/components/templates';
import { getDocBySlug, getDocNeighbors, getRelatedDocs } from '@/lib/content/registry';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { useMessages } from '@/lib/i18n/use-messages';
import { docSeo, docsIndexSeo, toRouteHead } from '@/lib/seo/page-heads';
import { copyHeadingLink } from '@/lib/ui/heading-link';
import { readingGridClass } from '@/lib/ui/reading-layout';
import { cn } from '@/lib/utils/cn';

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

    return toRouteHead(loaderData === undefined ? docsIndexSeo(locale) : docSeo(loaderData.entry));
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

const ARTICLE_ID = 'articulo';

function DocPage() {
  const { docModule, entry } = Route.useLoaderData();
  const messages = useMessages();
  const { next, previous } = getDocNeighbors(entry.locale, entry.slug);
  const neighborSlugs = [next?.slug, previous?.slug].filter(
    (slug): slug is string => slug !== undefined,
  );
  const DocContent = docModule.default;

  return (
    <>
      <ReadingProgress />
      <SelectionToolbar targetId={ARTICLE_ID} title={entry.title} />
      <DocHeader entry={entry} />
      <Container className={cn(readingGridClass, 'py-12 lg:py-16')}>
        <aside className="hidden lg:block">
          <div className="sticky top-28 flex justify-end">
            <ShareActions layout="rail" title={entry.title} />
          </div>
        </aside>
        <div className="min-w-0">
          <div className="mb-10 lg:hidden">
            <TableOfContents headings={entry.headings} variant="collapsible" />
          </div>
          <article
            className="prose"
            data-copied-label={messages.share.linkCopied}
            id={ARTICLE_ID}
            onClick={copyHeadingLink}
          >
            <DocContent />
          </article>
          <ArticleFooter entry={entry} />
          <RoadmapTrail entry={entry} />
          <DocPager next={next} previous={previous} />
          <RelatedDocs docs={getRelatedDocs(entry, 2, neighborSlugs)} />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <TableOfContents headings={entry.headings} variant="rail" />
          </div>
        </aside>
      </Container>
    </>
  );
}
