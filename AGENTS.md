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
bun run build          # typecheck + build de producción (sitemap/robots incluidos)
bun run preview        # servir el build
bun run check          # format + lint + types + audit + tests + knip (obligatorio antes de push)
bun run audit          # audita contenido y rutas
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
    search/    # motor de búsqueda, params de URL, hook de búsqueda diferida
    seo/       # URLs absolutas, meta builders, JSON-LD
    utils/     # utilidades puras (cn, format-date…)
  mdx/         # provider + mapa de componentes disponibles en MDX
  content/     # docs .mdx + taxonomy + index.gen.json (generado)
  styles/      # entry de Tailwind, tokens (@theme), prose
tools/         # tooling Bun: auditoría, indexación, plugins de build (no va al bundle)
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
- **Clases CSS**: siempre con `cn()` + variantes `cva` (nunca concatenación de strings).
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
  `exactOptionalPropertyTypes`. La URL es el estado: filtros y búsquedas son compartibles.
- **SEO**: cada ruta construye su head con `buildPageHead()` (title, description, canonical,
  OG/Twitter). Añade JSON-LD (`articleJsonLd`, `breadcrumbJsonLd`) cuando el contenido lo
  justifique. `/search` es `noindex`.
- 404: `notFoundComponent` (root o por ruta) con `NotFoundPage`.

## 6. Contenido MDX

Un documento = un archivo `src/content/docs/<slug>.mdx` (slug kebab-case = nombre del archivo).

Frontmatter obligatorio (validado con zod en la auditoría):

| Campo         | Regla                                           |
| ------------- | ----------------------------------------------- |
| `title`       | 3–60 caracteres                                 |
| `description` | 40–160 caracteres (se usa en SEO y búsqueda)    |
| `category`    | id existente en `src/lib/content/taxonomy.json` |
| `tags`        | hasta 5, kebab-case, únicos                     |
| `order`       | entero ≥ 0 (orden dentro de la sección)         |
| `updatedAt`   | `YYYY-MM-DD`, no puede ser futuro               |

Reglas de cuerpo: al menos un `h2`, sin saltos de nivel (h2 → h4), anclas únicas, enlaces
internos `/docs/<slug>#ancla` existentes, bloques de código cerrados.

Disponible sin importar dentro de MDX: `<Callout>`, bloques ` ```mermaid ` (se convierten
en diagramas interactivos lazy). Los componentes del sistema de diseño se añaden en
`src/mdx/mdx-components.tsx`.

### Pipeline de contenido (Bun)

```
src/content/docs/*.mdx
      │  bun run content:index   (tools/content/content-index.ts)
      ▼
src/content/index.gen.json  (commiteado)
      │
      ├─→ src/lib/content/registry.ts   (registro tipado)
      └─→ src/lib/search/search.ts      (búsqueda local)
      └─→ tools/seo/plugin-static-seo.ts (sitemap.xml + robots.txt en build)
```

Tras editar o crear contenido: `bun run content:index` y `bun run audit`.

Los enlaces internos de MDX (`/docs/...`, `/search`, `/`) se prefijan automáticamente con el
base path del hosting en build (`tools/rehype-base-links.ts`); escribe siempre rutas absolutas.

## 7. Búsqueda e indexación

- El índice incluye slug, título, descripción, categoría, tags, headings, minutos de lectura y
  ruta. Es la única fuente para listados, vecinos (prev/next) y búsqueda.
- Búsqueda: normaliza acentos, puntúa título (8) > tags (6) > headings (5) > slug (4) > descripción
  (3), exige que todos los tokens coincidan y devuelve el heading para enlazar
  `/docs/<slug>#<ancla>`.
- Estado en URL: `/search?q=&tag=&category=`, `/docs?category=`. Nunca estado oculto.

## 8. SEO

- `buildPageHead()` en `src/lib/seo/meta.ts`: canonical absoluto, OG y Twitter.
- JSON-LD: `websiteJsonLd` (root), `articleJsonLd` + `breadcrumbJsonLd` (docs).
- `sitemap.xml` y `robots.txt` se generan en el build desde el índice + `VITE_SITE_URL`
  (copia `.env.example` → `.env.local`). `/search` queda fuera del sitemap y bloqueada en robots.

## 9. Auditoría (`bun run audit`)

| Código                        | Nivel   | Regla                                          |
| ----------------------------- | ------- | ---------------------------------------------- |
| E-FRONTMATTER                 | error   | frontmatter inválido (zod)                     |
| E-SLUG / E-CATEGORY           | error   | slug kebab / categoría existente               |
| E-TITLE / E-DESCRIPTION       | error   | longitudes SEO                                 |
| E-UPDATED-AT                  | error   | fecha ISO válida y no futura                   |
| E-HEADINGS / -UNIQUE / -LEVEL | error   | estructura de encabezados                      |
| E-LINK / E-ANCHOR             | error   | enlaces internos y anclas existentes           |
| E-INDEX                       | error   | `index.gen.json` actualizado                   |
| E-TAXONOMY-ID / -ORDER        | error   | ids y órdenes de sección únicos                |
| E-ROUTE-*                     | error   | rutas: id ↔ archivo, root correcto             |
| W-FENCE / W-ROUTE-DEFAULT     | warning | bloques sin cerrar / `export default` en rutas |

Añadir reglas: crea una función en `tools/content/audit-*.ts` (o `tools/routes/`) que devuelva
`Issue[]` y enlázala en `tools/audit.ts`. Los errores bloquean `check` y el push.

## 10. Definition of Done

1. `bun run content:index` si tocaste contenido (índice commiteado).
2. `bun run check` en verde (format, lint, tipos, auditoría, tests, knip).
3. Sin regresiones de arquitectura: componentes en su capa, lógica en `lib`, rutas finas.
4. Commits convencionales y hooks pasando.

## 11. Flexibilidad

- **Nueva sección**: añade la entrada en `src/lib/content/taxonomy.json` (id, label,
  description, order) y usa ese `category` en el frontmatter.
- **Nuevo componente**: crea la carpeta en la capa correcta con `Componente.tsx` + `index.ts`
  y expórtalo en el barril de la capa. Si es usable en MDX, mapea en `src/mdx/mdx-components.tsx`.
- **Nueva ruta**: crea el archivo en `src/routes/` (la auditoría verifica la coherencia).
- **Nuevo check**: ver §9. Si cambias una regla, actualiza este documento en el mismo commit.

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
