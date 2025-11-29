'use client';

import Link from 'next/link';
import Image from 'next/image';
import HamburgerIcon from '@/public/images/icons/common/hamburger.svg';
import { useMainAppContext, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { hawkLogo } from '@/utils/models/images/logos';
import { useState } from 'react';
import DesktopNavbar from './DesktopNavbar';
import HawkLinkComponent from '../utils/HawkLink';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { headerInfo } = useMainAppContext();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  if (!headerInfo || !headerInfo.columns || headerInfo.columns.length === 0) return null;
  const { columns } = headerInfo;

  const selectedMenu = columns.find((section) => {
    const column = section.data;
    return column && column.key === hoveredMenu;
  });
  const selectedMenuOptions = selectedMenu?.data?.links;

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
          <DesktopNavbar handleHoverMenu={setHoveredMenu} columns={columns} />
          {/* NAVBAR MOBILE */}
          <div
            className='my-auto ml-auto block cursor-pointer lg:hidden'
            onClick={() => setMobileMenuOpen(true)}
          >
            <Image src={HamburgerIcon} alt='Menu' width={28} height={28} />
          </div>
        </div>
      </div>

      <div
        className={cn(
          'bg-bege-dark absolute z-40 flex w-full justify-center gap-5 py-2 transition-all duration-300 ease-in',
          {
            block: hoveredMenu,
            'hidden opacity-0': !hoveredMenu,
          }
        )}
      >
        {selectedMenuOptions?.map((option) => (
          <HawkLinkComponent link={option.link} key={option.id} />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
