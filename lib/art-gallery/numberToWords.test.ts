import { describe, expect, it } from 'vitest';
import { euroAmountInWords } from './numberToWords';

describe('euroAmountInWords', () => {
  it.each([
    [1, 'Um euro'],
    [21, 'Vinte e um euros'],
    [100, 'Cem euros'],
    [101, 'Cento e um euros'],
    [850, 'Oitocentos e cinquenta euros'],
    [1000, 'Mil euros'],
    [1200, 'Mil e duzentos euros'],
    [1250, 'Mil duzentos e cinquenta euros'],
    [3700, 'Três mil e setecentos euros'],
    [3715, 'Três mil setecentos e quinze euros'],
    [15000, 'Quinze mil euros'],
    [2_000_000, 'Dois milhões de euros'],
  ])('pt: %d → %s', (value, expected) => {
    expect(euroAmountInWords(value, 'pt')).toBe(expected);
  });

  it.each([
    [3700, 'Three thousand seven hundred euros'],
    [1250, 'One thousand two hundred and fifty euros'],
    [42, 'Forty-two euros'],
  ])('en: %d → %s', (value, expected) => {
    expect(euroAmountInWords(value, 'en')).toBe(expected);
  });
});
