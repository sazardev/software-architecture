import { join } from 'node:path';

import { Glob } from 'bun';

import type { Issue } from '../report';

import { collectFigureIssues } from './audit-figures';
import { collectLinkIssues } from './audit-links';
import { collectLocaleIssues } from './audit-locales';
import { buildContentIndex, getIndexPath } from './content-index';
import { extractHeadings, type ContentHeading } from './extract-headings';
import { isLocale, locales } from './locales';
import { parseFrontmatter } from './parse-frontmatter';
import type { ParsedDoc } from './parsed-doc';
import { frontmatterSchema, taxonomySchema, type ContentTaxonomy } from './schema';

export type ContentAuditResult = {
  docCount: number;
  issues: Issue[];
};

const docsDir = join(import.meta.dir, '..', '..', 'src', 'content', 'docs');
const taxonomyFile = join(import.meta.dir, '..', '..', 'src', 'lib', 'content', 'taxonomy.json');

const limits = {
  description: { max: 160, min: 40 },
  title: { max: 60, min: 3 },
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function collectTaxonomyIssues(taxonomy: ContentTaxonomy): Issue[] {
  const issues: Issue[] = [];
  const ids = taxonomy.sections.map((section) => section.id);
  const orders = taxonomy.sections.map((section) => section.order);
  const taxonomyPath = 'src/lib/content/taxonomy.json';

  if (new Set(ids).size !== ids.length) {
    issues.push({
      code: 'E-TAXONOMY-ID',
      file: taxonomyPath,
      level: 'error',
      message: 'los ids de sección deben ser únicos',
    });
  }

  if (new Set(orders).size !== orders.length) {
    issues.push({
      code: 'E-TAXONOMY-ORDER',
      file: taxonomyPath,
      level: 'error',
      message: 'el orden de las secciones debe ser único',
    });
  }

  return issues;
}

function collectHeadingIssues(
  body: string,
  relativeFile: string,
): { headings: ContentHeading[]; issues: Issue[] } {
  const issues: Issue[] = [];
  const headings = extractHeadings(body);
  const headingIds = headings.map((heading) => heading.id);

  if (headings.every((heading) => heading.level !== 2)) {
    issues.push({
      code: 'E-HEADINGS',
      file: relativeFile,
      level: 'error',
      message: 'el documento debe incluir al menos un encabezado de nivel 2',
    });
  }

  if (new Set(headingIds).size !== headingIds.length) {
    issues.push({
      code: 'E-HEADINGS-UNIQUE',
      file: relativeFile,
      level: 'error',
      message: 'los anclajes de los encabezados deben ser únicos',
    });
  }

  const hasLevelJump = headings.some((heading, index) => {
    const previous = headings[index - 1];
    return previous !== undefined && heading.level > previous.level + 1;
  });

  if (hasLevelJump) {
    issues.push({
      code: 'E-HEADINGS-LEVEL',
      file: relativeFile,
      level: 'error',
      message: 'no se pueden saltar niveles de encabezado (por ejemplo h2 → h4)',
    });
  }

  if ((body.match(/^```/gm) ?? []).length % 2 !== 0) {
    issues.push({
      code: 'W-FENCE',
      file: relativeFile,
      level: 'warning',
      message: 'posible bloque de código sin cerrar',
    });
  }

  return { headings, issues };
}

function collectFieldIssues(
  data: { category: string; description: string; title: string; updatedAt: string },
  slug: string,
  relativeFile: string,
  categoryIds: Set<string>,
): Issue[] {
  const issues: Issue[] = [];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    issues.push({
      code: 'E-SLUG',
      file: relativeFile,
      level: 'error',
      message: 'el nombre del archivo debe ser un slug kebab-case',
    });
  }

  if (!categoryIds.has(data.category)) {
    issues.push({
      code: 'E-CATEGORY',
      file: relativeFile,
      level: 'error',
      message: `categoría desconocida "${data.category}" (válidas: ${[...categoryIds].join(', ')})`,
    });
  }

  if (data.title.length < limits.title.min || data.title.length > limits.title.max) {
    issues.push({
      code: 'E-TITLE',
      file: relativeFile,
      level: 'error',
      message: `el título debe tener entre ${limits.title.min} y ${limits.title.max} caracteres`,
    });
  }

  if (
    data.description.length < limits.description.min ||
    data.description.length > limits.description.max
  ) {
    issues.push({
      code: 'E-DESCRIPTION',
      file: relativeFile,
      level: 'error',
      message: `la descripción debe tener entre ${limits.description.min} y ${limits.description.max} caracteres (actual: ${data.description.length})`,
    });
  }

  if (data.updatedAt > todayIso()) {
    issues.push({
      code: 'E-UPDATED-AT',
      file: relativeFile,
      level: 'error',
      message: 'updatedAt no puede estar en el futuro',
    });
  }

  return issues;
}

function parseDocument(
  relativeFile: string,
  source: string,
  categoryIds: Set<string>,
): { doc: ParsedDoc | undefined; issues: Issue[] } {
  const issues: Issue[] = [];
  const filename = relativeFile.split('/').at(-1) ?? '';
  const locale = relativeFile.split('/').at(-2) ?? '';
  const slug = filename.replace(/\.mdx$/, '');
  const { body, frontmatter } = parseFrontmatter(source);

  if (!isLocale(locale)) {
    issues.push({
      code: 'E-LOCALE',
      file: relativeFile,
      level: 'error',
      message: `locale desconocido "${locale}" (válidos: ${locales.join(', ')})`,
    });
    return { doc: undefined, issues };
  }

  const parsed = frontmatterSchema.safeParse(frontmatter);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`)
      .join('; ');
    issues.push({
      code: 'E-FRONTMATTER',
      file: relativeFile,
      level: 'error',
      message: `frontmatter inválido → ${details}`,
    });
    return { doc: undefined, issues };
  }

  issues.push(...collectFieldIssues(parsed.data, slug, relativeFile, categoryIds));

  const headingCheck = collectHeadingIssues(body, relativeFile);

  return {
    doc: {
      body,
      figureCaption: parsed.data.figureCaption,
      headings: headingCheck.headings,
      locale,
      relativeFile,
      slug,
    },
    issues: [...issues, ...headingCheck.issues],
  };
}

async function readCurrentIndex(): Promise<string> {
  try {
    return await Bun.file(getIndexPath()).text();
  } catch {
    return '';
  }
}

async function collectIndexIssues(): Promise<Issue[]> {
  const currentIndex = await readCurrentIndex();
  const expectedIndex = await buildContentIndex();

  if (currentIndex !== expectedIndex) {
    return [
      {
        code: 'E-INDEX',
        file: 'src/content/index.gen.json',
        level: 'error',
        message: 'índice desactualizado — ejecuta: bun run content:index',
      },
    ];
  }

  return [];
}

export async function auditContent(): Promise<ContentAuditResult> {
  const taxonomy = taxonomySchema.parse(JSON.parse(await Bun.file(taxonomyFile).text()) as unknown);
  const categoryIds = new Set(taxonomy.sections.map((section) => section.id));
  const issues: Issue[] = [...collectTaxonomyIssues(taxonomy)];
  const parsedDocs = new Map<string, ParsedDoc>();

  const glob = new Glob('*/*.mdx');

  for await (const file of glob.scan(docsDir)) {
    const relativeFile = `src/content/docs/${file}`;
    let source: string;

    try {
      source = await Bun.file(join(docsDir, file)).text();
    } catch {
      issues.push({
        code: 'E-READ',
        file: relativeFile,
        level: 'error',
        message: 'no se pudo leer el archivo',
      });
      continue;
    }

    const parsed = parseDocument(relativeFile, source, categoryIds);

    if (parsed.doc !== undefined) {
      parsedDocs.set(`${parsed.doc.locale}/${parsed.doc.slug}`, parsed.doc);
    }

    issues.push(...parsed.issues);
  }

  const linkIssues = collectLinkIssues(parsedDocs);
  const figureIssues = await collectFigureIssues(parsedDocs);
  const localeIssues = await collectLocaleIssues(taxonomy, parsedDocs);
  const indexIssues = await collectIndexIssues();
  issues.push(...linkIssues, ...figureIssues, ...localeIssues, ...indexIssues);

  return { docCount: parsedDocs.size, issues };
}

if (import.meta.main) {
  const { docCount, issues } = await auditContent();
  const { renderIssues, summarizeIssues } = await import('../report');

  if (issues.length > 0) {
    console.log(renderIssues(issues));
  }

  const { errors, warnings } = summarizeIssues(issues);
  console.log(
    `\nContenido: ${docCount} documentos · ${errors} error(es) · ${warnings} advertencia(s)`,
  );

  if (errors > 0) {
    process.exit(1);
  }
}
