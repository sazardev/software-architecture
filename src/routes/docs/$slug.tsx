import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import type { ComponentType } from 'react';

import { Badge } from '@/components/atoms';
import { Breadcrumbs, DocPager, TableOfContents } from '@/components/molecules';
import { NotFoundPage } from '@/components/templates';
import { site } from '@/lib/config/site';
import { getDocBySlug, getDocNeighbors } from '@/lib/content/registry';
import { getSectionById } from '@/lib/content/taxonomy';
import { searchParams } from '@/lib/search/search-params';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildPageHead } from '@/lib/seo/meta';
import { formatDate } from '@/lib/utils/format-date';

type DocModule = {
  default: ComponentType;
};

const docModules = import.meta.glob<DocModule>('/src/content/docs/*.mdx');

export const Route = createFileRoute('/docs/$slug')({
  component: DocPage,
  loader: async ({ params }) => {
    const entry = getDocBySlug(params.slug);

    if (entry === undefined) {
      throw notFound();
    }

    const loadDoc = docModules[`/src/content/docs/${entry.slug}.mdx`];

    if (loadDoc === undefined) {
      throw notFound();
    }

    return { docModule: await loadDoc(), entry };
  },
  head: ({ loaderData }) => {
    const entry = loaderData?.entry;

    return {
      ...buildPageHead({
        description: entry?.description ?? site.description,
        path: entry?.route ?? '/docs',
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
                  { name: 'Inicio', path: '/' },
                  { name: 'Documentación', path: '/docs' },
                  { name: entry.title, path: entry.route },
                ]),
                type: 'application/ld+json',
              },
            ],
    };
  },
  notFoundComponent: () => (
    <NotFoundPage
      description="El documento solicitado no existe en el índice de contenido."
      title="Documento no encontrado"
    />
  ),
});

function DocPage() {
  const { docModule, entry } = Route.useLoaderData();
  const { next, previous } = getDocNeighbors(entry.slug);
  const section = getSectionById(entry.category);
  const DocContent = docModule.default;

  return (
    <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Documentación', to: '/docs' },
            { label: entry.title },
          ]}
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="brand">{section?.label ?? entry.category}</Badge>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {entry.readingMinutes} min de lectura · actualizado el {formatDate(entry.updatedAt)}
          </span>
        </div>
        <div className="mb-2 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <Link key={tag} search={searchParams({ tag })} to="/search">
              <Badge tone="outline">#{tag}</Badge>
            </Link>
          ))}
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
