export const es = {
  a11y: {
    breadcrumbs: 'Migas de pan',
    categoryFilter: 'Filtrar por sección',
    pager: 'Navegación entre documentos',
    searchField: 'Buscar recursos',
    skipToContent: 'Saltar al contenido',
    tableOfContents: 'En esta página',
  },
  docs: {
    breadcrumbDocs: 'Documentación',
    breadcrumbHome: 'Inicio',
    empty: 'No hay documentos en esta sección todavía.',
    indexDescription:
      'Explora las secciones de fundamentos, diseño de sistemas y prácticas de calidad para arquitectos de software.',
    notFoundDescription: 'El documento solicitado no existe en el índice de contenido.',
    next: 'Siguiente',
    notFoundTitle: 'Documento no encontrado',
    previous: 'Anterior',
    readingTime: (minutes: number) => `${minutes} min de lectura`,
    summary: (count: number, sections: number) =>
      `${count} recursos organizados en ${sections} secciones.`,
    title: 'Documentación',
    updatedOn: (date: string) => `actualizado el ${date}`,
  },
  home: {
    search: 'Buscar recursos',
    start: 'Empezar',
    title: 'Arquitectura de software, en serio',
  },
  languageSwitcher: {
    label: 'Idioma',
  },
  nav: {
    docs: 'Documentación',
    home: 'Inicio',
    search: 'Buscar',
  },
  notFound: {
    code: '404',
    description:
      'La página que buscas no existe o cambió de lugar. Prueba con la búsqueda o vuelve al inicio.',
    home: 'Volver al inicio',
    search: 'Buscar',
    title: '404 · No encontrado',
  },
  search: {
    allCategories: 'Todas',
    available: (count: number) => `${count} recursos disponibles`,
    hint: 'Búsqueda local sobre títulos, etiquetas, descripciones y encabezados. Atajo de teclado:',
    metaDescription:
      'Búsqueda instantánea sobre títulos, descripciones, etiquetas y encabezados de todos los recursos.',
    noResults: (query: string) => `Sin resultados para «${query}».`,
    placeholder: 'Buscar en la documentación…',
    removeTag: (tag: string) => `Quitar el filtro #${tag}`,
    results: (count: number, query: string) => `${count} resultado(s) para «${query}»`,
    title: 'Buscar',
  },
  site: {
    description:
      'Recursos ultra interactivos, diagramas vivos y documentación profunda para diseñar sistemas que escalan.',
  },
  theme: {
    dark: 'oscuro',
    label: 'Tema',
    light: 'claro',
    switchTo: (next: string) => `Cambiar a tema ${next}`,
    system: 'sistema',
  },
};

export type Messages = typeof es;
