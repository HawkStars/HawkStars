import { describe, expect, it } from 'vitest';
import { localizedDefault } from './localizedDefault';

describe('localizedDefault', () => {
  const latestNews = localizedDefault('blocks.latestNews');

  it('picks the copy for the locale being edited', () => {
    expect(latestNews({ locale: 'pt' })).toBe('Últimas Notícias');
    expect(latestNews({ locale: 'en' })).toBe('Latest News');
  });

  it('falls back to Portuguese, the default language', () => {
    expect(latestNews({})).toBe('Últimas Notícias');
  });

  it('reads top-level keys too', () => {
    expect(localizedDefault('see_more')({ locale: 'en' })).toBe('See More');
  });

  it('fails at config time when a key is missing in either language', () => {
    expect(() => localizedDefault('blocks.doesNotExist')).toThrow(/blocks\.doesNotExist/);
    expect(() => localizedDefault('blocks')).toThrow(); // a section, not a string
  });
});
