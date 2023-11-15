'use client';

import {
  useMainAppContext,
  useSetMobileNavbarOpen,
} from '../../contexts/AppProvider';
import { useTranslation } from '../../i18n/client';
import { NavbarOption } from '../../models/navbar';
import { transformUrl } from '../../utils/paths';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PiCaretRightThin, PiCaretDownThin } from 'react-icons/pi';

type MenuItemProps = {
  title: string;
  options: NavbarOption[];
};

const MobileMenuItem = ({ title, options }: MenuItemProps) => {
  const { lng } = useMainAppContext();
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
      <div
        className='mb-2 flex gap-3'
        onClick={() => setShowOptions(!showOptions)}
      >
        <h6>{t(title)}</h6>

        {options && options.length > 0 && (
          <div className='my-auto'>
            {showOptions ? <PiCaretDownThin /> : <PiCaretRightThin />}
          </div>
        )}
      </div>
      {showOptions && (
        <div className='flex flex-col gap-1'>
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
      )}
    </div>
  );
};

export default MobileMenuItem;
