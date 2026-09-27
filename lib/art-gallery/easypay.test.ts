import { afterEach, describe, expect, it, vi } from 'vitest';
import { galleryCredentials } from './easypay';

const setEnv = (vars: Record<string, string | undefined>) => {
  for (const [key, value] of Object.entries(vars)) vi.stubEnv(key, value as string);
};

describe('galleryCredentials', () => {
  afterEach(() => vi.unstubAllEnvs());

  const donations = {
    EASYPAY_API_URL: 'https://api.test.easypay.pt/2.0',
    EASYPAY_ACCOUNT_ID: 'donations-account',
    EASYPAY_API_KEY: 'donations-key',
  };

  it('uses the gallery account when it is configured', () => {
    setEnv({ ...donations, EASYPAY_ART_ACCOUNT_ID: 'art-account', EASYPAY_ART_API_KEY: 'art-key' });
    expect(galleryCredentials()).toEqual({
      apiUrl: 'https://api.test.easypay.pt/2.0',
      accountId: 'art-account',
      apiKey: 'art-key',
    });
  });

  it('falls back to the donations account while the gallery one is not set', () => {
    setEnv({ ...donations, EASYPAY_ART_ACCOUNT_ID: '', EASYPAY_ART_API_KEY: '' });
    expect(galleryCredentials()).toMatchObject({
      accountId: 'donations-account',
      apiKey: 'donations-key',
    });
  });

  it('refuses a mix of one account id and the other account key', () => {
    setEnv({ ...donations, EASYPAY_ART_ACCOUNT_ID: 'art-account', EASYPAY_ART_API_KEY: '' });
    expect(() => galleryCredentials()).toThrow(/both/);
  });
});
