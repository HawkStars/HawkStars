import { CrowdfundingSetting, Media } from '@/payload-types';
import { ShareButton } from './ShareButton';
import { VideoEmbed } from './VideoEmbed';
import { TFunction } from 'i18next';

type Props = { t: TFunction<string, string> } & Pick<
  CrowdfundingSetting,
  'videoUrl' | 'videoThumbnail' | 'supportUrl'
>;

const CrowdfundingVideo = ({ t, videoUrl, videoThumbnail, supportUrl }: Props) => {
  const videoThumbnailUrl =
    typeof videoThumbnail === 'object'
      ? (videoThumbnail as Media)?.url
      : videoThumbnail || '/images/projects/2.jpeg';
  const videoUrlFinal = videoUrl || null;

  return (
    <section id='video' className='bg-crowdfunding-bg w-full py-16'>
      <div className='mx-auto flex max-w-7xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:gap-12 lg:px-8'>
        {/* Video player */}
        <div className='flex-1'>
          {videoUrlFinal ? (
            <VideoEmbed
              videoUrl={videoUrlFinal}
              thumbnailUrl={videoThumbnailUrl ?? ''}
              overlayLine1={t('video.overlay_line1')}
              overlayLine2={t('video.overlay_line2')}
            />
          ) : (
            <div className='relative aspect-video w-full overflow-hidden rounded-2xl bg-[#1a1a1a]'>
              <div
                className='absolute inset-0 bg-cover bg-center'
                style={{ backgroundImage: `url('${videoThumbnailUrl}')` }}
              />
              <div className='absolute inset-0 bg-black/30' />
              <div className='absolute right-6 bottom-12 left-6'>
                <p className='font-oswald text-2xl font-bold text-white uppercase lg:text-3xl'>
                  {t('video.overlay_line1')}
                </p>
                <p className='font-oswald text-2xl font-bold text-orange-500 uppercase lg:text-3xl'>
                  {t('video.overlay_line2')}
                </p>
              </div>
            </div>
          )}
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
              <svg
                className='h-5 w-5 text-orange-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
                />
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
            <a
              href={supportUrl || '#support'}
              className='flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600'
            >
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
              </svg>
              {t('video.cta_support')}
            </a>
            <ShareButton label={t('video.cta_share')} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingVideo;
