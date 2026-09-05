'use client';

import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

type FooterBottomProps = {
  lng: Language;
};

const FooterBottom = ({ lng }: FooterBottomProps) => {
  const { t } = useTranslation(lng, 'common');

  const currentYear = new Date().getFullYear();

  return (
    <div className='mt-10 flex justify-center lg:mt-2 lg:border-t lg:py-4'>
      <span className='text-muted-foreground text-md'>
        &copy; {currentYear} {t('footer.allRightsReserved')} | {t('footer.madeWithPurpose')}{' '}
      </span>
    </div>
  );
};

export default FooterBottom;
