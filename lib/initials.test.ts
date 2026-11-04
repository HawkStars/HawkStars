import { describe, expect, it } from 'vitest';
import { getInitials } from './initials';

describe('getInitials', () => {
  it('uses the first and last significant words', () => {
    expect(getInitials('Ana Júlia Ramos')).toBe('AR');
    expect(getInitials('Município de Pinhel')).toBe('MP');
  });

  it('handles a single word and very short names', () => {
    expect(getInitials('Equipa')).toBe('E');
    expect(getInitials('ADM')).toBe('A');
    expect(getInitials('IP')).toBe('IP');
  });
});
