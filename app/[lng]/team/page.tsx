import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { boardSections, sectionLabels, TeamMembers } from './config';
import TeamCard from '@/components/team/TeamCard';
import { getServerTranslation } from '@/i18n';
import { getBoardMembers } from '@/lib/payload/queries/team';

export type SelectOption = {
  label: string;
  value: string;
  id: string;
  disabled: boolean;
};

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'home');
  return metadataPage;
}

const TeamPage = async (props: { params: Promise<{ lng: string }> }) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'team');
  const boardMembers = await getBoardMembers();

  return (
    <div className='mt-5 flex flex-col gap-8 border-b px-4 lg:mt-10'>
      {boardSections.map((section, index) => {
        return (
          <div key={index} className='text-h2_light'>
            <h6>{t(sectionLabels[section])}</h6>
            <div className='flex flex-col gap-3 py-5'>
              <div className='mt-3 flex flex-wrap gap-5'>
                {boardMembers[section].map((member, index) => (
                  <div key={index} className='flex w-full flex-col justify-center gap-3 lg:w-fit'>
                    <TeamCard {...member} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPage;
