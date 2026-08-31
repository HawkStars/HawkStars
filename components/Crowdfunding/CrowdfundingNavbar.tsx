'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { globalVillageLogo } from '@/utils/models/images/logos';
import { useTranslation } from '@/i18n/client';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const NAV_LINKS = [
  { key: 'about', href: '#about' },
  { key: 'rewards', href: '#rewards' },
  { key: 'transparency', href: '#transparency' },
  { key: 'faq', href: '#faq' },
] as const;

const CrowdfundingNavbar = () => {
  const lng = useLanguageCookie();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation(lng, 'crowdfunding');

  return (
    <nav className='bg-crowdfunding-bg sticky top-0 z-50 border-b border-white/10'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8'>
        {/* Logo */}
        <Link href={`/${lng}`} className='flex items-center' aria-label={t('a11y.homeLink')}>
          <ImageMedia src={globalVillageLogo} alt={t('a11y.logoAlt')} width={130} preload />
        </Link>

        {/* Desktop links */}
        <div className='hidden items-center gap-1 md:flex'>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white'
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          {/* Back to main site */}
          <Link
            href={`/${lng}`}
            className='hidden text-xs text-white/50 transition-colors hover:text-white/80 md:block'
          >
            {t('nav.back_to_site')}
          </Link>

          {/* Support CTA */}
          <a
            href='#rewards'
            className='rounded-full bg-orange-700 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-800'
          >
            {t('nav.support')}
          </a>
          <div className='my-auto ml-auto max-lg:hidden'>
            <LanguageSwitcher />
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none bg-white/10 text-white md:hidden'
            aria-label={t('a11y.toggleMenu')}
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              {mobileOpen ? (
                <path d='M18 6L6 18M6 6l12 12' strokeLinecap='round' />
              ) : (
                <>
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-white/10 transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-80' : 'max-h-0 border-transparent'
        )}
      >
        <div className='flex flex-col gap-1 px-4 py-3'>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className='rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white'
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <Link
            href={`/${lng}`}
            onClick={() => setMobileOpen(false)}
            className='mt-2 rounded-lg px-4 py-3 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white/80'
          >
            &larr; {t('nav.back_to_site')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CrowdfundingNavbar;
