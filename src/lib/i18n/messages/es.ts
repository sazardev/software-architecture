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
    articleCount: (count: number) => (count === 1 ? '1 artículo' : `${count} artículos`),
    topics: 'Temas',
    viewAllIn: (count: number, topic: string) => `Ver los ${count} artículos de ${topic}`,
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
      'Explora por tema todos los artículos del cuaderno: arquitectura de software explicada con diagramas, ejemplos y práctica.',
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
      all: (count: number) => `Ver los ${count} temas`,
      eyebrow: 'Temas',
      explore: 'Explorar tema',
      title: 'Explora por tema',
    },
    tags: {
      eyebrow: 'Etiquetas',
      title: 'O sigue el hilo por etiqueta',
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
    allTopics: 'Todos los temas',
    explore: 'Explorar',
    note: 'Hecho con cuidado para quienes diseñan sistemas.',
    rights: (year: number) => `© ${year} Software Architecture`,
    sections: 'Secciones',
  },
  blueprint: {
    figure: 'FIG.',
    project: 'PROYECTO',
    reading: 'LECTURA',
    rev: 'REV.',
    scale: 'ESC.',
    sheet: 'HOJA',
    topic: 'TEMA',
  },
  article: {
    editOnGitHub: 'Editar en GitHub',
    shareCta: '¿Te fue útil? Compártelo',
    suggest: 'Sugerir un cambio',
  },
  code: {
    copied: 'Copiado',
    copy: 'Copiar código',
  },
  selection: {
    comment: 'Comentar en GitHub',
    copy: 'Copiar texto',
    copied: 'Texto copiado',
    link: 'Copiar enlace al fragmento',
    linkCopied: 'Enlace al fragmento copiado',
    quote: 'Copiar como cita',
    quoteCopied: 'Cita copiada',
    share: 'Compartir cita',
    toolbar: 'Acciones sobre el texto seleccionado',
  },
  share: {
    copyLink: 'Copiar enlace',
    email: 'Enviar por correo',
    label: 'Compartir',
    linkCopied: 'Enlace copiado',
    linkedin: 'Compartir en LinkedIn',
    native: 'Compartir…',
    x: 'Compartir en X',
  },
  toc: {
    hint: 'Pasa el cursor para ver el índice',
    progress: (percent: number) => `${percent}% leído`,
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
      'Cuaderno de ingeniería sobre arquitectura de software: artículos a fondo, diagramas vivos y ejemplos claros para diseñar sistemas que escalan.',
    tagline: 'Cuaderno de ingeniería de software',
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
