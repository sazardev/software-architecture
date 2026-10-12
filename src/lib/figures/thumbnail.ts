import type { Figure, Motion, Prim } from './figure-types';
import { getFigure } from './registry';

// Movimientos de entrada: en una miniatura no aportan y retrasarían el primer pintado.
const entryMotions = new Set(['draw', 'fade', 'rise']);

function ambientOnly(motion: Motion | undefined): Motion | undefined {
  return motion !== undefined && entryMotions.has(motion.kind) ? undefined : motion;
}

function simplify(prim: Prim): Prim[] {
  switch (prim.kind) {
    case 'group': {
      return [
        {
          ...prim,
          items: prim.items.flatMap((item) => simplify(item)),
          motion: ambientOnly(prim.motion),
        },
      ];
    }
    // A tamaño de miniatura las etiquetas son ilegibles: solo geometría.
    case 'text': {
      return [];
    }
    default: {
      return [{ ...prim, motion: ambientOnly(prim.motion) }];
    }
  }
}

/**
Versión ligera de una figura para listados: sin texto ni animaciones de entrada. Conserva el
movimiento ambiente (flujo, pulso), que la hoja de estilos solo activa al pasar el cursor.
*/
function toThumbnail(figure: Figure): Figure {
  return figure.flatMap((prim) => simplify(prim));
}

const cache = new Map<string, Figure | undefined>();

export function getThumbnail(slug: string): Figure | undefined {
  if (!cache.has(slug)) {
    const figure = getFigure(slug);

    cache.set(slug, figure === undefined ? undefined : toThumbnail(figure));
  }

  return cache.get(slug);
}
