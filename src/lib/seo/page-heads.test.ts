import { describe, expect, it } from 'vitest';

import { getDocsByLocale } from '@/lib/content/registry';
import { docSeo, docsIndexSeo, homeSeo, searchSeo, toRouteHead } from '@/lib/seo/page-heads';

function metaContent(seo: ReturnType<typeof homeSeo>, key: string): string | undefined {
  return seo.head.meta.find((entry) => entry.property === key || entry.name === key)?.content;
}

describe('SEO por página', () => {
  it('la portada combina nombre y eslogan en el título e incluye imagen social', () => {
    const seo = homeSeo('es');
    const title = seo.head.meta.find((entry) => entry.title !== undefined)?.title;

    expect(title).toContain('Software Architecture —');
    expect(metaContent(seo, 'twitter:card')).toBe('summary_large_image');
    expect(metaContent(seo, 'og:image')).toMatch(/\/og\/es\/home\.png$/);
    expect(JSON.parse(seo.jsonLd[0] ?? '{}')).toMatchObject({ '@type': 'WebSite' });
  });

  it('los artículos publican canonical, fechas, etiquetas y JSON-LD válido', () => {
    const [entry] = getDocsByLocale('es');

    expect(entry).toBeDefined();

    if (entry === undefined) {
      return;
    }

    const seo = docSeo(entry);

    expect(seo.head.links.find((link) => link.rel === 'canonical')?.href).toContain(entry.route);
    expect(metaContent(seo, 'og:type')).toBe('article');
    expect(metaContent(seo, 'article:modified_time')).toBe(entry.updatedAt);
    expect(seo.head.meta.filter((meta) => meta.property === 'article:tag')).toHaveLength(
      entry.tags.length,
    );
    expect(metaContent(seo, 'og:image')).toContain(`/og/es/${entry.slug}.png`);

    const [article, breadcrumbs] = seo.jsonLd.map(
      (json) => JSON.parse(json) as { '@type': string },
    );

    expect(article?.['@type']).toBe('TechArticle');
    expect(breadcrumbs?.['@type']).toBe('BreadcrumbList');
  });

  it('solo anuncia hreflang de los idiomas donde existe el documento', () => {
    const [entry] = getDocsByLocale('es');

    if (entry === undefined) {
      return;
    }

    const langs = docSeo(entry)
      .head.links.filter((link) => link.hrefLang !== undefined)
      .map((link) => link.hrefLang);

    expect(langs).toContain('x-default');
    expect(langs).toContain('es');
  });

  it('el índice de documentación publica una colección y la búsqueda es noindex', () => {
    const index = docsIndexSeo('en');
    const search = searchSeo('en');

    expect(JSON.parse(index.jsonLd[0] ?? '{}')).toMatchObject({ '@type': 'CollectionPage' });
    expect(metaContent(search, 'robots')).toBe('noindex, nofollow');
    expect(metaContent(index, 'robots')).toContain('index, follow');
  });

  it('toRouteHead convierte el JSON-LD en scripts del router', () => {
    const head = toRouteHead(homeSeo('en'));

    expect(head.scripts[0]?.type).toBe('application/ld+json');
    expect(head.meta.length).toBeGreaterThan(5);
  });
});
