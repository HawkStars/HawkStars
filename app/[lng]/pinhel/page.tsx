import Link from 'next/link';

import { pinhelUrls } from './config';
import { useServerTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import PinhelSlider from '@/components/PinhelPage/PinhelSlider';

const PinhelPage = async ({ params: { lng } }: LanguagePageProps) => {
  const { t } = await useServerTranslation(lng, 'pinhel');
  const mapPinhel = pinhelUrls[lng]?.historical_center || pinhelUrls['pt'].historical_center || '#';

  return (
    <>
      <PinhelSlider />
      <section className='layout-section mt-5 flex flex-col gap-10'>
        <div className='flex flex-col-reverse gap-5 lg:flex-row'>
          <iframe
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12086.01248318145!2d-7.080789625334545!3d40.772952040264435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3c60486dd9ab33%3A0xbe3d888bdef43fc0!2sPinhel!5e0!3m2!1sen!2spt!4v1704792728490!5m2!1sen!2spt'
            height={400}
            style={{ border: 0 }}
            allowFullScreen={false}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
            className='lg:w-1/2'
          />
          <div className='flex flex-col gap-3 lg:w-1/2'>
            <p className='mt-2'>
              {t('summary')} <span className='text-xs'>[1]</span>
            </p>
            <div className='flex flex-row gap-2'>
              <Link
                lang={lng}
                href={mapPinhel}
                aria-disabled={!!mapPinhel}
                className='text-green underline'
                target='_blank'
              >
                {t('map')}
              </Link>
            </div>
            {pinhelUrls[lng]?.invest_pinhel && (
              <div className='flex flex-row gap-2'>
                <Link
                  lang={lng}
                  href={pinhelUrls[lng]?.invest_pinhel || '#'}
                  className='text-green underline'
                  target='_blank'
                >
                  {t('invest')}
                </Link>
              </div>
            )}

            <Link
              className='ml-auto mt-auto text-xs'
              href='https://www.cm-pinhel.pt/visitar-pinhel/descobrir-e-visitar/'
            >
              <span className='text-bold'>[1]</span> CM Pinhel.
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default PinhelPage;
