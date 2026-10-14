import { site } from '@/lib/config/site';
import { getDocBySlug, getDocsByLocale } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { ContentEntry } from '@/lib/content/types';
import { locales, type Locale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { getRoadmapPaths, getRoadmapText, type RoadmapPath } from '@/lib/roadmap/roadmap-registry';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  collectionJsonLd,
  websiteJsonLd,
} from '@/lib/seo/json-ld';
import { buildPageHead, type PageHead } from '@/lib/seo/meta';
import { ogImageUrl } from '@/lib/seo/og';

/**
SEO de cada página: cabecera + JSON-LD + texto para <noscript>. Lo usan las rutas (cliente)
y el postbuild (HTML estático por ruta), así que ambos publican exactamente lo mismo.
*/
export type PageSeo = {
  head: PageHead;
  jsonLd: string[];
  noscript: { description: string; title: string };
};

export type RouteHead = PageHead & {
  scripts: { children: string; type: 'application/ld+json' }[];
};

export function toRouteHead(seo: PageSeo): RouteHead {
  return {
    ...seo.head,
    scripts: seo.jsonLd.map((children) => ({ children, type: 'application/ld+json' as const })),
  };
}

export function homeSeo(locale: Locale): PageSeo {
  const messages = getMessages(locale);
  const homeTitle = `${site.name} — ${messages.site.tagline}`;

  return {
    head: buildPageHead({
      description: messages.site.description,
      image: { alt: messages.home.heroAlt, url: ogImageUrl(locale) },
      locale,
      path: `/${locale}`,
      title: homeTitle,
    }),
    jsonLd: [websiteJsonLd(locale, messages.site.description)],
    noscript: { description: messages.site.description, title: homeTitle },
  };
}

export function docsIndexSeo(locale: Locale): PageSeo {
  const messages = getMessages(locale);
  const title = `${messages.docs.title} · ${site.name}`;

  return {
    head: buildPageHead({
      description: messages.docs.indexDescription,
      image: { alt: messages.docs.title, url: ogImageUrl(locale) },
      locale,
      path: `/${locale}/docs`,
      title,
    }),
    jsonLd: [
      collectionJsonLd(
        locale,
        messages.docs.title,
        messages.docs.indexDescription,
        getDocsByLocale(locale),
      ),
      breadcrumbJsonLd([
        { name: messages.docs.breadcrumbHome, path: `/${locale}` },
        { name: messages.docs.breadcrumbDocs, path: `/${locale}/docs` },
      ]),
    ],
    noscript: { description: messages.docs.indexDescription, title: messages.docs.title },
  };
}

export function docSeo(entry: ContentEntry): PageSeo {
  const { locale } = entry;
  const messages = getMessages(locale);
  const sectionLabel = getSectionLabel(entry.category, locale);

  return {
    head: buildPageHead({
      alternateLocales: locales.filter((code) => getDocBySlug(code, entry.slug) !== undefined),
      article: {
        modifiedAt: entry.updatedAt,
        publishedAt: entry.publishedAt,
        section: sectionLabel,
        tags: entry.tags,
      },
      description: entry.description,
      image: { alt: entry.figureCaption, url: ogImageUrl(locale, entry.slug) },
      locale,
      path: entry.route,
      title: `${entry.title} · ${site.name}`,
      type: 'article',
    }),
    jsonLd: [
      articleJsonLd(entry, sectionLabel),
      breadcrumbJsonLd([
        { name: messages.docs.breadcrumbHome, path: `/${locale}` },
        { name: messages.docs.breadcrumbDocs, path: `/${locale}/docs` },
        { name: entry.title, path: entry.route },
      ]),
    ],
    noscript: { description: entry.description, title: entry.title },
  };
}

export function roadmapIndexSeo(locale: Locale): PageSeo {
  const messages = getMessages(locale);
  const { roadmap } = messages;
  const title = `${roadmap.title} · ${site.name}`;
  const path = `/${locale}/roadmap`;

  return {
    head: buildPageHead({
      description: roadmap.description,
      image: { alt: roadmap.title, url: ogImageUrl(locale) },
      locale,
      path,
      title,
    }),
    jsonLd: [
      collectionJsonLd(
        locale,
        roadmap.title,
        roadmap.description,
        getRoadmapPaths(locale).flatMap((entry) => entry.steps.map((step) => step.entry)),
        path,
      ),
      breadcrumbJsonLd([
        { name: messages.docs.breadcrumbHome, path: `/${locale}` },
        { name: roadmap.breadcrumb, path },
      ]),
    ],
    noscript: { description: roadmap.description, title: roadmap.title },
  };
}

export function roadmapSeo(locale: Locale, roadmapPath: RoadmapPath): PageSeo {
  const messages = getMessages(locale);
  const text = getRoadmapText(roadmapPath.roadmap, locale);
  const path = `/${locale}/roadmap/${roadmapPath.roadmap.id}`;
  const title = `${text.label} · ${messages.roadmap.title} · ${site.name}`;

  return {
    head: buildPageHead({
      description: text.description,
      image: { alt: text.label, url: ogImageUrl(locale) },
      locale,
      path,
      title,
    }),
    jsonLd: [
      collectionJsonLd(
        locale,
        text.label,
        text.description,
        roadmapPath.steps.map((step) => step.entry),
        path,
      ),
      breadcrumbJsonLd([
        { name: messages.docs.breadcrumbHome, path: `/${locale}` },
        { name: messages.roadmap.breadcrumb, path: `/${locale}/roadmap` },
        { name: text.label, path },
      ]),
    ],
    noscript: { description: text.description, title: text.label },
  };
}
