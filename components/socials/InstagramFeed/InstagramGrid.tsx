'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuHeart, LuMessageCircle, LuPlay, LuLayers } from 'react-icons/lu';

import { cn } from '@/lib/utils';
import { type InstagramPost, type InstagramGridProps, INSTAGRAM_PROFILE_URL } from './types';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import getInstagramPosts from '@/lib/instagram';

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

export default function InstagramGrid({
  maxPosts = 9,
  columns = 3,
  showOverlay = true,
}: InstagramGridProps) {
  const lng = useLanguageCookie();
  const { i18n } = useTranslation(lng, 'common');

  const posts = use(getInstagramPosts(maxPosts));

  return (
    <div className='mx-auto max-w-6xl'>
      <h2 className='text-h2_bold mb-8 text-center'>{i18n.t('instagram')}</h2>
      <div className={cn('grid lg:gap-1', columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}>
        {posts.slice(0, maxPosts).map((post) => (
          <Link
            key={post.id}
            href={post.permalink}
            target='_blank'
            rel='noopener noreferrer'
            className='group relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900'
          >
            <Image
              src={post.imageUrl}
              alt={post.caption?.slice(0, 100) ?? 'Instagram post'}
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
          View more on Instagram
        </Link>
      </div>
    </div>
  );
}
