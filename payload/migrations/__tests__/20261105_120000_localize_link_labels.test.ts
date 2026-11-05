import { describe, expect, it } from 'vitest';
import { delocalizeLinkLabels, localizeLinkLabels } from '../20261105_120000_localize_link_labels';

const heroSlideshow = {
  root: {
    type: 'root',
    children: [
      {
        type: 'block',
        fields: {
          blockType: 'heroSlideshowBlock',
          slides: [
            {
              title: { pt: 'Centro', en: 'Center' },
              links: [{ link: { type: 'custom', url: '/itc', label: 'Ver Mais', newTab: false } }],
            },
          ],
        },
      },
    ],
  },
};

describe('localizeLinkLabels', () => {
  it('moves plain-string button labels to Portuguese', () => {
    const { value, changed } = localizeLinkLabels(heroSlideshow);
    expect(changed).toBe(1);
    expect(JSON.stringify(value)).toContain('"label":{"pt":"Ver Mais"}');
  });

  it('leaves already-localized labels alone (idempotent)', () => {
    const once = localizeLinkLabels(heroSlideshow).value;
    const twice = localizeLinkLabels(once);
    expect(twice.changed).toBe(0);
    expect(twice.value).toEqual(once);
  });

  it('does not touch labels under a localized parent', () => {
    // e.g. a ContentWithImage `description` rich text, stored per language
    const block = {
      blockType: 'contentWithImage',
      description: {
        pt: { root: { children: [{ link: { type: 'custom', url: '/a', label: 'Ler' } }] } },
      },
    };
    const { value, changed } = localizeLinkLabels(block);
    expect(changed).toBe(0);
    expect(value).toEqual(block);
  });

  it('ignores objects that are not link groups and empty labels', () => {
    const data = {
      items: [{ label: 'Not a link' }, { link: { type: 'reference', label: '' } }],
    };
    expect(localizeLinkLabels(data).changed).toBe(0);
  });
});

describe('delocalizeLinkLabels', () => {
  it('restores the original strings', () => {
    const migrated = localizeLinkLabels(heroSlideshow).value;
    expect(delocalizeLinkLabels(migrated).value).toEqual(heroSlideshow);
  });
});
