# CLAUDE.md — HawkStars Project Context

## Project Overview

HawkStars is the website for **Associação HawkStars** (Hawk Stars NGO), a Portuguese cultural/humanitarian non-profit organization based in Pinhel. The site is multilingual (Portuguese + English), content-managed via Payload CMS, and deployed to a self-hosted VPS via GitHub Actions.

**Production URL**: https://hawkstars.org

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, ESM modules)
- **CMS**: Payload CMS 3.x (embedded in the same Next.js app)
- **Database**: MongoDB via Mongoose adapter
- **Language**: TypeScript 6 (strict mode)
- **Styling**: Tailwind CSS 4 + custom theme variables in `app/globals.css`
- **i18n**: i18next + react-i18next (Portuguese default, English fallback)
- **Media**: Cloudinary (cloud storage + image optimization)
- **Monitoring**: Sentry (error tracking, source maps)
- **Testing**: Vitest (unit) + Storybook 10 (component dev/visual) + Chromatic (visual regression)
- **Package Manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **Node**: v24
- **Deployment**: PM2 on VPS, behind Nginx

## Commands

```bash
# Development
pnpm dev                    # Next.js dev server (webpack mode)
pnpm dev:inspect            # Dev with Node.js debugger

# Build & Production
pnpm build                  # Production build (4 GB heap)
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # ESLint check
pnpm format                 # Prettier check
pnpm format:fix             # Prettier auto-fix
pnpm typecheck              # tsc --noEmit (4 GB heap)
pnpm test                   # Vitest run

# Payload CMS
pnpm payload:regenerate     # Regenerate types + import map

# Storybook
pnpm storybook              # Dev server on port 6006
pnpm build-storybook        # Static build
```

## Project Structure

```
app/
├── (payload)/              # Payload admin panel (/admin)
│   ├── admin/              # Admin UI pages
│   ├── api/                # REST + GraphQL endpoints
│   └── layout.tsx
├── [lng]/                  # Internationalized frontend routes
│   ├── (org)/              # Main organization pages
│   │   ├── page.tsx        # Homepage
│   │   ├── news/           # News listing + [slug]
│   │   ├── projects/       # Projects listing + [slug]
│   │   ├── events/         # Events listing + [slug]
│   │   ├── contribute/     # Donations page
│   │   ├── team/           # Team page
│   │   ├── partners/       # Partners page
│   │   ├── transparency/   # Financial transparency
│   │   ├── art/            # Art gallery
│   │   ├── history/        # Organization history
│   │   ├── agenda/         # Calendar/agenda
│   │   ├── erasmus/        # Erasmus program
│   │   ├── preview/        # CMS live preview routes
│   │   └── [slug]/         # Dynamic CMS pages
│   ├── (crowdfunding)/     # Crowdfunding sub-site
│   └── (gaming)/           # Gaming sub-site
├── api/                    # API routes (donate, easypay, instagram, google)
├── globals.css             # Tailwind + custom theme + typography
└── sitemap.ts

components/                 # Frontend React components
├── Crowdfunding/           # Crowdfunding campaign components
├── GlobalVillage/          # Global Village project components
├── navbar/                 # Main navigation
├── footer/                 # Footer
├── ui/                     # shadcn/ui primitives (button, card, etc.)
├── layout/                 # Section, OffsetSection wrappers
├── contribute/             # Donation-related components
├── team/                   # Team member cards
├── partners/               # Partner cards + Leaflet map
├── transparency/           # Financial reports
├── news/                   # News post components
├── projects/               # Project page components
├── events/                 # Event page components
├── art/                    # Art gallery components
├── payload/                # Payload-specific frontend components
└── utils/                  # Button, shared utilities

payload/                    # Payload CMS configuration
├── access/                 # Access control (anyone, authenticated, admin, editor)
├── blocks/                 # ~40 reusable content blocks (each: config.ts + Component.tsx + stories)
├── collections/            # Content types: Users, Media, Pages, News, HawkProject,
│                           #   HawkEvent, ArtCollection, BoardMember, Contribution,
│                           #   Curator, Partner, Sponsor, Notification, Documents
├── globals/                # Header, Footer, MainPage, NewsList, ProjectsList,
│                           #   EventsList, WebsiteSettings, CrowdfundingSettings
├── components/             # Admin UI components (Logo, RichText, LivePreview, admin panels)
├── fields/                 # Custom fields (Link, Image, SectionID, etc.)
├── hooks/                  # Lifecycle hooks (notifications, status validation, etc.)
├── jobs/                   # Background jobs (Instagram token refresh, notification cleanup)
├── plugins/                # Plugin config (SEO, cloud storage, etc.)
├── endpoints/              # Custom API endpoints (dashboard stats, notifications)
├── migrations/             # DB migrations
└── utilities/              # Helper functions (getURL, getMediaUrl, canUseDOM)

i18n/
├── settings.ts             # Language config: languages=['pt','en'], defaultNS='common'
├── client.ts               # Client-side i18n setup
├── index.ts                # Server-side i18n setup
└── locales/
    ├── pt/                 # Portuguese translations
    └── en/                 # English translations

lib/
├── constants.ts            # BASE_URL, SITE_NAME, OG_IMAGE, GA_MEASUREMENT_ID
├── cloudinary/             # Cloudinary upload/config
├── google-drive/           # Google Drive integration
├── flags/                  # Feature flags
├── payload/                # Payload helpers + custom endpoints
├── utils.ts                # cn() classname merge utility
├── image.ts                # Image utilities
└── icon.tsx                # Icon component

utils/
├── paths.ts                # URL constants (urls object) + transformUrl()
├── metadata.ts             # SEO metadata helpers
├── page.ts                 # Page utilities
├── contexts/               # React contexts (AppProvider)
├── middlewares/             # Middleware utilities (i18n handling)
├── models/                 # Data models
├── payment/                # Payment integration (EasyPay)
└── storybook.ts            # Storybook helpers

types/                      # Global TypeScript declarations
stories/                    # Storybook stories for non-block components
```

## Critical Development Patterns

### Internationalization (i18n)

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

### Payload CMS

Payload is the source of truth for all site content (with minor exceptions in `i18n/locales/` YAML files).

- **Admin panel**: Accessible at `/admin`.
- **Localization**: Collections support `pt` and `en` via Payload's localization config.
- **Type generation**: Auto-generated types in `payload-types.ts`. Regenerate with `pnpm payload:regenerate`.
- **Access control**: `authenticated` for CRUD, `anyone` for read operations. Additional roles: `authenticatedAdmin`, `authenticatedEditor`.
- **Email**: Gmail via OAuth2 (nodemailer), sender: `tech@hawkstars.org`.

#### Block Development Workflow

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

### Component Conventions

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

### Custom Theme / Design System

Colors defined in `app/globals.css` as CSS variables:

- `--color-green: #0a7558` (primary)
- `--color-bege-dark: #fae7d0` / `--color-bege-light: #fef9f6` (background tones)
- `--color-disabled: #5b5b5b`
- `--color-linkedin: #0a66c2`
- Gaming theme: `--color-gaming-*` variables
- Crowdfunding theme: `--color-crowdfunding-bg: #0d0d0d`

Typography custom classes: `text-h1_semibold`, `text-h2_light`, `text-body`, etc. (defined in `globals.css` `@layer components`).

### Path Aliases

Configured in `tsconfig.json`:

- `@/*` → project root (`./`)
- `@payload-config` → `./payload.config.ts`

## Code Quality Rules

- **Max line length**: 140 characters (ESLint enforced)
- **Formatting**: Prettier with `singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 100`
- **Tailwind sorting**: `prettier-plugin-tailwindcss` auto-sorts classes
- **Strict TypeScript**: No `any` without justification
- **Pre-push hook** (Husky): runs `pnpm lint` + `pnpm tsc` + `pnpm build` (build skipped in CI)

## Environment Variables

Required (see `.env.example`):

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Payload CMS auth secret |
| `NEXT_PUBLIC_BASE_URL` | Public site URL |
| `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Media storage |
| `EASYPAY_API_URL/API_KEY/ACCOUNT_ID` | Payment processing |
| `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN/EMAIL_USER` | OAuth email + Drive |
| `INSTAGRAM_ACCESS_TOKEN/USER_ID` | Instagram feed integration |
| `SENTRY_AUTH_TOKEN` | Error tracking (production) |

## CI/CD & Deployment

**Workflow**: `.github/workflows/deploy.yml`

```
Push to main → Lint + Type Check → SSH to VPS → git pull →
pnpm install --frozen-lockfile → rm -rf .next → pnpm build →
PM2 restart → Update GitHub deployment status
```

Storybook is built and published to Chromatic in a separate job.

**Important**: Deployment fails if lint or type checks fail. Always run `pnpm lint` and `pnpm typecheck` before pushing to `main`.

## External Integrations

- **Cloudinary**: Image/media storage and CDN optimization
- **Sentry**: Error tracking + performance monitoring (org: `hawkstars`, project: `website`)
- **EasyPay**: Portuguese payment gateway for donations (test + production APIs)
- **Google APIs**: Gmail OAuth2 (email sending), Google Drive (document storage)
- **Instagram**: Graph API for social feed (token auto-refreshed via Payload job)
- **Leaflet**: Interactive maps for partners page
- **Chromatic**: Visual regression testing for Storybook

## Common Troubleshooting

- **Build memory errors**: The build script already sets `--max-old-space-size=4096`. Increase if needed.
- **Block not rendering**: Run `pnpm payload:regenerate` and check the block is in the collection's blocks array.
- **Type errors after schema change**: Run `pnpm payload:regenerate`.
- **i18n not working**: Verify middleware is running and links use `transformUrl()`.
- **Images broken**: Check Cloudinary credentials and `next.config.ts` `remotePatterns`.
- **Storybook styles missing**: Ensure `globals.css` is imported in `.storybook/preview.ts`.
- **Clean rebuild**: `rm -rf .next && pnpm dev`
