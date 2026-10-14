import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Resvg } from '@resvg/resvg-js';

import { getDocBySlug } from '@/lib/content/registry';
import { paperPalette } from '@/lib/figures/figure-palette';
import { figureSlugs, getFigure } from '@/lib/figures/registry';
import { figureToSvg } from '@/lib/figures/to-svg';
import { locales } from '@/lib/i18n/locales';

import { renderOgCard } from '../seo/og-card';
import { docCard } from '../seo/og-inputs';

/**
Vista previa de figuras: `bun tools/figures/preview.ts [--og] [slug…]`.
Escribe PNG en `reports/figures/`, uno por idioma (`<slug>.<locale>.png`), con el texto en la
tipografía del sistema. Con `--og` renderiza además la tarjeta social completa de cada idioma,
tal como saldrá en el postbuild.
*/
const outputDir = join(import.meta.dir, '..', '..', 'reports', 'figures');
const args = process.argv.slice(2);
const isWithOg = args.includes('--og');
const requested = args.filter((arg) => !arg.startsWith('--'));
const slugs = requested.length > 0 ? requested : figureSlugs;

await mkdir(outputDir, { recursive: true });

for (const slug of slugs) {
  for (const locale of locales) {
    const figure = getFigure(slug, locale);

    if (figure === undefined) {
      console.error(`✖ ${slug}: no hay figura registrada`);
      process.exitCode = 1;
      continue;
    }

    const png = new Resvg(figureToSvg(figure), {
      background: paperPalette.paper,
      fitTo: { mode: 'width', value: 1280 },
      font: { loadSystemFonts: true },
    })
      .render()
      .asPng();

    await Bun.write(join(outputDir, `${slug}.${locale}.png`), png);
    console.log(`✔ reports/figures/${slug}.${locale}.png`);

    if (!isWithOg) {
      continue;
    }

    const entry = getDocBySlug(locale, slug);

    if (entry === undefined) {
      continue;
    }

    await Bun.write(
      join(outputDir, `og-${locale}-${slug}.png`),
      await renderOgCard(await docCard(entry)),
    );
    console.log(`✔ reports/figures/og-${locale}-${slug}.png`);
  }
}
