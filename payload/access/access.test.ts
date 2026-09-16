import { describe, it, expect } from 'vitest';
import type { AccessArgs } from 'payload';
import type { User } from '@/payload-types';
import { anyone } from './anyone';
import { authenticated } from './authenticated';
import { authenticatedAdmin } from './authenticatedAdmin';
import { authenticatedOrPublished } from './authenticatedOrPublished';

/**
 * The four functions that decide who can read and write every collection.
 * `authenticatedOrPublished` carries a 16-line comment explaining that getting
 * it wrong "publishes every unsaved, unpublished and scheduled document at its
 * public URL and over the REST and GraphQL APIs" — and had no test.
 */

const args = (user: Partial<User> | null) => ({ req: { user } }) as unknown as AccessArgs<User>;

const USER = { id: '1', email: 'staff@hawkstars.org', isAdmin: false } as Partial<User>;
const ADMIN = { id: '2', email: 'admin@hawkstars.org', isAdmin: true } as Partial<User>;

describe('anyone', () => {
  it('is public', () => {
    expect(anyone(args(null))).toBe(true);
    expect(anyone(args(USER))).toBe(true);
  });
});

describe('authenticated', () => {
  it('admits any signed-in account, including the non-admin tier', () => {
    expect(authenticated(args(USER))).toBe(true);
    expect(authenticated(args(ADMIN))).toBe(true);
  });

  it('refuses anonymous callers', () => {
    expect(authenticated(args(null))).toBe(false);
  });
});

describe('authenticatedAdmin', () => {
  it('admits admins only', () => {
    expect(authenticatedAdmin(args(ADMIN))).toBe(true);
  });

  it('refuses the regular staff tier — this is the whole point of the two tiers', () => {
    expect(authenticatedAdmin(args(USER))).toBe(false);
  });

  it('refuses anonymous callers', () => {
    expect(authenticatedAdmin(args(null))).toBe(false);
  });

  it('treats a missing isAdmin flag as not-admin', () => {
    expect(authenticatedAdmin(args({ id: '3' } as Partial<User>))).toBe(false);
  });
});

describe('authenticatedOrPublished', () => {
  it('returns a _status constraint for anonymous callers, not a flat deny', () => {
    // A flat deny would hide published documents too; the constraint is what
    // keeps public pages resolving while drafts stay private.
    expect(authenticatedOrPublished(args(null))).toEqual({ _status: { equals: 'published' } });
  });

  it('lets any signed-in tier see drafts, so the admin panel and preview work', () => {
    expect(authenticatedOrPublished(args(USER))).toBe(true);
    expect(authenticatedOrPublished(args(ADMIN))).toBe(true);
  });
});
