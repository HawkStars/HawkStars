---
paths:
  - 'components/**'
---

# Frontend Style Guide

## Core Principles

- **DRY** — Don't repeat yourself. If you find yourself copying and pasting code, refactor it into a reusable function or component.
- **KISS** — Keep it simple. Avoid unnecessary complexity and over-engineering. Write code that is easy to read and understand.
- **Reuse before creating** — Before writing a new component, check `components/utils/`, `components/ui/`, and `components/layout/`. If a component almost fits, extend it. Only create new components when nothing suitable exists.
- **Mobile-first** — All layouts are built mobile-first. Use `lg:` breakpoints to progressively enhance for larger screens.
- **No `any`** — Strict TypeScript. Every prop, hook return, and event handler must be typed.
- **Use design tokens** — Always use defined color and typography tokens. Never hardcode values that should come from the design system.
- Use tailwind v4

---

## Path Aliases

| Alias             | Resolves to           |
| ----------------- | --------------------- |
| `@/*`             | project root (`./`)   |
| `@payload-config` | `./payload.config.ts` |

Always use `@/` imports. Never use relative paths that go up more than one directory.

---

## Colors

Brand colors are defined as CSS custom properties in `app/globals.css` under `@theme` and are available as Tailwind utilities (e.g. `bg-green`, `text-bege-dark`).

### Organization theme

| Token        | Hex       | Usage                                           |
| ------------ | --------- | ----------------------------------------------- |
| `green`      | `#0a7558` | Primary brand color — buttons, accents, borders |
| `bege-dark`  | `#fae7d0` | Warm card backgrounds, dividers                 |
| `bege-light` | `#fef9f6` | Page section backgrounds                        |
| `white`      | `#fff`    | Card surfaces                                   |
| `disabled`   | `#5b5b5b` | Disabled text and controls                      |
| `gray-light` | `#d3d3d3` | Subtle borders                                  |
| `red-dark`   | `#8b0000` | Error states                                    |
| `linkedin`   | `#0a66c2` | LinkedIn social link                            |

### Accents

Three accents add contrast to the green and beige. **Each has one job** — don't use them decoratively elsewhere, or the site turns into a rainbow.

| Token              | Hex       | Job                                                                 |
| ------------------ | --------- | ------------------------------------------------------------------- |
| `gold`             | `#f2a900` | **Act now** — donate/support buttons (`Button variant='accent'`), highlights on dark bands. Fill only: put `text-ink` on it (5.6:1). Never gold text on green (2.8:1). One gold button per view. |
| `gold-light`       | `#fcebb3` | Pale gold tint for highlight backgrounds                            |
| `terracotta`       | `#c2552f` | **Time and news** — fills with white text (4.5:1)                   |
| `terracotta-dark`  | `#a3401f` | Terracotta text on light surfaces: news/event types, event dates, badges (6:1 on beige) |
| `terracotta-light` | `#f7dcd0` | Terracotta tint                                                     |
| `ink`              | `#1f3a68` | **International / Europe** content (`SectionHeader variant='ink'`), and the alternate dark band where a page would otherwise stack green blocks. White text 11:1. |
| `ink-light`        | `#dce5f4` | Ink tint                                                            |

Green stays the primary brand colour: default buttons, links, section rules.

Add new colors as CSS variables in `globals.css` and then add Tailwind utilities via the `theme.extend.colors` config in `tailwind.config.ts`. Do not use arbitrary hex values in components — always use the defined tokens. Ask before adding them. Never have any colour as -[#hex] in the codebase which exception of the tailwind config or the css variables. This is to ensure that all colors are intentional and consistent across the project.

### Gaming sub-site theme

Only use these inside `app/[lng]/(gaming)/` pages and `components/gaming/` components.

| Token                     | Usage                     |
| ------------------------- | ------------------------- |
| `gaming-bg`               | Page background           |
| `gaming-surface`          | Card/panel background     |
| `gaming-surface-light`    | Elevated card background  |
| `gaming-border`           | Card borders              |
| `gaming-accent`           | Cyan accent (`#00f0ff`)   |
| `gaming-accent-secondary` | Purple accent (`#7b2ff7`) |
| `gaming-text`             | Primary text              |
| `gaming-text-muted`       | Secondary/muted text      |
| `gaming-danger`           | Error / destructive       |
| `gaming-success`          | Success states            |

### Erasmus sub-site theme

Only use inside `app/[lng]/(org)/erasmus/` pages and `components/navbar/` (for the Erasmus-conditional navbar background).

| Token           | Usage                                            |
| --------------- | ------------------------------------------------ |
| `erasmus-blue`  | EU blue — backgrounds, text, borders (`#003399`) |
| `erasmus-gold`  | EU gold — accents, badges, CTA text (`#ffcc00`)  |
| `erasmus-dark`  | Dark text and section backgrounds (`#0e0c1a`)    |
| `erasmus-muted` | Muted body text (`#6a6780`)                      |
| `erasmus-ka1`   | KA1 tab accent — teal (`#4dd9bc`)                |
| `erasmus-ka2`   | KA2 tab accent — purple (`#d18ddf`)              |
| `erasmus-ka3`   | KA3 tab accent — coral (`#f08080`)               |
| `erasmus-jm`    | Jean Monnet tab accent — blue (`#7eb8f7`)        |
| `erasmus-sport` | Sport tab accent — amber (`#f0b97a`)             |

### Crowdfunding sub-site theme

Only use inside `app/[lng]/(crowdfunding)/` and `components/Crowdfunding/`.

| Token                      | Usage                                    |
| -------------------------- | ---------------------------------------- |
| `crowdfunding-bg`          | Dark page background (`#0d0d0d`)         |
| `crowdfunding-surface`     | Card/panel background (`#1a1a1a`)        |
| `crowdfunding-surface-alt` | Alternate section background (`#111111`) |

---

## Typography

### Font families

- **Body**: `Inter` (set on `body` in `globals.css`) — use for all body copy, UI text and card titles.
- **Display**: `Oswald` via the `font-display` utility (`--font-display` in `@theme`). It is applied by the heading classes below — reach for a `text-*` heading class rather than `font-display` directly. `font-oswald` is a legacy alias.
- **Gaming display**: `font-magistral` — Oswald at weight 800 with Impact fallback. Only for gaming section hero text.

### Type scale

Defined in `globals.css` `@layer components`. **Every heading uses one of these classes** — never hand-roll `text-3xl font-bold` on a heading. Sizes are mobile → `lg:`.

| Class                | Font   | Size / Weight              | Line height | Use for                                                   |
| -------------------- | ------ | -------------------------- | ----------- | --------------------------------------------------------- |
| `text-display`       | Oswald | 40 → 64px / semibold       | 1.05        | One per page: `PageHero`, slideshow, detail-page `h1`      |
| `text-h1_semibold`   | Oswald | 32 → 48px / semibold       | 1.1         | Large feature headings inside a page                      |
| `text-h2_semibold`   | Oswald | 28 → 40px / semibold       | 1.15        | **Section heading** — the default `h2` of every section    |
| `text-h2_bold`       | Oswald | 22 → 28px / semibold       | 1.2         | Sub-section heading, group labels, accordion titles        |
| `text-h2_light`      | Inter  | 20 → 24px / light          | 1.35        | Lead / subtitle line under a heading                      |
| `text-h3_semibold`   | Inter  | 20px / semibold            | 1.3         | Card titles                                               |
| `text-body`          | Inter  | 20 → 24px                  | 1.45        | Large body copy                                           |
| `text-body_regular`  | Inter  | 16px / normal              | —           | Standard paragraph text                                   |
| `text-body_semibold` | Inter  | 16px / semibold            | —           | Emphasized inline text, labels                            |
| `text-eyebrow`       | Inter  | 12px / bold, uppercase     | —           | Small label above a heading (`SectionEyebrow`)             |

`SectionHeader` maps `as='h1' | 'h2' | 'h3'` to `text-h1_semibold` / `text-h2_semibold` / `text-h2_bold`; rich-text headings follow the same mapping. Headings already set `text-balance` and their own tracking — don't add `tracking-tight` (it crowds a condensed face). Keep body text left-aligned (no `text-justify`) and never below 12px.

```tsx
<h2 className='text-h2_semibold'>{title}</h2>
<p className='text-h2_light text-black/70'>{subtitle}</p>
```

---

## Rich text (Payload Lexical)

`RichText` (`payload/components/RichText`) renders CMS rich text through the converters in `payload/components/utils/`. Its prose styles live in `payload/components/RichText/richtext.scss`:

- **Scoped to editor text only.** Every rule targets a class the converters put on their own elements (`rt-p`, `rt-heading`, `rt-list`, `rt-quote`, `rt-figure`, `rt-rule`, `rt-text`). Never style bare `p`, `span` or `a` under `.payload-richtext` — blocks render inside rich text, and such a rule would override their typography.
- **Layered.** The file is in `@layer components`, so utilities on a block win. Prose sets no colour or font family — it inherits, which is how the art gallery (`.art-richtext` in `globals.css`) restyles it.
- **Reading column.** `rt-column` sits on the site column (72rem, the same gutter and left edge as `HawkStarsSection`) and holds text to a ≈70-character measure (42rem): left-aligned on the column below `lg`, centred in it on desktop; `rt-wide` does the same with a 56rem measure for images. Reuse `rt-column` for anything that should line up with the text, e.g. an article's references list.
- **Embedded rich text.** Inside a block, card or panel that already has its own column, render `<RichText embedded />`: the prose then fills that container instead of adding a second gutter.
- **Alignment and indent** come from Payload as inline styles. Converters pass `style={proseStyle(node)}` on the element they return: `justify` falls back to `start`, and indent is added to the column gutter instead of replacing it.
- **Empty paragraphs render nothing** — spacing comes from the stylesheet, not from editors pressing Enter twice.
- **`variant='article'`** makes the first paragraph a lead (news articles), unless that paragraph holds line breaks.
- `h2`/`h3` get a slug `id` and a hover `#` link for deep-linking.

---

## Cards

Card utilities are in `globals.css` `@layer components`. Use them for consistent shadow and rounding.

| Class              | Rounding     | Shadow             | Use for                                   |
| ------------------ | ------------ | ------------------ | ----------------------------------------- |
| `card`             | `rounded-xl` | `shadow-sm`        | Default content cards                     |
| `card-sm`          | `rounded-lg` | `shadow-sm`        | Small chips, list rows                    |
| `card-md` / `card-lg` | `rounded-xl` | `shadow-md`     | Emphasized / featured cards               |
| `card-hover`       | —            | hover: `shadow-md` | Add to any card that should lift on hover |
| `card-hover-lg`    | —            | hover: `shadow-lg` | Stronger lift effect                      |

One card language across the org site: **cards are `rounded-xl`** (never `2xl`/`3xl`); controls stay `rounded-md`/`rounded-lg`. Shadows have three levels: `shadow-sm` at rest, `shadow-md` raised or on hover, `shadow-lg` only for overlays (dropdowns, popovers).

Surfaces are warm, never cold grey: `bg-white` and `bg-bege-light` for sections and panels, `bg-bege-dark` for chips, icon circles, progress tracks and empty-image placeholders. Don't use `gray-*`/`zinc-*`/`neutral-*` backgrounds on org pages.

```tsx
<div className='card card-hover p-6'>{/* … */}</div>
```

---

## Layout Components

### `HawkStarsSection`

The standard page section wrapper. Handles horizontal padding and optional max-width clamping. Import from `@/components/layout`.

```tsx
import { HawkStarsSection } from '@/components/layout';

<HawkStarsSection className='bg-bege-light py-10 lg:py-14'>{/* page content */}</HawkStarsSection>;
```

Props via `variantProps`:

- `width`: `'full'` | `'half'` (default: full)
- `padding`: `'none'` | `'default'` (default: `default` → `px-4 sm:px-6 lg:px-8`)
- `spacing`: `'none'` | `'tight'` | `'default'` | `'loose'` — vertical rhythm. Use these instead of hand-written `py-*`.
- `cap`: `'content'` (default — children capped at `max-w-6xl`) | `'none'` (full-bleed)
- All native `<section>` props including `className` and `id`

**Full-bleed colour bands:** put the background on the section itself — `<HawkStarsSection spacing='default' className='bg-bege-light'>`. The background spans the viewport and the content stays on the shared 6xl column. Stack sections rather than nesting them; don't use negative margins to break out of a parent. (`HawkStarsOffSetSection` was removed — its `-mx-4 xl:-mx-40` no longer matched the gutter.)

Never use the legacy `xl:px-40` gutter or hand-rolled `container mx-auto max-w-*` wrappers on org pages.

### `PageHero`

The standard top-of-page header for org pages. Every org page starts with one, except sub-brand pages (Erasmus, gallery, gaming, crowdfunding) and image-led detail heroes.

```tsx
import { PageHero } from '@/components/layout';

<PageHero title={t('title')} description={t('description')} />

<PageHero
  variant='green'
  align='center'
  eyebrow={t('eyebrow')}
  title={t('title')}
  description={t('description')}
  actions={
    <Button asChild variant='inverse' size='xl'>
      <Link href={url}>{t('cta')}</Link>
    </Button>
  }
/>
```

Props: `variant` (`'bege'` default | `'green'`), `align` (`'left'` | `'center'`), `size` (`'default'` | `'compact'` for forms/legal pages), `as` (`'h1'` default, `'h2'` when reused as an in-page banner), `eyebrow`, `description`, `actions`, `children` (rendered under the header, e.g. a progress bar).

### `PageLoading`

The shared loading state for org routes. Use it as every `<Suspense>` fallback on org pages — never `fallback={<></>}`.

```tsx
<Suspense fallback={<PageLoading />}>…</Suspense>
```

---

## UI Primitives (`components/ui/`)

These are shadcn/ui components built on Radix UI. Use them for all interactive controls. Do not rebuild from scratch what is already in this folder.

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant='default' size='lg'>Submit</Button>
<Button variant='outline' asChild><a href='/donate'>Donate</a></Button>
```

**Variants** (maps to Tailwind classes defined via `cva`):

- `default` — green background, white text. The primary call-to-action.
- `accent` — gold background, ink text. Only for donate / support ("act now") actions.
- `outline` — green border, green text, transparent background.
- `destructive` — red background for dangerous actions.
- `secondary` — bege background, dark-green text.
- `inverse` — white background, green text. Primary CTA on a green band.
- `outline-inverse` — white border/text. Secondary CTA on a green band.
- `ghost` — no background, hover fill.
- `link` — underline on hover, no background.

**Sizes**: `default`, `sm`, `lg`, `xl` (hero / page-level CTAs), `icon` (square), `icon-sm`, `icon-lg`, `clear` (no sizing applied).

Never wrap a `<Button>` in a `<Link>`/`<a>` (that nests interactive elements) — use `asChild`.

Use `asChild` to render as a link or other element while keeping button styles:

```tsx
<Button asChild variant='outline'>
  <Link href={url}>Read more</Link>
</Button>
```

use the button component for all interactive elements that look like buttons, even if they aren't semantically `<button>` (e.g. a link that looks like a button). This ensures consistent styling and behavior across the site. For non-button links, use `HawkLink` (see below) or Next.js `<Link>` directly.

### Other UI primitives

All available in `components/ui/`. Prefer these over rolling custom implementations:

`accordion`, `alert`, `avatar`, `badge`, `calendar`, `card`, `carousel`, `checkbox`, `dropdown-menu`, `horizontal-line`, `image-comparison-slider-horizontal`, `input`, `label`, `map`, `modal`, `popover`, `select`, `separator`, `switch`, `table`, `tabs`.

---

## Utility Components (`components/utils/`)

Higher-level wrappers that compose UI primitives with project-specific logic.

### `HawkLink`

**Always use `HawkLink` to render links from Payload CMS `LinkField` data.** It handles the internal/external split automatically — internal links become Next.js `<Link>` with the correct locale prefix; external links open in a new tab as an `<a>`.

```tsx
import HawkLinkComponent from '@/components/utils/HawkLink';

<HawkLinkComponent link={linkField} className='underline'>
  {/* optional custom children — defaults to link.label */}
</HawkLinkComponent>;
```

For non-CMS internal navigation, use Next.js `<Link>` directly with `transformUrl()`:

```tsx
import Link from 'next/link';
import { transformUrl, urls } from '@/utils/paths';

<Link href={transformUrl(lng, urls.news)}>News</Link>;
```

Never hardcode locale prefixes (`/pt/`, `/en/`) or route strings. Always use `transformUrl(lng, urls.key)`.

### `Input` / `TextArea` / `Checkbox` / `DatePicker`

Custom form controls located in `components/utils/`. They include label, hint text, and error message slots. Use these instead of bare `<input>` elements for consistency with project design.

```tsx
import Input from '@/components/utils/Input/Input';

<Input
  name='email'
  labelText='Email address'
  placeholder='you@example.com'
  errorMessage={errors.email?.message}
  onChange={handleChange}
  value={value}
/>;
```

Use React Hook Form + Zod for all form validation. Wire these components to RHF via the `onChange` / `value` props or with a Controller wrapper.

### `Spinner`

Loading indicator. Use wherever an async action is pending.

```tsx
import Spinner from '@/components/utils/Spinner/Spinner';

{
  isLoading && <Spinner />;
}
```

### `SectionTitle`

Standardized section heading with an optional subtitle and anchor ID, using the section-heading scale (`text-h2_semibold`) and a `bege-dark` bottom border.

```tsx
import SectionTitle from '@/components/ui/SectionTitle';

<SectionTitle title='Our Projects' sectionId='projects' subtitle='What we have been building' />;
```

### `SectionList`

A styled `<ul>` or `<ol>` with left-border items, used for feature lists, member lists, or step-by-step content.

```tsx
import SectionList from '@/components/ui/SectionList';

<SectionList
  items={[
    { label: 'Youth mobility', description: 'Erasmus+ KA1 exchange programmes' },
    { label: 'Community art', description: 'Local cultural events' },
  ]}
  ordered
/>;
```

---

## Images & Video

There are exactly two components for rendering media, both exported from `@/payload/components/Media`. Use them for **all** images and videos — never use `next/image`'s `<Image>`, a bare `<img>`, or a bare `<video>`/`<iframe>` directly.

- **`ImageMedia`** — the single source of truth for images.
- **`VideoMedia`** — the single source of truth for videos.

You pick the right one explicitly (there is no auto-dispatcher). Both handle lazy loading, responsive sizing, and optimization automatically. Use the `priority` prop on `ImageMedia` for hero images that should load immediately.

### ImageMedia

`ImageMedia` resolves URLs internally (via `getImagePayloadUrl` + `getMediaUrl`), applies a Cloudinary-derived LQIP blur placeholder, and auto-enables `fill` **only** for string/resource URLs whose dimensions are unknown. Static imports keep their intrinsic dimensions (and support width-only aspect scaling). It renders nothing when there is no image, so you don't need your own null guard for that.

Pass a Payload field or document via `resource` — it accepts an `ImageType` block field, a populated `Media` document, a URL string, or an unpopulated numeric relation (renders nothing):

```tsx
import { ImageMedia } from '@/payload/components/Media';

// Payload CMS image (ImageType field or Media relation)
<ImageMedia resource={article.mainImage} className='object-cover' />

// Static import (intrinsic size, or width-only aspect scaling)
import hero from '@/public/hero.png';
<ImageMedia src={hero} priority />
<ImageMedia src={logo} width={150} />

// Fixed dimensions
<ImageMedia resource={item.image} width={120} height={40} />
```

Props of note: `resource` / `src`, `alt`, `width`, `height`, `fill`, `priority`, `quality`, `loading`, `sizes`, `className` (applied to the `<img>`), `pictureClassName` (only set this if you actually need a `<picture>` wrapper — otherwise the component renders a bare optimized `<img>`), `draggable`, and `unoptimized`.

Use `unoptimized` for arbitrary external/user-supplied URLs that aren't covered by `next.config.ts` `remotePatterns` (e.g. member-submitted image URLs). Do **not** pass `placeholder`/`blurDataURL`/`style` — the component owns the blur, and style should be expressed via `className`.

If you need the raw resolved `{ url, alt, width, height }` for layout math (container heights, aspect ratios), you may still call `getImagePayloadUrl()` from `@/lib/image` for that logic, but render the image through `<ImageMedia resource={...} />`.

### VideoMedia

`VideoMedia` handles Payload media uploads, direct video URLs, and YouTube/Vimeo embeds (auto-detected), plus IntersectionObserver-based autoplay for direct videos.

```tsx
import { VideoMedia } from '@/payload/components/Media';

<VideoMedia src={videoUrl} controls muted title='Intro' videoClassName='h-full w-full' />

// Decorative background clip
<VideoMedia resource={media} autoPlay loop muted controls={false} />
```

Props: `resource` / `src`, `autoPlay`, `loop`, `muted`, `controls`, `poster`, `title` (iframe title for embeds), `videoClassName` / `className`, `onClick`.

### Cloudinary

Cloudinary images are stored under the `media/` folder and served via Cloudinary's CDN. Remote patterns are configured in `next.config.ts` — do not add new `remotePatterns` without updating that config (or pass `unoptimized` for one-off external URLs).

---

## `cn()` Utility

Use `cn()` from `@/lib/utils` (a `clsx` + `tailwind-merge` combination) whenever conditionally composing class names. Never use string concatenation or template literals for Tailwind class merging.

```tsx
import { cn } from '@/lib/utils';

<div className={cn('rounded-lg p-4', isActive && 'bg-green text-white', className)} />;
```

---

## Variant Props (`classname-variants`)

Use `variantProps` from `classname-variants/react` for components that need a small set of visual variants, following the pattern used by `Section`:

```tsx
import { tw, variantProps } from 'classname-variants/react';

const cardProps = variantProps({
  base: tw`rounded-lg bg-white`,
  variants: {
    size: {
      sm: tw`p-4`,
      md: tw`p-6`,
      lg: tw`p-8`,
    },
  },
  defaultVariants: { size: 'md' },
});

export const Card = (props: CardProps) => <div {...cardProps(props)}>{props.children}</div>;
```

For components with many variants or that need `asChild`, prefer `cva` from `class-variance-authority` (used by `Button`).

---

## `'use client'` Directive

Only add `'use client'` when the component genuinely requires it:

- Uses React hooks (`useState`, `useEffect`, `useRouter`, `useSearchParams`, etc.)
- Attaches browser event listeners
- Uses browser-only APIs

Server components are the default. Fetching data, reading Payload collections, and generating metadata all happen in server components or `async` page/layout files.

---

## Component File Conventions

- **Folder-based**: each component gets its own folder with an `index.tsx` export when it has multiple files. Single-file components can live directly in the feature folder.
- **Named exports** preferred over default exports for components in `components/ui/` and `components/layout/`. Feature components (e.g. `components/news/`) may use default exports.
- **Co-locate stories**: Storybook stories live alongside the component as `ComponentName.stories.tsx`.
- **Types**: shared prop types that cross component boundaries live in `components/types.ts`.

## Structure of the component

- The component file should be structured in the following order:
  - Static data should be on the config level, not inside the component. If the component needs static data (e.g. a list of items for a feature list), define it outside the component function, either in the same file or imported from a separate `config.ts` file.
  - The component file should contain only the component and its related logic. Avoid including unrelated helper functions or utilities in the same file. If needed, extract them to a separate file in the same folder (e.g. `utils.ts`).
