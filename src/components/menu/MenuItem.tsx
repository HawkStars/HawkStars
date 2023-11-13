'use client';

import { NavbarOption } from '@/models/navbar';
import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';
import { PiCaretDownThin, PiCaretRightThin } from 'react-icons/pi';
import { useState } from 'react';

type MenuItemProps = {
  title: string;
  options: NavbarOption[];
};

const MenuItem = ({ title, options }: MenuItemProps) => {
  const { t } = useTranslation('common');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const router = useRouter();

  const goToUrl = (url?: string) => {
    if (!url) return;
    router.push(url);
  };

  return (
    <div className=''>
      <Menu as='div' className='z-100 relative inline-block text-left'>
        <Menu.Button
          onClick={() => setShowOptions((currentStatus) => !currentStatus)}
        >
          <div className='flex gap-1'>
            <h6>{t(title)}</h6>

            {options && options.length > 0 && (
              <div className='my-auto'>
                {showOptions ? <PiCaretDownThin /> : <PiCaretRightThin />}
              </div>
            )}
          </div>
        </Menu.Button>
        <Menu.Items className='absolute z-900 -ml-5 mt-3 flex cursor-pointer flex-col gap-2 rounded bg-white'>
          {options.map((option, index) => (
            <Menu.Item
              key={index}
              disabled={option.disabled}
              as='div'
              className={classNames('w-fit whitespace-nowrap px-5 py-2', {
                'text-neutral-400': !option.url,
              })}
              onClick={() => goToUrl(option.url)}
            >
              {t(option.label)}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default MenuItem;
