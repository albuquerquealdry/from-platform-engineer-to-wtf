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
    // Build-log series this entry belongs to (key into SERIES in config.mjs).
    // Entries with the same series get their own index page and prev/next.
    series: z.string().optional(),
    // Optional voice note from the author, rendered as a player at the top of
    // the entry. Path under public/, e.g. "/audio/001-foundation.m4a".
    audio: z.string().startsWith('/audio/').optional(),
    /** Display duration of the voice note, e.g. "2:30". */
    audioDuration: z.string().optional(),
    /** Short caption under the player: what this note is, in the author's voice. */
    audioCaption: z.string().optional(),
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
