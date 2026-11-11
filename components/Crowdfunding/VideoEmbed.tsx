'use client';

import { useCallback, useState } from 'react';
import { LuPlay } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { ImageMedia, VideoMedia } from '@/payload/components/Media';

type Props = {
  videoUrl: string;
  thumbnailUrl: string;
  overlayLine1: string;
  overlayLine2: string;
};

/**
 * Poster first, player on click — the iframe (and its third-party requests) only
 * loads once the visitor asks for it. Playback itself goes through `VideoMedia`,
 * which handles YouTube/Vimeo/direct URLs.
 */
export const VideoEmbed = ({ videoUrl, thumbnailUrl, overlayLine1, overlayLine2 }: Props) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'crowdfunding');
  const [playing, setPlaying] = useState(false);
  const play = useCallback(() => setPlaying(true), []);

  return (
    <div className='bg-crowdfunding-surface border-crowdfunding-line relative aspect-video w-full overflow-hidden rounded-xl border shadow-lg'>
      {playing ? (
        <VideoMedia
          src={videoUrl}
          autoPlay
          controls
          title={t('video.player_title')}
          videoClassName='h-full w-full'
        />
      ) : (
        <button
          type='button'
          onClick={play}
          aria-label={t('video.play')}
          className='group absolute inset-0 cursor-pointer text-left'
        >
          <ImageMedia
            src={thumbnailUrl}
            alt=''
            fill
            sizes='(min-width: 1024px) 60vw, 100vw'
            className='object-cover'
          />
          <span className='from-crowdfunding-bg/90 absolute inset-0 bg-linear-to-t to-transparent' />
          <span className='absolute inset-0 flex items-center justify-center'>
            <span className='bg-crowdfunding-accent-strong flex size-20 items-center justify-center rounded-full text-white shadow-[0_0_60px_-10px_var(--color-crowdfunding-glow)] transition-transform group-hover:scale-110'>
              <LuPlay aria-hidden='true' className='ml-1 size-8 fill-current' />
            </span>
          </span>
          <span className='font-display absolute bottom-6 left-6 flex flex-col text-2xl font-semibold uppercase lg:text-3xl'>
            <span className='text-white'>{overlayLine1}</span>
            <span className='text-crowdfunding-accent'>{overlayLine2}</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoEmbed;
