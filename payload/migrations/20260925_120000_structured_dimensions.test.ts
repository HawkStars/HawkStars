import { describe, expect, it } from 'vitest';
import { parseDimensions } from './20260925_120000_structured_dimensions';

describe('parseDimensions (old free-text dimensions)', () => {
  it.each([
    [
      '77×54,5 cm (s/ moldura)',
      undefined,
      { dimension_type: 'unframed', width_cm: 77, length_cm: 54.5 },
    ],
    [
      '50cm de largura x 40 cm de altura.',
      undefined,
      { dimension_type: 'unframed', width_cm: 50, length_cm: 40 },
    ],
    [
      '80 x 60 cm (com moldura)',
      undefined,
      { dimension_type: 'framed', width_cm: 80, length_cm: 60 },
    ],
    [undefined, '90 × 70 cm', { dimension_type: 'framed', width_cm: 90, length_cm: 70 }],
    [
      '52 × 28 × 24 cm',
      undefined,
      { dimension_type: 'object', width_cm: 52, length_cm: 28, height_cm: 24 },
    ],
  ])('%s / %s', (dimensions, framed, expected) => {
    expect(parseDimensions(dimensions, framed)).toEqual(expected);
  });

  it('gives up when there are not enough numbers', () => {
    expect(parseDimensions('Dimensões variáveis')).toBeNull();
  });
});
