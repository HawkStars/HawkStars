import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';
import { CrowdfundingSetting } from '@/payload-types';
import { TFunction } from 'i18next';

type Props = { t: TFunction<string, string>; lng: Language } & Pick<
  CrowdfundingSetting,
  | 'raisedAmount'
  | 'campaignGoal'
  | 'projectGoal'
  | 'weeklyIncrease'
  | 'lastUpdateDate'
  | 'phases'
  | 'transparencyDocUrl'
>;

const CrowdfundingTransparency = ({
  t,
  raisedAmount,
  campaignGoal,
  projectGoal,
  weeklyIncrease,
  lastUpdateDate,
  phases,
  transparencyDocUrl,
  lng,
}: Props) => {
  const phaseKeys = phases;
  const percentage = Math.round((raisedAmount / campaignGoal) * 100);

  return (
    <section id='transparency' className='bg-crowdfunding-surface-alt w-full py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16'>
          {/* Left text */}
          <div className='flex-1'>
            <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
              <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
              {t('transparency.badge')}
            </span>
            <h2 className='font-oswald mt-4 text-2xl font-bold text-white lg:text-3xl'>
              {t('transparency.title')}
            </h2>
            <p className='mt-4 text-sm leading-relaxed text-gray-400'>
              {t('transparency.description')}
            </p>
            {transparencyDocUrl ? (
              <a
                href={transparencyDocUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-4 inline-block text-sm font-semibold text-orange-500 transition hover:text-orange-400'
              >
                {t('transparency.cta_money')}
              </a>
            ) : (
              <span className='mt-4 inline-block text-sm font-semibold text-orange-500'>
                {t('transparency.cta_money')}
              </span>
            )}
          </div>

          {/* Right stats */}
          <div className='bg-crowdfunding-surface flex-1 rounded-2xl border border-white/10 p-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <div>
                <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                  {t('transparency.raised_label')}
                </p>
                <p className='mt-1 text-2xl font-bold text-white'>
                  € {(raisedAmount ?? 0).toLocaleString(lng === 'pt' ? 'pt-PT' : 'en-GB')}
                </p>
                <p className='mt-1 flex items-center gap-1 text-xs text-green-500'>
                  <svg className='h-3 w-3' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {weeklyIncrease || t('transparency.weekly_increase')}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                  {t('transparency.campaign_goal_label')}
                </p>
                <p className='mt-1 text-2xl font-bold text-white'>
                  € {(campaignGoal ?? 0).toLocaleString(lng === 'pt' ? 'pt-PT' : 'en-GB')}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                  {percentage}
                  {t('transparency.percentage_label')}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                  {t('transparency.project_goal_label')}
                </p>
                <p className='mt-1 text-2xl font-bold text-white'>
                  € {(projectGoal ?? 0).toLocaleString(lng === 'pt' ? 'pt-PT' : 'en-GB')}
                </p>
                <p className='mt-1 text-xs text-gray-500'>
                  {t('transparency.project_total_label')}
                </p>
              </div>
              <div>
                <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                  {t('transparency.last_update_label')}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <svg
                    className='h-5 w-5 text-orange-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                    />
                  </svg>
                  <p className='text-sm font-medium text-white'>
                    {lastUpdateDate || t('transparency.last_update_date')}
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10'>
              <div
                className='h-full rounded-full bg-orange-500 transition-all duration-1000'
                style={{ width: `${percentage}%` }}
              />
            </div>

            {phaseKeys && phaseKeys?.length > 0 && (
              <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {phaseKeys.map((phase, index) => (
                  <div
                    key={phase.id}
                    className='bg-crowdfunding-bg flex flex-col gap-3 rounded-xl border border-white/10 px-4 py-3'
                  >
                    <div className='flex'>
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
                          { 'border-orange-500 text-orange-500': !phase.completed },
                          { 'border-green text-green': phase.completed }
                        )}
                      >
                        {index + 1}
                      </div>
                      <p className='my-auto ml-2 text-sm font-bold text-white'>{phase.title}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingTransparency;
