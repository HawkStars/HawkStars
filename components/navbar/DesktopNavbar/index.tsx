'use client';

import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
import { FC, Suspense } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { urls } from '@/utils/paths';
import { useRouter } from 'next/navigation';
import { HawkLink } from '@/components/utils/HawkLink/config';
import HawkLinkComponent from '@/components/utils/HawkLink';

type MenuColumn = {
  data: {
    key: string;
    title?: string | null | undefined;
    links?: HawkLink[] | undefined | null;
  };
};

type DesktopNavbarProps = {
  handleHoverMenu: (menuKey: string) => void;
  columns: MenuColumn[];
};

const DesktopNavbar: FC<DesktopNavbarProps> = ({ handleHoverMenu, columns }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const router = useRouter();

  return (
    <div className='my-auto ml-auto hidden lg:block'>
      <div className='ml-auto flex gap-3'>
        <ul className='flex flex-row gap-4 px-1 xl:gap-8'>
          {columns.map((section) => {
            const column = section.data;
            const { key, title, links } = column;

            if (!title && links?.length === 0) return null;
            if (links && links.length === 1)
              return <HawkLinkComponent key={key} link={links![0].link} className='my-auto' />;

            return (
              <li
                key={key}
                onMouseEnter={() => handleHoverMenu(key)}
                className='my-auto cursor-pointer'
              >
                {title}
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
