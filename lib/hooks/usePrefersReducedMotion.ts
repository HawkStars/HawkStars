'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onStoreChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
};

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

// The server cannot know the preference, and guessing "reduce" would stop
// autoplay for everyone on the first paint. The client subscription corrects it
// immediately after hydration.
const getServerSnapshot = () => false;

/**
 * Whether the visitor has asked for reduced motion.
 *
 * `useSyncExternalStore` rather than an effect + state: the value is read during
 * render and must not tear between the two.
 *
 * Every block that moves on its own must gate on this AND offer a pause control
 * — WCAG 2.2.2 (Level A) requires the control regardless of the media query,
 * because the preference is not the only reason someone needs to stop motion.
 * This lived as three private copies in three blocks, and the fourth autoplaying
 * block had none.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
