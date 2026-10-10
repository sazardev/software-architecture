import { join } from 'node:path';

import { Glob } from 'bun';

import type { Issue } from '../report';

const routesDir = join(import.meta.dir, '..', '..', 'src', 'routes');

function expectedRouteId(relativeFile: string): string {
  const segments = relativeFile.replace(/\.tsx$/, '').split('/');

  if (segments.at(-1) === 'index') {
    segments.pop();
  }

  return segments.length === 0 ? '/' : `/${segments.join('/')}`;
}

function normalizeRouteId(id: string): string {
  return id.length > 1 ? id.replace(/\/+$/, '') : id;
}

export async function auditRoutes(): Promise<Issue[]> {
  const issues: Issue[] = [];
  const glob = new Glob('**/*.tsx');

  for await (const file of glob.scan(routesDir)) {
    const relativeFile = `src/routes/${file}`;
    const source = await Bun.file(join(routesDir, file)).text();

    if (file === '__root.tsx') {
      if (!source.includes('createRootRoute')) {
        issues.push({
          code: 'E-ROUTE-ROOT',
          file: relativeFile,
          level: 'error',
          message: '__root.tsx debe usar createRootRoute',
        });
      }
      continue;
    }

    const expected = expectedRouteId(file);
    const match = /createFileRoute\(\s*['"]([^'"]+)['"]\s*\)/.exec(source);

    if (match?.[1] === undefined) {
      issues.push({
        code: 'E-ROUTE-FILE',
        file: relativeFile,
        level: 'error',
        message: `debe usar createFileRoute('${expected}')`,
      });
    } else if (normalizeRouteId(match[1]) !== normalizeRouteId(expected)) {
      issues.push({
        code: 'E-ROUTE-ID',
        file: relativeFile,
        level: 'error',
        message: `la ruta "${match[1]}" no coincide con su ubicación en disco ("${expected}")`,
      });
    }

    if (/export\s+default\b/.test(source)) {
      issues.push({
        code: 'W-ROUTE-DEFAULT',
        file: relativeFile,
        level: 'warning',
        message: 'las rutas no deben usar export default (rompe la división de código y el tipado)',
      });
    }
  }

  return issues;
}
