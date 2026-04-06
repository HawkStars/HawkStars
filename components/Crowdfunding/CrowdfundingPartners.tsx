import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const entityKeys = ['hawk_stars', 'ipdj', 'politecnico', 'camara', 'guarda'] as const;
const tabKeys = ['godparents', 'partners', 'donors', 'community'] as const;
const tabIcons = ['★', '🤝', '❤', '👥'] as const;

const CrowdfundingPartners = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='w-full bg-[#111111] py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start'>
          <div className='flex shrink-0 flex-col gap-4 lg:w-80'>
            <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
              <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
              {t('partners.badge')}
            </span>
            <h2 className='font-oswald text-2xl font-bold text-white lg:text-3xl'>
              {t('partners.title_prefix')}{' '}
              <span className='text-orange-500'>{t('partners.title_highlight')}</span>{' '}
              {t('partners.title_suffix')}
            </h2>
            <p className='text-sm leading-relaxed text-gray-400'>{t('partners.description')}</p>

            <div className='mt-2 flex flex-wrap gap-2'>
              {tabKeys.map((key, index) => (
                <button
                  key={key}
                  className='flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10'
                >
                  <span className='text-orange-500'>{tabIcons[index]}</span>
                  {t(`partners.tabs.${key}`)}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-1 items-center gap-4'>
            <button className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10'>
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
              </svg>
            </button>

            <div className='flex flex-1 gap-4 overflow-x-auto pb-2'>
              {entityKeys.map((key) => {
                const subtitle = t(`partners.entities.${key}.subtitle` as Parameters<typeof t>[0], { defaultValue: '' });
                return (
                  <div
                    key={key}
                    className='flex h-28 w-44 shrink-0 flex-col items-center justify-center rounded-2xl border border-orange-500/30 bg-[#1a1a1a] p-4 text-center'
                  >
                    <p className='text-sm font-bold text-white uppercase'>
                      {t(`partners.entities.${key}.name` as Parameters<typeof t>[0])}
                    </p>
                    {subtitle && (
                      <p className='mt-1 text-[10px] leading-tight text-gray-500'>{subtitle}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <button className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10'>
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingPartners;
