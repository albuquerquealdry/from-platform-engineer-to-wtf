import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const base = z.object({
  title: z.string(),
  date: z.coerce.date(),
  category: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const migration = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/migration' }),
  schema: base.extend({
    number: z.number().int().nonnegative(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/projects' }),
  schema: base.extend({
    status: z.enum(['running', 'building', 'broken', 'archived']).default('building'),
    repo: z.string().url().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/notes' }),
  schema: base,
});

export const collections = { migration, projects, notes };
