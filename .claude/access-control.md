# Access Control & Trust Model

This is the canonical description of who can do what in HawkStars. Read it before
touching anything in `payload/access/`, a collection's `access` block, or a custom
endpoint's authorization check.

## Who has an account

**Every Payload account belongs to a person associated with the NGO.** There is no
public sign-up, no member self-registration, and no end-user account system. Accounts
are created only by an admin (`Users.access.create: authenticatedAdmin`), so a logged-in
user is always a known, vetted person inside the organisation — just with a different
purpose and a different level of responsibility.

Payload exists to let those people manage site content and projects. It is **not** a
customer-facing application.

Consequences for how to reason about risk:

- An authenticated user is **not** an anonymous attacker. Do not rate "any logged-in
  user can do X" as if it were remotely exploitable by the public.
- It is still **not** a reason to skip access control. The reasons to keep tiers tight
  are: accidental damage by someone who should not have had the button, account
  compromise (a phished volunteer's 30-day session is a real vector), and
  data minimisation for donor and subscriber personal data, which applies inside the
  organisation as much as outside it.
- The bar that genuinely matters is the **unauthenticated public**: the frontend, the
  REST/GraphQL API surface, and anything serialised into a page. Anything reachable
  without a session is held to a much stricter standard than anything behind login.

## The three tiers

Roles are two boolean flags on the `users` collection — `isAdmin` and `isEditor` —
not a separate roles collection. The tier is derived from them.

| Tier       | Flags                        | Intent                                                                 |
| ---------- | ---------------------------- | ---------------------------------------------------------------------- |
| **Normal** | neither flag set             | Basic account. Can sign in and **view** content in `/admin`. No create, update, delete or publish anywhere. The default state for a new NGO member until an admin grants more. |
| **Editor** | `isEditor: true`             | Manages content: pages, news, projects, events, artworks, curators, media, partners, sponsors, member projects. Cannot manage users, settings, or financial records. |
| **Admin**  | `isAdmin: true`              | Full control. Users, roles, settings, donations/contributions, notifications, and everything an editor can do. |

`isAdmin` implies everything `isEditor` grants — `authenticatedEditor` is
`user.isEditor || user.isAdmin`, so admins never need both flags set.

## The four access functions

Live in `payload/access/`. Import them by name; never write inline access logic in a
collection config.

| Function              | Grants to                                        |
| --------------------- | ------------------------------------------------ |
| `anyone`              | Everyone, including unauthenticated visitors     |
| `authenticated`       | Any signed-in NGO person — **all three tiers**    |
| `authenticatedEditor` | Editors and admins (`isEditor \|\| isAdmin`)      |
| `authenticatedAdmin`  | Admins only (`isAdmin`)                          |

> **`authenticated` is the Normal tier.** This is the point most easily got wrong.
> Using `authenticated` for a write operation grants it to every account in the
> organisation, including brand-new ones with no role. It is almost never what you
> want for `create`, `update` or `delete`. Use `authenticatedEditor` as the floor for
> content writes.

## Default pattern for a new collection

Start here and tighten, rather than starting permissive:

```typescript
access: {
  admin: authenticatedEditor,      // who may see this collection in /admin
  read: anyone,                    // only if the content is genuinely public
  create: authenticatedEditor,
  update: authenticatedEditor,
  delete: authenticatedAdmin,      // deletion is destructive — admins only
},
```

Variations:

- **Public-read content with drafts** (`pages`, `news`, `hawk_projects`) — `read` must
  not be a bare `anyone`, because `versions.drafts` is enabled and `draft: false` does
  **not** filter out documents whose `_status` is `'draft'`. Use:
  ```typescript
  read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  ```
- **Personal data** (`contributions`, `notifications`, `newsletter_subscribers`) —
  `read` is `authenticatedAdmin`, not `authenticated`. Donor names, amounts and
  subscriber emails are not general-staff information.
- **Globals** — same rules. A global with only `read: anyone` declared silently falls
  back to `authenticated` for `update`, which hands site-wide navigation to the Normal
  tier. Always declare `update` explicitly.

## Rules that are easy to get wrong

1. **Never omit an operation key.** Payload's default for an unspecified operation is
   `Boolean(user)` — i.e. the Normal tier. Always write all of `create`, `read`,
   `update`, `delete` explicitly, even when one of them repeats the others.
   (A comment in `payload/collections/Media/index.ts` claims an unset key defaults to
   *public*. That is wrong; the default is any authenticated user.)
2. **The Local API bypasses access control entirely.** `getPayloadConfig().find(...)`
   defaults to `overrideAccess: true`, so both collection-level and field-level rules
   are skipped. A collection locked to admins is still fully readable through any
   server query — which means **the access rule is not what protects the data on the
   frontend; the query's `select` and what you pass across the server/client boundary
   are.** Never hand a whole document from a restricted collection to a `'use client'`
   component.
3. **Field-level `access` is skipped on that same path.** Do not rely on it as the only
   guard for a sensitive field.
4. **Custom endpoints need their own check.** `payload/endpoints/*` handlers receive
   `req.user` but no automatic authorization. Check the tier explicitly
   (`if (!user?.isAdmin) return 401`) and make sure the check matches the docstring.
   A collection REST endpoint sitting beside a guarded custom endpoint will happily
   serve the same data under the collection's own, looser rule.
5. **Field `condition` signature is `(data, siblingData, { user })`.** The second
   positional argument is sibling data, *not* the viewing user. Reading `isAdmin` from
   it checks the record being edited, not who is looking at it.

## Current state vs. this document

As of the 2026-09-14 audit, the code does **not** yet implement the tier separation
described above. Six collections (`pages`, `news`, `hawk_projects`, `hawk_events`,
`artworks`, `curators`) use `create/update/delete: authenticated`, and
`Users.access.admin` is `authenticated` — so the Normal tier currently has the same
content powers as an Editor. `contributions` omits `delete`, and the `header` global
omits `update`, both of which therefore fall to the Normal tier.

See `AUDIT-2026-09-14.md` (SEC-5, SEC-6, SEC-10, SEC-15, SEC-20) for the specific
gaps and fixes. This document describes the target; treat any deviation from it in the
code as a bug to be closed, not as precedent to copy.
