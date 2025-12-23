import Link from 'next/link';
import Socials from '../utils/Socials';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import { urls } from '@/utils/paths';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';

const FooterBottom = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  return (
    <div className='mt-10 grid grid-cols-1 pb-3 lg:mt-0 lg:grid-cols-2 lg:border-t lg:px-2 lg:pt-1'>
      <div className='mt-auto mb-2 flex px-2 max-lg:justify-between lg:order-2 lg:my-auto lg:ml-auto'>
        <Link href={urls.terms} className='mr-2 -mb-1 text-neutral-400'>
          {t('navbar.art_gallery.terms_and_conditions')}
        </Link>
        <div data-testid='socials-footer' className='flex gap-1'>
          <LanguageSwitcher isFooter />
          <Socials />
        </div>
      </div>
      <div className='flex gap-3 border-t-gray-100 px-2 pt-2 text-wrap max-lg:border-t lg:order-1'>
        <p>
          Designed by{' '}
          <Link
            href={'https://dribbble.com/Rossellini'}
            target='_blank'
            className='text-sm text-blue-300'
          >
            @Rodrigo Rosselini
          </Link>
          .
        </p>
        <p>
          Built by{' '}
          <Link
            href={'https://www.linkedin.com/in/pcardosolei/'}
            target='_blank'
            className='text-sm text-blue-300'
          >
            @Paulo Cardoso
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FooterBottom;
