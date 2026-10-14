import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type View = Readonly<{ k: number; x: number; y: number }>;

type Size = Readonly<{ height: number; width: number }>;
type Point = { x: number; y: number };

const INITIAL_VIEW: View = { k: 1, x: 0, y: 0 };
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.4;
const FIT_MARGIN = 40;
const GLIDE_MS = 420;
const DRAG_THRESHOLD = 5;

function clampZoom(value: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function zoomAround(view: View, factor: number, cx: number, cy: number): View {
  const k = clampZoom(view.k * factor);
  const ratio = k / view.k;

  return { k, x: cx - (cx - view.x) * ratio, y: cy - (cy - view.y) * ratio };
}

/**
Desplazamiento de un eje que no deja ver vacío: si el contenido cabe se centra; si no, sus
bordes nunca se separan del borde del visor.
*/
function clampAxis(offset: number, viewSize: number, contentSize: number): number {
  return contentSize <= viewSize
    ? (viewSize - contentSize) / 2
    : Math.min(0, Math.max(viewSize - contentSize, offset));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y) || 1;
}

/**
Pan (arrastre), zoom (Ctrl/⌘ + rueda, pellizco o botones) y vuelos suaves sobre un lienzo.
La rueda sin modificador sigue desplazando la página: el plano no secuestra el scroll. La
captura del puntero empieza solo al superar el umbral de arrastre, así un toque sobre un paso
sigue siendo un clic normal.
*/
export function usePanZoom(viewportRef: RefObject<HTMLDivElement | null>, content: Size) {
  const viewRef = useRef<View>(INITIAL_VIEW);
  const [view, setView] = useState<View>(INITIAL_VIEW);
  const [isDragging, setIsDragging] = useState(false);
  const glideRef = useRef(0);

  const commit = useCallback((next: View) => {
    viewRef.current = next;
    setView(next);
  }, []);

  const glideTo = useCallback(
    (target: View) => {
      const from = viewRef.current;
      const startedAt = performance.now();
      const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      cancelAnimationFrame(glideRef.current);

      if (isReduced) {
        commit(target);
        return;
      }

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

  /**
  Escala que hace caber todo el lienzo en el visor (sin ampliar por encima de 1).
  */
  const fitScale = useCallback((): number => {
    const viewport = viewportRef.current;

    return viewport === null
      ? 1
      : clampZoom(
          Math.min(
            (viewport.clientWidth - FIT_MARGIN) / content.width,
            (viewport.clientHeight - FIT_MARGIN) / content.height,
            1,
          ),
        );
  }, [content.height, content.width, viewportRef]);

  const fit = useCallback(
    (isAnimated = true) => {
      const viewport = viewportRef.current;

      if (viewport === null) {
        return;
      }

      const k = fitScale();
      const target = {
        k,
        x: (viewport.clientWidth - content.width * k) / 2,
        y: (viewport.clientHeight - content.height * k) / 2,
      };

      if (isAnimated) {
        glideTo(target);
      } else {
        commit(target);
      }
    },
    [commit, content.height, content.width, fitScale, glideTo, viewportRef],
  );

  /**
  Lleva el punto (x, y) del lienzo al centro del visor con al menos `minZoom` de escala (justo
  esa escala si no es animado: el encuadre inicial), sin
  dejar márgenes vacíos (el encuadre se acota a los bordes del plano).
  */
  const focus = useCallback(
    (point: Point, minZoom: number, isAnimated = true) => {
      const viewport = viewportRef.current;

      if (viewport === null) {
        return;
      }

      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      // El primer encuadre usa la escala pedida; después solo acerca, nunca aleja al lector.
      const k = isAnimated ? Math.max(viewRef.current.k, minZoom) : minZoom;
      const target = {
        k,
        x: clampAxis(width / 2 - point.x * k, width, content.width * k),
        y: clampAxis(height / 2 - point.y * k, height, content.height * k),
      };

      if (isAnimated) {
        glideTo(target);
      } else {
        commit(target);
      }
    },
    [commit, content.height, content.width, glideTo, viewportRef],
  );

  /**
  ¿El rectángulo (coordenadas del lienzo) se ve entero en el visor con la vista actual?
  */
  const isInView = useCallback(
    (box: Readonly<{ height: number; width: number; x: number; y: number }>) => {
      const viewport = viewportRef.current;
      const { k, x, y } = viewRef.current;

      if (viewport === null) {
        return false;
      }

      const left = x + box.x * k;
      const top = y + box.y * k;

      return (
        left >= 0 &&
        top >= 0 &&
        left + box.width * k <= viewport.clientWidth &&
        top + box.height * k <= viewport.clientHeight
      );
    },
    [viewportRef],
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

    const element = viewport;
    const pointers = new Map<number, Point>();
    let pinch: { distance: number; origin: View; x: number; y: number } | null = null;
    let travel = 0;
    let isPanning = false;

    function local(event: { clientX: number; clientY: number }): Point {
      const rect = element.getBoundingClientRect();

      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    function startPinch() {
      const [a, b] = pointers.values().toArray();

      if (a !== undefined && b !== undefined) {
        pinch = {
          distance: distance(a, b),
          origin: viewRef.current,
          x: (a.x + b.x) / 2,
          y: (a.y + b.y) / 2,
        };
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
      }

      cancelAnimationFrame(glideRef.current);
      pointers.set(event.pointerId, local(event));
      travel = 0;

      if (pointers.size !== 2) {
        return;
      }

      element.setPointerCapture(event.pointerId);
      startPinch();
    }

    function updatePinch() {
      const [a, b] = pointers.values().toArray();

      if (pinch === null || a === undefined || b === undefined) {
        return;
      }

      const next = zoomAround(pinch.origin, distance(a, b) / pinch.distance, pinch.x, pinch.y);

      commit({
        k: next.k,
        x: next.x + ((a.x + b.x) / 2 - pinch.x),
        y: next.y + ((a.y + b.y) / 2 - pinch.y),
      });
    }

    function onPointerMove(event: PointerEvent) {
      const previous = pointers.get(event.pointerId);

      if (previous === undefined) {
        return;
      }

      const current = local(event);

      pointers.set(event.pointerId, current);

      if (pinch !== null) {
        updatePinch();
        return;
      }

      travel += Math.abs(current.x - previous.x) + Math.abs(current.y - previous.y);

      if (!isPanning && travel > DRAG_THRESHOLD) {
        isPanning = true;
        element.setPointerCapture(event.pointerId);
        setIsDragging(true);
      }

      if (!isPanning) {
        return;
      }

      const { k, x, y } = viewRef.current;

      commit({ k, x: x + current.x - previous.x, y: y + current.y - previous.y });
    }

    function onPointerUp(event: PointerEvent) {
      pointers.delete(event.pointerId);

      if (pointers.size < 2) {
        pinch = null;
      }

      if (pointers.size > 0) {
        return;
      }

      isPanning = false;
      setIsDragging(false);
    }

    function onWheel(event: WheelEvent) {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      cancelAnimationFrame(glideRef.current);

      const point = local(event);
      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;

      commit(zoomAround(viewRef.current, Math.exp(-event.deltaY * unit * 0.002), point.x, point.y));
    }

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('pointercancel', onPointerUp);
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(glideRef.current);
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('pointercancel', onPointerUp);
      element.removeEventListener('wheel', onWheel);
    };
  }, [commit, viewportRef]);

  return { fit, fitScale, focus, isDragging, isInView, view, zoomBy };
}
