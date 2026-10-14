import { getDocsByLocale } from '@/lib/content/registry';
import roadmapsJson from '@/lib/content/roadmaps.json';
import type { ContentEntry, LocalizedText, Roadmap, RoadmapStage } from '@/lib/content/types';
import type { Locale } from '@/lib/i18n/locales';

export const roadmaps: Roadmap[] = roadmapsJson.roadmaps.toSorted((a, b) => a.order - b.order);

export type RoadmapStep = {
  entry: ContentEntry;
  /**
  Posición 1-based en todo el roadmap (la numeración que ve el lector).
  */
  number: number;
  stageIndex: number;
};

type RoadmapStageSteps = {
  index: number;
  readingMinutes: number;
  stage: RoadmapStage;
  steps: RoadmapStep[];
};

export type RoadmapPath = {
  /**
  Posición 1-based del roadmap en el catálogo (R-01, R-02…).
  */
  number: number;
  readingMinutes: number;
  roadmap: Roadmap;
  stages: RoadmapStageSteps[];
  steps: RoadmapStep[];
};

export type DocRoadmapPosition = {
  next?: RoadmapStep | undefined;
  path: RoadmapPath;
  previous?: RoadmapStep | undefined;
  stage: RoadmapStageSteps;
  step: RoadmapStep;
};

export function getRoadmapText(roadmap: Roadmap, locale: Locale): LocalizedText {
  return roadmap.labels[locale];
}

export function getStageText(stage: RoadmapStage, locale: Locale): LocalizedText {
  return stage.labels[locale];
}

function sumMinutes(steps: readonly RoadmapStep[]): number {
  return steps.reduce((total, step) => total + step.entry.readingMinutes, 0);
}

function buildPath(roadmap: Roadmap, number: number, docs: ContentEntry[]): RoadmapPath {
  const steps: RoadmapStep[] = [];
  const stages = roadmap.stages
    .map((stage) => ({
      entries: docs
        .filter((doc) => doc.roadmap.id === roadmap.id && doc.roadmap.stage === stage.id)
        .toSorted((a, b) => a.roadmap.step - b.roadmap.step || a.slug.localeCompare(b.slug)),
      stage,
    }))
    .filter(({ entries }) => entries.length > 0)
    .map(({ entries, stage }, stageIndex): RoadmapStageSteps => {
      const stageSteps = entries.map((entry, index): RoadmapStep => ({
        entry,
        number: steps.length + index + 1,
        stageIndex,
      }));

      steps.push(...stageSteps);

      return {
        index: stageIndex,
        readingMinutes: sumMinutes(stageSteps),
        stage,
        steps: stageSteps,
      };
    });

  return { number, readingMinutes: sumMinutes(steps), roadmap, stages, steps };
}

/**
Roadmaps del idioma con sus pasos. Todo sale del frontmatter (`roadmap`) de cada artículo: un
artículo nuevo aparece en su etapa sin tocar nada más. Se omiten los roadmaps sin artículos.
*/
export function getRoadmapPaths(locale: Locale): RoadmapPath[] {
  const docs = getDocsByLocale(locale);

  return roadmaps
    .map((roadmap, index) => buildPath(roadmap, index + 1, docs))
    .filter((path) => path.steps.length > 0);
}

export function getRoadmapPath(locale: Locale, id: string): RoadmapPath | undefined {
  return getRoadmapPaths(locale).find((path) => path.roadmap.id === id);
}

/**
Dónde cae un artículo en su roadmap, con el paso anterior y el siguiente de la ruta guiada.
*/
export function getDocRoadmapPosition(entry: ContentEntry): DocRoadmapPosition | undefined {
  const path = getRoadmapPath(entry.locale, entry.roadmap.id);
  const index = path?.steps.findIndex((step) => step.entry.slug === entry.slug) ?? -1;
  const step = path?.steps[index];
  const stage = step === undefined ? undefined : path?.stages[step.stageIndex];

  return path === undefined || step === undefined || stage === undefined
    ? undefined
    : { next: path.steps[index + 1], path, previous: path.steps[index - 1], stage, step };
}

/**
Primer paso aún no completado (el «siguiente» del lector); `undefined` si terminó la ruta.
*/
export function getNextPendingStep(
  path: RoadmapPath,
  done: ReadonlySet<string>,
): RoadmapStep | undefined {
  return path.steps.find((step) => !done.has(step.entry.slug));
}

export function countDone(path: RoadmapPath, done: ReadonlySet<string>): number {
  return path.steps.filter((step) => done.has(step.entry.slug)).length;
}
