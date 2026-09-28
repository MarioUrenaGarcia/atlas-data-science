import type { Level } from '../content/types.ts';

export const strings = {
  appName: 'Atlas de Data Science',
  appTagline:
    'Conceptos de la ciencia de datos explicados con visualizaciones interactivas y animadas.',
  skipToContent: 'Saltar al contenido',
  loading: 'Cargando',
  loadError: 'No fue posible cargar esta sección.',
  retry: 'Reintentar',

  nav: {
    label: 'Navegación principal',
    home: 'Inicio',
    modules: 'Módulos',
    map: 'Mapa',
    routes: 'Rutas',
    glossary: 'Glosario',
    progress: 'Progreso',
    notation: 'Notación',
    about: 'Acerca de',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },

  theme: {
    label: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
  },

  levels: {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
  } satisfies Record<Level, string>,

  progress: {
    none: 'Sin marcar',
    seen: 'Visto',
    mastered: 'Dominado',
    markSeen: 'Marcar como visto',
    markMastered: 'Marcar como dominado',
    groupLabel: 'Progreso del concepto',
    title: 'Progreso',
    intro:
      'El progreso se guarda solo en este navegador. Se puede exportar a un archivo para respaldarlo o llevarlo a otro equipo.',
    summary: (mastered: number, seen: number, total: number) =>
      `${mastered} dominados y ${seen} vistos de ${total} conceptos.`,
    byModule: 'Avance por módulo',
    export: 'Exportar progreso',
    import: 'Importar progreso',
    clear: 'Borrar progreso',
    clearConfirmTitle: 'Borrar todo el progreso',
    clearConfirmBody:
      'Se eliminarán las marcas de visto y dominado y la ruta activa. Esta acción no se puede deshacer.',
    clearConfirmAction: 'Borrar',
    cancel: 'Cancelar',
    imported: (count: number) => `Se importaron ${count} marcas de progreso.`,
    importError: 'El archivo no tiene el formato de progreso del Atlas.',
    cleared: 'Se borró el progreso.',
    exportFileName: 'atlas-progreso.json',
    masteredCount: (count: number) => `${count} dominados`,
  },

  home: {
    heading: 'Atlas de Data Science',
    intro:
      'Cada concepto de la ciencia de datos tiene una ficha con intuición, definición formal, un ejemplo resuelto y una visualización interactiva que muestra cómo funciona y cómo cambia con sus parámetros.',
    searchPlaceholder: 'Buscar un concepto, por ejemplo "teorema de Bayes"',
    stats: (concepts: number, modules: number) => `${concepts} conceptos en ${modules} módulos`,
    activeRoute: 'Ruta activa',
    nextConcept: 'Siguiente concepto',
    continueRoute: 'Continuar',
    routeCompleted: 'Todos los conceptos de esta ruta están dominados.',
    explore: 'Explorar',
    modulesCard: 'Módulos',
    modulesCardText: 'El temario completo organizado por áreas y submódulos.',
    routesCard: 'Rutas de aprendizaje',
    routesCardText: 'Secuencias de estudio por perfil, con el avance de cada una.',
    mapCard: 'Mapa del conocimiento',
    mapCardText: 'Todos los conceptos y sus prerrequisitos en un grafo navegable.',
    featured: 'Conceptos destacados',
  },

  modules: {
    title: 'Módulos',
    intro:
      'El Atlas recorre la ciencia de datos en dieciocho módulos, de los fundamentos matemáticos a los temas especializados.',
    moduleLabel: (numero: number) => `Módulo ${numero}`,
    conceptCount: (count: number) => (count === 1 ? '1 concepto' : `${count} conceptos`),
    submoduleCount: (count: number) => (count === 1 ? '1 submódulo' : `${count} submódulos`),
    seeAlso: 'También en este submódulo',
    notFound: 'No existe ese módulo.',
  },

  concept: {
    breadcrumbLabel: 'Ubicación',
    estimatedTime: (minutes: number) => `${minutes} min de estudio`,
    tags: 'Etiquetas',
    summary: 'Resumen',
    formula: 'Fórmula principal',
    contents: 'Contenido',
    prerequisites: 'Prerrequisitos',
    noPrerequisites: 'Este concepto no requiere otros conceptos del Atlas.',
    viewRoadmap: 'Ver ruta hacia este concepto',
    nextSteps: 'Siguientes pasos',
    noNextSteps: 'Ningún concepto publicado depende directamente de este.',
    related: 'Relacionados',
    references: 'Referencias',
    chapter: (chapter: string) => `capítulo ${chapter}`,
    previous: 'Anterior',
    next: 'Siguiente',
    notFound: 'No existe un concepto con ese identificador.',
    draft: 'Borrador: esta ficha no aparece en el sitio publicado.',
    visualization: 'Visualización',
    relationTypes: {
      relacionado: 'Relacionado',
      generaliza: 'Generaliza a',
      'caso-particular': 'Caso particular de',
      contrasta: 'Se contrasta con',
    },
  },

  search: {
    label: 'Buscar',
    open: 'Buscar conceptos',
    placeholder: 'Buscar conceptos',
    shortcutHint: 'Atajo de teclado',
    dialogLabel: 'Búsqueda de conceptos',
    noResults: (query: string) => `Sin resultados para "${query}".`,
    suggestions: 'Conceptos con nombre parecido',
    resultsTitle: 'Resultados de búsqueda',
    resultCount: (count: number) => (count === 1 ? '1 resultado' : `${count} resultados`),
    goToConcept: 'Abrir ficha',
    goToRoadmap: 'Ver ruta',
    allResults: 'Ver todos los resultados',
    filterModule: 'Módulo',
    filterLevel: 'Nivel',
    allModules: 'Todos los módulos',
    allLevels: 'Todos los niveles',
    emptyQuery: 'La búsqueda acepta nombres en español o en inglés, siglas y etiquetas.',
    navigationHint: 'Flechas para moverse, Enter para abrir, Alt+Enter para ver la ruta.',
  },

  roadmap: {
    title: (concept: string) => `Ruta hacia ${concept}`,
    intro:
      'Conceptos que conviene estudiar antes del objetivo, en un orden que respeta los prerrequisitos.',
    from: 'Desde',
    fromPlaceholder: 'Un concepto que ya conozco',
    fromNone: 'Desde el principio',
    hideMastered: 'Ocultar lo que ya domino',
    diagramView: 'Diagrama',
    listView: 'Lista',
    viewLabel: 'Vista',
    total: 'Conceptos',
    mastered: 'Dominados',
    estimate: 'Tiempo estimado',
    setActive: 'Fijar como ruta activa',
    activeNow: 'Es la ruta activa',
    clearActive: 'Quitar la ruta activa',
    share: 'Copiar enlace',
    copied: 'Enlace copiado',
    step: (index: number) => `Paso ${index}`,
    target: 'Objetivo',
    nothingLeft: 'Todos los conceptos previos están dominados. Solo queda el objetivo.',
    diagramLabel: 'Diagrama de prerrequisitos',
    zoomHint: 'Rueda o pellizco para acercar, arrastre para desplazar.',
  },

  routes: {
    title: 'Rutas de aprendizaje',
    intro:
      'Cada ruta reúne los conceptos de un perfil y los ordena respetando los prerrequisitos. El avance se calcula con los conceptos marcados como dominados.',
    conceptCount: (count: number) => (count === 1 ? '1 concepto' : `${count} conceptos`),
    progress: (percent: number) => `${percent} % dominado`,
    open: 'Ver ruta',
    notFound: 'No existe esa ruta.',
    profile: 'Perfil',
  },

  map: {
    title: 'Mapa del conocimiento',
    intro:
      'Cada punto es un concepto; las líneas unen prerrequisitos con los conceptos que los necesitan.',
    canvasLabel: 'Mapa interactivo de conceptos',
    conceptsView: 'Conceptos',
    modulesView: 'Por módulos',
    filters: 'Filtros',
    level: 'Nivel',
    status: 'Progreso',
    statusAll: 'Todos',
    statusPending: 'Pendientes',
    statusSeen: 'Vistos',
    statusMastered: 'Dominados',
    modules: 'Módulos',
    allModules: 'Todos',
    resetView: 'Restablecer vista',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    close: 'Cerrar panel',
    openConcept: 'Abrir ficha',
    openRoadmap: 'Ver ruta',
    dependents: (count: number) =>
      count === 1 ? '1 concepto depende de este' : `${count} conceptos dependen de este`,
    hint: 'Al pasar el cursor sobre un punto se resaltan sus conexiones; un clic abre su resumen.',
    empty: 'No hay conceptos que coincidan con los filtros.',
    textAlternative: 'Lista de conceptos visibles en el mapa',
    expandModule: (title: string) => `Ver conceptos de ${title}`,
  },

  glossary: {
    title: 'Glosario',
    intro: 'Índice alfabético de todos los conceptos con su resumen.',
    filter: 'Filtrar por nombre',
    count: (count: number) => (count === 1 ? '1 concepto' : `${count} conceptos`),
    lettersLabel: 'Letras',
  },

  notation: {
    title: 'Notación',
    intro: 'Convenciones que se usan de forma uniforme en todas las fichas del Atlas.',
    object: 'Objeto',
    symbol: 'Notación',
    note: 'Observación',
    conventions: 'Convenciones generales',
  },

  about: {
    title: 'Acerca del Atlas',
    whatHeading: 'Qué es',
    what: [
      'El Atlas de Data Science es una colección de fichas que explican los conceptos de una formación en ciencia de datos: fundamentos matemáticos, probabilidad, estadística, aprendizaje automático, aprendizaje profundo, procesos estocásticos, series temporales, inferencia causal y temas especializados.',
      'No es un curso de programación. Cada ficha explica qué es un concepto, por qué funciona, cómo se ve y cómo se comporta cuando cambian sus parámetros, con una visualización interactiva diseñada para ese concepto.',
    ],
    howHeading: 'Cómo usarlo',
    how: [
      'La búsqueda encuentra conceptos por nombre en español o en inglés, por siglas y por etiquetas, aunque se escriban sin acentos o con errores menores.',
      'Cada ficha muestra sus prerrequisitos directos. La vista de ruta calcula todo lo necesario para llegar a un concepto y lo ordena para su estudio.',
      'Las rutas de aprendizaje proponen secuencias completas por perfil, y el mapa muestra todas las conexiones del temario.',
      'Las marcas de visto y dominado se guardan en el navegador y permiten ocultar lo ya aprendido en las rutas.',
    ],
    bibliographyHeading: 'Bibliografía',
    licensesHeading: 'Licencias',
    licenses: [
      'El código fuente se distribuye bajo la licencia MIT.',
      'El contenido de las fichas se distribuye bajo la licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0).',
    ],
    privacyHeading: 'Privacidad',
    privacy:
      'El sitio no usa cookies, analítica ni servicios externos. Todo el contenido se sirve desde el propio sitio y el progreso nunca sale del navegador.',
    shortcutsHeading: 'Atajos de teclado',
    shortcuts: [
      ['Ctrl+K o /', 'Abrir la búsqueda'],
      ['Espacio', 'Reproducir o pausar la visualización con foco'],
      ['Flecha derecha', 'Avanzar un paso en la visualización'],
      ['R', 'Reiniciar la visualización'],
    ] as const,
  },

  viz: {
    play: 'Reproducir',
    pause: 'Pausar',
    step: 'Avanzar un paso',
    restart: 'Reiniciar',
    speed: 'Velocidad',
    seed: 'Semilla',
    newSeed: 'Nueva semilla',
    resetSeed: 'Restablecer semilla',
    parameters: 'Parámetros',
    readouts: 'Valores',
    resetParameters: 'Restablecer parámetros',
    downloadSvg: 'Descargar SVG',
    downloadPng: 'Descargar PNG',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    legend: 'Leyenda',
    dataTable: 'Ver los datos en una tabla',
    controls: 'Controles',
    playback: 'Reproducción',
    views: 'Vistas',
    computing: (percent: number) => `Calculando: ${percent} %`,
    keyboardHint:
      'Con la visualización enfocada: espacio reproduce o pausa, flecha derecha avanza un paso y R reinicia.',
    frameLabel: (title: string) => `Visualización interactiva: ${title}`,
    finished: 'Simulación terminada',
  },

  notFound: {
    title: 'Página no encontrada',
    body: 'La dirección no corresponde a ninguna página del Atlas. La búsqueda puede ayudar a encontrar el concepto.',
    home: 'Volver al inicio',
  },

  footer: {
    licenses: 'Código bajo licencia MIT. Contenido bajo licencia CC BY 4.0.',
    about: 'Acerca del Atlas',
  },

  time: {
    minutes: (minutes: number) => {
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const rest = minutes % 60;
      return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
    },
  },
} as const;
