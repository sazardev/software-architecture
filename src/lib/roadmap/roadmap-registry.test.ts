import { describe, expect, it } from 'vitest';

import { getDocBySlug, getDocsByLocale } from '@/lib/content/registry';
import { layoutRoadmap, wrapLabel } from '@/lib/roadmap/roadmap-layout';
import {
  countDone,
  getDocRoadmapPosition,
  getNextPendingStep,
  getRoadmapPath,
  getRoadmapPaths,
  roadmaps,
} from '@/lib/roadmap/roadmap-registry';

function byText(a: string, b: string): number {
  return a.localeCompare(b);
}

function slugsOf(locale: 'en' | 'es'): string[][] {
  return getRoadmapPaths(locale).map((path) => path.steps.map((step) => step.entry.slug));
}

describe('registro de roadmaps', () => {
  it('cada artículo de cada idioma aparece exactamente una vez en algún roadmap', () => {
    for (const locale of ['es', 'en'] as const) {
      const slugs = getRoadmapPaths(locale).flatMap((path) =>
        path.steps.map((step) => step.entry.slug),
      );

      expect(new Set(slugs).size).toBe(slugs.length);
      expect(slugs.toSorted(byText)).toEqual(
        getDocsByLocale(locale)
          .map((doc) => doc.slug)
          .toSorted(byText),
      );
    }
  });

  it('respeta el orden del catálogo y numera los pasos de forma continua', () => {
    const paths = getRoadmapPaths('es');

    expect(paths.map((path) => path.roadmap.id)).toEqual(roadmaps.map((roadmap) => roadmap.id));

    for (const path of paths) {
      expect(path.steps.map((step) => step.number)).toEqual(
        path.steps.map((_, index) => index + 1),
      );
    }
  });

  it('las traducciones comparten la misma ruta paso a paso', () => {
    expect(slugsOf('en')).toEqual(slugsOf('es'));
  });

  it('ubica un artículo con su paso anterior y siguiente', () => {
    const entry = getDocBySlug('es', 'getting-started');

    expect(entry).toBeDefined();

    const position = entry === undefined ? undefined : getDocRoadmapPosition(entry);

    expect(position?.path.roadmap.id).toBe('fundamentos');
    expect(position?.step.number).toBe(1);
    expect(position?.previous).toBeUndefined();
    expect(position?.next?.number).toBe(2);
  });

  it('el siguiente paso es el primero sin completar', () => {
    const path = getRoadmapPath('es', 'fundamentos');

    expect(path).toBeDefined();

    if (path === undefined) {
      return;
    }

    const [first, second] = path.steps;
    const done = new Set([first?.entry.slug ?? '']);

    expect(getNextPendingStep(path, done)?.entry.slug).toBe(second?.entry.slug);
    expect(countDone(path, done)).toBe(1);
    expect(getRoadmapPath('es', 'no-existe')).toBeUndefined();
  });
});

describe('geometría del plano', () => {
  it('un nodo por paso, un tramo entre pasos consecutivos y todo dentro del lienzo', () => {
    for (const path of getRoadmapPaths('es')) {
      const layout = layoutRoadmap(path);

      expect(layout.nodes).toHaveLength(path.steps.length);
      expect(layout.segments).toHaveLength(path.steps.length - 1);
      expect(layout.stages).toHaveLength(path.stages.length);

      for (const node of layout.nodes) {
        expect(node.x).toBeGreaterThan(0);
        expect(node.x).toBeLessThan(layout.width);
        expect(node.y).toBeGreaterThan(0);
        expect(node.y).toBeLessThan(layout.height);
      }
    }
  });

  it('recorta los rótulos largos con elipsis', () => {
    expect(wrapLabel('Arquitectura de software', 30, 2)).toEqual(['Arquitectura de software']);
    expect(wrapLabel('uno dos tres cuatro cinco seis', 9, 2)).toEqual(['uno dos', 'tres…']);
  });
});
