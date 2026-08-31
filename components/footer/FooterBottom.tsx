'use client';

import Link from 'next/link';
import Socials from '../utils/Socials';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { SITE_GET_URLS } from '@/utils/paths';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';

type FooterBottomProps = {
  lng: Language;
};

const FooterBottom = ({ lng }: FooterBottomProps) => {
  const { t } = useTranslation(lng, 'common');

  return (
    <div className='mt-10 grid grid-cols-1 pb-3 lg:mt-0 lg:grid-cols-2 lg:border-t lg:px-2 lg:pt-1'>
      <div className='mt-auto mb-2 flex px-2 max-lg:flex-col max-lg:justify-between max-lg:gap-4 lg:order-2 lg:my-auto lg:ml-auto'>
        <Link href={SITE_GET_URLS.terms} className='mr-2 -mb-1 text-neutral-700'>
          {t('terms_and_conditions')}
        </Link>
        <div data-testid='socials-footer' className='flex gap-1'>
          <LanguageSwitcher isFooter />
          <Socials />
        </div>
      </div>
      <div className='flex gap-3 border-t-gray-100 px-2 pt-2 text-wrap max-lg:border-t lg:order-1'>
        <p>
          {t('footer.designedBy')}{' '}
          <Link
            href={'https://dribbble.com/Rossellini'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600'
          >
            @Rodrigo Rosselini
          </Link>
          .
        </p>
        <p>
          {t('footer.builtBy')}{' '}
          <Link
            href={'https://www.linkedin.com/in/pcardosolei/'}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600'
          >
            @Paulo Cardoso
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;
