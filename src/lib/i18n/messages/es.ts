export const es = {
  a11y: {
    backToTop: 'Volver arriba',
    mainNavigation: 'Navegación principal',
    readingProgress: 'Progreso de lectura',
    breadcrumbs: 'Migas de pan',
    categoryFilter: 'Filtrar por sección',
    pager: 'Navegación entre documentos',
    searchField: 'Buscar recursos',
    skipToContent: 'Saltar al contenido',
    tableOfContents: 'En esta página',
  },
  docs: {
    allArticles: 'Todos los artículos',
    featured: 'Destacado',
    keepReading: 'Sigue leyendo',
    minutesShort: (minutes: number) => `${minutes} min`,
    readArticle: 'Leer artículo',
    relatedDescription: 'Más lecturas de la misma sección.',
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
    cta: {
      body: 'Los fundamentos te ahorran meses de refactor. Empieza por el primer artículo y avanza a tu ritmo.',
      title: 'Empieza por los cimientos',
    },
    eyebrow: 'Un cuaderno de ingeniería',
    heroAlt: 'Diagrama animado de una arquitectura en capas',
    latest: {
      all: 'Ver toda la documentación',
      eyebrow: 'Lecturas recientes',
      title: 'Lo último del cuaderno',
    },
    principles: {
      items: [
        {
          body: 'Cada artículo parte de un problema real y termina en una idea que puedes dibujar en una servilleta.',
          title: 'Claridad antes que ingenio',
        },
        {
          body: 'Diagramas, mapas y ejemplos interactivos: ves el sistema moverse, no solo lees sobre él.',
          title: 'Diagramas vivos',
        },
        {
          body: 'Tipografía cómoda, modo oscuro, búsqueda instantánea y funcionamiento sin conexión.',
          title: 'Pensado para leer',
        },
      ],
      title: 'Una forma más serena de aprender arquitectura',
    },
    search: 'Buscar recursos',
    sections: {
      eyebrow: 'Rutas de lectura',
      explore: 'Explorar sección',
      title: 'Tres caminos, un mismo oficio',
    },
    start: 'Empezar a leer',
    stats: {
      articles: 'artículos',
      minutes: 'minutos de lectura',
      sections: 'secciones',
    },
    titleAccent: 'en serio',
    titleLead: 'Arquitectura de software,',
  },
  footer: {
    explore: 'Explorar',
    note: 'Hecho con cuidado para quienes diseñan sistemas.',
    rights: (year: number) => `© ${year} Software Architecture`,
    sections: 'Secciones',
  },
  code: {
    copied: 'Copiado',
    copy: 'Copiar código',
  },
  languageSwitcher: {
    label: 'Idioma',
  },
  map: {
    error: 'No se pudo cargar el mapa interactivo.',
    label: 'Mapa interactivo',
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
  solid: {
    fragileInheritanceBody:
      'La herencia comparte mucho más que métodos: comparte expectativas. Si una subclase necesita desactivar comportamiento heredado, la jerarquía está invertida o sobra. Ante la duda, prefiere componer antes que heredar.',
    fragileInheritanceTitle: 'Herencia frágil',
  },
  search: {
    allCategories: 'Todas',
    available: (count: number) => `${count} recursos disponibles`,
    hint: 'Búsqueda local sobre títulos, etiquetas, descripciones y encabezados.',
    shortcut: 'Atajo de teclado:',
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
