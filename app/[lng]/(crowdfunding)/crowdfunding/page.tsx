import { Language } from '@/i18n/settings';
import CrowdfundingPageContent from '@/components/Crowdfunding/CrowdfundingPageContent';
import { getCrowdfundingSettings } from '@/lib/payload/queries/globals/crowdfundingSettings';
import { getServerTranslation } from '@/i18n';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';

// Localised title/description from metadata.json, but kept out of search results:
// /global-village carries the same campaign and is the page we want indexed.
export async function generateMetadata(props: {
  params: Promise<{ lng: Language }>;
}): Promise<Metadata> {
  const { lng } = await props.params;
  return {
    ...getMetadataPageInfo(lng, 'crowdfunding'),
    robots: { index: false, follow: true },
  };
}

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
