/**
 * Scaffolds the next migration log.
 *
 *   npm run new -- "My First RAG Was Terrible"
 *   npm run new -- "A Short Note" --notes
 *   npm run new -- "eval-harness" --projects
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const title = args.filter((a) => !a.startsWith('--')).join(' ').trim();

if (!title) {
  console.error('Usage: npm run new -- "Title of the entry" [--notes|--projects]');
  process.exit(1);
}

const kind = flags.has('--notes') ? 'notes' : flags.has('--projects') ? 'projects' : 'migration';
const dir = new URL(`../content/${kind}/`, import.meta.url);
await mkdir(dir, { recursive: true });

const slug = title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const existing = (await readdir(dir)).filter((f) => /\.mdx?$/.test(f));
const date = new Date().toISOString().slice(0, 10);

let filename;
let frontmatter;

if (kind === 'migration') {
  const highest = existing.reduce((max, file) => {
    const n = Number.parseInt(file.slice(0, 3), 10);
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 0);
  const number = highest + 1;
  const padded = String(number).padStart(3, '0');
  filename = `${padded}-${slug}.mdx`;
  frontmatter = `---
title: "${title}"
date: "${date}"
number: ${number}
category: "Migration"
description: "One or two sentences. This is what shows up on the timeline and in RSS."
tags:
  - Tag
draft: true
---

import Callout from '../../src/components/Callout.astro';

Start here. Delete the headings you don't need; they are a prompt, not a template.

## What I was trying to do

## What I didn't know

## What I built

<Callout type="broke">
  The specific thing that failed, and why it surprised me.
</Callout>

## What I learned

## What's next
`;
} else if (kind === 'projects') {
  filename = `${slug}.mdx`;
  frontmatter = `---
title: "${title}"
date: "${date}"
category: "Projects"
status: "building"
description: "What it does, and which question it exists to answer."
tags:
  - Tag
draft: true
---

## The idea

## Current state
`;
} else {
  filename = `${slug}.mdx`;
  frontmatter = `---
title: "${title}"
date: "${date}"
category: "Notes"
description: "A short field note."
tags:
  - Tag
draft: true
---

`;
}

const path = join(new URL(dir).pathname, filename);
await writeFile(path, frontmatter, { flag: 'wx' }).catch((err) => {
  if (err.code === 'EEXIST') {
    console.error(`Already exists: content/${kind}/${filename}`);
    process.exit(1);
  }
  throw err;
});

console.log(`content/${kind}/${filename}`);
console.log('draft: true, flip it to false when you want it published.');
