'use client';

import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

type FooterBottomProps = {
  lng: Language;
};

const currentYear = new Date().getFullYear();

const FooterBottom = ({ lng }: FooterBottomProps) => {
  const { t } = useTranslation(lng, 'common');

  return (
    <div className='border-bege-dark border-t'>
      <p className='text-muted-foreground mx-auto max-w-6xl px-4 py-5 text-center text-sm sm:px-6 lg:px-8'>
        &copy; {currentYear} {t('footer.allRightsReserved')} · {t('footer.madeWithPurpose')}
      </p>
    </div>
  );
};

export default FooterBottom;
