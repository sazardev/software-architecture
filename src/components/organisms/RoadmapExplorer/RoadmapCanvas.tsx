import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';

import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import { ROADMAP_LAYOUT, type LayoutNode, type RoadmapLayout } from '@/lib/roadmap/roadmap-layout';
import { getStageText, type RoadmapPath } from '@/lib/roadmap/roadmap-registry';
import { cn } from '@/lib/utils/cn';
import { padNumber } from '@/lib/utils/pad-number';

import { StageFrame, StepNode, Track, type StepState } from './CanvasParts';
import { usePanZoom } from './use-pan-zoom';

/**
Si el plano completo cabe a esta escala se abre entero; si no, se abre a tamaño de lectura
encuadrado en el paso seleccionado (y «Ver todo» muestra el conjunto).
*/
const READABLE_FIT = 0.8;
const READING_ZOOM = 1;
const MIN_READING_ZOOM = 0.82;
const COMPACT_ZOOM = 0.78;
const COMPACT_WIDTH = 640;

type Box = { height: number; width: number; x: number; y: number };
type Size = { height: number; width: number };

/**
Caja de un paso en el lienzo: su fila completa (círculo + rótulo) dentro de la columna.
*/
function stepBox(node: LayoutNode): Box {
  const { columnWidth, nodeOffset, rowHeight } = ROADMAP_LAYOUT;

  return {
    height: rowHeight,
    width: columnWidth,
    x: node.x - nodeOffset,
    y: node.y - rowHeight / 2,
  };
}

/**
Punto a centrar para ver un paso a escala `k`. Si el paso cabe contando desde el origen del
plano, se alinea arriba/izquierda (así se leen las cabeceras de etapa); si no, se centra en él.
*/
function framePoint(node: LayoutNode, k: number, view: Size): { x: number; y: number } {
  const box = stepBox(node);
  const margin = ROADMAP_LAYOUT.padding;
  const canFitWidth = (box.x + box.width + margin) * k <= view.width;
  const canFitHeight = (box.y + box.height + margin) * k <= view.height;

  return {
    x: canFitWidth ? view.width / (2 * k) : box.x + box.width / 2,
    y: canFitHeight ? view.height / (2 * k) : node.y,
  };
}

type RoadmapCanvasProps = Readonly<{
  done: ReadonlySet<string>;
  layout: RoadmapLayout;
  nextSlug: string | undefined;
  onSelect: (slug: string) => void;
  path: RoadmapPath;
  selected: string | undefined;
  title: string;
}>;

const toolClass =
  'flex h-9 min-w-9 items-center justify-center gap-2 px-2.5 font-mono text-xs tracking-[0.08em] text-neutral-700 uppercase transition-colors hover:bg-neutral-200/70 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50';

function ToolButton({
  children,
  label,
  onClick,
}: Readonly<{ children: ReactNode; label: string; onClick: () => void }>) {
  return (
    <button aria-label={label} className={toolClass} onClick={onClick} title={label} type="button">
      {children}
    </button>
  );
}

const legendDot: Record<StepState, string> = {
  done: 'border-neutral-900 bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100',
  next: 'border-accent-600 bg-accent-600 dark:border-accent-500 dark:bg-accent-500',
  pending: 'border-neutral-500 bg-neutral-50 dark:bg-neutral-950',
};

/**
Plano interactivo del roadmap: barra de herramientas arriba, lienzo limpio (nada flota sobre el
dibujo) y ayuda abajo. Etapas como hojas, pasos como paradas y la línea que los une; se mueve,
se acerca y vuela hasta el paso seleccionado.
*/
export function RoadmapCanvas({
  done,
  layout,
  nextSlug,
  onSelect,
  path,
  selected,
  title,
}: RoadmapCanvasProps) {
  const locale = useLocale();
  const messages = useMessages();
  const text = messages.roadmap;
  const viewportRef = useRef<HTMLDivElement>(null);
  const { fit, fitScale, focus, isDragging, isInView, view, zoomBy } = usePanZoom(
    viewportRef,
    layout,
  );
  const nodeBySlug = useMemo(
    () => new Map(layout.nodes.map((node) => [node.slug, node])),
    [layout.nodes],
  );
  const selectedNode = selected === undefined ? undefined : nodeBySlug.get(selected);
  const firstRender = useRef(true);

  const flyTo = useCallback(
    (node: LayoutNode, isAnimated: boolean) => {
      const viewport = viewportRef.current;

      if (viewport === null) {
        return;
      }

      const size = { height: viewport.clientHeight, width: viewport.clientWidth };
      // Escala de lectura: tan cerca de 1:1 como permita ver la altura del plano, sin bajar
      // de un mínimo legible (más bajo en pantallas estrechas).
      const k =
        size.width < COMPACT_WIDTH
          ? COMPACT_ZOOM
          : Math.min(READING_ZOOM, Math.max(MIN_READING_ZOOM, size.height / layout.height));

      focus(framePoint(node, Math.max(isAnimated ? view.k : 0, k), size), k, isAnimated);
    },
    [focus, layout.height, view.k],
  );

  // Al montar: plano entero si se lee bien; si no, tamaño de lectura sobre el paso actual.
  // Después, la cámara solo vuela si el paso elegido queda fuera de la vista.
  useEffect(() => {
    const isFirst = firstRender.current;

    firstRender.current = false;

    if (isFirst && (selectedNode === undefined || fitScale() >= READABLE_FIT)) {
      fit(false);
    } else if (selectedNode !== undefined && (isFirst || !isInView(stepBox(selectedNode)))) {
      flyTo(selectedNode, !isFirst);
    }
  }, [fit, fitScale, flyTo, isInView, selectedNode]);

  const stateOf = (slug: string): StepState => {
    if (done.has(slug)) {
      return 'done';
    }

    return slug === nextSlug ? 'next' : 'pending';
  };

  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-neutral-300 bg-neutral-50 px-3 py-2 sm:px-4 dark:border-neutral-700 dark:bg-neutral-950">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.68rem] tracking-[0.12em] text-neutral-600 uppercase dark:text-neutral-400">
          {(['done', 'next', 'pending'] as const).map((state) => (
            <li className="flex items-center gap-1.5" key={state}>
              <span className={cn('h-2.5 w-2.5 rounded-full border', legendDot[state])} />
              {text.legend[state]}
            </li>
          ))}
        </ul>
        <div className="flex items-center divide-x divide-neutral-300 border border-neutral-300 dark:divide-neutral-700 dark:border-neutral-700">
          <ToolButton
            label={text.canvas.zoomOut}
            onClick={() => {
              zoomBy(0.8);
            }}
          >
            −
          </ToolButton>
          <span
            aria-live="polite"
            className="flex h-9 w-14 items-center justify-center font-mono text-xs text-neutral-600 tabular-nums dark:text-neutral-400"
          >
            {Math.round(view.k * 100)}%
          </span>
          <ToolButton
            label={text.canvas.zoomIn}
            onClick={() => {
              zoomBy(1.25);
            }}
          >
            +
          </ToolButton>
          <ToolButton
            label={text.canvas.fit}
            onClick={() => {
              fit();
            }}
          >
            <span aria-hidden="true">⤢</span>
            <span className="hidden sm:inline">{text.canvas.fit}</span>
          </ToolButton>
          {nextSlug === undefined ? null : (
            <ToolButton
              label={text.canvas.focus}
              onClick={() => {
                onSelect(nextSlug);
                const node = nodeBySlug.get(nextSlug);

                if (node !== undefined) {
                  flyTo(node, true);
                }
              }}
            >
              <span aria-hidden="true" className="text-accent-600 dark:text-accent-400">
                ◉
              </span>
              <span className="hidden sm:inline">{text.legend.next}</span>
            </ToolButton>
          )}
        </div>
      </div>

      <div
        aria-label={text.canvas.label(title)}
        className={cn(
          'bp-grid relative h-[70svh] min-h-[26rem] touch-none overflow-hidden select-none xl:h-[min(calc(100svh-12rem),60rem)]',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        ref={viewportRef}
        role="group"
      >
        <svg
          className="absolute top-0 left-0 origin-top-left"
          height={layout.height}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width={layout.width}
        >
          {path.stages.map((stage, index) => {
            const frame = layout.stages[index];
            const stageDone = stage.steps.filter((step) => done.has(step.entry.slug)).length;

            return frame === undefined ? null : (
              <StageFrame
                delay={index * 120}
                done={stageDone}
                frame={frame}
                key={stage.stage.id}
                label={`${text.stage} ${padNumber(index + 1)}`}
                meta={`${stageDone}/${stage.steps.length} · ${text.minutes(stage.readingMinutes)}`}
                number={index + 1}
                title={getStageText(stage.stage, locale).label}
                total={stage.steps.length}
              />
            );
          })}
          <Track done={done} nextSlug={nextSlug} segments={layout.segments} />
          {path.steps.map((step, index) => {
            const node = nodeBySlug.get(step.entry.slug);

            return node === undefined ? null : (
              <StepNode
                ariaLabel={`${text.stepOf(step.number, path.steps.length)}: ${step.entry.title}`}
                delay={300 + index * 35}
                isSelected={selected === step.entry.slug}
                key={step.entry.slug}
                meta={`${text.step} ${padNumber(step.number)} · ${text.minutes(step.entry.readingMinutes)}`}
                node={node}
                onSelect={onSelect}
                state={stateOf(step.entry.slug)}
              />
            );
          })}
        </svg>
      </div>

      <p className="border-t border-neutral-300 bg-neutral-50 px-4 py-2 font-mono text-[0.65rem] tracking-[0.06em] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
        {text.canvas.hint}
      </p>
    </div>
  );
}
