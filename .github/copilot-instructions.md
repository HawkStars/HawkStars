# HawkStars Codebase Guide

## Architecture Overview

This is a multilingual Next.js 15 application with Payload CMS backend, focused on a cultural organization's website. The architecture emphasizes internationalization (pt/en), headless CMS content management, and modern React patterns.

**Key Stack**: Next.js 15 + PayloadCMS 3.x + MongoDB + Tailwind + TypeScript + i18next

## Critical Development Patterns

### App Router Structure

- **`app/[lng]/`**: Internationalized routes with language parameter (`pt`, `en`)
- **`app/(payload)/`**: Payload admin panel routes (excluded from i18n middleware)
- **Component Structure**: Index files with folder-based organization (`components/home/HomeHeroSection/index.tsx`)

### Internationalization (i18n)

- **Language handling**: Automatic detection via `middleware.ts` → redirects to `/[lng]/path` using `withHandleInternalization`
- **Client translations**: Use `useTranslation('common')` from React i18next (no lng param needed in client)
- **Language context**: Access current language via `useMainAppContext().lng` from `AppProvider`
- **Path transformation**: Always use `transformUrl(lng, path)` from `utils/paths.ts` for internal links
- **Default locale**: Portuguese (`pt`) with English (`en`) fallback
- **Cookie handling**: Language preference stored in `i18next` cookie, managed by middleware

### Payload CMS Integration

- **Collections**: `ArtCollection`, `Pages`, `Contribution`, `HawkEvent`, `BoardMember`, `Curator`, `Partner`
- **Access patterns**: `authenticated` for CRUD, `anyone` for read operations
- **Type generation**: Run `pnpm payload:generate` after schema changes
- **Localized content**: Collections support pt/en via `localization` config

### Component Conventions

- **Client components**: Use `'use client'` directive for interactivity/hooks
- **Button component**: Custom `Button` component with `classname-variants` and variant props in `components/utils/Button.tsx`
- **URL constants**: Import from `utils/paths.ts` - never hardcode paths (use `urls` object)
- **External URLs**: Constants like `BE_MEMBER_FORM_URL` also defined in `utils/paths.ts`
- **Styling**: Tailwind with custom design system classes (e.g., `text-h1_semibold`, `bg-bege-light`)
- **State management**: Global state via `AppProvider` context (mobile nav, language) - use `useMainAppContext()`
- **Navigation**: Use `NavbarUrlItem` type for menu structures, `transformUrl()` for routing
- **Image handling**: Next.js Image with Cloudinary integration for remote patterns

## Development Commands

```bash
pnpm dev              # Start with Turbopack
pnpm build            # Production build with Turbo
pnpm payload:generate # Regenerate TypeScript types from CMS schema
pnpm format:fix       # Auto-format with Prettier + Tailwind plugin
```

## External Integrations

- **Media**: Cloudinary for image storage/optimization
- **Monitoring**: Sentry for error tracking
- **Database**: MongoDB via Mongoose adapter
- **Forms**: Google Forms integration for membership

## File Naming & Organization

- **Pages**: `app/[lng]/section/page.tsx` pattern
- **Components**: Folder-based with `index.tsx` exports
- **Collections**: PayloadCMS collections in `payload/collections/`
- **Utilities**: Helper functions in `utils/` with clear single responsibilities
- **Types**: Generated types in `payload-types.ts` (auto-generated)

## Key Configuration Files

- **`payload.config.ts`**: CMS schema, collections, globals, endpoints
- **`middleware.ts`**: i18n routing logic (excludes `/admin` routes)
- **`i18n/settings.ts`**: Language configuration and utilities
- **`next.config.ts`**: CSP headers, Cloudinary images, Payload integration

## Common Patterns

- **Language detection**: Use `withHandleInternalization` middleware pattern with cookie fallback
- **Type safety**: Leverage generated `payload-types.ts` for CMS data (auto-regenerated)
- **Responsive design**: Mobile-first with `lg:` breakpoint modifiers
- **Form handling**: React Hook Form with validation patterns
- **Image optimization**: Next.js Image component with Cloudinary remote patterns
- **Typography system**: Custom classes like `text-h1_semibold`, `text-h2_light` defined in `globals.css`
- **Color system**: Custom CSS variables (`--color-bege-light`, `--color-green`) in theme config
- **Component variants**: Use `classname-variants` for styled components with TypeScript props
- **Router handling**: Use Next.js `useRouter` from `next/navigation` (App Router)

## Testing & Quality

- **Linting**: ESLint with Next.js and Prettier configs
- **Type checking**: Strict TypeScript with Payload type generation
- **Format**: Prettier with Tailwind class sorting plugin (`prettier-plugin-tailwindcss`)
- **Security**: CSP headers configured in `next.config.ts` for production
