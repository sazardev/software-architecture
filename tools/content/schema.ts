import { z } from 'zod';

const localizedTextSchema = z.object({
  description: z.string().min(10),
  label: z.string().min(2),
});

export const sectionSchema = z.object({
  icon: z
    .string()
    .regex(/^[a-z]+$/)
    .optional(),
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  labels: z.record(z.string(), localizedTextSchema),
  order: z.number().int().positive(),
});

export const taxonomySchema = z.object({
  sections: z.array(sectionSchema).min(1),
});

const slugIdSchema = z.string().regex(/^[a-z][a-z0-9-]*$/);

export const roadmapStageSchema = z.object({
  id: slugIdSchema,
  labels: z.record(z.string(), localizedTextSchema),
});

export const roadmapSchema = z.object({
  icon: z
    .string()
    .regex(/^[a-z]+$/)
    .optional(),
  id: slugIdSchema,
  labels: z.record(z.string(), localizedTextSchema),
  order: z.number().int().positive(),
  stages: z.array(roadmapStageSchema).min(1),
});

export const roadmapsSchema = z.object({
  roadmaps: z.array(roadmapSchema).min(1),
});

/**
Posición del artículo en un roadmap: ruta, etapa y paso (ordena dentro de la etapa; no tiene
que ser consecutivo, así un artículo nuevo puede entrar entre dos existentes).
*/
const roadmapPlacementSchema = z.object({
  id: slugIdSchema,
  stage: slugIdSchema,
  step: z.number().int().positive(),
});

export const frontmatterSchema = z
  .object({
    category: z.string().regex(/^[a-z][a-z0-9-]*$/),
    description: z.string(),
    figureCaption: z.string(),
    order: z.number().int().nonnegative(),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'formato esperado: YYYY-MM-DD'),
    roadmap: roadmapPlacementSchema,
    tags: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .max(5)
      .refine((tags) => new Set(tags).size === tags.length, 'los tags deben ser únicos'),
    title: z.string(),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'formato esperado: YYYY-MM-DD'),
  })
  .refine((data) => data.publishedAt <= data.updatedAt, {
    message: 'publishedAt no puede ser posterior a updatedAt',
    path: ['publishedAt'],
  });

export type ContentFrontmatter = z.infer<typeof frontmatterSchema>;
export type ContentTaxonomy = z.infer<typeof taxonomySchema>;
export type ContentRoadmaps = z.infer<typeof roadmapsSchema>;
export type RoadmapPlacement = z.infer<typeof roadmapPlacementSchema>;
