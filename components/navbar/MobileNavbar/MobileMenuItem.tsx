'use client';

import { useState } from 'react';
import { Page, HawkProject, LinkField, NavbarDropdown } from '@/payload-types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type MenuItemProps = {
  data: {
    isMultiColumn?: boolean | null | undefined;
    link?: LinkField | undefined;
    dropdown?: NavbarDropdown;
    id?: string | null;
  };
};

const MobileMenuItem = ({ data }: MenuItemProps) => {
  const lng = useLanguageCookie();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const isMultiColumn = data.isMultiColumn || false;

  return (
    <div className='cursor-pointer px-1'>
      <div className='mb-2 flex gap-3' onClick={() => setShowOptions(!showOptions)}>
        <h6 className={cn('font-medium text-black', { 'my-auto flex gap-2': isMultiColumn })}>
          {isMultiColumn ? data.dropdown?.dropdownTitle : data.link?.label}
          {isMultiColumn && (
            <ChevronDownIcon
              className={cn('transition-transform duration-300', {
                'rotate-180': showOptions,
              })}
            />
          )}
        </h6>
      </div>

      <div
        className={cn('flex-col gap-1 delay-150 ease-in-out', {
          flex: showOptions,
          hidden: !showOptions,
        })}
      >
        <ul className='flex flex-col gap-2'>
          {data.dropdown?.links?.dropdownNavLink?.map((item) => {
            const linkInfo = getLinkFieldInformation(item.link, lng);
            if (!linkInfo) return null;

            return (
              <li key={item.id || linkInfo?.label}>
                {linkInfo?.internal ? (
                  <Link
                    href={linkInfo.url}
                    target={linkInfo.newTab ? '_blank' : '_self'}
                    className='text-gray-500 transition-colors duration-200 hover:text-gray-600'
                  >
                    {linkInfo.label}
                  </Link>
                ) : (
                  <a
                    type='button'
                    className='text-gray-500 transition-colors duration-200 hover:text-gray-600'
                    target={linkInfo.newTab ? '_blank' : '_self'}
                    href={linkInfo.url}
                  >
                    {linkInfo.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenuItem;
