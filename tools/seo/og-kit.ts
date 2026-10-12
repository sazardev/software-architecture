import { join } from 'node:path';

import type { ReactNode } from 'react';
import type satori from 'satori';

const projectRoot = join(import.meta.dir, '..', '..');

export const colors = {
  accent: '#e2723a',
  ink: '#171512',
  line: '#c9c2b6',
  muted: '#6b655d',
  paper: '#fbf9f5',
} as const;

export const gridTile = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><path d="M24 0v96M48 0v96M72 0v96M0 24h96M0 48h96M0 72h96" fill="none" stroke="#3b55c4" stroke-opacity=".08"/><path d="M96 0H0v96" fill="none" stroke="#3b55c4" stroke-opacity=".17"/></svg>`;

export const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${colors.ink}"/><path d="M32 12 52 22.5 32 33 12 22.5Z" fill="${colors.paper}"/><path d="m12 32 20 10.5L52 32M12 41.5 32 52l20-10.5" fill="none" stroke="${colors.paper}" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"/><circle cx="32" cy="22.5" r="4.2" fill="${colors.accent}"/></svg>`;

export const toDataUri = (svg: string): string =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

async function loadFont(packageName: string, file: string): Promise<ArrayBuffer> {
  const path = join(projectRoot, 'node_modules', '@fontsource', packageName, 'files', file);

  return Bun.file(path).arrayBuffer();
}

export type SatoriFonts = Parameters<typeof satori>[1]['fonts'];

const fontCache = new Map<'all', SatoriFonts>();

export async function loadFonts(): Promise<SatoriFonts> {
  const cached = fontCache.get('all');

  if (cached !== undefined) {
    return cached;
  }

  const [fraunces, frauncesItalic, newsreader, mono] = await Promise.all([
    loadFont('fraunces', 'fraunces-latin-500-normal.woff'),
    loadFont('fraunces', 'fraunces-latin-500-italic.woff'),
    loadFont('newsreader', 'newsreader-latin-400-normal.woff'),
    loadFont('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
  ]);
  const fonts: SatoriFonts = [
    { data: fraunces, name: 'Fraunces', style: 'normal', weight: 500 },
    { data: frauncesItalic, name: 'Fraunces', style: 'italic', weight: 500 },
    { data: newsreader, name: 'Newsreader', style: 'normal', weight: 400 },
    { data: mono, name: 'JetBrains Mono', style: 'normal', weight: 400 },
  ];

  fontCache.set('all', fonts);

  return fonts;
}

export type Style = Record<string, number | string>;

// Nodos mínimos compatibles con satori (no hace falta React para describir el árbol).
export function node(type: string, props: Record<string, unknown>): ReactNode {
  return { props, type } as unknown as ReactNode;
}

export function box(style: Style, children?: ReactNode): ReactNode {
  return node('div', { children, style: { display: 'flex', ...style } });
}

export function text(style: Style, value: string): ReactNode {
  return box(style, value);
}

export function img(src: string, size: number): ReactNode {
  return node('img', { height: size, src, width: size });
}

/**
Figura del artículo en la tarjeta social: geometría SVG (sin texto) y su pie.
*/
export type OgFigure = {
  caption: string;
  // «FIG. 07».
  label: string;
  svg: string;
};

export type OgCardInput = {
  // Segunda línea del título en cursiva color brasa (portada).
  accent?: string;
  // Línea secundaria bajo el título (descripción o eslogan).
  description: string;
  // Etiqueta superior derecha en mono (tema o rótulo).
  eyebrow: string;
  // Figura del artículo: si existe, la tarjeta se compone en dos columnas.
  figure?: OgFigure;
  // Filas del cajetín inferior derecho: [etiqueta, valor].
  rows: [string, string][];
  siteName: string;
  // Dominio legible en el pie.
  siteUrl: string;
  title: string;
};
