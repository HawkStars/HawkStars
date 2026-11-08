'use client';

import { parseCountable } from './parseCountable';
import { useCountUp } from './useCountUp';

/**
 * Counts up the number inside a free-text value typed by an editor —
 * "90", "+1,400", "€24.500", "30 342 km" — keeping its prefix, suffix and
 * thousands separator. Values it can't safely read (decimals, ranges, words)
 * render unchanged, and the finished count always shows the original string.
 */
export const AnimatedValue = ({ value, duration }: { value: string; duration?: number }) => {
  const parsed = parseCountable(value);
  const { ref, current } = useCountUp<HTMLSpanElement>(parsed?.number ?? null, duration);

  if (!parsed || current === null || current === parsed.number) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref} className='tabular-nums'>
      {parsed.prefix}
      {parsed.format(current)}
      {parsed.suffix}
    </span>
  );
};
