'use client';

import { useId, useState } from 'react';
import { LinkField, NavbarDropdown } from '@/payload-types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LuChevronDown } from 'react-icons/lu';
import { getLinkFieldInformation } from '@/utils/page';
import { useLanguageCookie, useSetMobileNavbarOpen } from '@/utils/contexts/AppProvider';

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
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const isMultiColumn = data.isMultiColumn || false;
  const visibleLinks = data.dropdown?.links?.dropdownNavLink?.filter((item) => item.visible);
  const panelId = `${useId()}-submenu`;

  return (
    <div className='px-1'>
      <h6 className={cn('mb-2 font-medium text-black')}>
        <button
          type='button'
          aria-expanded={showOptions}
          aria-controls={panelId}
          onClick={() => setShowOptions(!showOptions)}
          className={cn(
            'focus-visible:ring-primary-500 flex w-full cursor-pointer gap-2 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
            { 'my-auto items-center': isMultiColumn }
          )}
        >
          {isMultiColumn ? data.dropdown?.dropdownTitle : data.link?.label}
          {isMultiColumn && (
            <LuChevronDown
              aria-hidden='true'
              className={cn('my-auto shrink-0 transition-transform duration-300', {
                'rotate-180': showOptions,
              })}
            />
          )}
        </button>
      </h6>

      <div
        id={panelId}
        className={cn('flex-col gap-1 delay-150 ease-in-out', {
          flex: showOptions,
          hidden: !showOptions,
        })}
      >
        <ul className='flex flex-col gap-2'>
          {visibleLinks?.map((item) => {
            const linkInfo = getLinkFieldInformation(item.link, lng);
            if (!linkInfo) return null;

            return (
              <li key={item.id || linkInfo?.label}>
                {linkInfo?.internal ? (
                  <Link
                    href={linkInfo.url}
                    target={linkInfo.newTab ? '_blank' : '_self'}
                    className='text-gray-500 transition-colors duration-200 hover:text-gray-600'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {linkInfo.label}
                  </Link>
                ) : (
                  <a
                    className='text-gray-500 transition-colors duration-200 hover:text-gray-600'
                    target={linkInfo.newTab ? '_blank' : '_self'}
                    rel={linkInfo.newTab ? 'noopener noreferrer' : undefined}
                    href={linkInfo.url}
                    onClick={() => setMobileMenuOpen(false)}
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
