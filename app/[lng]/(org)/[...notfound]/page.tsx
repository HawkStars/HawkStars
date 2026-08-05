import { ImageMedia } from '@/payload/components/Media';
import { connection } from 'next/server';
import Link from 'next/link';

import { SITE_GET_URLS } from '@/utils/paths';
import { hawkLogo } from '@/utils/models/images/logos';
import { Metadata } from 'next';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '404 - Page Not Found | Hawk Stars NGO',
    description: 'The page you are looking for could not be found.',
    robots: 'noindex, nofollow',
  };
}

type NotFoundPageProps = {
  params: Promise<{ lng: Language }>;
};

export default async function NotFoundPage(props: NotFoundPageProps) {
  await connection();
  const { lng } = await props.params;
  const { t } = await getServerTranslation(lng, 'common');
  return (
    <div className='my-auto flex items-center'>
      <div className='mx-auto flex w-2/3 flex-col justify-center gap-10 align-middle'>
        <ImageMedia src={hawkLogo} alt={t('a11y.logoAlt')} className='mx-auto' />
        <h3 className='text-center'>{t('notFound.dreaming')}</h3>
        <Link
          href={SITE_GET_URLS.home}
          className='border-green bg-green mx-auto w-fit rounded-lg border fill-white p-3 text-white'
        >
          {t('actions.goBack')}
        </Link>
      </div>
    </div>
  );
}
