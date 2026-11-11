import { TFunction } from 'i18next';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { CfSection, Container, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string> };

/** Spaces of the ITC (Global Village 2026 presentation, §4) with the architectural renders. */
const SPACES = [
  { key: 'training', image: '/images/training_center/meeting_3.jpg', wide: true },
  { key: 'auditorium', image: '/images/training_center/meeting_1.jpg' },
  { key: 'coworking', image: '/images/training_center/cowork4.jpg' },
  { key: 'gaming', image: '/images/training_center/gaming1.jpg' },
  { key: 'studio', image: '/images/training_center/recording1.jpg' },
  { key: 'cafe', image: '/images/training_center/restaurant2.jpg', wide: true },
] as const;

const CrowdfundingSpaces = ({ t }: Props) => (
  <CfSection id='spaces' alt>
    <Container>
      <div className='mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
        <div className='flex max-w-2xl flex-col gap-5'>
          <SectionEyebrow>{t('spaces.badge')}</SectionEyebrow>
          <h2 className='text-h2_semibold text-white'>
            {t('spaces.title_prefix')} <Highlight>{t('spaces.title_highlight')}</Highlight>
          </h2>
        </div>
        <p className='text-crowdfunding-muted max-w-md text-sm leading-relaxed'>
          {t('spaces.description')}
        </p>
      </div>

      <ul className='grid auto-rows-64 gap-4 sm:grid-cols-2 lg:auto-rows-72 lg:grid-cols-4'>
        {SPACES.map(({ key, image, ...rest }) => (
          <li
            key={key}
            className={cn(
              'group border-crowdfunding-line relative overflow-hidden rounded-xl border',
              'wide' in rest && rest.wide && 'lg:col-span-2'
            )}
          >
            <ImageMedia
              src={image}
              alt=''
              fill
              sizes='(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw'
              className='object-cover transition-transform duration-700 group-hover:scale-105'
            />
            <div className='from-crowdfunding-bg via-crowdfunding-bg/60 absolute inset-0 bg-linear-to-t to-transparent' />
            <div className='absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5'>
              <h3 className='text-h3_semibold text-white'>{t(`spaces.items.${key}.title`)}</h3>
              <p className='text-sm leading-snug text-white/75'>
                {t(`spaces.items.${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className='text-crowdfunding-muted mt-8 text-sm'>{t('spaces.footnote')}</p>
    </Container>
  </CfSection>
);

export default CrowdfundingSpaces;
