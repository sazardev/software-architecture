import { describe, expect, it } from 'vitest';

import {
  getDocBySlug,
  getDocNeighbors,
  getDocsByLocale,
  getDocSheet,
  getDocsBySection,
  getLatestDocs,
  getRelatedDocs,
  getTopTags,
} from '@/lib/content/registry';

describe('registro de contenido', () => {
  it('agrupa los documentos por sección en el idioma solicitado', () => {
    const expectedSections = [
      'fundamentos',
      'diseno',
      'practicas',
      'tendencias',
      'nube',
      'decisiones',
    ];

    expect(getDocsBySection('es').map((group) => group.section.id)).toEqual(expectedSections);
    expect(getDocsBySection('en').map((group) => group.section.id)).toEqual(expectedSections);
  });

  it('filtra por categoría', () => {
    const groups = getDocsBySection('es', 'diseno');

    expect(groups).toHaveLength(1);
    const slugs = groups[0]?.docs.map((doc) => doc.slug) ?? [];

    expect(slugs[0]).toBe('c4-model');
    expect(slugs).toEqual(
      expect.arrayContaining(['domain-driven-design', 'arquitectura-hexagonal']),
    );
    expect(groups[0]?.docs.every((doc) => doc.category === 'diseno')).toBe(true);
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
    expect(next?.slug).toBe('adr');
  });

  it('devuelve undefined para slugs desconocidos', () => {
    expect(getDocBySlug('es', 'no-existe')).toBeUndefined();
  });

  it('ordena los documentos más recientes primero y respeta el límite', () => {
    const latest = getLatestDocs('es', 2);

    expect(latest).toHaveLength(2);
    expect((latest[0]?.publishedAt ?? '') >= (latest[1]?.publishedAt ?? '')).toBe(true);
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

  it('cuenta etiquetas por idioma ordenadas por frecuencia y respeta el límite', () => {
    const tags = getTopTags('es', 3);

    expect(tags.length).toBeLessThanOrEqual(3);
    expect(
      tags.every((entry, index) => index === 0 || (tags[index - 1]?.count ?? 0) >= entry.count),
    ).toBe(true);
  });

  it('numera la hoja del documento dentro de su idioma', () => {
    const sheet = getDocSheet('es', 'solid');

    expect(sheet.index).toBeGreaterThan(0);
    expect(sheet.index).toBeLessThanOrEqual(sheet.total);
    expect(sheet.total).toBe(getDocsByLocale('es').length);
  });
});
