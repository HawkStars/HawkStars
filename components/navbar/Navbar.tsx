'use client';

import Link from 'next/link';
import Image from 'next/image';
import HamburgerIcon from '@/public/images/icons/common/hamburger.svg';
import { useLanguageCookie, useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { hawkLogo } from '@/utils/models/images/logos';
import { useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from '@/i18n/client';

const Navbar = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  // const selectedMenuOptions = useMemo(() => {
  //   const menu = MenuSections.find(
  //     (section) => section.type === 'dropdown' && section.title === hoveredMenu
  //   );
  //   return menu?.type === 'dropdown' ? menu.options : null;
  // }, [hoveredMenu]);

  // const getNavbarInformation = useCallback(async () => {
  //   //const data = await getNavbarQuery();
  //   // debugger;
  // }, []);

  // useEffect(() => {
  //   getNavbarInformation();
  // }, [getNavbarInformation]);

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
          {/* <DesktopNavbar handleHoverMenu={setHoveredMenu} /> */}
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
        className={classNames(
          'bg-bege-dark absolute z-40 flex w-full justify-center gap-5 py-2 transition-all duration-300 ease-in',
          {
            block: hoveredMenu,
            'hidden opacity-0': !hoveredMenu,
          }
        )}
      >
        {/* {selectedMenuOptions?.map((option) => (
          <HawkLink href={option.url || '#'} key={option.label}>
            {t(option.label)}
          </HawkLink>
        ))} */}
      </div>
    </nav>
  );
};

export default Navbar;
