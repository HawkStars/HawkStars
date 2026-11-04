import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('keeps type-scale classes next to a text colour', () => {
    expect(cn('text-h2_semibold', 'text-black')).toBe('text-h2_semibold text-black');
    expect(cn('text-h1_semibold text-white')).toBe('text-h1_semibold text-white');
    expect(cn('text-eyebrow', 'text-green')).toBe('text-eyebrow text-green');
    expect(cn('text-body_regular mt-4 text-black/70')).toBe('text-body_regular mt-4 text-black/70');
  });

  it('lets a later size replace a type-scale class', () => {
    expect(cn('text-h2_bold', 'text-sm')).toBe('text-sm');
    expect(cn('text-h3_semibold', 'text-h2_bold')).toBe('text-h2_bold');
  });
});
