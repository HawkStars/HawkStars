import { TFunction } from 'i18next';
import { CrowdfundingSetting } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { CfSection, Container, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string> } & Pick<CrowdfundingSetting, 'supporters'>;

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

/** Online donors wall. The contributed `value` is internal and intentionally not rendered. */
const CrowdfundingPartners = ({ t, supporters }: Props) => {
  const list = supporters ?? [];
  // Entities first: logos read better at the top of the wall.
  const sorted = [...list].sort(
    (a, b) => Number(b.type === 'entity') - Number(a.type === 'entity')
  );

  return (
    <CfSection id='supporters' alt>
      <Container>
        <div className='mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex max-w-2xl flex-col gap-5'>
            <SectionEyebrow>{t('partners.badge')}</SectionEyebrow>
            <h2 className='text-h2_semibold text-white'>
              {t('partners.title_prefix')} <Highlight>{t('partners.title_highlight')}</Highlight>{' '}
              {t('partners.title_suffix')}
            </h2>
          </div>
          <p className='text-crowdfunding-muted max-w-md text-sm leading-relaxed'>
            {t('partners.description')}
          </p>
        </div>

        {sorted.length > 0 ? (
          <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
            {sorted.map((supporter, index) => (
              <li
                key={supporter.id ?? index}
                className='bg-crowdfunding-surface border-crowdfunding-line flex items-center gap-3 rounded-xl border p-3'
              >
                {typeof supporter.logo === 'object' && supporter.logo ? (
                  <ImageMedia
                    resource={supporter.logo}
                    alt=''
                    width={40}
                    height={40}
                    className='size-10 shrink-0 rounded-full bg-white object-contain'
                  />
                ) : (
                  <span
                    aria-hidden='true'
                    className='bg-crowdfunding-accent/15 text-crowdfunding-accent flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold'
                  >
                    {getInitials(supporter.name)}
                  </span>
                )}
                <span className='min-w-0 text-sm leading-tight font-medium text-white'>
                  {supporter.name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-crowdfunding-muted text-sm'>{t('partners.no_supporters')}</p>
        )}
      </Container>
    </CfSection>
  );
};

export default CrowdfundingPartners;
