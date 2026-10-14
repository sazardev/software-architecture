import { arrow, figure, group, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    aclBottom: 'LAYER',
    aclTop: 'ANTI-CORRUPTION',
    legacy: 'LEGACY',
    legacyModel: 'old model',
    migrated: 'migrated',
    newModel: 'new model',
    newService: 'NEW SERVICE',
    pending: 'pending',
    router: 'ROUTER',
    translates: 'translates',
  },
  es: {
    aclBottom: 'ANTICORRUPCIÓN',
    aclTop: 'CAPA',
    legacy: 'LEGADO',
    legacyModel: 'modelo antiguo',
    migrated: 'migrado',
    newModel: 'modelo nuevo',
    newService: 'NUEVO SERVICIO',
    pending: 'pendiente',
    router: 'ROUTER',
    translates: 'traduce',
  },
} as const;

/**
Un router decide qué rutas ya viven en el sistema nuevo. La capa anticorrupción traduce entre
los dos modelos, para que el modelo nuevo no herede los códigos del legado.
*/
export function legadoStranglerAnticorrupcion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    group(
      [
        rect(255, 92, 130, 36, { fill: 'paper', r: 6, width: 1.5 }),
        label(320, 115, copy.router, { size: 10.5, tracking: 1.4 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(40, 170, 170, 120, { fill: 'paper', r: 10, width: 1.5 }),
        label(125, 196, copy.legacy, { size: 11, tracking: 1.6 }),
        label(125, 262, copy.legacyModel, { size: 10, tone: 'muted' }),
      ],
      motion('rise', 150),
    ),
    group(
      [
        rect(430, 170, 170, 120, { fill: 'paper', r: 10, width: 1.5 }),
        label(515, 196, copy.newService, { size: 10.5, tracking: 1.4 }),
        label(515, 262, copy.newModel, { size: 10, tone: 'muted' }),
      ],
      motion('rise', 300),
    ),
    group(
      [
        rect(255, 190, 130, 80, { fill: 'accent', r: 8, stroke: undefined }),
        label(320, 218, copy.aclTop, { size: 10, tone: 'paper', tracking: 1.1 }),
        label(320, 236, copy.aclBottom, { size: 10, tone: 'paper', tracking: 1.1 }),
      ],
      motion('rise', 450),
    ),
    group(
      [
        arrow(
          [
            [212, 230],
            [252, 230],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [428, 230],
            [388, 230],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [280, 128],
            [125, 168],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [360, 128],
            [515, 168],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('fade', 600),
    ),
    label(320, 320, copy.translates, { tone: 'muted' }),
    label(125, 320, copy.pending, { tone: 'muted' }),
    label(515, 320, copy.migrated, { tone: 'accent' }),
  );
}
