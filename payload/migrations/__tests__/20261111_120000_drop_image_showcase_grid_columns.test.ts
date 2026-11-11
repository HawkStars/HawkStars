import { describe, expect, it } from 'vitest';
import { dropGridColumns } from '../20261111_120000_drop_image_showcase_grid_columns';

const showcase = (extra: Record<string, unknown> = {}) => ({
  blockType: 'imageShowcase',
  images: [{ id: 'a', image: { imageType: 'external', externalImage: 'https://x/y.jpg' } }],
  transitionDuration: 5000,
  autoplay: true,
  ...extra,
});

describe('dropGridColumns', () => {
  it('removes gridColumns from a blocks-field Image Showcase', () => {
    const { value, changed } = dropGridColumns([showcase({ gridColumns: '2' })]);
    expect(changed).toBe(1);
    expect(value).toEqual([showcase()]);
  });

  it('removes it from a lexical block node under locale keys', () => {
    const layout = {
      pt: { root: { children: [{ type: 'block', fields: showcase({ gridColumns: '1' }) }] } },
      en: { root: { children: [{ type: 'block', fields: showcase({ gridColumns: '2' }) }] } },
    };
    const { value, changed } = dropGridColumns(layout);
    expect(changed).toBe(2);
    expect(JSON.stringify(value)).not.toContain('gridColumns');
  });

  it('leaves other blocks with a gridColumns field alone', () => {
    const other = { blockType: 'dataGridBlock', gridColumns: '3' };
    const { value, changed } = dropGridColumns([other]);
    expect(changed).toBe(0);
    expect(value).toEqual([other]);
  });

  it('is idempotent', () => {
    const once = dropGridColumns([showcase({ gridColumns: '2' })]).value;
    expect(dropGridColumns(once).changed).toBe(0);
  });
});
