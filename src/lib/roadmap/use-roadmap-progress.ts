import { useSyncExternalStore } from 'react';

import {
  clearSteps,
  getProgressSnapshot,
  getServerProgressSnapshot,
  setStepDone,
  subscribeProgress,
} from '@/lib/roadmap/roadmap-progress';

export type RoadmapProgress = {
  clear: (slugs: readonly string[]) => void;
  done: ReadonlySet<string>;
  setDone: (slug: string, isDone: boolean) => void;
};

/**
Pasos completados por el lector (reactivo entre componentes y pestañas).
*/
export function useRoadmapProgress(): RoadmapProgress {
  const done = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  );

  return { clear: clearSteps, done, setDone: setStepDone };
}
