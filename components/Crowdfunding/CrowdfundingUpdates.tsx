import { TFunction } from 'i18next';
import { LuArrowUpRight } from 'react-icons/lu';
import { CrowdfundingSetting } from '@/payload-types';
import { Language } from '@/i18n/settings';
import { formatDate } from '@/utils/date';
import { ImageMedia } from '@/payload/components/Media';
import { CfSection, Container, Highlight, SectionEyebrow } from './ui';

type Props = { t: TFunction<string, string>; lng: Language } & Pick<
  CrowdfundingSetting,
  'updateCards'
>;

const FALLBACK_IMAGE = '/images/training_center/cowork1.jpg';
const CARD_CLASS =
  'group bg-crowdfunding-surface border-crowdfunding-line hover:border-crowdfunding-accent/40 flex h-full flex-col overflow-hidden rounded-xl border transition-colors';

const CrowdfundingUpdates = ({ t, updateCards, lng }: Props) => {
  if (!updateCards || updateCards.length === 0) return null;

  // Newest first, whatever order editors added them in.
  const cards = [...updateCards].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <CfSection id='updates'>
      <Container>
        <div className='mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex max-w-2xl flex-col gap-5'>
            <SectionEyebrow>{t('updates.badge')}</SectionEyebrow>
            <h2 className='text-h2_semibold text-white'>
              {t('updates.title_prefix')} <Highlight>{t('updates.title_highlight')}</Highlight>
            </h2>
          </div>
          <p className='text-crowdfunding-muted max-w-md text-sm leading-relaxed'>
            {t('updates.description')}
          </p>
        </div>

        <ul className='-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0'>
          {cards.map((card, index) => {
            const body = (
              <>
                <div className='relative aspect-4/3 w-full overflow-hidden'>
                  <ImageMedia
                    resource={
                      typeof card.image === 'object' && card.image ? card.image : FALLBACK_IMAGE
                    }
                    alt=''
                    fill
                    sizes='(min-width: 1024px) 25vw, 75vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                </div>
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <time dateTime={card.date} className='text-eyebrow text-crowdfunding-accent'>
                    {formatDate(card.date, lng, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                  <h3 className='font-semibold text-white'>{card.title}</h3>
                  {card.instagramUrl && (
                    <span className='text-crowdfunding-muted mt-auto inline-flex items-center gap-1 text-xs'>
                      {t('updates.instagram')}
                      <LuArrowUpRight aria-hidden='true' className='size-3.5' />
                    </span>
                  )}
                </div>
              </>
            );
            return (
              <li key={card.id ?? index} className='w-72 shrink-0 snap-start lg:w-auto'>
                {card.instagramUrl ? (
                  <a
                    href={card.instagramUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={CARD_CLASS}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={CARD_CLASS}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </CfSection>
  );
};

export default CrowdfundingUpdates;
