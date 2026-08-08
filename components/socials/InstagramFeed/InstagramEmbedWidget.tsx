'use client';

import { useEffect, useRef, useCallback, use } from 'react';
import { ImageMedia } from '@/payload/components/Media';
import Link from 'next/link';
import { LuExternalLink } from 'react-icons/lu';

import { cn } from '@/lib/utils';
import {
  type InstagramEmbedWidgetProps,
  type InstagramPost,
  INSTAGRAM_PROFILE_URL,
  INSTAGRAM_HANDLE,
} from './types';

import InstagramIcon from '@/public/images/icons/socials/instagram.svg';
import getInstagramPosts from '@/lib/instagram';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

/**
 * Stable promise cache for `use()` below.
 *
 * `use(getInstagramPosts(maxPosts))` called straight in the render body created
 * a BRAND NEW promise on every render. `use()` suspends on an unresolved
 * promise, React re-renders when it settles, that render calls
 * `getInstagramPosts()` again -> new promise -> suspend again. The component
 * never converges: it re-fetches `/api/instagram` in a loop (tripping the
 * 30 req/min limiter in utils/rateLimit.ts), and every iteration leaves behind
 * another promise plus its resolved payload for the GC to chase.
 *
 * React's rule is that a Client Component must not create the promise it
 * passes to `use()` during render — the promise has to be cached across
 * renders. Keying it by `maxPosts` here gives `use()` the identical reference
 * every time, so it resolves once.
 *
 * The sibling `InstagramGrid.tsx` avoids this by fetching in `useEffect` +
 * `useState` instead; this file kept Suspense, so it needs the cache.
 *
 * Bounded by the number of distinct `maxPosts` values (effectively one). Held
 * for the lifetime of the tab, which matches the endpoint's own 300s cache.
 */
const postsPromiseCache = new Map<number, Promise<InstagramPost[]>>();

function getCachedInstagramPosts(maxPosts: number): Promise<InstagramPost[]> {
  let promise = postsPromiseCache.get(maxPosts);
  if (!promise) {
    promise = getInstagramPosts(maxPosts);
    postsPromiseCache.set(maxPosts, promise);
  }
  return promise;
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
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

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
        aria-label={t('instagram.openProfile')}
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
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  const posts = use(getCachedInstagramPosts(maxPosts));

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
          {t('instagram.follow', { handle: INSTAGRAM_HANDLE })}
        </Link>
      </div>
    </div>
  );
}
