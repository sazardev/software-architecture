import { describe, expect, it } from 'vitest';

import {
  getDocBySlug,
  getDocNeighbors,
  getDocsByLocale,
  getDocsBySection,
  getLatestDocs,
  getRelatedDocs,
} from '@/lib/content/registry';

describe('registro de contenido', () => {
  it('agrupa los documentos por sección en el idioma solicitado', () => {
    const expectedSections = ['fundamentos', 'diseno', 'practicas'];

    expect(getDocsBySection('es').map((group) => group.section.id)).toEqual(expectedSections);
    expect(getDocsBySection('en').map((group) => group.section.id)).toEqual(expectedSections);
  });

  it('filtra por categoría', () => {
    const groups = getDocsBySection('es', 'diseno');

    expect(groups).toHaveLength(1);
    expect(groups[0]?.docs.map((doc) => doc.slug)).toEqual(['c4-model', 'interactive-map']);
  });

  it('mantiene la paridad de documentos entre idiomas', () => {
    const spanish = getDocsByLocale('es').map((doc) => doc.slug);
    const english = getDocsByLocale('en').map((doc) => doc.slug);

    expect(spanish.length).toBeGreaterThan(0);
    expect(english.toSorted((a, b) => a.localeCompare(b))).toEqual(
      spanish.toSorted((a, b) => a.localeCompare(b)),
    );
  });

  it('aísla el contenido por idioma', () => {
    expect(getDocBySlug('en', 'solid')?.locale).toBe('en');
    expect(getDocBySlug('es', 'solid')?.title).not.toBe(getDocBySlug('en', 'solid')?.title);
  });

  it('expone vecinos por idioma para la navegación anterior/siguiente', () => {
    const { next, previous } = getDocNeighbors('en', 'solid');

    expect(previous?.slug).toBe('getting-started');
    expect(next?.slug).toBe('c4-model');
  });

  it('devuelve undefined para slugs desconocidos', () => {
    expect(getDocBySlug('es', 'no-existe')).toBeUndefined();
  });

  it('ordena los documentos más recientes primero y respeta el límite', () => {
    const latest = getLatestDocs('es', 2);

    expect(latest).toHaveLength(2);
    expect((latest[0]?.updatedAt ?? '') >= (latest[1]?.updatedAt ?? '')).toBe(true);
  });

  it('propone lecturas relacionadas sin repetir el documento ni las exclusiones', () => {
    const entry = getDocBySlug('es', 'solid');

    expect(entry).toBeDefined();

    if (entry === undefined) {
      return;
    }

    const related = getRelatedDocs(entry, 3, ['clean-code']).map((doc) => doc.slug);

    expect(related).not.toContain('solid');
    expect(related).not.toContain('clean-code');
    expect(related.length).toBeLessThanOrEqual(3);
  });
});
