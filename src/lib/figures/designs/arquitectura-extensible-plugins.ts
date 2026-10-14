import { figure, group, heading, label, motion, rect, arrow } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const PORT_Y = [160, 220, 280] as const;
const PLUGIN_Y = [160, 230] as const;

const COPY = {
  en: {
    core: 'CORE',
    note: 'the core never depends on a plugin',
    plugins: ['PLUGIN A', 'PLUGIN B'],
    port: 'STABLE PORT',
    sandbox: 'SANDBOX · PERMISSIONS',
    title: 'Plugins talk to the core only through its ports',
  },
  es: {
    core: 'NÚCLEO',
    note: 'el núcleo nunca depende de un plugin',
    plugins: ['PLUGIN A', 'PLUGIN B'],
    port: 'PUERTO ESTABLE',
    sandbox: 'SANDBOX · PERMISOS',
    title: 'Los plugins solo hablan con el núcleo por sus puertos',
  },
} as const;

/**
El núcleo expone pocos puertos con contrato estable. Cada plugin corre en un sandbox con permisos
explícitos y depende de esos puertos, nunca del interior del núcleo.
*/
export function arquitecturaExtensiblePlugins(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        rect(60, 120, 240, 200, { fill: 'paper', r: 10, width: 1.6 }),
        label(180, 146, copy.core, { size: 11, tracking: 2 }),
        label(180, 340, copy.port, { size: 9.5, tone: 'muted', tracking: 1.2 }),
      ],
      motion('rise'),
    ),
    PORT_Y.map((y, index) =>
      rect(294, y, 14, 22, {
        fill: index === 0 ? 'accent' : 'paper',
        r: 3,
        stroke: index === 0 ? undefined : 'ink',
        width: 1.4,
      }),
    ),
    group(
      [
        rect(400, 120, 200, 200, {
          dash: '4 4',
          fill: 'sunken',
          r: 10,
          stroke: 'muted',
          width: 1.4,
        }),
        label(500, 142, copy.sandbox, { size: 9.5, tone: 'muted', tracking: 1 }),
      ],
      motion('fade', 300),
    ),
    PLUGIN_Y.map((y, index) =>
      group(
        [
          rect(420, y, 160, 44, { fill: 'brandSoft', r: 6, width: 1.4 }),
          label(500, y + 27, copy.plugins[index] ?? '', { size: 10.5, tracking: 1.2 }),
        ],
        motion('rise', 450 + index * 120),
      ),
    ),
    group(
      [
        arrow(
          [
            [310, PORT_Y[0] + 11],
            [416, PLUGIN_Y[0] + 22],
          ],
          { tone: 'accent' },
        ),
        arrow(
          [
            [310, PORT_Y[1] + 11],
            [416, PLUGIN_Y[1] + 22],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 600),
    ),
    label(320, 372, copy.note, { size: 10, tone: 'muted' }),
  );
}
