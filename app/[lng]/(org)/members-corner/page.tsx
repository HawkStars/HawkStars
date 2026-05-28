import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import Link from 'next/link';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import { getConfirmedMemberProjects } from '@/lib/payload/queries/memberProject';
import { transformUrl, urls } from '@/utils/paths';
import MembersShowcase from '@/components/members-corner/MembersShowcase';

export const revalidate = 300;

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  return getMetadataPageInfo(lng as Language, 'members_corner');
}

const MembersCornerPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;

  const [{ t }, projects] = await Promise.all([
    getServerTranslation(lng, 'members-corner'),
    getConfirmedMemberProjects(),
  ]);

  return (
    <HawkStarsSection padding='none'>
      <header className='bg-green relative overflow-hidden px-4 py-20 lg:py-28 xl:px-40'>
        <div className='pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5' />
        <div className='pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5' />

        <div className='relative mx-auto max-w-4xl text-center'>
          <p className='text-bege-dark mb-4 text-sm font-bold tracking-[0.2em] uppercase'>
            {t('hero.subtitle')}
          </p>
          <h1 className='mb-6 text-4xl leading-tight font-bold text-white lg:text-6xl'>
            {t('hero.title')}
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-white/90'>{t('hero.description')}</p>
          <Link
            href={transformUrl(lng, urls.members_corner_submit)}
            className='text-green inline-block rounded-md bg-white px-8 py-3 font-semibold transition-colors hover:bg-white/90'
          >
            {t('hero.submitCta')}
          </Link>
        </div>
      </header>

      <MembersShowcase projects={projects} t={t} />
    </HawkStarsSection>
  );
};

export default MembersCornerPage;
