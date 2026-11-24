import { TFunction } from 'i18next';
import { Language } from '@/i18n/settings';
import { CrowdfundingSetting, Page } from '@/payload-types';
import CrowdfundingHero from '../CrowdfundingHero';
import CrowdfundingVideo from '../CrowdfundingVideo';
import CrowdfundingAbout from '../CrowdfundingAbout';
import CrowdfundingSpaces from '../CrowdfundingSpaces';
import CrowdfundingTransparency from '../CrowdfundingTransparency';
import CrowdfundingRewards from '../CrowdfundingRewards';
import CrowdfundingUpdates from '../CrowdfundingUpdates';
import CrowdfundingPartners from '../CrowdfundingPartners';
import CrowdfundingBusiness from '../CrowdfundingBusiness';
import CrowdfundingFAQ from '../CrowdfundingFAQ';
import CrowdfundingCTA from '../CrowdfundingCTA';
import { getVillageSections } from './utils';
import {
  VillageChallenges,
  VillageComparisonSection,
  VillageGallery,
  VillageImpact,
  VillageManifesto,
  VillageOpportunities,
  VillageProposal,
  VillageQuote,
  VillageVision,
} from './VillageSections';

type Props = {
  settings: CrowdfundingSetting;
  village: Page | null;
  t: TFunction<string, string>;
  lng: Language;
};

/**
 * TEST — the /village story and the crowdfunding campaign on one page, in the campaign
 * palette. Narrative first (why, what, when), then the ask (money, rewards, trust).
 * Village sections read their copy from the CMS `village` page and skip themselves
 * when a block is missing.
 */
const VillageCrowdfundingContent = ({ settings, village, t, lng }: Props) => {
  const v = village ? getVillageSections(village) : undefined;

  return (
    <div className='bg-crowdfunding-bg flex flex-col'>
      <CrowdfundingHero {...settings} t={t} lng={lng} />
      <VillageManifesto block={v?.manifesto} t={t} />
      <VillageComparisonSection block={v?.comparison} t={t} />
      <VillageChallenges block={v?.challenges} eyebrow={t('village.challenges')} />
      <VillageOpportunities block={v?.opportunities} eyebrow={t('village.opportunities')} t={t} />
      <CrowdfundingVideo {...settings} t={t} />
      <VillageProposal block={v?.proposal} t={t} />
      <CrowdfundingAbout t={t} />
      <CrowdfundingSpaces t={t} />
      <VillageGallery block={v?.gallery} t={t} />
      <VillageVision block={v?.vision} t={t} />
      <VillageImpact block={v?.impact} t={t} />
      <CrowdfundingTransparency {...settings} t={t} lng={lng} />
      <CrowdfundingRewards {...settings} t={t} />
      <CrowdfundingUpdates {...settings} t={t} lng={lng} />
      <CrowdfundingPartners {...settings} t={t} />
      <CrowdfundingBusiness {...settings} t={t} lng={lng} />
      <VillageQuote join={v?.join} quote={v?.quote} t={t} />
      <CrowdfundingFAQ t={t} />
      <CrowdfundingCTA {...settings} t={t} />
    </div>
  );
};

export default VillageCrowdfundingContent;
