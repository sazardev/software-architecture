/**
Progreso del lector en los roadmaps: los slugs que marcó como hechos. Vive solo en este
navegador (`localStorage`), es común a todos los idiomas (el slug no cambia entre traducciones)
y se sincroniza entre pestañas con el evento `storage`.
*/
export const ROADMAP_PROGRESS_KEY = 'sa:roadmap-done';

const EMPTY: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();

const store: {
  /**
  Última lectura cruda y su conjunto parseado (instantánea estable).
  */
  cachedRaw: string | null;
  cachedSet: ReadonlySet<string>;
  /**
  Copia en memoria: si no hay almacenamiento, el progreso dura lo que la pestaña.
  */
  memoryRaw: string | null;
} = { cachedRaw: null, cachedSet: EMPTY, memoryRaw: null };

function readRaw(): string | null {
  try {
    return localStorage.getItem(ROADMAP_PROGRESS_KEY);
  } catch {
    /*
    localStorage puede no estar disponible (modo privado, iframes)
    */
    return store.memoryRaw;
  }
}

export function parseProgress(raw: string | null): ReadonlySet<string> {
  if (raw === null) {
    return EMPTY;
  }

  try {
    const value: unknown = JSON.parse(raw);

    return Array.isArray(value)
      ? new Set(value.filter((item): item is string => typeof item === 'string'))
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

/**
Instantánea estable (misma referencia mientras no cambie el almacenamiento) para
`useSyncExternalStore`.
*/
export function getProgressSnapshot(): ReadonlySet<string> {
  if (typeof window === 'undefined') {
    return EMPTY;
  }

  const raw = readRaw();

  if (raw !== store.cachedRaw) {
    store.cachedRaw = raw;
    store.cachedSet = parseProgress(raw);
  }

  return store.cachedSet;
}

export function getServerProgressSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function onStorage(event: StorageEvent): void {
  if (event.key === ROADMAP_PROGRESS_KEY || event.key === null) {
    notify();
  }
}

export function subscribeProgress(listener: () => void): () => void {
  if (listeners.size === 0) {
    addEventListener('storage', onStorage);
  }

  listeners.add(listener);

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      removeEventListener('storage', onStorage);
    }
  };
}

function write(next: ReadonlySet<string>): void {
  store.memoryRaw = JSON.stringify([...next].toSorted((a, b) => a.localeCompare(b)));

  try {
    localStorage.setItem(ROADMAP_PROGRESS_KEY, store.memoryRaw);
  } catch {
    /*
    Sin almacenamiento queda la copia en memoria: no es un error para el lector.
    */
  }

  notify();
}

export function setStepDone(slug: string, isDone: boolean): void {
  const next = new Set(getProgressSnapshot());

  if (isDone) {
    next.add(slug);
  } else {
    next.delete(slug);
  }

  write(next);
}

export function clearSteps(slugs: readonly string[]): void {
  const next = new Set(getProgressSnapshot());

  for (const slug of slugs) {
    next.delete(slug);
  }

  write(next);
}
