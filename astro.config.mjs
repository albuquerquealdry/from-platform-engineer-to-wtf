// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { SITE } from './src/config.mjs';
import { rehypeBaseLinks } from './src/lib/rehype-base-links.mjs';

export default defineConfig({
  site: SITE.url,
  // Served from a project subpath on GitHub Pages.
  base: SITE.base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Two themes, swapped by CSS variables — no client JS, no flash.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
    rehypePlugins: [
      rehypeBaseLinks(SITE.base),
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { class: 'heading-anchor', ariaHidden: 'true', tabIndex: -1 },
          content: { type: 'text', value: '#' },
        },
      ],
    ],
  },
  build: { inlineStylesheets: 'auto' },
  vite: {
    build: {
      // mermaid is huge and lazily imported; keep it out of the shared chunk.
      chunkSizeWarningLimit: 2000,
    },
  },
});
