import { describe, expect, it } from 'vitest';

import { getDocBySlug, getDocNeighbors, getDocsBySection } from '@/lib/content/registry';

describe('registro de contenido', () => {
  it('agrupa los documentos por sección en el orden de la taxonomía', () => {
    expect(getDocsBySection().map((group) => group.section.id)).toEqual([
      'fundamentos',
      'diseno',
      'practicas',
    ]);
  });

  it('filtra por categoría', () => {
    const groups = getDocsBySection('diseno');

    expect(groups).toHaveLength(1);
    expect(groups[0]?.docs.map((doc) => doc.slug)).toEqual(['c4-model']);
  });

  it('expone vecinos para la navegación anterior/siguiente', () => {
    const { next, previous } = getDocNeighbors('solid');

    expect(previous?.slug).toBe('getting-started');
    expect(next?.slug).toBe('c4-model');
  });

  it('devuelve undefined para slugs desconocidos', () => {
    expect(getDocBySlug('no-existe')).toBeUndefined();
  });
});
