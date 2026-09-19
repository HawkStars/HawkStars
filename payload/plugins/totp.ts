import { payloadTotp } from 'payload-totp';

// The package does not re-export `PayloadTOTPConfig` from its root, and
// `payload-totp/types` is not in its `exports` map, so derive it from the
// plugin's own signature rather than reaching into `dist/`.
type PayloadTOTPConfig = Parameters<typeof payloadTotp>[0];

/**
 * Two-factor authentication for the admin panel.
 *
 * Exported as its own module, separate from `payload/plugins/index.ts`, so that
 * `totp.test.ts` can assert on the real options without pulling in the
 * Cloudinary / Google Drive / Sentry plugins and the environment variables they
 * need at import time.
 */
export const totpOptions: PayloadTOTPConfig = {
  collection: 'users',
  forceSetup: process.env.NODE_ENV === 'production',
  totp: {
    issuer: 'HawkStars Admin',
    digits: 6,
    period: 30,
  },
  disabled: process.env.NODE_ENV === 'development',

  // MUST stay true. Without it the plugin maps over EVERY collection and global
  // and replaces `access.read` (and create/update/delete/readVersions/unlock)
  // with its own `totpAccess` wrapper, whose first rule is:
  //
  //     if (!user) return false;
  //
  // That runs *before* our own access function, so on production every
  // anonymous REST request got 403 Forbidden — /api/hawk_events, /api/news,
  // /api/hawk_projects and /api/sponsors alike, even though `hawk_events` reads
  // `anyone`. The public site kept rendering because SSR goes through the Local
  // API, which bypasses access control, so only the client-side blocks broke —
  // and `payloadClientQuery` swallows `!response.ok` into an empty fallback, so
  // they went blank with no error on the page.
  //
  // It never reproduced locally: `disabled` above is true in development, which
  // makes the wrapper fall through to the inner access function.
  //
  // TOTP itself is unaffected. The auth strategy, the /setup-totp and
  // /verify-totp views, the enrolment enforcement and the totpSecret field all
  // come from other parts of the plugin; only the blanket access wrapper is
  // switched off. Authorisation stays with each collection's own `access` block
  // (`authenticated` / `authenticatedAdmin` / `authenticatedOrPublished`) —
  // where it is declared, reviewed and tested.
  disableAccessWrapper: true,
};

export const totpPlugin = payloadTotp(totpOptions);
