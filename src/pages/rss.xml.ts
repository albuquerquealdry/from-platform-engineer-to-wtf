import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config.mjs';
import { allEntries } from '../lib/content';
import { pad } from '../lib/utils';

export async function GET(context: APIContext) {
  const entries = await allEntries();

  // entry.href already carries the base, so the feed is rooted at the site
  // origin and links stay absolute paths.
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: new URL(SITE.base, context.site!),
    trailingSlash: false,
    items: entries.map((entry) => ({
      title: entry.number !== undefined ? `${pad(entry.number)} — ${entry.title}` : entry.title,
      description: entry.description,
      pubDate: entry.date,
      link: entry.href,
      categories: [entry.category, ...entry.tags],
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
