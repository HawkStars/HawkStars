#!/usr/bin/env node
/**
 * Guard: no Storybook story may reach server-only code.
 *
 * Storybook builds every story for the browser. Payload's server entry point
 * (`payload`, and anything that imports `payload.config.ts`) pulls in
 * `payload/dist/uploads/*`, which imports `fileTypeFromFile` from `file-type`.
 * `file-type` v21 only exports that under the `node` condition, so a browser
 * build fails with an opaque Rollup error:
 *
 *     MISSING_EXPORT: "fileTypeFromFile" is not exported by
 *     node_modules/.pnpm/file-type@21.3.4/node_modules/file-type/core.js
 *
 * ...which says nothing about the story that caused it. This script walks the
 * import graph from every story and names the chain instead.
 *
 * The same leak also breaks `next build`: `lib/payload/server.ts` imports
 * `server-only`, and RichText — which renders every page-builder block — is in
 * the client graph (`LivePreviewPage.tsx` and `NewsSingleInformation.tsx` are
 * `'use client'`). So a block that fetches with the Local API cannot be
 * rendered from RichText at all; it has to fetch from the REST API on the
 * client, like the blocks in `lib/payload/client-side/queries/`.
 *
 * Only *value* imports count. `import type { X } from '@/lib/payload/server'`
 * is erased before bundling and is fine.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STORY_DIRS = ['stories', 'payload/blocks', 'components'];
const EXTS = ['.tsx', '.ts', '.jsx', '.js', '.mjs'];

/** Bare specifiers that must never appear in a browser bundle. */
const FORBIDDEN = new Set(['server-only', '@payload-config']);
/** Project files that must never appear in a browser bundle. */
const FORBIDDEN_FILES = new Set(['payload.config.ts', 'lib/payload/server.ts']);

const IMPORT_RE =
  /(?:^|\n)\s*import\s+(type\s+)?(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]|(?:^|\n)\s*export\s+(type\s+)?(?:\{[^}]*\}|\*)\s*from\s+['"]([^'"]+)['"]/g;
const DYNAMIC_RE = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

const resolveLocal = (spec, fromFile) => {
  let base;
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec);
  else return null;

  for (const suffix of ['', ...EXTS, ...EXTS.map((e) => `/index${e}`)]) {
    const candidate = base + suffix;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
};

const valueImportsOf = (source) => {
  const specs = [];
  for (const m of source.matchAll(IMPORT_RE)) {
    if (m[1] || m[3]) continue; // `import type` / `export type` — erased at build time
    specs.push(m[2] ?? m[4]);
  }
  for (const m of source.matchAll(DYNAMIC_RE)) specs.push(m[1]);
  return specs;
};

const rel = (file) => path.relative(ROOT, file);
const visited = new Set();
const violations = [];

const walk = (file, chain) => {
  if (visited.has(file)) return;
  visited.add(file);

  const source = fs.readFileSync(file, 'utf8');
  const here = [...chain, file];

  for (const spec of valueImportsOf(source)) {
    if (FORBIDDEN.has(spec)) violations.push({ reason: spec, chain: here });

    const resolved = resolveLocal(spec, file);
    if (!resolved || resolved.includes('node_modules')) continue;
    if (FORBIDDEN_FILES.has(rel(resolved))) {
      violations.push({ reason: rel(resolved), chain: [...here, resolved] });
      continue; // don't descend — the whole Payload config lives below here
    }
    walk(resolved, here);
  }
};

const collectStories = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectStories(full, out);
    else if (/\.stories\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
};

const stories = STORY_DIRS.flatMap((d) => collectStories(path.join(ROOT, d)));
for (const story of stories) walk(story, []);

if (violations.length === 0) {
  console.log(`✔ ${stories.length} stories checked — no server-only code in the browser graph.`);
  process.exit(0);
}

console.error(
  `\n✖ ${violations.length} story import chain(s) reach server-only code.\n` +
    `  Storybook builds these for the browser; they will fail the Chromatic build\n` +
    `  (and, if the module is also in a 'use client' graph, "next build").\n`
);
for (const { reason, chain } of violations) {
  console.error(`  imports ${reason}`);
  console.error(`    ${chain.map(rel).join('\n      -> ')}\n`);
}
console.error(
  `  Fix by either making the import type-only ("import type { X } from ..."),\n` +
    `  or by splitting the component: keep the presentational part in its own file\n` +
    `  and point the story at that.\n`
);
process.exit(1);
