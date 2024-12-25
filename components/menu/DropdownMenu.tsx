'use client';

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import { PiCaretDownThin, PiCaretRightThin } from 'react-icons/pi';
import { Suspense, useRef, useState } from 'react';

import { useTranslation } from '@/i18n/client';
import { transformUrl } from '@/utils/paths';
import { NavbarUrlItem } from '../navbar/types';
import { useLanguageCookie } from '@/contexts/AppProvider';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';

type DropdownMenuProps = {
  title: string;
  options: NavbarUrlItem[];
};

const DropdownMenu = ({ title, options }: DropdownMenuProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <Popover className='group relative inline-block text-left'>
      {({ open }) => (
        <div onMouseEnter={() => handleEnter(open)} onMouseLeave={() => handleLeave(open)}>
          <PopoverButton ref={triggerRef}>
            <div className='flex gap-1'>
              <h6>
                <Suspense fallback=''>{t(title)}</Suspense>
              </h6>

              {options && options.length > 0 && (
                <div className='my-auto'>
                  <PiCaretDownThin className='ease duration-300 group-data-[open]:-rotate-90' />
                </div>
              )}
            </div>
          </PopoverButton>
          <PopoverPanel
            anchor='bottom'
            className='flex cursor-pointer flex-col gap-2 rounded bg-white'
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={classNames('w-fit whitespace-nowrap px-5 py-2', {
                  'text-neutral-400': !option.url || option.disabled,
                })}
                onClick={() =>
                  !!option.disabled && router.push(option.url ? transformUrl(lng, option.url) : '')
                }
              >
                <Suspense fallback={option.label}>{t(option.label)}</Suspense>
              </div>
            ))}
          </PopoverPanel>
        </div>
      )}
    </Popover>
  );
};

export default DropdownMenu;
