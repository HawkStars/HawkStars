'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LuHeart, LuMessageCircle, LuPlay, LuLayers } from 'react-icons/lu';

import { cn } from '@/lib/utils';
import { ImageMedia } from '@/payload/components/Media';
import {
  type InstagramPost,
  type InstagramGridProps,
  INSTAGRAM_PROFILE_URL,
} from './types';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

function PostOverlay({ post }: { post: InstagramPost }) {
  return (
    <div className='absolute inset-0 flex items-center justify-center gap-6 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
      {post.likeCount !== undefined && (
        <span className='flex items-center gap-1.5 text-sm font-semibold text-white'>
          <LuHeart className='size-5 fill-white' />
          {post.likeCount.toLocaleString()}
        </span>
      )}
      {post.commentsCount !== undefined && (
        <span className='flex items-center gap-1.5 text-sm font-semibold text-white'>
          <LuMessageCircle className='size-5 fill-white' />
          {post.commentsCount.toLocaleString()}
        </span>
      )}
    </div>
  );
}

function MediaTypeIndicator({ mediaType }: { mediaType: InstagramPost['mediaType'] }) {
  if (mediaType === 'IMAGE') return null;

  return (
    <div className='absolute top-2 right-2 z-10'>
      {mediaType === 'VIDEO' && <LuPlay className='size-5 fill-white text-white drop-shadow-md' />}
      {mediaType === 'CAROUSEL_ALBUM' && <LuLayers className='size-5 text-white drop-shadow-md' />}
    </div>
  );
}

function GridSkeleton({ count, columns }: { count: number; columns: 3 | 4 }) {
  return (
    <div className={cn('grid gap-1', columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='aspect-square animate-pulse bg-neutral-200 dark:bg-neutral-800' />
      ))}
    </div>
  );
}

export default function InstagramGrid({
  maxPosts = 9,
  columns = 3,
  showOverlay = true,
}: InstagramGridProps) {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`/api/instagram?limit=${maxPosts}`);

        if (!response.ok) {
          throw new Error(t('instagram.errorFetch'));
        }

        const data = await response.json();
        if (!cancelled) setPosts(data.posts ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t('errors.generic'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [maxPosts, t]);

  if (loading) {
    return (
      <div className='mx-auto max-w-6xl'>
        <GridSkeleton count={maxPosts} columns={columns} />
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div
        className={cn(
          'mx-auto flex max-w-6xl flex-col items-center justify-center py-12 text-center'
        )}
      >
        <p className='text-muted-foreground mb-4 text-sm'>{error ?? t('instagram.empty')}</p>
        <Link
          href={INSTAGRAM_PROFILE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='text-green text-sm font-medium underline-offset-4 hover:underline'
        >
          {t('instagram.visit')}
        </Link>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <h2 className='text-h2_bold mb-8 text-center'>{t('instagram.title')}</h2>
      <div className={cn('grid lg:gap-1', columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}>
        {posts.slice(0, maxPosts).map((post) => (
          <Link
            key={post.id}
            href={post.permalink}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900'
          >
            <ImageMedia
              src={post.imageUrl}
              alt={post.caption?.slice(0, 100) ?? t('instagram.postAlt')}
              fill
              sizes={columns === 3 ? '33vw' : '25vw'}
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <MediaTypeIndicator mediaType={post.mediaType} />
            {showOverlay && <PostOverlay post={post} />}
          </Link>
        ))}
      </div>

      <div className='mt-4 flex justify-center'>
        <Link
          href={INSTAGRAM_PROFILE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='rounded-lg border border-neutral-300 px-6 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800'
        >
          {t('instagram.viewMore')}
        </Link>
      </div>
    </div>
  );
}
