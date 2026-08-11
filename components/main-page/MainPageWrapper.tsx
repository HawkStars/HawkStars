import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getMainPageInformation } from '@/lib/payload/main-page';
import { ImageMedia } from '@/payload/components/Media';
import { FC, Suspense } from 'react';
import MainPageBanner from './MainPageBanner';
import RichTextWrapper from '@/payload/components/RichText/RichTextWrapper';
import { hawkLogo } from '@/utils/models/images/logos';

type MainPageWrapperProps = {
  lng: Language;
};

const MainPageWrapper: FC<MainPageWrapperProps> = async ({ lng }) => {
  const pageInformation = await getMainPageInformation(lng as Language);

  if (!pageInformation || !pageInformation.layout) {
    const { t } = await getServerTranslation(lng, 'common');
    return (
      <div className='mt-20 flex w-full flex-col items-center justify-center gap-20'>
        <ImageMedia src={hawkLogo} alt={t('a11y.logoAlt')} />
        <h1 className='text-xl'>{t('home.revamp')}</h1>
      </div>
    );
  } else {
    const banner = pageInformation.bannerFields || {};
    return (
      <Suspense fallback={<></>}>
        {banner && <MainPageBanner {...banner} />}
        <RichTextWrapper data={pageInformation.layout} />
      </Suspense>
    );
  }
};

export default MainPageWrapper;
