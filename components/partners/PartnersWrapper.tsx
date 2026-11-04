import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getPartnersQuery } from '@/lib/payload/queries/partner';
import { FC } from 'react';
import { HawkStarsSection, PageHero } from '@/components/layout';
import SectionTitle from '@/components/ui/SectionTitle';
import PartnerCard from './PartnerCard';

type PartnersWrapperProps = {
  lng: Language;
};

const PartnersWrapper: FC<PartnersWrapperProps> = async ({ lng }) => {
  const data = await getPartnersQuery();
  const { docs: partners, totalDocs } = data;
  const { t } = await getServerTranslation(lng, 'partners');

  const hero = <PageHero title={t('title')} description={t('description')} />;

  if (!totalDocs)
    return (
      <>
        {hero}
        <HawkStarsSection spacing='default'>
          <p className='text-body_regular text-black/70'>{t('empty')}</p>
        </HawkStarsSection>
      </>
    );

  const nationalPartners = partners.filter((partner) => partner.type == 'national');
  const internationalPartners = partners.filter((partner) => partner.type == 'international');

  return (
    <>
      {hero}
      <HawkStarsSection spacing='default'>
        {nationalPartners.length > 0 && (
          <div id='national-partners'>
            <SectionTitle title={t('national')} sectionId='national' className='mb-8' />
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'>
              {nationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} name={t(partner.name)} lng={lng} />
              ))}
            </div>
          </div>
        )}
        {internationalPartners.length > 0 && (
          <div className='mt-16' id='international-partners'>
            <SectionTitle title={t('international')} sectionId='international' className='mb-8' />
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'>
              {internationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} lng={lng} />
              ))}
            </div>
          </div>
        )}
      </HawkStarsSection>
    </>
  );
};

export default PartnersWrapper;
