import { join } from 'node:path';

import type { Issue } from '../report';

import { locales } from './locales';
import type { ParsedDoc } from './parsed-doc';
import type { ContentTaxonomy } from './schema';

const projectRoot = join(import.meta.dir, '..', '..');

function collectTaxonomyLabelIssues(taxonomy: ContentTaxonomy): Issue[] {
  const issues: Issue[] = [];
  const taxonomyPath = 'src/lib/content/taxonomy.json';

  for (const section of taxonomy.sections) {
    for (const locale of locales) {
      if (section.labels[locale] === undefined) {
        issues.push({
          code: 'E-TAXONOMY-LABELS',
          file: taxonomyPath,
          level: 'error',
          message: `la sección "${section.id}" no tiene label/description para "${locale}"`,
        });
      }
    }
  }

  return issues;
}

async function collectMessagesIssues(): Promise<Issue[]> {
  const issues: Issue[] = [];

  for (const locale of locales) {
    const relativeFile = `src/lib/i18n/messages/${locale}.ts`;
    const isExists = await Bun.file(join(projectRoot, relativeFile)).exists();

    if (!isExists) {
      issues.push({
        code: 'E-LOCALE-MESSAGES',
        file: relativeFile,
        level: 'error',
        message: `falta el diccionario de mensajes del idioma "${locale}"`,
      });
    }
  }

  return issues;
}

function collectTranslationIssues(parsedDocs: Map<string, ParsedDoc>): Issue[] {
  const localesBySlug = new Map<string, Set<string>>();

  for (const doc of parsedDocs.values()) {
    const present = localesBySlug.get(doc.slug) ?? new Set<string>();
    present.add(doc.locale);
    localesBySlug.set(doc.slug, present);
  }

  const issues: Issue[] = [];

  for (const [slug, present] of localesBySlug) {
    for (const locale of locales) {
      if (!present.has(locale)) {
        issues.push({
          code: 'W-TRANSLATION',
          file: `src/content/docs/${locale}/${slug}.mdx`,
          level: 'warning',
          message: `falta la traducción (existe en: ${[...present].join(', ')})`,
        });
      }
    }
  }

  return issues;
}

export async function collectLocaleIssues(
  taxonomy: ContentTaxonomy,
  parsedDocs: Map<string, ParsedDoc>,
): Promise<Issue[]> {
  const messagesIssues = await collectMessagesIssues();

  return [
    ...collectTaxonomyLabelIssues(taxonomy),
    ...messagesIssues,
    ...collectTranslationIssues(parsedDocs),
  ];
}
