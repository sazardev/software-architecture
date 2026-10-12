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

export const frontmatterSchema = z.object({
  category: z.string().regex(/^[a-z][a-z0-9-]*$/),
  description: z.string(),
  order: z.number().int().nonnegative(),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'formato esperado: YYYY-MM-DD')
    .optional(),
  tags: z
    .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
    .max(5)
    .refine((tags) => new Set(tags).size === tags.length, 'los tags deben ser únicos'),
  title: z.string(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'formato esperado: YYYY-MM-DD'),
});

export type ContentFrontmatter = z.infer<typeof frontmatterSchema>;
export type ContentTaxonomy = z.infer<typeof taxonomySchema>;
