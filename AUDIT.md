# HawkStars — Application Audit

**Date:** 2026-09-10
**Scope:** Full independent sweep — security, performance & caching, code quality / tech debt / testing, SEO, i18n, accessibility.
**Baseline:** working tree at `main` (`081890ea`) **with 9 uncommitted modifications** (see QUA-1 — they matter). ~44,700 lines across `app/`, `components/`, `lib/`, `payload/`, `utils/`, `i18n/`, `types/`.

## Method

This audit was built **from the current source only**. The previous `AUDIT.md` (deleted in the working tree) was not read for findings, no prior finding IDs were carried over, and no prior conclusion was reused — where a finding here matches an old one, it is because the code independently produced it again.

Four parallel passes read the code directly on the machine; every finding below carries a `file:line` that was actually opened. The toolchain was **run**, not inferred. Fourteen of the highest-severity claims were then re-verified by hand in a second pass (marked ✓ below) — including executing the JSON-LD escape in `node`, diffing the failing typecheck against a clean export of `HEAD`, and reading Payload's own `node_modules` source for the draft-visibility and access-fallback behaviour.

### Toolchain — actually executed

| Command | Result |
| --- | --- |
| `tsc --noEmit` (working tree) | ❌ **28 errors**, 25 of them in `components/events/EventPage.tsx` |
| `tsc --noEmit` (clean export of `HEAD`) | ✅ **0 errors** |
| `eslint .` | ✅ 0 errors, **6 warnings** |
| `prettier --check .` | ✅ clean — "All matched files use Prettier code style" |
| `vitest run` | ⚠️ **could not run** — environment limitation, not a repo defect |

The `vitest` failure is `Cannot find module '@rolldown/binding-wasm32-wasi'`. `node_modules` was installed on macOS; this session's shell is linux-arm64, so rolldown's native binding does not resolve. Pure-JS tools (`tsc`, `eslint`, `prettier`) ran fine. **The test suite's real status is unverified.** See QUA-5 — there is separate, independent evidence it cannot run in CI either.

---

## Executive summary

The engineering quality here is high in a way that is easy to miss in a list of 91 findings. Formatting is clean, `HEAD` typechecks with zero errors, there are **zero** `@ts-ignore`/`@ts-expect-error` in the entire repo, only 4 TODO comments, no stray `console.log`, no committed secrets, and — unusually — the code is *commented with its own reasoning*: `nginx.conf` explains its cache-lock strategy, `utils/rateLimit.ts` documents the `X-Forwarded-For` bypass it fixes and honestly flags its single-process assumption, `app/sitemap.ts` explains exactly why `_status` is applied to three collections and not the other three. Several findings below exist only because that reasoning was written down somewhere and then not applied everywhere.

Four things stand out as needing attention now.

**1. The working tree does not compile.** Someone is mid-way through replacing `Record<string, any>` with `Record<string, unknown>` in `EventPage.tsx`; it produces 28 type errors. `HEAD` is clean, so this is uncommitted work-in-progress — but it is sitting next to a deleted `AUDIT.md` and an uncommitted `deploy.yml` improvement, and nothing would stop it being committed.

**2. Nothing checks a pull request, and nothing checks the build at all.** In `deploy.yml`, `pull_request:` is indented one level too deep — it is a child of `push:`, not a sibling — so the `check` job has never run on a PR. And no job anywhere runs `pnpm build`. The deploy script's first action is `pm2 delete` + `rm -rf .next`, and only *then* does it build, on the production box. A commit that typechecks but fails `next build` takes the site down with no rollback path. These two facts compound: the exact class of error that only `next build` catches is also the class no gate is watching for.

**3. Unpublished content is publicly readable.** `findBySlug` in `lib/payload/queries/helpers.ts:26` filters on `slug` alone. `draft: false` does *not* exclude documents whose `_status` is `draft` — it only stops Payload merging the newest draft version over the top. With `autosave` enabled on `pages`, `news` and `hawk_projects`, an editor's in-progress draft is live at its public URL as they type, appears in the public `/news` listing, and (SEO-2) unpublished `pages` are submitted to Google in the sitemap. The author of `app/sitemap.ts:32-35` documented this Payload behaviour precisely and guarded against it *there* — the same guard just never reached the query layer.

**4. One line of security code does nothing at all.** `components/seo/JsonLd.tsx:61` reads `.replace(/</g, '<')`. In a JavaScript string literal `'<'` *is* the character `<`, so this replaces `<` with `<`. Confirmed by execution. With CMS-controlled titles flowing into JSON-LD and `'unsafe-inline'` in `script-src`, any account that can edit news or events has stored XSS. The fix is one backslash.

Nothing rated Critical. No credential is exposed, no unauthenticated write path was found, and the payment and public-submission flows are genuinely well defended — rate-limited, zod-validated, `is_confirmed` forced false at three independent layers, EasyPay's webhook using `timingSafeEqual` and failing *closed* when its secret is missing.

**Counts: 0 Critical · 18 High · 47 Medium · 26 Low.**

### Fix in this order

| # | Item | Effort | Why this position |
| --- | --- | --- | --- |
| 1 | **QUA-1** — fix or revert the 28 type errors in the working tree | 30 min | The repo does not compile right now |
| 2 | **QUA-2** — dedent `pull_request:` in `deploy.yml` | 2 min | Two-space fix; without it nothing below is enforced |
| 3 | **SEC-2** — one backslash in `JsonLd.tsx:61` (×4 sites) | 10 min | Stored XSS, trivially fixed |
| 4 | **SEC-1 / SEO-2** — `_status: published` in `findBySlug` and the sitemap's `pages` find | 45 min | Drafts are live to the public and being indexed |
| 5 | **QUA-4** — `member-projects` returns 200 on failure | 15 min | Members' submissions are being silently discarded |
| 6 | **QUA-3** — add `pnpm build` to CI; stop deleting prod before building | 2 h | Removes the "deploy takes the site down" failure mode |
| 7 | **SEO-1** — `notFound()` in the catch-all route | 30 min | Every stale deep URL is an indexable 200 |
| 8 | **PERF-4** — invalidation hooks for 5 globals + `media` + `pages` | 2 h | Editors publish and see nothing change for an hour |
| 9 | **PERF-3** — cache the homepage; wire up the dead `MAIN_PAGE_CACHE_TAG` | 1 h | Highest-traffic route, 2 uncached queries per hit |
| 10 | **PERF-1** — kill the `react-icons/lu` barrel import | 3 h | ~76 KB gzip on 70 of 117 pages |
| 11 | **SEC-9** — add the missing `delete`/`update` access keys | 20 min | Any editor can delete the donation ledger |
| 12 | **QUA-5** — `playwright install` step so `pnpm test` can run | 20 min | Unblocks the 136-story a11y gate that is configured but idle |

---

## Security

**SEC-1 — Unpublished and scheduled content is publicly readable · High ✓**
`lib/payload/queries/helpers.ts:26` — `const where: Where = { slug: { equals: slug } };` with `draft: opts?.preview ?? false` and no `_status` clause. Same shape in `lib/payload/queries/news.ts:34`. `pages`, `news` and `hawk_projects` all enable `versions.drafts` with `autosave` and `schedulePublish` (`Pages/index.ts:170`, `News/index.ts:153`, `HawkProject/index.ts:215`). Payload's `find` adds no `_status` predicate when `draft: false` — verified in `node_modules/payload/dist/collections/operations/find.js:103` and `@payloadcms/db-mongodb/dist/find.js:11`, and corroborated by the comment the author left at `app/sitemap.ts:32-35`.
*Impact:* anonymous visitors read never-published pages, news and projects at `/{lng}/{slug}`; drafts appear in the public `/news` listing; embargoed scheduled posts are readable before their date.
*Fix:* add `_status: { equals: 'published' }` to `where` whenever `opts?.preview` is falsy, gated on collections that actually have drafts (artworks, curators and events do not carry `_status`, and filtering them matches nothing — the sitemap comment explains this trap).
*Effort:* 30–60 min including a sweep of every `payload.find` in `lib/payload/queries/`.

**SEC-2 — JSON-LD escaping is a no-op; stored XSS via CMS content · High ✓**
`components/seo/JsonLd.tsx:61` — `JSON.stringify(schema).replace(/</g, '<')`. Executed on the machine: `node -e "…"` returns `{"a":"</script>"}` unchanged. Same no-op at `:118`, `:173`, `:225`; `:84` has no escape at all. CMS data flows in from `news/[slug]/page.tsx:58` and `events/[slug]/page.tsx:50`, and `next.config.ts:30` allows `'unsafe-inline'` in `script-src`.
*Impact:* `news` and `hawk_events` are `create/update: authenticated` — so **any** authenticated user, not just an admin, can execute script on every visitor of the page, including admins browsing the public site.
*Fix:* `.replace(/</g, '\\u003c')` (double backslash) at all four sites; better, a shared helper escaping `<`, `>` and `&`.
*Effort:* 10 min.

**SEC-3 — Full contribution documents serialized into the public `/contribute` page · Medium**
`lib/payload/queries/contribution.ts:17-30` fetches with `limit: 0`, no `select`, default `depth: 2`, via the Local API (which bypasses the `read: authenticatedAdmin` rule and the field-level `read: Boolean(user)` guard at `Contribution/index.ts:115`). The raw docs cross into a client component at `contribute/page.tsx:234` → `components/contribute/ChairsSection.tsx:15`. `ChairsSection.tsx:85,118` renders `contribution.donor` **without checking `is_anonymous`** — unlike `OrganizationContributionsTable.tsx:53-55`, which does.
*Impact:* `donor` (including anonymous ones), `value`, `transaction_key`, `easypay_id`, `payment_method` and the `extra_info` blob (which `donate/route.ts:62` fills with the whole gateway response) are embedded in the HTML of a public page.
*Fix:* `select` + `depth: 0` + a real `limit` in the query, map to a DTO that honours `is_anonymous`, and narrow the client component's prop type. *Effort:* 45 min.

**SEC-4 — The per-IP login rate limiter never runs on a failed login · Medium**
`payload/collections/Users/index.ts:48` registers `rateLimitLogin` as a `beforeLogin` hook. Payload fires `beforeLogin` **after** authentication succeeds — `node_modules/payload/dist/auth/operations/login.js:182` throws `AuthenticationError` on a bad password, and the hook block is at `:242`, inside the branch that only begins once authentication passed.
*Impact:* the control described in the code's own comment ("caps attempts per IP regardless of which account is targeted") does not exist. Credential spraying across many accounts from one IP is unthrottled at the app layer; only nginx's coarse `limit_req burst=60` applies. Per-account lockout (`maxLoginAttempts: 5`) still works.
*Fix:* move the check to `beforeOperation` with `operation === 'login'`, or into `proxy.ts` for `POST /api/users/login`. `getClientIp` itself is correct — keep it. *Effort:* 1 h.

**SEC-5 — Donor names + amounts mirrored into `notifications`, readable by any editor · Medium**
`payload/collections/Contribution/hooks/notifyContribution.ts:21-25,32` writes `Contribution from ${donor}` and `A contribution of €${value}…` — using `doc.donor` regardless of `is_anonymous`. `Notification/index.ts:24` sets `read: authenticated`.
*Impact:* the deliberate `authenticatedAdmin` boundary on contributions is defeated — any non-admin editor can `GET /api/notifications` and read every donor name paired with an exact amount.
*Fix:* drop name and value from the notification text (`docId` is already stored for the admin link), or raise `Notification.access.read` to `authenticatedAdmin`. *Effort:* 20 min.

**SEC-6 — TOTP is not enforced at the API layer for accounts that never enrolled · Medium**
`payload/plugins/index.ts:71-80` sets `forceSetup` in production, but that flag only drives the admin-UI redirect (`node_modules/payload-totp/dist/index.js:31-52`). The access check at `totpAccess.js:11-22` falls through to `return innerAccess(args)` when `user.hasTotp` is false.
*Impact:* a newly created admin who has not yet enrolled has full REST + GraphQL access with a password alone. Combined with SEC-4, password-only compromise of an un-enrolled account yields full CMS access. Enrolled users *are* correctly forced through TOTP.
*Fix:* reject `!user.hasTotp` in your own access wrapper, or enforce enrolment operationally and add a monitoring query over `users` where `hasTotp` is false. *Effort:* 1–2 h + an ops check of current rows.

**SEC-7 — Sentry Session Replay records all page text unmasked, on 10% of sessions · Medium**
`instrumentation-client.ts:43` — `maskAllText: false`, with `replaysSessionSampleRate: 0.1` and `enabled` in production.
*Impact:* 10% of sessions — public *and* Payload admin, since both are served by the same Next app and client instrumentation — are recorded in plaintext and shipped to Sentry. That covers the donation confirmation screen (donor name, Multibanco reference) and, for admin sessions, the contributions list, subscriber list and activity log. Sentry still masks `<input>` values by default; rendered text is not masked.
*Fix:* `maskAllText: true` with explicit `unmask` selectors, and skip replay entirely on `/admin`. *Effort:* 20 min.

**SEC-8 — CI actions that receive every production secret are pinned to floating tags · Medium**
`deploy.yml:65` `appleboy/ssh-action@v1` is handed `SSH_PRIVATE_KEY`, `SSH_PASSPHRASE` and, via `envs:`, `PAYLOAD_SECRET`, `CLOUDINARY_API_SECRET`, `EASYPAY_API_KEY`, `EASYPAY_WEBHOOK_SECRET`, all four Google OAuth secrets and `PERSONAL_GITHUB_TOKEN`. Also `actions/checkout@v7`, `pnpm/action-setup@v6`, `actions/setup-node@v7`, `chrnorm/deployment-action@v2`. `db-backup.yml:48` uses the same unpinned SSH action with the Drive token. Only `chromaui/action` is SHA-pinned.
*Impact:* tags are mutable — retargeting `v1` exfiltrates the entire secret set on the next deploy. (No `pull_request_target` anywhere, and `script:` blocks use shell variables not `${{ }}` expressions, so there is no template-injection sink — good.)
*Fix:* pin all six to full commit SHAs with a `# vX.Y.Z` comment; dependabot's `github-actions` ecosystem is already configured and will keep them fresh. *Effort:* 30 min.

**SEC-9 — Missing access keys let any authenticated user delete contributions and rewrite the header · Medium ✓**
`payload/collections/Contribution/index.ts:18-28` declares `read`/`create`/`update`/`admin` but **no `delete`**. `payload/collections/BoardMember.ts:18-23` — same, plus `read: () => true`. `payload/globals/Header/config.ts:14-16` declares only `read: anyone` — no `update`. Payload's fallback is permissive: `node_modules/payload/dist/auth/executeAccess.js:16-19` returns `true` for any `req.user`; globals get `defaultAccess` = `Boolean(user)`.
*Impact:* a non-admin editor who cannot read a single contribution can `DELETE /api/contributions/:id` and destroy the donation ledger, delete board members, and `POST /api/globals/header` to rewrite site-wide navigation.
*Fix:* `delete: authenticatedAdmin` on both collections, `update: authenticatedEditor` on the header global, then a startup assertion over `payload.config.collections` so a missing key fails loudly. *Effort:* 20 min.

**SEC-10 — MongoDB runs unauthenticated; unencrypted full dumps go to Drive on the app's own token · Medium**
`deploy.yml:133` writes `DATABASE_URI=mongodb://localhost:27017/hawkstars` — no credentials. `db-backup.yml:86` dumps from the same URI and uploads the archive **unencrypted** using `GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN` — the same OAuth credentials the running app holds in its `.env`.
*Impact:* (a) any process on the VPS, or any code-execution/SSRF-to-localhost primitive in the Node app, reads and writes the whole database with no credential — including password hashes and the plaintext `totpSecret` field. (b) 14 days of dumps containing donor PII, subscriber emails, password hashes and TOTP secrets sit in Drive, reachable with a token that also lives on the web server.
*Fix:* enable `security.authorization` and put credentials in the URI; `gpg --symmetric` the archive before upload with a `BACKUP_PASSPHRASE` secret; issue a **separate** OAuth client for backups. *Effort:* 2–3 h.

**SEC-11 — No minimum-length check on `PAYLOAD_SECRET`; local value is 7 characters · Medium (production value unconfirmed)**
`payload.config.ts:63` asserts presence only. The local `.env`'s `PAYLOAD_SECRET` is 7 bytes (length read only — values were never printed). This key HMACs the auth JWT and the `payload-totp` cookie (`payload-totp/dist/strategy.js:15`).
*Impact, if production is also short:* offline HS256 cracking of one captured `payload-token` recovers the key, letting an attacker mint an admin JWT **and** forge the TOTP cookie, bypassing SEC-6 entirely. The production value comes from a GitHub secret and could not be inspected — **verify before dismissing this.**
*Fix:* `assert((process.env.PAYLOAD_SECRET ?? '').length >= 32, …)` next to line 63, then rotate. *Effort:* 15 min + rotation.

**SEC-12 — GitHub PAT written to global git config, unset only on the happy path · Low**
`deploy.yml:102-111` runs under `set -e`; a failure of `git fetch` or `git reset --hard` skips the `--unset` at `:111`, leaving the PAT in `~/.gitconfig` in cleartext. Secondary: the `.env` heredoc at `:129` uses an unquoted `EOF`, so a secret containing a backtick or `$(` is mangled or executed on the server.
*Fix:* `trap '… --unset … || true' EXIT`; quote the heredoc delimiter. *Effort:* 30 min.

**SEC-13 — CMS link fields accept any URL scheme · Low**
`payload/fields/link.ts:99-111` — the custom-URL field has no `validate`; `ExternalHawkLink.tsx:14` renders it straight into `href`. Not XSS: React 19 blocks `javascript:` hrefs (`sanitizeURL` in `react-dom-client.production.js`) and browsers block top-level `data:` navigation — so the risk is open redirect / phishing.
*Fix:* the control already exists and is used elsewhere — apply `isHttpUrl` from `utils/paths.ts:121` (as `MemberProject/hooks/validateProjectUrl.ts:18` does) as a `validate` on the field. *Effort:* 30 min.

**SEC-14 — `graphql@17` on a public endpoint, against Payload's `^16.8.1` peer range · Low** — see QUA-6 for the full finding. `app/(payload)/api/graphql/route.ts:6` exposes it publicly; playground is correctly off in production and complexity capped at 1000 by Payload's defaults.

**SEC-15 — `payload-totp` silently rewrites every `read: anyone`; its `disabled` option is dead · Low**
`payload-totp/dist/index.js:91-96,177-182` wraps access on **every** collection and global unconditionally; `totpAccess.js:4-9` returns `false` with no user. So `read: anyone` on `pages`, `news`, `media`, `hawk_projects` is effectively "authenticated only" over REST/GraphQL. Separately, the `disabled:` option passed at `payload/plugins/index.ts:79` appears nowhere in the package's compiled source — only `disableAccessWrapper` is implemented.
*Impact:* the access tables in `payload/collections/*` do not describe real behaviour, which makes future access review unreliable. It may also be breaking three client-fetching blocks (`LatestNewsBlock`, `UpcomingHawkEventBlock`, `AgendaBlock`) that hit `/api/*` as anonymous users and silently render nothing on `!response.ok` — **unconfirmed at runtime.**
*Fix:* check those three blocks render on production; move their fetches server-side (which PERF-6 recommends anyway). Delete the dead `disabled:` option so it stops implying TOTP is off in dev. *Effort:* 1–2 h.

**SEC-16 — Google Drive folder resolved by name across the whole Drive, then made world-readable · Low**
`lib/google-drive/adapter.ts:29-33` interpolates `folderName` into the Drive query and searches `spaces: 'drive'` with no parent constraint; `GOOGLE_DRIVE_FOLDER_ID` is never used, and `createDriveFolder` (`:17-21`) creates at the Drive root. Every upload then gets `role: 'reader', type: 'anyone'` (`:77-83`). Query injection is blocked in practice because `folder` is a Payload `select` with fixed options, but the pattern is wrong regardless.
*Fix:* scope the lookup with `and '<FOLDER_ID>' in parents`, pass `parents:` on create, and map the four valid values to IDs instead of interpolating. *Effort:* 45 min.

**SEC-17 — Cloudinary upload failures are swallowed · Low**
`lib/cloudinary/adapter.ts:44-46` catches, reports to Sentry, and does not rethrow — so Payload saves a `media` document pointing at nothing. The Drive adapter gets this right at `:89-92`, with a comment explaining exactly why.
*Fix:* add `throw err;`. *Effort:* 5 min.

---

## Performance & caching

**PERF-1 — The whole `react-icons/lu` barrel (1,541 icons) ships to the browser on 70 of 117 pages · High ✓**
`lib/icon.tsx:1`, `payload/fields/ImageIcon/payload-lucide-icon.ts:2` and `payload/fields/ImageIcon/components/Field.tsx:5` all do `import * as LuIcons from 'react-icons/lu'`, then index dynamically — which defeats tree-shaking. In the build output, `.next/static/chunks/1be4jbfhyaz95.js` is 674,838 B raw / **75,776 B gzip**, contains 1,541 distinct `Lu*` names, and is referenced by 70 of 117 prerendered HTML files including `/pt/team`, `/pt/news`, `/pt/partners`. (Build output may be stale; the import pattern is confirmed in source.)
*Fix:* an explicit allow-list map built from deep imports, with the Payload `options` list generated from that map's keys — and keep the full-name list server-only via a generated JSON constant. *Effort:* 2–4 h.

**PERF-2 — `RichText` is a Client Component, dragging the whole 45-block registry into the browser · High**
`payload/components/RichText/index.tsx:1` is `'use client'` solely for `useLanguageCookie()` at `:219` — but `lng` is already available on the server at every call site (`[slug]/page.tsx:39`, `MainPageWrapper.tsx:14`). `RichTextWrapper.tsx` is a second `'use client'` shell that does nothing else.
*Impact:* every block in `getBlockComponents()` (`:119-165`) becomes a client module on any page rendering rich text, and the whole `layout` Lexical document is serialized into the RSC payload as a client prop on top of the HTML already rendered from it. ~30 of the 45 blocks are purely presentational and could stay on the server.
*Fix:* take `lng` as a prop, delete the wrapper, and mark only the genuinely interactive blocks `'use client'` at their own leaves. *Effort:* 1–2 days.

**PERF-3 — The homepage is uncached, its main global is fetched twice per request, and its revalidation tag is dead code · High ✓**
`lib/payload/main-page.ts:5-8` calls `await connection()` (opting out of `'use cache'`), and both `page.tsx:12` (`generateMetadata`) and `MainPageWrapper.tsx:15` call it — so nothing memoizes across the request. `grep -rn MAIN_PAGE_CACHE_TAG` returns **only** its own declaration and use in `revalidateMainPage.ts` — no `cacheTag()` anywhere ever writes it, so the hook invalidates nothing. In the build, `.next/server/app/pt.html` is 3,913 B (shell only) while other prerendered pages are 40–220 KB.
*Fix:* drop both `connection()` calls, wrap `getMainPageInfo` in `'use cache'` + `cacheLife('hours')` + `cacheTag(MAIN_PAGE_CACHE_TAG)` — mirroring `getHeaderQuery` at `lib/payload/queries/navbar.ts:7-19` — keeping the preview path uncached. *Effort:* 1 h.

**PERF-4 — Five globals plus `media` and `pages` have cached queries with no invalidation · High ✓**
`findGlobalCached` (`helpers.ts:73`) tags with `global:${slug}` and `cacheLife('hours')`; **nothing anywhere calls `revalidateTag('global:…')`.** Verified per global: `header`, `footer` and `main-page` have hook files; `news-list`, `projects-list`, `events-list`, `crowdfunding-settings` have none, and `Settings/config.ts:67` is literally `hooks: {},`. (And `main-page`'s hook is dead — PERF-3.) On the collection side, 9 of 16 have `createRevalidateHooks`; `media` has only notify hooks despite being embedded in every `depth ≥ 1` cached query, and `Pages` uses `revalidatePath` only, which does not clear the `cacheTag('pages:<slug>', 'pages')` set by `findPublishedCached`.
*Impact:* editors publish and see nothing change for up to an hour on `/news`, `/projects`, `/events`, crowdfunding, and every CMS `pages` document. A replaced image serves stale for a full cache generation.
*Fix:* a `createRevalidateGlobalHook(slug)` factory next to `payload/utilities/revalidateCollection.ts`, applied to the five globals; `createRevalidateHooks('media')`; `createRevalidateHooks(PAGES_CACHE_TAG)` alongside the existing `revalidatePage`. *Effort:* 2 h.
*Note:* where invalidation **does** exist, locale handling is correct — cache keys carry `locale` as an argument while tags are locale-independent, and `revalidatePage.ts:12-13` explicitly loops both languages.

**PERF-5 — Cloudinary transformations are written, wired up, and then commented out · High**
`next.config.ts:81-82` — `// loader: 'custom',` / `// loaderFile: './payload/components/Media/ImageMedia/cloudinaryLoader.ts',`. The loader itself is complete and correct (`cloudinaryLoader.ts:14`) and is dead code. `Media/index.ts:46-56` declares no `imageSizes`, so only the full-resolution original is stored (up to 50 MB per `payload.config.ts:280`).
*Impact:* for every (image × width × format), the single Node process fetches the **original** from Cloudinary, decodes it and re-encodes to AVIF+WebP with sharp — the most CPU-expensive path sharp offers — competing with SSR on one core (PERF-13). Cloudinary would do this at the edge for free, and `getCloudinaryBlurURL` (`lib/image.ts:27`) already proves the URL-transform pattern works here.
*Fix:* uncomment the two lines, then verify the non-Cloudinary `remotePatterns` (Instagram, Unsplash) — a custom loader bypasses `/_next/image` entirely, so those become unoptimized unless special-cased. *Effort:* 30 min to enable, half a day to verify.

**PERF-6 — Five content blocks fetch their own data after hydration · Medium**
`AgendaBlock/Component.tsx:73`, `LatestNewsBlock/Component.tsx:19`, `UpcomingHawkEventBlock/Component.tsx:27`, `SponsorsBlock/Component.tsx:19`, `InstagramGrid.tsx` — all `'use client'` + `useEffect` + `fetch` to uncached `/api/*` endpoints, each returning `null` before resolution.
*Impact:* HTML → JS → hydrate → fetch → paint, three serial round-trips; the server HTML contains nothing for these sections (invisible to crawlers) and each causes a layout shift. Agenda alone fires two API calls per visitor.
*Fix:* the presentational halves already exist as pure `*View` components — the split is done, only the data source needs to move server-side. `getConfirmedMemberProjects` (`lib/payload/queries/memberProject.ts:28`) is the model. *Effort:* 1 day.

**PERF-7 — The `header` global (depth 2) is serialized into every page's RSC payload twice · Medium**
`app/[lng]/(org)/layout.tsx:88-94` passes `headerInfo` to both `MobileNavbar` and `Navbar`, both `'use client'`. `MobileNavbar` returns `null` until opened (`index.tsx:68`) yet still receives the full object. `getHeaderQuery` uses `depth: 2` with no `populate`, while `getFooterQuery` (`navbar.ts:32-39`) correctly narrows with `populate`.
*Fix:* keep `Navbar` server-rendered with a small client hover controller (the Footer already demonstrates this split), render `MobileNavbar` only inside the open branch, and add `populate` to `getHeaderQuery`. *Effort:* half a day.

**PERF-8 — Sentry Replay is downloaded on every page load to serve a 10% sample · Medium**
`instrumentation-client.ts:46` guards `lazyLoadIntegration` on `typeof window` only, not on whether the session was sampled. `:22` sets `inheritOrSampleWith(0.5)`, so half of all navigations emit a trace. Sentry is in the root main chunk — `static/chunks/0-kev2lbld3fh.js`, 449,906 B raw / **138,900 B gzip**.
*Fix:* gate the lazy load behind an actual sampling decision; drop the trace rate to ~0.05; consider `replaysSessionSampleRate: 0` and keeping only error-replay. *Effort:* 1 h.

**PERF-9 — Leaflet stylesheets are in the site-wide CSS bundle · Medium**
`components/ui/map.tsx:54-55` statically imports `leaflet.css` and `leaflet.draw.css`, even though the file goes to real trouble to keep the *JavaScript* lazy (`:1174`). The shared stylesheet `1089_cuwymy-l.css` is 171,181 B raw / 27,243 B gzip, contains `leaflet-container`/`leaflet-draw`, and is referenced by 76 prerendered pages. The map appears on exactly one route.
*Fix:* move both imports inside the lazy `useLeaflet()` path, or inject them with a `<link>` from `SingleProjectTravelMapWrapper`. *Effort:* 1–2 h.

**PERF-10 — Unbounded and over-deep queries, with full documents crossing to the client · Medium**
`contribution.ts:17-30` — `limit: 0`, no `select`, default depth, result handed to a client component that reads 3 fields (see SEC-3). `contribution.ts:36-43` and `projects.ts:46-67` — `await connection()` (never cached), `limit: 100`, no `select`, on `/transparency` and `/projects`. `projects.ts:25` — `depth: 3` on a collection spanning five tabs. `partner.ts:11` and `team.ts:23` — `limit: 1000` (cached, so lower risk, but arbitrary).
*Fix:* `select` + `depth: 0` where relationships aren't read; real limits; wrap the two `connection()` queries in `'use cache'` with their existing tags — both collections already ship working revalidate hooks, so `connection()` buys nothing. *Effort:* half a day.

**PERF-11 — 33 `<ImageMedia fill>` call sites pass no `sizes` · Medium**
`ImageMedia/index.tsx:83-92` documents the rule but doesn't enforce it; with `fill` and no `sizes`, `next/image` assumes `100vw`. Worst offenders are small fixed boxes: `SponsorsBlock/Component.tsx:96` (a 96px-tall logo in an `h-24` div), `art/Curators/index.tsx:32`, `TestimonialBlock/Component.tsx:86`, `ProjectTestimonialBlock` `:94,126,199`, `LatestNewsBlockView.tsx:69`, `MembersShowcase.tsx:47`, `AgendaCalendar.tsx:453`.
*Impact:* with `deviceSizes: [320, 640, 1200, 2048]`, a 2× desktop picks the 2048px candidate for a 96px logo — and, given PERF-5, one more full-size AVIF encode on the server.
*Fix:* a real `sizes` per site, plus a dev-mode `console.warn` in `ImageMedia` when `fill && !sizes` so new sites can't regress. *Effort:* 1 day.

**PERF-12 — `nginx.conf` declares no compression, and the zones it depends on are missing from the file · Medium (unconfirmed)**
`grep -i "gzip\|brotli\|proxy_cache_path\|limit_req_zone"` matches only the comment at `:4-5` promising three `http{}` directives — of which only `upstream app` is present, while `proxy_cache assets_cache` is used at `:73,98,117,151` and `limit_req zone=mylimit` at `:167`. Since nginx refuses to start with undeclared zones, they *must* live in the parent config — which means this file is incomplete as documentation and compression status is unknown from here.
*Impact if compression is off:* measured ratios on this build are 89% (JS) and 84% (CSS), so this would dominate every other item on this list. Also `proxy_buffering` is unset (defaults `on`), which buffers the streamed RSC responses this Suspense-heavy app was built around.
*Fix:* run `nginx -T | grep -E "gzip|brotli|proxy_cache_path|limit_req_zone"` first. If absent, add `gzip on` with `text/x-component` in `gzip_types` (that's the RSC content type). Add `proxy_buffering off` to `location /` only. Move the zone declarations into this file, commented as `http{}` context. *Effort:* 1 h.

**PERF-13 — PM2 runs one fork process, so SSR and image encoding share one core · Medium**
`ecosystem.config.cjs:17-18` — `instances: 1, exec_mode: 'fork'`. **Do not simply raise this:** two pieces of state are process-local. `utils/rateLimit.ts:15` is an in-memory `Map` (its own comment says so), and `next.config.ts:59` sets `cacheMaxMemorySize` for the in-memory `'use cache'` store — with N instances, a `revalidateTag` fired by a Payload hook in worker 1 does *not* invalidate workers 2..N, so editors would see changes appear and disappear depending on which worker served them.
*Fix:* remove the CPU load instead (PERF-5 and PERF-10). Cluster mode is only safe after both the rate limiter and the Next cache handler move to Redis. *Effort:* small for the former, large for the latter.

**PERF-14 — Artwork and curator single-doc queries are uncached, unlike every sibling in the same file · Low**
`lib/payload/queries/artwork.ts:9-24` (no `'use cache'`, no `limit: 1`) and `:26-48`, while the three list queries directly below at `:56,66,76` all carry `'use cache'` + `cacheLife` + the right tag, and both collections already have working invalidation.
*Fix:* route both through `findPublishedBySlug`. *Effort:* 30 min.

**PERF-15 — `sitemap.xml` runs six unbounded finds per request and is structurally uncacheable · Low**
`app/sitemap.ts:38-83` — six `limit: 1000` finds in a `Promise.all`, no `'use cache'`; `:17` sets `lastModified: new Date()`, so output differs every invocation. Mitigated by `depth: 0` + `select` (the file documents this), so the cost is round-trips, not bytes.
*Fix:* `'use cache'` + `cacheLife('days')` + the six collection tags; replace `new Date()` with a build constant. *Effort:* 1 h.

**PERF-16 — Google Analytics duplicated across three layouts, two of them with a hardcoded ID · Low**
`(org)/layout.tsx:50-62` uses `GA_MEASUREMENT_ID`; `(crowdfunding)/layout.tsx:79-89` and `(gaming)/layout.tsx:110-120` hardcode `G-PEH83S3H3K`. `strategy='afterInteractive'` is correct, so the runtime cost is modest — but the inline `dataLayer` bootstrap is part of what forces `'unsafe-inline'` to stay in `script-src`.
*Fix:* `<GoogleAnalytics gaId>` from `@next/third-parties/google`, ID from `lib/constants` in all three. *Effort:* 1 h.

---

## Code quality, tech debt & testing

**QUA-1 — The working tree does not typecheck: 28 errors · High ✓**
`tsc --noEmit` on the working tree returns 28 errors; the same command on a clean export of `HEAD` returns **0**. 25 errors are in `components/events/EventPage.tsx`, which `git diff` shows mid-change: `Record<string, any>` → `Record<string, unknown>` at `:33`, without narrowing the ~20 property accesses that follow (`:74`, `:104` `Property 'replace' does not exist on type '{}'`, `:139` `'event.details' is of type 'unknown'`, …). The other two are `events/[slug]/page.tsx:59` (`HawkEvent` no longer assignable to the narrowed prop) and `page.tsx:16` (a `MetadataImageType` mismatch, from the regenerated `payload-types.ts`).
*Impact:* the repo does not compile as it sits. The change is the right direction — it removes the codebase's most consequential `any` (QUA-12) — it is just unfinished, and QUA-2 means nothing would catch it on a PR.
*Fix:* finish the narrowing (a zod parse or a typed `HawkEvent` prop is cleaner than `Record<string, unknown>` — see QUA-12), or revert the file. Also decide on the other 8 uncommitted files, including the `deploy.yml` improvement that is sitting unpushed. *Effort:* 30 min–2 h.

**QUA-2 — CI never runs on pull requests: `pull_request` is nested inside `push:` · High ✓**
`.github/workflows/deploy.yml:3-8` — `pull_request:` is indented at 4 spaces, level with `branches`, making it a key *of* `push`. Present in `HEAD` as well as the working tree. The author clearly intended PR runs: the deploy job guards itself with `if: … github.event_name != 'pull_request'` at `:46`.
*Impact:* no lint, no typecheck, no tests have ever run on a PR. Every check happens after merge to `main`, by which point deploy is already going. GitHub may also reject the file outright for an unexpected key under `on.push`, in which case nothing runs at all.
*Fix:* dedent to two spaces. *Effort:* 2 min.

**QUA-3 — No build gate anywhere, and the deploy deletes production before building · High**
The `check` job runs lint + `tsc` (+ `pnpm test` in the uncommitted version) — never `pnpm build`. The build first runs on the VPS, and `deploy.yml:157-167` does `pm2 stop` → `pm2 delete` → `rm -rf .next` → `pnpm install` → `pnpm build`, in that order.
*Impact:* a commit that typechecks but fails `next build` (server/client boundary violations, `cacheComponents` violations, bad dynamic imports — precisely what `tsc` cannot see) takes the site down and leaves it down, with the process already deleted and the previous build already removed. `app/api/health/route.ts` exists and documents itself as the post-deploy liveness check; the deploy script never calls it.
*Fix:* add `pnpm build` to the `check` job. On the VPS, build into a fresh directory and swap, or at minimum keep the old `.next` until the build succeeds; then curl `/api/health` and fail the step if it isn't `ok`. *Effort:* 1–2 h.

**QUA-4 — `POST /api/member-projects` returns HTTP 200 on validation failure and on server error · High ✓**
`app/api/member-projects/route.ts:86-92` — `return Response.json({ status: 400 })` puts `{status:400}` in the *body*; the HTTP status stays 200. The correct form is three lines above at `:45`. The consumer trusts `res.ok` (`SubmitProjectForm.tsx:93-99`).
*Impact:* a rejected or failed submission renders the green success screen and clears the form. The member's project is silently discarded with no way for them to know.
*Fix:* pass the init object; return `e.issues` so the form can `setError` per field. *Effort:* 15 min + a route test.

**QUA-5 — `pnpm test` cannot run in CI: Playwright browsers are never installed · High ✓**
`vitest.config.ts:26-42` runs the `storybook` project in a real Chromium via `provider: playwright({})`. There is no `playwright install` step in `deploy.yml` (grep returns nothing), no `postinstall` in `package.json`, `playwright@1.63.0` ships no `scripts` field, and `pnpm-workspace.yaml`'s `allowBuilds` allowlist does not include playwright.
*Impact:* the (uncommitted) CI test step will fail on a clean runner, and `.husky/pre-push` blocks anyone without a pre-existing browser cache. All 136 story smoke tests — including the `a11y.test: 'error'` gate (A11Y-9) — are unreachable today. Separately, this session could not run `vitest` at all for an unrelated reason (native binding platform mismatch), so **the suite's real pass/fail state is unknown.**
*Fix:* `pnpm exec playwright install --with-deps chromium` before the test step; add `playwright: true` to `allowBuilds`. *Effort:* 20 min.

**QUA-6 — `graphql@17` installed against Payload's `^16.8.1` peer range, and never imported · High ✓**
Verified on the machine: installed `17.0.2`, `payload@3.88.0` peer `{"graphql":"^16.8.1"}`, and pnpm's store path is the proof — `payload@3.88.0_graphql@17.0.2_…`. `graphql` appears in **no source file** in the repo; the declaration exists only to force this resolution.
*Impact:* Payload's GraphQL layer — including validation and error formatting — runs on an untested major, on a publicly reachable endpoint. Failures surface as runtime errors, not build errors.
*Fix:* drop `graphql` from `dependencies` (let pnpm resolve the peer) or pin `^16.8.1`. If GraphQL is genuinely unused, `graphQL: { disable: true }` and delete the two routes. *Effort:* 10 min + a smoke test.

**QUA-7 — Only 3 test files; the entire authorization and i18n-routing layer is untested · High**
`app/api/{donate,easypay,subscription}/route.test.ts` — 1,030 lines, and they are good. That is 3 of 9 API routes. The 136 `.stories.tsx` are render/a11y smoke tests, not behavioural tests. `vitest.config.ts` sets no coverage block and no thresholds, and `@vitest/coverage-v8` is installed with no script to invoke it.
*Highest-risk untested modules:* (1) `utils/middlewares/withHandleInternalization.ts` — the *only* gate keeping unsupported `[lng]` values out of every page, whose own comments document a regression that already happened once (`/ptx/foo` rendering with `lng='ptx'`); (2) `payload/access/*` — the entire authorization surface, where a regression is a data-exposure bug with no automated detector; (3) `member-projects` and `newsletter` — public unauthenticated writes calling `payload.create({ overrideAccess: true })`, where a two-line test would have caught QUA-4; (4) `utils/rateLimit.ts` `getClientIp` header precedence; (5) `lib/payload/queries/helpers.ts` — where the `draft` default flipping is exactly SEC-1.
*Fix:* start with (2) and (4) — pure functions, no I/O, coverable in an afternoon. Add a `coverage` script with a threshold scoped to `app/api/**`, `utils/**`, `payload/access/**`, `lib/payload/queries/**`. *Effort:* 3–5 days for meaningful coverage.

**QUA-8 — Payment flow has 12 `useState`s, no form library, and no shared validation schema · Medium**
`DonationWidget/index.tsx:26-37` — twelve raw hooks, with 13 lines of manual reset at `:69-82`. Client validation is one line (`DetailsStep.tsx:38`: `email.includes('@')`). The real schema is duplicated inline and unexported in both `donate/route.ts:83-93` and `subscription/route.ts:58`. `@hookform/resolvers` is not a dependency; `zodResolver` appears nowhere. Meanwhile `SubmitProjectForm.tsx:60` and `FormContributions.tsx:56` *do* use react-hook-form — with hand-written rules that re-implement `z.email()` as a regex at `SubmitProjectForm.tsx:307`.
*Impact:* three forms, three validation strategies, and the money path has the weakest. The `.max(50_000)` cap and the phone rules must be changed in three places.
*Fix:* one `lib/schemas/donation.ts`, imported by both routes and by the widget via `zodResolver`. *Effort:* 1 day.

**QUA-9 — `pre-commit` rewrites files it never stages · Medium**
`.husky/pre-commit` is one line: `pnpm format:fix` (= `prettier --write .`). No `git add`, no `lint-staged`. Unformatted code gets committed while the formatted version sits unstaged, so the next commit carries whitespace churn from every file Prettier touched. `pnpm format` isn't in CI either.
*Fix:* `lint-staged`; add `pnpm format` to the `check` job. *Effort:* 30 min.

**QUA-10 — CI typechecks with `pnpm tsc`, bypassing the heap bump the project needs · Medium ✓**
`deploy.yml:38-39` and `.husky/pre-push:2` run `pnpm tsc`. There is no `tsc` script — pnpm falls through to `pnpm exec tsc`, so it "works" with Node's default heap, while the real script is `"typecheck": "NODE_OPTIONS=--max-old-space-size=4096 tsc --noEmit"`. The 4 GB bump is not incidental: `build` carries it too, `tsconfig.tsbuildinfo` is 2.0 MB, and there is a branch named `agents/heap-limit-debugging`.
*Fix:* `pnpm typecheck` in both places. *Effort:* 2 min.

**QUA-11 — `ProjectCard` and `EventCard` are copy-paste duplicates, and have already drifted · Medium**
`ProjectCard.tsx:15-23` and `EventCard.tsx:12-23` contain the same `formatDateRange` helper verbatim; the wrapper, image block, heading, date row and hover-underline classnames are character-identical (`:33`/`:30`, `:37`/`:33`, `:64`/`:71`). The drift: `ProjectCard` passes `preload={index === 0}`, `EventCard` does not — so the events list's LCP image is never preloaded. `EventCard`'s `index` prop is declared and unused.
*Fix:* one `components/shared/MediaListCard.tsx`; move `formatDateRange` into `lib/utils/date.ts`. *Effort:* 3 h.

**QUA-12 — `EventCard` types its whole payload as `Record<string, any>` · Medium**
`components/events/list/EventCard.tsx:5-10`, with eight unchecked field accesses and a rescue cast at `:26` (`as Media | null`). Its sibling `ProjectCard.tsx:10` correctly uses the generated `HawkProject` type.
*Fix:* `event: HawkEvent`, delete the cast and the `eslint-disable`. This is the same fix that is currently half-done in `EventPage.tsx` (QUA-1) — do both properly, with the generated type rather than `unknown`. *Effort:* 30 min.
*Context:* across `app components lib payload utils i18n types` there are ~81 `any`-family hits, but ~55 are `as unknown as` in Storybook fixtures (legitimate) and ~12 are false positives from `read: anyone`. Production `any` reduces to this file, `RichText/index.tsx:119` (documented import-cycle workaround), and `supportersWorkbook.ts:81` (documented ExcelJS quirk).

**QUA-13 — `tsconfig.json` has `strict` but none of the four flags that catch this codebase's actual bugs · Medium**
`tsconfig.json:2-14` — no `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes` or `noUnusedLocals`. Concretely: `DonationWidget/index.tsx:15-21,198` types `STEP_TITLE_KEYS[currentStep]` as `string`, never `string | undefined`; same at `client-side/queries/news.ts:102` and `UpcomingHawkEventBlock/Component.tsx:12` — both of which carry a `|| fallback` precisely because the author knew it could be undefined.
*Fix:* enable `noUncheckedIndexedAccess` and `noImplicitOverride` first (bounded, mechanical fallout). Defer `exactOptionalPropertyTypes` — it fights Payload's generated types. *Effort:* 1 day.

**QUA-14 — Two parallel data-fetching stacks, and the newer one bypasses its own abstraction · Medium**
Server components use `lib/payload/queries/*` (Local API + cache tags). Seven client components instead fetch over public REST via `lib/payload/client-side/*`. Within that second stack, `queries/news.ts` ignores the shared `client.ts` and hand-rolls `fetch` twice (`:48-68`, `:86-111`) with two different error behaviours; `client.ts:21-24` double-casts the response (`as unknown as T`) so a schema change becomes a runtime `undefined`, not a type error. And `news.ts` passes no locale, so client-fetched news is always the default language regardless of the `[lng]` route.
*Fix:* move the four block components server-side (PERF-6 wants this anyway); for anything that must stay client-side, route it through `payloadClientQuery` and validate with zod instead of casting. *Effort:* 2–3 days.

**QUA-15 — A visible double euro sign, and date/currency formatting duplicated ~14 ways · Medium ✓**
`lib/utils/currency.ts:4-12` uses `style: 'currency', currency: 'EUR'` — it already emits the symbol. `components/projects/single/ProjectsSingleHero.tsx:112` appends another: `` `${formatCurrency(hero.fundedAmount)}€` `` → renders `38 064,00 €€`. Six other sites ignore the helper entirely (`CrowdfundingHero.tsx:143,162,170`, `CrowdfundingTransparency.tsx:71,89,101`) using `en-GB` where the helper uses `en-US`, with no fraction digits. Dates are worse: `LatestNewsBlockView.tsx:29` pins `'en-US'` and `AgendaBlockView.tsx:51,70,107,115` pins `'pt-PT'`, on a bilingual site — while `toIntlLocale()` exists at `i18n/settings.ts:34` for exactly this and is used in only two files.
*Fix:* drop the stray `€`; add `formatDate(iso, lng, opts)` to `lib/utils/date.ts` built on `toIntlLocale`; route the six crowdfunding sites through `formatCurrency`. *Effort:* 4 h.

**QUA-16 — `ContributionType` declared three times, with two competing label lists · Medium**
The same 10-member union appears in `payload-types.ts:4310` (generated — the real source of truth), `payload/collections/Contribution/config.ts:1-11` and `components/transparency/config.ts:3-13`. Plus two independent label arrays. The same pattern repeats for event types across five files, two of them with hardcoded English on a bilingual site.
*Impact:* adding a type means edits in five files; missing one renders a raw enum key — which is why every call site carries a `|| doc.type` fallback. `priceOfContribution` keys off one of the duplicates, so a drifted key silently drops a price.
*Fix:* `Contribution['contribution_type']` from the generated types; labels into the i18n files keyed by enum value. *Effort:* 4 h.

**QUA-17 — Swallowed errors, including the primary payment route reporting nothing · Medium**
`app/api/donate/route.ts:71-79` returns 400/500 with **no `Sentry.captureException`** — while its three siblings (`subscription:50`, `newsletter:59`, `member-projects:87`) all have it. So failures on the main donation path are invisible in Sentry. Also `ShareButton.tsx:27-31` has a literally empty `catch {}` (the button silently does nothing when clipboard write is denied), plus `getActivityHandler.ts:45`, `StatsWrapper.tsx:21` and `NewsletterSignupBlock/Component.tsx:44` all discard the cause.
*Fix:* add the capture to `donate`; give `ShareButton` a visible fallback; attach caught errors as `extra` in the Payload-side handlers. *Effort:* 2 h.

**QUA-18 — Five different error contracts across nine API routes · Medium**
`donate` returns `{error, details}`; `subscription` returns `{}`; `member-projects` returns `{status:400}` with HTTP 200 (QUA-4); `newsletter` returns `{error}`; `instagram:162` returns the status code as the body and `:142` ships an empty error string. Consequence: `DonationWidget/index.tsx:121` does `throw new Error(data.error || …)` — against `/api/subscription` `data.error` is always undefined, so the monthly-donation path can never show a specific error.
*Fix:* one `lib/api/respond.ts` with `ok`/`badRequest`/`serverError`/`tooMany`, used by all nine. *Effort:* 4 h.

**QUA-19 — Six dead modules (~300 lines) · Low**
`components/projects/ProjectNewsSection.tsx`, `lib/payload/seed/development.ts`, `payload/components/fields/InstagramUserIdField/index.tsx`, `payload/components/Media/ImageMedia/cloudinaryLoader.ts` (referenced only by the commented-out `next.config.ts:82` — see PERF-5), `payload/cssVariables.ts`, and `types/images.d.ts` (which declares image imports as `any` although nothing in the repo imports a static image, shadowing Next's own `StaticImageData`). `InstagramUserIdField` is the risky one — it reads as a working admin feature and someone will eventually debug why it doesn't appear.
*Fix:* delete; wire the Instagram field into the `settings` global if it's wanted. *Effort:* 30 min.

**QUA-20 — Redundant dependency pair, and one undeclared import · Low**
`classname-variants` (2 files) and `class-variance-authority` (6 files) do the same job; `components.json` configures shadcn, whose convention is `cva`. Separately, `server-only` is imported by `lib/payload/queries/helpers.ts:1` and `lib/payload/server.ts` but is not declared — it resolves today only as a transitive of `next`.
*Fix:* convert the two files to `cva` and drop the package; add `server-only` to `dependencies`. *Effort:* 1 h.

**QUA-21 — Repo hygiene · Low**
`README.md` is still verbatim create-next-app boilerplate, telling readers to deploy on Vercel — for a project on a self-hosted VPS with PM2 and nginx — and linking to neither `ONBOARDING.md` (14 KB, accurate) nor `STORYBOOK.md`. `ONBOARDING.md:12` has drifted from `package.json` on four versions (Vitest, Storybook, ESLint, Next). Nine files are uncommitted (QUA-1), including the `deploy.yml` improvement. Five dependabot branches are stale — four target versions already in `package.json`, and `i18next-26.4.1` is *older* than the declared `~26.4.2`.
*Fix:* a 20-line README pointing at the real docs and the real deploy story; regenerate the ONBOARDING version list; close the branches. *Effort:* 1 h.

**QUA-22 — Two files disable ESLint entirely · Low**
`components/ui/map.tsx:1` and `payload/blocks/ProjectTestimonialBlock/Component.tsx:1` — bare `/* eslint-disable */` + `// TODO: fix the linter`, which switches off *every* rule including `react-hooks/rules-of-hooks` and exhaustive-deps. `map.tsx` is a Leaflet integration — exactly where a hooks violation is plausible. The repo's other six disables are all narrow, single-line and carry a reason; these two are the outliers.
*Fix:* name the specific rules that fire, with a reason. *Effort:* 1 h.

**QUA-23 — No error boundary for the crowdfunding or gaming route groups · Low**
Only `app/[lng]/(org)/error.tsx` exists, and its own comment at `:21-28` explains why it matters: without it, a thrown error escalates to `global-error.tsx`, replacing the entire document and losing the layout chrome. Both other groups have their own `layout.tsx` chrome and a `loading.tsx`, but no `error.tsx` — and the crowdfunding group hosts `DonationWidgetBlock`. Also `global-error.tsx:19` renders Next's untranslated `<NextError statusCode={0} />` with no branding and no `reset()`.
*Fix:* copy `(org)/error.tsx` into both groups. *Effort:* 30 min.

**QUA-24 — Six ESLint warnings · Low ✓**
From the real run: `components/projects/single/ProjectsSingleHero.tsx:45` — `'coverImage' is defined but never used`; `payload/collections/Pages/index.ts:5-9` — five unused SEO-plugin field imports (`MetaDescriptionField`, `MetaImageField`, `MetaTitleField`, `OverviewField`, `PreviewField`), left behind by the uncommitted 45-line deletion in that file.
*Fix:* delete the unused imports. *Effort:* 5 min.

---

## SEO

**SEO-1 — Deep unknown paths return a soft 404 (HTTP 200) · High ✓**
`app/[lng]/(org)/[...notfound]/page.tsx` renders 404 markup and **never calls `notFound()`** — read the whole file to confirm. `/en/foo` hits `[slug]/page.tsx:42`, which *does* call it; `/en/foo/bar/baz` falls through to the catch-all and returns 200.
*Impact:* every mistyped or stale deep URL becomes an indexable thin page. Crawl-budget waste and duplicate-content signals.
*Fix:* delete the `[...notfound]` segment — `app/[lng]/(org)/not-found.tsx` already exists, is richer, and is properly localized; `notFound()` in `[slug]` plus that file covers the case with a real 404. *Effort:* 30 min.

**SEO-2 — The sitemap ships unpublished `pages` to Google · High ✓**
`app/sitemap.ts:39-45` — the `pages` find has `draft: false` but **no `where`**, while `hawk_projects` (`:60`) and `news` (`:68`) both get `where: publishedWhere`. `pages` has drafts enabled with autosave and schedulePublish.
*Fix:* add `where: publishedWhere` to the `pages` find. *Effort:* 5 min. (The underlying read path is SEC-1.)

**SEO-3 — `/members-corner/submit` canonicalizes to `/members-corner` · High ✓**
`app/[lng]/(org)/members-corner/submit/page.tsx:12` calls `getMetadataPageInfo(lng, 'members_corner')` — the parent's key. `utils/metadata.ts:55,90` resolves the canonical from that key, so both locales of the submit page point at a different page. `utils/paths.ts:33` already defines `members_corner_submit` in `allUrls`; it just isn't in `SITE_GET_URLS`.
*Also worth fixing while you're there:* `utils/metadata.ts:55` falls back to the homepage's URL for any unknown key — silently. All 22 current call sites pass valid keys (script-verified), so only this one bites today, but the fallback is a landmine.
*Fix:* add the key to `SITE_GET_URLS` and to both `metadata.json` files; make the fallback throw or report to Sentry. *Effort:* 1 h.

**SEO-4 — Curator pages have no canonical, no hreflang, no twitter card, no metadataBase · Medium**
`curator/[slug]/page.tsx:49-69` hand-rolls a partial metadata object with English-only copy for both locales, while `artwork/[slug]/page.tsx:40-45` correctly uses `prepareMetadataInfo`. Curator pages *are* in the sitemap (`app/sitemap.ts:107`).
*Fix:* route through `prepareMetadataInfo({ …, url: '/curator/${slug}' })`; move strings into `metadata.json`. *Effort:* 1 h.

**SEO-5 — `/gaming` and `/crowdfunding` are missing from the sitemap · Medium**
`utils/paths.ts:96-116` lists 19 routes; neither microsite appears, though both exist with full metadata and `generateStaticParams` for both locales.
*Impact:* the crowdfunding landing page — the highest-conversion page on the site — is not submitted for indexing.
*Fix:* add both to `SITE_GET_URLS` and `routes`. *Effort:* 15 min.

**SEO-6 — The crowdfunding page's title contradicts the OG tags it inherits · Medium**
`(crowdfunding)/crowdfunding/page.tsx:16-22` overrides only `title` and `description`, so `openGraph`/`twitter` still come from `layout.tsx:36-51` and say something different. The description is hardcoded Portuguese regardless of `lng`, and the function ignores `params` entirely.
*Fix:* delete the page-level `generateMetadata` (the layout's object is already complete and canonical'd), or make it locale-aware and set OG/twitter in the same object. *Effort:* 30 min.

**SEO-7 — 15 titles over 60 chars and 21 descriptions over 160 chars · Medium**
Measured across both `metadata.json` files (21 keys each): EN 7 long titles / 9 long descriptions; PT 8 / 12. Worst: PT `transparency` title 74 chars, PT `home` description 192, EN `contribute` description 177. Key parity is otherwise **perfect** — 0 missing in either direction, and every `SITE_GET_URLS` key has an entry in both files.
*Fix:* trim PT titles to ≤60 (dropping the ` - ONG Hawk Stars` suffix where the title already names the org) and descriptions to ≤155; add a unit test asserting the limits. *Effort:* 2 h of copy work.

**SEO-8 — Every static sitemap entry reports `lastModified: now` · Medium**
`app/sitemap.ts:17` — 38 URLs (19 routes × 2 locales) claim to have changed on every crawl, while also declaring `changeFrequency: 'monthly'`.
*Impact:* Google learns to ignore `lastModified` for the whole sitemap, including the CMS entries where it is accurate.
*Fix:* drop it for hardcoded routes, or derive from a build timestamp. *Effort:* 30 min.

**SEO-9 — Organization JSON-LD: wrong nonprofit status and a 404 logo · Medium ✓**
`components/seo/JsonLd.tsx:17-37` — `nonprofitStatus: 'Nonprofit501c3'` (the US IRS designation, on a Portuguese *associação*) and `logo: ${BASE_URL}/images/logo.webp`. Verified: that path does not exist; the file is at `public/images/logos/logo.webp`.
*Fix:* correct the path; drop `nonprofitStatus` and add `legalName`, NIPC as `taxID`, `email`/`telephone` instead. *Effort:* 15 min.

**SEO-10 — Event JSON-LD never has a `location` · Medium**
`events/[slug]/page.tsx:54` passes `location={undefined}` unconditionally, and `location` is required for Google Event rich results. `startDate` also falls back to `event.createdAt` — the CMS record's creation date — when `date` is unset, which is semantically wrong. Separately, `ArticleJsonLd` is called without `description` and its `publisher` has no `logo` `ImageObject`.
*Fix:* map the venue into `location`, or emit `VirtualLocation` + `eventAttendanceMode` when there is none; omit the schema entirely rather than lying about `startDate`. *Effort:* 2 h.

**SEO-11 — Locale redirect is a permanent 301 with no `Vary` · Medium**
`utils/middlewares/withHandleInternalization.ts:38-59` picks the locale from a cookie then `Accept-Language`, then issues `NextResponse.redirect(…, 301)` with no `Vary` header.
*Impact:* `https://hawkstars.org/` — the canonical entry point everyone links to — is permanently cached by browsers and intermediaries as whichever locale the visitor hit first; shared caches can serve a PT redirect to an EN visitor. (No redirect-loop risk: `hasSupportedLocalePrefix` uses whole-segment matching consistently in both the guard and `getLocale`, which is documented and correct.)
*Fix:* 307 plus `Vary: Accept-Language, Cookie`. *Effort:* 30 min.

**SEO-12 — `robots.ts` disallow pattern misses the un-slashed preview path · Low**
`app/robots.ts:19` — `'/*/preview/'` requires the trailing slash, so `/en/preview` is uncovered. Defence-in-depth only: all nine preview routes are both `noindex, nofollow` and auth-gated.
*Fix:* add `'/*/preview'`. *Effort:* 5 min.

**SEO-13 — Dead metadata keys, and two JSON-LD components with no call sites · Low**
`metadata.json` carries `donate` and `contact`, neither of which has a route or a `SITE_GET_URLS` entry, so they can never be reached through the typed helper. `BreadcrumbJsonLd` (`JsonLd.tsx:69`) and `WebPageJsonLd` (`:92`) are fully implemented and never used — so none of the ~10 nested routes emit breadcrumb rich results.
*Fix:* delete the dead keys; add `<BreadcrumbJsonLd>` to the nested routes. *Effort:* 2 h.

**SEO-14 — Sitemap entries carry no `alternates.languages` · Low**
Both locales are emitted as separate `<url>` entries but never linked. Page-level hreflang (`utils/metadata.ts:104-108`) covers this, so it's a redundancy gap rather than a break. *Effort:* 30 min.

---

## Internationalization

**I18N-1 — Hardcoded Portuguese strings shown to English users · Medium**
`payload/blocks/AgendaBlock/AgendaBlockView.tsx:291` `A carregar eventos…` and `:299` `Sem eventos próximos.`. A full JSX-text scan found only 4 hardcoded literals in the whole app; the other two are brand names.
*Impact:* the agenda block is embeddable on any CMS page, so EN visitors see Portuguese loading and empty states.
*Fix:* move both into the `agenda` namespace. *Effort:* 20 min.

**I18N-2 — 17 hardcoded English `aria-label` / `alt` strings · Medium**
These are exactly the strings assistive-tech users hear, and they are English-only on a site whose default locale is `pt`: `AgendaCalendar.tsx:296,308,313`, `HeroSlideshowBlock/Component.tsx:168,175`, `ProjectTestimonialBlock/Component.tsx:148,155`, `TestimonialBlock/Component.tsx:215,227`, plus `alt` on `SingleProjectPartners.tsx:35`, `InstagramEmbedWidget.tsx:125`, `GlobalVillageBanner/Component.tsx:27,34`, `history/page.tsx:97`, and the three `loading.tsx` files.
*Fix:* the pattern already exists and is correct — `components/ui/carousel.tsx:195,227` uses `t('a11y.prevSlide')` / `t('a11y.nextSlide')`, and those keys are already translated. The two `alt="decorative …"` cases should become `alt='' aria-hidden='true'` instead. *Effort:* 2 h.

**I18N-3 — The site logo links to `/`, losing the locale on every page · Medium ✓**
`components/navbar/Navbar.tsx:51` — `<Link href='/'>`. This is the only unlocalized internal link in the app apart from I18N-4. `MobileNavbar/index.tsx:79` and `CrowdfundingNavbar.tsx:28` both do it correctly, so desktop and mobile disagree.
*Impact:* clicking the logo triggers the SEO-11 301 round-trip on every page, and lands the user on whatever the cookie says rather than the locale they were reading.
*Fix:* `href={transformUrl(lng, SITE_GET_URLS.home)}` — `Navbar` already receives `lng`. *Effort:* 10 min.

**I18N-4 — The 404 page's "go back" link drops the locale · Low**
`app/[lng]/(org)/[...notfound]/page.tsx:49` uses `SITE_GET_URLS.home` (= `/`) directly. `not-found.tsx:163` does it correctly with `transformUrl`. Moot if SEO-1 is fixed by deleting the route. *Effort:* 5 min.

**I18N-5 — Five empty translation values · Low**
`crowdfunding.partners.entities.{politecnico,camara}.subtitle` are empty in **both** locales (either intentional or dead), and `hawkstars.humanitarian.fireBrigades.description` is populated in PT but empty in EN.
*Fix:* fill the EN description; remove the other two if unused. *Effort:* 15 min.

**I18N-6 — 20 orphaned translation keys · Low**
Of 945 EN leaf keys (excluding `metadata.json`), 20 are never referenced even under deliberately loose matching: 11 in `common.json` (including `footer.designedBy` / `footer.builtBy`, which look like an unfinished footer credit), 7 in `contribute.json`, 2 in `hawkstars.json`. Note the typo `home.objetives_title` / `objetives_body` — if a component ever asks for `objectives_title` it will silently render the key.
*Fix:* delete from both locales, or wire up the ones that were meant to ship. *Effort:* 45 min.

**I18N-7 — Microsite and curator metadata are not localized · Low**
`(gaming)/layout.tsx:27-53`, `(crowdfunding)/layout.tsx:25-51` and `curator/[slug]/page.tsx:50-53` return English strings regardless of `lng`, while emitting hreflang pairs that claim an EN and a PT version exist. Folded into SEO-4/5/6. *Effort:* included above.

---

## Accessibility

**A11Y-1 — The hero slideshow puts every slide in the accessibility tree and gives each one an `<h1>` · High**
`payload/blocks/HeroSlideshowBlock/Component.tsx:84-89` hides non-active slides with `opacity-0` only — not `display:none`, not `visibility:hidden`, not `aria-hidden`, not `inert`. `:28` defaults `HeadingTag` to `h1`, and `:125` renders it per slide, so N slides produce N exposed `<h1>`s. Each hidden slide's CTA (`:105-111`) stays in the tab order.
*Impact:* a screen-reader user hears every headline and CTA stacked as one page; a keyboard user tabs into buttons they cannot see. WCAG 1.3.1, 2.4.3, 2.4.7.
*Fix:* `aria-hidden` + `inert` on non-active slides; force `h2` for slides after the first. *Effort:* 2 h.

**A11Y-2 — Autoplaying slideshow with no pause control · High**
`HeroSlideshowBlock/Component.tsx:36-37,62-67` — autoplay defaults on at 5 s; the controls at `:165-194` are prev/next/dots only. No pause, no pause-on-hover, no pause-on-focus. WCAG 2.2.2 requires pause/stop/hide for auto-advancing content running over 5 s.
*Impact:* users with cognitive, motor or low-vision needs cannot finish reading a slide, and a keyboard user's focus target moves out from under them mid-interaction.
*Fix:* a labelled pause/play toggle; pause on `mouseenter` and `focuswithin`; stop entirely under `prefers-reduced-motion` (A11Y-3). *Effort:* 3 h.

**A11Y-3 — `prefers-reduced-motion` is not handled anywhere · Medium**
Zero occurrences of `prefers-reduced-motion`, `motion-reduce:` or `useReducedMotion` across `app/`, `components/`, `payload/` and `globals.css`. Running regardless: `not-found.tsx:31` `animate-[soar_6s_ease-in-out_infinite]`, three `animate-pulse` loading screens, `Spinner.tsx:4`, `InstagramGrid.tsx:48`, and the slideshow's `setInterval` + 500 ms opacity transition. `globals.css:86` also sets `scroll-behavior: smooth` unconditionally.
*Fix:* the standard reduced-motion reset block in `globals.css` (including a `scroll-behavior: auto` override), **plus** a JS media-query gate on the slideshow interval — CSS alone won't stop a timer. *Effort:* 1 h.

**A11Y-4 — Mobile menu trigger has no `aria-expanded` / `aria-controls` · Medium**
`components/navbar/Navbar.tsx:69-76`. The pattern is used correctly in the same feature at `DesktopNavbar/index.tsx:45` and `MobileMenuItem.tsx:33`.
*Impact:* the button always announces "open menu", even while the menu is open.
*Fix:* `aria-expanded={mobileNavbarOpen}`, `aria-controls` pointing at the dialog, and swap the label between `a11y.openMenu` / `a11y.closeMenu`. *Effort:* 30 min.

**A11Y-5 — No skip-to-content link on the gaming or crowdfunding microsites · Medium**
`(org)/layout.tsx:68-79` has a proper `sr-only focus:not-sr-only` skip link targeting `<main id='main-content'>` at `:91`. `(crowdfunding)/layout.tsx:99` and `(gaming)/layout.tsx:104` render a bare `<main>` with no id and no skip link — behind a full nav bar, on the crowdfunding funnel. WCAG 2.4.1.
*Fix:* extract `SkipToContent` into `components/layout/` and use it in all three; add the `id`. Also give both microsite `<nav>`s an `aria-label`, as `Navbar.tsx:42` and `Footer.tsx:38` already do. *Effort:* 45 min.

**A11Y-6 — `global-error.tsx` renders `<html>` with no `lang` · Medium**
`app/global-error.tsx:12-21`. Every other root sets it. WCAG 3.1.1 — screen readers fall back to the system voice.
*Fix:* `<html lang='pt'>`, or read the locale off `usePathname()` as `(org)/error.tsx:13-19` already does. *Effort:* 5 min.

**A11Y-7 — Focus indicator removed with nothing replacing it · Medium**
`payload/blocks/GlobalVillageAboutSection/Component.tsx:69` — `focus:ring-0 focus:outline-hidden` on a CMS call-to-action, which overrides the global `:focus-visible` rule at `globals.css:81-84`. This is the only case in the repo that leaves *no* indicator — the `outline-none` occurrences in the Radix primitives all have a visible `focus:bg-accent` state, and `Input.tsx:59`'s wrapper carries `focus-within:ring-2`.
*Fix:* delete the two utilities and let the global rule apply. *Effort:* 5 min.

**A11Y-8 — Meaningful CMS images fall back to `alt=""` · Medium**
Eight content-image sites coerce a blank CMS alt into `''`, marking the image decorative: `NewsSingleHero.tsx:54`, `NewsSingleGallery.tsx:40`, `MediaBlock/Component.tsx:15`, `ContentWithImage/Component.tsx:43`, `CallToAction/Component.tsx:54`, `HeroWithBackgroundImage/Component.tsx:54`, `GrowthVisionBlock/Component.tsx:75`, `CrowdfundingImageBanner/Component.tsx:26`. The `alt` field *is* `required: true` (`Media/index.ts:69`), but `resolve.ts:47,57,71` returns `''` for docs seeded before that, and for `ImageType` block fields.
*Impact:* the news hero — the most important image on every article — is announced as decorative when an editor left the field blank.
*Fix:* the good pattern is used in ~15 places already, e.g. `EventPage.tsx:123` `alt={heroImage.alt || event.heading || t('a11y.imageAlt')}`. Apply it at the eight sites. *Effort:* 1 h.

**A11Y-9 — The a11y gate is configured to fail CI and almost certainly never runs · Medium (partly unconfirmed)**
`.storybook/preview.ts:28-33` sets `a11y: { test: 'error' }` — the strictest mode — and `vitest.config.ts:25-47` wires 136 stories through a Playwright browser. But per QUA-5 there is no browser-install step anywhere, so the project either hard-fails or silently skips. Supporting signal: the violations in A11Y-1/2/4/7 all sit in components that *have* stories, which a working gate should have caught.
*Fix:* QUA-5's install step, then run the suite once locally and work through whatever backlog it surfaces before the gate can go green. *Effort:* 15 min for CI; unknown for the backlog.

**A11Y-10 — Two list pages' only `<h1>` is conditional on CMS copy · Low (impact unconfirmed)**
`HeroImpactStatsBlock.tsx:98-102` renders `{title && <h1>…}`, and it supplies the heading for both `/events` (`events/page.tsx:93`) and `/projects` — neither of which has an `<h1>` of its own. If an editor clears the list-header title, those pages ship with zero `<h1>`. `ArchiveListComponent.tsx:39` does it right, rendering `<SectionHeader as='h1'>` unconditionally. Current CMS content was not inspected, so whether this is live is unknown; the fragility is confirmed.
*Fix:* render the `<h1>` unconditionally with a translated fallback. *Effort:* 20 min.

**A11Y-11 — `ShareButton`: no `type`, state change unannounced, never resets · Low**
`components/Crowdfunding/ShareButton.tsx:33-52` — no `type='button'` (so it defaults to `submit`), the `copied` label swap has no `aria-live`, `setCopied(true)` at `:29` is never reset so the button reads "Copied" forever, and the decorative `<svg>` lacks `aria-hidden`. (Its empty `catch {}` is QUA-17.)
*Fix:* all four, plus a 2 s reset. *Effort:* 20 min.

**A11Y-12 — Mobile menu doesn't restore focus on close or lock body scroll · Low**
The dialog is otherwise well built — `role='dialog'`, `aria-modal`, translated label, Escape handler, a real Tab focus trap (`MobileNavbar/index.tsx:32-56`), initial focus on the close button. Two gaps: on close the component unmounts at `:68` and focus falls to `<body>` instead of returning to the hamburger, and the page keeps scrolling behind the overlay.
*Fix:* store the trigger and refocus it in the effect cleanup; set `body { overflow: hidden }` while open. *Effort:* 30 min.

**A11Y-13 — Carousel region has `aria-roledescription` but no accessible name · Low**
`components/ui/carousel.tsx:119-126` — a `role='region'` needs a name to be exposed as a landmark, and `aria-roledescription` needs one to be meaningful.
*Fix:* accept an `aria-label` prop defaulting to a translated string. *Effort:* 20 min.

---

## Verified good

Things that were actively checked and found sound. These are not filler — several are controls that similar codebases get wrong.

**Security**

- **EasyPay webhook auth** (`app/api/easypay/route.ts:29-52`) — shared secret in an `x-webhook-token` *header* rather than a query string (with a correct comment about nginx access-log leakage), length-checked then compared with `timingSafeEqual`, and **fails closed** when `EASYPAY_WEBHOOK_SECRET` is unset.
- **`getClientIp` is not spoofable** (`utils/rateLimit.ts:72-91`) — prefers `x-real-ip`, which `nginx.conf:52,173` overwrites from `$remote_addr`, and otherwise takes the **last** `X-Forwarded-For` entry, matching nginx's `$proxy_add_x_forwarded_for`. The failure mode is a shared `'unknown'` bucket, not a disabled limiter.
- **Rate limiting is applied everywhere it should be** — donate 10/min, subscription 10/min, member-projects 5/min, newsletter 5/min, instagram 30/min, geocode 20/min per user plus a global 1/1.1 s. The in-memory store is honest about its single-process assumption, and `ecosystem.config.cjs:17` really does hold that assumption today.
- **Input validation** — zod on all three public write routes, with an amount cap (`.max(50_000)`), array bounds, string bounds and an enum-constrained payment type. `instagram/route.ts:130` clamps `limit` against `NaN` and negatives before the Graph API sees it.
- **Newsletter enumeration is closed** (`newsletter/route.ts:15-19,53`) — Mongo error 11000 is swallowed so a duplicate signup is indistinguishable from a fresh one, with the security reason written in the comment.
- **Public-submission privilege containment** — `is_confirmed: false` is forced at three independent layers (`member-projects/route.ts:79`, `MemberProject/index.ts:78-88` field access + `beforeValidate`, `checkConfirmedByAdmin.ts:15`), submitter name/email are admin-only at field level, and the public showcase query maps to a DTO that omits them.
- **All nine preview routes** call `payload.auth({ headers })`, `notFound()` on no user, and set `robots: 'noindex, nofollow'`.
- **Admin-only Payload endpoints** — `dashboardStats`, `sumContributions` and both activity handlers check `!user.isAdmin`; `getActivityHandler.ts:21` clamps `limit` to 100.
- **CORS/CSRF** (`payload.config.ts:96-97`) — both set to the single origin from `getServerSideURL()`, no wildcard. **Auth cookie flags** set explicitly rather than relying on defaults, with `maxLoginAttempts: 5` and a 24 h lock.
- **Security headers** (`next.config.ts:92-120`) — nosniff, `strict-origin-when-cross-origin`, `SAMEORIGIN`, HSTS with `preload`, `Permissions-Policy`, and a CSP with `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`. `'unsafe-eval'` is dev-only, and the `'unsafe-inline'` trade-off is documented and real for a PPR app.
- **No committed secrets** — a full-history scan for `.env` additions, `AIza…`, `ghp_`, `sk_live`, PEM headers and credentialed Mongo URIs found only documentation placeholders. **No secrets in the client bundle** — grepping `.next/static` and `public` for the literal values of six secrets returned zero matches.
- **No dangerous sinks** — zero `eval(`, `new Function(`, `child_process` or `exec(` in application code. `experimental.taint: true` is on and `productionBrowserSourceMaps: false`.
- **Media SVG upload is closed** (`Media/index.ts:54`) — an explicit raster allow-list replaced `image/*`, with the reasoning in-line.
- **The Discord deploy notification is injection-safe** (`deploy.yml:270-291`) — built with `jq -n --arg`, so a commit message with quotes or newlines can't break out.

**Performance**

- **`'use cache'` + tag discipline** on the majority of queries, with the cached and preview paths correctly split (`helpers.ts:55-76`) and single documents tagged both `<collection>:<slug>` and `<collection>` so bulk invalidation works.
- **Locale-correct invalidation** wherever invalidation exists — one `revalidateTag` clears both languages by construction, and the path-based hook explicitly loops both, handling unpublish and slug-change.
- **Suspense boundaries placed above the `params` await** (`projects/page.tsx:39`, `news/[slug]/page.tsx:41`, `team/page.tsx:23`, `transparency/page.tsx:20`) — the shape that actually lets the shell prerender under `cacheComponents`. The comments show this was a deliberate correction of the naive version.
- **Independent queries are parallelised** with `Promise.all` in five places rather than serially awaited.
- **Leaflet's runtime is genuinely deferred** — type-only imports, `dynamic(…, { ssr: false })`, and a runtime `import('leaflet')`, with the reasoning documented. Only the CSS leaked (PERF-9).
- **`exceljs` is server-only**; **`date-fns` uses deep imports** at all 9 sites; **`react-icons` uses deep subpath imports at 47 of 49 sites** — the two `import * as` are the exception (PERF-1).
- **`getServerTranslation` is memoized** by `lng::ns` (`i18n/index.ts:38-84`), avoiding a fresh dynamic `import()` of locale JSON on every server render.
- **Cloudinary LQIP is free** — the blur placeholder is a URL transformation, not a stored asset, with an SVG fallback so `next/image` doesn't throw.
- **LCP `priority` is set where it matters** — five hero paths plus index-gated list cards.
- **nginx asset caching is thorough** — 30-day proxy cache with `immutable`, `proxy_cache_lock`, `use_stale`, `background_update` and `revalidate` across all four asset locations, `proxy_ignore_headers Set-Cookie` to prevent the silent permanent-MISS failure, and correct upstream keepalive.
- **Fonts** — `next/font/google` with `display: 'swap'` and `subsets: ['latin']` in all three layouts. Self-hosted, preloaded, no FOIT.
- **The Payload admin bundle is isolated** — the 1.07 MB Lexical chunk is referenced by zero public HTML files.

**Code quality**

- **Zero `@ts-ignore` and zero `@ts-expect-error`** in the entire repo, `strict: true`, and every remaining production `any` individually justified in a comment.
- **Almost no dead code** — six orphaned modules out of ~500 files, four TODO comments repo-wide, and zero stray `console.log`.
- **`utils/rateLimit.ts`** is genuinely well built: bounded memory via opportunistic sweep, the `X-Forwarded-For` bypass it fixes documented inline, a `resetRateLimit()` test seam, and an honest note about its single-process assumption.
- **`app/api/newsletter/route.ts`** is the model the other eight routes should follow — rate limit, zod parse, typed duplicate-key guard with the security reason in the comment, Sentry, distinct 400/500.
- **The three existing test files are real tests** — 1,030 lines covering the full validation matrix, missing-env cases, upstream failures, and the EasyPay fail-closed path.
- **`.gitignore` is complete and the repo is actually clean** — the 2 MB `tsconfig.tsbuildinfo`, `storybook-static/`, `.next/`, `.env` and a stray `package-lock.json` all exist on disk and none are tracked.
- **`next.config.ts` does not set `ignoreBuildErrors` or `ignoreDuringBuilds`** — the two escape hatches that would make the build lie.
- **`prettier --check` passes on every file**, and ESLint has zero errors.

**SEO / i18n / a11y**

- **`utils/metadata.ts:83-171`** — one shared builder producing canonical, hreflang (en/pt/x-default), full OG (type, url, siteName, locale + alternateLocale, sized image with alt), twitter `summary_large_image`, `metadataBase`, icons and robots from a single normalized path. The claim in its comment that canonical/hreflang/og:url never disagree holds.
- **Every route under `app/[lng]/` has metadata**, and 22 of 23 `getMetadataPageInfo` call sites pass a key valid in both locale files and in `SITE_GET_URLS` (script-verified) — SEO-3 is the only exception.
- **Translation completeness is excellent** — 945 EN leaf keys, **0 missing in either direction** across all 18 namespaces, 5 empty values total.
- **Locale routing is correct** — whole-segment matching in both the guard and the fallback, negotiation constrained to pt/en, no redirect-loop risk, and `toIntlLocale` guarding `Intl` against `RangeError`.
- **No clickable `<div>`/`<span>` anywhere** — a scan of every file containing `onClick` found only two *comments* describing the fix that had already been applied.
- **Form accessibility is strong where it was done** — `Input.tsx:31-77` computes `aria-describedby` from hint + error ids with `aria-invalid` and `role='alert'`; the newsletter block adds `role='status'`; the donation details step labels every field including the compound phone inputs.
- **`components/ui/carousel.tsx`** — `role='region'`, per-slide `role='group'` with `aria-roledescription`, arrow-key navigation, and **translated** `sr-only` control labels. The mobile menu has a real hand-rolled focus trap plus Escape handling.
- **Landmarks and a working skip link** on the org site, a global `:focus-visible` outline, and `alt` marked `required: true` in the Media collection with a bilingual admin description.

---

## What was not verified

Stated plainly, so this report isn't read as more complete than it is.

- **The test suite never ran.** `vitest` could not start in this session (native binding platform mismatch — `node_modules` was installed on macOS, the audit shell is linux-arm64). Its real pass/fail state is unknown. QUA-5 is separate, independent evidence that it cannot run in CI either.
- **`pnpm build` was not run**, so build-time-only failures (server/client boundary violations, `cacheComponents` violations) are not covered here. The `.next/` measurements quoted in PERF-1, PERF-8 and PERF-9 come from an existing build that may be stale — the import patterns behind them are confirmed in source.
- **Production values were not inspected.** SEC-11's `PAYLOAD_SECRET` length was read from the local `.env` only; the GitHub secret could not be seen. Verify before dismissing it.
- **Nothing was exercised at runtime.** SEC-15's claim that three client-fetching blocks may be silently rendering nothing, and A11Y-10's dependence on current CMS copy, are both marked unconfirmed for this reason.
- **`nginx -T` was not run**, so PERF-12 cannot say whether compression is enabled in the parent config. Check this first — if it is off, it outweighs everything else on the performance list.
- **The live CMS was not queried**, so how many documents are currently in a draft state — i.e. how much content SEC-1 is actually exposing right now — is unknown.
