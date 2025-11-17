'use client';

import CaretDown from '@/public/images/icons/common/caret-down.svg';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import Image from 'next/image';

type DropdownMenuProps = {
  title: string;
  menuKey: string;
  handleHover: (key: string) => void;
};

const DropdownMenu = ({ title, menuKey, handleHover }: DropdownMenuProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  return (
    <div
      className='group relative flex cursor-pointer gap-1'
      onMouseOver={() => handleHover(menuKey)}
    >
      <h6>{t(title)}</h6>

      <div className='my-auto'>
        <Image
          src={CaretDown}
          alt='Caret Down'
          width={24}
          className='ease transition-transform duration-500 group-hover:-rotate-90'
        />
      </div>
    </div>
  );
};

export default DropdownMenu;
