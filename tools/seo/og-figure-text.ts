import type { ReactNode } from 'react';
import satori from 'satori';

import { paperPalette } from '@/lib/figures/figure-palette';
import {
  FIGURE_HEIGHT,
  FIGURE_WIDTH,
  type Figure,
  type Prim,
  type TextFont,
  type TextPrim,
} from '@/lib/figures/figure-types';

import { loadFonts, node } from './og-kit';

// Con `lineHeight: 1` la línea base de Fraunces y JetBrains Mono cae al 86 % del cuerpo.
const BASELINE = 0.86;
// Ancho de la caja de cada etiqueta: holgado para que el texto no se recorte.
const BOX = 360;

const families: Readonly<Record<TextFont, string>> = {
  display: 'Fraunces',
  mono: 'JetBrains Mono',
  sans: 'Newsreader',
};

function collectTexts(items: readonly Prim[]): TextPrim[] {
  return items.flatMap((item) => {
    if (item.kind === 'text') {
      return [item];
    }

    return item.kind === 'group' ? collectTexts(item.items) : [];
  });
}

function labelNode(prim: TextPrim): ReactNode {
  const size = prim.size ?? 12;
  const anchor = prim.anchor ?? 'start';
  const justify = { end: 'flex-end', middle: 'center', start: 'flex-start' }[anchor];
  const offset = { end: BOX, middle: BOX / 2, start: 0 }[anchor];

  return node('div', {
    children: prim.text,
    style: {
      color: paperPalette[prim.tone ?? 'ink'],
      display: 'flex',
      fontFamily: families[prim.font ?? 'mono'],
      fontSize: size,
      justifyContent: justify,
      left: prim.x - offset,
      letterSpacing: prim.tracking ?? 0,
      lineHeight: 1,
      position: 'absolute',
      top: prim.y - size * BASELINE,
      whiteSpace: 'pre',
      width: BOX,
    },
  });
}

/**
Etiquetas de la figura como contornos vectoriales (satori convierte el texto en trazados).
Así la tarjeta social conserva las letras y rótulos sin depender de fuentes en resvg.
Devuelve un `<svg>` transparente del tamaño del lienzo, listo para superponer.
*/
export async function figureTextOverlay(figure: Figure): Promise<string> {
  const labels = collectTexts(figure).filter((prim) => prim.rotate === undefined);
  const root = node('div', {
    children: labels.map((prim) => labelNode(prim)),
    style: { display: 'flex', height: FIGURE_HEIGHT, position: 'relative', width: FIGURE_WIDTH },
  });

  return satori(root, { fonts: await loadFonts(), height: FIGURE_HEIGHT, width: FIGURE_WIDTH });
}
