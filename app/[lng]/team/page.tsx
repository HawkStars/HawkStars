import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { boardSections, sectionLabels } from './config';
import { getServerTranslation } from '@/i18n';
import { getBoardMembers } from '@/lib/payload/queries/team';
import TeamCard from '@/components/team/TeamCard';

export const revalidate = 7200; // 2 hours

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
                {/* Team Grid */}
                <div className='grid grid-cols-1 gap-8 md:grid-cols-3 xl:grid-cols-4'>
                  {boardMembers[section].map((member) => (
                    <TeamCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPage;
