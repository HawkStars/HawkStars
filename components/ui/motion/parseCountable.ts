export type Countable = {
  prefix: string;
  number: number;
  suffix: string;
  /** Formats an intermediate count with the value's own thousands separator. */
  format: (n: number) => string;
};

// prefix · integer with optional grouped thousands · suffix
const PATTERN = /^(\D*?)(\d{1,3}(?:([.,\s  ])\d{3})+|\d+)(.*)$/s;

/**
 * Reads a whole number out of display text. Returns `null` for anything that
 * isn't clearly one integer — "1.5k", "2,5", "10-20" — so it is shown as typed.
 */
export const parseCountable = (value: string): Countable | null => {
  const match = PATTERN.exec(value.trim());
  if (!match) return null;
  const [, prefix, digits, separator = '', suffix] = match;

  // A decimal part or a second number means this isn't a plain count.
  if (/^[.,]\d/.test(suffix) || /\d/.test(suffix)) return null;

  const number = Number(digits.replace(/\D/g, ''));
  if (!Number.isFinite(number) || number === 0) return null;
  // A bare four-digit number in the 1900s/2000s is almost always a year — don't count to it.
  if (!separator && digits.length === 4 && number >= 1900 && number <= 2100) return null;

  const format = (n: number) =>
    separator ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, separator) : String(n);

  return { prefix, number, suffix, format };
};
