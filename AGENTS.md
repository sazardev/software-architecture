# Software Architecture — Estándar del repositorio

Guía única de reglas, convenciones y flujos. Todo lo que no esté aquí permitido, se acuerda
antes de introducirlo. Las reglas se hacen cumplir con herramientas (`bun run check`), no con
buena voluntad.

## 1. Stack

| Área       | Elección                                                                           |
| ---------- | ---------------------------------------------------------------------------------- |
| Runtime/PM | **Bun** (scripts, tooling de contenido, auditoría)                                 |
| Bundler    | **Vite 8** (Rolldown) + React Compiler                                             |
| UI         | **React 19** + **Tailwind CSS 4** (CSS-first, tokens en `src/styles/theme.css`)    |
| Tipografía | **@fontsource-variable** (Fraunces, Newsreader, Instrument Sans, JetBrains Mono)   |
| Tipos      | **TypeScript 7 nativo** (`tsc`) para chequeo · TS 6 API solo para ESLint (aliases) |
| Rutas      | **TanStack Router** (file-based, `autoCodeSplitting`, search params validados)     |
| Datos      | **TanStack Query** (caché) · contenido vía índice generado                         |
| Contenido  | **MDX** + Shiki + Mermaid + frontmatter tipado                                     |
| Calidad    | ESLint 10 (type-checked) · Prettier · knip · Vitest · auditoría propia             |
| Git        | Husky + lint-staged + commitlint (Conventional Commits)                            |

> `typescript` está aliaseado a `@typescript/typescript6` (API para ESLint) y el compilador
> nativo vive en `@typescript/native` (bin `tsc`). No cambies esos aliases sin actualizar el
> `check` completo.

## 2. Comandos

```bash
bun run dev            # servidor de desarrollo
bun run build          # typecheck + vite build + postbuild SEO (HTML por ruta, OG, feeds)
bun run preview        # servir el build
bun run check          # format + lint + types + audit + tests + knip (obligatorio antes de push)
bun run audit          # audita contenido y rutas
bun run indexnow       # envía el sitemap del build a IndexNow (Bing/Yandex/Seznam)
bun run content:index  # regenera src/content/index.gen.json tras editar contenido
bun run test           # Vitest (unit)
bun run test:coverage  # cobertura v8
bun run analyze        # knip (archivos/deps/exports muertos)
bun run analyze:bundle # build + reports/bundle.html
```

Hooks: `pre-commit` (lint-staged), `commit-msg` (commitlint), `pre-push` (audit + types + tests).
Commits: `tipo(scope): descripción` — tipos: feat, fix, docs, style, refactor, perf, test,
build, ci, chore, revert.

## 3. Estructura

```
src/
  app/         # composición: providers y router
  routes/      # rutas file-based (páginas finas, sin lógica de negocio)
  components/  # atomic design: atoms → molecules → organisms → templates (con barriles)
  lib/
    config/    # site, nav (constantes tipadas)
    content/   # taxonomía, tipos, registry (índice generado)
    i18n/      # locales.json, mensajes tipados (es/en), provider y hooks
    theme/     # preferencias de tema (claro/oscuro/sistema), provider y hooks
    search/    # motor de búsqueda, sintaxis y items de la paleta de comandos, provider y atajos
    seo/       # URLs absolutas, meta builders, JSON-LD
    utils/     # utilidades puras (cn, format-date…)
  mdx/         # provider + mapa de componentes disponibles en MDX
  content/     # docs/<locale>/*.mdx + taxonomy + index.gen.json (generado)
  styles/      # entry de Tailwind, tokens (@theme), prose
tools/         # tooling Bun: auditoría, indexación, SEO postbuild (no va al bundle)
               # tools/seo/{article-*,indexnow,postbuild,prerender,feed,llms,og-card}.ts usan tsconfig.build.json
```

Reglas de dependencia (aplicadas por `import-x/no-restricted-paths` en `eslint.config.ts`):

- `atoms` → solo `atoms` y `lib`
- `molecules` → `atoms`, `molecules`, `lib`
- `organisms` → hasta `molecules` + `lib`
- `templates` → hasta `organisms` + `lib`
- `components` nunca importa `features`, `mdx`, `app` ni `routes`
- `lib` es hoja: no importa capas superiores
- `app`/`routes`/`mdx` componen todo lo anterior

## 4. Reglas de código

- **Un archivo, una responsabilidad.** Funciones pequeñas; máximo 300 líneas por archivo y
  complejidad cognitiva ≤ 15 (lo vigilan `max-lines` y `sonarjs/cognitive-complexity`).
- **Barriles**: cada carpeta exporta por `index.ts`; importa siempre por el barril de capa.
- **Nombres**: componentes `PascalCase` (archivo = componente); todo lo demás `kebab-case`
  (check-file lo hace cumplir). Hooks: `use-*.ts`.
- **Imports**: grupos ordenados (builtin → external → `@/` → parent → sibling) con línea en
  blanco entre grupos; alias `@/` siempre; prohibido `../../../*`.
- **Tipado estricto**: sin `any` (usa `unknown` + narrowing), sin `!` non-null, `type` sobre
  `interface` (excepción: augmentación de `Register` en `src/app/router.tsx`).
- **Clases CSS**: siempre con `cn()` + variantes `cva` (nunca concatenación de strings); todo
  color con tokens y su variante `dark:` correspondiente.
- Los generados (`src/routeTree.gen.ts`, `src/content/index.gen.json`) **no se editan a mano**
  y se commitean para que el typecheck funcione en un clon limpio.

## 5. Rutas

- `src/routes` es la fuente de verdad. `tools/routes/audit-routes.ts` verifica que el id de
  `createFileRoute()` coincida con la ubicación en disco (`__root.tsx` usa `createRootRoute`).
- Convenciones: `index.tsx` representa al directorio (`/docs/`), `$param.tsx` params dinámicos.
- ⚠️ **`loader` antes de `head`** en las opciones de la ruta. Si `head` va antes, la inferencia
  de `loaderData` colapsa a `never` (limitación actual del router).
- **Query params**: todo param se valida y normaliza en `lib/*/**-params.ts`
  (`validateSearch`). Los tipos usan `clave?: string | undefined` para convivir con
  `exactOptionalPropertyTypes`. La URL es el estado de los filtros de listados (compartibles).
- **SEO**: cada ruta construye su head con `buildPageHead()` (title, description, canonical,
  alternates `hreflang` + `x-default`, OG/Twitter con `og:locale`). Añade JSON-LD
  (`articleJsonLd`, `breadcrumbJsonLd`) cuando el contenido lo justifique. No hay página de
  búsqueda: la búsqueda es la paleta de comandos (§7).
- **i18n en rutas**: las páginas viven bajo `/$locale/...` (`/es/...`, `/en/...`); `/` redirige
  al idioma preferido del navegador. El layout `$locale.tsx` valida el idioma, provee el
  contexto (`LocaleProvider`) y actualiza `<html lang>`. Nunca escribas textos de UI en un
  componente: usa `useMessages()`. `resolveLocaleParam()` convierte el param (string) al tipo
  `Locale` en heads y componentes.
- 404: `notFoundComponent` (root o por ruta) con `NotFoundPage`.

## 6. Contenido MDX

Un documento = un archivo `src/content/docs/<locale>/<slug>.mdx` (slug kebab-case = nombre del
archivo, idéntico entre idiomas). Cada idioma de `locales.json` debe tener su mismo set de
slugs (la auditoría avisa con `W-TRANSLATION` si falta una traducción).

Frontmatter obligatorio (validado con zod en la auditoría):

| Campo           | Regla                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------ |
| `title`         | 3–60 caracteres                                                                            |
| `description`   | 40–160 caracteres (se usa en SEO y búsqueda)                                               |
| `category`      | id existente en `src/lib/content/taxonomy.json` (`labels` por idioma)                      |
| `tags`          | hasta 5, kebab-case, únicos                                                                |
| `publishedAt`   | `YYYY-MM-DD`, ≤ `updatedAt`; ordena «lo último» de la portada y el RSS                     |
| `order`         | entero ≥ 0 (orden dentro de la sección)                                                    |
| `figureCaption` | 12–90 caracteres: pie de la figura del artículo («FIG. NN — …») y alt de la tarjeta social |
| `updatedAt`     | `YYYY-MM-DD`, no puede ser futuro                                                          |

**Cada artículo tiene su propia figura (obligatorio).** Es el equivalente del «FIG. 01» de la
portada: un plano elegante y animado que aparece en la cabecera del artículo y viaja en la
tarjeta social. Al crear un artículo nuevo:

1. Dibuja la figura en `src/lib/figures/designs/<slug>.ts` (exporta una función que devuelve
   `Figure`) y regístrala en `src/lib/figures/registry.ts`. Una figura por slug: no se reutilizan.
2. Añade `figureCaption` al frontmatter de **cada idioma**.
3. Comprueba el dibujo con `bun tools/figures/preview.ts <slug>` (PNG en `reports/figures/`) y la
   tarjeta completa con `--og`.

Cómo se dibuja (`src/lib/figures/`): lienzo fijo 640×400 y una lista de primitivas de datos
(`path`, `rect`, `circle`, `text`, `group`) construidas con `figure-kit.ts` (flechas, cotas,
nodos, pulsos) y `figure-shapes.ts` (losas/cubos isométricos, polígonos, curvas). Los colores son
tonos semánticos (`ink`, `muted`, `brandSoft`, `accent`…), nunca valores literales: en pantalla
se traducen a tokens con `dark:` (`components/molecules/ArticleFigure`) y en la tarjeta social a
la paleta de papel y tinta (`figure-palette.ts`). Mismo lenguaje que la portada: trazo de tinta,
rellenos suaves, **un solo acento brasa** para la idea clave, etiquetas mono cortas y
neutrales respecto al idioma, movimiento sutil (`flow`, `pulse`, `rise`; los periodos de guiones
animados deben dividir 24, p. ej. `'5 7'` o `'0.1 11.9'`). La auditoría falla si falta la figura
(`E-FIGURE-MISSING`) o su pie (`E-FIGURE-CAPTION`) y un test comprueba que cada figura es única y
cabe en el lienzo.

Reglas de cuerpo: al menos un `h2`, sin saltos de nivel (h2 → h4), anclas únicas, enlaces
internos `/docs/<slug>#ancla` existentes, bloques de código cerrados.

**Código en los artículos: guía, no receta.** Los documentos explican decisiones, arquitectura y
el porqué; no son para copiar y pegar. El código solo muestra cómo **nombrar, ubicar y
organizar**: firmas y tipos sin cuerpo (`// …`), árboles de carpetas, convenciones de nombres,
la forma de una configuración o plantilla. Nunca implementaciones, lógica de funciones ni tests
completos. Bloques de ≤ 15 líneas y, como referencia, ≤ 40 líneas de código por artículo
(sin contar ` ```mermaid `). Lo que antes iría en código se explica en prosa, tabla o diagrama.

Disponible sin importar dentro de MDX: `<Callout>`, `<InteractiveMap>`, bloques ` ```mermaid `
(se convierten en diagramas interactivos lazy). Los componentes del sistema de diseño se añaden
en `src/mdx/mdx-components.tsx`.

### Mapas interactivos

- `<InteractiveMap center zoom markers>` (MapLibre GL) embebible en MDX; se registra con
  `lazy()` en `src/mdx/mdx-components.tsx`, así el chunk (JS + CSS de MapLibre) solo se
  descarga en páginas con mapas (y queda precacheado por la PWA).
- Estilos libres sin API key: OpenFreeMap (`positron` claro / `dark` oscuro) que cambian con el
  tema global; la atribución viene incluida en el estilo.
- Props tipadas y marcadores con popup en `src/components/organisms/InteractiveMap`.

### Pipeline de contenido (Bun)

```
src/content/docs/<locale>/*.mdx
      │  bun run content:index   (tools/content/content-index.ts)
      ▼
src/content/index.gen.json  (commiteado, incluye locale)
      │
      ├─→ src/lib/content/registry.ts   (registro tipado, filtrado por idioma)
      └─→ src/lib/search/search.ts      (búsqueda local por idioma)
      └─→ tools/seo/plugin-static-seo.ts (sitemap.xml con hreflang + robots.txt en build)
```

Tras editar o crear contenido: `bun run content:index` y `bun run audit`.

Los enlaces internos de MDX (`/docs/...`, `/`) se localizan automáticamente en build
(`tools/rehype-internal-links.ts`): prefija base path del hosting + idioma del archivo. Escribe
siempre rutas absolutas y anclas del idioma correspondiente.

### Mensajes de UI (i18n)

- Diccionarios tipados en `src/lib/i18n/messages/{es,en}.ts`; `en.ts` satisface el tipo derivado
  de `es.ts` (si añades una clave en `es`, el `check` exige la traducción en `en`).
- En componentes: `useMessages()` (reactivo al idioma actual) y `useLocale()`.
- Idiomas en `src/lib/i18n/locales.json` (código, etiqueta, `ogLocale`); añadir uno nuevo =
  crear `messages/<code>.ts` + carpeta `content/docs/<code>/` (la auditoría lo exige).

### Responsive y móvil

- Mobile-first: estilos base para 360–390 px y mejoras con `sm:` / `md:` / `lg:` (640 / 768 /
  1024). Toda sección nueva debe verificarse a 390 px sin overflow horizontal.
- Header en dos filas en móvil (marca + selectores arriba, navegación debajo) y una sola fila
  desde `md` (`SiteShell`).
- Los bloques de código y diagramas Mermaid hacen scroll interno (`.shiki`, `.mermaid-diagram`),
  nunca la página: verifica `document.documentElement.scrollWidth <= window.innerWidth`.
- En punteros táctiles (`pointer: coarse`) se ocultan los atajos de teclado (pie de la paleta de
  comandos); ningún input toma el foco al cargar la página, solo al abrir la paleta a propósito.
- El índice del documento (TOC) es colapsable (`<details>`) en móvil y fijo en `lg+`.

### Sistema visual ("Tinta y brasa")

- Paleta en `src/styles/theme.css`: `neutral-*` sobrescrito con grises cálidos (papel/tinta),
  `brand-*` azul de plano (interactivo) y `accent-*` brasa (detalles con alma). Siempre
  tokens, nunca colores literales; cada color lleva su variante `dark:`.
- Tipografía autoalojada con `@fontsource-variable` (offline vía PWA, solo subset `latin`):
  `font-display` (Fraunces) para títulos, `font-serif` (Newsreader) para lectura y párrafos
  de apoyo, `font-sans` (Instrument Sans) para UI y `font-mono` (JetBrains Mono) para código.
- Lectura: el cuerpo de los artículos vive en `.prose` (`src/styles/prose.css`, medida ~68ch,
  capitular, anclas, tablas con scroll). El `<h1>` del MDX se oculta: el título lo pinta
  `DocHeader` desde el frontmatter.
- Movimiento: animaciones CSS (`animate-rise`, `animate-draw`…) y el atom `Reveal` para
  aparecer al hacer scroll; todo respeta `prefers-reduced-motion` (regla global en
  `src/styles/index.css`).
- Lenguaje de plano (blueprint), sin degradados ni halos desenfocados: retícula `bp-grid`
  (papel cuadriculado, patrón SVG), panel cianotipo `bp-panel`, `BlueprintFrame` (marcas de
  registro `+` en las esquinas), `TitleBlock` (cajetín de hoja/escala/revisión), cotas en
  `Eyebrow` y tipografía mono para metadatos. Las tarjetas son planas (borde, sin sombra).
- Layout: páginas envuelven su contenido en el atom `Container` (`narrow`/`reading`/`wide`);
  `SiteShell` ya no limita el ancho de `main` para permitir secciones a sangre.

### Tema global (claro/oscuro/sistema)

- Núcleo en `src/lib/theme/` (tipos, resolución y `ThemeProvider` montado en `__root`).
- La preferencia se persiste en `localStorage` con la clave `sa:theme`; el script inline de
  `index.html` la aplica antes del primer pintado (anti-FOUC) y **debe mantenerse en sync**
  con `THEME_STORAGE_KEY`.
- El tema efectivo se aplica como clase `dark` en `<html>` (la variante `dark:` de Tailwind 4
  depende de `.dark`); nunca uses `prefers-color-scheme` directamente en CSS.
- Todo color nuevo usa tokens y su variante `dark:`; Shiki y Mermaid reaccionan a la clase.
- El selector del header (`ThemeSwitcher`) cicla claro → oscuro → sistema y es bilingüe.

## 7. Búsqueda e indexación

- El índice incluye slug, título, descripción, categoría, tags, headings, minutos de lectura y
  ruta. Es la única fuente para listados, vecinos (prev/next) y búsqueda.
- Búsqueda: normaliza acentos, puntúa título (8) > tags (6) > headings (5) > slug (4) > descripción
  (3), exige que todos los tokens coincidan y devuelve el heading para enlazar
  `/docs/<slug>#<ancla>`.
- **Paleta de comandos** (`CommandPalette`, montada en `SiteShell`; estado y atajos en
  `lib/search/palette-provider.tsx`): `Ctrl/⌘ + K` alterna y `/` abre (salvo escribiendo en un
  campo). Es un `<dialog>` modal nativo con patrón combobox/listbox accesible. Abre desde
  cualquier sitio con `useCommandPalette().open(consultaInicial?)` (p. ej. las etiquetas abren
  `#etiqueta`). Sintaxis: texto libre + `#etiqueta` (filtra por etiqueta, sugiere al escribir).
  Los grupos (documentos, temas, etiquetas, navegación, ajustes) salen de `palette-items.ts` a
  partir del contenido y la taxonomía: nada que mantener a mano al añadir artículos.
- La paleta es estado efímero de UI y no vive en la URL; los filtros de `/<locale>/docs?category=`
  sí. La búsqueda filtra por `locale`: cada idioma indexa solo sus documentos.

## 8. SEO y compartir

Todo el SEO sale del contenido: no hay que tocar nada al añadir artículos o temas.

- **Una sola fuente**: `src/lib/seo/page-heads.ts` (`homeSeo`, `docsIndexSeo`, `docSeo`,
  ) devuelve cabecera + JSON-LD + texto `<noscript>`. Las rutas lo usan con
  `toRouteHead()` y el postbuild con el mismo código, así cliente y HTML estático coinciden.
  `buildPageHead()` (`meta.ts`) pone canonical, `hreflang` (solo idiomas donde existe la
  página) + `x-default`, robots (`max-image-preview:large`), OG/Twitter (`summary_large_image`),
  imagen con alt/tamaño, `article:*` y el feed RSS.
- **JSON-LD** (`json-ld.ts`): `WebSite` (portada), `CollectionPage` + `BreadcrumbList`
  (índice), `TechArticle` + `BreadcrumbList` (artículos, con `datePublished`/`dateModified`,
  imagen, sección, palabras clave y `publisher`).
- **Postbuild** (`bun tools/seo/postbuild.ts`, encadenado a `bun run build`):
  - HTML estático por ruta (`dist/<locale>/…/index.html`, también `/`) con el `<head>` SEO
    ya inyectado: los crawlers sociales no ejecutan JS y GitHub Pages responde 200 en
    enlaces profundos. Las etiquetas llevan `data-prerender` y `main.tsx` las retira antes de
    montar para que el router no duplique el `<head>`. Los artículos añaden su texto completo
    dentro de `<noscript>` (párrafos, listas, tablas, código y enlaces localizados) con
    `tools/seo/article-*.ts`, para que los crawlers sin JavaScript —incluidos los de
    IA— lean el contenido.
  - Tarjetas sociales 1200×630 por artículo e idioma (`dist/og/<locale>/<slug>.png`) con
    satori + resvg: estilo plano, cajetín y tipografías del sitio. Fuentes `@fontsource/*`.
    Los artículos incluyen su **figura (FIG. NN)** con marco de registro, pie y cajetín; el
    texto de la figura se convierte a trazados con satori (`og-figure-text.ts`) porque resvg no
    carga las fuentes. `figureCaption` es el `og:image:alt` y el `caption` del `ImageObject` JSON-LD.
  - Feeds RSS por idioma (`/<locale>/feed.xml`).
  - Índices para LLMs (`tools/seo/llms.ts`): `llms.txt` (raíz, descubre idiomas y feeds),
    `/<locale>/llms.txt` (índice curado por sección) y `/<locale>/llms-full.txt` (texto
    completo de todos los artículos con encabezados anclados).
- `robots.txt` declara bienvenidos a los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot…)
  y `bun run indexnow` (tras el build) notifica sitemap a Bing/Yandex/Seznam; el workflow
  lo intenta en cada deploy (`continue-on-error`).
- `sitemap.xml`/`robots.txt` (`plugin-static-seo`): hreflang y `lastmod`.
- `VITE_SITE_URL` define todas las URLs absolutas (copia `.env.example` → `.env.local`).
- Identidad: favicon e iconos PWA (`public/favicon.svg`, `public/icons/*.svg`, PNG con
  `bun run icons:generate`) usan la marca de capas con núcleo brasa; `theme-color` `#171512`.
- Textos de marketing en `messages/*.ts` (`site.description`, `site.tagline`); el título de la
  portada es `Nombre — eslogan`.

### Experiencia de lectura

- Rejilla central (`lib/ui/reading-layout.ts`): cabecera y artículo comparten eje (46rem);
  margen izquierdo = acciones de compartir, derecho = índice.
- Índice "En esta página": marcas mínimas en el margen que se despliegan al pasar el cursor o
  enfocar (estilo Notion); en móvil es un bloque plegable. Resalta la sección activa.
- Selección de texto: `SelectionToolbar` ofrece copiar, copiar como cita, enlace al
  fragmento (`#:~:text=`), compartir y comentar (abre un issue de GitHub con la cita).
- Compartir: `ShareActions` (copiar enlace, hoja nativa, X, LinkedIn, correo); el "#" de los
  encabezados copia su enlace; avisos con `Toaster`. "Editar en GitHub" al final del artículo.

## 9. Auditoría (`bun run audit`)

| Código                        | Nivel   | Regla                                                     |
| ----------------------------- | ------- | --------------------------------------------------------- |
| E-FRONTMATTER                 | error   | frontmatter inválido (zod)                                |
| E-SLUG / E-CATEGORY           | error   | slug kebab / categoría existente                          |
| E-TITLE / E-DESCRIPTION       | error   | longitudes SEO                                            |
| E-UPDATED-AT                  | error   | fecha ISO válida y no futura                              |
| E-HEADINGS / -UNIQUE / -LEVEL | error   | estructura de encabezados                                 |
| E-LINK / E-ANCHOR             | error   | enlaces internos y anclas existentes                      |
| E-INDEX                       | error   | `index.gen.json` actualizado                              |
| E-FIGURE-MISSING / -REGISTRY  | error   | cada artículo tiene diseño `designs/<slug>.ts` registrado |
| E-FIGURE-CAPTION              | error   | `figureCaption` de 12–90 caracteres                       |
| W-FIGURE-ORPHAN               | warning | diseño de figura sin artículo                             |
| E-TAXONOMY-ID / -ORDER        | error   | ids y órdenes de sección únicos                           |
| E-TAXONOMY-LABELS             | error   | cada sección tiene label/description por idioma           |
| E-LOCALE / E-LOCALE-MESSAGES  | error   | carpeta de idioma y diccionario de mensajes               |
| E-ROUTE-*                     | error   | rutas: id ↔ archivo, root correcto                        |
| W-FENCE / W-ROUTE-DEFAULT     | warning | bloques sin cerrar / `export default` en rutas            |
| W-TRANSLATION                 | warning | falta la traducción de un documento                       |

Añadir reglas: crea una función en `tools/content/audit-*.ts` (o `tools/routes/`) que devuelva
`Issue[]` y enlázala en `tools/audit.ts`. Los errores bloquean `check` y el push.

## 10. Definition of Done

1. `bun run content:index` si tocaste contenido (índice commiteado).
2. `bun run check` en verde (format, lint, tipos, auditoría, tests, knip).
3. Sin regresiones de arquitectura: componentes en su capa, lógica en `lib`, rutas finas.
4. Commits convencionales y hooks pasando.

## 11. Flexibilidad

- **Nueva sección (tema)**: añade la entrada en `src/lib/content/taxonomy.json` (id, label y
  description por idioma, order y, opcional, `icon` de `SectionGlyph`) y usa ese `category`
  en el frontmatter. Nada más: portada (rejilla de temas, máx. 6 + "ver todos"), índice lateral
  de `/docs`, filtros, pie, conteos, cajetín y etiquetas se generan desde el contenido. Sin
  `icon`, el glifo se deriva del id; para uno nuevo, añádelo al mapa de `SectionGlyph`.
- **Nuevo artículo**: MDX en cada idioma + su figura propia y `figureCaption` (§6); sin figura no
  pasa la auditoría.
- **Nuevo componente**: crea la carpeta en la capa correcta con `Componente.tsx` + `index.ts`
  y expórtalo en el barril de la capa. Si es usable en MDX, mapea en `src/mdx/mdx-components.tsx`.
- **Nueva ruta**: crea el archivo en `src/routes/$locale/` (la auditoría verifica la coherencia).
- **Nuevo idioma**: añade la entrada en `src/lib/i18n/locales.json`, crea
  `src/lib/i18n/messages/<code>.ts` (copia `es.ts` y traduce), traduce la taxonomía y los docs
  en `src/content/docs/<code>/`, y ejecuta `bun run content:index` + `bun run check`.
- **Nuevo check**: ver §9. Si cambias una regla, actualiza este documento en el mismo commit.

### PWA y cache offline

- `vite-plugin-pwa` (Workbox) con `registerType: autoUpdate`: precache completo del build
  (js/css/html/svg/png/json) y fallback de navegación SPA (`index.html`), así el sitio funciona
  offline, incluidos los deeplinks.
- Iconos: fuentes SVG en `public/icons/` y PNG generados con `bun run icons:generate`
  (requiere `rsvg-convert`); los PNG se commitean.
- Manifest en español por defecto (`lang: es`) con `start_url`/`scope` relativos (compatibles
  con el base path de Pages).
- Tras tocar manifest o iconos: rebuild y verifica `dist/sw.js` y `dist/manifest.webmanifest`.

## 12. Despliegue (GitHub Pages)

- Repositorio público: `https://github.com/sazardev/software-architecture`.
- Sitio: `https://sazardev.github.io/software-architecture/` (Pages con Actions, no rama
  `gh-pages`).
- Workflow: `.github/workflows/deploy-pages.yml` en cada push a `main`; corre `bun run check`
  como quality gate, compila con `VITE_BASE_PATH` y `VITE_SITE_URL` derivados de
  `actions/configure-pages`, y publica `dist/`.
- El build local usa `base: '/'`; en Pages el base path es `/software-architecture/` y el router
  lo toma de `import.meta.env.BASE_URL` (`basepath` en `src/app/router.tsx`).
- SPA en Pages: el plugin `static-seo` copia `index.html` a `404.html` (fallback de rutas
  profundas) y genera `.nojekyll`, `sitemap.xml` y `robots.txt`.
- Limitación conocida: GitHub Pages responde HTTP 404 (aunque renderiza la app) en deeplinks
  directos. Inicio y `/docs` son indexables; si se necesita SEO perfecto en rutas profundas,
  añadir prerender/SSG (p. ej. `vite-plugin-prerender` o mover el hosting a uno con rewrites).
- Sin secretos: todo se configura con variables `VITE_*` en el workflow. Para un dominio propio,
  añade `public/CNAME` y actualiza `VITE_SITE_URL` (ver §8).

## 13. Harness de agentes (OpenCode)

El cumplimiento se refuerza mecánicamente, no con buena voluntad:

- `opencode.json`: inyecta este documento en toda sesión (`instructions`), deniega la
  edición de generados y bloquea `npm/yarn/pnpm/npx`, `--no-verify` y `--force` en bash.
- `.opencode/plugin/rule-harness.js`: aborta (throw en `tool.execute.before`) ediciones a
  generados y comandos prohibidos, indicando el motivo y la alternativa correcta.
- `.opencode/agents/strict-builder.md`: implementador que obedece este documento y exige
  `bun run check` en verde. `.opencode/agents/rule-auditor.md`: revisor read-only
  (`edit: deny`) que audita diffs y dictamina APTO/NO APTO.
- `.opencode/command/check.md` y `revisar.md`: atajos de verificación y auditoría.

Tras cambiar cualquier pieza del harness, reinicia OpenCode (la config se carga al
arrancar) y valida con `bun run check`.
