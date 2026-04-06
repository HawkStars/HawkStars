import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const CrowdfundingCTA = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='relative w-full overflow-hidden bg-[#0d0d0d]'>
      <div
        className='absolute inset-0 bg-cover bg-center opacity-40'
        style={{ backgroundImage: "url('/images/projects/8.jpeg')" }}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-[#0d0d0d]/80' />

      <div className='relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32'>
        <h2 className='font-oswald text-3xl font-bold text-white lg:text-5xl'>
          {t('cta.title_line1')}
          <br />
          <span className='text-orange-500'>{t('cta.title_highlight')}</span>
        </h2>
        <p className='mt-4 max-w-lg text-base leading-relaxed text-gray-300'>
          {t('cta.description')}
        </p>

        <div className='mt-8 flex flex-wrap gap-4'>
          <button className='flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600'>
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
            </svg>
            {t('cta.cta_support')}
          </button>
          <button className='flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10'>
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
            </svg>
            {t('cta.cta_share')}
          </button>
          <button className='flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10'>
            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
            {t('cta.cta_team')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingCTA;
