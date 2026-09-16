# HawkStars

The website of [Associação HawkStars](https://hawkstars.org), a Portuguese NGO in
Pinhel. Next.js 16 (App Router) + Payload CMS 3 + MongoDB, deployed to a VPS by
GitHub Actions and PM2 behind nginx.

Portuguese is the default locale; English is secondary.

## Getting started

```bash
pnpm install
cp .env.example .env    # then fill it in — see below
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, or
[/admin](http://localhost:3000/admin) for the CMS.

## Environment variables

`.env.example` is the source of truth for local development: every variable is
listed there with a comment explaining what it does and whether it is optional.
Copy it to `.env` and fill it in.

**Production values are not read from `.env` on the server.** The deploy
workflow writes `/root/app/.env` from GitHub Actions secrets on every release
(`.github/workflows/deploy.yml`), so a variable only takes effect in production
once it exists as a repository secret at
**Settings → Secrets and variables → Actions**.

### Secrets to add or check

These are the ones currently missing, incomplete, or newly wired up. The rest
are already set.

| Secret | Status | What happens without it |
| --- | --- | --- |
| `EASYPAY_WEBHOOK_SECRET` | **Check this first** | The webhook fails **closed**: every EasyPay callback is rejected with 401 and **no donation is ever marked confirmed**, so the public transparency total silently under-reports. Set the same value in the EasyPay dashboard's notification config, sent as an `x-webhook-token` **header** (not a `?token=` query parameter — nginx writes full URLs to `access.log`). Every rejection is reported to Sentry. |
| `LIBRETRANSLATE_URL` | **Add** | The admin's "Traduzir do PT" button falls back to `http://localhost:5000` and fails on every use in production, each failure landing in Sentry. |
| `LIBRETRANSLATE_API_KEY` | Add if needed | Only required if your LibreTranslate instance demands a key. Omitted from the request entirely when unset, because public instances reject an empty one. |
| `GEOCODING_CONTACT_EMAIL` | **Add** | Falls back to `tech@hawkstars.org`. Nominatim's usage policy requires a contact address in the User-Agent; without a real one they may rate-limit or block the geocode endpoint. |
| `DATABASE_URI` | Optional, for later | Falls back to `mongodb://localhost:27017/hawkstars` — **unauthenticated**, which is how Mongo currently runs. Once you enable `authorization` on the VPS, set this to `mongodb://<user>:<pass>@localhost:27017/hawkstars?authSource=admin` and both the app and the nightly backup pick it up with no further change. |

### Not an environment variable

Two things look like configuration but are not:

- **The crowdfunding supporters spreadsheet** is the `crowdfundingFileId` field
  on the **Settings** global in the admin panel, not an env var. (`.env.example`
  used to document a `GOOGLE_CROWDFUNDING_SUPPORTERS_FILE_ID` that nothing reads.)
- **The nginx rate limit and asset cache** live in `/etc/nginx/nginx.conf` on the
  VPS. A reference copy is committed as `nginx.main.conf`; keep it in step when
  you change the live file. Do **not** move those two `*_zone` declarations into
  `nginx.conf` (the site config) — declaring a shared-memory zone twice is a hard
  nginx startup failure.

## Scripts

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build. **Run this before pushing** — CI builds too, but it is the slowest thing to discover in CI |
| `pnpm lint` | ESLint, `--max-warnings 0` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` / `pnpm format:fix` | Prettier check / write |
| `pnpm test` | Vitest (node suites + the Storybook browser project) |
| `pnpm check:stories` | Fails if any Storybook story reaches server-only code |
| `pnpm payload:regenerate` | Regenerate `payload-types.ts` and the import map. **Run after changing any collection, global or block config** |
| `pnpm migrate` | Run Payload migrations |
| `pnpm storybook` | Storybook on :6006 |

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`:

1. **check** — lint, format, typecheck, story-graph guard, tests and a full build
   against a throwaway Mongo. Runs on pull requests too.
2. **deploy** — SSH to the VPS, build into `.next.new`, migrate, swap the
   directory, `pm2 reload`, then poll `/api/health`. A failed health check rolls
   back the code, the dependency tree and the build.

   **Migrations are not rolled back.** Write them backward-compatible with the
   previous release (expand/contract), or a rollback leaves the old build against
   a migrated database.

3. **storybook** — Chromatic, on pull requests and on `main`.

A separate workflow, `.github/workflows/db-backup.yml`, dumps MongoDB to Google
Drive on a schedule, verifies the archive with `mongorestore --dryRun` before
uploading, and prunes backups older than 14 days.

PM2 runs **one** instance (`ecosystem.config.cjs`). That is deliberate:
`utils/rateLimit.ts` keeps its counters in a per-process Map, and Next's
`cacheMaxMemorySize` is a per-process LRU. Raising `instances` silently doubles
every rate limit — including the brute-force guard on the admin login — and
splits the cache. Move both to a shared store first.

## Further reading

- `AUDIT-2026-09-16.md` — current audit: what is open, what was fixed and why.
- `.claude/` — architecture notes, access-control model and conventions.
- `ONBOARDING.md` — orientation for someone new to the codebase.
- `STORYBOOK.md` — component-library conventions.
