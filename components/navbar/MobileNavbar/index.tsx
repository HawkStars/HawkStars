'use client';

import { ImageMedia } from '@/payload/components/Media';

import Link from 'next/link';
import { urls, transformUrl } from '@/utils/paths';

import { FC, useCallback, useEffect, useRef } from 'react';
import {
  useLanguageCookie,
  useMainAppContext,
  useSetMobileNavbarOpen,
} from '@/utils/contexts/AppProvider';

import { hawkLogo } from '@/utils/models/images/logos';
import Socials from '@/components/utils/Socials';
import MobileMenuItem from './MobileMenuItem';
import { useTranslation } from '@/i18n/client';
import { Header } from '@/payload-types';

type MobileNavbarProps = {
  headerInfo: Header;
};

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
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
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
      role='dialog'
      aria-modal='true'
      aria-label={t('a11y.navMenu')}
      className='fixed z-900 flex h-screen w-full flex-col gap-4 bg-white px-4 py-3 lg:hidden'
    >
      <div className='flex py-1'>
        <Link href={transformUrl(lng, urls.home)} className='flex items-center gap-2'>
          <ImageMedia
            src={hawkLogo}
            alt={t('a11y.logoAlt')}
            preload
            width={150}
            className='-mt-1'
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

      <div className='mt-5 grid grid-cols-1 gap-4'>
        {headerInfo?.columns.map((column, index) => {
          return <MobileMenuItem data={column} key={`${column.id}-${index}`} />;
        })}
      </div>

      <div className='mt-auto mb-5 ml-auto'>
        <Socials />
      </div>
    </div>
  );
};

export default MobileNavbar;
