import type { ReactNode } from 'react';

import {
  box,
  colors,
  gridTile,
  img,
  markSvg,
  node,
  text,
  toDataUri,
  type OgCardInput,
  type OgFigure,
} from './og-kit';

const FIGURE_WIDTH = 452;
const FIGURE_HEIGHT = 282;

const crossMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" fill="none" stroke="${colors.muted}" stroke-width="1.4"/></svg>`;

function titleSize(title: string): number {
  if (title.length <= 22) {
    return 68;
  }

  if (title.length <= 36) {
    return 54;
  }

  return title.length <= 52 ? 46 : 42;
}

function brandRow(input: OgCardInput): ReactNode {
  return node('div', {
    children: [
      img(toDataUri(markSvg), 44),
      text({ color: colors.ink, fontFamily: 'Fraunces', fontSize: 28 }, input.siteName),
    ],
    style: { alignItems: 'center', display: 'flex', gap: 14 },
  });
}

function headline(input: OgCardInput): ReactNode {
  const eyebrow = text(
    {
      color: colors.accent,
      fontFamily: 'JetBrains Mono',
      fontSize: 20,
      letterSpacing: 4,
      textTransform: 'uppercase',
    },
    input.eyebrow,
  );
  const title = text(
    {
      color: colors.ink,
      fontFamily: 'Fraunces',
      fontSize: titleSize(input.title),
      letterSpacing: -2,
      lineHeight: 1.04,
    },
    input.title,
  );
  const description = text(
    {
      color: colors.muted,
      fontFamily: 'Newsreader',
      fontSize: 22,
      lineClamp: 3,
      lineHeight: 1.35,
    },
    input.description,
  );

  return node('div', {
    children: [
      box({ backgroundColor: colors.accent, height: 6, width: 72 }),
      eyebrow,
      title,
      description,
    ],
    style: { display: 'flex', flexDirection: 'column', gap: 18 },
  });
}

function leftColumn(input: OgCardInput): ReactNode {
  return node('div', {
    children: [
      brandRow(input),
      headline(input),
      text(
        { color: colors.muted, fontFamily: 'JetBrains Mono', fontSize: 19, letterSpacing: 1 },
        input.siteUrl,
      ),
    ],
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: 484,
    },
  });
}

// Marcas de registro (+) en las esquinas del panel, como en el marco de la figura del sitio.
function registrationMarks(): ReactNode[] {
  const corners = [
    { left: -9, top: -9 },
    { right: -9, top: -9 },
    { bottom: -9, left: -9 },
    { bottom: -9, right: -9 },
  ];

  return corners.map((corner) =>
    node('div', {
      children: img(toDataUri(crossMark), 18),
      style: { backgroundColor: colors.paper, display: 'flex', position: 'absolute', ...corner },
    }),
  );
}

function specRow([label, value]: [string, string], index: number): ReactNode {
  const cell = {
    fontFamily: 'JetBrains Mono',
    fontSize: 15,
    letterSpacing: 2,
    padding: '6px 12px',
  };

  return node('div', {
    children: [
      text(
        { ...cell, borderRight: `1.5px solid ${colors.ink}`, color: colors.muted, width: 112 },
        label,
      ),
      text({ ...cell, color: colors.ink, textTransform: 'uppercase' }, value),
    ],
    style: { borderTop: index === 0 ? 'none' : `1.5px solid ${colors.ink}`, display: 'flex' },
  });
}

function figurePanel(input: OgCardInput, figure: OgFigure): ReactNode {
  const caption = node('div', {
    children: [
      text(
        {
          color: colors.accent,
          fontFamily: 'JetBrains Mono',
          fontSize: 16,
          letterSpacing: 3,
          paddingTop: 4,
          textTransform: 'uppercase',
          width: 104,
        },
        figure.label,
      ),
      text(
        {
          color: colors.muted,
          fontFamily: 'Newsreader',
          fontSize: 20,
          lineClamp: 2,
          lineHeight: 1.3,
          width: 354,
        },
        figure.caption,
      ),
    ],
    style: {
      alignItems: 'flex-start',
      borderTop: `1.5px dashed ${colors.line}`,
      display: 'flex',
      paddingTop: 10,
    },
  });
  const table = node('div', {
    children: input.rows.map((row, index) => specRow(row, index)),
    style: { border: `1.5px solid ${colors.ink}`, display: 'flex', flexDirection: 'column' },
  });

  return node('div', {
    children: [
      ...registrationMarks(),
      node('img', {
        height: FIGURE_HEIGHT,
        src: toDataUri(figure.svg),
        style: { alignSelf: 'center', flexShrink: 0 },
        width: FIGURE_WIDTH,
      }),
      caption,
      table,
    ],
    style: {
      backgroundColor: colors.paper,
      backgroundImage: `url(${toDataUri(gridTile)})`,
      backgroundSize: '96px 96px',
      border: `1.5px solid ${colors.line}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      justifyContent: 'space-between',
      padding: 14,
      position: 'relative',
      width: 500,
    },
  });
}

/**
Marco de la tarjeta con figura: título y descripción a la izquierda, la figura del artículo
(FIG. NN) con su pie y el cajetín a la derecha.
*/
export function buildFigureFrame(input: OgCardInput, figure: OgFigure): ReactNode {
  return node('div', {
    children: [leftColumn(input), figurePanel(input, figure)],
    style: {
      backgroundColor: colors.paper,
      border: `2px solid ${colors.ink}`,
      display: 'flex',
      flexGrow: 1,
      gap: 36,
      justifyContent: 'space-between',
      margin: 36,
      padding: '30px 40px',
    },
  });
}
