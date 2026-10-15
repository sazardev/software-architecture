import { arrow, circle, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    blast: 'BLAST RADIUS',
    fault: 'FAULT: +800 MS',
    names: ['ORDERS', 'PAYMENTS', 'QUEUE'],
    stop: 'STOP IF SLO BREACHES',
    title: 'One controlled fault, one limited radius',
  },
  es: {
    blast: 'RADIO DE IMPACTO',
    fault: 'FALLO: +800 MS',
    names: ['PEDIDOS', 'PAGOS', 'COLA'],
    stop: 'PARAR SI SE INCUMPLE EL SLO',
    title: 'Un fallo controlado, un radio acotado',
  },
} as const;

const NODE_Y = 170;
const NODE_H = 80;
const MID_CENTER_X = 320;
const MID_CENTER_Y = NODE_Y + NODE_H / 2;

const nodes = [
  { x: 60, index: 0 },
  { x: 255, index: 1 },
  { x: 450, index: 2 },
] as const;

/**
Tres componentes conectados. El fallo se inyecta solo en el central, dentro de un radio de impacto
marcado; una alarma de parada (el SLO) corta el experimento si el daño sale de ese radio.
*/
export function chaosEngineeringGameDays(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(60, 84, copy.title, { anchor: 'start', size: 11, tone: 'ink', tracking: 2.4 }),
    line(60, 96, 580, 96, { dash: '2 4', stroke: 'muted', width: 1 }),
    group(
      [
        rect(225, 124, 190, 146, { dash: '4 4', fill: 'sunken', r: 6, stroke: 'muted' }),
        label(320, 116, copy.blast, { size: 10, tone: 'muted' }),
      ],
      motion('fade', 200),
    ),
    nodes.map(({ x, index }) => {
      const isFaulty = index === 1;

      return group(
        [
          rect(x, NODE_Y, 130, NODE_H, {
            fill: isFaulty ? 'brandSoft' : 'paper',
            r: 8,
            stroke: isFaulty ? 'accent' : 'ink',
            width: isFaulty ? 2 : 1.5,
          }),
          heading(x + 65, MID_CENTER_Y + 5, copy.names[index], { size: 14 }),
        ],
        motion('rise', 300 + index * 150),
      );
    }),
    group(
      [
        arrow(
          [
            [190, MID_CENTER_Y],
            [251, MID_CENTER_Y],
          ],
          { flow: true, tone: 'ink', width: 1.6 },
        ),
        arrow(
          [
            [389, MID_CENTER_Y],
            [446, MID_CENTER_Y],
          ],
          { flow: true, tone: 'ink', width: 1.6 },
        ),
      ],
      motion('fade', 700),
    ),
    group(
      [
        circle(386, NODE_Y, 7, { fill: 'accent', stroke: 'paper', width: 1.5 }),
        label(MID_CENTER_X, NODE_Y - 20, copy.fault, { size: 10, tone: 'accent' }),
      ],
      motion('fade', 900),
    ),
    group(
      [
        arrow(
          [
            [MID_CENTER_X, 330],
            [MID_CENTER_X, 252],
          ],
          { tone: 'ink' },
        ),
        rect(205, 330, 230, 40, { fill: 'paper', r: 4, stroke: 'ink', width: 1.5 }),
        label(320, 354, copy.stop, { size: 10, tone: 'ink' }),
      ],
      motion('rise', 1200),
    ),
  );
}
