import { join } from 'node:path';

import { Glob } from 'bun';

import type { Issue } from '../report';

import type { ParsedDoc } from './parsed-doc';

const projectRoot = join(import.meta.dir, '..', '..');
const designsDir = join(projectRoot, 'src', 'lib', 'figures', 'designs');
const registryFile = join(projectRoot, 'src', 'lib', 'figures', 'registry.ts');

const caption = { max: 90, min: 12 };

/**
Cada artículo debe traer su propia figura (FIG. NN): un diseño `designs/<slug>.ts` registrado
en `registry.ts` y un `figureCaption` en cada idioma. La figura alimenta la cabecera del
artículo y la tarjeta social, así que no es opcional.
*/
export async function collectFigureIssues(docs: Map<string, ParsedDoc>): Promise<Issue[]> {
  const issues: Issue[] = [];
  const registry = await Bun.file(registryFile).text();
  const slugs = new Set<string>();

  for (const doc of docs.values()) {
    slugs.add(doc.slug);

    const length = doc.figureCaption.trim().length;

    if (length < caption.min || length > caption.max) {
      issues.push({
        code: 'E-FIGURE-CAPTION',
        file: doc.relativeFile,
        level: 'error',
        message: `figureCaption debe tener entre ${caption.min} y ${caption.max} caracteres (actual: ${length})`,
      });
    }
  }

  for (const slug of slugs) {
    const design = `src/lib/figures/designs/${slug}.ts`;

    if (!(await Bun.file(join(projectRoot, design)).exists())) {
      issues.push({
        code: 'E-FIGURE-MISSING',
        file: design,
        level: 'error',
        message: `el artículo "${slug}" no tiene figura — crea este diseño y regístralo en src/lib/figures/registry.ts`,
      });
    } else if (!registry.includes(`['${slug}',`)) {
      issues.push({
        code: 'E-FIGURE-REGISTRY',
        file: 'src/lib/figures/registry.ts',
        level: 'error',
        message: `la figura de "${slug}" existe pero no está registrada en el registro`,
      });
    }
  }

  const designFiles = new Glob('*.ts').scan(designsDir);

  for await (const file of designFiles) {
    const slug = file.replace(/\.ts$/, '');

    if (!slugs.has(slug)) {
      issues.push({
        code: 'W-FIGURE-ORPHAN',
        file: `src/lib/figures/designs/${file}`,
        level: 'warning',
        message: 'figura sin artículo asociado: bórrala o crea el artículo con ese slug',
      });
    }
  }

  return issues;
}
