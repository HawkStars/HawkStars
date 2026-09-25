import { describe, expect, it } from 'vitest';
import { formatDimensions } from './dimensions';

describe('formatDimensions', () => {
  it('formats unframed and framed works as width × length with the frame note', () => {
    expect(
      formatDimensions({ dimension_type: 'unframed', width_cm: 77, length_cm: 54.5 }, 'pt')
    ).toBe('77 × 54,5 cm (sem moldura)');
    expect(formatDimensions({ dimension_type: 'framed', width_cm: 80, length_cm: 60 }, 'en')).toBe(
      '80 × 60 cm (framed)'
    );
  });

  it('formats objects as width × length × height', () => {
    expect(
      formatDimensions(
        { dimension_type: 'object', width_cm: 52, length_cm: 28, height_cm: 24 },
        'pt'
      )
    ).toBe('52 × 28 × 24 cm');
  });

  it('returns null while measurements are missing', () => {
    expect(formatDimensions({ dimension_type: 'object', width_cm: 52, length_cm: 28 }, 'pt')).toBe(
      null
    );
    expect(formatDimensions({}, 'pt')).toBe(null);
  });
});
