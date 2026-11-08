import React from 'react';
import type { VideoBlock as VideoBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { VideoMedia } from '@/payload/components/Media';

type Props = VideoBlockProps & {
  className?: string;
  captionClassName?: string;
  enableGutter?: boolean;
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
    sectionId,
  } = props;

  if (!videoUrl) return null;

  return (
    <figure
      className={cn(
        'my-10 w-full',
        enableGutter && 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-0',
        className
      )}
      id={sectionId || undefined}
      data-blockid='videoBlock'
    >
      {title && (
        <h2 data-reveal='up' className='text-h2_bold mb-4'>
          {title}
        </h2>
      )}

      <div className='bg-bege-dark relative aspect-video w-full overflow-hidden rounded-xl shadow-sm'>
        <VideoMedia
          src={videoUrl}
          autoPlay={autoplay ?? false}
          loop={loop ?? false}
          muted={muted ?? true}
          controls={controls ?? true}
          title={title ?? undefined}
          videoClassName='absolute inset-0 h-full w-full'
        />
      </div>

      {caption && (
        <figcaption className={cn('text-body_regular mt-3 text-black/70', captionClassName)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
