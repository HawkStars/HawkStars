import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from '@/i18n';
import { LanguagePageProps } from '../types';
import { ABOUT_US_URL, GLOBAL_VILLAGE_URL } from '@/utils/paths';
import { historyReferenceUrl, humanitarianSlideShowImages } from './config';
import Button from '@/components/utils/Button';

import transitionLogo from '@/public/images/history/transition.png';
import Slideshow from '@/components/utils/Slideshow/Slideshow';

const HawkHistoryPage = async ({ params: { lng } }: LanguagePageProps) => {
  const { t } = await useTranslation(lng, 'hawkstars');
  const { geral, festival, erasmus, report, news } = historyReferenceUrl;

  return (
    <section className='layout-section mt-8 flex flex-col gap-5'>
      <p className='text-justify'>{t('beginning')}</p>
      <p className='text-justify'>{t('euro_hawk')}</p>
      <div className='my-5 lg:mx-auto lg:w-1/2'>
        <Image
          src={transitionLogo}
          alt='transition from the old hawk to new version of hawkstars'
          className='rounded-md'
        />
      </div>
      <p className='text-justify'>{t('euro_hawk_2')}</p>
      <p className='text-justify'>{t('hawk_stars')}</p>
      <p className='text-justify'>{t('humanitary')}</p>
      <Slideshow images={humanitarianSlideShowImages} />
      <p className='text-justify'>{t('foundation')}</p>
      <p className='text-justify'>{t('presentation')}</p>

      <div className='mt-5 flex flex-row gap-4'>
        <Link
          href={ABOUT_US_URL}
          className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
        >
          {t('about_hawkstars')}
        </Link>
        <Link
          href={GLOBAL_VILLAGE_URL}
          className='w-fit rounded-xl border border-green bg-green fill-white p-2 text-white'
        >
          {t('about_globalvillage')}
        </Link>
      </div>

      <div className='mt-10 flex flex-col gap-3'>
        <h3 className='text-xl font-bold text-green'>{t('urls.eurohawks')}</h3>
        <ReferencesSection title='Main' urls={geral} />
        <ReferencesSection title='Hawk Festival' urls={erasmus} />
        <ReferencesSection title='Erasmus +' urls={festival} />
      </div>
      <div className='flex flex-col gap-3'>
        <h3 className='text-xl font-bold text-green'>{t('urls.fnee')}</h3>
        <ReferencesSection title='Report' urls={report} />
        <ReferencesSection title='News' urls={news} />
      </div>
    </section>
  );
};

const ReferencesSection = ({ title, urls }: { title: string; urls: string[] }) => {
  return (
    <div className='flex flex-col gap-2'>
      <h6 className='font-bold'>{title}</h6>
      <div className='flex flex-row gap-2 text-sm'>
        {urls.map((url, index) => (
          <Link href={url} target='_blank' key={index}>
            <Button type='button' outline={true}>
              {index + 1}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HawkHistoryPage;
