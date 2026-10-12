import { site } from '@/lib/config/site';
import { getDocsByLocale } from '@/lib/content/registry';
import { getSectionLabel } from '@/lib/content/taxonomy';
import type { Locale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { absoluteUrl } from '@/lib/seo/absolute-url';
import { feedUrl } from '@/lib/seo/og';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

/**
Feed RSS 2.0 por idioma con los artículos más recientes primero.
*/
export function buildFeed(locale: Locale): string {
  const messages = getMessages(locale);
  const docs = getDocsByLocale(locale).toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const lastBuild = docs[0]?.updatedAt ?? new Date().toISOString().slice(0, 10);
  const items = docs
    .map((doc) => {
      const link = escapeXml(absoluteUrl(doc.route));

      return `    <item>
      <title>${escapeXml(doc.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(doc.publishedAt ?? doc.updatedAt)}</pubDate>
      <category>${escapeXml(getSectionLabel(doc.category, locale))}</category>
      <description>${escapeXml(doc.description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${escapeXml(absoluteUrl(`/${locale}`))}</link>
    <description>${escapeXml(messages.site.description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl(locale))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
