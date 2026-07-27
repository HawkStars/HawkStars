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
    <div
      className={cn(
        'mx-auto my-8',
        {
          container: enableGutter,
        },
        className
      )}
      id={sectionId || undefined}
      data-blockid='videoBlock'
    >
      <div className='w-full'>
        {title && <h3 className='text-h3_semibold mb-4'>{title}</h3>}

        <div
          className='border-border relative w-full overflow-hidden rounded-lg border'
          style={{ paddingBottom: '56.25%' }}
        >
          <VideoMedia
            src={videoUrl}
            autoPlay={autoplay ?? false}
            loop={loop ?? false}
            muted={muted ?? false}
            controls={controls ?? false}
            title={title ?? undefined}
            videoClassName='absolute top-0 left-0 h-full w-full'
          />
        </div>

        {caption && (
          <p className={cn('text-muted-foreground mt-4 text-sm', captionClassName)}>{caption}</p>
        )}
      </div>
    </div>
  );
};
