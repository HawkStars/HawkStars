'use client';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';

import { PiCaretDownThin } from 'react-icons/pi';

import { useTranslation } from '@/i18n/client';
import { transformUrl } from '@/utils/paths';
import { NavbarUrlItem } from '../navbar/types';
import { useLanguageCookie } from '@/contexts/AppProvider';

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
            <PiCaretDownThin className='ease transition-transform duration-500 group-hover:-rotate-90' />
          </div>
        )}
      </div>
      <div className='absolute -left-3 mt-1 hidden flex-col gap-2 rounded bg-white duration-500 ease-in group-hover:flex'>
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
            {t(option.label)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
