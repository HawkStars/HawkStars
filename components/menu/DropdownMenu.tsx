'use client';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import CaretDown from '@/public/images/icons/common/caret-down.svg';

import { useTranslation } from '@/i18n/client';
import { transformUrl } from '@/utils/paths';
import { NavbarUrlItem } from '../navbar/types';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

import Image from 'next/image';

type DropdownMenuProps = {
  title: string;
  options: NavbarUrlItem[];
};

const DropdownMenu = ({ title, options }: DropdownMenuProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <div className='group relative cursor-pointer'>
      <div className='flex gap-1'>
        <h6>{t(title)}</h6>

        {options && options.length > 0 && (
          <div className='my-auto'>
            <Image
              src={CaretDown}
              alt='Caret Down'
              width={24}
              className='ease transition-transform duration-500 group-hover:-rotate-90'
            />
          </div>
        )}
      </div>
      <div className='absolute -left-3 z-900 hidden flex-col gap-2 rounded-sm bg-white px-5 ease-in group-hover:flex'>
        {options.map((option, index) => (
          <div
            key={index}
            className={classNames('w-fit py-2 whitespace-nowrap', {
              'text-neutral-400': !option.url || option.disabled,
            })}
            onClick={() => {
              if (option.disabled) return;
              router.push(option.url ? transformUrl(lng, option.url) : '');
            }}
          >
            {t(option.label)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
