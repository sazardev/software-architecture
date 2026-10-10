import type { Issue } from '../report';

import type { ParsedDoc } from './parsed-doc';

const knownStaticRoutes = new Set(['/', '/docs', '/search']);

function extractLinks(markdown: string): string[] {
  const links: string[] = [];

  for (const match of markdown.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (match[1] !== undefined) {
      links.push(match[1]);
    }
  }

  return links;
}

function auditLink(
  link: string,
  doc: ParsedDoc,
  parsedDocs: Map<string, ParsedDoc>,
): Issue | undefined {
  const isExternal =
    link.startsWith('http://') ||
    link.startsWith('https://') ||
    link.startsWith('mailto:') ||
    link.startsWith('/search');

  if (isExternal) {
    return undefined;
  }

  if (link.startsWith('#')) {
    const anchor = link.slice(1);
    const hasAnchor = doc.headings.some((heading) => heading.id === anchor);

    if (!hasAnchor) {
      return {
        code: 'E-ANCHOR',
        file: doc.relativeFile,
        level: 'error',
        message: `ancla interna "#${anchor}" no existe en este documento`,
      };
    }

    return undefined;
  }

  if (link.startsWith('/docs/')) {
    const [targetSlug = '', anchor] = link.slice('/docs/'.length).split('#', 2);
    const target = parsedDocs.get(targetSlug);

    if (target === undefined) {
      return {
        code: 'E-LINK',
        file: doc.relativeFile,
        level: 'error',
        message: `enlace a documento inexistente "${link}"`,
      };
    }

    if (anchor !== undefined) {
      const hasAnchor = target.headings.some((heading) => heading.id === anchor);

      if (!hasAnchor) {
        return {
          code: 'E-ANCHOR',
          file: doc.relativeFile,
          level: 'error',
          message: `el ancla "${link}" no existe en el documento destino`,
        };
      }
    }

    return undefined;
  }

  if (link.startsWith('/') && !knownStaticRoutes.has(link.split('#', 1)[0] ?? link)) {
    return {
      code: 'E-LINK',
      file: doc.relativeFile,
      level: 'error',
      message: `ruta interna desconocida "${link}"`,
    };
  }

  return undefined;
}

export function collectLinkIssues(parsedDocs: Map<string, ParsedDoc>): Issue[] {
  const issues: Issue[] = [];

  for (const doc of parsedDocs.values()) {
    for (const link of extractLinks(doc.body)) {
      const issue = auditLink(link, doc, parsedDocs);

      if (issue !== undefined) {
        issues.push(issue);
      }
    }
  }

  return issues;
}
