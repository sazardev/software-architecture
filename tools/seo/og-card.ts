import { join } from 'node:path';

import { Resvg } from '@resvg/resvg-js';
import type { ReactNode } from 'react';
import satori from 'satori';

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/seo/og';

const projectRoot = join(import.meta.dir, '..', '..');

const colors = {
  accent: '#e2723a',
  ink: '#171512',
  line: '#c9c2b6',
  muted: '#6b655d',
  paper: '#fbf9f5',
} as const;

const gridTile = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><path d="M24 0v96M48 0v96M72 0v96M0 24h96M0 48h96M0 72h96" fill="none" stroke="#3b55c4" stroke-opacity=".08"/><path d="M96 0H0v96" fill="none" stroke="#3b55c4" stroke-opacity=".17"/></svg>`;

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${colors.ink}"/><path d="M32 12 52 22.5 32 33 12 22.5Z" fill="${colors.paper}"/><path d="m12 32 20 10.5L52 32M12 41.5 32 52l20-10.5" fill="none" stroke="${colors.paper}" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.5"/><circle cx="32" cy="22.5" r="4.2" fill="${colors.accent}"/></svg>`;

const toDataUri = (svg: string): string =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

async function loadFont(packageName: string, file: string): Promise<ArrayBuffer> {
  const path = join(projectRoot, 'node_modules', '@fontsource', packageName, 'files', file);

  return Bun.file(path).arrayBuffer();
}

type SatoriFonts = Parameters<typeof satori>[1]['fonts'];

const fontCache = new Map<'all', SatoriFonts>();

async function loadFonts(): Promise<SatoriFonts> {
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

type Style = Record<string, number | string>;

// Nodos mínimos compatibles con satori (no hace falta React para describir el árbol).
function node(type: string, props: Record<string, unknown>): ReactNode {
  return { props, type } as unknown as ReactNode;
}

function box(style: Style, children?: ReactNode): ReactNode {
  return node('div', { children, style: { display: 'flex', ...style } });
}

function text(style: Style, value: string): ReactNode {
  return box(style, value);
}

function img(src: string, size: number): ReactNode {
  return node('img', { height: size, src, width: size });
}

export type OgCardInput = {
  // Segunda línea del título en cursiva color brasa (portada).
  accent?: string;
  // Línea secundaria bajo el título (descripción o eslogan).
  description: string;
  // Etiqueta superior derecha en mono (tema o rótulo).
  eyebrow: string;
  // Filas del cajetín inferior derecho: [etiqueta, valor].
  rows: [string, string][];
  siteName: string;
  // Dominio legible en el pie.
  siteUrl: string;
  title: string;
};

function titleSize(title: string, accent: string | undefined): number {
  const length = title.length + (accent?.length ?? 0);

  if (length <= 28) {
    return 92;
  }

  return length <= 48 ? 78 : 64;
}

const mono = { color: colors.muted, fontFamily: 'JetBrains Mono' } as const;

function titleBlock(input: OgCardInput): ReactNode {
  const size = titleSize(input.title, input.accent);
  const base = { fontFamily: 'Fraunces', fontSize: size, letterSpacing: -2.4, lineHeight: 1.04 };
  const lines = [text({ ...base, color: colors.ink }, input.title)];

  if (input.accent !== undefined) {
    lines.push(text({ ...base, color: colors.accent, fontStyle: 'italic' }, input.accent));
  }

  return node('div', {
    children: lines,
    style: { display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 980 },
  });
}

function headerRow(input: OgCardInput): ReactNode {
  const brand = node('div', {
    children: [
      img(toDataUri(markSvg), 48),
      text({ color: colors.ink, fontFamily: 'Fraunces', fontSize: 30 }, input.siteName),
    ],
    style: { alignItems: 'center', display: 'flex', gap: 16 },
  });
  const eyebrow = text(
    {
      color: colors.accent,
      fontFamily: 'JetBrains Mono',
      fontSize: 22,
      letterSpacing: 4,
      textTransform: 'uppercase',
    },
    input.eyebrow,
  );

  return node('div', {
    children: [brand, eyebrow],
    style: { alignItems: 'center', display: 'flex', justifyContent: 'space-between' },
  });
}

function bodyBlock(input: OgCardInput): ReactNode {
  const description = text(
    {
      color: colors.muted,
      fontFamily: 'Newsreader',
      fontSize: 30,
      lineClamp: 2,
      lineHeight: 1.35,
      maxWidth: 940,
    },
    input.description,
  );

  return node('div', {
    children: [
      box({ backgroundColor: colors.accent, height: 6, width: 72 }),
      titleBlock(input),
      description,
    ],
    style: { display: 'flex', flexDirection: 'column', gap: 28 },
  });
}

function specRow([label, value]: [string, string], index: number): ReactNode {
  const cell = {
    fontFamily: 'JetBrains Mono',
    fontSize: 17,
    letterSpacing: 2,
    padding: '8px 14px',
  };

  return node('div', {
    children: [
      text(
        { ...cell, borderRight: `1.5px solid ${colors.ink}`, color: colors.muted, width: 130 },
        label,
      ),
      text({ ...cell, color: colors.ink, textTransform: 'uppercase' }, value),
    ],
    style: { borderTop: index === 0 ? 'none' : `1.5px solid ${colors.ink}`, display: 'flex' },
  });
}

function footerRow(input: OgCardInput): ReactNode {
  const url = text({ ...mono, fontSize: 20, letterSpacing: 1 }, input.siteUrl);
  const table = node('div', {
    children: input.rows.map((row, index) => specRow(row, index)),
    style: { border: `1.5px solid ${colors.ink}`, display: 'flex', flexDirection: 'column' },
  });

  return node('div', {
    children: [url, table],
    style: { alignItems: 'flex-end', display: 'flex', justifyContent: 'space-between' },
  });
}

function buildTree(input: OgCardInput): ReactNode {
  const frame = node('div', {
    children: [headerRow(input), bodyBlock(input), footerRow(input)],
    style: {
      backgroundColor: colors.paper,
      border: `2px solid ${colors.ink}`,
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      justifyContent: 'space-between',
      margin: 36,
      padding: '36px 48px',
    },
  });

  return node('div', {
    children: frame,
    style: {
      backgroundColor: colors.paper,
      backgroundImage: `url(${toDataUri(gridTile)})`,
      backgroundSize: '96px 96px',
      display: 'flex',
      height: OG_IMAGE_HEIGHT,
      width: OG_IMAGE_WIDTH,
    },
  });
}

export async function renderOgCard(input: OgCardInput): Promise<Uint8Array> {
  const svg = await satori(buildTree(input), {
    fonts: await loadFonts(),
    height: OG_IMAGE_HEIGHT,
    width: OG_IMAGE_WIDTH,
  });

  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_IMAGE_WIDTH } }).render().asPng();
}
