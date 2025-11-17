'use client';

import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import { FC, Suspense, useState } from 'react';
import MenuItem from '@/components/menu/MenuItem';
import DropdownMenu from '@/components/menu/DropdownMenu';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { urls } from '@/utils/paths';
import { useRouter } from 'next/navigation';

type DesktopNavbarProps = {
  handleHoverMenu: (menuKey: string) => void;
};

const DesktopNavbar: FC<DesktopNavbarProps> = ({ handleHoverMenu }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <div className='my-auto ml-auto hidden lg:block'>
      <div className='ml-auto flex gap-3'>
        <ul className='flex flex-row gap-4 px-1 xl:gap-8'>
          {/* {MenuSections.map((section, index) => {
            if (section.type === 'dropdown') {
              const { title, options } = section;
              if (!options || options.length === 0) return null;

              return (
                <li className='my-auto' key={index}>
                  <DropdownMenu title={title} handleHover={handleHoverMenu} menuKey={title} />
                </li>
              );
            } else {
              const { option } = section;
              return <MenuItem key={option.label} {...option} />;
            }
          })} */}
          <li>
            <Button
              type={'submit'}
              onClick={() => {
                router.push(urls.donate);
              }}
            >
              <Suspense>{t('common.donate')}</Suspense>
            </Button>
          </li>
        </ul>
        <div className='my-auto'>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default DesktopNavbar;
