import { figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    pkg: 'PACKAGE',
    atomic: 'ONE ATOMIC COMMIT',
    mono: 'MONOREPO',
    poly: 'POLYREPO',
    title: 'One change, one commit or many versions',
  },
  es: {
    pkg: 'PAQUETE',
    atomic: 'UN COMMIT ATÓMICO',
    mono: 'MONOREPO',
    poly: 'POLIREPO',
    title: 'Un cambio, un commit o muchas versiones',
  },
} as const;

/**
En un polirepo cada paquete publica su versión y los consumidores se actualizan a su ritmo. En un
monorepo, un cambio que afecta a varios paquetes entra en un único commit.
*/
export function monorepoOPolirepo(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const versions = ['v1.2', 'v2.0', 'v1.9'] as const;

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    group(
      [
        label(150, 110, copy.poly, { size: 11, tracking: 1.6 }),
        ...versions.flatMap((version, index) => [
          rect(70, 130 + index * 70, 160, 52, { fill: 'paper', r: 6, width: 1.4 }),
          label(150, 161 + index * 70, version, { size: 11, tone: 'muted' }),
        ]),
      ],
      motion('rise', 0),
    ),
    group(
      [
        label(490, 110, copy.mono, { size: 11, tracking: 1.6 }),
        rect(340, 130, 260, 186, { fill: 'brandSoft', r: 10, width: 1.6 }),
        rect(370, 152, 200, 40, { fill: 'paper', r: 6, width: 1.2 }),
        label(470, 177, copy.pkg + ' 1', { size: 10 }),
        rect(370, 202, 200, 40, { fill: 'paper', r: 6, width: 1.2 }),
        label(470, 227, copy.pkg + ' 2', { size: 10 }),
        rect(370, 252, 200, 40, { fill: 'paper', r: 6, width: 1.2 }),
        label(470, 277, copy.pkg + ' 3', { size: 10 }),
        label(470, 340, copy.atomic, { size: 10, tone: 'accent', tracking: 1.4 }),
      ],
      motion('rise', 250),
    ),
  );
}
