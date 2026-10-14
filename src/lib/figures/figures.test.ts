import { describe, expect, it } from 'vitest';

import { docs } from '@/lib/content/registry';

import { arrow, circle, line } from './figure-kit';
import { FIGURE_HEIGHT, FIGURE_WIDTH, type Figure, type Prim } from './figure-types';
import { figureSlugs, getFigure, hasFigure } from './registry';
import { getThumbnail } from './thumbnail';
import { figureToSvg } from './to-svg';

const MARGIN = 8;

function flatten(items: readonly Prim[]): Prim[] {
  return items.flatMap((item) => (item.kind === 'group' ? flatten(item.items) : [item]));
}

function isOutOfCanvas(prim: Prim): boolean {
  switch (prim.kind) {
    case 'circle': {
      return (
        prim.cx - prim.r < -MARGIN ||
        prim.cx + prim.r > FIGURE_WIDTH + MARGIN ||
        prim.cy - prim.r < -MARGIN ||
        prim.cy + prim.r > FIGURE_HEIGHT + MARGIN
      );
    }
    case 'rect': {
      return (
        prim.x < -MARGIN ||
        prim.y < -MARGIN ||
        prim.x + prim.w > FIGURE_WIDTH + MARGIN ||
        prim.y + prim.h > FIGURE_HEIGHT + MARGIN
      );
    }
    case 'text': {
      return prim.x < 0 || prim.x > FIGURE_WIDTH || prim.y < 0 || prim.y > FIGURE_HEIGHT;
    }
    default: {
      return false;
    }
  }
}

describe('figuras de los artículos', () => {
  it('cada artículo (en todos los idiomas) tiene su figura y su pie', () => {
    for (const doc of docs) {
      expect(hasFigure(doc.slug), `${doc.locale}/${doc.slug} sin figura`).toBe(true);
      expect(doc.figureCaption.length, `${doc.locale}/${doc.slug} pie`).toBeGreaterThanOrEqual(12);
      expect(doc.figureCaption.length, `${doc.locale}/${doc.slug} pie`).toBeLessThanOrEqual(90);
    }
  });

  it('no hay figuras huérfanas: cada diseño pertenece a un artículo', () => {
    const slugs = new Set(docs.map((doc) => doc.slug));

    expect(figureSlugs.filter((slug) => !slugs.has(slug))).toEqual([]);
  });

  it('cada artículo tiene una figura propia, distinta de las demás', () => {
    const seen = new Map<string, string>();

    for (const slug of figureSlugs) {
      const key = JSON.stringify(getFigure(slug));

      expect(seen.get(key), `${slug} repite el dibujo de ${seen.get(key)}`).toBeUndefined();
      seen.set(key, slug);
    }
  });

  it.each(figureSlugs)('%s: geometría válida y dentro del lienzo', (slug) => {
    const figure: Figure = getFigure(slug) ?? [];
    const prims = flatten(figure);
    const svg = figureToSvg(figure);

    expect(prims.length).toBeGreaterThan(8);
    expect(prims.filter((prim) => isOutOfCanvas(prim))).toEqual([]);
    expect(prims.some((prim) => prim.kind === 'text')).toBe(true);
    expect(svg).not.toMatch(/NaN|undefined|Infinity/);
    expect(svg).toMatch(/^<svg [^>]*viewBox="0 0 640 400"/);
  });
});

describe('renderizado SVG', () => {
  it('omite las etiquetas de texto cuando se pide', () => {
    const figure = getFigure(figureSlugs[0] ?? '') ?? [];

    expect(figureToSvg(figure)).toContain('<text');
    expect(figureToSvg(figure, { text: false })).not.toContain('<text');
  });

  it('superpone el fragmento recibido al final del lienzo', () => {
    const svg = figureToSvg([circle(10, 10, 4)], { overlay: '<g id="overlay"/>' });

    expect(svg.endsWith('<g id="overlay"/></svg>')).toBe(true);
  });

  it('escapa el texto y traduce los tonos a la paleta de papel', () => {
    const svg = figureToSvg([
      line(0, 0, 10, 10, { stroke: 'accent' }),
      { kind: 'text', text: 'A & <B>', x: 1, y: 2 },
    ]);

    expect(svg).toContain('stroke="#e2723a"');
    expect(svg).toContain('A &amp; &lt;B&gt;');
  });
});

describe('kit de dibujo', () => {
  it('la flecha acorta la línea y añade la cabeza; con flujo suma el trazo animado', () => {
    const plain = arrow([
      [0, 0],
      [100, 0],
    ]);
    const flowing = arrow(
      [
        [0, 0],
        [100, 0],
      ],
      { flow: true },
    );

    expect(plain.items).toHaveLength(2);
    expect(flowing.items).toHaveLength(3);
  });

  it('una flecha de un solo punto no dibuja nada', () => {
    expect(arrow([[1, 1]]).items).toHaveLength(0);
  });
});

describe('miniaturas', () => {
  it('quitan el texto y las animaciones de entrada pero conservan el flujo y el pulso', () => {
    const prims = flatten(getThumbnail('arquitectura-en-capas-clean-onion') ?? []);
    const motions = prims.map((prim) => (prim.kind === 'text' ? undefined : prim.motion?.kind));
    const kinds = new Set(motions.filter((kind) => kind !== undefined));

    expect(prims.some((prim) => prim.kind === 'text')).toBe(false);
    expect([...kinds].filter((kind) => ['draw', 'fade', 'rise'].includes(kind))).toEqual([]);
    expect(kinds.has('pulse')).toBe(true);
  });

  it('devuelve la misma miniatura en caché y undefined si no hay figura', () => {
    expect(getThumbnail('solid')).toBe(getThumbnail('solid'));
    expect(getThumbnail('no-existe')).toBeUndefined();
  });
});

describe('figuras en el idioma del artículo', () => {
  const localized = [
    'capas-no-son-arquitectura',
    'fitness-en-el-ci',
    'monolito-modular-primero',
    'organigrama-y-sistema',
    'coordinar-servicios-sin-2pc',
    'cap-por-operacion',
    'salida-de-la-nube',
    'reintentos-con-jitter',
    'adr-ciclo-de-vida',
    'autonomia-de-la-ia',
    'antes-de-escalar-la-cuenta',
    'complejidad-accidental-de-herramientas',
  ];

  it.each(localized)('%s: los textos cambian con el idioma y no se mezclan', (slug) => {
    const en = figureToSvg(getFigure(slug, 'en') ?? []);
    const es = figureToSvg(getFigure(slug, 'es') ?? []);

    expect(en).not.toEqual(es);
    expect(en).not.toMatch(/[áéíóúñ¿¡]/);
  });
});
