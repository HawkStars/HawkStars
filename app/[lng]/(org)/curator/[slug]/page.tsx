import { HawkStarsSection } from '@/components/layout';

import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import { getSingleCuratorQuery } from '@/lib/payload/queries/artwork';
import { Language } from '@/i18n/settings';
import { ImageMedia } from '@/payload/components/Media';
import { Media } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { Suspense } from 'react';

type CuratorPageProps = { params: Promise<LanguageProps & { slug: string }> };

// Unlike app/[lng]/(org)/artwork/[slug]/page.tsx (which wraps its equivalent
// data fetch in 'use cache'), this route called the raw, uncached
// `getSingleCuratorQuery` directly — from both generateMetadata and the page
// body. With `cacheComponents` enabled, an uncached Payload call reached
// outside `'use cache'`/Suspense makes the route fully dynamic and can bail
// out of prerendering entirely with "Next.js encountered the unstable value
// `Date.now()` while prerendering" (Payload/its Mongo driver touch Date.now()
// internally). Caching it, same as the artwork route, fixes the bailout and
// lets both callers share one cached lookup instead of querying twice.
const getCuratorInformation = async (slug: string, locale: Language) => {
  'use cache';
  cacheLife('hours');
  cacheTag(`curators:${slug}`, 'curators');
  return getSingleCuratorQuery(slug, locale);
};

export async function generateMetadata(props: CuratorPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  const curator = await getCuratorInformation(slug, lng);

  if (!curator) {
    return {
      title: 'Curator Not Found',
      description: 'The requested curator profile could not be found.',
    };
  }

  const hasDescriptionContent =
    curator.description && Array.isArray(curator.description) && curator.description.length > 0;

  return {
    title: `${curator.name} - Curator | Hawk Stars NGO`,
    description: hasDescriptionContent
      ? `Learn about ${curator.name}, curator at Hawk Stars NGO Social Impact Art Gallery.`
      : `${curator.name} - Curator at Hawk Stars NGO Social Impact Art Gallery in Pinhel, Portugal.`,
    keywords: [
      'Hawk Stars NGO',
      'Curator',
      curator.name || 'Unknown Curator',
      'Art Gallery',
      'Social Impact',
    ],
    openGraph: {
      title: `${curator.name} - Curator | Hawk Stars NGO`,
      description: `${curator.name} - Curator at Hawk Stars NGO Social Impact Art Gallery`,
      images:
        curator.image && (curator.image as Media)?.url
          ? [(curator.image as Media).url as string]
          : [],
    },
  };
}

// Not `async`, and awaits nothing — it only opens the <Suspense> boundary
// before any data is requested. `'use cache'` on getCuratorInformation makes
// the Payload query itself prerenderable, but this route still reaches a
// dynamic API: `params` (there's no generateStaticParams for [slug], so the
// slug isn't known at build time). Awaiting that in the page body would keep
// the route blocking no matter how well the query is cached, so the promise
// is handed to a child that awaits it *inside* the boundary.
const CuratorPage = (props: CuratorPageProps) => (
  <Suspense fallback={<></>}>
    <CuratorContent params={props.params} />
  </Suspense>
);

const CuratorContent = async ({ params }: { params: CuratorPageProps['params'] }) => {
  const { lng, slug } = await params;
  const curator = await getCuratorInformation(slug, lng);
  if (!curator) notFound();

  return (
    <HawkStarsSection className='font-oswald bg-bege-light flex pt-10 max-lg:flex-col max-lg:px-0 max-lg:pt-0'>
      <div className='max-lg:mx-auto lg:m-5 lg:w-96'>
        {curator.image && (
          <ImageMedia
            resource={curator.image}
            alt={curator.name || 'Curator Image'}
            width={384}
            height={512}
            className='rounded-xl'
          />
        )}
      </div>
      <div className='w-full p-5'>
        <h1 className='text-h2_bold mb-5'>{curator.name}</h1>
        {curator.description && <RichText data={curator.description} />}
      </div>
    </HawkStarsSection>
  );
};

export default CuratorPage;
