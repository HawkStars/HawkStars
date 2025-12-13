'use client';

import { useState } from 'react';
import { Page, HawkProject, LinkField, NavbarDropdown } from '@/payload-types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type MenuItemProps = {
  data: {
    isMultiColumn?: boolean | null | undefined;
    link?: LinkField | undefined;
    dropdown?: NavbarDropdown;
    id?: string | null;
  };
};

const MobileMenuItem = ({ data }: MenuItemProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const isMultiColumn = data.isMultiColumn || false;

  return (
    <div className='cursor-pointer px-1'>
      <div className='mb-2 flex gap-3' onClick={() => setShowOptions(!showOptions)}>
        <h6 className='font-medium text-black'>
          {isMultiColumn ? data.dropdown?.dropdownTitle : data.link?.label}
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
            const link = item.link;
            let href = '#';

            if (link.type === 'custom' && link.url) {
              href = link.url;
            } else if (link.type === 'reference') {
              const relationTo = link.reference?.relationTo;

              href =
                relationTo === 'pages'
                  ? `/${(link.reference?.value as Page).slug}`
                  : `/events/${(link.reference?.value as HawkProject).slug}`;
            }

            return (
              <li key={item.id || link.label}>
                {link.type === 'reference' && link.reference ? (
                  <Link
                    href={href}
                    target={link.newTab ? '_blank' : '_self'}
                    className='text-gray-500 transition-colors duration-200 hover:text-gray-600'
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    type='button'
                    className='text-gray-500 transition-colors duration-200 hover:text-gray-600'
                    target={link.newTab ? '_blank' : '_self'}
                    href={href}
                  >
                    {link.label}
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
