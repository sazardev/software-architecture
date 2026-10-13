import { site } from '@/lib/config/site';
import { getDocsByLocale, getDocsBySection } from '@/lib/content/registry';
import { getSectionText } from '@/lib/content/taxonomy';
import type { Locale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { absoluteUrl } from '@/lib/seo/absolute-url';
import { feedUrl, llmsFullUrl, llmsUrl } from '@/lib/seo/og';

import { parseArticleBlocks, readDocBody } from './article-blocks';
import { blocksToText } from './article-serializers';

/**
Genera llms.txt por idioma (estándar https://llmstxt.org): índice curado para
ChatGPT, Claude, Perplexity y otros crawlers de IA. Todo sale del contenido,
nada que mantener a mano al añadir artículos.
*/
export function buildLlmsTxt(locale: Locale): string {
  const messages = getMessages(locale);
  const docs = getDocsByLocale(locale);
  const groups = getDocsBySection(locale);
  const docsUrl = absoluteUrl('/' + locale + '/docs');
  const feed = feedUrl(locale);
  const home = absoluteUrl('/' + locale);
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${messages.site.description}`,
    '',
    `- [${messages.docs.title}](${docsUrl}): ${messages.docs.indexDescription}`,
    `- [RSS (${locale})](${feed})`,
    '',
  ];

  for (const { docs: sectionDocs, section } of groups) {
    const text = getSectionText(section, locale);
    const suffix = text.description === '' ? '' : ' — ' + text.description;

    lines.push('## ' + text.label + suffix, '');

    for (const doc of sectionDocs) {
      lines.push(`- [${doc.title}](${absoluteUrl(doc.route)}): ${doc.description}`);
    }

    lines.push('');
  }

  lines.push(`_${docs.length} artículos en ${locale}. Generado desde ${home}._`, '');

  return lines.join('\n');
}

/**
Variante extendida: incluye el texto completo de cada artículo (encabezados con ancla,
párrafos, listas, tablas y bloques de código) para que un modelo pueda citar secciones
profundas (/docs/<slug>#<ancla>) y leer el contenido sin ejecutar JavaScript.
*/
export async function buildLlmsFullTxt(locale: Locale): Promise<string> {
  const messages = getMessages(locale);
  const groups = getDocsBySection(locale);
  const lines: string[] = [`# ${site.name} (full)`, '', `> ${messages.site.description}`, ''];

  for (const { docs: sectionDocs, section } of groups) {
    const label = getSectionText(section, locale).label;

    lines.push('## ' + label, '');

    for (const doc of sectionDocs) {
      const url = absoluteUrl(doc.route);
      const blocks = parseArticleBlocks(await readDocBody(locale, doc.slug));

      lines.push(
        `### [${doc.title}](${url})`,
        '',
        doc.description,
        '',
        blocksToText(blocks, { headingOffset: 2, locale, url }),
        '',
      );
    }
  }

  return lines.join('\n');
}

/**
Raíz /llms.txt: apunta a cada idioma y al feed. Los crawlers que solo miran la
raíz descubren así todo el contenido multilingüe.
*/
export function buildLlmsRoot(): string {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${getMessages('es').site.description}`,
    '',
    '## Idiomas / Languages',
    '',
  ];

  for (const locale of ['es', 'en'] as const) {
    const index = llmsUrl(locale);
    const full = llmsFullUrl(locale);
    const feed = feedUrl(locale);

    lines.push(
      `- [${locale}](${index}): ${getMessages(locale).site.description}`,
      `- [${locale} (full)](${full})`,
      `- [${locale} (RSS)](${feed})`,
    );
  }

  lines.push('', `Sitio: ${absoluteUrl('/')}`, `Repositorio: ${site.repo}`, '');

  return lines.join('\n');
}
