# Development Patterns

## Internationalization (i18n)

- **Route structure**: All frontend routes are under `app/[lng]/` — the `lng` param is `pt` or `en`.
- **Default locale**: Portuguese (`pt`), fallback: English (`en`).
- **Client translations**: `useTranslation('common')` from react-i18next (no `lng` param needed).
- **Language context**: Access via `useMainAppContext().lng` from `AppProvider`.
- **URL construction**: Always use `transformUrl(lng, path)` from `@/utils/paths` for internal links. Never hardcode paths.

```typescript
import { urls, transformUrl } from '@/utils/paths';
const { lng } = useMainAppContext();
const aboutUrl = transformUrl(lng, urls.about); // → "/pt/about" or "/en/about"
```

- **URL constants**: All routes defined in `utils/paths.ts` → `urls` object.
- **External URLs**: Constants like `BE_MEMBER_FORM_URL` also in `utils/paths.ts`.
- **Cookie**: Language preference stored in `i18next` cookie, managed by middleware.

## Payload CMS

Payload is the source of truth for all site content (with minor exceptions in `i18n/locales/` YAML files).

- **Admin panel**: Accessible at `/admin`.
- **Localization**: Collections support `pt` and `en` via Payload's localization config.
- **Type generation**: Auto-generated types in `payload-types.ts`. Regenerate with `pnpm payload:regenerate`.
- **Access control**: `authenticated` for CRUD, `anyone` for read operations. Additional roles: `authenticatedAdmin`, `authenticatedEditor`.
- **Email**: Gmail via OAuth2 (nodemailer), sender: `tech@hawkstars.org`.

### Block Development Workflow

Each block lives in `payload/blocks/BlockName/` with three files:

1. `config.ts` — Payload field definitions
2. `Component.tsx` — React rendering component
3. `BlockName.stories.tsx` — Storybook stories

Steps to add a new block:
1. Create block folder with the 3 files above
2. Export block from `payload/blocks/index.tsx`
3. Add to relevant collection's blocks array
4. Run `pnpm payload:regenerate` to update types + import map
5. Verify rendering in Storybook

## Component Conventions

- **Client components**: Use `'use client'` directive for interactivity/hooks.
- **Organization**: Folder-based with `index.tsx` exports.
- **Button**: Custom `Button` with `classname-variants` in `components/utils/Button.tsx`.
- **UI primitives**: shadcn/ui components in `components/ui/` (Radix UI based).
- **Styling**: Tailwind CSS primarily. Custom classes (e.g., `text-h1_semibold`, `bg-bege-light`) in `globals.css`.
- **Variants**: Use `classname-variants` for component variant props.
- **State**: Global state via `AppProvider` context → `useMainAppContext()`.
- **Images**: Next.js `Image` component with Cloudinary remote patterns.
- **Responsive**: Mobile-first with `lg:` breakpoint modifiers.
- **Forms**: React Hook Form with Zod validation.

## Custom Theme / Design System

Colors defined in `app/globals.css` as CSS variables:

- `--color-green: #0a7558` (primary)
- `--color-bege-dark: #fae7d0` / `--color-bege-light: #fef9f6` (background tones)
- `--color-disabled: #5b5b5b`
- `--color-linkedin: #0a66c2`
- Gaming theme: `--color-gaming-*` variables
- Crowdfunding theme: `--color-crowdfunding-bg: #0d0d0d`

Typography custom classes: `text-h1_semibold`, `text-h2_light`, `text-body`, etc. (defined in `globals.css` `@layer components`).

## Path Aliases

Configured in `tsconfig.json`:

- `@/*` → project root (`./`)
- `@payload-config` → `./payload.config.ts`
