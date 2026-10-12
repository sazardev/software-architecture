import { normalize } from '@/lib/search/search';

export type PaletteQuery = {
  /**
  Etiqueta completa y existente escrita como `#etiqueta`.
  */
  tag: string | undefined;
  /**
  Etiqueta a medio escribir (`#sol`): se usa para sugerir etiquetas.
  */
  tagPrefix: string | undefined;
  /**
  Resto de la consulta, sin las etiquetas.
  */
  text: string;
};

export function parsePaletteQuery(raw: string, knownTags: readonly string[]): PaletteQuery {
  const words: string[] = [];
  let tag: string | undefined;
  let tagPrefix: string | undefined;

  for (const token of raw.split(/\s+/)) {
    if (token === '') {
      continue;
    }

    if (!token.startsWith('#')) {
      words.push(token);
      continue;
    }

    const name = normalize(token.slice(1));

    if (knownTags.includes(name)) {
      tag ??= name;
    } else {
      tagPrefix = name;
    }
  }

  return { tag, tagPrefix, text: words.join(' ') };
}
