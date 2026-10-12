import { join } from 'node:path';

import { Glob } from 'bun';

import { extractHeadings, type ContentHeading } from './extract-headings';
import { isLocale, locales } from './locales';
import { parseFrontmatter } from './parse-frontmatter';
import { frontmatterSchema, taxonomySchema } from './schema';

export type ContentEntry = {
  category: string;
  description: string;
  figureCaption: string;
  headings: ContentHeading[];
  locale: string;
  order: number;
  publishedAt: string;
  readingMinutes: number;
  route: string;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
};

export type ContentIndexData = {
  docs: ContentEntry[];
};

const contentDir = join(import.meta.dir, '..', '..', 'src', 'content');
const docsDir = join(contentDir, 'docs');
const taxonomyFile = join(import.meta.dir, '..', '..', 'src', 'lib', 'content', 'taxonomy.json');
const indexPath = join(contentDir, 'index.gen.json');
const wordsPerMinute = 200;

function countWords(markdown: string): number {
  return markdown
    .replaceAll(/```[\s\S]*?```/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function getIndexPath(): string {
  return indexPath;
}

export async function buildContentIndex(): Promise<string> {
  const taxonomy = taxonomySchema.parse(JSON.parse(await Bun.file(taxonomyFile).text()) as unknown);
  const categoryOrder = new Map(
    taxonomy.sections.map((section, index) => [section.id, index] as [string, number]),
  );

  const entries: ContentEntry[] = [];
  const glob = new Glob('*/*.mdx');

  for await (const file of glob.scan(docsDir)) {
    const [localeSegment, filename] = file.split('/', 2);

    if (localeSegment === undefined || filename === undefined) {
      throw new Error(`src/content/docs/${file} → estructura esperada: <locale>/<slug>.mdx`);
    }

    if (!isLocale(localeSegment)) {
      throw new Error(
        `src/content/docs/${file} → locale desconocido "${localeSegment}" (válidos: ${locales.join(', ')})`,
      );
    }

    const source = await Bun.file(join(docsDir, file)).text();
    const { body, frontmatter } = parseFrontmatter(source);
    const result = frontmatterSchema.safeParse(frontmatter);

    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join('.') || '(raíz)'}: ${issue.message}`)
        .join('; ');
      throw new Error(`src/content/docs/${file} → frontmatter inválido: ${details}`);
    }

    const data = result.data;

    if (!categoryOrder.has(data.category)) {
      throw new Error(
        `src/content/docs/${file} → categoría desconocida "${data.category}" (revisa src/lib/content/taxonomy.json)`,
      );
    }

    const words = countWords(body);
    const minutes = Math.ceil(words / wordsPerMinute);
    const slug = filename.replace(/\.mdx$/, '');

    entries.push({
      ...data,
      headings: extractHeadings(body),
      locale: localeSegment,
      readingMinutes: Math.max(1, minutes),
      route: `/${localeSegment}/docs/${slug}`,
      slug,
    });
  }

  entries.sort((a, b) => {
    const byLocale = locales.indexOf(a.locale) - locales.indexOf(b.locale);
    const byCategory = (categoryOrder.get(a.category) ?? 0) - (categoryOrder.get(b.category) ?? 0);
    return byLocale || byCategory || a.order - b.order || a.title.localeCompare(b.title, 'es');
  });

  const data: ContentIndexData = { docs: entries };

  return `${JSON.stringify(data, null, 2)}\n`;
}

if (import.meta.main) {
  const content = await buildContentIndex();
  await Bun.write(indexPath, content);
  const total = (JSON.parse(content) as ContentIndexData).docs.length;
  console.log(`✔ Índice de contenido generado (${total} documentos) → src/content/index.gen.json`);
}
