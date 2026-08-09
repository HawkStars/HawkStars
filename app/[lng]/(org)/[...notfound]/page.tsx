import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';

import { SITE_GET_URLS } from '@/utils/paths';
import { hawkLogo } from '@/utils/models/images/logos';
import { Metadata } from 'next';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { Suspense } from 'react';

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

// A catch-all segment, so `params` is not enumerable by `generateStaticParams`
// and awaiting it is a dynamic API — hence the <Suspense> shell. The body itself
// depends only on `lng`, so it is cached: `getServerTranslation` resolves a
// dynamic `import()` of the locale JSON, which counts as uncached data and is
// deferred behind the boundary rather than forcing the route to remain blocking.
export default function NotFoundPage(props: NotFoundPageProps) {
  return (
    <Suspense fallback={<></>}>
      <NotFoundResolver params={props.params} />
    </Suspense>
  );
}

const NotFoundResolver = async ({ params }: { params: NotFoundPageProps['params'] }) => {
  const { lng } = await params;
  return <NotFoundContent lng={lng} />;
};

async function NotFoundContent({ lng }: { lng: Language }) {
  const { t } = await getServerTranslation(lng, 'common');
  return (
    <div className='my-auto flex items-center'>
      <div className='mx-auto flex w-2/3 flex-col justify-center gap-10 align-middle'>
        <ImageMedia src={hawkLogo} alt={t('a11y.logoAlt')} className='mx-auto' />
        <h1 className='text-center'>{t('notFound.dreaming')}</h1>
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
