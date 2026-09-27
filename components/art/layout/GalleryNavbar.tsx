'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LuMenu, LuPenLine, LuX } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import { GalleryLogo } from '../ui/GalleryLogo';
import { Button } from '@/components/ui/button';
import { PROPOSE_ANCHOR } from '../propose/constants';
import { Language } from '@/i18n/settings';

const NAV_ITEMS = [
  // `/art/news` starts with `/art`, so the home link only matches exactly.
  { key: 'home', path: SITE_GET_URLS.gallery, exact: true },
  { key: 'artworks', path: SITE_GET_URLS.artwork },
  { key: 'artists', path: SITE_GET_URLS.artists },
  { key: 'news', path: SITE_GET_URLS.gallery_news },
] as const;

export default function GalleryNavbar({ lng }: { lng: Language }) {
  const { t } = useTranslation(lng, 'art');
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const isActive = (path: string, exact?: boolean) => {
    const href = transformUrl(lng, path);
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };

  const proposeHref = `${transformUrl(lng, SITE_GET_URLS.artists)}#${PROPOSE_ANCHOR}`;

  return (
    <header className='border-art-line bg-art-ebony/90 sticky top-[env(safe-area-inset-top,0px)] z-40 border-b backdrop-blur-md'>
      <nav className='flex h-20 w-full items-center justify-between gap-6 px-4 lg:h-24 lg:px-10 2xl:px-16'>
        <Link href={transformUrl(lng, SITE_GET_URLS.gallery)} aria-label={t('nav.home')}>
          <GalleryLogo by={t('brand.by')} name={t('brand.name')} tagline={t('brand.tagline')} />
        </Link>

        <ul className='hidden items-center gap-8 lg:flex'>
          {NAV_ITEMS.map(({ key, path, ...rest }) => {
            const active = isActive(path, 'exact' in rest);
            return (
              <li key={key}>
                <Link
                  href={transformUrl(lng, path)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'font-art-sans border-b py-1 text-[11px] font-medium tracking-[0.15em] uppercase transition-colors',
                    active
                      ? 'border-art-gold-bright text-art-gold-bright'
                      : 'text-art-text-2 hover:text-art-text border-transparent'
                  )}
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className='hidden items-center gap-4 lg:flex'>
          <Button asChild variant='art-outline' size='art'>
            <Link href={proposeHref}>
              <LuPenLine aria-hidden />
              {t('nav.propose')}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>

        <button
          type='button'
          className='text-art-text p-2 lg:hidden'
          aria-expanded={open}
          aria-controls='gallery-mobile-menu'
          aria-label={open ? t('nav.close_menu') : t('nav.open_menu')}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </nav>

      <div
        id='gallery-mobile-menu'
        hidden={!open}
        className='border-art-line bg-art-ebony border-t px-4 pb-8 lg:hidden'
      >
        <ul className='flex flex-col'>
          {NAV_ITEMS.map(({ key, path, ...rest }) => (
            <li key={key} className='border-art-line border-b'>
              <Link
                href={transformUrl(lng, path)}
                aria-current={isActive(path, 'exact' in rest) ? 'page' : undefined}
                onClick={closeMenu}
                className='font-art-serif text-art-text aria-[current=page]:text-art-gold-bright block py-4 text-xl'
              >
                {t(`nav.${key}`)}
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild variant='art-outline' size='art' className='mt-6 w-full'>
          <Link href={proposeHref} onClick={closeMenu}>
            <LuPenLine aria-hidden />
            {t('nav.propose')}
          </Link>
        </Button>
        <div className='mt-6 flex justify-center'>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
