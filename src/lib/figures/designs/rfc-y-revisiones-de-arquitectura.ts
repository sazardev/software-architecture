import { arrow, figure, group, heading, label, motion, node, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BOX_Y = 150;
const BOX_W = 150;
const BOX_H = 90;
const boxX = [40, 245, 450] as const;

const COPY = {
  en: {
    blocking: 'blocking',
    decision: 'DECISION → ADR',
    draft: 'DRAFT',
    note: 'no reply in five days means accepted',
    review: 'REVIEW · 5 DAYS',
    title: 'One proposal, one timebox, one decision',
  },
  es: {
    blocking: 'bloqueante',
    decision: 'DECISIÓN → ADR',
    draft: 'BORRADOR',
    note: 'sin respuesta en cinco días equivale a aceptado',
    review: 'REVISIÓN · 5 DÍAS',
    title: 'Una propuesta, un plazo, una decisión',
  },
} as const;

/**
Un RFC pasa por tres pasos con plazo: borrador, revisión acotada en el tiempo y decisión que queda
registrada como ADR. El silencio cuenta como acuerdo, y solo un comentario bloqueante detiene el paso.
*/
export function rfcYRevisionesDeArquitectura(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 70, copy.title, { size: 15 }),
    group(
      [
        rect(boxX[0], BOX_Y, BOX_W, BOX_H, { fill: 'paper', r: 8, width: 1.5 }),
        label(boxX[0] + BOX_W / 2, BOX_Y + 48, copy.draft, { size: 11, tracking: 1.4 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(boxX[1], BOX_Y, BOX_W, BOX_H, { fill: 'brandSoft', r: 8, width: 1.5 }),
        label(boxX[1] + BOX_W / 2, BOX_Y + 48, copy.review, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        rect(boxX[2], BOX_Y, BOX_W, BOX_H, { fill: 'paper', r: 8, width: 1.5 }),
        label(boxX[2] + BOX_W / 2, BOX_Y + 48, copy.decision, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        arrow(
          [
            [196, BOX_Y + BOX_H / 2],
            [241, BOX_Y + BOX_H / 2],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [401, BOX_Y + BOX_H / 2],
            [446, BOX_Y + BOX_H / 2],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 500),
    ),
    group(
      [
        node(boxX[1] + 40, 275, 7),
        node(boxX[1] + 75, 275, 7),
        node(boxX[1] + 110, 275, 7, true),
        label(boxX[1] + 110, 298, copy.blocking, { size: 10, tone: 'accent' }),
      ],
      motion('fade', 700),
    ),
    label(320, 350, copy.note, { tone: 'muted' }),
  );
}
