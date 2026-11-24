import { Metadata } from 'next';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { getCrowdfundingSettings } from '@/lib/payload/queries/globals/crowdfundingSettings';
import { getSinglePageSlug } from '@/lib/payload/queries/page';
import { CMS_PAGE_URLS } from '@/utils/paths';
import { getMetadataPageInfo } from '@/utils/metadata';
import VillageCrowdfundingContent from '@/components/Crowdfunding/village/VillageCrowdfundingContent';

/**
 * The Global Village story (CMS `village` page) and the crowdfunding campaign on one page,
 * in the campaign palette. Indexable and in the sitemap; /crowdfunding stays live but noindex
 * so the two don't compete for the same searches.
 */
export async function generateMetadata(props: {
  params: Promise<{ lng: Language }>;
}): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng, 'global_village');
}

export const instant = false;

const VillageCrowdfundingPage = async (props: { params: Promise<{ lng: Language }> }) => {
  const { lng } = await props.params;
  const [{ t }, settings, village] = await Promise.all([
    getServerTranslation(lng, 'crowdfunding'),
    getCrowdfundingSettings(lng),
    getSinglePageSlug(CMS_PAGE_URLS.village.slice(1), lng),
  ]);

  if (!settings) return null;

  return <VillageCrowdfundingContent settings={settings} village={village} t={t} lng={lng} />;
};

export default VillageCrowdfundingPage;
