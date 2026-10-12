import { Resvg } from '@resvg/resvg-js';
import type { ReactNode } from 'react';
import satori from 'satori';

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/seo/og';

import { buildFigureFrame } from './og-figure-card';
import {
  box,
  colors,
  gridTile,
  img,
  loadFonts,
  markSvg,
  node,
  text,
  toDataUri,
  type OgCardInput,
} from './og-kit';

export type { OgCardInput } from './og-kit';

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
  const frame =
    input.figure === undefined
      ? node('div', {
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
        })
      : buildFigureFrame(input, input.figure);

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
