# HawkStars — Application Audit

**Date:** 2026-08-01
**Scope:** Full sweep — security, performance, code quality/tech debt, testing, accessibility, SEO, i18n
**Method:** Static analysis of the working tree at `main` (dirty: 8 modified files under `payload/`, plus untracked `payload/utilities/collections/`). Build artefacts inspected from `.next` (BUILD_ID `iUTcDhD8rozwgWVZ4kxFX`, 2026-07-31). No commands were run against production; no files were modified.

---

## Executive summary

The codebase is in better shape than most projects of this size. Type safety is genuinely strong (0 `as any`, 0 `@ts-ignore` across ~630 TS files, `strict: true`), the security headers and Payload auth hardening are thoughtfully configured, TOTP 2FA is enforced in production, and the three payment-route test files are exemplary.

Three things need attention before anything else:

1. **`member_projects` is unauthenticated-writable through the Payload REST API**, including its moderation flag — anyone can publish content to the public site. The hardened app route that was built to prevent this sits at a different path and is simply bypassed.
2. **Payload migrations have never run in production.** `migrationDir` is unset, so `pnpm migrate` in the deploy pipeline resolves to a non-existent directory and silently no-ops.
3. **Three config lines are costing ~60% of the page weight** — `inlineCss`, a `sizes` default of `100vw`, and eagerly-bundled Sentry Session Replay.

Counts by severity: **1 Critical, 12 High, 21 Medium, 17 Low.**

### Fix in this order

| #   | Item                                                     | Effort | Why first                                                    |
| --- | -------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| 1   | SEC-C1 / SEC-H1 / SEC-H2 — lock down `MemberProject`     | ~1 h   | Unauthenticated defacement + PII leak, one file              |
| 2   | QUA-H1 — set `migrationDir`                              | 15 min | Schema drift is accumulating silently                        |
| 3   | PERF-H1 / H3 / H2 — `inlineCss`, `sizes`, Sentry replay  | ~2 h   | Three config changes, largest measurable win                 |
| 4   | A11Y-H1 / H2 — `Input`/`TextArea` labels + focus ring    | ~1 h   | One file fixes both live forms                               |
| 5   | PERF-H4 — `revalidatePath` is passing a slug, not a path | 30 min | CMS edits never invalidate; editors think the site is broken |
| 6   | SEO-H1..H5 — canonical/hreflang/sitemap correctness      | ~3 h   | Currently telling Google `/pt/team` is the homepage          |
| 7   | QUA-H3 — add `pnpm test` + `pnpm format` to CI           | 15 min | Stops all of the above from regressing                       |

---

## Remaining work — task list

_Updated 2026-08-06. Items struck through elsewhere in this doc are done and verified (`eslint`/`tsc` clean) in the live repo. This list is everything still open, grouped by section, in roughly the order it appears below._

### 🔴 Reopened by decision — CSP nonce reverted

- [ ] **SEC-M3** — `script-src 'unsafe-inline'` is back in the production CSP, deliberately. Nonce-based CSP proved incompatible with this site's static generation (two outages); see the SEC-M3 post-mortem below before touching it again.
- [ ] **Housekeeping** — `git rm utils/middlewares/createCSPNonce.ts` (orphaned dead code after the revert; nothing imports it).
- [ ] **SEC-C1 / SEC-H1 are now the priority** — with no nonce, the stored-XSS injection point is unmitigated by CSP. Fix these instead of reinstating a nonce.

### ⚠️ Blocked on you — fix is drafted, just needs pasting in

These three live only in files you were sent this session, because `.github/workflows/*.yml` can't be written back to your machine remotely:

- [ ] **SEC-H3** — `deploy.yml`: `EXIT` trap so the GitHub PAT never persists in the VPS's gitconfig
- [ ] **SEC-M5** — `deploy.yml` + `db-backup.yml`: pin `chromaui/action` and `appleboy/ssh-action` to commit SHAs
- [ ] **QUA-H3** — `deploy.yml`: add `pnpm test` + `pnpm format` to the `check` job
- [ ] **QUA-L2** — `.husky/pre-push`: change `pnpm tsc` → `pnpm typecheck` (the `package.json` half of this fix — `NODE_OPTIONS=--max-old-space-size=4096` on `build`/`typecheck` — is already live)

### Performance

- [ ] **PERF-H5** — Make `Navbar` a server component (Footer is already fixed); keep only hover/mobile-toggle state as small client leaves
- [ ] **PERF-M1** — Stop spreading the full `depth: 3` project doc into 3 client components on the project detail page
- [ ] **PERF-M2** — Add a Cloudinary loader (`f_auto,q_auto,w_${width}` + `images.loader: 'custom'`) so CMS images stop being re-encoded on the VPS
- [ ] **PERF-M5** — Fetch the agenda's current month server-side instead of client-fetching on mount
- [ ] **PERF-M7** — Pre-resize the 13 source images over 4MB in `public/images` (or move them to Cloudinary)
- [ ] **PERF-L1** — Reconsider inline blur-placeholder data-URIs (18.7KB of HTML on `pt/team.html` alone)
- [ ] **PERF-L2** — Trim `deviceSizes`' `2048` entry now that PERF-H3 is fixed; consider `imageSizes` for icon-scale assets
- [ ] **PERF-L5** — Replace `date-fns` in the 9 client components that only use it for `format` with server-side formatting or `Intl.DateTimeFormat`

### Code quality & tech debt

- [ ] **QUA-M3** — Run Prettier on the 7 drifted files (`FormContributions.tsx`, `SingleProjectObjectives.tsx`, `InstagramGrid.tsx`, `CallToAction/Component.tsx`, `ImageComparisonSliderBlock/Component.tsx`, `QuoteHighlightBlock/Component.tsx`, `payload/fields/translateInput.tsx`)
- [ ] **QUA-M4** — Add a `reportError(err, context)` helper (`console.error` + `Sentry.captureException`) and replace the 54 bare `console.*` call sites; stop logging full webhook bodies in `app/api/easypay/route.ts`
- [ ] **QUA-M5** — Delete dead components: `components/donate-test/index.tsx` (posts a real donation with a hardcoded email — delete first), `FormContributions.tsx`, `events/EventsList/index.tsx`, `ProjectNewsSection.tsx`, `SingleProjectResults.tsx`, `getNewsById`, `lib/payload/seed/development.ts`; audit the 12/28 unused `components/ui/` primitives. (`PartnersMapWrapper.tsx` no longer exists — already moot.)
- [ ] **QUA-M6** — Fix or delete `components/events/EventsList/index.tsx` (wrong type, missing `lng` prefix, bare `<a>`, duplicated text) — currently dead code either way
- [ ] **QUA-M7** — Extract a shared `<ListCard>` from `EventCard.tsx`/`ProjectCard.tsx` (~85% duplicated); fix `EventCard`'s unused `index` prop losing LCP preload
- [ ] **QUA-M8** — Rebuild `DonationWidget` on React Hook Form + Zod (currently 12 raw `useState`, no validation); add `zodResolver` to `SubmitProjectForm.tsx` and export its inline schema to `lib/schemas/`
- [ ] **QUA-L1** — Replace `Record<string, any>` in `EventPage.tsx`/`EventCard.tsx`/`hawkEvent.ts` with the generated `HawkEvent` type; narrow the two blanket `/* eslint-disable */` files; `as NextConfig` → `satisfies` in `next.config.ts`
- [ ] **QUA-L2** — _(Partially fixed: `package.json`'s `build`/`typecheck` scripts now set `NODE_OPTIONS=--max-old-space-size=4096`, matching what `.claude/CLAUDE.md`/`ops.md` already claimed. Still needs your manual paste: `.husky/pre-push` is protected and couldn't be written remotely — it should call `pnpm typecheck`, not the raw `pnpm tsc`.)_
- [ ] **QUA-L3** — Add a `lint-staged` pre-commit hook (format + lint on changed files only), leaving the full build to CI
- [ ] **QUA-L4** — Remove unused deps (`motion`, `graphql`, `require-in-the-middle` if undocumented, `autoprefixer`, `playwright` + `@vitest/browser-playwright`); consolidate `classname-variants` vs `class-variance-authority` to one
- [ ] **QUA-L5** — Route the `local_event`/`international_event` label mapping (duplicated in 5 places) through i18n consistently
- [ ] **QUA-L6** — Longer-term: pick one naming/export convention; consider merging the two parallel data-fetching stacks (`lib/payload/queries/*` vs `lib/payload/client/*`); fix the missing try/catch in `getEventsByMonthAndYear`
- [ ] **QUA-L7** — Delete `path/to/venv/`; consolidate `.env.example`/`.env.variables` (fix the "paylaod" typo either way)
- [ ] **QUA-L8** — Add `synchronize` to the existing `pull_request` trigger's `types` list so re-pushes to an open PR are re-checked too

### Accessibility

_**A11Y-H1 through M7 were all fixed on 2026-08-06** (`tsc` + `eslint` clean; see the struck-through detail entries below). Two follow-ups are left over:_

- [ ] **A11Y-M3 (follow-up)** — The three hero blocks now take a CMS `headingLevel` field that defaults to `h1`. Existing content is unchanged, but **any page that stacks two heroes still needs the second one set to H2 in the admin UI** — code can't detect this, since blocks render through a Lexical converter with no sibling context.
- [ ] **A11Y-M5 (follow-up)** — The three _computed_ contrast failures are fixed. The broader sweep of ~35 remaining `text-white/50|60` and `opacity-50|60` usages is still open; each needs checking against its own backdrop.
- [ ] **Run `pnpm test` locally** — the suite could not be run from this session (the repo's native `rolldown` binding is built for macOS and the remote shell is Linux). `tsc` and `eslint` both pass.

### SEO — untouched section

- [ ] **SEO-H1** — `/team` and `/artwork/[slug]` should not canonicalize to the homepage
- [ ] **SEO-H2** — Homepage loses canonical/hreflang whenever CMS meta exists — pass `lng`/`urlPath` into `prepareMetadataInfo`
- [ ] **SEO-H3** — CMS `[slug]` pages need canonical/hreflang/OG/Twitter metadata, not just title+description
- [ ] **SEO-H4** — Fix the loose `startsWith` vs strict locale check so `/enterprise`-style paths don't 200 with an invalid `lang`; fix `split('/')[0]` → `[1]`
- [ ] **SEO-H5** — Sitemap: add `news` and `hawk_events`; add `/crowdfunding`/`/gaming` to the static routes list; add `alternates.languages` per entry
- [ ] **SEO-M1** — Either wire the Payload SEO plugin's `collections`/`uploadsCollection`, or delete it
- [ ] **SEO-M2** — Add `app/robots.ts` disallowing `/*/preview/` and `/api/`
- [ ] **SEO-M3** — `[...notfound]/page.tsx` should call `notFound()` instead of rendering a soft-404 page
- [ ] **SEO-M4** — Trim the 14 titles >60 chars and 20 descriptions >160 chars in `metadata.json`; fix orphan/missing metadata keys
- [ ] **SEO-M5** — Localize Crowdfunding/Gaming metadata (currently English-only or mixed EN/PT)
- [ ] **SEO-L1** — Wire up `BreadcrumbJsonLd`/`WebPageJsonLd`; fix the incorrect US `Nonprofit501c3` status; fix the unresolved `{lng}` search action; add `eventStatus`/`eventAttendanceMode`/`offers` to `EventJsonLd`; add JSON-LD to project pages
- [ ] **SEO-L2** — Collapse the double `www` → `https` redirect hop (handled in both `next.config.ts` and `nginx.conf`)

### Internationalization

- [ ] **I18N-M2** — Translate the 46 hardcoded English strings across 27 files (`MapLocationBlock`, `NewsletterSignupBlock` — which is also a dead no-op form, `DonationProgressBlock`, slide-arrow `aria-label`s, etc.)
- [ ] **I18N-M3** — Fix locale-detection order (ties to SEO-H4's `split('/')[0]` bug); stop the referer-header cookie short-circuit; handle `/pt-BR`-style variants

---

## 1. Security

### <strike>🔴 SEC-C1 (Critical) — `member_projects` accepts unauthenticated writes, including the moderation flag</strike>

`payload/collections/MemberProject/index.ts:37-43`

```ts
access: {
  admin: authenticated,
  read: anyone,
  create: anyone,      // ← unauthenticated create
  update: authenticated,
  delete: authenticated,
},
```

No field-level access, no `beforeChange`/`beforeValidate` hook (only `afterChange: [notifyOnMemberProject]`). The `is_confirmed` moderation checkbox (`:51-63`) is therefore writable by anyone.

Payload's REST surface is live at `/api/member_projects` via `app/(payload)/api/[...slug]/route.ts:15`. That path is **distinct** from the hardened app route at `/api/member-projects` (hyphen), so the zod schema, URL protocol allow-list and rate limiter in `app/api/member-projects/route.ts:24-60` are entirely bypassed.

An unauthenticated `POST /api/member_projects` with `{"title":…,"is_confirmed":true,…}` publishes straight to the public showcase, which queries exactly `where: { is_confirmed: { equals: true } }` (`lib/payload/queries/memberProject.ts:33`). No rate limit on that path either.

**Fix**

```ts
// field
{ name: 'is_confirmed', type: 'checkbox', defaultValue: false,
  access: { create: () => false, update: authenticated } },
// collection
hooks: { beforeValidate: [({ data, req, operation }) =>
  operation === 'create' && !req.user ? { ...data, is_confirmed: false } : data] }
```

Better still: set `create: authenticated` on the collection and let `/api/member-projects/route.ts` remain the sole public write path (it already uses `overrideAccess: true` at `:93`).

### 🟠 <strike>SEC-H1 (High) — Stored XSS via `javascript:` URLs in member-project links</strike>

`components/members-corner/MembersShowcase.tsx:56, 78, 97` render `href={project.video_url}` and `href={d.link}`. Both fields are plain `type: 'text'` with no validation (`payload/collections/MemberProject/index.ts:122-133`, `:176-179`).

The app route guards this correctly (`app/api/member-projects/route.ts:9-22`, `isHttpUrl`) — but that guard does not apply to the REST path from SEC-C1. A stored `javascript:alert(document.cookie)` executes same-origin with the Payload admin session cookie. The CSP includes `'unsafe-inline'` (SEC-M3), so it does not mitigate this.

**Fix:** move `isHttpUrl` into the field definition as a Payload `validate` function so it applies to every write path — REST, GraphQL, admin, Local API.

### 🟠 <strike>SEC-H2 (High) — Public REST read leaks submitter name + email for every submission</strike>

`payload/collections/MemberProject/index.ts:39` (`read: anyone`), fields at `:189-220`. The group's "admin only" text is a UI description, not access control.

`GET /api/member_projects?limit=1000&depth=0` returns `submitter.submitter_name` and `submitter.submitter_email` for **all** documents, including unmoderated ones. The server-side query (`lib/payload/queries/memberProject.ts:39-48`) correctly omits these fields; the REST endpoint bypasses it. GDPR-relevant PII, harvestable in one request.

**Fix**

```ts
// on the submitter group
access: { read: ({ req: { user } }) => Boolean(user) }
// on the collection
read: ({ req: { user } }) => user ? true : { is_confirmed: { equals: true } },
```

### 🟠 SEC-H3 (High) — Deploy writes the GitHub PAT into the VPS's persistent gitconfig

> **Fix drafted, not yet live** — an `EXIT` trap now unsets the `insteadOf` config unconditionally in the updated `deploy.yml`, but that file is protected and couldn't be written back to your machine remotely. You have the updated file from this session; paste it in manually.

`.github/workflows/deploy.yml:90`

```yaml
git config --global url."https://${{ secrets.PERSONAL_GITHUB_TOKEN }}:@github.com".insteadOf "https://github.com"
```

Two problems: the secret is interpolated into the script string sent to `appleboy/ssh-action` rather than passed via `envs:` (as all 19 other secrets correctly are, `:57-83`), and the resulting command persists the raw PAT into `/root/.gitconfig` indefinitely — surviving every deploy, readable by anything running as that user and captured in filesystem snapshots.

**Fix:** use an SSH deploy key, or pass the token through `envs:` with an ephemeral credential helper unset at the end of the script.

### 🟡 <strike>SEC-M1 (Medium) — EasyPay webhook fails **open** when the shared secret is unset</strike>

`app/api/easypay/route.ts:25-40`

```ts
const expected = process.env.EASYPAY_WEBHOOK_SECRET;
if (!expected) {
  Sentry.captureMessage('… endpoint is unauthenticated', { level: 'warning' });
  return true; // ← accepts the request
}
```

The trade-off is documented in the comment above it, and the reasoning is sound in principle. But the failure mode is severe: anonymous callers can `payload.create({ collection: 'contributions' })` (`:145`) and flip `is_confirmed: true` on arbitrary contributions (`:186-216`, matched only on an attacker-supplied `transaction_key`). `deploy.yml:136` writes the variable, but `.env.variables` does not list it — so a regenerated env file silently disarms the endpoint.

Secondary: the token is accepted as a **query parameter** (`?token=…`, `:37`), which nginx records verbatim in `access.log`. No rate limiting on this route.

**Fix:** fail closed in production (`if (!expected) return process.env.NODE_ENV !== 'production'`); drop the query-param path; use `crypto.timingSafeEqual`; re-verify status out-of-band against the EasyPay API before setting `is_confirmed`.

### 🟡 <strike>SEC-M2 (Medium) — Rate limiter bypassable via client-supplied `X-Forwarded-For`</strike>

`utils/rateLimit.ts:68-72` takes `forwarded.split(',')[0]` — the **first**, attacker-controlled hop. `nginx.conf:33` uses `$proxy_add_x_forwarded_for`, which _appends_ the peer address to whatever the client sent, so `X-Forwarded-For: 1.2.3.4` arrives as `1.2.3.4, <real-ip>`.

Rotating that header defeats the limits on `/api/donate` (10/min), `/api/subscription` (10/min) and `/api/member-projects` (5/min).

**Fix:** prefer `X-Real-IP` (nginx sets it from `$remote_addr` at `nginx.conf:32` and it is not appendable), or take the **last** entry of `X-Forwarded-For`.

### 🟡 SEC-M3 (Medium) — `script-src 'unsafe-inline'` in the production CSP

> **Status 2026-08-06: deliberately REOPENED / accepted as a known risk.** The nonce-based fix below was implemented, caused two production outages, and has now been reverted by decision. `script-src 'unsafe-inline'` is back — intentionally. Read the post-mortem before attempting this again.

`next.config.ts`. This removes essentially all XSS mitigation value from the script directive — directly relevant to SEC-H1. Everything else in the policy is correct (`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`); this is the one weak link.

**Original fix (attempted, then reverted):** generate a per-request nonce in `proxy.ts` (`crypto.randomUUID()` → `x-nonce` header → `script-src 'nonce-…' 'strict-dynamic'`).

#### Why the nonce approach was abandoned

Nonce-based CSP is **architecturally incompatible with this site's rendering strategy**. Next.js can only inject a nonce while a document is server-rendered for a real request; a prerendered/PPR shell is built with no request, so it carries no nonce and the browser then blocks _every_ script on the page. Confirmed against the [official CSP guide](https://nextjs.org/docs/app/guides/content-security-policy) — _"you must use dynamic rendering to add nonces"_ and _"Partial Prerendering (PPR) is incompatible with nonce-based CSP"_ — and [vercel/next.js#89754](https://github.com/vercel/next.js/issues/89754), still open with no official workaround.

That left only two options, both bad:

1. Force every route dynamic (a top-level `await headers()` in each root layout, deliberately **not** wrapped in `<Suspense>`). Works, but permanently logs `Runtime data … accessed outside of <Suspense>` ([blocking-route](https://nextjs.org/docs/messages/blocking-route)) and destroys the static shell — no full-page static caching, no CDN edge caching — on a mostly-static content site. Escaping via `cacheComponents: false` is not viable either: 16 files depend on `'use cache'`, plus `cacheLife` and the `revalidateCollection.ts` tag-based revalidation utility. (`export const dynamic = 'force-dynamic'` is also rejected outright by `cacheComponents` — [#84894](https://github.com/vercel/next.js/discussions/84894).)
2. Wrap `headers()` in `<Suspense>` to silence the log — which lets the shell prerender again and re-breaks the entire site.

**Decision:** drop the nonce. Static generation is worth more here than the marginal CSP hardening, _and_ the nonce was never mitigating this site's actual XSS exposure — see below.

#### What is live now

A static, nonce-free policy in `next.config.ts` (`headers()`), which is Next's documented ["Without Nonces"](https://nextjs.org/docs/app/guides/content-security-policy) pattern:

- `script-src 'self' 'unsafe-inline' blob: <third-party allowlist>` — `'unsafe-inline'` is unavoidable without a nonce because Next emits inline bootstrap/RSC-payload scripts whose content changes per page and per build, so hashes aren't maintainable.
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — required regardless of the nonce decision: a nonce can only attach to a `<style>` _element_, never an inline `style=""` _attribute_, and this codebase sets those in 84+ places (dynamic per-item colours from CMS data that static Tailwind utilities can't express), with React applying more during hydration. Note CSP **ignores `'unsafe-inline'` whenever a nonce or hash is present in the same directive** — this is the trap that made an intermediate `style-src-attr 'unsafe-inline'` attempt fail while the nonce was still on `style-src`.
- Because `'strict-dynamic'` is gone, third-party origins are no longer inherited transitively from a trusted loader and must each be listed: `googletagmanager.com`, `google-analytics.com`, `*.cloudinary.com`, `upload-widget.cloudinary.com`, `www.instagram.com`, `*.cdninstagram.com`. **If a third-party widget breaks, this allowlist is the first place to look.**
- CSP generation was removed from the proxy chain entirely. `utils/middlewares/createCSPNonce.ts` is now **orphaned dead code** — nothing imports it. Delete it: `git rm utils/middlewares/createCSPNonce.ts`.

#### Compensating controls (these matter more than the CSP)

`'unsafe-inline'` is defence-in-depth, not the primary control. The real exposure is the **stored XSS in SEC-C1 / SEC-H1** (`javascript:` URLs persisted via the unguarded Payload REST path, executing same-origin with the admin session cookie). Those are still open and are where the effort should go — a nonce would have been mitigating a symptom while the injection point stayed wide open. Prioritise SEC-C1 and SEC-H1 over reinstating a nonce.

#### If static generation is ever wanted _with_ a strict CSP

Next has experimental hash-based CSP via Subresource Integrity (`experimental.sri.algorithm`), which per the official guide keeps static generation and CDN caching while allowing a strict `script-src` with no nonce and no `'unsafe-inline'`. Experimental, and it cannot cover dynamically generated scripts — evaluate off the critical path, never mid-incident.

### 🟡 <strike>SEC-M4 (Medium) — Custom endpoints authorize on "any logged-in user", then bypass collection access</strike>

`payload/endpoints/notifications.ts:55-95` gates on `if (!user)` and then calls `payload.update(…)`, which defaults to `overrideAccess: true`. `Notification` declares `update: authenticatedAdmin` (`payload/collections/Notification/index.ts:26`), so any Editor can mutate the admin activity log — including `{ all: true }`, clearing unread state on up to 500 entries (`:65-83`).

Same pattern in `payload/endpoints/dashboardStats.ts:7` and `sumContributions.ts:13`, which expose full donation totals and user counts to non-admins.

**Fix:** gate with `authenticatedAdmin`-equivalent checks, and/or pass `overrideAccess: false, user: req.user` so declared collection access is actually enforced.

### 🟡 SEC-M5 (Medium) — Unpinned third-party GitHub Actions

> **Fix drafted, not yet live** — `chromaui/action` and `appleboy/ssh-action` are pinned in the updated `deploy.yml`/`db-backup.yml` from this session, but both files are protected and couldn't be written back to your machine remotely. Paste them in manually.

`.github/workflows/db-backup.yml:46` (`appleboy/ssh-action@master`) and `deploy.yml:203` (`chromaui/action@latest`). The `ssh-action` step receives `SSH_PRIVATE_KEY`, `SSH_PASSPHRASE` and the Google OAuth refresh token (`:48-58`) — a compromised upstream commit exfiltrates production VPS access and Drive credentials. `deploy.yml:` correctly pins `appleboy/ssh-action@v1`, so this is an inconsistency rather than a policy gap.

**Fix:** pin all third-party actions to a full commit SHA.

### 🔵 Low

- <strike>**SEC-L1** — `.env.sentry-build-plugin:5` holds a live org-scoped `SENTRY_AUTH_TOKEN` in plaintext on disk. It is gitignored and `git log --all -S"sntrys_"` confirms it was never committed, but it should be rotated and moved to the shell/CI environment only (already `secrets.SENTRY_AUTH_TOKEN` in `deploy.yml:60`).</strike>
- <strike>**SEC-L2** — Error detail leaked to unauthenticated callers: `app/api/instagram/route.ts:131` returns `error.message`; `donate/route.ts:73`, `subscription/route.ts:49`, `member-projects/route.ts:99` return the full `e.issues` zod dump.</strike>
- <strike>**SEC-L3** — `/api/instagram` is unauthenticated and unrated (`route.ts:63-90`); each hit is a DB read plus a Graph API call. `limit` varies 1-50, so each value is a distinct cache key. Cheap way to burn the Instagram quota.</strike>
- <strike>**SEC-L4** — `payload/collections/Media.ts:33` uses `mimeTypes: ['image/*']`, which matches `image/svg+xml`. Mitigated by `disableLocalStorage: true` + Cloudinary serving from a separate origin, but `Documents.ts:30-39` already uses an explicit safe list — do the same here.</strike>

### ✅ Verified OK

- Zod validation on `/api/donate`, `/api/subscription`, `/api/member-projects` — amounts capped at 50k, enum-constrained methods, length-bounded strings.
- `isHttpUrl` protocol allow-list in `app/api/member-projects/route.ts:9-22` is correct (just not applied on the REST path).
- Rate limiting on all three public write routes with `Retry-After` and a bounded self-sweeping bucket map.
- **No hardcoded secrets in tracked source.** Greps for API-key/token/password literals, `AKIA*`, `sk_live_`, `ghp_`, `xox*`, `-----BEGIN` across `app/ components/ lib/ payload/ utils/ .github/` returned nothing. Git history `-S` searches surface only placeholders.
- Only one `NEXT_PUBLIC_` variable in use (`NEXT_PUBLIC_APP_URL`) — no secret is browser-exposed.
- `payload.config.ts:60-90` asserts required env vars at boot, production-gated for the Gmail OAuth credentials.
- GraphQL playground and introspection disabled in production (Payload defaults, not overridden).
- CORS and CSRF scoped to a single origin (`payload.config.ts:94-95`), resolved from a constant, not a request header.
- Unspecified collection/global access is deny-by-default in Payload — `Media` and `Documents` are not publicly readable.
- `Contribution` is fully locked down, with the only field-level access block in the codebase on the EasyPay payment-details group.
- `Users` cannot self-escalate — `create/update/delete: authenticatedAdmin`, so `isAdmin`/`isEditor` are unwritable by non-admins.
- Auth hardening: `tokenExpiration: 30d`, `maxLoginAttempts: 5`, `lockTime: 24h`, and TOTP 2FA `forceSetup` in production.
- No injection or SSRF: no `eval`/`new Function`; every raw Mongo call is confined to migrations with static filters; every `fetch()` URL comes from env vars or constants.
- All 6 `dangerouslySetInnerHTML` uses are `JSON.stringify(schema)` over hardcoded values, or a static i18n string.
- Security headers complete: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, HSTS with `preload`, `Permissions-Policy`, `productionBrowserSourceMaps: false`.
- nginx: HTTPS enforced, www canonicalized, `client_max_body_size 50M`, `limit_req zone=mylimit burst=30 delay=10`.
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 2880` (48 h) and an explicit `allowBuilds` allowlist — good supply-chain posture.

---

## 2. Performance

Measured from the production build:

| Metric                                         | Value                        |
| ---------------------------------------------- | ---------------------------- |
| Home page HTML (`.next/server/app/pt.html`)    | **437 KB raw / 74 KB gzip**  |
| — of which inline CSS                          | 170 KB                       |
| — of which RSC flight payload                  | 213 KB                       |
| Shared root JS on every page (`rootMainFiles`) | **862 KB raw / 259 KB gzip** |
| `'use client'` files                           | 60 of 246                    |

### 🟠 <strike>PERF-H1 (High) — `inlineCss: true` ships the same 170 KB stylesheet twice per document</strike>

`next.config.ts:74`. Measured in `.next/server/app/pt.html`: one 170 KB `<style>` block, **zero** `<link rel=stylesheet>`, _and_ a 171 KB `self.__next_f.push` flight chunk containing the identical CSS. Same on `pt/team.html` (168 KB + 227 KB) and `pt/transparency.html`, where inline CSS is **89% of the whole document**.

Because there is no stylesheet `<link>`, the CSS is **never browser-cached** — every navigation re-downloads it.

**Fix:** remove `inlineCss: true`; Next emits a cacheable `<link>` chunk. Separately, 168 KB of Tailwind output is large for this site — audit the hand-written `@layer components` block in `app/globals.css:84-306`.

### 🟠 <strike>PERF-H2 (High) — Sentry Session Replay in the root bundle, 100% trace sampling</strike>

`instrumentation-client.ts:11` `tracesSampleRate: 1`; `:16` `replaysOnErrorSampleRate: 1.0`; `:23-29` statically imported `replayIntegration`. The rrweb chunk (`.next/static/chunks/3buf985lt91_f.js`) is in `rootMainFiles` and weighs **552 KB raw / 172 KB gzip** — **two-thirds of the entire shared bundle is Sentry**.

**Fix:** `Sentry.lazyLoadIntegration('replayIntegration')`, or drop replay. Set `tracesSampleRate` to ~0.1 in production.

### 🟠 <strike>PERF-H3 (High) — `sizes` defaults to `100vw`, so 80 of 103 images get a full 2048px srcset</strike>

`payload/components/Media/ImageMedia/index.tsx:83` — `sizes={sizes ?? '100vw'}`. Across `components/`, `app/`, `payload/`: **103 `<ImageMedia>` usages, 23 pass `sizes`, 80 do not** (worst: `contribute/page.tsx` with 15).

Supplying `sizes` forces a width-descriptor srcset over the whole `deviceSizes` range instead of the 1x/2x pair. Confirmed in `pt/team.html`: the 150px header logo renders `sizes="100vw"` with a srcset up to `2048w` — and that image is also `preload`/`fetchPriority=high` (`components/navbar/Navbar.tsx:40`), so it competes directly with LCP.

**Fix:** drop the `?? '100vw'` default so fixed-width images get a correct 1x/2x srcset, and add real `sizes` to the grid/hero call sites. Cheapest single win on the site.

### 🟠 <strike>PERF-H4 (High) — Page revalidation passes a slug where a path is required; 9 collections have no hook</strike>

`payload/collections/Pages/hooks/revalidatePage.ts:15, 21, 29` — `revalidatePath(doc.slug)`. `doc.slug` is e.g. `history`, but the routes are `/pt/history` and `/en/history`. **Editing a Page never invalidates its route** — no leading slash, no locale segment. Editors wait out the 900 s ISR window and conclude the CMS is broken.

Compounding: only `Pages`, `Header`, `Footer` and `MainPage` have revalidate hooks. `News`, `HawkProject`, `HawkEvent`, `BoardMember`, `Partner`, `Contribution`, `ArtCollection`, `Curator` and `MemberProject` have none, yet their queries are `'use cache'` + `cacheLife('hours')`.

**Fix:** `revalidatePath('/[lng]/' + doc.slug, 'page')` or loop over `languages` explicitly. Add `cacheTag()` per query with matching `afterChange`/`afterDelete` hooks — the Header/Footer/MainPage pattern is already correct and just needs replicating.

### 🟠 PERF-H5 (High) — The whole site shell is client-rendered; the footer is `ssr: false`

> **Partially resolved already** — `FooterWrapper.tsx` no longer exists; `Footer.tsx` is now a proper `async` server component taking `footerInfo` as a prop. Only the `Navbar` half of this finding still stands.

`components/footer/FooterWrapper.tsx:5-7` wraps `Footer` in `dynamic(…, { ssr: false })`. `Footer.tsx:1` and `Navbar.tsx:1` are both `'use client'`, reading from `utils/contexts/AppProvider.tsx:34-40`.

- The footer — all site nav links — is **absent from server HTML**: SEO cost plus a guaranteed post-hydration layout shift on every page.
- `headerInfo` + `footerInfo` (Payload globals at depth 1) are serialized into every page's flight payload _and_ re-rendered in JS. The key histogram for `pt.html` is dominated by nav: 64 × `newTab`, 63 × `link`, 59 × `label`, 58 × `columns`.
- 53 files import `@/i18n/client`, putting i18next + react-i18next on the client path for the whole shell.

**Fix:** make `Navbar`/`Footer` server components taking `headerInfo`/`footerInfo` as props from `app/[lng]/(org)/layout.tsx:76-77`; keep only the mobile toggle and dropdown hover state as small client leaves. Remove `ssr: false`.

### 🟠 <strike>PERF-H6 (High) — `components/ui/map.tsx` statically imports leaflet and `react-dom/server`, nullifying its own dynamic imports</strike>

> Fixed via `import type` for leaflet/leaflet-draw + real `import()` in `useLeaflet()`, and wrapping `SingleProjectTravelMap` in `dynamic(..., { ssr: false })`. `renderToString` itself was left alone — `MapMarker`'s `icon` prop is a fully generic `ReactNode` from callers, not a fixed icon, so it can't be swapped for a static SVG string without narrowing that API.

`:19-20` static `leaflet` + `leaflet-draw`, `:46-47` their CSS, `:72` **`import { renderToString } from 'react-dom/server'`**, `:74-88` value imports from `react-leaflet`. Lines 93-118 then `dynamic(() => import('react-leaflet'))` — but it is already in the static graph, so nothing is deferred.

Confirmed in the build: leaflet appears in `0q9_x7nowa3dr.js` (148 KB) and `1ft1z-mk_f2y5.js` (300 KB / **84 KB gzip**), the latter also containing `renderToString`.

Worse: `app/[lng]/(org)/projects/[slug]/page.tsx:14` imports `SingleProjectTravelMap` **statically**, so Leaflet ships on every project detail page — including projects with no `discoverEuStops`.

**Fix:** `import type` for leaflet (the runtime instance is already lazily loaded at `:1160-1167`); replace `renderToString` with `L.divIcon({ html: '<svg…>' })`; lazy-load the whole `Map` module; wrap `SingleProjectTravelMap` in a `dynamic(…, { ssr: false })` shell as `PartnersMapWrapper.tsx` already does.

### 🟡 Medium

- **PERF-M1** — Whole Payload documents spread into client components: `projects/[slug]/page.tsx:48-54` passes `{...project}` (fetched at `depth: 3`) to three `'use client'` components. `SingleProjectTravelMap` needs exactly two fields. `_full.segment.rsc` for that route is **208 KB**.
- **PERF-M2** — Cloudinary images are re-optimized by the self-hosted Next optimizer. The custom loader is commented out (`payload/components/Media/ImageMedia/index.tsx:90`), so every CMS image is pulled to the VPS and re-encoded by sharp per width × format, bypassing the CDN you already pay for. Add a Cloudinary loader (`f_auto,q_auto,w_${width}`) + `images.loader: 'custom'`. **Still open** — not yet done, despite an earlier status update in this thread claiming it was.
- <strike>**PERF-M3** — Query hygiene. `lib/payload/queries/contribution.ts:7-14` has **no `limit`** (defaults to 10) while the contribute page renders grids of 60/40/110 from it — a correctness bug as much as a perf one. `partner.ts:5-9` and `team.ts:13` use `limit: 1000` at default depth 2 with no `'use cache'` (`pt/team.rsc` = 217 KB). `app/sitemap.ts:26,44,61,78` runs four `limit: 1000` finds **sequentially** at default depth, uncached, on every request. Add `depth: 0|1` + `select` throughout; `Promise.all` the sitemap.</strike>
- <strike>**PERF-M4** — Cache primitives applied inconsistently: `lib/payload/queries/helpers.ts:60` has `'use cache'` with no `cacheLife` and no `cacheTag`; `:33-45` caches for `hours` **even when `opts.preview` is true**, making draft preview unusable. `app/[lng]/(org)/layout.tsx:76-77` awaits header then footer sequentially.</strike>
- **PERF-M5** — The agenda page renders nothing server-side: `AgendaCalendar` is `'use client'` and fetches on mount via an uncached REST call. Fetch the current month server-side and pass it as the initial prop.
- <strike>**PERF-M6** — `utils/metadata.ts:26` does `fs.readFileSync` on every `generateMetadata` call (~20 routes), unmemoized. Static-import the two `metadata.json` files.</strike>
- **PERF-M7** — 105 MB of source images in `public/images` (13 files > 4 MB; `training_center/entry_4.jpg` is 5.5 MB). Four are statically imported and emitted into the 20 MB `.next/static/media`. Users don't download the originals, but the VPS decodes a 5 MB JPEG per uncached variant and every deploy ships 20 MB. Pre-resize to ≤2048 px, or move them to Cloudinary. Note the four `unoptimized` usages — verify none points at these.
- <strike>**PERF-M8** — Both `framer-motion` and `motion` (the same library, renamed) are installed. `motion` has zero imports; `framer-motion` has one, in `components/ui/animated-group.tsx`, which is itself only referenced by a story. Confirmed tree-shaken out of the current build — so no shipped cost today, but two ~120 KB duplicate packages in the lockfile and a live footgun.</strike>

### 🔵 Low

- **PERF-L1** — Blur placeholders inline as ~780-byte data-URIs; 24 on `pt/team.html` = 18.7 KB of HTML.
- **PERF-L2** — With PERF-H3 fixed, the `2048` entry in `deviceSizes` is mostly wasted optimizer work; consider `imageSizes` for icon-scale assets.
- <strike>**PERF-L3** — `logging.fetches.fullUrl: true` (`next.config.ts:31-35`) applies in production; noisy PM2 logs.</strike>
- <strike>**PERF-L4** — `typescript.ignoreBuildErrors: true` is intentional and CI-compensated, but means type-level perf regressions aren't caught at build time.</strike>
- **PERF-L5** — `date-fns` imported in 9 client components purely for `format`. Format on the server or use `Intl.DateTimeFormat`.
- <strike>**PERF-L6** — `components/ui/carousel.tsx` (embla) is statically imported by `payload/blocks/SimpleGallery/Component.tsx:10`. The DatePicker is correctly lazy; the gallery is not.</strike> (Fixed at the real bottleneck: `payload/components/RichText/index.tsx`, which statically imports every block Component including this one — `SimpleGallery` is now the one block loaded via `dynamic(..., { ssr: false })` there.)

### ✅ Verified OK

- **Fonts** — `next/font/google` with `display: 'swap'` in all three layouts, self-hosted woff2, **no `@import`** of Google Fonts in `globals.css`.
- **Third-party scripts** — GA/GTM via `next/script` `afterInteractive`; Instagram dynamically imported with `ssr: false` and `embed.js` injected on demand.
- **No N+1** — every `payload.find` sits outside loops; `projects.ts` and `hawkEvent.ts` correctly use `Promise.all`.
- **`generateStaticParams`** — all three occurrences map over the 2-element `languages` array. **No collection is iterated at build time.**
- **i18n bundle** — `i18next-resources-to-backend` with template dynamic import and `preload: []`. Confirmed code-split; the full 272 KB of locales is not shipped.
- **`react-icons`** imported via subpaths (37 × `react-icons/lu`), so it tree-shakes.
- **Zero raw `<img>`** in application code; LCP preload + `fetchPriority="high"` correctly applied to 9 above-the-fold images.
- **Image config** — avif/webp, `minimumCacheTTL: 43200`, scoped `remotePatterns`, `qualities` allowlist.
- **ISR works** — 51 prerendered routes; `proxy.ts:5` matcher correctly excludes `_next/static`, `_next/image`, `images`, `api`, `sitemap`, `robots`.
- **Cloudinary LQIP** (`lib/image.ts:19-31`) is a pure URL transform with a safe fallback — no extra round trip.

---

## 3. Code quality & tech debt

### 🟠 <strike>QUA-H1 (High) — Migrations have never run: `migrationDir` is unset</strike>

`payload.config.ts:197-199` calls `mongooseAdapter({ url })` with **no `migrationDir`**. Payload's `findMigrationDir` checks `<cwd>/src/migrations` → `<cwd>/dist/migrations` → `<cwd>/migrations`, then falls back to `./migrations`. This repo has none of those — migrations live at `payload/migrations/`.

So the 4 registered migrations have never executed in production. `deploy.yml` runs `pnpm migrate`, and its inline comment ("no-op if there are no migrations") masks the failure. `ops.md` documents the step as working.

**Fix:** `mongooseAdapter({ url, migrationDir: path.resolve(dirname, 'payload/migrations') })`. Then verify against prod — `20260718_152949_change_description_news_to_richtext` and `20260719_000000_remove_content_status` are data-shape migrations the app code already assumes have run.

Secondary: `payload/migrations/index.ts` lists `20260718_152949…` **before** `20260718_000000…`. Payload executes in array order — re-sort before enabling.

### 🟠 <strike>QUA-H2 (High) — `.eslintrc.json` is dead; the documented 140-char rule is not enforced</strike>

ESLint is v10.8.0 — flat config only. `npx eslint --print-config` on `app/sitemap.ts` returns `max-len: undefined` across 112 rules. `.eslintrc.json:4-13` is inert, as is its `"extends": [..., "prettier"]`.

Drift: **248 lines exceed 140 chars** in tracked sources (worst: `erasmus/page.tsx:110` at 220 chars). `ops.md:5` claims this is enforced.

Also `eslint-config-prettier` is installed but **not imported** in `eslint.config.mjs` — nothing disables stylistic rules that could fight Prettier.

**Fix:** delete `.eslintrc.json`; port `max-len` into the flat config (or drop it from `ops.md` and rely on Prettier's `printWidth: 100`); append `eslintConfigPrettier` last.

### 🟠 QUA-H3 (High) — No test step in CI; 3 test files for a 630-file codebase

> **Fix drafted, not yet live** — `pnpm test` and `pnpm format` are added to the `check` job in the updated `deploy.yml` from this session, but that file is protected and couldn't be written back to your machine remotely. Paste it in manually.

`.github/workflows/deploy.yml:22-35` runs `pnpm lint` and `pnpm tsc` only. **`pnpm test` is never run** — not in CI, not in `.husky/pre-push`. The 972 lines of payment tests can rot silently and still deploy. `vitest.config.ts` has no `coverage` block despite `@vitest/coverage-v8` being installed; coverage has never been measured.

Highest-value untested surface, ranked:

1. **`utils/rateLimit.ts`** — guards all three public write routes; window/eviction/`getClientIp` logic has zero direct tests (and see SEC-M2).
2. **`app/api/member-projects/route.ts`** — the only unauthenticated write path, no test file, containing a hand-rolled XSS guard.
3. **`payload/access/*.ts`** — 4 files, 0 tests, high blast radius.
4. **`lib/payload/queries/*`** — 19 files, 0 tests, several swallow errors.
5. **`utils/paths.ts` `transformUrl()`** — used by every internal link.
6. **`utils/metadata.ts`** — SEO resolution with a fallback chain (and see the SEO section).

**Fix:** add `pnpm test` and `pnpm format` to the `check` job; add a `coverage` block with thresholds.

### 🟠 <strike>QUA-H4 (High) — Storybook `addon-vitest` is configured but wired to nothing</strike>

`.storybook/main.ts:18` registers `@storybook/addon-vitest` and playwright is installed, but `vitest.config.ts` declares no Storybook project and there is no `.storybook/vitest.setup.ts`. The 136 stories are never executed as tests, and `@storybook/addon-a11y` produces no CI signal. Three devDependencies (~200 MB with browsers) paid for and unused.

**Fix:** wire up the Storybook vitest project per Storybook 10 docs, or remove all three packages.

### 🟡 Medium

- <strike>**QUA-M1** — `package-lock.json` (666 KB) is **tracked** despite `.gitignore:62` and the pnpm mandate, and it is absorbing all Dependabot security PRs. Commits `279be2a` (brace-expansion), `7a28f26` (qs), `921e22e` (js-yaml) and `904c512` (nodemailer) touched **only the dead lockfile** — four dependency PRs merged with zero effect on what ships. No Dependabot PR has touched `pnpm-lock.yaml` since 2026-05-09. Fix: `git rm --cached package-lock.json`; change `package-ecosystem: 'pnpm'` to `'npm'` in `.github/dependabot.yml`.</strike>
- <strike>**QUA-M2** — No `error.tsx` in any route group. Only `app/global-error.tsx`, `(org)/not-found.tsx`, `(org)/loading.tsx` exist. Any server render error escalates to `global-error.tsx`, replacing the whole shell and losing nav, footer and language context. Also missing: `loading.tsx` in `(crowdfunding)`/`(gaming)`, and a root `app/not-found.tsx`.</strike>
- **QUA-M3** — Prettier is checked nowhere (absent from pre-push and CI) and 7 files have already drifted: `FormContributions.tsx`, `SingleProjectObjectives.tsx`, `InstagramGrid.tsx`, `CallToAction/Component.tsx`, `ImageComparisonSliderBlock/Component.tsx`, `QuoteHighlightBlock/Component.tsx`, `payload/fields/translateInput.tsx`. (`app/`, `lib/`, `utils/` are clean.)
- **QUA-M4** — 54 `console.*` calls in production paths vs 16 Sentry uses. The dominant pattern is _log, return empty, pretend success_ — `lib/payload/queries/artwork.ts:17,41`, `contribution.ts:40`, `lib/payload/client/{event,news,sponsors}.ts` (9 sites) all `console.error` then `return null`/`[]`. A CMS outage renders as empty sections with no alert. Two genuinely empty catches at `components/Crowdfunding/ShareButton.tsx:24,30`. And `app/api/easypay/route.ts:69,110,137,172,213` logs webhook bodies on every callback — a PII surface. Fix with a `reportError(err, context)` helper doing `console.error` + `Sentry.captureException`.
- **QUA-M5** — Dead components. `components/donate-test/index.tsx` is unreferenced and POSTs a real donation with `email: 'pcardoso.lei@gmail.com'` hardcoded (`:10`) — delete it. Also unreferenced: `FormContributions.tsx` (221 lines), `events/EventsList/index.tsx`, `PartnersMapWrapper.tsx`, `ProjectNewsSection.tsx`, `SingleProjectResults.tsx`, `getNewsById` in `lib/payload/client/news.ts`, and `lib/payload/seed/development.ts` (79 lines, fully commented out — a second dead seed alongside the live `payload/seed.ts`). **12 of 28 `components/ui/` primitives** are referenced only by their own stories, including `input` and `label` — a signal that no production form uses the shadcn field primitives.
- **QUA-M6** — `components/events/EventsList/index.tsx` has four defects in 64 lines: typed `PaginatedDocs<HawkProject>` (Events list rendering Projects), `href={\`/projects/${slug}\`}`with **no`lng`prefix** (the only violation of`patterns.md:9`in the repo), a bare`<a>`instead of`next/link`, and `project.details?.text` rendered twice. Currently dead — delete or fix all four.
- **QUA-M7** — `EventCard.tsx` and `ProjectCard.tsx` are ~85% copy-paste, including a duplicated `formatDateRange` with gratuitously different signatures. `EventCard` declares an unused `index` prop, silently losing the LCP preload that `ProjectCard:44` gets from its own `index`. Extract a shared `<ListCard>`.
- **QUA-M8** — Form handling contradicts `patterns.md:58` ("React Hook Form with Zod"). `DonationWidget/index.tsx` — the production donation form — uses **12 raw `useState` hooks** with no RHF, no Zod, no client validation at all. `SubmitProjectForm.tsx:60` uses `useForm` but **no `zodResolver`**, because the schema is defined inline in the route module and never exported. Extract to `lib/schemas/` and share.
- <strike>**QUA-M9** — `graphql@17.0.2` violates Payload's peer range (`{"graphql":"^16.8.1"}`, verified in `node_modules/payload/package.json`), and the GraphQL routes are exposed. v17 has breaking changes; the endpoints likely fail at runtime and nothing tests them. Nothing in the app imports `graphql` directly — either pin to `^16.8.1` or drop the dependency and delete the two routes.</strike>

### 🔵 Low

- **QUA-L1** — **Type safety is a genuine strength**: 0 `as any`, 0 `@ts-ignore`, 0 `@ts-expect-error`, 9 `any` in type position (5 unavoidable in `types/images.d.ts`), 5 non-null `!` (all guarded). The one cluster worth fixing: `EventPage.tsx:33`, `EventCard.tsx:11`, `hawkEvent.ts:13` use `Record<string, any>` despite a generated `HawkEvent` type existing. Two blanket `/* eslint-disable */` suppressions to narrow: `components/ui/map.tsx:1` (1233 lines) and `ProjectTestimonialBlock/Component.tsx:1`. `next.config.ts:31` uses `as NextConfig` — prefer `satisfies`.
- **QUA-L2** — `.husky/pre-push` and `deploy.yml:35` both run **`pnpm tsc`**, which has no matching script — pnpm falls through to the binary. The declared `typecheck` script is never invoked. Separately, `CLAUDE.md:32,39` and `ops.md:55` claim build/typecheck run with `--max-old-space-size=4096`; neither script sets `NODE_OPTIONS`. The documented fix for the build-memory troubleshooting entry does not exist.
- **QUA-L3** — No pre-commit hook. `pre-push` runs lint + tsc + a full build, which is slow enough to tempt `--no-verify`. A `lint-staged` pre-commit for format+lint on changed files, with the build left to CI, would survive better.
- **QUA-L4** — Unused deps: `motion`, `dataloader` (transitive of payload), `graphql`, `require-in-the-middle` (exact-pinned, no comment — if it's a Sentry/OTel workaround it belongs in `pnpm-workspace.yaml` overrides), `autoprefixer` (absent from `postcss.config.mjs`; Tailwind 4 handles prefixing), `playwright` + `@vitest/browser-playwright`. Two variant libraries coexist: `classname-variants` (2 files, mandated by `patterns.md:51`) and `class-variance-authority` (6 files, shadcn standard) — pick one. `~` vs `^` pinning is inconsistent with no documented rule.
- **QUA-L5** — The `local_event`/`international_event` label mapping is redeclared in 5 places (`lib/payload/client/news.ts:35-40`, `UpcomingHawkEventBlock/Component.tsx:13-14`, `AgendaCalendar.tsx:34-48`, `AgendaBlockView.tsx:38-42`, `components/news/constants.ts`). Only one routes through i18n; the rest ship hardcoded English on a PT-default site.
- **QUA-L6** — Mixed conventions: 83 PascalCase vs 28 kebab-case component files; 145 default vs 31 named exports; two parallel data-fetching stacks (`lib/payload/queries/*` server, `lib/payload/client/*` browser) with overlapping entities and divergent error semantics — `lib/payload/client/event.ts` even differs internally, with `getEventsByMonthAndYear` (`:116-124`) lacking the try/catch its two siblings have. One 4-level relative import at `partners/page.tsx:8` where everything else uses `@/`.
- **QUA-L7** — Repo hygiene is otherwise clean. `path/to/venv/` exists on disk (an accidental `python -m venv path/to/venv`) but is **not tracked** — it self-ignores via the venv-generated `.gitignore`. Safe to `rm -rf`. `.DS_Store`, `.next/`, `storybook-static/`, `tsconfig.tsbuildinfo`, `.env` — all present, none tracked. `package-lock.json` (QUA-M1) is the only genuine tracked-junk item. `.env.example` and `.env.variables` are redundant duplicates (the latter has a "paylaod" typo) — consolidate.
- **QUA-L8** — _(Partially resolved already: your `deploy.yml` now has a `pull_request: types: [opened]` trigger, so `check` does gate PRs. It only fires on the initial open though, not on later pushes to the same PR — consider adding `synchronize` to the `types` list.)_ `deploy.yml:3-6` has **no `pull_request` trigger** — the `check` job gates only `push: [main]`, so lint/typecheck run _as_ code deploys, not before it lands. Recent history is direct-to-main with messages like `wip`, `fix`, `improving`. Add a `pull_request` trigger plus branch protection. Note the working tree is currently dirty: 8 modified `payload/` files import from an **untracked** `payload/utilities/collections/createNotification.ts` — committing the hooks without that directory breaks the build.

### ✅ Verified OK

- Type safety across ~630 files (see QUA-L1) — `strict: true`, `no-explicit-any` at `error`.
- `app/`, `lib/`, `utils/` are 100% Prettier-clean.
- **The 3 payment test files are the template the rest of the codebase should follow** — 65 cases / 972 lines, organized into success / validation / missing-env / API-error blocks, `vi.hoisted` used correctly, Payload mocked at the module boundary, `resetRateLimit()` in `beforeEach`, explicit `vitest` imports.
- `payload/access/*.ts` — 4 focused files, properly typed, `authenticatedEditor` correctly grants admins editor rights.
- `payload.config.ts:60-90` fails fast on missing env vars with production-gating and an explanatory comment.
- The `isHttpUrl` refinement with its inline explanation of the XSS vector it prevents is exactly right.
- Migration files themselves are well written — `up`/`down` on each, legacy-data coercion documented. Only the wiring is wrong.
- The deploy workflow is thoughtfully commented — the pnpm-launcher removal, `CI=true` purge, and `ecosystem.config.cjs` rationale all explain past incidents inline.
- No exact-duplicate files in `components/` or `payload/blocks/` (normalized-content hashing found zero collisions).
- `.storybook/main.ts` correctly mirrors the `@/` alias into Vite.

---

## 4. Accessibility

### 🟠 <strike>A11Y-H1 (High) — Shared `Input`/`TextArea` destroy the accessible name and the focus ring</strike>

> **Fixed 2026-08-06.** Removed `aria-labelledby`/`aria-label` from both components so the real `<label htmlFor>` provides the name; added a `focus-within`/`focus-visible` ring. Also found and fixed a bug the audit missed: `TextArea` had **no `id` at all**, so its `htmlFor` label pointed at nothing.

`components/utils/Input/Input.tsx:48-65`

```tsx
id={name}                 // input's own id
aria-labelledby={name}    // ← points at ITSELF
aria-label={name}         // ← raw field name, e.g. "submitter_email"
```

`aria-labelledby` resolves to the input element itself, and `aria-label` overrides the correct `<label htmlFor={name}>` on `:36`. Screen readers announce `submitter_email` / `image_url` / `value` instead of the translated label. Same pattern in `components/utils/TextArea/TextArea.tsx:48`.

The same components also remove the focus indicator: `focus:ring-0 focus:outline-hidden` (`Input.tsx:52`, `TextArea.tsx:40`) with no replacement.

This affects **every field of both real forms on the site**. WCAG 1.3.1, 4.1.2, 2.4.7.

**Fix:** delete `aria-labelledby` and `aria-label`; keep `<label htmlFor>`. Replace `focus:outline-hidden`/`focus:ring-0` with `focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2`.

### 🟠 <strike>A11Y-H2 (High) — No error announcement anywhere</strike>

> **Fixed 2026-08-06.** `Input`/`TextArea` now set `aria-invalid` and `aria-describedby` (wired to both the hint and the error text, each with a real `id`), and the error `<small>` carries `role="alert"`. Form-level status regions announce too: `SubmitProjectForm` error → `role="alert"`, success panel → `role="status"`, newsletter success → `role="status"`.

`components/utils/Input/Input.tsx:68` renders the error as a bare `<small>` with no `id`, unreferenced by the input, with no `aria-invalid` and no `role="alert"`.

Repo-wide: **`aria-live` = 0 occurrences**; `aria-invalid` appears only inside Tailwind variant strings, never actually set; `aria-describedby` = 0. Submit-status messages are equally silent (`SubmitProjectForm.tsx:317`, `NewsletterSignupBlock/Component.tsx:67-70`).

**Fix:** `aria-invalid={!!errorMessage}` + `aria-describedby={errorId}` on inputs; `role="alert"` on error text and form-level status regions.

### 🟠 <strike>A11Y-H3 (High) — Donation widget: orphan labels, unlabelled toggle groups, missing `type="button"`</strike>

> **Fixed 2026-08-06.** `DetailsStep`: every label now has `htmlFor` against a real `id`, the two phone inputs sit in a `<fieldset><legend>` with individual `aria-label`s, and the required marker is `aria-hidden` with `aria-required` doing the real work. `AmountStep`: both toggle groups are now `role="radiogroup"` with `aria-checked` and a full roving-tabindex + arrow-key model, so selected state is no longer colour-only. `type="button"` added to all six buttons. Two new translation keys per locale (`phone_indicative_label`, `frequency_legend`, `preset_legend`).

`components/contribute/DonationWidget/DetailsStep.tsx:52, 67, 82, 105` — four `<label>` elements with no `htmlFor`, against inputs with no `id` (`:55, 70, 86, 93, 118`). Only `:105` works, via an implicit wrapping label.

`AmountStep.tsx:43-60` — the one-time/monthly toggle is two plain buttons with no `role="radiogroup"`/`aria-pressed`; `:65-78` — the six preset amounts likewise expose no selected state. Visual state is colour-only.

No `type='button'` on any of them — a latent submit bug if ever nested in a `<form>`. Required fields are marked with a literal `*` in label text only.

**Fix:** `id`+`htmlFor` pairs; `role="radiogroup"` + `aria-checked` (or `<fieldset><legend>` with real radios); `type="button"`.

### 🟠 <strike>A11Y-H4 (High) — Interactive `<div>`s with no keyboard affordance</strike>

> **Fixed 2026-08-06.** `LanguageSwitcher` → real `<Link>`s to the localized path with `aria-current` and `hrefLang` (replacing the imperative `window.location.assign`, so the target is visible and open-in-new-tab works). `Accordion` → heading-wrapped `<button aria-expanded aria-controls>` + labelled `role="region"` panel. `TeamInformation` → a proper `role="tablist"` with `aria-selected`, roving tabindex and Arrow/Home/End keys. `MobileMenuItem` → `<button aria-expanded aria-controls>`, which also makes it visible to the mobile focus trap's `querySelectorAll`.

Every `div/span/li/p` with `onClick` was checked for `role` + `tabIndex` + key handler. Four fail all three:

| File:line                                              | Element              | Consequence                                                                                    |
| ------------------------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------- |
| `components/utils/LanguageSwitcher.tsx:54`             | flag `<div onClick>` | **Language cannot be switched by keyboard at all** — navbar and footer                         |
| `components/navbar/MobileNavbar/MobileMenuItem.tsx:29` | dropdown toggle      | Mobile submenus unreachable; also invisible to the focus trap's `querySelectorAll` at `:35-37` |
| `components/team/TeamInformation.tsx:33`               | section tab          | Team page switcher is mouse-only                                                               |
| `components/utils/Accordion/Accordion.tsx:17`          | accordion header     | Content unreachable; no `aria-expanded`/`aria-controls`                                        |

**Fix:** `<button type="button">` in all four. For LanguageSwitcher also add `aria-current` and prefer `<Link>` to the localized path over `window.location.assign` (`:44`).

### 🟡 Medium

- <strike>**A11Y-M1** — Nested/duplicate `<main>`: `(org)/layout.tsx:87` wraps children in `<main>`, and four pages render a second one inside it (`projects/[slug]/page.tsx:47`, `erasmus/key-action/page.tsx:27`, `not-found.tsx:25`, `EventPage.tsx:56`). No site-level `<header>`; `Navbar.tsx:29` emits a bare `<nav>` and there are two navs with no distinguishing labels.</strike>

  > **Fixed:** the four nested `<main>`s (plus two more the audit missed — `(org)/error.tsx` and `(org)/not-found.tsx`) are now plain wrappers; the layout's single `<main>` carries `id="main-content"`. `Navbar` now renders a `<header>` landmark wrapping a `<nav aria-label>`, and the footer's link columns became a named `<nav>`.

- <strike>**A11Y-M2** — No skip-to-content link anywhere. Keyboard users tab the full multi-column navbar on every page. WCAG 2.4.1.</strike>

  > **Fixed:** an `sr-only focus:not-sr-only` skip link is now the first focusable element in `<body>`, targeting `#main-content`. Its label is resolved inside a `'use cache'` component (`SkipToContent`), **not** awaited directly in `RootLayout` — with `cacheComponents` enabled, awaiting `getServerTranslation` at the top of the layout counts as uncached data outside `<Suspense>` and makes every route in the group blocking and unprerenderable ([blocking-route](https://nextjs.org/docs/messages/blocking-route)). Keep it cached.

- <strike>**A11Y-M3** — Heading structure. `transparency/page.tsx` has **no `h1`**; `[...notfound]/page.tsx:31` has only an `h3`; `contribute/page.tsx:76,80` renders two `h1`s (mobile + desktop copies, both in the DOM). Level skips at `artwork/page.tsx:42`, `artwork/[slug]/page.tsx:84` (h2→h6), `erasmus/page.tsx:204,255`, `erasmus/key-action/page.tsx:145`, `contribute/page.tsx:101,104`, `history/page.tsx:99`, `ContributionProjectGoal.tsx:24`, `PartnerCard.tsx:62`. Four CMS blocks hard-code `<h1>` (`Hero`, `HeroWithBackgroundImage`, `HeroSlideshowBlock`, `CallToAction`) — stacking two on one page produces multiple h1s.</strike>

  > **Fixed (mostly):** `transparency` gets its `h1` from `ContributionProjectGoal`; the catch-all 404's `h3` → `h1`; `contribute`'s duplicate mobile/desktop `h1`s replaced by one `sr-only` `h1` with both visible copies demoted to `<p>` (neither could be THE h1 alone — each is `display:none` at the other breakpoint); all listed level-skips corrected; non-heading `h6`s (IBAN label, partner flag badge) turned into `<p>`/`<span>`. `CallToAction` demoted `h1` → `h2` (a CTA banner is never a page title). The three hero blocks gained a `headingLevel` select (default `h1`) — **see the follow-up in the task list.**

- <strike>**A11Y-M4** — Focus ring fails non-text contrast. `app/globals.css:63` applies `outline-ring/50`; `--ring: oklch(0.708 0 0)` is **2.59:1** on white, and at 50% alpha effectively ~1.6:1 (WCAG 2.2 SC 1.4.11/2.4.11 require 3:1). `outline-none`/`outline-hidden` appears 19×; the Radix/shadcn ones correctly add `focus-visible:ring-*`, but the DonationWidget ones replace it with a border colour change and `Input`/`TextArea` replace it with nothing. `globals.css` contains **zero** `focus-visible` rules.</strike>

  > **Fixed:** `--ring` 0.708 → 0.6 (2.59:1 → ~3.7:1 on white), dark-mode ring → 0.708 (7.6:1), the universal rule's `/50` alpha modifier removed, and an explicit `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }` added to `globals.css` — which previously had zero `focus-visible` rules.

- <strike>**A11Y-M5** — Colour contrast failures (computed): `--muted-foreground` on `--muted` = **4.34:1** (fail AA, used in `components/ui/tabs.tsx:23`); `text-[#999]` € prefix on white = 2.85:1 (`AmountStep.tsx:83`); `placeholder-white/60` + `opacity-60` on the green gradient ≈ 3.3:1 (`NewsletterSignupBlock/Component.tsx:56,73`). 35 further `text-white/50|60` and `opacity-50|60` usages warrant a sweep.</strike>

  > **Fixed (the computed failures):** `--muted-foreground` 0.556 → 0.53 (4.34:1 → ~4.8:1 on `--muted`), the `€` prefix `#999` → `#595959` (2.85:1 → 7.0:1), and the newsletter placeholder/small-print `white/60` → `white/90` (3.08:1 → 4.93:1 against the _lighter_ gradient stop, which is the worst case). Values verified by computing oklch → sRGB → WCAG contrast rather than by eye. **The ~35-usage sweep is still open — see the task list.**

- <strike>**A11Y-M6** — `components/ui/image-comparison-slider-horizontal.tsx:145-151` sets `role='slider'` with `aria-valuenow/min/max` but has **no `tabIndex`** and no arrow-key handler (only `onMouseDown`/`onTouchStart`). A `role="slider"` that can't be focused is worse than none.</strike>

  > **Fixed:** the handle now has `tabIndex={0}`, an `aria-valuetext` percentage, and a full key model — Arrow (±2%), PageUp/PageDown (±10%), Home/End — plus a visible focus ring.

- <strike>**A11Y-M7** — Desktop nav dropdown (`DesktopNavbar/index.tsx:29-44`) has `role='button'`, `tabIndex`, `aria-expanded`, `aria-haspopup` and Enter/Space to open — but **no way to close from the keyboard** (no Escape, no toggle), no `aria-controls`, and focus is never moved into the panel.</strike>

  > **Fixed:** the `<li role='button'>` is now a real `<button>` that **toggles** (it could previously only open), declares `aria-controls` pointing at the panel, and closes on Escape (handled both on the trigger and at the nav level). The panel id is a shared exported constant so `aria-controls` can't drift. _Deviation from the suggested fix:_ focus is **not** programmatically moved into the panel — the panel is later in DOM order and `visibility:hidden` while closed, so Tab reaches it naturally once open, and this avoids stealing focus from a hover-opened panel.

- <strike>**A11Y-M8** — Storybook's a11y addon produces no signal: `.storybook/preview.ts` has no `a11y` parameter block, no storybook vitest project exists, and CI runs neither `pnpm test` nor any axe/Chromatic job. Add `parameters: { a11y: { test: 'error' } }` and wire the test runner (see QUA-H4).</strike>

### 🔵 Low

- <strike>**A11Y-L1** — `NewsletterSignupBlock/Component.tsx:50-57` — placeholder-only email field, no `<label>`, no `aria-label`.</strike>

### ✅ Verified OK

- **Alt text is structurally enforced.** `payload/collections/Media.ts:44-47` marks `alt` `required: true`; `payload/components/Media/types.ts:15` keeps it required at the type level via `Omit<ImageProps,'src'|'resource'>`. All 103 `<ImageMedia>` call sites were parsed: **0 missing `alt`**, and the 4 empty `alt=''` are correct decorative uses paired with `aria-hidden` or adjacent text. Zero raw `<img>` tags.
- **Modal uses Radix Dialog** — real focus trap, `aria-modal`, Escape, translated `sr-only` close label.
- **Mobile nav** has a functional hand-rolled focus trap, Escape-to-close, `role='dialog'`, `aria-modal`, `aria-label`, and focuses the close button on open. (Missing only: focus restoration and body-scroll lock.)
- **Carousel** — `role='region'`, `aria-roledescription`, `onKeyDownCapture` arrow handling.
- **`<html lang>` set in all three layouts** (correct for valid locales — see SEO-H4 for the invalid case). `dir` is unnecessary for pt/en.

---

## 5. SEO

### 🟠 SEO-H1 (High) — `/team` and `/artwork/[slug]` canonicalize to the homepage

`app/[lng]/(org)/team/page.tsx:13` and `artwork/[slug]/page.tsx` both call `getMetadataPageInfo(lng, 'home')`. In `utils/metadata.ts:129-131`, `urls['home'] = '/'` is rewritten to `''`, so the canonical becomes `https://hawkstars.org/pt` — **`/pt/team` and every artwork detail page declare the homepage as canonical** and carry the homepage title and description.

A correct `team` entry already exists in `i18n/locales/{pt,en}/metadata.json` and is simply unused.

**Fix:** `getMetadataPageInfo(lng, 'team')`; give artwork details a `prepareMetadataInfo({ …, urlPath: '/artwork/' + slug, lng })`.

### 🟠 SEO-H2 (High) — Homepage loses canonical + hreflang whenever CMS meta exists

`app/[lng]/(org)/page.tsx:16` calls `prepareMetadataInfo(pageInformation.meta)` with no `lng` and no `urlPath`. In `utils/metadata.ts:57-73` the entire `alternates` block is gated on `canonicalUrl` being truthy — so the homepage emits **no canonical, no hreflang, no `metadataBase`, no `og:url`** whenever the `main-page` global has a meta group.

**Fix:** `prepareMetadataInfo({ ...pageInformation.meta, lng, urlPath: '/' })`.

### 🟠 SEO-H3 (High) — CMS `[slug]` pages get title and description only

`app/[lng]/(org)/[slug]/page.tsx:24-27` returns bare `{ title, description }` — no canonical, no `alternates.languages`, no OpenGraph, no Twitter card. These pages **are** emitted into the sitemap (`app/sitemap.ts:34-44`), so they are indexable with no hreflang pairing between `/pt/x` and `/en/x`.

### 🟠 SEO-H4 (High) — Any path starting with a locale prefix returns HTTP 200

`utils/middlewares/withHandleInternalization.ts:17` uses the loose test `pathname.startsWith('/' + loc)`, whereas the exported wrapper at `:41` uses the strict `/${locale}/ || === /${locale}`. So `/enterprise` fails the strict check, falls into `getLocale`, passes the _loose_ check (it starts with `/en`), is never redirected, and renders `app/[lng]/(org)/page.tsx` with **HTTP 200** and `<html lang="enterprise">` — `layout.tsx:44` interpolates `lng` unvalidated, with no `notFound()` and no `dynamicParams = false`.

Also `:9` — `pathname.split('/')[0]` is always `''` for a leading-slash path, so the intended path-locale detection is dead code (should be `[1]`).

**Fix:** anchor the check to `/${loc}/` or `=== /${loc}`; validate `lng` against `languages` in the layout and call `notFound()`; fix the `[0]`→`[1]` index.

### 🟠 SEO-H5 (High) — Sitemap omits news and events

`app/sitemap.ts` queries `pages`, `artworks`, `curators`, `hawk_projects` — **not `news`, not `hawk_events`** — although `/[lng]/news/[slug]` and `/[lng]/events/[slug]` are real indexable routes with full metadata and JSON-LD. The static `routes` list (`utils/paths.ts:59-77`) also omits `/crowdfunding` and `/gaming`.

Entries are also emitted as separate per-language URLs with **no `alternates.languages`** (Next's sitemap supports it), so Google gets no hreflang signal from the sitemap either.

### 🟡 Medium

- **SEO-M1** — The Payload SEO plugin is dead config. `payload/plugins/index.ts:28-33` calls `seoPlugin({ generateTitle, generateURL, generateDescription, generateImage })` with **no `collections`** and no `uploadsCollection`. The plugin's gate is `pluginConfig?.collections?.includes(slug)` → `undefined` for every collection, so it injects nothing. The `meta` groups that exist are hand-rolled in 5 places. Editors never get the auto-generate buttons or the SERP preview, and the placeholder fallbacks `'Payload Website Template'` / `'A website built with Payload CMS'` are still there. Either pass `collections` + `uploadsCollection`, or delete the plugin and keep the hand-rolled tabs.
- **SEO-M2** — No `app/robots.ts`; only a static `public/robots.txt` that does not disallow `/*/preview/` or `/api/`. The preview routes do set `robots: 'noindex, nofollow'` per page, so this is crawl budget rather than indexation.
- **SEO-M3** — `app/[lng]/(org)/[...notfound]/page.tsx` renders a page instead of calling `notFound()`, so unknown deep paths return **HTTP 200** with a "404" title. Google treats this as a soft 404.
- **SEO-M4** — Metadata length overruns in `i18n/locales/{pt,en}/metadata.json`: **14 titles exceed 60 chars** (worst: `pt.transparency` at 74) and **20 descriptions exceed 160** (worst: `pt.home` at 192). All will be truncated in SERPs. Orphan keys: `donate` and `contact` have no matching URL in `utils/paths.ts`; `members_corner_submit` has a URL but no metadata entry.
- **SEO-M5** — Crowdfunding and Gaming metadata is not localized. `crowdfunding/page.tsx:16-22` hard-codes an **English title with a Portuguese description**, identical for both locales; `(crowdfunding)/layout.tsx:24-25` and `(gaming)/layout.tsx:26-28` are English-only. The hreflang cluster points two locales at identical content.

### 🔵 Low

- **SEO-L1** — JSON-LD gaps in `components/seo/JsonLd.tsx`: `BreadcrumbJsonLd` and `WebPageJsonLd` are exported but **never used**, so there are no breadcrumbs despite deep `/projects/[slug]`, `/artwork/[slug]`, `/curator/[slug]` hierarchies. `nonprofitStatus: 'Nonprofit501c3'` (`:143`) is a **US IRS designation on a Portuguese association** — factually wrong. `potentialAction.target` (`:157`) points at a site search that doesn't exist and contains an unresolved `{lng}` literal. `EventJsonLd` omits `eventStatus`, `eventAttendanceMode` and `offers` (Google Event rich-result requirements). `ArticleJsonLd` has no `Person` author and no `mainEntityOfPage`. Projects get no JSON-LD at all despite being in the sitemap.
- **SEO-L2** — `www` canonicalization is handled twice (`next.config.ts:75-89` and `nginx.conf:61-69`), and `nginx.conf:72-80` produces a double hop: `http://www` → `https://www` → `https://hawkstars.org`. Collapse to one redirect.

### ✅ Verified OK

- `prepareMetadataInfo` / `transformToMetadataObject` (`utils/metadata.ts:60-92, 133-200`) produce a complete set — canonical, `x-default`/`en`/`pt` hreflang, OG with `locale`/`alternateLocale`, Twitter `summary_large_image`, robots directives — **whenever `lng` + `urlPath` are supplied.** The gaps above are call sites, not the helper.
- 31 of 35 pages have `generateMetadata`; the 4 without inherit correctly from their layout. All 6 preview routes correctly return `robots: 'noindex, nofollow'`.
- `app/sitemap.ts` covers both locales for every route it does query, and excludes preview/admin.
- Metadata is instrumented — `utils/metadata.ts:124-126` fires a Sentry message for any page missing title or description.
- Trailing slashes are handled correctly, and `withHandleInternalization.ts:22` explicitly avoids the `/` → `/pt/` → `/pt` double redirect.

---

## 6. Internationalization

### 🟠 <strike>I18N-H1 (High) — `en/terms.json` is empty; the Terms page serves Portuguese under `lang="en"`</strike>

`i18n/locales/en/terms.json` is literally `{}`. `pt/terms.json` has 50 keys.

Runtime behaviour was confirmed by executing i18next with the app's own config: `/en/store/terms` resolves through `fallbackLng: 'pt'` and renders **the entire Terms & Conditions in Portuguese** — `t('terms_and_conditions')` → `"Termos e Condições"`, `preamble.title` → `"Preâmbulo"`, all 8 articles in PT — inside `<html lang="en">`. No crash, but a legal page in the wrong language with a lying `lang` attribute (also WCAG 3.1.1/3.1.2).

### 🟡 Medium

- <strike>**I18N-M1** — Key drift across the 19 namespace files (both locale dirs have identical file lists): `art.json` — `artwork.artist` missing in **en**; `common.json` — `label.press_releases` missing in **en**, `download` and `label.press_release` missing in **pt** (a half-applied rename); `training_center.json` — `objetives.items[2].points[6]` missing in **pt**; `terms.json` — 50 keys missing in **en**. Totals: 52 missing in EN, 3 in PT. Cross-checking every `t('literal')` against its namespace found **0 references to non-existent keys** — no broken lookups.</strike>
- **I18N-M2** — 46 hardcoded user-facing strings across 27 files. Worst offenders, all rendering untranslated English to Portuguese visitors: `MapLocationBlock/Component.tsx:50,59,71,83` (`Address`, `Phone`, `Email`, `Hours`); `NewsletterSignupBlock/Component.tsx:13,54,69,73` (`Subscribe`, `Your email address`, `Thank you for subscribing!` — and note this block is a **no-op**: `handleSubmit` at `:19-27` never posts anywhere, it just flips local state); `DonationProgressBlock/Component.tsx:135,142,157` (`Raised`, `Goal`, `donors`); `HeroSlideshowBlock/Component.tsx:166,173` and `ProjectTestimonialBlock/Component.tsx:148,155` (hardcoded `aria-label='Previous/Next slide'` despite `a11y.prevSlide`/`a11y.nextSlide` existing in both locale files); `contribute/page.tsx:156,165` (English `alt` text); `components/ui/cases-with-infinite-scroll.tsx:32` (`Trusted by thousands of businesses worldwide` — leftover template copy on an NGO site). Only 1 of 45 `payload/blocks/*` uses `t()`, which is mostly correct since block _content_ is CMS-localized — the fix is scoped to the chrome labels above.
- **I18N-M3** — Locale detection fragility in `withHandleInternalization.ts`: the `split('/')[0]` bug (SEO-H4) means path detection never fires, so the order is effectively cookie → `Accept-Language` → `pt`. The loose `startsWith` means `/pt-BR` and similar are never redirected to a supported locale. And `:25-30` — when a `referer` header is present, the cookie is set from the **referer's** locale and the request short-circuits, so an external link into `/en/…` from a `/pt/…` page writes a `pt` cookie.

### ✅ Verified OK

- CMS locale fallback is correctly configured: `payload.config.ts:143-149` — `defaultLocale: 'pt'`, `{ code: 'en', fallbackLocale: 'pt' }`, `fallback: true`. Missing EN content degrades to PT rather than blank.
- No missing translation keys — every `t('…')` literal resolves in at least one locale.
- Locale JSON is code-split and lazily loaded; the full 272 KB is not shipped to the client.
- `dir` is correctly omitted (both locales are LTR).

---

## Appendix — verification notes

Every Critical and High finding in this report was independently re-checked against source after the initial pass. Specifically confirmed by direct file inspection:

- `MemberProject` `create: anyone` with an unguarded `is_confirmed` field and an unprotected `submitter` group (SEC-C1, SEC-H1, SEC-H2)
- `mongooseAdapter` called without `migrationDir` (QUA-H1)
- `revalidatePath(doc.slug)` at all three call sites (PERF-H4)
- `en/terms.json` is 3 bytes (`{}`) vs 10,539 bytes for `pt` (I18N-H1)
- `Input.tsx` `aria-labelledby={name}` + `aria-label={name}` on an element whose own `id` is `name` (A11Y-H1)
- `team/page.tsx:13` passing `'home'` to `getMetadataPageInfo` (SEO-H1)
- The loose vs strict `startsWith` mismatch and the `split('/')[0]` index bug (SEO-H4)
- `graphql@17.0.2` installed against Payload's `peerDependencies: {"graphql":"^16.8.1"}` (QUA-M9)
- `package-lock.json` present in `git ls-files`; `path/to/venv` and `.DS_Store` absent from it (QUA-M1, QUA-L7)
- The EasyPay `return true` fail-open branch (SEC-M1)

Two caveats on scope: build measurements come from a 2026-07-31 build and may be marginally stale, and no commands (`pnpm lint`, `typecheck`, `test`, `audit`) were executed — CI-pass claims are inferred from configuration and code inspection rather than observed runs.
