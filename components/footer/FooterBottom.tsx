'use client';

import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { formatDate } from '@/utils/date';

type FooterBottomProps = {
  lng: Language;
};

const FooterBottom = ({ lng }: FooterBottomProps) => {
  const { t } = useTranslation(lng, 'common');
  // Per render, not at module load: a long-running server kept last year's value.
  const year = formatDate(new Date(), lng, { year: 'numeric' });

  return (
    <div className='border-bege-dark border-t'>
      <p className='text-muted-foreground mx-auto max-w-6xl px-4 py-5 text-center text-sm sm:px-6 lg:px-8'>
        {/* A page rendered on 31 December and opened on 1 January legitimately
            differs here; the browser's year wins without a hydration error. */}
        &copy; <span suppressHydrationWarning>{year}</span> {t('footer.allRightsReserved')} ·{' '}
        {t('footer.madeWithPurpose')}
      </p>
    </div>
  );
};

export default FooterBottom;
