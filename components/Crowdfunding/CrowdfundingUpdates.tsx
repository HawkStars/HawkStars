import { CrowdfundingSetting, Media } from '@/payload-types';
import { TFunction } from 'i18next';

type Props = { t: TFunction<string, string> } & Pick<CrowdfundingSetting, 'updateCards'>;

const defaultImage = '/images/projects/3.jpeg';

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date
    .toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
};

const CrowdfundingUpdates = ({ t, updateCards }: Props) => {
  if (!updateCards || updateCards.length === 0) return null;

  return (
    <section id='updates' className='bg-crowdfunding-surface-alt w-full py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start'>
          <div className='flex shrink-0 flex-col gap-4 lg:w-72'>
            <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
              <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
              {t('updates.badge')}
            </span>
            <h2 className='font-oswald text-2xl font-bold text-white lg:text-3xl'>
              {t('updates.title_prefix')}{' '}
              <span className='text-orange-500'>{t('updates.title_highlight')}</span>
            </h2>
            <p className='text-sm leading-relaxed text-gray-400'>{t('updates.description')}</p>
            <button className='mt-2 flex w-fit items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10'>
              {t('updates.cta_all')}
            </button>
          </div>

          <div className='flex flex-1 gap-4 overflow-x-auto pb-4'>
            {updateCards.map((card) => {
              const imageUrl =
                card.image && typeof card.image === 'object'
                  ? (card.image as Media)?.url || defaultImage
                  : defaultImage;

              const CardWrapper = card.instagramUrl ? 'a' : 'div';
              const linkProps = card.instagramUrl
                ? { href: card.instagramUrl, target: '_blank' as const, rel: 'noopener noreferrer' }
                : {};

              return (
                <CardWrapper
                  key={card.id}
                  {...linkProps}
                  className='bg-crowdfunding-surface flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 transition hover:border-orange-500/30'
                >
                  <div className='relative h-36 w-full overflow-hidden'>
                    <div
                      className='h-full w-full bg-cover bg-center'
                      style={{ backgroundImage: `url('${imageUrl}')` }}
                    />
                  </div>
                  <div className='flex flex-1 flex-col p-4'>
                    <h3 className='text-sm font-bold text-white'>{card.title}</h3>
                    <p className='mt-auto pt-3 text-[10px] font-semibold tracking-wider text-gray-600 uppercase'>
                      {formatDate(card.date)}
                    </p>
                  </div>
                </CardWrapper>
              );
            })}

            <div className='flex shrink-0 items-center'>
              <button className='flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10'>
                <svg
                  className='h-5 w-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingUpdates;
