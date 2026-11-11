import { TFunction } from 'i18next';
import { Language } from '@/i18n/settings';
import { CrowdfundingSetting } from '@/payload-types';
import CrowdfundingHero from './CrowdfundingHero';
import CrowdfundingVideo from './CrowdfundingVideo';
import CrowdfundingAbout from './CrowdfundingAbout';
import CrowdfundingSpaces from './CrowdfundingSpaces';
import CrowdfundingTransparency from './CrowdfundingTransparency';
import CrowdfundingRewards from './CrowdfundingRewards';
import CrowdfundingUpdates from './CrowdfundingUpdates';
import CrowdfundingBusiness from './CrowdfundingBusiness';
import CrowdfundingPartners from './CrowdfundingPartners';
import CrowdfundingFAQ from './CrowdfundingFAQ';
import CrowdfundingCTA from './CrowdfundingCTA';

type Props = { settings: CrowdfundingSetting; t: TFunction<string, string>; lng: Language };

/**
 * The full campaign page. Shared by the public route and the Payload live preview so
 * the two can never drift apart in section order.
 */
const CrowdfundingPageContent = ({ settings, t, lng }: Props) => (
  <div className='bg-crowdfunding-bg flex flex-col'>
    <CrowdfundingHero {...settings} t={t} lng={lng} />
    <CrowdfundingVideo {...settings} t={t} />
    <CrowdfundingAbout t={t} />
    <CrowdfundingSpaces t={t} />
    <CrowdfundingTransparency {...settings} t={t} lng={lng} />
    <CrowdfundingRewards {...settings} t={t} />
    <CrowdfundingUpdates {...settings} t={t} lng={lng} />
    <CrowdfundingPartners {...settings} t={t} />
    <CrowdfundingBusiness {...settings} t={t} lng={lng} />
    <CrowdfundingFAQ t={t} />
    <CrowdfundingCTA {...settings} t={t} />
  </div>
);

export default CrowdfundingPageContent;
