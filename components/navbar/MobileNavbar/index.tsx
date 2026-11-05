'use client';

import { ImageMedia } from '@/payload/components/Media';

import Link from 'next/link';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';

import { FC, useCallback, useEffect, useRef } from 'react';
import {
  useLanguageCookie,
  useMainAppContext,
  useSetMobileNavbarOpen,
} from '@/utils/contexts/AppProvider';

import { hawkLogoMark } from '@/utils/models/images/logos';
import Socials from '@/components/utils/Socials';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import MobileMenuItem from './MobileMenuItem';
import { useTranslation } from '@/i18n/client';
import { Header } from '@/payload-types';

type MobileNavbarProps = {
  headerInfo: Header;
};

// Exported so the trigger in Navbar.tsx can point `aria-controls` at this panel
// without the two ids drifting apart.
export const MOBILE_NAVBAR_PANEL_ID = 'mobile-navbar-panel';

const MobileNavbar: FC<MobileNavbarProps> = ({ headerInfo }) => {
  const { mobileNavbarOpen } = useMainAppContext();
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const navRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }
      // Focus trap
      if (e.key === 'Tab' && navRef.current) {
        const focusable = navRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          if (!last) return;
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          if (!first) return;
          first.focus();
        }
      }
    },
    [setMobileMenuOpen]
  );

  useEffect(() => {
    if (mobileNavbarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the close button on open
      const closeBtn = navRef.current?.querySelector<HTMLElement>('button[data-close-menu]');
      closeBtn?.focus();
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mobileNavbarOpen, handleKeyDown]);

  if (!mobileNavbarOpen) return null;

  return (
    <div
      ref={navRef}
      id={MOBILE_NAVBAR_PANEL_ID}
      role='dialog'
      aria-modal='true'
      aria-label={t('a11y.navMenu')}
      className='bg-bege-light fixed z-900 flex h-dvh w-full flex-col gap-4 overflow-y-auto px-4 py-3 lg:hidden'
    >
      <div className='flex py-1'>
        <Link href={transformUrl(lng, SITE_GET_URLS.home)} className='flex items-center gap-2'>
          <ImageMedia
            src={hawkLogoMark}
            alt={t('a11y.logoAlt')}
            preload
            width={48}
            height={48}
            className='size-12'
          />
        </Link>
        <button
          type='button'
          data-close-menu
          aria-label={t('a11y.closeMenu')}
          className='cross-x relative my-auto ml-auto block h-5 w-5 cursor-pointer lg:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className='divide-bege-dark mt-4 flex flex-col divide-y'>
        {headerInfo?.columns.map((column, index) => {
          return <MobileMenuItem data={column} key={`${column.id}-${index}`} />;
        })}
      </div>

      {/* Primary actions sit where the thumb is, not buried in a submenu */}
      <div className='mt-auto flex flex-col gap-4 pt-6 pb-4'>
        <p className='text-eyebrow text-green'>{t('footer.menuCta')}</p>
        <div className='grid grid-cols-2 gap-3'>
          <Button asChild size='lg' variant='accent'>
            <Link
              href={transformUrl(lng, SITE_GET_URLS.contribute)}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('footer.donate')}
            </Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link
              href={transformUrl(lng, SITE_GET_URLS.how_to_help_us)}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('footer.join')}
            </Link>
          </Button>
        </div>
        <div className='border-bege-dark flex items-center justify-between border-t pt-4'>
          <LanguageSwitcher />
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
