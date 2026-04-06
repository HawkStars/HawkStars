import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const CrowdfundingHero = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  const raised = 32450;
  const campaignGoal = 100000;
  const projectGoal = 900000;
  const percentage = Math.round((raised / campaignGoal) * 100);

  const tags = [
    { key: 'location', icon: 'pin' },
    { key: 'education', icon: 'book' },
    { key: 'innovation', icon: 'star' },
  ] as const;

  return (
    <section className='relative w-full overflow-hidden bg-[#0d0d0d]'>
      <div
        className='absolute inset-0 bg-cover bg-center opacity-30'
        style={{ backgroundImage: "url('/images/projects/1.jpeg')" }}
      />
      <div className='absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent' />

      <div className='relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-24'>
        {/* Left content */}
        <div className='flex flex-1 flex-col gap-6'>
          <span className='font-oswald w-fit rounded bg-orange-500 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase'>
            {t('hero.badge')}
          </span>

          <h1 className='font-oswald text-4xl leading-tight font-bold text-white lg:text-6xl'>
            {t('hero.title_prefix')}{' '}
            <span className='text-orange-500'>Global Village</span>{' '}
            {t('hero.title_suffix')}
          </h1>

          <p className='max-w-xl text-base leading-relaxed text-gray-300 lg:text-lg'>
            {t('hero.subtitle')}
          </p>

          <div className='flex flex-wrap gap-3'>
            <button className='flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
              </svg>
              {t('hero.cta_support')}
            </button>
            <button className='flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                  clipRule='evenodd'
                />
              </svg>
              {t('hero.cta_video')}
            </button>
          </div>

          <div className='flex items-start gap-2 text-sm text-gray-400'>
            <svg className='mt-0.5 h-4 w-4 shrink-0 text-orange-500' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <span>{t('hero.disclaimer')}</span>
          </div>

          <div className='flex flex-wrap gap-2'>
            {tags.map(({ key, icon }) => (
              <span
                key={key}
                className='flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-sm text-white'
              >
                {icon === 'pin' && (
                  <svg className='h-3 w-3 text-orange-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                  </svg>
                )}
                {icon === 'book' && (
                  <svg className='h-3 w-3 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                  </svg>
                )}
                {icon === 'star' && (
                  <svg className='h-3 w-3 text-orange-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                )}
                {t(`hero.tags.${key}`)}
              </span>
            ))}
          </div>
        </div>

        {/* Right - Funding stats card */}
        <div className='w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/90 p-6 backdrop-blur-sm lg:w-[420px]'>
          <p className='mb-1 text-xs font-semibold tracking-wider text-gray-400 uppercase'>
            {t('hero.stats.raised_label')}
          </p>
          <div className='flex items-baseline gap-3'>
            <h2 className='text-4xl font-bold text-white'>€ 32.450</h2>
            <span className='text-lg font-bold text-orange-500'>{percentage}%</span>
            <span className='text-xs text-gray-400'>{t('hero.stats.percentage_label')}</span>
          </div>

          <div className='mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10'>
            <div
              className='h-full rounded-full bg-orange-500 transition-all duration-1000'
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className='mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-4'>
            <div>
              <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                {t('hero.stats.campaign_goal_label')}
              </p>
              <p className='mt-1 text-lg font-bold text-white'>
                € {campaignGoal.toLocaleString('pt-PT')}
              </p>
            </div>
            <div>
              <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                {t('hero.stats.project_goal_label')}
              </p>
              <p className='mt-1 text-lg font-bold text-white'>
                € {projectGoal.toLocaleString('pt-PT')}
              </p>
            </div>
            <div>
              <p className='text-[10px] font-semibold tracking-wider text-gray-500 uppercase'>
                {t('hero.stats.last_update_label')}
              </p>
              <p className='mt-1 text-sm font-medium text-white'>{t('hero.stats.last_update_date')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingHero;
