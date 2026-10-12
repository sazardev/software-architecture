import { paperPalette } from './figure-palette';
import {
  FIGURE_HEIGHT,
  FIGURE_WIDTH,
  type Figure,
  type GroupPrim,
  type Paint,
  type Prim,
  type TextPrim,
  type Tone,
} from './figure-types';

export type SvgOptions = Readonly<{
  /**
  Incluye las etiquetas de texto. Las tarjetas sociales las omiten: resvg no dispone de las
  tipografías del sitio y a ese tamaño serían ilegibles.
  */
  text?: boolean;
  /**
  Fragmento SVG que se superpone al final (p. ej. etiquetas ya convertidas a trazados).
  */
  overlay?: string;
}>;

const fonts = {
  display: "Fraunces, Georgia, 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
  sans: "'Instrument Sans', ui-sans-serif, system-ui, sans-serif",
} as const;

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function color(tone: Tone | undefined): string {
  return tone === undefined ? 'none' : paperPalette[tone];
}

function paintAttributes(paint: Paint): string {
  const parts = [
    `fill="${color(paint.fill)}"`,
    `stroke="${color(paint.stroke)}"`,
    paint.stroke === undefined ? '' : `stroke-width="${paint.width ?? 1.5}"`,
    paint.dash === undefined ? '' : `stroke-dasharray="${paint.dash}"`,
    paint.opacity === undefined ? '' : `opacity="${paint.opacity}"`,
    'stroke-linejoin="round" stroke-linecap="round"',
  ];

  return parts.filter(Boolean).join(' ');
}

function textToSvg(prim: TextPrim): string {
  const size = prim.size ?? 12;
  const attributes = [
    `x="${prim.x}"`,
    `y="${prim.y}"`,
    `fill="${color(prim.tone ?? 'ink')}"`,
    `font-family="${fonts[prim.font ?? 'mono']}"`,
    `font-size="${size}"`,
    `text-anchor="${prim.anchor ?? 'start'}"`,
    prim.tracking === undefined ? '' : `letter-spacing="${prim.tracking}"`,
    prim.italic === true ? 'font-style="italic"' : '',
    prim.rotate === undefined ? '' : `transform="rotate(${prim.rotate} ${prim.x} ${prim.y})"`,
  ];

  return `<text ${attributes.filter(Boolean).join(' ')}>${escapeXml(prim.text)}</text>`;
}

function primToSvg(prim: Prim, options: SvgOptions): string {
  switch (prim.kind) {
    case 'circle': {
      return `<circle cx="${prim.cx}" cy="${prim.cy}" r="${prim.r}" ${paintAttributes(prim)}/>`;
    }
    case 'group': {
      return groupToSvg(prim, options);
    }
    case 'path': {
      return `<path d="${prim.d}" ${paintAttributes(prim)}/>`;
    }
    case 'rect': {
      return `<rect x="${prim.x}" y="${prim.y}" width="${prim.w}" height="${prim.h}" rx="${prim.r ?? 0}" ${paintAttributes(prim)}/>`;
    }
    case 'text': {
      return options.text === false ? '' : textToSvg(prim);
    }
  }
}

function groupToSvg(group: GroupPrim, options: SvgOptions): string {
  return `<g>${group.items.map((item) => primToSvg(item, options)).join('')}</g>`;
}

/**
Serializa una figura a SVG autónomo con la paleta de papel y tinta.
*/
export function figureToSvg(figure: Figure, options: SvgOptions = {}): string {
  const body = figure.map((prim) => primToSvg(prim, options)).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}" width="${FIGURE_WIDTH}" height="${FIGURE_HEIGHT}">${body}${options.overlay ?? ''}</svg>`;
}
