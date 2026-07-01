'use client';

import { useCallback, useState } from 'react';

type Props = {
  videoUrl: string;
  thumbnailUrl: string;
  overlayLine1: string;
  overlayLine2: string;
};

/**
 * Converts a YouTube or Vimeo URL into an embeddable URL.
 * Returns null if the URL format is not recognised.
 */
function toEmbedUrl(url: string): string | null {
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null;
}

export const VideoEmbed = ({ videoUrl, thumbnailUrl, overlayLine1, overlayLine2 }: Props) => {
  const [playing, setPlaying] = useState(false);

  const embedUrl = toEmbedUrl(videoUrl);

  const handlePlay = useCallback(() => {
    if (embedUrl) {
      setPlaying(true);
    } else {
      // Fallback: open in new tab if URL format is not embeddable
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  }, [embedUrl, videoUrl]);

  return (
    <div className='bg-crowdfunding-surface relative aspect-video w-full overflow-hidden rounded-2xl'>
      {playing && embedUrl ? (
        <iframe
          src={embedUrl}
          className='absolute inset-0 h-full w-full'
          allow='autoplay; encrypted-media; picture-in-picture'
          allowFullScreen
          title='Video'
        />
      ) : (
        <>
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url('${thumbnailUrl}')` }}
          />
          <div className='absolute inset-0 bg-black/30' />

          <div className='absolute right-6 bottom-12 left-6'>
            <p className='font-oswald text-2xl font-bold text-white uppercase lg:text-3xl'>
              {overlayLine1}
            </p>
            <p className='font-oswald text-2xl font-bold text-orange-500 uppercase lg:text-3xl'>
              {overlayLine2}
            </p>
          </div>

          <div className='absolute inset-0 flex items-center justify-center'>
            <button
              onClick={handlePlay}
              className='flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm transition'
              aria-label='Play video'
            >
              <svg className='ml-1 h-16 w-16 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>

          <div className='absolute right-0 bottom-0 left-0 bg-black/50 px-4 py-2'>
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
        </>
      )}
    </div>
  );
};

export default VideoEmbed;
