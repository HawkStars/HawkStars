'use client';

import { useEffect, useRef, useCallback, use } from 'react';
import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';
import { LuExternalLink } from 'react-icons/lu';

import { cn } from '@/lib/utils';
import { type InstagramEmbedWidgetProps, INSTAGRAM_PROFILE_URL, INSTAGRAM_HANDLE } from './types';

import InstagramIcon from '@/public/images/icons/socials/instagram.svg';
import getInstagramPosts from '@/lib/instagram';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

function useInstagramEmbed() {
  const loaded = useRef(false);

  const loadScript = useCallback(() => {
    if (loaded.current || typeof window === 'undefined') return;

    if (window.instgrm) {
      loaded.current = true;
      window.instgrm.Embeds.process();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      loaded.current = true;
      window.instgrm?.Embeds.process();
    };
    document.body.appendChild(script);
  }, []);

  const reprocess = useCallback(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return { loadScript, reprocess };
}

function EmbedPost({ permalink }: { permalink: string }) {
  return (
    <blockquote
      className='instagram-media'
      data-instgrm-captioned
      data-instgrm-permalink={permalink}
      data-instgrm-version='14'
      style={{
        background: '#FFF',
        border: 0,
        borderRadius: '3px',
        boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
        margin: '1px',
        maxWidth: '540px',
        minWidth: '326px',
        padding: 0,
        width: 'calc(100% - 2px)',
      }}
    />
  );
}

function WidgetHeader() {
  return (
    <div className='flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700'>
      <div className='flex size-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5'>
        <div className='flex size-full items-center justify-center rounded-full bg-white dark:bg-neutral-900'>
          <ImageMedia src={InstagramIcon} alt='Instagram' width={20} height={20} />
        </div>
      </div>
      <div className='flex-1'>
        <Link
          href={INSTAGRAM_PROFILE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm font-semibold hover:underline'
        >
          {INSTAGRAM_HANDLE}
        </Link>
        <p className='text-muted-foreground text-xs'>HawkStars NGO</p>
      </div>
      <Link
        href={INSTAGRAM_PROFILE_URL}
        target='_blank'
        rel='noopener noreferrer'
        className='text-muted-foreground hover:text-foreground transition-colors'
        aria-label='Open Instagram profile'
      >
        <LuExternalLink className='size-4' />
      </Link>
    </div>
  );
}

export default function InstagramEmbedWidget({
  maxPosts = 3,
  showHeader = true,
}: InstagramEmbedWidgetProps) {
  const { loadScript, reprocess } = useInstagramEmbed();

  const posts = use(getInstagramPosts(maxPosts));

  useEffect(() => {
    if (posts.length > 0) {
      loadScript();
      // Re-process embeds after a short delay to ensure DOM is ready
      const timeout = setTimeout(reprocess, 500);
      return () => clearTimeout(timeout);
    }
  }, [posts, loadScript, reprocess]);

  return (
    <div
      className={cn(
        'mx-auto max-w-7xl overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
      )}
    >
      {showHeader && <WidgetHeader />}

      {posts.length > 0 && (
        <div className='flex max-h-150 space-y-4 overflow-y-auto p-4'>
          {posts.map((post) => (
            <EmbedPost key={post.id} permalink={post.permalink} />
          ))}
        </div>
      )}

      <div className='border-t border-neutral-200 px-4 py-3 text-center dark:border-neutral-700'>
        <Link
          href={INSTAGRAM_PROFILE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='text-green text-sm font-medium underline-offset-4 hover:underline'
        >
          Follow {INSTAGRAM_HANDLE} on Instagram
        </Link>
      </div>
    </div>
  );
}
