'use client';

import Link from 'next/link';
import Image from 'next/image';
import HamburgerIcon from '@/public/images/icons/common/hamburger.svg';
import { useMainAppContext, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { hawkLogo } from '@/utils/models/images/logos';
import { useState } from 'react';
import DesktopNavbar from './DesktopNavbar';
import { cn } from '@/lib/utils';
import DropdownMenu from './DesktopDropdown/DropdownMenu';

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { headerInfo } = useMainAppContext();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  if (!headerInfo || !headerInfo.columns || headerInfo.columns.length === 0) return null;
  const { columns } = headerInfo;

  const selectedMenu = columns.find((column) => {
    return column.isMultiColumn && column.dropdown?.key === hoveredMenu;
  });

  return (
    <nav onMouseLeave={() => setHoveredMenu(null)} className='relative'>
      <div className='bg-bege-dark z-50 px-4 lg:px-14'>
        <div className='flex gap-3'>
          <div className='my-auto flex justify-center py-3'>
            <Link href='/' className='normal-case' aria-label='Go to the home hawkstars website'>
              <div className='flex gap-1'>
                <Image src={hawkLogo} alt='Hawk Stars Logo' width={150} priority />
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
          <div
            className='my-auto ml-auto block cursor-pointer lg:hidden'
            onClick={() => setMobileMenuOpen(true)}
          >
            <Image src={HamburgerIcon} alt='Menu' width={28} height={28} />
          </div>
        </div>
      </div>

      {selectedMenu && (
        <>
          <div
            className={cn(
              'absolute z-90 mx-auto flex h-fit w-full justify-center gap-5 border-b border-b-gray-200 bg-white py-4 shadow-lg',
              {
                'hidden opacity-0': !hoveredMenu,
              }
            )}
            style={{ transition: 'display .3s ease-in, visibility .3s ease-in' }}
          >
            <DropdownMenu dropdownInfo={selectedMenu.dropdown} />
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
