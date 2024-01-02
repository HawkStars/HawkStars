'use client';
import { useMainAppContext } from '@/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import { transformUrl, DONATE_URL } from '@/utils/paths';
import Link from 'next/link';

const DonateLink = () => {
  const { lng } = useMainAppContext();
  const { t } = useTranslation(lng, 'training_center');
  return (
    <Link
      href={transformUrl(lng, DONATE_URL)}
      className='w-fit cursor-pointer rounded-xl border border-green bg-green fill-white px-4 py-3 text-center font-black text-white focus:outline-none focus:ring-0'
    >
      {t('click_to_donate')}
    </Link>
  );
};

export default DonateLink;
