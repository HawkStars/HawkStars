# Access Control & Trust Model

This is the canonical description of who can do what in HawkStars. Read it before
touching anything in `payload/access/`, a collection's `access` block, or a custom
endpoint's authorization check.

## Who has an account

**Every Payload account belongs to a person associated with the NGO.** There is no
public sign-up, no member self-registration and no end-user account system. Accounts
are created only by an admin (`Users.access.create: authenticatedAdmin`), so a logged-in
user is always a known, vetted person inside the organisation.

Payload exists to let those people manage site content and projects. It is **not** a
customer-facing application.

Consequences for how to reason about risk:

- An authenticated user is **not** an anonymous attacker. Do not rate "any logged-in
  user can do X" as if it were remotely exploitable by the public.
- It is still **not** a reason to skip access control. The reasons to keep the two
  tiers apart are: accidental damage (an irreversible delete by someone who did not
  need the button), account compromise (a phished volunteer's 30-day session is a real
  vector), and data minimisation for donor and subscriber personal data, which applies
  inside the organisation as much as outside it.
- The bar that genuinely matters is the **unauthenticated public**: the frontend, the
  REST/GraphQL API surface, and anything serialised into a page. Anything reachable
  without a session is held to a much stricter standard than anything behind login.

## The two tiers

There is one role flag on the `users` collection: `isAdmin`. There is no separate
editor tier — an ordinary account *is* the editor.

| Tier      | Flag             | Can do                                                                                                                                  |
| --------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **User**  | none             | Sign in to `/admin`. Create, edit and **publish** all content: pages, news, projects, events, artworks, curators, media, documents, partners, sponsors, member projects, and the layout/listing globals. Cannot delete anything, and cannot see users, settings or donations. |
| **Admin** | `isAdmin: true`  | Everything above, plus **delete** on every collection, plus users and roles, site settings, contributions/donations and the activity log. |

The dividing line is deliberately simple: **destructive and sensitive operations are
admin-only; everything editorial is open to every account.** Deletion here is permanent —
there is no soft-delete, no trash and no audit trail — which is why it sits on the
admin side even though editing does not.

## The three access functions

Live in `payload/access/`. Import them by name; never write inline access logic in a
collection config.

| Function                 | Grants to                                                              |
| ------------------------ | ---------------------------------------------------------------------- |
| `anyone`                 | Everyone, including unauthenticated visitors                           |
| `authenticated`          | Any signed-in NGO person — **both tiers**. The editorial default.       |
| `authenticatedAdmin`     | Admins only (`isAdmin`)                                                |
| `authenticatedOrPublished` | Signed-in users see everything; anonymous callers see only `_status: 'published'` |

> `authenticatedEditor` was removed in September 2026 along with the `isEditor` field.
> With only two tiers it was identical to `authenticated`, so it implied a distinction
> that did not exist. If you find it referenced anywhere, that reference is stale.

## Default pattern for a new collection

```typescript
access: {
  admin: authenticated,
  read: anyone,                // only if the content is genuinely public
  create: authenticated,
  update: authenticated,
  delete: authenticatedAdmin,  // destructive — admins only
},
```

Variations:

- **Public-read content with drafts** (`pages`, `news`, `hawk_projects`) — `read` must
  not be a bare `anyone`, because `versions.drafts` is enabled and `draft: false` does
  **not** filter out documents whose `_status` is `'draft'`. Use `authenticatedOrPublished`.
- **Personal data** (`contributions`, `notifications`) — `read` is `authenticatedAdmin`,
  not `authenticated`. Donor names and amounts are not general-staff information.
  `newsletter_subscribers` is readable by both tiers but deletable only by admins.
- **Globals** — same rules. A global with only `read: anyone` declared silently falls
  back to `authenticated` for `update`. Always declare `update` explicitly.

## Rules that are easy to get wrong

1. **Never omit an operation key.** Payload's default for an unspecified operation is
   `Boolean(user)` — i.e. any account, including on a collection where you meant
   admins only. Always write all of `create`, `read`, `update`, `delete` explicitly,
   even when one repeats another.
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
   `req.user` but no automatic authorization. Check the tier explicitly and make sure
   the check matches the docstring. A collection REST endpoint sitting beside a guarded
   custom endpoint will happily serve the same data under the collection's own rule.
5. **Field `condition` signature is `(data, siblingData, { user })`.** The second
   positional argument is sibling data, *not* the viewing user. Reading `isAdmin` from
   it checks the record being edited, not who is looking at it.

## Migration note

Accounts created before the change may still carry an `isEditor` field in MongoDB. It
is no longer read by anything and is harmless; Payload ignores unknown fields. Drop it
with a one-off `$unset` if you want the documents tidy.
