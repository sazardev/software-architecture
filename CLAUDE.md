# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Sitio de recursos interactivos para arquitectos de software: SPA (Vite 8 + React 19 + TanStack Router)
con contenido en MDX bilingüe (es/en), prerender estático para SEO y PWA, desplegada en GitHub Pages.

**`AGENTS.md` es el estándar autoritativo del repo** (stack, reglas de código, frontmatter MDX,
auditoría, SEO, Definition of Done). Léelo antes de cambios no triviales; este archivo es solo el
mapa rápido y no lo reemplaza. Si cambias una regla, actualiza `AGENTS.md` en el mismo commit.

## Comandos

Solo **Bun** — `npm/yarn/pnpm/npx` están bloqueados por el harness de OpenCode; usa `bun` / `bunx`.

```bash
bun run dev                 # Vite dev server
bun run check               # format:check + lint + typecheck + audit + test + knip (obligatorio antes de push)
bun run build               # typecheck + vite build + tools/seo/postbuild.ts (HTML por ruta, OG, RSS)
bun run content:index       # regenera src/content/index.gen.json — tras CUALQUIER edición de contenido MDX
bun run audit               # valida contenido (frontmatter, enlaces, anclas, i18n) y rutas
bun run lint:fix            # eslint --fix
bun run format              # prettier --write .
```

Un solo test (Vitest, jsdom; incluye `src/**/*.test.{ts,tsx}` y `tools/**/*.test.ts`):

```bash
bunx vitest run src/lib/seo/page-heads.test.ts
bunx vitest run -t "nombre del test"
```

Hooks Husky: `pre-commit` (lint-staged), `commit-msg` (commitlint, Conventional Commits
`tipo(scope): descripción`), `pre-push` (audit + typecheck + test). No uses `--no-verify` ni force-push.

## Arquitectura (lo que exige leer varios archivos)

- **TypeScript con doble compilador.** `typescript` está aliaseado a `@typescript/typescript6` (solo API
  para ESLint) y el `tsc` real es `@typescript/native` (TS 7). No cambies esos aliases sin correr
  `bun run check` completo.
- **Archivos generados, no se editan a mano** (están commiteados y denegados en `opencode.json`):
  `src/routeTree.gen.ts` (TanStack Router plugin) y `src/content/index.gen.json` (`content:index`).
  `E-INDEX` falla la auditoría si el índice está desactualizado.
- **Pipeline de contenido.** `src/content/docs/<locale>/<slug>.mdx` → `tools/content/content-index.ts`
  → `index.gen.json` → alimenta `lib/content/registry.ts` (listados, prev/next), `lib/search/` (búsqueda
  local por idioma) y `tools/seo/plugin-static-seo.ts` (sitemap/robots). Slug idéntico entre idiomas;
  la taxonomía vive en `src/lib/content/taxonomy.json`. Los enlaces internos MDX se localizan en build
  con `tools/rehype-internal-links.ts`: escribe rutas absolutas (`/docs/<slug>#ancla`).
- **Capas de componentes** (aplicado por `import-x/no-restricted-paths` en `eslint.config.ts`):
  `atoms → molecules → organisms → templates`, cada una solo importa de las anteriores y de `lib`;
  `lib` es hoja; `app`/`routes`/`mdx` componen. Barriles `index.ts` por carpeta; componentes `PascalCase`,
  todo lo demás `kebab-case`; máx. 300 líneas por archivo; sin `any` ni `!`; clases con `cn()` + `cva`.
- **Rutas.** Todo bajo `src/routes/$locale/`; `/` redirige al idioma del navegador. Los textos de UI
  salen de `useMessages()` (`src/lib/i18n/messages/{es,en}.ts`; `en` debe satisfacer el tipo de `es`),
  nunca literales en componentes. En las opciones de ruta, **`loader` va antes de `head`** o la inferencia
  de `loaderData` colapsa a `never`. Query params se validan en `lib/*/*-params.ts` (`validateSearch`).
- **SEO con una sola fuente.** `src/lib/seo/page-heads.ts` (`homeSeo`, `docSeo`, …) lo consumen tanto las
  rutas (`toRouteHead()`) como el postbuild (`tools/seo/prerender.ts`, que escribe `dist/<locale>/…/index.html`
  con `data-prerender`, tarjetas OG con satori/resvg y feeds). `main.tsx` retira las etiquetas
  `data-prerender` antes de montar para que el router no duplique el `<head>`. `tools/seo/*` usa `tsconfig.build.json`.
- **Tema.** Clase `dark` en `<html>` (nunca `prefers-color-scheme` en CSS); la clave `sa:theme` de
  `localStorage` debe mantenerse en sync entre `THEME_STORAGE_KEY` y el script inline de `index.html`.
  Colores siempre por tokens (`src/styles/theme.css`) con su variante `dark:`.
- **Despliegue.** Push a `main` → `.github/workflows/deploy-pages.yml` corre `bun run check`, luego build con
  `VITE_BASE_PATH`/`VITE_SITE_URL` (base path `/software-architecture/` en Pages, `/` en local; copia
  `.env.example` → `.env.local` para `VITE_SITE_URL`).

## Al tocar contenido o rutas

Nuevo/editado MDX → `bun run content:index` y `bun run audit` (frontmatter validado con zod: título 3–60,
descripción 40–160, `category` existente en la taxonomía, ≥1 `h2`, sin saltos de nivel).
**Todo artículo nuevo declara su sección y su roadmap**: `category` (taxonomía) y
`roadmap: { id, stage, step }` según `src/lib/content/roadmaps.json`, idéntico en cada idioma
(`AGENTS.md` §6.1). Así aparece solo en `/<locale>/roadmap` y en su ruta guiada.
**Todo artículo nuevo exige su propia figura (FIG. NN)**: `src/lib/figures/designs/<slug>.ts` +
registro en `registry.ts` + `figureCaption` en cada idioma; previsualiza con
`bun tools/figures/preview.ts <slug> --og` (detalle en `AGENTS.md` §6). Nueva ruta →
archivo en `src/routes/$locale/` y `audit` verifica que el id de `createFileRoute()` coincida con el disco.
Nuevo idioma/sección: ver `AGENTS.md` §11.

## Harness OpenCode

`opencode.json` + `.opencode/plugin/rule-harness.js` bloquean mecánicamente: editar generados, `npm/yarn/pnpm/npx`,
`--no-verify`, force-push y commits no convencionales. Existen agentes (`strict-builder`, `rule-auditor`) y
comandos (`check`, `revisar`) en `.opencode/`.
