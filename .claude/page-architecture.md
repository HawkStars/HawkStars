# Page Architecture Patterns

## Static content pages (Erasmus, Key Actions, How to Help Us)

These pages have all content in i18n translation files (not CMS). They follow a data-driven component pattern:

- Content arrays defined as `const` data (cards, steps, sections) with translation keys
- Reusable sub-components (`SectionTag`, `PathCard`, `KASection`) render each array item
- Each page uses `getServerTranslation(lng, 'namespace')` for its own i18n namespace
- Colors from the design system (`bg-green`, `bg-bege-light`, `text-green`) for org pages
- EU-specific pages use arbitrary Tailwind values (`bg-[#003399]`, `text-[#FFCC00]`)
- Translation files: `i18n/locales/{pt,en}/{namespace}.json`

## CMS-driven pages (News, Projects, Events)

These pages pull structured data from Payload collections and render it with Tailwind:

- **News** uses structured fields: `details.text` (textarea), `details.sections` (array of title+text), and `gallery` (MultiImageField). No rich text editor.
- **Projects** use structured fields: `hero` group (badge, stats, video), `details` (text + phases array), `objectives`, `results`, `gallery`, plus `dissemination` and `partnersInformation` tabs.
- Both patterns avoid rich text in favor of explicit fields, keeping rendering logic in the frontend code.

## Adding a new static page

1. Create `app/[lng]/(org)/page-name/page.tsx`
2. Use `LanguagePageProps` from `../types`
3. Add metadata key to both `i18n/locales/{pt,en}/metadata.json`
4. Add URL to `utils/paths.ts` → `urls` object
5. Add to `routes` array in `utils/paths.ts` for sitemap inclusion
6. Create translation file `i18n/locales/{pt,en}/page-name.json`
