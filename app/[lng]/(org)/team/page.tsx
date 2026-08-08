import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { getBoardMembers } from '@/lib/payload/queries/team';
import TeamInformation from '@/components/team/TeamInformation';
import { Suspense } from 'react';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

// The inner <Suspense> around <TeamInformation> deferred nothing: `params`,
// `getServerTranslation` and `getBoardMembers` had all been awaited before that
// JSX existed, so the boundary only ever wrapped already-resolved data. The
// boundary has to sit above the awaits, which means the page component itself
// must not await — hence the non-async shell plus a content child that consumes
// the `params` promise inside the boundary.
const TeamPage = (props: LanguagePageProps) => (
  <Suspense fallback={<></>}>
    <TeamContent params={props.params} />
  </Suspense>
);

const TeamContent = async ({ params }: { params: LanguagePageProps['params'] }) => {
  const { lng } = await params;
  const [{ t }, boardMembers] = await Promise.all([
    getServerTranslation(lng, 'team'),
    getBoardMembers(),
  ]);

  return (
    <div className='mt-5 flex flex-col gap-20 px-4 max-lg:gap-8 lg:mt-10'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 pl-4'>
        <h1 className='text-h1_semibold text-center'>{t('title')}</h1>
        <p className='text-body mx-auto max-w-3xl text-gray-600 lg:text-justify'>
          {t('description')}
        </p>
      </div>
      <div className='flex flex-col justify-center'>
        <TeamInformation boardMembers={boardMembers} lng={lng} />
      </div>
    </div>
  );
};

export default TeamPage;
