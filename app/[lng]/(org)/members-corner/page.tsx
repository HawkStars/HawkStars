import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import Link from 'next/link';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { PageHero, PageLoading } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { getConfirmedMemberProjects } from '@/lib/payload/queries/memberProject';
import { transformUrl, allUrls } from '@/utils/paths';
import MembersShowcase from '@/components/members-corner/MembersShowcase';
import { Suspense } from 'react';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  return getMetadataPageInfo(lng as Language, 'members_corner');
}

const MembersCornerPage = (props: LanguagePageProps) => (
  <Suspense fallback={<PageLoading />}>
    <MembersCornerContent params={props.params} />
  </Suspense>
);

const MembersCornerContent = async ({ params }: { params: LanguagePageProps['params'] }) => {
  const { lng } = await params;

  const [{ t }, projects] = await Promise.all([
    getServerTranslation(lng, 'members-corner'),
    getConfirmedMemberProjects(),
  ]);

  return (
    <>
      <PageHero
        variant='green'
        align='center'
        eyebrow={t('hero.subtitle')}
        title={t('hero.title')}
        description={t('hero.description')}
        actions={
          <Button asChild variant='inverse' size='xl'>
            <Link href={transformUrl(lng, allUrls.members_corner_submit)}>
              {t('hero.submitCta')}
            </Link>
          </Button>
        }
      />

      <MembersShowcase projects={projects} t={t} lng={lng} />
    </>
  );
};

export default MembersCornerPage;
