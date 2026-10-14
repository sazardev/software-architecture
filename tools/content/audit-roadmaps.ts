import type { Issue } from '../report';

import { describeRoadmapError } from './content-index';
import { locales } from './locales';
import type { ParsedDoc } from './parsed-doc';
import type { ContentRoadmaps } from './schema';

const roadmapsPath = 'src/lib/content/roadmaps.json';

function duplicates(values: readonly (number | string)[]): (number | string)[] {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

function catalogError(code: string, message: string): Issue {
  return { code, file: roadmapsPath, level: 'error', message };
}

function collectLabelIssues(roadmaps: ContentRoadmaps): Issue[] {
  const issues: Issue[] = [];

  for (const roadmap of roadmaps.roadmaps) {
    const owners = [
      { labels: roadmap.labels, name: `el roadmap "${roadmap.id}"` },
      ...roadmap.stages.map((stage) => ({
        labels: stage.labels,
        name: `la etapa "${roadmap.id}/${stage.id}"`,
      })),
    ];

    for (const owner of owners) {
      for (const locale of locales) {
        if (owner.labels[locale] === undefined) {
          issues.push(
            catalogError(
              'E-ROADMAP-LABELS',
              `${owner.name} no tiene label/description para "${locale}"`,
            ),
          );
        }
      }
    }
  }

  return issues;
}

/**
Ids y órdenes únicos en el catálogo, y etapas únicas dentro de cada roadmap.
*/
function collectCatalogIssues(roadmaps: ContentRoadmaps): Issue[] {
  const issues: Issue[] = [];
  const ids = roadmaps.roadmaps.map((roadmap) => roadmap.id);
  const orders = roadmaps.roadmaps.map((roadmap) => roadmap.order);

  for (const id of duplicates(ids)) {
    issues.push(catalogError('E-ROADMAP-ID', `id de roadmap duplicado "${id}"`));
  }

  for (const order of duplicates(orders)) {
    issues.push(catalogError('E-ROADMAP-ORDER', `orden de roadmap duplicado (${order})`));
  }

  for (const roadmap of roadmaps.roadmaps) {
    const stageIds = roadmap.stages.map((candidate) => candidate.id);

    for (const stage of duplicates(stageIds)) {
      issues.push(
        catalogError('E-ROADMAP-STAGE', `etapa duplicada "${stage}" en el roadmap "${roadmap.id}"`),
      );
    }
  }

  return [...issues, ...collectLabelIssues(roadmaps)];
}

function placementKey(doc: ParsedDoc): string {
  return `${doc.roadmap.id}/${doc.roadmap.stage}/${doc.roadmap.step}`;
}

/**
Cada artículo apunta a un roadmap y etapa existentes, sin compartir paso con otro artículo.
*/
function collectPlacementIssues(roadmaps: ContentRoadmaps, docs: ParsedDoc[]): Issue[] {
  const issues: Issue[] = [];
  const taken = new Map<string, string>();

  for (const doc of docs) {
    const error = describeRoadmapError(roadmaps, doc.roadmap);

    if (error !== undefined) {
      issues.push({ code: 'E-ROADMAP', file: doc.relativeFile, level: 'error', message: error });
      continue;
    }

    const key = `${doc.locale}:${placementKey(doc)}`;
    const owner = taken.get(key);

    if (owner === undefined) {
      taken.set(key, doc.slug);
    } else {
      issues.push({
        code: 'E-ROADMAP-STEP',
        file: doc.relativeFile,
        level: 'error',
        message: `el paso ${doc.roadmap.step} de "${doc.roadmap.id}/${doc.roadmap.stage}" ya lo ocupa "${owner}"`,
      });
    }
  }

  return issues;
}

/**
Las traducciones de un artículo comparten exactamente el mismo lugar en el roadmap.
*/
function collectLocaleIssues(docs: ParsedDoc[]): Issue[] {
  const issues: Issue[] = [];
  const bySlug = new Map<string, ParsedDoc>();

  for (const doc of docs) {
    const reference = bySlug.get(doc.slug);

    if (reference === undefined) {
      bySlug.set(doc.slug, doc);
    } else if (placementKey(reference) !== placementKey(doc)) {
      issues.push({
        code: 'E-ROADMAP-LOCALE',
        file: doc.relativeFile,
        level: 'error',
        message: `roadmap "${placementKey(doc)}" distinto al de ${reference.relativeFile} ("${placementKey(reference)}")`,
      });
    }
  }

  return issues;
}

function collectEmptyStageIssues(roadmaps: ContentRoadmaps, docs: ParsedDoc[]): Issue[] {
  const used = new Set(docs.map((doc) => `${doc.roadmap.id}/${doc.roadmap.stage}`));

  return roadmaps.roadmaps.flatMap((roadmap) =>
    roadmap.stages
      .filter((stage) => !used.has(`${roadmap.id}/${stage.id}`))
      .map((stage): Issue => ({
        code: 'W-ROADMAP-EMPTY',
        file: roadmapsPath,
        level: 'warning',
        message: `la etapa "${roadmap.id}/${stage.id}" no tiene artículos todavía`,
      })),
  );
}

export function collectRoadmapIssues(
  roadmaps: ContentRoadmaps,
  parsedDocs: Map<string, ParsedDoc>,
): Issue[] {
  const docs = [...parsedDocs.values()].toSorted((a, b) =>
    a.relativeFile.localeCompare(b.relativeFile),
  );

  return [
    ...collectCatalogIssues(roadmaps),
    ...collectPlacementIssues(roadmaps, docs),
    ...collectLocaleIssues(docs),
    ...collectEmptyStageIssues(roadmaps, docs),
  ];
}
