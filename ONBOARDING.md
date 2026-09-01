# HawkStars — Onboarding

Hawk Stars NGO's website: a bilingual (English/Portuguese) Next.js application with Payload CMS embedded, covering the public NGO site, a crowdfunding micro-site, and a gaming/fundraiser section. Repo: `github.com/HawkStars/HawkStars`, deployed on a self-managed VPS (not Vercel).

## Stack

- **Framework**: Next.js ~16.3.3 (App Router), React ~19.2.8, TypeScript ^6.0.3
- **CMS**: Payload CMS ^3.88.0, embedded directly in the Next.js app (not a separate service) — mounted at `app/(payload)/admin` and `app/(payload)/api`
- **Database**: MongoDB, via `@payloadcms/db-mongodb` (`DATABASE_URI`, defaults to `mongodb://localhost:27017/hawkstars`)
- **Styling**: Tailwind CSS ^4.3.3 (config at `tailwind.config.ts` + `app/globals.css`), shadcn/Radix UI component system (`components.json` — "new-york" style, `components/ui/`)
- **i18n**: i18next ~26.3.6 + react-i18next — two locales, `pt` (default/fallback) and `en`
- **Testing/quality**: Vitest ^4.1.11 (unit tests + Storybook browser tests via Playwright), Storybook ^10.5.10 with Chromatic visual regression, ESLint ^10.9.1 (flat config), Prettier ^3.9.6 (+ `prettier-plugin-tailwindcss`), Husky (pre-commit hooks via the `prepare` script)
- **Error tracking**: Sentry (`@sentry/nextjs`, `@payloadcms/plugin-sentry`)
- **Package manager**: pnpm (there's a stray `package-lock.json` in the repo, last touched months ago; `pnpm-lock.yaml` is the actively-updated lockfile and what CI/deploy use)

## Architecture at a glance

This is one Next.js app, not a set of microservices. Payload's admin panel, GraphQL API, and REST API all live inside the same app under `app/(payload)/`. The public site consumes Payload data through server-side query functions in `lib/payload/queries/`, not over HTTP.

Route-level middleware is named `proxy.ts` at the repo root, not `middleware.ts` — Next.js 16 renamed the convention from "middleware" to "proxy". It does two things: for any path containing `admin` it just tags the response with an `x-pathname` header and passes through; everything else goes through `withHandleInternalization` (`utils/middlewares/`), which is the locale-detection/routing layer. Its matcher excludes `api`, `sitemap`, `robots`, `llms`/`llms-full`, `_next/static`, `_next/image`, `images`, and `favicon`.

Media storage is not local disk — two different cloud adapters are wired in via `@payloadcms/plugin-cloud-storage` (registered in `payload/plugins/index.ts`):
- The `Media` collection (images) → **Cloudinary**, local disk storage disabled
- The `Documents` collection (files) → **Google Drive**, local disk storage disabled, and Drive also handles that collection's access control directly (`disablePayloadAccessControl: true`), bypassing Payload's own

The plugin stack (`payload/plugins/index.ts`) is: a custom `showLocaleValuesPlugin`, `@payloadcms/plugin-seo`, the cloud-storage plugin above, `@payloadcms/plugin-sentry` (captures 400/403/500s with the request locale tagged), and — registered last "cause of overrides" — `payload-totp`.

Other integrations to know about: **EasyPay** (a Portuguese payment processor — donations/subscriptions), **Google OAuth + Drive** (both for the Documents collection and for a separate crowdfunding-supporters spreadsheet), **Gmail OAuth2** for transactional email (`nodemailer`, wired up only when `NODE_ENV=production` — `payload.config.ts` asserts the Google OAuth env vars at boot in prod), and **LibreTranslate** (a self-hosted translation service backing an admin "Translate" content-helper view at `/admin/translate`).

**2FA**: confirmed in `payload/plugins/index.ts` — `payloadTotp({ collection: 'users', forceSetup: NODE_ENV === 'production', totp: { issuer: 'HawkStars Admin', digits: 6, period: 30 }, disabled: NODE_ENV === 'development' })`. So TOTP is forced-setup in production and fully disabled in dev.

## Directory map

| Path | What's there |
|---|---|
| `app/` | Next.js App Router. `[lng]/(org)/` is the main public site, `[lng]/(crowdfunding)/` and `[lng]/(gaming)/` are separate sub-sections, `(payload)/` mounts the CMS admin+API, `api/` holds custom REST routes (donations, EasyPay webhook, health check, Instagram feed, member-project submissions). |
| `payload/` | All server-side CMS config: `collections/`, `globals/`, `access/`, `blocks/` (page-builder blocks), `fields/`, `hooks/`, `endpoints/` (custom API routes), `plugins/`, `jobs/`, `migrations/`, `seed.ts`. |
| `components/` | Shared React UI, organized by feature (`art`, `events`, `projects`, `team`, `transparency`, `Crowdfunding`, `gaming`, `contribute`, `members-corner`, `news`, `partners`, `agenda`, `curator`, …) plus cross-cutting `layout/`, `navbar/`, `footer/`, `seo/`, `shared/`, and `ui/` (shadcn primitives). |
| `lib/` | Server/client utilities: `payload/` (query functions — the main way pages read CMS data), `cloudinary/`, `google-drive/`, `instagram/`, `sentry/`, `flags/`. |
| `i18n/` | i18next setup — `settings.ts` (locale list), `index.ts` (server translation, memoized), `client.ts` (client hook), `locales/{en,pt}/*.json`. |
| `utils/` | `paths.ts` (route constants + sitemap), `metadata.ts` (SEO), `payment/`, `middlewares/` (incl. `withHandleInternalization`), `models/`, `rateLimit.ts`. |
| `stories/` | Storybook stories not co-located with their component (footer, navbar, misc utils). Most stories live next to their component as `*.stories.tsx`. |
| `types/`, `public/` | Shared TS types; static assets. |

Root config worth knowing: `payload.config.ts` (Payload's own config — collections/globals/plugins are registered here, with `assert()` calls that fail the boot loudly if required env vars are missing), `payload-types.ts` (generated — never hand-edit, regenerate with `pnpm payload:regenerate`), `proxy.ts` (locale routing, see above), `next.config.ts` (wraps the config with `withPayload` then `withSentryConfig`; also sets a static, nonce-free CSP — deliberately static rather than nonce-based because this app relies on `generateStaticParams` and `'use cache'`, which are incompatible with per-request nonces; see `AUDIT.md` SEC-M3), `tailwind.config.ts`, `ecosystem.config.cjs` + `nginx.conf` (production process/reverse-proxy config for the VPS deploy).

## The public site's sections

Under `app/[lng]/(org)/`: home (`page.tsx`), `art`/`artwork`/`curator` (the social-impact art gallery, curators, and individual artwork pages), `projects` and `events` (each with an `/archive` sub-route for past items, paginated and filterable by type/year), `news`, `agenda` (activity calendar), `contribute` (donations), `erasmus` (EU youth-exchange program content), `history`, `how-to-help-us`, `members-corner`, `partners`, `store`, `team`, `transparency`, `[slug]` (generic Payload-driven pages), and `preview/*` (Payload live-preview rendering routes). `(crowdfunding)` and `(gaming)` are separate route groups for those two sub-sites.

## Payload collections & globals

**Collections** (declaration order in `payload.config.ts`): `Users` (admin auth, role flags `isAdmin`/`isEditor` rather than a separate roles collection), `Media`, `Documents`, `ArtCollection` (artworks), `BoardMember`, `Contribution`, `Curator`, `HawkProject`, `HawkEvent`, `MemberProject`, `Partner`, `Sponsor`, `Pages`, `News`, `Notification`.

**Globals**: `Header`, `Footer`, `MainPage` (homepage), `NewsList`/`ProjectsList`/`EventsList` (per-section listing-page config), `Settings` (exported as `WebsiteSettings`, slug `settings`), `CrowdfundingSettings`.

**Access control** (`payload/access/`): four composable functions — `anyone`, `authenticated`, `authenticatedAdmin` (`user.isAdmin`), `authenticatedEditor` (`user.isEditor || user.isAdmin`).

**`Users` collection**, confirmed field-by-field: just `name` (text) plus two checkboxes, `isAdmin` and `isEditor` (both default `false`, both only shown in the admin UI once `isAdmin` is true on the viewer). `create`/`update`/`delete` require `authenticatedAdmin`; `read`/admin-panel access require any `authenticated` user. Auth config: 30-day token expiration, lockout after 5 failed attempts for 24 hours, cookies forced `secure` in production with `sameSite: 'Lax'`. Two custom hooks: `afterLogin` logs login activity, and `beforeLogin` rate-limits by IP (a separate, coarser guard than the per-account lockout above).

One recurring gotcha: a collection's "type" field is not consistently named `type` — e.g. `News.type`, but `HawkProject.project_type` and `HawkEvent.type_event`. Always check `payload-types.ts` rather than assuming.

## i18n

Locale JSON lives at `i18n/locales/{en,pt}/<namespace>.json`. Confirmed namespace files: `agenda`, `art`, `common`, `contribute`, `crowdfunding`, `erasmus`, `erasmus-ka`, `events`, `gaming`, `hawkstars`, `how-to-help-us`, `members-corner`, `metadata`, `partners`, `projects`, `team`, `terms`, `training_center`, `transparency`. Not every section has its own file — `news`, `curator`, `store`, and `history` have none and fall through to `common`, which already holds some shared enum-label maps (worth checking there before adding new ones). `common` is the default/fallback namespace. Server components call `getServerTranslation(lng, ns)` from `i18n/index.ts` (deliberately memoized per language+namespace to avoid reallocating i18next instances on every render); client components use the `useTranslation(lng, ns)` hook from `i18n/client.ts`. Payload's own admin UI is localized separately via `@payloadcms/translations` (`en`/`pt` language packs registered in `payload.config.ts`), unrelated to this app-facing system.

## Day-to-day commands

```
pnpm dev                   # start the dev server
pnpm dev:inspect           # dev server with --inspect for debugging
pnpm build                 # production build (NODE_OPTIONS=--max-old-space-size=4096)
pnpm start                 # start the production build
pnpm typecheck             # tsc --noEmit (also with the larger heap size)
pnpm lint                  # eslint .
pnpm format / format:fix   # prettier --check / --write (respects .gitignore)
pnpm test                  # vitest run
pnpm storybook             # Storybook dev server (localhost:6006)
pnpm build-storybook       # production Storybook build
pnpm payload:regenerate    # regenerate payload-types.ts + import map after
                           # changing a collection/global/block
pnpm migrate               # run Payload DB migrations
```

**Important**: `tsc --noEmit` alone can report a false-clean run off a stale `tsconfig.tsbuildinfo`. Use `tsc --noEmit --incremental false` when you need a trustworthy check (e.g. after a bulk change or before trusting a suspiciously clean result).

Husky is wired up via the `prepare` script — expect a pre-commit hook to run when committing locally (check `.husky/` for exactly what it runs).

## Testing & CI

Vitest is configured with two projects (`vitest.config.ts`): a plain `node`-environment project for unit-style tests (a few API route tests under `app/api/*/route.test.ts`), and a `storybook` project that runs Storybook stories in real browser mode via `@storybook/addon-vitest` + `@vitest/browser-playwright` (Chromium). Storybook itself (`.storybook/main.ts`) uses the `@storybook/nextjs-vite` framework, pulls stories from `stories/`, `payload/blocks/`, and `components/`, and layers on `@storybook/addon-a11y`, `@storybook/addon-docs`, `@chromatic-com/storybook`, and `msw-storybook-addon` (for API mocking).

ESLint (`eslint.config.mjs`) is a flat config built from `eslint-config-next`'s `core-web-vitals` and `typescript` rule sets plus `eslint-config-prettier` to disable stylistic overlap, with a couple of local tweaks: `@typescript-eslint/no-unused-vars` is a warning (ignoring `_`-prefixed names) rather than an error, and `max-len` is a 140-char warning.

CI (`.github/workflows/deploy.yml`) triggers on push to `main` and on PR open. The `check` job (always runs) does `pnpm install --frozen-lockfile`, `pnpm lint`, then `pnpm tsc`. A `storybook` job builds Storybook and pushes it to Chromatic for visual regression. Only on push to `main`, after `check` passes, the `deploy` job SSHes into the production VPS, fetches and hard-resets to `origin/main`, regenerates `.env` from GitHub Secrets, clears the `.next` cache, runs `pnpm install --frozen-lockfile && pnpm build && pnpm migrate`, then restarts the app via **PM2** (`pm2 start ecosystem.config.cjs`, process name `hawkstars`, `pm2 save` to persist across reboots) behind **nginx**.

There's also a separate daily workflow (`.github/workflows/db-backup.yml`, cron `17 3 * * *` UTC) that SSHes into the same VPS, runs `mongodump` on the production `hawkstars` database, and uploads the gzipped archive straight to Google Drive via the Drive REST API (reusing the site's existing Google OAuth refresh token — needs Drive scope, not just Gmail), pruning anything older than 14 days.

There is no Dockerfile anywhere in the repo (only a leftover `.dockerignore`) and no `docker-compose` — this app is not containerized, deploy is directly onto the VPS as above.

Recent commit history pushes fairly directly to `main` rather than a strict PR-per-feature flow, though the CI `check` job does run on PR open too.
