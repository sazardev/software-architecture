import type { PageHead } from '@/lib/seo/meta';
import type { PageSeo } from '@/lib/seo/page-heads';

const PRERENDER_ATTR = 'data-prerender';

// Evita que contenido con "</script>" cierre el bloque JSON-LD (secuencia \u003c en el JSON).
const LESS_THAN_ESCAPED = ['\\', 'u003c'].join('');

function escapeAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeText(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function attrs(entries: [string, string | undefined][]): string {
  return entries
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
    .join(' ');
}

/**
Serializa la cabecera (mismo modelo que usa el router en el cliente) a etiquetas HTML.
*/
export function headToHtml(head: PageHead): string {
  const tags: string[] = [];

  for (const entry of head.meta) {
    if (entry.title === undefined) {
      tags.push(
        `<meta ${attrs([
          ['name', entry.name],
          ['property', entry.property],
          ['content', entry.content],
        ])} ${PRERENDER_ATTR}>`,
      );
    } else {
      tags.push(`<title ${PRERENDER_ATTR}>${escapeText(entry.title)}</title>`);
    }
  }

  for (const link of head.links) {
    tags.push(
      `<link ${attrs([
        ['rel', link.rel],
        ['href', link.href],
        ['hreflang', link.hrefLang],
        ['type', link.type],
        ['title', link.title],
      ])} ${PRERENDER_ATTR}>`,
    );
  }

  return tags.join('\n    ');
}

export function jsonLdToHtml(jsonLd: string[]): string {
  return jsonLd
    .map(
      (json) =>
        `<script type="application/ld+json" ${PRERENDER_ATTR}>${json.split('<').join(LESS_THAN_ESCAPED)}</script>`,
    )
    .join('\n    ');
}

// Genera el HTML de una ruta a partir del index.html del build, con SEO real en el <head>.
export function renderPage(template: string, lang: string, seo: PageSeo, homeUrl: string): string {
  const headHtml = [headToHtml(seo.head), jsonLdToHtml(seo.jsonLd)].filter(Boolean).join('\n    ');
  const noscript = `<noscript>\n      <h1>${escapeText(seo.noscript.title)}</h1>\n      <p>${escapeText(seo.noscript.description)}</p>\n      <p><a href="${escapeAttr(homeUrl)}">${escapeText(seo.noscript.title)}</a></p>\n    </noscript>`;

  return template
    .replace(/<html lang="[^"]*"/, () => `<html lang="${lang}"`)
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', () => `    ${headHtml}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root"></div>\n    ${noscript}`);
}
