import { describe, expect, it } from 'vitest';

import { parsePaletteQuery } from '@/lib/search/palette-query';

const tags = ['c4', 'clean-code', 'solid'];

describe('parsePaletteQuery', () => {
  it('devuelve solo texto cuando no hay etiquetas', () => {
    expect(parsePaletteQuery('  principios   solid ', tags)).toEqual({
      tag: undefined,
      tagPrefix: undefined,
      text: 'principios solid',
    });
  });

  it('reconoce una etiqueta completa y conserva el resto del texto', () => {
    expect(parsePaletteQuery('#solid liskov', tags)).toEqual({
      tag: 'solid',
      tagPrefix: undefined,
      text: 'liskov',
    });
  });

  it('trata una etiqueta desconocida como prefijo en escritura', () => {
    expect(parsePaletteQuery('#cle', tags)).toEqual({
      tag: undefined,
      tagPrefix: 'cle',
      text: '',
    });
  });

  it('un # solo equivale a un prefijo vacío', () => {
    expect(parsePaletteQuery('#', tags).tagPrefix).toBe('');
  });

  it('normaliza mayúsculas y acentos de la etiqueta', () => {
    expect(parsePaletteQuery('#SOLID', tags).tag).toBe('solid');
  });
});
