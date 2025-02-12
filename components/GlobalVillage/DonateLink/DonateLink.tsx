'use client';

import { useLanguageCookie } from '@/utils/contexts/AppProvider';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';
import { useTranslation } from '@/i18n/client';
import { transformUrl, urls } from '@/utils/paths';
import Link from 'next/link';

const DonateLink = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'training_center');
  return (
    <Link
      href={transformUrl(lng, urls.donate)}
      className='w-fit cursor-pointer rounded-xl border border-green bg-green fill-white px-4 py-3 text-center font-black text-white focus:outline-none focus:ring-0'
    >
      {t('click_to_donate')}
    </Link>
  );
};

export default DonateLink;
