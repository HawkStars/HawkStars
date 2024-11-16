'use client';

import { useLanguageCookie } from '@/contexts/AppProvider';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';
import { NavbarUrlItem } from '../navbar/types';
import { useTranslation } from '@/i18n/client';
import Link from 'next/link';

const MenuItem = ({ label, url, disabled }: NavbarUrlItem) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  return (
    <>
      {url && !disabled ? (
        <Link href={url} aria-disabled={disabled} className='my-auto'>
          {t(label)}
        </Link>
      ) : (
        <li className='my-auto'>{t(label)}</li>
      )}
    </>
  );
};

export default MenuItem;
