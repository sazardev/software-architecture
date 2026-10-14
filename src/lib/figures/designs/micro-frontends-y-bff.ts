import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    bffMobile: 'BFF MOBILE',
    bffWeb: 'BFF WEB',
    mobile: 'MOBILE',
    note: 'each channel shapes its response',
    services: 'SHARED SERVICES',
    title: 'One BFF per channel',
    web: 'WEB',
  },
  es: {
    bffMobile: 'BFF MÓVIL',
    bffWeb: 'BFF WEB',
    mobile: 'MÓVIL',
    note: 'cada canal adapta su respuesta',
    services: 'SERVICIOS COMPARTIDOS',
    title: 'Un BFF por canal',
    web: 'WEB',
  },
} as const;

/**
Cada canal tiene su propio BFF que adapta la respuesta a su interfaz. Los servicios compartidos
siguen siendo el punto de acoplamiento: si cambian, todos los BFF se mueven.
*/
export function microFrontendsYBff(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    group(
      [
        rect(60, 86, 200, 50, { fill: 'paper', r: 8, width: 1.5 }),
        label(160, 116, copy.web, { size: 11, tracking: 1.4 }),
        rect(380, 86, 200, 50, { fill: 'paper', r: 8, width: 1.5 }),
        label(480, 116, copy.mobile, { size: 11, tracking: 1.4 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(60, 186, 200, 50, { fill: 'brandSoft', r: 8, width: 1.5 }),
        label(160, 216, copy.bffWeb, { size: 11, tracking: 1.4 }),
        rect(380, 186, 200, 50, { fill: 'brandSoft', r: 8, width: 1.5 }),
        label(480, 216, copy.bffMobile, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        rect(160, 296, 320, 56, { fill: 'accent', r: 8, stroke: undefined }),
        label(320, 329, copy.services, { size: 11, tone: 'paper', tracking: 1.4 }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        arrow(
          [
            [160, 140],
            [160, 182],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [480, 140],
            [480, 182],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [160, 240],
            [250, 292],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [480, 240],
            [390, 292],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 600),
    ),
    label(320, 378, copy.note, { tone: 'muted' }),
  );
}
