/**
Textos de la sección Roadmap (separados de `es.ts` para mantener cada diccionario manejable).
*/
export const roadmapEs = {
  allRoadmaps: 'Todos los roadmaps',
  breadcrumb: 'Roadmap',
  canvas: {
    fit: 'Ver todo',
    focus: 'Centrar en el siguiente paso',
    hint: 'Arrastra para mover · Ctrl + rueda o pellizco para zoom · toca un paso para ver su ficha',
    label: (title: string) => `Plano interactivo del roadmap ${title}`,
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
  },
  completed: 'Ruta completada',
  continue: 'Continuar',
  description:
    'Rutas guiadas de arquitectura de software: cada artículo tiene su etapa y su paso. Sigue la línea, lee en orden y marca tu progreso.',
  eyebrow: 'Rutas guiadas',
  howItWorks: [
    {
      body: 'Cada roadmap ordena artículos por etapas, de lo esencial a lo avanzado. Los nuevos se suman solos a su etapa.',
      title: 'Elige una ruta',
    },
    {
      body: 'El plano marca en brasa tu siguiente paso. Muévelo, acércalo y abre la ficha de cualquier artículo.',
      title: 'Sigue la línea',
    },
    {
      body: 'Marca cada artículo como hecho. Tu progreso se guarda en este navegador, sin cuentas.',
      title: 'Marca tu avance',
    },
  ],
  inRoadmap: 'En el roadmap',
  legend: { done: 'Hecho', next: 'Siguiente', pending: 'Pendiente' },
  markDone: 'Marcar como hecho',
  markDoneNext: 'Hecho · siguiente paso',
  markedDone: 'Hecho',
  minutes: (minutes: number) => `${minutes} min`,
  nextStep: 'Paso siguiente',
  notFoundDescription: 'Ese roadmap no existe. Revisa la lista de rutas disponibles.',
  notFoundTitle: 'Roadmap no encontrado',
  open: 'Ver roadmap',
  previousStep: 'Paso anterior',
  progress: (done: number, total: number) => `${done} de ${total} pasos`,
  progressLabel: 'Progreso',
  readStep: 'Leer artículo',
  readingHours: (minutes: number) =>
    minutes < 60 ? `${minutes} min de lectura` : `${Math.round(minutes / 60)} h de lectura`,
  reset: 'Reiniciar progreso',
  stage: 'Etapa',
  stagesLabel: 'Etapas',
  stepsLabel: 'Pasos',
  stageCount: (count: number) => (count === 1 ? '1 etapa' : `${count} etapas`),
  start: 'Empezar la ruta',
  step: 'Paso',
  stepCount: (count: number) => (count === 1 ? '1 paso' : `${count} pasos`),
  stepList: 'Paso a paso',
  stepListDescription: 'La misma ruta en lista: lee en orden y marca cada paso al terminar.',
  stepOf: (step: number, total: number) => `Paso ${step} de ${total}`,
  title: 'Roadmap',
  undo: 'Desmarcar',
  youAreHere: 'Estás aquí',
};
