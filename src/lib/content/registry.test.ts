import { describe, expect, it } from 'vitest';

import {
  getDocBySlug,
  getDocNeighbors,
  getDocsByLocale,
  getDocsBySection,
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
    expect(groups[0]?.docs.map((doc) => doc.slug)).toEqual(['c4-model']);
  });

  it('aísla el contenido por idioma', () => {
    expect(getDocsByLocale('es')).toHaveLength(4);
    expect(getDocsByLocale('en')).toHaveLength(4);
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
});
