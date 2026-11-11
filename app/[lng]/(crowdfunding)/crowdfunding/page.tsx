import { Language } from '@/i18n/settings';
import CrowdfundingPageContent from '@/components/Crowdfunding/CrowdfundingPageContent';
import { getCrowdfundingSettings } from '@/lib/payload/queries/globals/crowdfundingSettings';
import { getServerTranslation } from '@/i18n';

// Metadata comes from the (crowdfunding) layout, localised via metadata.json. This
// page used to override it with a Portuguese literal, so /en showed a PT title.

export const instant = false;

const CrowdfundingPage = async (props: { params: Promise<{ lng: Language }> }) => {
  const { lng } = await props.params;
  const [{ t }, settings] = await Promise.all([
    getServerTranslation(lng, 'crowdfunding'),
    getCrowdfundingSettings(lng),
  ]);

  if (!settings) return null;

  return <CrowdfundingPageContent settings={settings} t={t} lng={lng} />;
};

export default CrowdfundingPage;
