'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { FooterColumn } from './config';

type FooterMenuProps = {
  data: FooterColumn;
};

const FooterMenu = ({ data }: FooterMenuProps) => {
  const column = data.column;

  return (
    <div className='flex flex-col gap-2'>
      <div className='text-terciary-100 ml-0 text-left lg:text-left'>
        <span className='mb-1 text-base font-black lg:mb-3'>{column.title}</span>
      </div>
      {column.data && column.data.length > 0 ? (
        <ul className='flex flex-col gap-2'>
          {column.data.map((item) => {
            const link = item.link;
            let href = '#';

            if (link.type === 'custom' && link.url) {
              href = link.url;
            } else if (link.type === 'reference') {
              const relationTo = link.reference?.relationTo;
              href =
                relationTo === 'pages'
                  ? `/${link.reference?.value}`
                  : `/events/${link.reference?.value}`;
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
      ) : null}
    </div>
  );
};

export default FooterMenu;
