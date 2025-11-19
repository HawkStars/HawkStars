'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { Page, HawkEvent } from '@/payload-types';
import Link from 'next/link';

type MenuItemProps = {
  data: {
    /**
     * Unique key for the navigation group to be used on the dropdown menu
     */
    key: string;
    /**
     * The title of the navigation group to be used on the dropdown menu. Use it when you want to have the dropdown
     */
    title?: string | null;
    links?:
      | {
          link: {
            type: 'reference' | 'custom';
            newTab?: boolean | null;
            reference?:
              | ({
                  relationTo: 'pages';
                  value: string | Page;
                } | null)
              | ({
                  relationTo: 'hawk_events';
                  value: string | HawkEvent;
                } | null);
            url?: string | null;
            label: string;
            /**
             * Choose how the link should be rendered.
             */
            appearance?: ('default' | 'outline') | null;
          };
          id?: string | null;
        }[]
      | null;
  };
};

const MobileMenuItem = ({ data }: MenuItemProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const columnLinks = data.links || [];
  if (columnLinks.length === 0) return null;

  const title = data.title || '';

  return (
    <div className='cursor-pointer px-1'>
      <div className='mb-2 flex gap-3' onClick={() => setShowOptions(!showOptions)}>
        <h6>{title}</h6>
      </div>

      <div
        className={classNames('flex-col gap-1 delay-150 ease-in-out', {
          flex: showOptions,
          hidden: !showOptions,
        })}
      >
        <ul className='flex flex-col gap-2'>
          {columnLinks.map((item) => {
            console.log(item);
            const link = item.link;
            let href = '#';

            if (link.type === 'custom' && link.url) {
              href = link.url;
            } else if (link.type === 'reference') {
              const relationTo = link.reference?.relationTo;
              href = link.url as string;
              // relationTo === 'pages'
              //   ? `/${link.reference?.value}`
              //   : `/events/${link.reference?.value}`;
            }

            return (
              <li key={item.id || link.label}>
                {link.type === 'reference' && link.reference ? (
                  <Link
                    href={href}
                    target={link.newTab ? '_blank' : '_self'}
                    className={classNames(
                      'text-terciary-300 hover:text-terciary-100',
                      'transition-colors duration-200'
                    )}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    type='button'
                    className='text-terciary-300 hover:text-terciary-100 p-0 transition-colors duration-200'
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
        ;
      </div>
    </div>
  );
};

export default MobileMenuItem;
