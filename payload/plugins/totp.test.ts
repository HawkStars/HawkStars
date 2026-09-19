import { describe, it, expect } from 'vitest';
import type { Access, Config } from 'payload';
import { payloadTotp } from 'payload-totp';

import { totpOptions } from './totp';

/**
 * Regression guard for the production 403s.
 *
 * `payloadTotp` does not only add an auth strategy: it maps over every
 * collection and global in the config and replaces their `access` functions
 * with its own wrapper, which denies every anonymous request outright. That
 * turned all four client-side collection fetches (/api/hawk_events, /api/news,
 * /api/hawk_projects, /api/sponsors) into 403 Forbidden in production while
 * being invisible in development, where the plugin is disabled.
 *
 * `disableAccessWrapper: true` is what keeps our own access functions in
 * charge. These tests fail if anyone removes it.
 */

const PUBLIC_READ: Access = () => true;

/** A config with one publicly-readable collection and one global. */
const baseConfig = () =>
  ({
    collections: [
      { slug: 'hawk_events', access: { read: PUBLIC_READ }, fields: [] },
      { slug: 'users', access: { read: PUBLIC_READ }, fields: [] },
    ],
    globals: [{ slug: 'footer', access: { read: PUBLIC_READ }, fields: [] }],
  }) as unknown as Config;

/** An anonymous REST request against the built config. */
const anonymousReq = (built: Config) =>
  ({
    req: { user: null, payload: { config: built } },
  }) as never;

const build = (options: Parameters<typeof payloadTotp>[0]) => payloadTotp(options)(baseConfig());

const readOf = (built: Config, slug: string) =>
  built.collections?.find((c) => c.slug === slug)?.access?.read as Access;

describe('totpOptions', () => {
  it('keeps the blanket access wrapper switched off', () => {
    // The whole point. Flipping this to false or dropping it 403s the public API.
    expect(totpOptions.disableAccessWrapper).toBe(true);
  });

  it('is only disabled in development, so production carries the wrapper risk', () => {
    expect(totpOptions.disabled).toBe(process.env.NODE_ENV === 'development');
  });
});

describe('the built config, with the plugin live (as in production)', () => {
  // `disabled` is derived from NODE_ENV, which vitest sets to 'test'. Pin it to
  // false so these assertions describe production regardless of how tests run.
  const options = { ...totpOptions, disabled: false };

  it('leaves a public collection readable by anonymous callers', async () => {
    const built = build(options);
    expect(await readOf(built, 'hawk_events')(anonymousReq(built))).toBe(true);
  });

  it('leaves the auth collection own access in charge too', async () => {
    const built = build(options);
    expect(await readOf(built, 'users')(anonymousReq(built))).toBe(true);
  });

  it('leaves globals readable by anonymous callers', async () => {
    const built = build(options);
    const read = built.globals?.find((g) => g.slug === 'footer')?.access?.read as Access;
    expect(await read(anonymousReq(built))).toBe(true);
  });

  it('still installs the TOTP auth strategy on the users collection', () => {
    const built = build(options);
    const users = built.collections?.find((c) => c.slug === 'users');
    const strategies = (users?.auth as { strategies?: { name?: string }[] })?.strategies ?? [];
    expect(strategies.length).toBeGreaterThan(0);
  });
});

describe('the same config WITHOUT disableAccessWrapper', () => {
  // Documents the failure mode this flag exists to prevent. If this test ever
  // starts passing as `true`, upstream changed its behaviour and the comment in
  // totp.ts can be revisited.
  it('403s every anonymous read — collection access never runs', async () => {
    const built = build({ ...totpOptions, disabled: false, disableAccessWrapper: undefined });
    expect(await readOf(built, 'hawk_events')(anonymousReq(built))).toBe(false);
  });
});
