import type { Metadata } from 'next';
import { Language } from '@/i18n/settings';
import CrowdfundingHero from '@/components/Crowdfunding/CrowdfundingHero';
import CrowdfundingVideo from '@/components/Crowdfunding/CrowdfundingVideo';
import CrowdfundingAbout from '@/components/Crowdfunding/CrowdfundingAbout';
import CrowdfundingTransparency from '@/components/Crowdfunding/CrowdfundingTransparency';
import CrowdfundingRewards from '@/components/Crowdfunding/CrowdfundingRewards';
import CrowdfundingUpdates from '@/components/Crowdfunding/CrowdfundingUpdates';
import CrowdfundingBusiness from '@/components/Crowdfunding/CrowdfundingBusiness';
import CrowdfundingPartners from '@/components/Crowdfunding/CrowdfundingPartners';
import CrowdfundingFAQ from '@/components/Crowdfunding/CrowdfundingFAQ';
import CrowdfundingCTA from '@/components/Crowdfunding/CrowdfundingCTA';
import { getCrowdfundingSettings } from '@/lib/payload/queries/globals/crowdfundingSettings';
import { getServerTranslation } from '@/i18n';

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Crowdfunding | Global Village by Hawk Stars',
    description:
      'Ajuda-nos a construir o Global Village em Pinhel. Campanha pública de crowdfunding para transformar um edifício devoluto num centro multidisciplinar.',
  };
}

const CrowdfundingPage = async (props: { params: Promise<{ lng: Language }> }) => {
  const { lng } = await props.params;
  const { t } = await getServerTranslation(lng, 'crowdfunding');
  const settings = await getCrowdfundingSettings(lng);

  return (
    <div className='bg-crowdfunding-bg flex flex-col'>
      <CrowdfundingHero lng={lng} {...settings} t={t} />
      <CrowdfundingVideo {...settings} t={t} />
      <CrowdfundingAbout {...settings} t={t} />
      <CrowdfundingTransparency lng={lng} {...settings} t={t} />
      <CrowdfundingRewards {...settings} t={t} />
      <CrowdfundingUpdates {...settings} t={t} />
      <CrowdfundingBusiness {...settings} t={t} />
      <CrowdfundingPartners {...settings} t={t} />
      <CrowdfundingFAQ {...settings} t={t} />
      <CrowdfundingCTA {...settings} t={t} />
    </div>
  );
};

export default CrowdfundingPage;
