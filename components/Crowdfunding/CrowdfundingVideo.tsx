import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const CrowdfundingVideo = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='w-full bg-[#0d0d0d] py-16'>
      <div className='mx-auto flex max-w-7xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:gap-12 lg:px-8'>
        {/* Video player */}
        <div className='flex-1'>
          <div className='relative aspect-video w-full overflow-hidden rounded-2xl bg-[#1a1a1a]'>
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: "url('/images/projects/2.jpeg')" }}
            />
            <div className='absolute inset-0 bg-black/30' />

            <div className='absolute bottom-12 left-6 right-6'>
              <p className='font-oswald text-2xl font-bold uppercase text-white lg:text-3xl'>
                {t('video.overlay_line1')}
              </p>
              <p className='font-oswald text-2xl font-bold uppercase text-orange-500 lg:text-3xl'>
                {t('video.overlay_line2')}
              </p>
            </div>

            <div className='absolute inset-0 flex items-center justify-center'>
              <button className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/30'>
                <svg className='ml-1 h-8 w-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>

            <div className='absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2'>
              <div className='flex items-center gap-3 text-sm text-white'>
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>0:00 / 3:24</span>
                <div className='flex-1' />
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className='flex flex-1 flex-col gap-5'>
          <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
            <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
            {t('video.badge')}
          </span>

          <h2 className='font-oswald text-2xl font-bold text-white lg:text-3xl'>
            {t('video.title')}
          </h2>

          <p className='text-base leading-relaxed text-gray-400'>{t('video.description')}</p>

          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-5 py-3'>
              <svg className='h-5 w-5 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <div>
                <p className='text-xs font-semibold tracking-wider text-gray-500 uppercase'>
                  {t('video.duration_label')}
                </p>
                <p className='font-bold text-white'>{t('video.duration_value')}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-[#1a1a1a] px-5 py-3'>
              <svg className='h-5 w-5 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <div>
                <p className='text-xs font-semibold tracking-wider text-gray-500 uppercase'>
                  {t('video.tagline_label')}
                </p>
                <p className='font-bold text-white'>{t('video.tagline_value')}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-3 pt-2'>
            <button className='flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
              </svg>
              {t('video.cta_support')}
            </button>
            <button className='flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10'>
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
              </svg>
              {t('video.cta_share')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingVideo;
