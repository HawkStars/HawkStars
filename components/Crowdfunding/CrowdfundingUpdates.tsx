import { CrowdfundingSetting, Media } from '@/payload-types';
import { TFunction } from 'i18next';

type Props = { t: TFunction<string, string> } & Pick<CrowdfundingSetting, 'updateCardImages'>;

const defaultImages = [
  '/images/projects/3.jpeg',
  '/images/projects/4.jpeg',
  '/images/projects/5.jpeg',
  '/images/projects/6.jpeg',
];

const updateCardsMeta = [
  { key: 'first24h', badgeKey: 'badge_highlight', badgeColor: 'bg-orange-500' },
  { key: 'unlock100k', badgeKey: null, badgeColor: '' },
  { key: 'new_reward', badgeKey: 'badge_new', badgeColor: 'bg-green-600' },
  { key: 'event', badgeKey: null, badgeColor: '' },
] as const;

const CrowdfundingUpdates = ({ t, updateCardImages }: Props) => {
  const cardImages = updateCardsMeta.map((_, index) => {
    const entry = updateCardImages?.[index];
    if (entry && typeof entry.image === 'object') {
      return (entry.image as Media)?.url || defaultImages[index];
    }
    return defaultImages[index];
  });

  return (
    <section className='w-full bg-crowdfunding-surface-alt py-16'>
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
            {updateCardsMeta.map(({ key, badgeKey, badgeColor }, index) => {
              const image = cardImages[index];
              const description = t(`updates.cards.${key}.description` as Parameters<typeof t>[0], {
                defaultValue: '',
              });
              return (
                <div
                  key={key}
                  className='flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-crowdfunding-surface transition hover:border-orange-500/30'
                >
                  <div className='relative h-36 w-full overflow-hidden'>
                    <div
                      className='h-full w-full bg-cover bg-center'
                      style={{ backgroundImage: `url('${image}')` }}
                    />
                    {badgeKey && (
                      <span
                        className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase ${badgeColor}`}
                      >
                        {t(`updates.${badgeKey}`)}
                      </span>
                    )}
                  </div>
                  <div className='flex flex-1 flex-col p-4'>
                    <h3 className='text-sm font-bold text-white'>
                      {t(`updates.cards.${key}.title` as Parameters<typeof t>[0])}
                    </h3>
                    {description && <p className='mt-1 text-xs text-gray-500'>{description}</p>}
                    <p className='mt-auto pt-3 text-[10px] font-semibold tracking-wider text-gray-600 uppercase'>
                      {t(`updates.cards.${key}.date` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
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
