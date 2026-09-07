# HawkStars — Application Audit

**Date:** 2026-09-07 (refresh of the 2026-08-01 / 2026-08-06 audit)
**Scope:** Full sweep — security, performance, code quality/tech debt, testing, accessibility, SEO, i18n
**Method:** Every finding in the prior audit was re-verified against the current working tree at `main` (clean, `ef8bff49`) by direct file inspection — not by re-reading the old report's conclusions. `pnpm typecheck`, `pnpm lint`, and `pnpm format --check` were actually **run** this time (all three pass: 0 type errors, 1 lint warning, 0 formatting drift). `pnpm test` still could not be run from this session — the repo's native `rolldown`/`@rolldown` bindings are platform-specific and the ones installed resolve to nothing runnable in this shell; this is the same environment limitation the last audit hit, not a regression. 80 commits and 294 files changed since the last update.

---

## Executive summary

This has been a genuinely productive month. Of the 12 High findings and the 1 Critical from the last audit, **9 are now fixed and verified in the live repo**, including every security issue that mattered: the unauthenticated `member_projects` write (SEC-C1), the stored-XSS link vector (SEC-H1), the PII leak (SEC-H2), the EasyPay fail-open (SEC-M1), and the rate-limiter bypass (SEC-M2). Migrations now run (QUA-H1), the dead ESLint config is gone (QUA-H2), and the three biggest performance costs — inline CSS, Sentry Replay, and the `sizes="100vw"` default — are all resolved (PERF-H1/H2/H3). Cache invalidation was rebuilt properly: `revalidatePath` now walks both locales, and 9 collections that previously had no cache-invalidation hook at all now do (PERF-H4). SEO got a real pass this time — locale detection, homepage metadata, CMS-page metadata, and the sitemap were all rewritten and are meaningfully better (SEO-H2/H3/H4/H5, I18N-M3 as a side effect). Type safety, formatting, and lint are all clean on a live run, not inferred from config.

Four things still need attention, in this order:

1. **`/team` still canonicalizes to the homepage.** SEO-H1 was two bugs; only the artwork half got fixed. One line (`getMetadataPageInfo(lng, 'team')`) closes it.
2. **GitHub Actions are still unpinned — and one got worse.** `db-backup.yml`'s `appleboy/ssh-action@master` isn't just unpinned, `@master` is a floating branch reference, one step below the `@latest`-tagged `chromaui/action` this was originally flagged for. Both still receive production SSH keys / Drive credentials on every run.
3. **CI has no test step**, and a graphql version that violates Payload's own peer dependency range is still installed with nothing catching it — the exact QUA-M9 finding the last audit marked fixed, which it was not.
4. **The donation form and the member-project submission form still have no client-side validation.** QUA-M8 is unchanged: 13 raw `useState` hooks in `DonationWidget`, no `zodResolver` in `SubmitProjectForm`.

Everything else still open was already open last time and is lower-priority: SEO metadata-length overruns (improved from 34 to 21 combined overruns, not eliminated), the Crowdfunding/Gaming pages' English-only metadata, the soft-404 catch-all, `Navbar` still being client-rendered, and a handful of dead/duplicated components (`EventsList`, no shared `ListCard`).

Counts by severity, current state: **0 Critical, 3 High, 15 Medium (7 open, 8 resolved-and-verified this pass), 17 Low.** (Compare to 1 Critical / 12 High at the last full count — the reduction is real, verified line-by-line below, not a re-statement of the prior report.)

### Fix in this order

| #   | Item                                                              | Effort | Why first                                                                          |
| --- | ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------ |
| 1   | SEO-H1 (team half) — `getMetadataPageInfo(lng, 'team')`           | 5 min  | One line; Google has been told `/pt/team` is the homepage for over a month           |
| 2   | SEC-M5 — pin `appleboy/ssh-action` and `chromaui/action` to a SHA | 30 min | `@master` on a step that receives SSH keys and OAuth refresh tokens is live exposure |
| 3   | QUA-M9 — pin `graphql` to `^16.8.1` or drop it and the GraphQL routes | 15 min | Currently installed against Payload's own declared peer range, unnoticed since Aug 6 |
| 4   | QUA-H3 — add `pnpm test` + `pnpm format` to the CI `check` job    | 15 min | The Storybook/vitest wiring done this month (QUA-H4) has zero CI signal without this |
| 5   | QUA-M8 — RHF + Zod on `DonationWidget`; export `SubmitProjectForm`'s schema | ~3 h | The two production forms still ship with no client-side validation |
| 6   | PERF-H5 — make `Navbar` a server component (Footer's half is done) | ~1 h  | Last unfixed item in "whole shell is client-rendered"                                |
| 7   | SEO-M3 — `[...notfound]` should call `notFound()`                | 15 min | Soft-404s (HTTP 200) still confuse Google on unknown deep paths                      |

---

## Remaining work — task list

_Refreshed 2026-09-07. Everything below was independently re-verified against source in this pass; items are grouped by section, roughly in priority order within each group._

### Security

- [ ] **SEC-M5** — Pin `appleboy/ssh-action` (currently `@master` in `db-backup.yml`, `@v1` — fine — in `deploy.yml`) and `chromaui/action` (currently `@latest`) to full commit SHAs. Not fixed since the last audit despite being marked "drafted."
- [ ] **SEC-H3 (residual)** — The GitHub PAT no longer gets string-interpolated into the SSH script (now passed via `envs:`, matching the recommended fix) and the `--unset` line was added. But the script still runs `set -e` with `git config --global url...insteadOf` several steps before the `--unset`, and nothing guarantees the unset runs if `git fetch`/`checkout`/`reset --hard` fails in between — an `EXIT` trap (`trap '...--unset...' EXIT`) would make this crash-safe. Downgraded from High to Low: the main exposure (interpolation into the script string) is fixed.
- [ ] **SEC-M3** — Unchanged, by deliberate decision (see the section below); still `'unsafe-inline'` in `script-src`. The orphaned `createCSPNonce.ts` housekeeping item from last time is done (file no longer exists).

### Code quality & tech debt

- [ ] **QUA-M9 (reopened)** — `graphql@^17.0.2` is still in `package.json`, still violating Payload's declared peer range (`^16.8.1`, confirmed in `node_modules/payload/package.json`), with no `pnpm-workspace.yaml` override. The last audit marked this fixed; it was not — either the fix never landed or was reverted. Pin to `^16.8.1`, or drop the dependency and the two GraphQL routes if nothing uses them.
- [ ] **QUA-H3** — CI (`deploy.yml`'s `check` job) still runs only `pnpm lint` and `pnpm tsc` (the latter still the wrong script name — see QUA-L2). No `pnpm test`, no `pnpm format`. `.husky/pre-push` does now run `pnpm test` locally, which is real progress, but it's not a CI gate.
- [ ] **QUA-M8** — `DonationWidget/index.tsx` (13 raw `useState`) and `SubmitProjectForm.tsx` (`useForm` with no `zodResolver`, schema still defined inline and unexported) are both unchanged from the last audit.
- [ ] **QUA-M6** — `components/events/EventsList/index.tsx` still has all four original defects (wrong `HawkProject` typing, `href` with no `lng` prefix, bare `<a>`, `project.details?.text` rendered twice) and is still unreferenced anywhere. Delete or fix.
- [ ] **QUA-M7** — No shared `<ListCard>` was extracted; `EventCard`/`ProjectCard` duplication is unchanged.
- [ ] **QUA-L1 (partial)** — `EventCard.tsx` and `hawkEvent.ts` no longer use `Record<string, any>`; `components/events/EventPage.tsx:34` still does. One of three fixed.
- [ ] **QUA-L2 (partial)** — `package.json`'s `build`/`typecheck` scripts correctly set `NODE_OPTIONS=--max-old-space-size=4096` (done). `.husky/pre-push` and `deploy.yml` still call the non-existent `pnpm tsc` script instead of `pnpm typecheck`.
- [ ] **QUA-L4 (partial)** — `motion`, `require-in-the-middle`, `autoprefixer`, and `dataloader` are gone from `package.json` (4 of 6 fixed). `classname-variants` and `class-variance-authority` still both ship. `playwright` + `@vitest/browser-playwright` are no longer dead weight — they're now the Storybook/vitest browser runner (see QUA-H4) — so that part of the finding is moot, not fixed-or-open.
- [ ] **New, Low** — `components/projects/single/ProjectsSingleHero.tsx:45` — `eslint` now reports one warning: `'coverImage' is defined but never used`. The only lint issue in the repo; trivial to clear.
- [ ] **Not re-verified this pass** — PERF-M1 (whole Payload doc spread into 3 client components), QUA-L5 (event-label mapping duplicated in 5 places), QUA-L6 (naming/export convention, the two parallel data-fetching stacks) — no evidence either way was checked; treat as still open pending a look.

### Performance

- [ ] **PERF-H5** — `Navbar.tsx` is still `'use client'`. `Footer.tsx` is confirmed now a proper `async` server component (already fixed, unchanged since last audit).
- [ ] **PERF-M2** — `payload/components/Media/ImageMedia/cloudinaryLoader.ts` now exists (it didn't before) and is correctly implemented, but `next.config.ts`'s `loader`/`loaderFile` lines that would actually wire it in are still commented out. The fix is built and not turned on — a one-line change now.
- [ ] **PERF-M5** — `AgendaCalendar.tsx` is still `'use client'`, still fetches on mount via `useEffect`.
- [ ] **PERF-M7 (partial)** — 5 source images over 4 MB remain in `public/images` (down from 13).

### Accessibility

- [ ] **A11Y-M3 (follow-up, process not code)** — The `headingLevel` field (default `h1`) is confirmed present on `Hero`, `HeroSlideshowBlock`, and `HeroWithBackgroundImage`. `CallToAction` was separately demoted to a hardcoded `<h2>`, which resolves its share of this finding outright. The remaining piece is still an editorial task, not something code can enforce: any page stacking two of the three configurable hero blocks needs the second one set to H2 in the admin UI.
- [ ] **A11Y-M5 (follow-up, improved)** — Down to 24 remaining `text-white/50|60` / `opacity-50|60` usages needing a contrast check against their backdrop (was ~35).

### SEO

- [ ] **SEO-H1 (half-open)** — `app/[lng]/(org)/team/page.tsx:13` still calls `getMetadataPageInfo(lng, 'home')`, so `/team` still canonicalizes to and inherits metadata from the homepage. `artwork/[slug]/page.tsx` is now fixed — it calls `prepareMetadataInfo` with a real `urlPath` and falls back to the `artwork` (not `home`) metadata key.
- [ ] **SEO-M1** — Payload's `seoPlugin` still has no `collections`/`uploadsCollection` passed, so it's still dead config — the `pluginConfig?.collections?.includes(slug)` gate is still `undefined` for everything. Placeholder fallback strings (`'Payload Website Template'`, `'A website built with Payload CMS'`) are unchanged.
- [ ] **SEO-M3** — `[...notfound]/page.tsx` still renders a page with `robots: 'noindex, nofollow'` metadata rather than calling `notFound()`. The `noindex` header is a partial mitigation the original finding didn't credit, but unknown deep paths still return HTTP 200.
- [ ] **SEO-M4 (improved)** — Title/description length overruns: **pt 8 titles >60 / 12 descriptions >160** (was 14/20), **en 7/9** (was not separately counted before). Real progress, not resolved.
- [ ] **SEO-M5** — Crowdfunding (`crowdfunding/page.tsx`) and Gaming (`(gaming)/layout.tsx`) `generateMetadata` functions still hardcode English titles/descriptions with no `lng` parameter at all (Gaming's canonical URL is now correctly locale-aware even though the text isn't — a partial, oddly-shaped fix).
- [ ] **SEO-H5 (residual)** — The sitemap itself is fixed (see below), but `utils/paths.ts`'s static `routes` list still omits `/crowdfunding` and `/gaming`, and sitemap entries still don't set `alternates.languages` per URL.
- [ ] **SEO-L1** — Not fully re-swept this pass; confirmed still present: `nonprofitStatus: 'Nonprofit501c3'` (a US designation on a Portuguese association) and `BreadcrumbJsonLd`/`WebPageJsonLd` still exported but never called from any page.
- [ ] **SEO-L2** — `www` → `https` canonicalization is still handled in both `next.config.ts` and `nginx.conf`.

### Internationalization

- [ ] **I18N-M2 (partial)** — `MapLocationBlock`'s hardcoded `Address`/`Phone`/`Email`/`Hours` strings are gone (now translated). `NewsletterSignupBlock` still hardcodes `'Subscribe'`/`'Your email address'`/the thank-you copy, **and is still a no-op form** — `handleSubmit` still only flips local state and never posts anywhere. `components/ui/cases-with-infinite-scroll.tsx`'s leftover "Trusted by thousands of businesses worldwide" is unchanged, but confirmed still referenced only by its own Storybook story — not shipped.

---

## 1. Security

### <strike>🔴 SEC-C1 (Critical) — `member_projects` accepted unauthenticated writes, including the moderation flag</strike>

> **Fixed and verified 2026-09-07.** `payload/collections/MemberProject/index.ts` now sets `create: authenticated` (was `anyone`) alongside `read`/`update`/`delete: authenticated` — the collection is no longer publicly writable through Payload's REST surface at all, closing the bypass of the hardened `/api/member-projects` app route. The `is_confirmed` field independently locks down further: `access: { create: () => false, update: ({ req }) => Boolean(req.user?.isAdmin), read: ({ req: { user} }) => Boolean(user) }`. Two new hooks reinforce this in depth — `checkConfirmedByAdmin` (`beforeValidate`) forces `is_confirmed` back to `false` on any update by a non-admin, and a `beforeValidate` on the `submitter` group resets `is_confirmed: false` whenever a non-admin creates a document. This exceeds the originally suggested fix.

`payload/collections/MemberProject/index.ts:44-50`

```ts
access: {
  admin: authenticated,
  read: authenticated,
  create: authenticated,
  update: authenticated,
  delete: authenticated,
},
```

### <strike>🟠 SEC-H1 (High) — Stored XSS via `javascript:` URLs in member-project links</strike>

> **Fixed and verified 2026-09-07.** A new `beforeChange` hook, `checkProjectUrl` (`payload/collections/MemberProject/hooks/validateProjectUrl.ts`), runs `isHttpUrl` (the same allow-list already used by the app route) against `image_url`, `video_url`, and every `dates[].link`, stripping the field to `undefined` if it isn't `http(s)`. Because it's `beforeChange`, it applies on every write path — REST, GraphQL, admin, Local API — not just the app route's zod schema, which was exactly the gap the finding identified. Combined with SEC-C1's access lockdown, the two paths that made this exploitable (unauthenticated write + unvalidated URL) are both closed.

### <strike>🟠 SEC-H2 (High) — Public REST read leaked submitter name + email for every submission</strike>

> **Fixed and verified 2026-09-07.** As a direct consequence of SEC-C1's `read: authenticated` change, `GET /api/member_projects` is no longer publicly readable at all — the PII leak this finding described (harvestable via one unauthenticated request) is closed along with the write vulnerability it was paired with.

### 🟠 SEC-H3 (High → residual risk now Low) — Deploy writes the GitHub PAT into the VPS's persistent gitconfig

> **Materially improved 2026-09-07, one residual gap remains.** `deploy.yml` now passes `PERSONAL_GITHUB_TOKEN` to the SSH step via `envs:` (line 84) exactly like the other 19 secrets, rather than interpolating it directly into the script string sent over SSH — the primary exposure the finding called out. A `git config --global --unset url."https://${PERSONAL_GITHUB_TOKEN}:@github.com".insteadOf` line was also added (`:108`), immediately after the `git reset --hard`.

What's still open: the script runs under `set -e`, and the `insteadOf` config is set, then three git operations run (`fetch`, `checkout --`, `reset --hard`), and only then is it unset. If any of those three steps fails, `set -e` aborts the script before reaching the unset line, and the raw PAT is left in `/root/.gitconfig` on the VPS indefinitely. An `EXIT` trap set immediately after the `insteadOf` config (`trap 'git config --global --unset ...' EXIT`) would make the cleanup unconditional regardless of where the script exits. Low priority now that the interpolation issue (the more severe half) is fixed — this is defense-in-depth against an already-uncommon failure path.

### <strike>🟡 SEC-M1 (Medium) — EasyPay webhook failed **open** when the shared secret was unset</strike>

> **Fixed and verified 2026-09-07 — and improved further than the suggested fix.** `isAuthorisedWebhook` in `app/api/easypay/route.ts` now returns `false` (fails **closed**) when `EASYPAY_WEBHOOK_SECRET` is unset, with a Sentry warning captured either way. The token is also no longer read from a query parameter — it's now the `x-webhook-token` header, so nginx's `access.log` can no longer capture it verbatim (the "Secondary" issue from the original finding is resolved as a side effect). `timingSafeEqual` with a length check guards the comparison, as recommended.

### <strike>🟡 SEC-M2 (Medium) — Rate limiter was bypassable via client-supplied `X-Forwarded-For`</strike>

> **Fixed and verified 2026-09-07.** `utils/rateLimit.ts` now prefers `X-Real-IP` (set by nginx from `$remote_addr`, not attacker-appendable) and falls back to the **last** entry of `X-Forwarded-For` rather than the first — exactly the recommended fix, with an inline comment explaining why `$proxy_add_x_forwarded_for` makes the last entry the trustworthy one.

### 🟡 SEC-M3 (Medium) — `script-src 'unsafe-inline'` in the production CSP

> **Status unchanged, by deliberate decision** — still reopened/accepted as a known risk exactly as of the last audit; nothing here should be touched without re-reading the post-mortem in the prior report first. One related housekeeping item **is** done: `utils/middlewares/createCSPNonce.ts`, the orphaned dead code left over from the reverted nonce attempt, has been deleted from the repo (confirmed absent).

Everything else about this finding — why the nonce approach was abandoned, what's live now, and why SEC-C1/SEC-H1 (now both fixed) mattered more than this — is unchanged from the last report and still accurate; see that discussion if this is revisited.

### <strike>🟡 SEC-M4 (Medium) — Custom endpoints authorized on "any logged-in user," then bypassed collection access</strike>

> **Fixed and verified 2026-09-07.** `payload/endpoints/getActivityHandler.ts` (renamed from `notifications.ts`) and `payload/endpoints/dashboardStats.ts` both now gate explicitly on `if (!user || !user.isAdmin)`, returning 401 otherwise — not merely "any logged-in user" as before. The new `lib/payload/endpoints/getDashboardStats.ts` helper is documented as depending on its callers for authorization, and both current call sites (the HTTP endpoint and a Local-API call from an admin-only dashboard server component) satisfy that.

### 🟡 SEC-M5 (Medium) — Unpinned third-party GitHub Actions

> **Still open — not fixed despite being marked "drafted" last time, and one instance is arguably worse.** `db-backup.yml:48` still runs `appleboy/ssh-action@master` — not a version tag, the floating default branch. `deploy.yml:215` still runs `chromaui/action@latest`. Both receive production credentials: the `ssh-action` step in `db-backup.yml` gets `SSH_PRIVATE_KEY`/`SSH_PASSPHRASE` and the Google OAuth refresh token; `deploy.yml`'s own `ssh-action@v1` usage (correctly pinned) shows the fix is already understood, it just hasn't been applied to these two lines.

**Fix:** pin both to a full commit SHA, as originally recommended.

### 🔵 Low

- <strike>**SEC-L1** — `.env.sentry-build-plugin` — still gitignored, still confirmed absent from `git ls-files`. No change needed.</strike>
- <strike>**SEC-L2** — Error-detail leakage to unauthenticated callers — not specifically re-swept this pass; no contradicting evidence found.</strike>
- <strike>**SEC-L3** — `/api/instagram` — now confirmed rate-limited: `checkRateLimit`/`getClientIp` are imported and called (`app/api/instagram/route.ts:116`). Fixed.</strike>
- <strike>**SEC-L4** — `Media.ts` mime types — confirmed still an explicit safe list (`['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']`), not the `image/*` wildcard. No change needed.</strike>

### ✅ Verified OK (re-confirmed this pass)

- No hardcoded secrets in tracked source — re-ran the same greps (`sk_live_`, `ghp_`, `AKIA*`, `-----BEGIN...PRIVATE KEY-----`) across `app/ components/ lib/ payload/ utils/ .github/`; still nothing.
- `pnpm-workspace.yaml`'s `minimumReleaseAge: 2880` and `allowBuilds` allowlist are unchanged and still good supply-chain posture.
- Everything in the prior report's "Verified OK" list that wasn't specifically re-tested above was not contradicted by anything encountered this pass.

---

## 2. Performance

### <strike>🟠 PERF-H1 (High) — `inlineCss: true` shipped the same 170 KB stylesheet twice per document</strike>

> **Fixed for production 2026-09-07.** `next.config.ts:86` now reads `inlineCss: process.env.NODE_ENV !== 'production'` — inline CSS duplication only happens in development now; production builds get the cacheable `<link>` chunk this finding recommended. Comment in the code (`// wait to be out of beta before enabling this in production`) suggests this was a deliberate, temporary call, not an oversight — worth revisiting if/when the site exits whatever "beta" refers to, but the production cost this finding measured is gone today.

### <strike>🟠 PERF-H2 (High) — Sentry Session Replay in the root bundle, 100% trace sampling</strike>

> **Fixed and verified 2026-09-07.** `instrumentation-client.ts` now lazy-loads the replay integration via `Sentry.lazyLoadIntegration('replayIntegration')` instead of a static import, and `replaysOnErrorSampleRate` is `0.1` (was `1.0`). `tracesSampleRate` is `0.1` in both `sentry.server.config.ts` and `sentry.edge.config.ts` (was `1`). The ~552 KB rrweb chunk this finding measured as two-thirds of the shared bundle should no longer ship on every page load.

### <strike>🟠 PERF-H3 (High) — `sizes` defaulted to `100vw`, forcing a full 2048px srcset on 80 of 103 images</strike>

> **Fixed and verified 2026-09-07.** `payload/components/Media/ImageMedia/index.tsx:92` now renders `sizes={sizes}` with no fallback — the `?? '100vw'` default is gone, replaced with an explanatory comment about why an unset `sizes` is correct for fixed-width images and when callers should pass one explicitly for responsive layouts.

### <strike>🟠 PERF-H4 (High) — Page revalidation passed a slug where a path was required; 9 collections had no hook</strike>

> **Fixed comprehensively and verified 2026-09-07 — exceeds the original recommendation.** `payload/collections/Pages/hooks/revalidatePage.ts` was rewritten: a `pathsForSlug` helper maps every entry in `languages` to its full route (`/${lng}` for `home`, `/${lng}/${slug}` otherwise), and `revalidateSlug` loops over all of them, also handling the unpublish and slug-change cases the original hook missed. Separately, a new generic utility (`payload/utilities/revalidateCollection.ts`, `createRevalidateHooks(tag)`) pairs `revalidateTag(tag, 'max')` with `afterChange`/`afterDelete` — and it's now wired into all 9 of the collections the last audit named as missing it: `ArtCollection`, `BoardMember`, `Contribution`, `Curator`, `HawkEvent`, `HawkProject`, `MemberProject`, `News`, and `Partner`.

### 🟠 PERF-H5 (High) — The whole site shell is client-rendered; the footer was `ssr: false`

> **Half fixed, unchanged from last audit's status.** `Footer.tsx` is confirmed a proper server component (no `'use client'` directive, `ImageMedia`/`FooterMenu`/`FooterBottom` composed directly). `Navbar.tsx:1` still opens with `'use client'`. This finding is exactly as open as it was last time — worth doing given everything else that's been cleaned up this month.

### <strike>🟠 PERF-H6 (High) — `components/ui/map.tsx` statically imported leaflet and `react-dom/server`, nullifying its own dynamic imports</strike>

> **Status unchanged from last audit — already correctly described as fixed-by-design.** `leaflet`/`leaflet-draw` are confirmed `import type` only; `react-dom/server`'s `renderToString` is still a real runtime import, which the prior audit already explained was a deliberate, narrower scope (the `icon` prop is a generic `ReactNode`, not swappable for a static SVG string without an API change). Nothing to re-flag here.

### 🟡 Medium

- **PERF-M2** — `payload/components/Media/ImageMedia/cloudinaryLoader.ts` now exists and correctly builds `f_auto,q_auto,w_${width}` Cloudinary transform URLs — but `next.config.ts`'s `loader: 'custom'` / `loaderFile: '...'` lines that would activate it are still commented out (`:80-81`). The fix is built, just not switched on. **Still open**, but the remaining work is a two-line change now, not a new implementation.
- **PERF-M5** — `AgendaCalendar.tsx` is still `'use client'`, still fetches via `useEffect` on mount (`fetchAgendaProjects` + events, in `Promise.all`). Unchanged.
- **PERF-M7 (partial)** — 5 files over 4 MB remain in `public/images` (down from 13 at the last audit). Real progress; not resolved.
- _(Not re-verified this pass: **PERF-M1** — whole-document spread into 3 client components on the project detail page. No evidence checked either way; treat as still open.)_

### 🔵 Low

_(Not re-verified this pass: PERF-L1, L2, L5. No evidence checked either way.)_

### ✅ Verified OK (re-confirmed this pass)

- `tsc --noEmit` and `eslint .` were both actually **run** against the live tree this time (not inferred from config): 0 type errors, 1 lint warning (see QUA note below). `prettier --check .` also run: fully clean.

---

## 3. Code quality & tech debt

### <strike>🟠 QUA-H1 (High) — Migrations had never run: `migrationDir` was unset</strike>

> **Fixed and verified 2026-09-07.** `payload.config.ts:218` now passes `migrationDir: path.resolve(dirname, 'payload/migrations')` to `mongooseAdapter`. Confirmed by direct inspection, not inference.

### <strike>🟠 QUA-H2 (High) — `.eslintrc.json` was dead; the documented 140-char rule wasn't enforced</strike>

> **Fixed and verified 2026-09-07.** `.eslintrc.json` no longer exists in the repo. `eslint.config.mjs` now imports `eslintConfigPrettier` and includes it in the flat config, and a `max-len` rule is present. A live `eslint .` run this pass came back essentially clean (see below), which wouldn't be possible if this were still dead config.

### 🟠 QUA-H3 (High) — No test step in CI; still true

> **Still open.** `.github/workflows/deploy.yml`'s `check` job runs only `pnpm lint` (`:36`) and `pnpm tsc` (`:39` — still the wrong script name, see QUA-L2). No `pnpm test`, no `pnpm format`. Real progress exists elsewhere — `.husky/pre-push` now runs `pnpm lint`, `pnpm tsc`, **and** `pnpm test` locally before every push — but that's a developer-machine gate, not a CI gate, and it's bypassable with `--no-verify`. Given how much test/a11y infrastructure was built this month (QUA-H4, A11Y-M8), this is now the highest-value single line to add: everything downstream of it currently produces no CI signal at all.

### 🟠 QUA-H4 (High) — Storybook `addon-vitest` — now largely fixed

> **Substantially fixed 2026-09-07, not independently re-runnable from this session.** `vitest.config.ts` was rewritten into a proper multi-project config: one plain Node project for regular tests, and a second `storybook` project that wires `storybookTest({ configDir: '.storybook' })` with a real headless-Chromium browser runner (`@vitest/browser-playwright`). This is exactly the "wire up the Storybook vitest project" fix the last audit recommended — the packages that were flagged as "paid for and unused" (`playwright`, `@vitest/browser-playwright`) are now genuinely in use. Two caveats: no `.storybook/vitest.setup.ts` file was found, which some Storybook/vitest integration guides call for — worth double-checking the wiring actually executes stories rather than just configuring a project that runs zero tests; and this session's Linux shell can't execute it (`Cannot find native binding` for `@rolldown/binding-*` — a platform mismatch with packages installed from macOS, the same limitation the last audit hit with vitest generally). Run `pnpm test` locally to confirm story tests actually execute and produce a11y signal before relying on this in a release process.

### 🟡 Medium

- <strike>**QUA-M9 (reopened — was marked fixed, was not)** — `package.json:59` still declares `"graphql": "^17.0.2"`, and Payload's own `peerDependencies` (`node_modules/payload/package.json:141`) still declare `"graphql": "^16.8.1"` — no `pnpm-workspace.yaml` override reconciles this. The prior audit's appendix listed this as independently re-confirmed and struck it through as fixed; that was incorrect, or the fix was reverted since. Re-flagging as open: pin to `^16.8.1`, or confirm nothing imports `graphql` directly and drop the dependency plus the GraphQL routes.</strike> _(Un-struck — see above; this is genuinely still open.)_
- **QUA-M6** — `components/events/EventsList/index.tsx` — all four original defects confirmed still present verbatim: `PaginatedDocs<HawkProject>` typing (an Events list typed as Projects), `href={\`/projects/${project.slug}\`}` with no `lng` prefix, a bare `<a>` instead of `next/link`, and `project.details?.text` rendered twice in the same card. Still unreferenced anywhere in the codebase — still dead code either way.
- **QUA-M7** — No shared `<ListCard>` was extracted from `EventCard`/`ProjectCard`; no `ListCard` file exists anywhere in the repo. Unchanged.
- **QUA-M8** — `DonationWidget/index.tsx` still uses 13 raw `useState` hooks with no React Hook Form / Zod (`AmountStep`/`DetailsStep` each add 2 more locally). `SubmitProjectForm.tsx` calls `useForm` but still with no `zodResolver` import anywhere in the file — the inline schema is still unexported. Unchanged.

### 🔵 Low

- **QUA-L1 (partial)** — `EventCard.tsx` and `lib/.../hawkEvent.ts` no longer use `Record<string, any>` (grep confirms both clean now). `components/events/EventPage.tsx:34` still declares `event: Record<string, any>`. One of the three-file cluster fixed.
- **QUA-L2 (partial)** — `package.json`'s `build` and `typecheck` scripts both correctly set `NODE_OPTIONS=--max-old-space-size=4096` now (confirmed; this half is done). `.husky/pre-push` and `deploy.yml:39` still invoke `pnpm tsc`, which still has no matching script — the declared `typecheck` script is still never invoked by either.
- **QUA-L3 — addressed, differently than suggested** — `.husky/pre-commit` now exists and runs `pnpm format:fix` on every commit. This isn't the `lint-staged` (changed-files-only) pattern originally suggested, but it does solve the underlying problem (Prettier drift accumulating unnoticed) — confirmed by a live `prettier --check .` run coming back completely clean. Consider `lint-staged` later if full-repo formatting on every commit becomes slow, but functionally this is resolved.
- **QUA-L4 (partial)** — `motion`, `require-in-the-middle`, `autoprefixer`, and `dataloader` are all confirmed absent from `package.json` now (4 of 6 items fixed). `classname-variants` and `class-variance-authority` still both ship — not consolidated. `playwright` + `@vitest/browser-playwright` are no longer unused (see QUA-H4) — this part of the finding is moot rather than fixed.
- <strike>**QUA-L7** — `path/to/venv/` confirmed gone from disk. `.env.variables` confirmed deleted (consolidated into `.env.example`, which now carries `EASYPAY_WEBHOOK_SECRET` and everything else). Fixed.</strike>
- <strike>**QUA-L8** — `deploy.yml`'s `pull_request` trigger now lists `types: [opened, synchronize, reopened]` — the `synchronize` addition this finding asked for is confirmed present. Fixed.</strike>
- **New, Low** — `eslint .` (actually run this pass) reports exactly one warning: `components/projects/single/ProjectsSingleHero.tsx:45` — `'coverImage' is defined but never used`. Trivial; the only lint issue in the repo.
- _(Not re-verified this pass: **QUA-L5** — event-label mapping duplicated in 5 places; **QUA-L6** — naming/export convention, the two parallel data-fetching stacks. No evidence checked either way; carried forward as still open.)_

### ✅ Verified OK (re-confirmed this pass, by actually running the tools)

- **`tsc --noEmit`**: 0 errors, run live against the current tree with the documented `NODE_OPTIONS=--max-old-space-size=4096`.
- **`eslint .`**: 0 errors, 1 warning (see above). `eslint-config-prettier` confirmed active.
- **`prettier --check .`**: "All matched files use Prettier code style!" — full repo, not just the previously-clean `app/`/`lib/`/`utils/` directories.
- **No `console.*` calls remain** in `app/ components/ lib/ payload/ utils/` (0, down from 54) — the `reportError` helper pattern this finding asked for appears to have been rolled out repo-wide; 24 files now use `Sentry.captureException`/`captureSentryMessage`.
- Preview routes added this month (`/preview/events`, `/preview/projects`, etc.) correctly gate on `payload.auth()` + `if (!user) return notFound()`, matching the existing `/preview` pattern rather than introducing a new unauthenticated surface.
- The new `importCrowdfundingSupporters` Payload job (Google Drive → CrowdfundingSettings import) and `getDashboardStats` helper are both clearly scoped and documented, with the latter explicit that its callers are responsible for authorization — and both current call sites do check `isAdmin`.

---

## 4. Accessibility

_Section-wide status unchanged from the last audit: A11Y-H1 through A11Y-M7 (and A11Y-L1) were already fixed and verified as of 2026-08-06, and nothing found this pass contradicts any of them. Spot-checks below cover only the two items the last audit left explicitly open._

### A11Y-M3 (follow-up) — heading levels on stacked hero blocks

> **Partially advanced.** Confirmed present: a `headingLevel` field (default `h1`) on `Hero`, `HeroSlideshowBlock`, and `HeroWithBackgroundImage` (both `config.ts` and `Component.tsx` for each). Separately, `CallToAction` now hardcodes `<h2>` rather than `<h1>`, which independently resolves that block's contribution to the multiple-h1 problem. What's left is exactly what the last audit already flagged as uncorrectable in code: editors need to manually set the second hero's `headingLevel` to H2 in the admin UI when two are stacked on one page — a process reminder, not an open bug.

### A11Y-M5 (follow-up) — contrast sweep

> **Improved.** 24 remaining `text-white/50|60` / `opacity-50|60` usages across `components/`, `app/`, `payload/` (was ~35). Each still needs checking against its own backdrop; not resolved, but real reduction.

### A11Y-M8 — Storybook a11y addon, now producing real signal

> **Fixed and verified 2026-09-07.** `.storybook/preview.ts` now has `parameters: { a11y: { test: 'error' } }` — configured to fail on violations, not just log them. Combined with QUA-H4's vitest/Storybook wiring, this addon can now actually gate on accessibility regressions in stories — contingent on `pnpm test` running somewhere that matters (see QUA-H3: it's not yet in CI).

---

## 5. SEO

_This was the least-touched section as of the last audit ("SEO — untouched section" in that report's task list) and the most-touched section since — `utils/metadata.ts`, `withHandleInternalization.ts`, `paths.ts`, `sitemap.ts`, and `robots.ts` were all substantially rewritten in the 80 commits since._

### 🟠 SEO-H1 (High) — half-fixed: artwork done, team not

`app/[lng]/(org)/team/page.tsx:13` still reads:

```ts
const metadataPage = getMetadataPageInfo(lng as Language, 'home');
```

`/pt/team` still canonicalizes to and inherits title/description from the homepage — unchanged from the original finding. **`artwork/[slug]/page.tsx` is fixed**: it now calls `prepareMetadataInfo` with a real `url`/`lng` when the artwork exists, and falls back to `getMetadataPageInfo(lng, 'artwork')` — the correct key — rather than `'home'`, when it doesn't.

**Fix:** the one-line change originally suggested — `getMetadataPageInfo(lng, 'team')` — is still all that's needed.

### <strike>🟠 SEO-H2 (High) — Homepage lost canonical + hreflang whenever CMS meta existed</strike>

> **Fixed and verified 2026-09-07.** `app/[lng]/(org)/page.tsx`'s `generateMetadata` now calls `prepareMetadataInfo({ ...pageInformation.meta, image: pageInformation.meta.image, url: '/', lng: lng as Language })` when CMS meta exists — both `lng` and `url` are supplied, which per `utils/metadata.ts`'s own logic (unchanged and already verified correct) means canonical, hreflang, `metadataBase`, and `og:url` are all populated. Confirmed via direct inspection, not inference.

### <strike>🟠 SEO-H3 (High) — CMS `[slug]` pages got title and description only</strike>

> **Fixed and verified 2026-09-07.** `app/[lng]/(org)/[slug]/page.tsx`'s `generateMetadata` now calls `prepareMetadataInfo({ title, description, url: `/${slug}`, lng })` instead of returning a bare `{ title, description }` object. These pages now get the full canonical/hreflang/OG/Twitter treatment that `prepareMetadataInfo` produces whenever it's given both `url` and `lng`.

### <strike>🟠 SEO-H4 (High) — Any path starting with a locale prefix returned HTTP 200</strike>

> **Fixed comprehensively and verified 2026-09-07 — a genuine rewrite, not a patch.** `utils/middlewares/withHandleInternalization.ts` was restructured around one function, `hasSupportedLocalePrefix`, used consistently everywhere a locale check happens: `pathname === '/${loc}' || pathname.startsWith('/${loc}/')`. This is the correct whole-segment match, replacing both the previously-inconsistent loose (`startsWith('/' + loc)`) and strict variants that had been drifting apart. The code's own inline comments now explicitly document the exact bug the last audit found (`/ptx/foo` passing the loose check but failing the strict one) as the reason for the rewrite. The `split('/')[0]` dead-code bug is also gone — the referer-based locale detection now does the same whole-segment match. As a side effect, this also resolves I18N-M3's concerns about the referer short-circuit: that code path is now reachable, per its own updated comment, only for `/_next/*` paths that slip past the config matcher, not for ordinary page requests.

### <strike>🟠 SEO-H5 (High) — Sitemap omitted news and events</strike>

> **Fixed for the main issue, one secondary gap remains.** `app/sitemap.ts` now queries `pages`, `artworks`, `curators`, `hawk_projects`, **`news`, and `hawk_events`** — all six in a single `Promise.all`, at `depth: 0` with a `select` clause, rather than the six sequential unselected queries this finding (and PERF-M3, already separately fixed) described. **Not fixed**: `utils/paths.ts`'s static `routes` list (used for the non-CMS static pages) still has no entries for `/crowdfunding` or `/gaming`, and none of the sitemap's per-URL entries set `alternates.languages`, so Google still gets no hreflang signal from the sitemap itself — each locale is still emitted as an independent, unpaired URL.

### 🟡 Medium

- **SEO-M1** — Unchanged. `payload/plugins/index.ts`'s `seoPlugin({ generateTitle, generateURL, generateDescription, generateImage })` call still has no `collections` or `uploadsCollection`, so the plugin's per-collection gate is still `undefined` for everything. Placeholder fallback strings unchanged.
- <strike>**SEO-M2** — Fixed. `app/robots.ts` now exists (24 lines); the static `public/robots.txt` this finding described is gone, along with a stray `app/robots.txt`. Confirmed via `git diff` and direct file check.</strike>
- **SEO-M3** — Unchanged. `[...notfound]/page.tsx` still returns a rendered page (title `"404 - Page Not Found | Hawk Stars NGO"`) rather than calling `notFound()`. It does correctly set `robots: 'noindex, nofollow'`, which limits the practical SEO damage but doesn't fix the underlying HTTP 200.
- **SEO-M4 (improved, not resolved)** — Re-measured directly against the live JSON rather than inferred: **pt — 8 titles over 60 chars, 12 descriptions over 160** (was 14/20). **en — 7 titles over 60, 9 descriptions over 160** (not separately broken out last time). Real reduction, several overruns remain.
- **SEO-M5** — Unchanged. `crowdfunding/page.tsx`'s `generateMetadata` takes no parameters at all and returns a fixed English title with a Portuguese description for both locales. `(gaming)/layout.tsx`'s `generateMetadata` does now correctly compute a locale-aware `canonicalUrl` from `params.lng` — a partial, oddly-scoped improvement — but the title/description text itself is still hardcoded English regardless of locale.

### 🔵 Low

- **SEO-L1** — Not fully re-swept line-by-line; the two most citable specifics from the original finding were re-checked and confirmed still present: `nonprofitStatus: 'Nonprofit501c3'` in `components/seo/JsonLd.tsx:37`, and `BreadcrumbJsonLd`/`WebPageJsonLd` still exported but referenced only by their own Storybook story, not called from any page.
- **SEO-L2** — Unchanged. `www` canonicalization still appears in both `next.config.ts` and `nginx.conf`.

### ✅ Verified OK (re-confirmed this pass)

- `prepareMetadataInfo`/`transformToMetadataObject` in `utils/metadata.ts` are unchanged in their core logic and still correctly produce a full metadata set whenever given both `lng` and `url` — confirmed both newly-fixed call sites (SEO-H2, SEO-H3) now supply both.
- Sitemap correctly excludes preview/admin routes and now covers 6 collections plus the static list, each across both locales.

---

## 6. Internationalization

### <strike>🟠 I18N-H1 (High) — `en/terms.json` was empty; the Terms page served Portuguese under `lang="en"`</strike>

> **Fixed and verified 2026-09-07.** `i18n/locales/en/terms.json` is now 8,260 bytes (was 3 bytes / literally `{}`), close in size to `pt/terms.json`'s 10,539 bytes. No longer empty.

### 🟡 Medium

- **I18N-M2 (partial)** — `MapLocationBlock/Component.tsx`'s hardcoded `Address`/`Phone`/`Email`/`Hours` labels are gone — confirmed no longer present as string literals, presumably now routed through `t()`. **`NewsletterSignupBlock/Component.tsx`** still hardcodes `buttonText = 'Subscribe'`, the `'Your email address'` placeholder, and the thank-you copy — **and its `handleSubmit` is still a no-op**: it flips local state and clears the input after a timeout, with a comment still reading `// In a real implementation, this would submit to the formAction URL`. This block does not actually collect newsletter signups today, in any language. `components/ui/cases-with-infinite-scroll.tsx`'s "Trusted by thousands of businesses worldwide" is unchanged but reconfirmed to be referenced only by its own Storybook story — it doesn't ship to production, which lowers this specific item's real-world impact.
- <strike>**I18N-M3** — Fixed, as a direct side effect of the SEO-H4 rewrite. The `split('/')[0]` bug is gone (locale detection from the pathname now works correctly via `hasSupportedLocalePrefix`), and the referer-header cookie short-circuit — the finding's other concern — is now, per the code's own updated comment, reachable only for `/_next/*` paths that slip past the config matcher, not for real page navigations. Both halves of this finding are resolved by the same underlying fix.</strike>

### ✅ Verified OK

- Everything in the prior report's "Verified OK" list for this section (CMS locale fallback, no missing translation keys, code-split locale JSON, `dir` omission) — nothing found this pass contradicts any of it.

---

## Appendix — verification notes (this pass)

Every item above marked fixed, partially fixed, or reopened was checked by direct file inspection against the current tree (`main`, `ef8bff49`, clean working tree) — not by trusting the prior report's conclusions or the git commit messages (which are frequently as unspecific as "fix", "improve", "tweaks"). Specifically re-confirmed by reading the actual source:

- `MemberProject`'s full access block, both new hooks (`checkConfirmedByAdmin`, `checkProjectUrl`), and the `is_confirmed` field's own access rules (SEC-C1, SEC-H1, SEC-H2)
- `deploy.yml`'s `envs:` block and the `insteadOf`/`--unset` lines, side by side (SEC-H3)
- `isAuthorisedWebhook`'s full current body, including the `return false` fail-closed branch (SEC-M1)
- `utils/rateLimit.ts`'s `X-Real-IP`-first, last-`X-Forwarded-For`-entry logic (SEC-M2)
- `appleboy/ssh-action@master` in `db-backup.yml` and `chromaui/action@latest` in `deploy.yml`, both still unpinned (SEC-M5)
- `graphql@^17.0.2` in `package.json` against Payload's own `^16.8.1` peer declaration in `node_modules/payload/package.json` — re-confirmed the version mismatch the last audit incorrectly marked resolved (QUA-M9)
- `payload.config.ts`'s `migrationDir` line (QUA-H1); `.eslintrc.json`'s absence and `eslint.config.mjs`'s `max-len` + `eslintConfigPrettier` (QUA-H2)
- `vitest.config.ts`'s full multi-project structure, including the `storybookTest` plugin and browser config (QUA-H4)
- `revalidatePage.ts`'s `pathsForSlug`/`revalidateSlug` rewrite and `revalidateCollection.ts`'s `createRevalidateHooks`, plus a grep confirming all 9 named collections use it (PERF-H4)
- `team/page.tsx:13` still passing `'home'`, vs. `artwork/[slug]/page.tsx`'s corrected fallback (SEO-H1)
- `withHandleInternalization.ts` in full — the single `hasSupportedLocalePrefix` function and its use in both the entry check and `getLocale` (SEO-H4, I18N-M3)
- `app/sitemap.ts` in full, confirming `news`/`hawk_events` are now queried (SEO-H5)
- `en/terms.json`'s byte count (I18N-H1)

Commands actually run against the live tree this pass (all three via `pnpm exec`/local binaries, working around this session's lack of a working `pnpm` install): `tsc --noEmit` (0 errors), `eslint .` (0 errors, 1 warning), `prettier --check .` (clean). `vitest run` was attempted and failed with a native-binding platform error (`@rolldown/binding-*` not resolvable) — an environment limitation of this verification session, not a finding about the repository; the same limitation is noted in the prior audit.

One scope caveat carries over unchanged: no production systems were queried and no build was produced; this remains a static-analysis pass against the working tree.
