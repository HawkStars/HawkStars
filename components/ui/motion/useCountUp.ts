'use client';

import { useEffect, useRef, useState } from 'react';

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts from 0 to `target` the first time the returned ref scrolls into view.
 * Renders the final value until then (and for reduced-motion visitors), so the
 * server HTML always carries the real number.
 */
export const useCountUp = <T extends HTMLElement>(target: number | null, duration = 2200) => {
  const ref = useRef<T>(null);
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    const node = ref.current;
    if (!node || target === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setCurrent(0);
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setCurrent(Math.round(easeOutExpo(progress) * target));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return { ref, current };
};
