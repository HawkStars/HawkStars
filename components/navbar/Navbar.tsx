'use client';

import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';
import HamburgerIcon from '@/public/images/icons/common/hamburger.svg';
import { useMainAppContext, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { hawkLogo } from '@/utils/models/images/logos';
import { useState } from 'react';
import DesktopNavbar from './DesktopNavbar';
import { cn } from '@/lib/utils';
import DropdownMenu from './DesktopDropdown/DropdownMenu';
import LanguageSwitcher from '../utils/LanguageSwitcher';

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { headerInfo, navbarVariant } = useMainAppContext();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  if (!headerInfo || !headerInfo.columns || headerInfo.columns.length === 0) return null;
  const { columns } = headerInfo;

  const selectedMenu = columns.find((column) => {
    return column.isMultiColumn && column.dropdown?.key === hoveredMenu;
  });

  return (
    <nav className='relative' onMouseLeave={() => setHoveredMenu(null)}>
      <div
        className={cn('z-50 px-4 lg:px-14', {
          'bg-erasmus-blue text-white': navbarVariant === 'erasmus',
          'bg-bege-dark text-black': navbarVariant === 'default',
        })}
      >
        <div className='flex gap-3'>
          <div className='my-auto flex justify-center py-3'>
            <Link href='/' className='normal-case' aria-label='Go to the home hawkstars website'>
              <div className='flex gap-1'>
                <ImageMedia src={hawkLogo} alt='Hawk Stars Logo' width={150} priority />
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
          <div className='my-auto ml-auto flex items-center lg:hidden'>
            <div className='my-auto ml-auto'>
              <LanguageSwitcher />
            </div>
            <button
              type='button'
              aria-label='Open menu'
              className='cursor-pointer'
              onClick={() => setMobileMenuOpen(true)}
            >
              <ImageMedia src={HamburgerIcon} alt='' width={32} height={32} aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'absolute z-90 mx-auto -mt-1 flex h-fit min-h-20 w-full justify-center gap-5 border-b border-b-gray-200 py-4 pt-2 shadow-lg transition-[opacity,visibility] duration-300 ease-in',
          hoveredMenu ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
          {
            'bg-erasmus-blue border-b-erasmus-blue text-white': navbarVariant === 'erasmus',
            'bg-white text-black': navbarVariant === 'default',
          }
        )}
      >
        {selectedMenu && <DropdownMenu dropdownInfo={selectedMenu.dropdown} />}
      </div>
    </nav>
  );
};

export default Navbar;
