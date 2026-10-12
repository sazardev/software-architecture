import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import type { FlowGraph } from './svg-graph';

export type View = Readonly<{ k: number; x: number; y: number }>;

const INITIAL_VIEW: View = { k: 1, x: 0, y: 0 };
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 6;
const FIT_MARGIN = 96;
const MAX_FIT_ZOOM = 1.6;
const GLIDE_MS = 240;
const CLICK_TRAVEL = 4;

type Pointer = { x: number; y: number };

type Mode =
  | Readonly<{ type: 'idle' }>
  | Readonly<{ type: 'node'; key: string }>
  | Readonly<{ type: 'pan' }>
  | Readonly<{ distance: number; origin: View; type: 'pinch'; x: number; y: number }>;

type Options = Readonly<{
  graphRef: RefObject<FlowGraph | null>;
  /**
  Un clic sobre un nodo lo selecciona; un clic sobre el fondo (sin arrastrar) limpia la selección.
  */
  onSelect: (key: string | null) => void;
  viewportRef: RefObject<HTMLDivElement | null>;
}>;

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

/**
Zoom manteniendo fijo el punto (cx, cy) del viewport.
*/
function zoomAround(view: View, factor: number, cx: number, cy: number): View {
  const k = clampZoom(view.k * factor);
  const ratio = k / view.k;

  return { k, x: cx - (cx - view.x) * ratio, y: cy - (cy - view.y) * ratio };
}

/**
Pan, zoom (rueda, pellizco, teclado vía `zoomBy`) y arrastre de nodos sobre un visor.
Usa listeners nativos para poder cancelar el scroll de la página con la rueda.
*/
export function useViewerGestures({ graphRef, onSelect, viewportRef }: Options) {
  const viewRef = useRef<View>(INITIAL_VIEW);
  const [view, setView] = useState<View>(INITIAL_VIEW);

  const glideRef = useRef(0);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const commit = useCallback((next: View) => {
    viewRef.current = next;
    setView(next);
  }, []);

  /**
  Transición suave (ease-out) hacia `target`; cualquier gesto del usuario la interrumpe.
  */
  const glideTo = useCallback(
    (target: View) => {
      const from = viewRef.current;
      const startedAt = performance.now();

      cancelAnimationFrame(glideRef.current);

      function step(now: number) {
        const progress = Math.min(1, (now - startedAt) / GLIDE_MS);
        const eased = 1 - (1 - progress) ** 3;

        commit({
          k: from.k + (target.k - from.k) * eased,
          x: from.x + (target.x - from.x) * eased,
          y: from.y + (target.y - from.y) * eased,
        });

        if (progress < 1) {
          glideRef.current = requestAnimationFrame(step);
        }
      }

      glideRef.current = requestAnimationFrame(step);
    },
    [commit],
  );

  const fit = useCallback(
    (natural: Readonly<{ height: number; width: number }>, isAnimated = false) => {
      const viewport = viewportRef.current;

      if (viewport === null || natural.width === 0 || natural.height === 0) {
        return;
      }

      const k = Math.min(
        (viewport.clientWidth - FIT_MARGIN) / natural.width,
        (viewport.clientHeight - FIT_MARGIN) / natural.height,
        MAX_FIT_ZOOM,
      );

      const target = {
        k,
        x: (viewport.clientWidth - natural.width * k) / 2,
        y: (viewport.clientHeight - natural.height * k) / 2,
      };

      if (isAnimated) {
        glideTo(target);
      } else {
        commit(target);
      }
    },
    [commit, glideTo, viewportRef],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      const viewport = viewportRef.current;

      if (viewport !== null) {
        glideTo(
          zoomAround(viewRef.current, factor, viewport.clientWidth / 2, viewport.clientHeight / 2),
        );
      }
    },
    [glideTo, viewportRef],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (viewport === null) {
      return;
    }

    const pointers = new Map<number, Pointer>();
    let mode: Mode = { type: 'idle' };
    let travel = 0;

    function local(event: { clientX: number; clientY: number }): Pointer {
      const rect = viewport?.getBoundingClientRect();

      return { x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0) };
    }

    function pair(): readonly [Pointer, Pointer] | null {
      const [first, second] = pointers.values().toArray();

      return first === undefined || second === undefined ? null : [first, second];
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      cancelAnimationFrame(glideRef.current);
      viewport?.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, local(event));
      travel = 0;

      const both = pair();

      if (both !== null) {
        const [a, b] = both;

        mode = {
          distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
          origin: viewRef.current,
          type: 'pinch',
          x: (a.x + b.x) / 2,
          y: (a.y + b.y) / 2,
        };

        return;
      }

      const key = graphRef.current?.nodeKeyAt(event.target) ?? null;

      if (key === null) {
        mode = { type: 'pan' };
      } else {
        mode = { key, type: 'node' };
        onSelectRef.current(key);
      }
    }

    function onPointerMove(event: PointerEvent) {
      const previous = pointers.get(event.pointerId);

      if (previous === undefined) {
        return;
      }

      const current = local(event);
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;

      pointers.set(event.pointerId, current);
      travel += Math.abs(dx) + Math.abs(dy);

      switch (mode.type) {
        case 'pan': {
          commit({ ...viewRef.current, x: viewRef.current.x + dx, y: viewRef.current.y + dy });
          break;
        }
        case 'node': {
          graphRef.current?.moveNode(mode.key, dx / viewRef.current.k, dy / viewRef.current.k);
          break;
        }
        case 'pinch': {
          const both = pair();

          if (both === null) {
            break;
          }

          const [a, b] = both;
          const factor = (Math.hypot(a.x - b.x, a.y - b.y) || 1) / mode.distance;
          const next = zoomAround(mode.origin, factor, mode.x, mode.y);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;

          commit({ k: next.k, x: next.x + (mx - mode.x), y: next.y + (my - mode.y) });
          break;
        }
        case 'idle': {
          break;
        }
      }
    }

    function onPointerUp(event: PointerEvent) {
      if (mode.type === 'pan' && travel < CLICK_TRAVEL && event.type === 'pointerup') {
        onSelectRef.current(null);
      }

      pointers.delete(event.pointerId);
      mode = { type: pointers.size === 1 ? 'pan' : 'idle' };
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      cancelAnimationFrame(glideRef.current);

      const point = local(event);
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;

      commit(
        zoomAround(viewRef.current, Math.exp(-event.deltaY * unit * 0.0016), point.x, point.y),
      );
    }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('pointercancel', onPointerUp);
      viewport.removeEventListener('wheel', onWheel);
    };
  }, [commit, graphRef, viewportRef]);

  return { fit, view, zoomBy };
}
