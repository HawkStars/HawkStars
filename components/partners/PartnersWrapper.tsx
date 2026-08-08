import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { getPartnersQuery } from '@/lib/payload/queries/partner';
import { FC } from 'react';
import { HawkStarsSection } from '../layout';
import PartnerCard from './PartnerCard';

type PartnersWrapperProps = {
  lng: Language;
};

const PartnersWrapper: FC<PartnersWrapperProps> = async ({ lng }) => {
  const data = await getPartnersQuery();
  const { docs: partners, totalDocs } = data;
  const { t } = await getServerTranslation(lng, 'partners');

  if (!totalDocs) return <div>{t('empty')}</div>;

  const nationalPartners = partners.filter((partner) => partner.type == 'national');
  const internationalPartners = partners.filter((partner) => partner.type == 'international');

  return (
    <HawkStarsSection className='flex-col'>
      <h1 className='text-h1_semibold mt-5 text-center'>{t('title')}</h1>
      <p className='my-4 text-center text-lg'>{t('description')}</p>
      {nationalPartners.length > 0 && (
        <div className='mt-10' id='national-partners'>
          <h2 className='text-h2_light mb-5 pb-6 text-center'>{t('national')}</h2>
          <div className='grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4'>
            {nationalPartners.map((partner, index) => (
              <PartnerCard {...partner} key={index} name={t(partner.name)} lng={lng} />
            ))}
          </div>
        </div>
      )}
      {internationalPartners.length > 0 && (
        <div className='mt-10' id='international-partners'>
          <h2 className='text-h2_light mb-5 pb-6 text-center'>{t('international')}</h2>
          <div className='grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4'>
            {internationalPartners.map((partner, index) => (
              <PartnerCard {...partner} key={index} lng={lng} />
            ))}
          </div>
        </div>
      )}
    </HawkStarsSection>
  );
};

export default PartnersWrapper;
