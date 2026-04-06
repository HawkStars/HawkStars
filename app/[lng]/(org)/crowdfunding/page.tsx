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

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Crowdfunding | Global Village by Hawk Stars',
    description:
      'Ajuda-nos a construir o Global Village em Pinhel. Campanha pública de crowdfunding para transformar um edifício devoluto num centro multidisciplinar.',
  };
}

const CrowdfundingPage = async (props: { params: Promise<{ lng: Language }> }) => {
  return (
    <div className="flex flex-col bg-[#0d0d0d]">
      <CrowdfundingHero />
      <CrowdfundingVideo />
      <CrowdfundingAbout />
      <CrowdfundingTransparency />
      <CrowdfundingRewards />
      <CrowdfundingUpdates />
      <CrowdfundingBusiness />
      <CrowdfundingPartners />
      <CrowdfundingFAQ />
      <CrowdfundingCTA />
    </div>
  );
};

export default CrowdfundingPage;
