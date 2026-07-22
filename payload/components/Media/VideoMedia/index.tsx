'use client';

import React, { useEffect, useRef, useState } from 'react';

import { resolveMedia } from '../resolve';
import { getMediaUrl } from '@/payload/utilities/getMediaUrl';
import { cn } from '@/lib/utils';

type Provider = 'youtube' | 'vimeo' | 'direct';

/**
 * Normalize a video URL into an embeddable form and detect its provider.
 * YouTube and Vimeo resolve to their iframe embed URLs; everything else
 * (including Payload/Cloudinary uploads) is treated as a direct video source.
 */
const getEmbedUrl = (url: string): { embedUrl: string; provider: Provider } => {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return { embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`, provider: 'youtube' };
  }

  const vimeoRegex = /vimeo\.com\/(?:.*\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return { embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`, provider: 'vimeo' };
  }

  return { embedUrl: url, provider: 'direct' };
};

type VideoMediaProps = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
> & {
  videoClassName?: string;
};

/**
 * The single source of truth for rendering video. Handles Payload media
 * uploads (`resource`), raw/direct URLs, and YouTube/Vimeo embeds (`src`).
 * For direct videos, `autoPlay` uses an IntersectionObserver so the clip only
 * plays while on screen. Defaults suit an embedded content video
 * (`muted`, `controls`); pass explicit props for decorative background clips
 * (`autoPlay loop muted controls={false}`).
 */
export const VideoMedia: React.FC<VideoMediaProps> = (props) => {
  const {
    onClick,
    resource,
    src,
    videoClassName,
    className,
    autoPlay = false,
    loop = false,
    muted = true,
    controls = true,
    poster,
    title,
  } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!videoRef.current || !autoPlay) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        threshold: 0.5,
      }
    );
    observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!videoRef.current || !autoPlay) return;
    if (isIntersecting) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isIntersecting, autoPlay]);

  let url: string | undefined;
  if (typeof src === 'string') {
    url = getMediaUrl(src);
  } else if (resource) {
    url = resolveMedia(resource)?.url;
  }

  if (!url) return null;

  const classes = cn(videoClassName, className);
  const { embedUrl, provider } = getEmbedUrl(url);

  if (provider === 'direct') {
    return (
      <video
        ref={videoRef}
        src={embedUrl}
        className={classes}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        poster={poster}
        onClick={onClick}
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <iframe
      src={`${embedUrl}${autoPlay ? '?autoplay=1' : ''}${muted ? '&muted=1' : ''}${loop ? '&loop=1' : ''}${!controls ? '&controls=0' : ''}`}
      className={classes}
      allow='autoplay; fullscreen; picture-in-picture'
      allowFullScreen
      title={title || 'Video'}
      aria-controls={controls ? 'true' : 'false'}
    />
  );
};
