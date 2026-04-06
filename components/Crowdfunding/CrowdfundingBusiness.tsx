import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const benefitIcons = [
  <svg key='impact' className='h-12 w-12' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' />
  </svg>,
  <svg key='reputation' className='h-12 w-12' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' />
  </svg>,
  <svg key='transparency' className='h-12 w-12' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' />
  </svg>,
] as const;

const benefitKeys = ['impact', 'reputation', 'transparency'] as const;

const CrowdfundingBusiness = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='w-full bg-[#0d0d0d] py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 lg:p-12'>
          <div className='flex flex-col gap-10 lg:flex-row lg:items-start'>
            <div className='flex-1'>
              <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
                <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
                {t('business.badge')}
              </span>
              <h2 className='font-oswald mt-4 text-2xl font-bold text-white lg:text-3xl'>
                {t('business.title_prefix')}{' '}
                <span className='text-orange-500'>{t('business.title_highlight')}</span>
              </h2>
              <p className='mt-4 text-sm leading-relaxed text-gray-400'>{t('business.description')}</p>
              <button className='mt-6 flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'>
                {t('business.cta')}
              </button>
            </div>

            <div className='flex flex-1 flex-col gap-6 lg:flex-row'>
              {benefitKeys.map((key, index) => (
                <div key={key} className='flex flex-1 flex-col items-center text-center'>
                  <div className='mb-3 text-orange-500'>{benefitIcons[index]}</div>
                  <h3 className='mb-2 text-sm font-bold text-white uppercase'>
                    {t(`business.benefits.${key}.title`)}
                  </h3>
                  <p className='text-xs leading-relaxed text-gray-400'>
                    {t(`business.benefits.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-8 flex items-start gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] px-5 py-3'>
            <svg className='mt-0.5 h-4 w-4 shrink-0 text-gray-500' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
            </svg>
            <p className='text-xs leading-relaxed text-gray-500'>{t('business.disclaimer')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingBusiness;
