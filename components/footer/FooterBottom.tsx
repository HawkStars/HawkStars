'use client';

import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

type FooterBottomProps = {
  lng: Language;
  /**
   * Copyright year, computed by the server-side `Footer` inside a `'use cache'`
   * scope. It must not be read here with `new Date()`: under `cacheComponents`
   * a synchronous time read while a Client Component prerenders aborts the
   * whole prerender, which turned the navbar/main/footer of every org route
   * into a client-rendered hole and broke PPR resumes ("Couldn't find all
   * resumable slots by key/index during replaying").
   */
  year: number;
};

const FooterBottom = ({ lng, year }: FooterBottomProps) => {
  const { t } = useTranslation(lng, 'common');

  return (
    <div className='border-bege-dark border-t'>
      <p className='text-muted-foreground mx-auto max-w-6xl px-4 py-5 text-center text-sm sm:px-6 lg:px-8'>
        &copy; {year} {t('footer.allRightsReserved')} · {t('footer.madeWithPurpose')}
      </p>
    </div>
  );
};

export default FooterBottom;
