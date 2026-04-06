import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const tierIcons = [
  <svg key='simple' className='h-8 w-8' fill='currentColor' viewBox='0 0 20 20'>
    <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
  </svg>,
  <svg
    key='recognition'
    className='h-8 w-8'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z'
    />
  </svg>,
  <svg key='experiences' className='h-8 w-8' fill='currentColor' viewBox='0 0 20 20'>
    <path
      fillRule='evenodd'
      d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
      clipRule='evenodd'
    />
  </svg>,
  <svg
    key='premium'
    className='h-8 w-8'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-7.54 0'
    />
  </svg>,
] as const;

const tierKeys = ['simple', 'recognition', 'experiences', 'premium'] as const;

const tierItemKeys = {
  simple: ['digital_thanks', 'tshirt', 'basket', 'polaroid', 'windbreaker'],
  recognition: ['brick_wall', 'name_walls', 'chairs'],
  experiences: ['guided_tour', 'pinhel_crawl', 'weekend', 'faia_brava', 'masterclasses'],
  premium: ['meeting_rooms', 'training_rooms', 'auditorium', 'coworking', 'naming_itc'],
} as const;

const stepKeys = ['step1', 'step2', 'step3'] as const;

const CrowdfundingRewards = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='w-full bg-[#0d0d0d] py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex-1'>
            <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
              <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
              {t('rewards.badge')}
            </span>
            <h2 className='font-oswald mt-4 text-2xl font-bold text-white lg:text-3xl'>
              {t('rewards.title_prefix')}{' '}
              <span className='text-orange-500'>{t('rewards.title_highlight')}</span>
            </h2>
          </div>
          <p className='max-w-md text-sm leading-relaxed text-gray-400 lg:mt-10'>
            {t('rewards.description')}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {tierKeys.map((tierKey, index) => (
            <div
              key={tierKey}
              className='flex flex-col rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 transition hover:border-orange-500/30'
            >
              <div className='mb-3 text-orange-500'>{tierIcons[index]}</div>
              <h3 className='text-sm font-bold text-white uppercase'>
                {t(`rewards.tiers.${tierKey}.title`)}
              </h3>
              <p className='mb-4 text-xs text-gray-500'>{t(`rewards.tiers.${tierKey}.subtitle`)}</p>
              <div className='flex flex-col gap-2'>
                {tierItemKeys[tierKey].map((itemKey) => {
                  const price = t(`rewards.tiers.${tierKey}.items.${itemKey}.price`);
                  const label = t(`rewards.tiers.${tierKey}.items.${itemKey}.label`);
                  return (
                    <div key={itemKey} className='flex items-start gap-2 text-sm'>
                      <svg
                        className='mt-0.5 h-3 w-3 shrink-0 text-orange-500'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
                      </svg>
                      <span className='text-gray-300'>
                        {price && <strong className='text-white'>{price}</strong>}
                        {price ? ' ' : ''}
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className='mt-12 rounded-2xl border border-white/10 bg-[#1a1a1a] p-6'>
          <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
            <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
            {t('rewards.how_to_badge')}
          </span>

          <div className='mt-6 flex flex-col items-center gap-4 lg:flex-row'>
            {stepKeys.map((stepKey, index) => (
              <React.Fragment key={stepKey}>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-500 text-sm font-bold text-orange-500'>
                    {index + 1}
                  </div>
                  <p className='text-sm text-gray-300'>{t(`rewards.steps.${stepKey}`)}</p>
                </div>
                {index < stepKeys.length - 1 && (
                  <svg
                    className='hidden h-4 w-4 shrink-0 text-gray-600 lg:block'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}

            <button className='ml-auto flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'>
              {t('rewards.cta_all')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingRewards;
