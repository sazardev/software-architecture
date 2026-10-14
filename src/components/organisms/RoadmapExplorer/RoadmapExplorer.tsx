import { useMemo, useState } from 'react';

import { BlueprintFrame } from '@/components/atoms';
import { RoadmapStepCard } from '@/components/molecules';
import { useLocale } from '@/lib/i18n/locale-context';
import { layoutRoadmap } from '@/lib/roadmap/roadmap-layout';
import {
  getNextPendingStep,
  getRoadmapText,
  getStageText,
  type RoadmapPath,
} from '@/lib/roadmap/roadmap-registry';
import { useRoadmapProgress } from '@/lib/roadmap/use-roadmap-progress';

import { RoadmapCanvas } from './RoadmapCanvas';

type RoadmapExplorerProps = Readonly<{
  path: RoadmapPath;
}>;

/**
Mesa de trabajo del roadmap: el plano ocupa casi todo el ancho y el inspector del paso
seleccionado vive en su propia columna (debajo en pantallas estrechas), nunca encima del dibujo.
Arranca seleccionando el siguiente paso pendiente.
*/
export function RoadmapExplorer({ path }: RoadmapExplorerProps) {
  const locale = useLocale();
  const { done, setDone } = useRoadmapProgress();
  const layout = useMemo(() => layoutRoadmap(path), [path]);
  const nextStep = getNextPendingStep(path, done);
  const [selected, setSelected] = useState<string | undefined>(
    () => nextStep?.entry.slug ?? path.steps[0]?.entry.slug,
  );
  const index = path.steps.findIndex((step) => step.entry.slug === selected);
  const step = path.steps[index];
  const previous = path.steps[index - 1];
  const next = path.steps[index + 1];
  const stage = step === undefined ? undefined : path.stages[step.stageIndex];

  return (
    <BlueprintFrame className="grid bg-neutral-50 xl:grid-cols-[minmax(0,1fr)_23rem] dark:bg-neutral-950">
      <RoadmapCanvas
        done={done}
        layout={layout}
        nextSlug={nextStep?.entry.slug}
        onSelect={setSelected}
        path={path}
        selected={selected}
        title={getRoadmapText(path.roadmap, locale).label}
      />
      {step === undefined || stage === undefined ? null : (
        <aside className="border-t border-neutral-300 p-6 sm:p-8 xl:border-t-0 xl:border-l xl:p-7 dark:border-neutral-700">
          <RoadmapStepCard
            className="mx-auto max-w-xl xl:max-w-none"
            isDone={done.has(step.entry.slug)}
            isNext={nextStep?.entry.slug === step.entry.slug}
            onNext={
              next === undefined
                ? undefined
                : () => {
                    setSelected(next.entry.slug);
                  }
            }
            onPrevious={
              previous === undefined
                ? undefined
                : () => {
                    setSelected(previous.entry.slug);
                  }
            }
            onToggleDone={() => {
              setDone(step.entry.slug, !done.has(step.entry.slug));
            }}
            stageLabel={getStageText(stage.stage, locale).label}
            step={step}
            total={path.steps.length}
          />
        </aside>
      )}
    </BlueprintFrame>
  );
}
