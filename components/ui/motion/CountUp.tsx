'use client';

import { useCountUp } from './useCountUp';

type CountUpProps = {
  value: number;
  /** BCP 47 locale for thousands separators (`pt` → 30 342, `en` → 30,342). */
  locale: string;
  duration?: number;
};

/** Counts a known number from 0 to `value` the first time it scrolls into view. */
export const CountUp = ({ value, locale, duration }: CountUpProps) => {
  const { ref, current } = useCountUp<HTMLSpanElement>(value, duration);

  return (
    <span ref={ref} className='tabular-nums'>
      {new Intl.NumberFormat(locale).format(current ?? value)}
    </span>
  );
};
