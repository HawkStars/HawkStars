'use client';

import { useSyncExternalStore } from 'react';

/** Big enough to keep the model's menu open beside the view without hiding most of it. */
const ROOMY = '(min-width: 1024px) and (min-height: 700px)';

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(ROOMY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

/**
 * Whether the screen has room for an open menu. Phones (portrait or landscape) and small
 * tablets get `false`, so the menus start folded there. `false` on the server.
 */
export const useRoomyScreen = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(ROOMY).matches,
    () => false
  );
