import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';

import { hawkLogo } from '@/utils/models/images/logos';
import FooterMenu from './FooterMenu';
import FooterBottom from './FooterBottom';
import { Footer } from '@/payload-types';
import { FC } from 'react';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import LanguageSwitcher from '../utils/LanguageSwitcher';
import Socials from '../utils/Socials';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';

type FooterProps = {
  footerInfo: Footer;
  lng: Language;
};

const FooterContainer: FC<FooterProps> = async ({ footerInfo, lng }) => {
  const { t } = await getServerTranslation(lng, 'common');

  return (
    <footer className='bg-bege-light border-bege-dark mt-8 border-t'>
      <div className='mx-auto flex max-w-6xl gap-12 px-4 py-12 max-lg:flex-col sm:px-6 lg:px-8 lg:py-16'>
        <div className='flex flex-col gap-5 lg:max-w-xs'>
          <ImageMedia
            className='max-w-40 object-cover'
            src={hawkLogo}
            alt={t('a11y.logoAlt')}
            sizes='160px'
          />
          <p className='text-sm leading-relaxed text-black/70'>{t('footer.mission')}</p>
          <div className='flex flex-wrap gap-3'>
            <Button asChild variant='accent'>
              <Link href={transformUrl(lng, SITE_GET_URLS.contribute)}>{t('footer.donate')}</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href={transformUrl(lng, SITE_GET_URLS.how_to_help_us)}>{t('footer.join')}</Link>
            </Button>
          </div>
          <div data-testid='socials-footer' className='flex items-center gap-1'>
            <LanguageSwitcher isFooter />
            <Socials />
          </div>
        </div>

        {footerInfo && footerInfo.columns && footerInfo.columns?.length > 0 && (
          <nav
            aria-label={t('a11y.footerNav')}
            className='grid flex-1 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5'
          >
            {footerInfo?.columns?.map((column) => (
              <FooterMenu key={column.id} data={column} />
            ))}
          </nav>
        )}
      </div>
      <FooterBottom lng={lng} />
    </footer>
  );
};

export default FooterContainer;
