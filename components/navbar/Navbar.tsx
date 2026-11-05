'use client';
import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import HamburgerIcon from '@/public/images/icons/common/hamburger.svg';
import { useMainAppContext, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { hawkLogoMark } from '@/utils/models/images/logos';
import { FC, useState } from 'react';
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

type NavbarProps = {
  headerInfo: Header;
  lng: Language;
};

const Navbar: FC<NavbarProps> = ({ headerInfo, lng }) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { navbarVariant, mobileNavbarOpen } = useMainAppContext();
  const { t } = useTranslation(lng, 'common');
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  if (!headerInfo || !headerInfo.columns || headerInfo.columns.length === 0) return null;
  const { columns } = headerInfo;

  const selectedMenu = columns.find((column) => {
    return column.isMultiColumn && column.dropdown?.key === hoveredMenu;
  });

  return (
    <header
      className='relative'
      onMouseLeave={() => setHoveredMenu(null)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && hoveredMenu) setHoveredMenu(null);
      }}
    >
      <nav aria-label={t('a11y.mainNav')}>
        <div
          className={cn('z-50 px-4 lg:px-14', {
            'bg-erasmus-blue text-white': navbarVariant === 'erasmus',
            'bg-bege-dark text-black': navbarVariant === 'default',
          })}
        >
          <div className='flex gap-3'>
            <div className='my-auto flex justify-center py-3'>
              <Link href={`/${lng}`} className='normal-case' aria-label={t('a11y.homeLink')}>
                <div className='flex gap-1'>
                  <ImageMedia
                    src={hawkLogoMark}
                    alt={t('a11y.logoAlt')}
                    width={56}
                    height={56}
                    preload
                    className='size-12 lg:size-14'
                  />
                </div>
              </Link>
            </div>
            {/* NAVBAR DESKTOP */}
            <DesktopNavbar
              handleHoverMenu={setHoveredMenu}
              columns={columns}
              menuKeyHovered={selectedMenu?.dropdown?.key || null}
            />

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

        <div
          id={NAVBAR_DROPDOWN_PANEL_ID}
          className={cn(
            'absolute z-90 mx-auto -mt-1 flex h-fit min-h-20 w-full justify-center gap-5 border-b border-b-gray-200 py-4 pt-2 shadow-lg transition-[opacity,visibility] duration-300 ease-in',
            hoveredMenu ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
            {
              'bg-erasmus-blue border-b-erasmus-blue text-white': navbarVariant === 'erasmus',
              'bg-white text-black': navbarVariant === 'default',
            }
          )}
        >
          {selectedMenu && (
            <DropdownComponent
              links={selectedMenu.dropdown?.links}
              structure={selectedMenu.dropdown?.structure as 'single-column' | 'two-columns'}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
