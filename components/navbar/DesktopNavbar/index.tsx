'use client';

import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import { FC, Suspense } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { urls } from '@/utils/paths';
import { useRouter } from 'next/navigation';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { HeaderNavigationColumns } from '@/payload-types';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DesktopNavbarProps = {
  handleHoverMenu: (menuKey: string) => void;
  columns: HeaderNavigationColumns;
  menuKeyHovered: string | null;
};

const DesktopNavbar: FC<DesktopNavbarProps> = ({ handleHoverMenu, columns, menuKeyHovered }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <div className='my-auto ml-auto hidden lg:block'>
      <div className='ml-auto flex gap-3'>
        <ul className='flex flex-row gap-4 px-1 max-xl:text-sm xl:gap-8'>
          {columns.map((column) => {
            const isMultiColumn = column.isMultiColumn;

            if (!isMultiColumn && !column.link) return null;
            if (!isMultiColumn && column.link)
              return <HawkLinkComponent key={column.id} link={column.link} className='my-auto' />;

            return (
              <li
                key={column.id}
                onMouseEnter={() => handleHoverMenu(column.dropdown?.key || '')}
                className='my-auto flex cursor-pointer gap-1'
              >
                {column.dropdown?.dropdownTitle}
                <ChevronDownIcon
                  className={cn('my-auto transition-transform duration-300', {
                    'rotate-180': menuKeyHovered === column.dropdown?.key,
                  })}
                  height={20}
                  width={20}
                />
              </li>
            );
          })}
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
