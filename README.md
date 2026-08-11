# From Platform Engineer to WTF

An engineering journal documenting a migration from Platform Engineering / SRE into MLOps, ML and AI.

> Choose boring technology. Make the experience interesting.

Static site, Markdown files in git, no database, no CMS, no backend. Writing a new entry is
`npm run new`, type, commit.

---

## Stack

| Piece | Choice | Why |
| --- | --- | --- |
| Framework | [Astro](https://astro.build) | Static output, ships zero JS by default |
| Content | MDX via `@astrojs/mdx` | Markdown, plus components when a post needs one |
| Highlighting | Shiki (built into Astro) | Runs at build time — no highlighter in the browser |
| Diagrams | Mermaid | Lazily imported, only on pages that contain a diagram |
| Feed | `@astrojs/rss` | `/rss.xml` |
| Sitemap | `@astrojs/sitemap` | `/sitemap-index.xml` |
| Type | IBM Plex Mono + Source Serif 4 | Self-hosted via Fontsource |

First-party JavaScript stays tiny: the theme toggle and copy buttons are ~1 KB inlined, and Mermaid
loads only on pages that contain a diagram. The one external script is the Clixy feedback widget
(~39 KB, loaded `async`), set via `SITE.clixyKey` in `src/config.mjs` — blank that value out and the
tag disappears from every page.

## Commands

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
npm run preview    # serve the build

npm run new -- "Title Of The Entry"              # new migration log
npm run new -- "Title" --notes                   # new field note
npm run new -- "project-name" --projects         # new project page
npm run og                                       # regenerate public/og.png
```

---

## Writing a new Migration Log

```
npm run new -- "Why Am I Doing This?"
  ↓
edit content/migration/001-why-am-i-doing-this.mdx
  ↓
draft: true  ->  draft: false
  ↓
git commit && push
  ↓
deployed
```

`npm run new` picks the next number automatically, slugifies the title, stamps today's date and
starts the file as a draft. Drafts are excluded from the site, the RSS feed and the sitemap, so you
can commit work in progress safely.

### Frontmatter

```yaml
---
title: "Why Am I Doing This?"
date: "2026-08-11"
number: 1                # migration logs only — drives the 001 numbering and ordering
category: "Migration"           # one of the categories below
description: "One or two sentences. Shown on the timeline, in RSS and in search results."
tags:
  - Career
  - MLOps
draft: false
---
```

`content/migration/000-template.mdx` is a working reference showing every component, callout and
code style available. It is `draft: true` and numbered `0`, so it never appears on the site and
never collides with a real entry. Copy it or leave it — it costs nothing.

`projects/` entries additionally take `status: running | building | broken | archived` and an
optional `repo:` URL. `notes/` entries use the base fields only.

### Categories

Migration · MLOps · AI · ML · Infrastructure · Projects · Notes

Defined in `src/config.mjs`. Each one gets a page at `/category/<slug>` automatically. Keep the list
short — tags are freeform, categories are not.

### Ordering

Migration logs are listed **oldest first**, so the timeline reads as a log and the newest entry sits
at the bottom under the `● CURRENT` marker. Ordering comes from `number`, not from `date`.

---

## What you can use in a post

Standard Markdown, plus:

**Code** — fenced blocks get build-time highlighting, a language label and a copy button.

````md
```python
def promote(candidate, incumbent):
    return candidate.auc >= incumbent.auc - 0.02
```
````

**Callouts** — `note` (default), `broke`, `learned`:

```mdx
import Callout from '../../src/components/Callout.astro';

<Callout type="broke">
  The specific thing that failed, and why it surprised me.
</Callout>
```

**Diagrams** — Mermaid, rendered client-side and themed to match the page:

```mdx
import Mermaid from '../../src/components/Mermaid.astro';

<Mermaid
  caption="Optional caption."
  chart={`
flowchart LR
  D[Data] --> T[Train] --> S[Serve]
`}
/>
```

**Tables, images, blockquotes, footnotes** all work as plain Markdown. Headings get anchor links
automatically, and a table of contents appears when a post has more than two `##` sections.

---

## Layout

```
content/
  migration/     the numbered logs — the spine of the site
    000-template.mdx   reference for every feature; draft, never published
  projects/      things built to answer a question
  notes/         short field notes
src/
  components/    Leleu, Timeline, Callout, Mermaid, ...
  layouts/       Base (head/SEO) and Article
  pages/         routes, including rss.xml.ts
  styles/        global.css — all design tokens live at the top
  config.mjs     site identity, status block, depth bars, categories
public/          favicon, og.png, robots.txt
scripts/         new-log.mjs, build-og.mjs
```

### Things you will actually want to edit

- **`src/config.mjs`** — site title, URL, author, social links, and the `STATUS` / `DEPTH` blocks
  shown on the homepage. Update `STATUS.currently` and the `DEPTH` bars as the migration moves.
- **`src/styles/global.css`** — the palette is the first 40 lines. Light and dark are the same
  tokens with different values.
- **`src/pages/about.astro`** — the About page is hand-written prose, not content-collection driven.

## Leleu

The axolotl is `src/components/Leleu.astro` — one inline SVG, animated with CSS only. He appears on
the homepage, the About page and the 404. Axolotls stay permanently mid-metamorphosis and regrow
what they break, which is the entire premise of this site.

He is drawn with `fill: var(--paper)` and `stroke: currentColor`, so he re-inks himself in dark mode
with no second asset.

## Motion

Entrance and scroll animations use CSS scroll-driven animations behind an `@supports` guard, so
browsers without them get a static page rather than a broken one. Everything is wrapped in
`prefers-reduced-motion: no-preference` — the site is fully usable with motion off, and Leleu simply
holds still.

## Deploy

Live at **https://albuquerquealdry.github.io/from-platform-engineer-to-wtf/**

Every push to `main` triggers `.github/workflows/deploy.yml`: `configure-pages` → build with
`withastro/action` → `deploy-pages`. Nothing to do by hand.

Because this is a project repo rather than a user site, the site is served from a subpath. Two
values in `src/config.mjs` control that:

```js
url:  'https://albuquerquealdry.github.io',
base: '/from-platform-engineer-to-wtf',
```

Every internal link goes through the `url()` helper in `src/lib/utils.ts`, and root-relative links
written inside posts (`/logs/001-...`) are rewritten at build time by
`src/lib/rehype-base-links.mjs`. So you can keep writing normal paths in Markdown and they will work.

**Moving to a custom domain later:** set `base: '/'`, put the domain in `url`, add a `public/CNAME`
file containing the domain, update `public/robots.txt`, and point the DNS at GitHub. Nothing else
changes — no link rewriting needed.

---

**The content is the product. The migration is the story. The WTF is the destination.**
