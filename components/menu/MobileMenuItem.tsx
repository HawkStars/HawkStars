'use client';

import { useSetMobileNavbarOpen } from '../../utils/contexts/AppProvider';
import { useTranslation } from '../../i18n/client';
import { transformUrl } from '../../utils/paths';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PiCaretRightThin, PiCaretDownThin } from 'react-icons/pi';
import { NavbarUrlItem } from '../navbar/types';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type MenuItemProps = {
  title: string;
  options: NavbarUrlItem[];
};

const MobileMenuItem = ({ title, options }: MenuItemProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const router = useRouter();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  const goToUrl = (url?: string) => {
    if (!url) return;
    setMobileMenuOpen(false);
    router.push(transformUrl(lng, url));
  };

  return (
    <div className='cursor-pointer px-1'>
      <div className='mb-2 flex justify-between' onClick={() => setShowOptions(!showOptions)}>
        <h6>{t(title)}</h6>

        {options && options.length > 0 && (
          <div className='my-auto'>
            <PiCaretDownThin
              className={classNames('transform duration-300', {
                '-rotate-90': !showOptions,
              })}
            />
          </div>
        )}
      </div>

      <div
        className={classNames('flex-col gap-1 delay-150 ease-in-out', {
          flex: showOptions,
          hidden: !showOptions,
        })}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={classNames('text-neutral-400')}
            onClick={() => goToUrl(option.url)}
          >
            {t(option.label)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenuItem;
