import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { getBoardMembers } from '@/lib/payload/queries/team';
import TeamInformation from '@/components/team/TeamInformation';
import { Suspense } from 'react';
import { HawkStarsSection, PageHero, PageLoading } from '@/components/layout';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'team');
  return metadataPage;
}

// The inner <Suspense> around <TeamInformation> deferred nothing: `params`,
// `getServerTranslation` and `getBoardMembers` had all been awaited before that
// JSX existed, so the boundary only ever wrapped already-resolved data. The
// boundary has to sit above the awaits, which means the page component itself
// must not await — hence the non-async shell plus a content child that consumes
// the `params` promise inside the boundary.
const TeamPage = (props: LanguagePageProps) => (
  <Suspense fallback={<PageLoading />}>
    <TeamContent params={props.params} />
  </Suspense>
);

const TeamContent = async ({ params }: { params: LanguagePageProps['params'] }) => {
  const { lng } = await params;
  const [{ t }, boardMembers] = await Promise.all([
    getServerTranslation(lng, 'team'),
    getBoardMembers(lng),
  ]);

  return (
    <>
      <PageHero title={t('title')} description={t('description')} />
      <HawkStarsSection spacing='default'>
        <TeamInformation boardMembers={boardMembers} lng={lng} />
      </HawkStarsSection>
    </>
  );
};

export default TeamPage;
