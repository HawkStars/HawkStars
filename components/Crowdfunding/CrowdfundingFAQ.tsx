import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const faqIcons = [
  <svg key='how_to_support' className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20'>
    <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
  </svg>,
  <svg key='other_ways' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' />
  </svg>,
  <svg key='rewards' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' />
  </svg>,
  <svg key='goal_not_met' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' />
  </svg>,
  <svg key='transparency' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' />
  </svg>,
  <svg key='companies' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z' />
  </svg>,
  <svg key='abroad' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' />
  </svg>,
  <svg key='receipt' className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={1.5}>
    <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' />
  </svg>,
] as const;

const faqKeys = [
  'how_to_support',
  'other_ways',
  'rewards',
  'goal_not_met',
  'transparency',
  'companies',
  'abroad',
  'receipt',
] as const;

const CrowdfundingFAQ = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='relative w-full overflow-hidden bg-[#0d0d0d] py-16'>
      <div
        className='absolute top-0 right-0 h-full w-1/3 bg-cover bg-center opacity-20'
        style={{ backgroundImage: "url('/images/projects/7.jpeg')" }}
      />
      <div className='absolute top-0 right-0 h-full w-1/3 bg-gradient-to-r from-[#0d0d0d] to-transparent' />

      <div className='relative mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='mb-12'>
          <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
            <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
            {t('faq.badge')}
          </span>
          <h2 className='font-oswald mt-4 text-3xl font-bold text-white lg:text-4xl'>
            {t('faq.title_line1')}
            <br />
            <span className='text-orange-500'>{t('faq.title_highlight')}</span>{' '}
            {t('faq.title_line2')}
          </h2>
          <p className='mt-4 max-w-2xl text-sm leading-relaxed text-gray-400'>
            {t('faq.description_prefix')}{' '}
            <span className='text-orange-500'>Global Village</span>.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {faqKeys.map((key, index) => (
            <div
              key={key}
              className='group flex flex-col rounded-2xl border border-white/10 bg-[#1a1a1a] p-5 transition hover:border-orange-500/30'
            >
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-orange-500'>
                  {faqIcons[index]}
                </div>
                <button className='flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-500 transition group-hover:border-orange-500/30 group-hover:text-orange-500'>
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                  </svg>
                </button>
              </div>
              <h3 className='mb-2 text-sm font-bold text-white'>
                {t(`faq.items.${key}.question`)}
              </h3>
              <p className='text-xs leading-relaxed text-gray-500'>
                {t(`faq.items.${key}.answer`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingFAQ;
