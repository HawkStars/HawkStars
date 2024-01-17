'use client';

import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import { PiCaretDownThin, PiCaretRightThin } from 'react-icons/pi';
import { Suspense, useState } from 'react';

import { useTranslation } from '@/i18n/client';
import { transformUrl } from '@/utils/paths';
import { NavbarUrlItem } from '../navbar/types';
import { useLanguageCookie } from '@/hooks/useLanguageCookie';

type DropdownMenuProps = {
  title: string;
  options: NavbarUrlItem[];
};

const DropdownMenu = ({ title, options }: DropdownMenuProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div>
      <Menu as='div' className='z-100 relative inline-block text-left'>
        <Menu.Button onClick={() => setShowOptions(!showOptions)}>
          <div className='flex gap-1'>
            <h6>
              <Suspense fallback=''>{t(title)}</Suspense>
            </h6>

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
                'text-neutral-400': !option.url || option.disabled,
              })}
              onClick={() => router.push(option.url ? transformUrl(lng, option.url) : '')}
            >
              <Suspense fallback={option.label}>{t(option.label)}</Suspense>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
