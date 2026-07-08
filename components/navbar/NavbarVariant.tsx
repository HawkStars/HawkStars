'use client';

import { useEffect } from 'react';
import { useSetNavbarVariant } from '@/utils/contexts/AppProvider';

type NavbarVariantProps = {
  variant: NavbarVariant;
};

export type NavbarVariant = 'default' | 'erasmus';

export const DEFAULT_NAVBAR_VARIANT: NavbarVariant = 'default';

/**
 * Declarative marker a page renders to set the navbar colour variant.
 *
 * Usage (works inside Server Components too, since this is a client child):
 *   <NavbarVariant variant="erasmus" />
 *
 * Sets the variant on mount and resets to the default on unmount, so leaving
 * the page automatically restores the normal navbar.
 */
const NavbarVariant = ({ variant }: NavbarVariantProps) => {
  const setNavbarVariant = useSetNavbarVariant();

  useEffect(() => {
    setNavbarVariant(variant);
    return () => {
      setNavbarVariant(DEFAULT_NAVBAR_VARIANT);
    };
  }, [variant, setNavbarVariant]);

  return null;
};

export default NavbarVariant;
