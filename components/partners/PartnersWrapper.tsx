import { getServerTranslation } from '@/i18n';
import { Language, toIntlLocale } from '@/i18n/settings';
import { getPartnersQuery } from '@/lib/payload/queries/partner';
import { CountryCodes, FlagIcons } from '@/lib/flags';
import { Partner } from '@/payload-types';
import { FC } from 'react';
import { cn } from '@/lib/utils';
import { HawkStarsSection, PageHero } from '@/components/layout';
import SectionTitle from '@/components/ui/SectionTitle';
import PartnerCard from './PartnerCard';
import PartnersMap, { PartnerPin } from './PartnersMap';

type PartnersWrapperProps = {
  lng: Language;
};

const GRID = 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6';

/** International partners grouped by country, biggest groups first. */
const groupByCountry = (partners: Partner[]): [string, Partner[]][] => {
  const groups = new Map<string, Partner[]>();
  for (const partner of partners) {
    const country = partner.country || '—';
    groups.set(country, [...(groups.get(country) ?? []), partner]);
  }
  return [...groups.entries()].sort(
    ([countryA, a], [countryB, b]) => b.length - a.length || countryA.localeCompare(countryB)
  );
};

const PartnersWrapper: FC<PartnersWrapperProps> = async ({ lng }) => {
  const data = await getPartnersQuery();
  const { docs: partners, totalDocs } = data;
  const { t } = await getServerTranslation(lng, 'partners');

  const nationalPartners = partners.filter((partner) => partner.type == 'national');
  const internationalPartners = partners.filter((partner) => partner.type == 'international');
  const byCountry = groupByCountry(internationalPartners);
  // The CMS stores English country names; show them in the visitor's language.
  const regionNames = new Intl.DisplayNames([toIntlLocale(lng)], { type: 'region' });
  const countryLabel = (country: string) => {
    const code = CountryCodes[country];
    return (code && regionNames.of(code)) || country;
  };

  // Only partners with both coordinates get a pin; the rest just stay off the map.
  const pins: PartnerPin[] = partners.flatMap((partner) => {
    const { latitude, longitude } = partner.location ?? {};
    if (typeof latitude !== 'number' || typeof longitude !== 'number') return [];
    const logo = partner.logo && typeof partner.logo === 'object' ? partner.logo.url : null;
    return [
      {
        id: partner.id,
        name: partner.type === 'national' ? t(partner.name) : partner.name,
        countryLabel: countryLabel(partner.country),
        logoUrl: logo ?? null,
        type: partner.type,
        latitude,
        longitude,
      },
    ];
  });

  const stats = [
    { value: nationalPartners.length, label: t('stats.national'), color: 'text-green' },
    {
      value: internationalPartners.length,
      label: t('stats.international'),
      color: 'text-ink',
    },
    // Portugal counts once whether or not it also has international partners.
    {
      value: new Set(['Portugal', ...internationalPartners.map((p) => p.country)]).size,
      label: t('stats.countries'),
      color: 'text-ink',
    },
  ];

  const hero = (
    <PageHero title={t('title')} description={t('description')}>
      {totalDocs > 0 && (
        <dl className='mt-8 flex flex-wrap gap-x-10 gap-y-4'>
          {stats.map(({ value, label, color }) => (
            <div key={label} className='flex flex-col'>
              <dt className='text-eyebrow order-2 text-black/60'>{label}</dt>
              <dd className={cn('text-h1_semibold order-1', color)}>{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </PageHero>
  );

  if (!totalDocs)
    return (
      <>
        {hero}
        <HawkStarsSection spacing='default'>
          <p className='text-body_regular text-black/70'>{t('empty')}</p>
        </HawkStarsSection>
      </>
    );

  return (
    <>
      {hero}
      {pins.length > 0 && (
        <HawkStarsSection spacing='default' id='partners-map'>
          <div>
            <SectionTitle title={t('map.title')} sectionId='map' className='mb-4' />
            <ul className='text-eyebrow mb-6 flex flex-wrap gap-x-6 gap-y-2 text-black/70'>
              <li className='flex items-center gap-2'>
                <span aria-hidden='true' className='bg-green size-3 rounded-full' />
                {t('stats.national')}
              </li>
              <li className='flex items-center gap-2'>
                <span aria-hidden='true' className='bg-ink size-3 rounded-full' />
                {t('stats.international')}
              </li>
            </ul>
            <PartnersMap pins={pins} lng={lng} />
          </div>
        </HawkStarsSection>
      )}
      <HawkStarsSection spacing='default'>
        {nationalPartners.length > 0 && (
          <div id='national-partners'>
            <SectionTitle title={t('national')} sectionId='national' className='mb-8' />
            <div className={GRID}>
              {nationalPartners.map((partner, index) => (
                <PartnerCard {...partner} key={index} name={t(partner.name)} lng={lng} />
              ))}
            </div>
          </div>
        )}
        {byCountry.length > 0 && (
          <div className='mt-20' id='international-partners'>
            <SectionTitle
              title={t('international')}
              sectionId='international'
              variant='ink'
              className='mb-10'
            />
            <div className='flex flex-col gap-12'>
              {byCountry.map(([country, countryPartners]) => {
                const flag = FlagIcons[country as keyof typeof FlagIcons];
                return (
                  <section key={country} aria-labelledby={`country-${country}`}>
                    <h3
                      id={`country-${country}`}
                      className='text-h2_bold text-ink mb-5 flex items-center gap-3'
                    >
                      {flag && flag({ title: '', className: 'w-8 rounded-xs shadow-sm' })}
                      {countryLabel(country)}
                      <span className='text-eyebrow text-black/50'>
                        {t('partner_count', { count: countryPartners.length })}
                      </span>
                    </h3>
                    <div className={GRID}>
                      {countryPartners.map((partner) => (
                        <PartnerCard {...partner} key={partner.id} lng={lng} headingLevel='h4' />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </HawkStarsSection>
    </>
  );
};

export default PartnersWrapper;
