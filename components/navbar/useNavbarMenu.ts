'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Grace period before a menu closes after the pointer leaves the header. */
const CLOSE_DELAY_MS = 180;
/** Hover intent when switching from one open menu to another (avoids diagonal flicker). */
const SWITCH_DELAY_MS = 90;

/**
 * Open/close state for the desktop mega-menu, shared by the triggers, the bar and the
 * panel. Fixes the old behaviour where:
 * - hovering a plain link, Donate or the language switcher left the last menu open;
 * - the click that naturally follows a hover toggled the menu shut again (a mouse click
 *   now only ever opens; toggling is for keyboard and touch);
 * - leaving the header by a pixel closed the panel instantly;
 * - tabbing out of the header left the panel open.
 */
export const useNavbarMenu = () => {
  const [openMenu, setOpenMenuState] = useState<string | null>(null);
  // Mirror of `openMenu` for the event handlers, so they never need side effects
  // inside a state updater (StrictMode runs updaters twice).
  const openRef = useRef<string | null>(null);
  // The last menu shown, kept while the panel fades out so it doesn't empty first.
  const [lastMenu, setLastMenu] = useState<string | null>(null);
  const setOpenMenu = useCallback((key: string | null) => {
    openRef.current = key;
    setOpenMenuState(key);
    if (key) setLastMenu(key);
  }, []);
  const closeTimer = useRef<number | undefined>(undefined);
  const switchTimer = useRef<number | undefined>(undefined);

  const clearTimers = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(switchTimer.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const close = useCallback(() => {
    clearTimers();
    setOpenMenu(null);
  }, [clearTimers, setOpenMenu]);

  /** Pointer entered a trigger: open now, or after a short intent delay when switching. */
  const hoverOpen = useCallback(
    (key: string) => {
      clearTimers();
      const apply = () => setOpenMenu(key);
      const current = openRef.current;
      if (current === key) return;
      if (current) switchTimer.current = window.setTimeout(apply, SWITCH_DELAY_MS);
      else apply();
    },
    [clearTimers, setOpenMenu]
  );

  /** Mouse click on a trigger: open it (the pointer leaving is what closes it). */
  const open = useCallback(
    (key: string) => {
      clearTimers();
      setOpenMenu(key);
    },
    [clearTimers, setOpenMenu]
  );

  /** Keyboard (Enter/Space) or touch tap on a trigger. */
  const toggle = useCallback(
    (key: string) => {
      clearTimers();
      setOpenMenu(openRef.current === key ? null : key);
    },
    [clearTimers, setOpenMenu]
  );

  /** Pointer over a non-menu item (logo, plain link, Donate, language). */
  const hoverOther = useCallback(() => {
    window.clearTimeout(switchTimer.current);
    if (!openRef.current) return;
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), SWITCH_DELAY_MS);
  }, [setOpenMenu]);

  /** Pointer left a trigger before its switch delay ran: drop the pending switch. */
  const cancelPending = useCallback(() => window.clearTimeout(switchTimer.current), []);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  }, [clearTimers, setOpenMenu]);

  const keepOpen = useCallback(() => window.clearTimeout(closeTimer.current), []);

  return {
    openMenu,
    lastMenu,
    hoverOpen,
    open,
    toggle,
    hoverOther,
    cancelPending,
    scheduleClose,
    keepOpen,
    close,
  };
};

export type NavbarMenu = ReturnType<typeof useNavbarMenu>;
