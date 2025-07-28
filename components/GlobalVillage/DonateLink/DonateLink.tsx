'use client';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';

const DonateLink = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'training_center');
  return (
    <Link
      href={transformUrl(lng, urls.donate)}
      className='border-green bg-green w-fit cursor-pointer rounded-xl border fill-white px-4 py-3 text-center text-white focus:ring-0 focus:outline-hidden'
    >
      {t('click_to_donate')}
    </Link>
  );
};

export default DonateLink;
