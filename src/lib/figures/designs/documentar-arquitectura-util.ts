import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    levels: ['CONTEXT', 'CONTAINERS', 'COMPONENTS'],
    note: 'zoom in only where someone needs to decide',
    stale: 'outdated: remove',
    title: 'Document in levels, close to the code',
  },
  es: {
    levels: ['CONTEXTO', 'CONTENEDORES', 'COMPONENTES'],
    note: 'acércate solo donde alguien necesite decidir',
    stale: 'desactualizado: quitar',
    title: 'Documenta por niveles y cerca del código',
  },
} as const;

const levels = [
  { h: 220, w: 360, x: 140, y: 120 },
  { h: 170, w: 240, x: 200, y: 145 },
  { h: 120, w: 130, x: 255, y: 170 },
] as const;

/**
Un documento útil responde una pregunta concreta y cambia con el código. Se lee por niveles, de
lo general a lo particular, y lo que ya no es verdad se quita, no se deja para que engañe.
*/
export function documentarArquitecturaUtil(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 62, copy.title, { size: 15 }),
    levels.map((level, index) =>
      group(
        [
          rect(level.x, level.y, level.w, level.h, {
            fill: index === 2 ? 'brandSoft' : 'paper',
            r: 10,
            width: 1.5,
          }),
          label(level.x + level.w / 2, level.y + 22, copy.levels[index] ?? '', {
            size: 9.5,
            tracking: 1.2,
          }),
        ],
        motion('rise', index * 150),
      ),
    ),
    group(
      [
        rect(520, 300, 100, 40, {
          dash: '4 4',
          fill: undefined,
          r: 6,
          stroke: 'accent',
          width: 1.4,
        }),
        line(528, 308, 612, 332, { stroke: 'accent', width: 1.8 }),
        label(570, 360, copy.stale, { size: 9, tone: 'accent' }),
      ],
      motion('fade', 700),
    ),
    label(320, 386, copy.note, { tone: 'muted' }),
  );
}
