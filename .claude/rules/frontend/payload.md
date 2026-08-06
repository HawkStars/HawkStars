---
paths:
  - 'payload/**'
---

# Payload CMS Code Guidelines

This file outlines the coding guidelines and best practices for working with Payload CMS in the HawkStars project. It covers how to define collections, fields, and relationships in a way that is consistent, maintainable, and optimized for our use case.

## General Principles

- **Explicitness**: Define fields and relationships explicitly rather than relying on implicit conventions. This improves readability and maintainability.
- **Type Safety**: Use TypeScript types and interfaces to ensure type safety across the codebase, especially when working with Payload's generated types.
- **Performance**: Avoid unnecessary nesting and complexity in collection definitions to keep the admin UI responsive and the API efficient.
- **Consistency**: Follow a consistent structure for collection definitions, field naming, and relationship patterns to make it easier for developers to understand and work with the codebase.

## Collections

### File Structure

Collections with simple schemas live in a single file (e.g., `payload/collections/Partner.ts`). Collections with complex schemas are split into a folder with an `index.ts` entry point plus separate files for tabs, sub-fields, and admin components:

```
payload/collections/News/
├── index.ts            # CollectionConfig export
├── NewsFields.ts       # Tab field definitions
└── components/
    └── SectionsRowLabel.tsx

payload/collections/HawkProject/
├── index.ts
├── HawkProjectPageTab.ts
├── HawkProjectSeoTab.ts
├── HawkProjectPartnersInformation.ts
├── HawkProjectDisseminationFields.ts
└── components/
    ├── pageTab/
    └── partners/
```

### Collection Config Shape

Always import `CollectionConfig` from `'payload'` and type the export explicitly:

```typescript
import type { CollectionConfig } from 'payload';

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News Article', plural: 'News Articles' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    description: '…',
    group: { name: 'Daily Work' },
  },
  defaultPopulate: { title: true, slug: true },
  access: {/* see Access Control */},
  fields: [/* … */],
  hooks: {/* … */},
  versions: {/* … */},
};
```

- `slug` uses `snake_case` (e.g., `'hawk_projects'`) or `kebab-case` (e.g., `'news'`).
- Always set `labels.singular` and `labels.plural` in English.
- Always set `admin.useAsTitle` to the most human-readable field.
- Always set `admin.defaultColumns` to show the most useful fields at a glance.
- Always set `admin.description` — this is shown to editors as guidance.
- Always set `admin.group` to one of the defined admin groups (`'Daily Work'`, etc.) for sidebar organization.
- Always set `defaultPopulate` to the minimum set of fields needed for listing/references.

### Content Workflow Collections (News, Pages)

Collections that go through editorial review use the shared `contentStatusField` and the standard hooks:

```typescript
import { contentStatusField } from '@/payload/fields/contentStatus';

// In fields array:
contentStatusField,
{
  name: 'publishedAt',
  type: 'date',
  admin: { position: 'sidebar', description: 'Automatically set when status changes to Published' },
},
{
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  admin: { position: 'sidebar', description: 'The URL slug for the page, e.g. "about" for www.hawkstars.com/about' },
},

// In hooks:
hooks: {
  afterChange: [],
  beforeChange: [populatePublishedAt],
},

// Versioning is mandatory for workflow collections:
versions: {
  drafts: { autosave: { interval: 100 }, schedulePublish: true },
  maxPerDoc: 10,
},
```

The status workflow is `draft → in_review → published`. Editors can advance to `in_review`; only admins can publish.

### SEO Tab

All public-facing collections include a `meta` tab using the `@payloadcms/plugin-seo` fields:

```typescript
import {
  MetaDescriptionField, MetaImageField, MetaTitleField,
  OverviewField, PreviewField,
} from '@payloadcms/plugin-seo/fields';

{
  name: 'meta',
  label: 'SEO',
  fields: [
    OverviewField({ titlePath: 'meta.title', descriptionPath: 'meta.description', imagePath: 'meta.image' }),
    MetaTitleField({ hasGenerateFn: true, overrides: { maxLength: 60 } }),
    MetaImageField({ relationTo: 'media', hasGenerateFn: true, overrides: { admin: { description: 'Recommended size: 1200x630 pixels' } } }),
    MetaDescriptionField({ hasGenerateFn: true, overrides: { maxLength: 160 } }),
    PreviewField({ hasGenerateFn: true, titlePath: 'meta.title', descriptionPath: 'meta.description' }),
  ],
}
```

### Tabs

Use the `tabs` field type to group logically related fields. The first tab is always the main content tab (labelled `'Content'` or descriptively named). SEO is always the last tab, named `meta`.

```typescript
{
  type: 'tabs',
  tabs: [
    { label: 'Content', fields: [ /* … */ ] },
    { name: 'meta', label: 'SEO', fields: [ /* … */ ] },
  ],
}
```

---

## Globals

Globals follow the same structural conventions as collections but use `GlobalConfig` from `'payload'`:

```typescript
import type { GlobalConfig } from 'payload';

export const Header: GlobalConfig = {
  slug: 'header',
  label: { pt: 'Cabeçalho', en: 'Header' },
  access: { read: anyone },
  admin: { description: '…' },
  fields: [/* … */],
  hooks: { afterChange: [revalidateHeader] },
};
```

- Global slugs use `camelCase` (e.g., `'header'`, `'mainPage'`, `'crowdfundingSettings'`).
- Always add an `afterChange` revalidation hook for globals that affect the frontend (header, footer, settings pages).
- Label globals with localized strings when the slug is displayed to editors in both languages.

---

## Blocks

### File Structure

Every block lives in its own folder under `payload/blocks/BlockName/` with exactly three files:

```
payload/blocks/AccordionBlock/
├── config.ts                   # Block field definitions (Block type from payload)
├── Component.tsx               # React rendering component
└── AccordionBlock.stories.tsx  # Storybook stories
```

After creating a block, export it from `payload/blocks/index.tsx`, add it to the relevant collection's `blocks` array, and run `pnpm payload:regenerate`.

### Block Config Shape

```typescript
import type { Block } from 'payload';
import SectionID from '@/payload/fields/SectionID';

export const AccordionBlock: Block = {
  slug: 'accordion',
  interfaceName: 'AccordionBlock', // must be unique; used for TypeScript type generation
  imageAltText: 'Accordion Block', // shown in the block picker UI
  admin: { group: 'Content' }, // group in block picker: 'Content', 'Media', 'Layout', etc.
  labels: { singular: 'Accordion Block', plural: 'Accordion Blocks' },
  fields: [
    // … content fields …
    SectionID, // always include SectionID as the last field
  ],
};
```

- `slug` is `kebab-case`.
- `interfaceName` is `PascalCase` matching the folder name — this becomes the generated TypeScript interface name.
- Always end the fields array with `SectionID` to support anchor links.
- Group blocks via `admin.group` (`'Content'`, `'Media'`, `'Layout'`, etc.) to organize the block picker.

### Block Component Shape

```typescript
'use client'; // only if the component uses hooks or browser APIs

import React from 'react';
import type { AccordionBlock as AccordionBlockProps } from '@/payload-types';

export const AccordionBlock: React.FC<AccordionBlockProps> = ({ title, items, sectionId }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className='py-12 lg:py-20' id={sectionId || undefined} data-blockid='accordion'>
      <div className='container mx-auto'>
        {/* … */}
      </div>
    </section>
  );
};
```

- Import props type from `@/payload-types` using the block's `interfaceName`.
- Always render a `<section>` wrapper with `id={sectionId || undefined}` and `data-blockid='<slug>'`.
- Guard against empty arrays/null values before rendering — return `null` if there is nothing to show.
- Add `'use client'` only when the component genuinely needs it (interactive state, browser APIs).

---

## Fields

### Custom Reusable Fields

Shared fields live in `payload/fields/`. Use them instead of duplicating field definitions inline.

| Field                | Import                           | Purpose                                              |
| -------------------- | -------------------------------- | ---------------------------------------------------- |
| `SectionID`          | `@/payload/fields/SectionID`     | Anchor link ID for any block or section              |
| `link()`             | `@/payload/fields/link`          | Internal/external link group field                   |
| `linkGroup()`        | `@/payload/fields/linkGroup`     | Array of link fields                                 |
| `MultiImageField()`  | `@/payload/fields/MultiImage`    | Mixed internal (media) + external (URL) images       |
| `contentStatusField` | `@/payload/fields/contentStatus` | Draft/In Review/Published workflow select            |
| `ImageField`         | `@/payload/fields/Image/fields`  | Localized upload field wrapping the media collection |

### `link()` Field

Use the `link()` factory for any field that captures a navigation or CTA link. It supports internal document references (Pages, HawkProjects) and custom external URLs, plus optional `newTab`, `label`, and `section` (anchor) sub-fields:

```typescript
import { link } from '@/payload/fields/link';

link({
  localizedLabel: true, // whether the label sub-field is localized
  labelInformation: 'CTA Link',
  description: 'The link for the call-to-action button',
  condition: (_, siblingData) => siblingData.showCta === true,
});
```

### `MultiImageField()` Field

Use for gallery or image-set fields that may mix Cloudinary-hosted uploads with third-party URLs:

```typescript
import { MultiImageField } from '@/payload/fields/MultiImage';

MultiImageField({ name: 'gallery', label: 'Gallery', required: false });
```

This produces a group with `internalImages` (relation to `media`) and `externalImages` (`url` + `alt` text) sub-arrays.

### Localized Fields

Add `localized: true` to any field whose content differs between Portuguese and English. Do **not** localize structural fields (IDs, slugs, booleans, dates, selects used as configuration).

```typescript
{ name: 'title', type: 'text', required: true, localized: true }
{ name: 'slug',  type: 'text', required: true, unique: true }   // not localized
```

### `interfaceName` on Groups and Arrays

Set `interfaceName` on group and array fields when their generated TypeScript type will be reused across the codebase:

```typescript
{ name: 'items', type: 'array', interfaceName: 'AccordionBlockItem', fields: [ /* … */ ] }
```

### Field Admin Descriptions

Every field visible to an editor should have an `admin.description` explaining what to put there. Keep descriptions concise and actionable.

### Array Row Labels

Use a `RowLabel` component to show a meaningful label in collapsed array rows. Use `GenericArrayRowLabel` for simple cases, or create a dedicated component for richer display:

```typescript
admin: {
  components: {
    RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
  },
},
```

---

## Access Control

Access functions live in `payload/access/` and are imported by name. Use the four standard functions; do not write inline access logic in collection configs.

| Function              | When to use                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `anyone`              | Public reads (all frontend-facing collections, globals)                  |
| `authenticated`       | All CRUD operations that require a logged-in user                        |
| `authenticatedAdmin`  | Operations restricted to admins (`user.isAdmin === true`)                |
| `authenticatedEditor` | Operations for editors **or** admins (`user.isEditor \|\| user.isAdmin`) |

Typical pattern for a public-read collection:

```typescript
access: {
  admin: authenticated,
  read: anyone,
  create: authenticated,
  delete: authenticated,
  update: authenticated,
},
```

---

## Hooks

Standard hooks live in `payload/hooks/`. Always import them instead of reimplementing the same logic inline.

| Hook                              | Type          | Purpose                                        |
| --------------------------------- | ------------- | ---------------------------------------------- |
| `sanitizeBrokenImageRelationship` | `afterRead`   | Removes stale media relationship IDs from docs |
| `notifyOnContribution`            | `afterChange` | Notification on new contributions              |
| `notifyOnMediaUpload`             | `afterChange` | Notification on media uploads                  |
| `notifyOnNewsChange`              | `afterChange` | Notification on news article changes           |
| `notifyOnPageChange`              | `afterChange` | Notification on page changes                   |

For revalidation of Next.js cached pages, add a collection-specific `afterChange` hook (e.g., `revalidatePage`, `revalidateHeader`, `revalidateFooter`) defined in the collection/global's own `hooks/` subfolder.

Hook registration order matters for `beforeChange` — `populatePublishedAt` must run before any `afterChange` hooks:

```typescript
hooks: {
  beforeChange: [],
  afterChange:  [revalidatePage],
},
```

---

## Plugins

Active plugins are configured in `payload/plugins/index.ts` and exported as `plugins: Plugin[]` for use in `payload.config.ts`.

- **`@payloadcms/plugin-seo`**: Adds `meta` fields and generate functions for Pages. `generateTitle` and `generateURL` are the two required generate functions.
- **`@payloadcms/plugin-cloud-storage`**: Routes media uploads to Cloudinary and documents to Google Drive. Both collections set `disableLocalStorage: true`.

Do not add plugins inline in `payload.config.ts`. All plugin configuration belongs in `payload/plugins/index.ts`.

---

## Naming Conventions

| Concept               | Convention                   | Example                                     |
| --------------------- | ---------------------------- | ------------------------------------------- |
| Collection slug       | `snake_case` or `kebab-case` | `hawk_projects`, `news`                     |
| Global slug           | `camelCase`                  | `header`, `crowdfundingSettings`            |
| Block slug            | `kebab-case`                 | `accordion`, `cta-banner`                   |
| Block `interfaceName` | `PascalCase`                 | `AccordionBlock`, `CTABannerBlock`          |
| Array `interfaceName` | `PascalCase`                 | `AccordionBlockItem`                        |
| Field names           | `camelCase`                  | `publishedAt`, `sectionId`                  |
| Access function files | `camelCase.ts`               | `authenticated.ts`, `authenticatedAdmin.ts` |
| Hook files            | `camelCaseAction.ts`         | `populatePublishedAt.ts`                    |
| Block folder          | `PascalCase`                 | `AccordionBlock/`, `CTABannerBlock/`        |
| Collection folder     | `PascalCase`                 | `HawkProject/`, `News/`                     |

---

## Type Safety

- **Never use `any`**. Type all hook callbacks with the Payload-provided types (`CollectionBeforeChangeHook`, `CollectionAfterChangeHook`, `GlobalConfig`, etc.).
- Import generated document types from `@/payload-types`, not from collection config files.
- After any schema change run `pnpm payload:regenerate` to keep `payload-types.ts` in sync.
- When narrowing user type in hooks, cast via `req.user as User | undefined` with an early-return guard.

---

## Common Pitfalls

- **Block not appearing**: ensure it is exported from `payload/blocks/index.tsx` and listed in the target collection's `blocks` array, then run `pnpm payload:regenerate`.
- **Type errors after schema change**: always run `pnpm payload:regenerate`.
- **Localized field in a non-localized context**: only collections registered in Payload's `localization.collections` array can use `localized: true` on their fields.
- **Missing `interfaceName`**: without `interfaceName`, group/array fields get auto-named types that change if you rename the field — always set it on any type you reference in frontend code.
- **Inline access logic**: don't write `access: { read: ({ req }) => !!req.user }` inline — import the appropriate function from `payload/access/`.
