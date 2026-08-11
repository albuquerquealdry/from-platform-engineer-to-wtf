import { getCollection } from 'astro:content';
import { url } from './utils';

export interface Normalized {
  href: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  tags: string[];
  collection: 'migration' | 'projects' | 'notes';
  number?: number;
  body?: string;
}

const published = ({ data }: { data: { draft: boolean } }) => !data.draft;

/** Every published entry across the three collections, newest first. */
export async function allEntries(): Promise<Normalized[]> {
  const [migration, projects, notes] = await Promise.all([
    getCollection('migration', published),
    getCollection('projects', published),
    getCollection('notes', published),
  ]);

  const items: Normalized[] = [
    ...migration.map((e) => ({
      href: url(`/logs/${e.id}`),
      title: e.data.title,
      date: e.data.date,
      description: e.data.description,
      category: e.data.category,
      tags: e.data.tags,
      collection: 'migration' as const,
      number: e.data.number,
      body: e.body,
    })),
    ...projects.map((e) => ({
      href: url(`/projects/${e.id}`),
      title: e.data.title,
      date: e.data.date,
      description: e.data.description,
      category: e.data.category,
      tags: e.data.tags,
      collection: 'projects' as const,
      body: e.body,
    })),
    ...notes.map((e) => ({
      href: url(`/notes/${e.id}`),
      title: e.data.title,
      date: e.data.date,
      description: e.data.description,
      category: e.data.category,
      tags: e.data.tags,
      collection: 'notes' as const,
      body: e.body,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
