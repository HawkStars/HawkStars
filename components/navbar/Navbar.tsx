'use client';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import HamburgerIcon from '@/public/images/icons/common/hamburger.svg';
import { useMainAppContext, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { hawkLogoMark } from '@/utils/models/images/logos';
import { FC, useEffect, useState } from 'react';
import DesktopNavbar, { NAVBAR_DROPDOWN_PANEL_ID } from './DesktopNavbar';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { useTranslation } from '@/i18n/client';
import { Header } from '@/payload-types';
import { Language } from '@/i18n/settings';
import DropdownComponent from './DesktopDropdown/DropdownComponent';
import { MOBILE_NAVBAR_PANEL_ID } from './MobileNavbar';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { useNavbarMenu } from './useNavbarMenu';

type NavbarProps = {
  headerInfo: Header;
  lng: Language;
};

const Navbar: FC<NavbarProps> = ({ headerInfo, lng }) => {
  const menu = useNavbarMenu();
  const { navbarVariant, mobileNavbarOpen } = useMainAppContext();
  const { t } = useTranslation(lng, 'common');
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const isErasmus = navbarVariant === 'erasmus';

  // Desktop bar is sticky; it gains a shadow once the page scrolls under it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!headerInfo || !headerInfo.columns || headerInfo.columns.length === 0) return null;
  const { columns } = headerInfo;

  const findMenu = (key: string | null) =>
    key
      ? columns.find((column) => column.isMultiColumn && column.dropdown?.key === key)
      : undefined;
  const isPanelOpen = Boolean(findMenu(menu.openMenu));
  const shownMenu = findMenu(menu.openMenu) ?? findMenu(menu.lastMenu);

  return (
    <header
      className='relative z-50 lg:sticky lg:top-0'
      onPointerEnter={menu.keepOpen}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') menu.scheduleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && menu.openMenu) menu.close();
      }}
      onBlur={(e) => {
        // Close when focus leaves the header entirely (keyboard users tabbing on).
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) menu.close();
      }}
    >
      <nav aria-label={t('a11y.mainNav')}>
        <div
          className={cn(
            'relative z-10 px-4 transition-shadow duration-300 lg:px-8 xl:px-14',
            isErasmus
              ? 'bg-erasmus-blue text-white'
              : 'bg-bege-dark lg:border-bege-dark text-black lg:border-b lg:bg-white/90 lg:backdrop-blur-md',
            scrolled && 'lg:shadow-md'
          )}
        >
          <div className='flex items-center gap-3 lg:h-20'>
            <div className='flex justify-center py-3 lg:py-0' onPointerEnter={menu.hoverOther}>
              <Link
                href={`/${lng}`}
                className='focus-visible:ring-green rounded-full normal-case focus-visible:ring-2 focus-visible:outline-hidden'
                aria-label={t('a11y.homeLink')}
              >
                <ImageMedia
                  src={hawkLogoMark}
                  alt={t('a11y.logoAlt')}
                  width={56}
                  height={56}
                  preload
                  className='size-12 transition-transform duration-300 hover:scale-105 lg:size-14'
                />
              </Link>
            </div>
            {/* NAVBAR DESKTOP */}
            <DesktopNavbar columns={columns} menu={menu} />

            {/* NAVBAR MOBILE */}
            <div className='my-auto ml-auto flex items-center gap-3 lg:hidden'>
              {/* Below `sm` the switcher lives only in the menu panel, freeing the bar for Doar */}
              <div className='my-auto ml-auto hidden sm:block'>
                <LanguageSwitcher />
              </div>
              {/* Donate stays one tap away on phones, where most donations happen */}
              <Button asChild size='sm' variant='accent'>
                <Link href={transformUrl(lng, SITE_GET_URLS.contribute)}>{t('footer.donate')}</Link>
              </Button>
              <button
                type='button'
                aria-label={t('a11y.openMenu')}
                aria-expanded={mobileNavbarOpen}
                // Only while the panel exists: MobileNavbar returns null when
                // closed, so an unconditional aria-controls was a dangling IDREF
                // and some assistive tech announces nothing for it. aria-expanded
                // still conveys the state either way.
                aria-controls={mobileNavbarOpen ? MOBILE_NAVBAR_PANEL_ID : undefined}
                className='shrink-0 cursor-pointer'
                onClick={() => setMobileMenuOpen(true)}
              >
                <ImageMedia src={HamburgerIcon} alt='' width={32} height={32} aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown: the transparent top padding bridges bar → card, so the pointer
            never leaves the header on its way down. */}
        <div
          id={NAVBAR_DROPDOWN_PANEL_ID}
          onClick={(e) => {
            // Following a link closes the menu (client navigation keeps the header mounted).
            if ((e.target as HTMLElement).closest('a')) menu.close();
          }}
          className={cn(
            'absolute inset-x-0 top-full hidden px-8 pt-2 transition-[opacity,translate,visibility] duration-200 ease-out lg:block',
            isPanelOpen
              ? 'visible translate-y-0 opacity-100'
              : 'pointer-events-none invisible -translate-y-1 opacity-0'
          )}
        >
          {shownMenu && (
            <DropdownComponent
              title={shownMenu.dropdown?.dropdownTitle}
              links={shownMenu.dropdown?.links}
              structure={shownMenu.dropdown?.structure as 'single-column' | 'two-columns'}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
