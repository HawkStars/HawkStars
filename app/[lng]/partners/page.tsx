import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { getMetadataPageInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { getPartnersQuery } from '@/lib/payload/queries/partner';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import PartnerCard from '../../../components/partners/PartnerCard';

export const revalidate = 1800; // invalidate every 10 minutes

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'partners');
  return metadataPage;
}

const PartnersPage = async (props: { params: Promise<{ lng: Language }> }) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'partners');

  const data = await getPartnersQuery();
  const { docs: partners, totalDocs } = data;

  if (!totalDocs) return <div>No partners found.</div>;

  const nationalPartners = partners.filter((partner) => partner.type == 'national');
  const internationalPartners = partners.filter((partner) => partner.type == 'international');
  return (
    <section>
      <HawkStarsSection>
        <h1 className='text-h1_semibold mt-5 text-center'>{t('title')}</h1>
        <p className='my-4 text-center text-lg'>{t('description')}</p>
        {nationalPartners.length > 0 && (
          <div className='mt-10' id='national-partners'>
            <h2 className='text-h2_light mb-5 pb-6 text-center'>{t('national')}</h2>
            <div className='grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4'>
              {nationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} name={t(partner.name)} />
              ))}
            </div>
          </div>
        )}
        {internationalPartners.length > 0 && (
          <div className='mt-10' id='international-partners'>
            <h2 className='text-h2_light mb-5 pb-6 text-center'>{t('international')}</h2>
            <div className='grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4'>
              {internationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} />
              ))}
            </div>
          </div>
        )}
      </HawkStarsSection>
    </section>
  );
};

export default PartnersPage;
