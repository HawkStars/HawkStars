'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { VideoBlock as VideoBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

type Props = VideoBlockProps & {
  className?: string;
  captionClassName?: string;
  enableGutter?: boolean;
};

const getEmbedUrl = (
  url: string
): { embedUrl: string; provider: 'youtube' | 'vimeo' | 'direct' } => {
  // YouTube patterns
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      provider: 'youtube',
    };
  }

  // Vimeo patterns
  const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      provider: 'vimeo',
    };
  }

  // Direct video URL
  return {
    embedUrl: url,
    provider: 'direct',
  };
};

export const VideoBlock: React.FC<Props> = (props) => {
  const {
    videoUrl,
    title,
    caption,
    autoplay = false,
    loop = false,
    muted = true,
    controls = true,
    className,
    captionClassName,
    enableGutter = true,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!videoRef.current || !autoplay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [autoplay]);

  useEffect(() => {
    if (videoRef.current && autoplay) {
      if (isIntersecting) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isIntersecting, autoplay]);

  if (!videoUrl) return null;

  const { embedUrl, provider } = getEmbedUrl(videoUrl);

  return (
    <div
      className={cn(
        'mx-auto my-8',
        {
          container: enableGutter,
        },
        className
      )}
    >
      <div className='w-full'>
        {title && <h3 className='text-h3_semibold mb-4'>{title}</h3>}

        <div
          className='border-border relative w-full overflow-hidden rounded-lg border'
          style={{ paddingBottom: '56.25%' }}
        >
          {provider === 'direct' ? (
            <video
              ref={videoRef}
              src={embedUrl}
              className='absolute top-0 left-0 h-full w-full'
              controls={controls || false}
              autoPlay={autoplay || false}
              loop={loop || false}
              muted={muted || false}
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={`${embedUrl}${autoplay ? '?autoplay=1' : ''}${muted ? '&muted=1' : ''}${loop ? '&loop=1' : ''}${!controls ? '&controls=0' : ''}`}
              className='absolute top-0 left-0 h-full w-full'
              allow='autoplay; fullscreen; picture-in-picture'
              allowFullScreen
              title={title || 'Video'}
              aria-controls={controls ? 'true' : 'false'}
            />
          )}
        </div>

        {caption && (
          <p className={cn('text-muted-foreground mt-4 text-sm', captionClassName)}>{caption}</p>
        )}
      </div>
    </div>
  );
};
