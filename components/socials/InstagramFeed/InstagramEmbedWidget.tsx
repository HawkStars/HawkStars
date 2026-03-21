'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { InstagramPost, InstagramEmbedWidgetProps } from './types';

import InstagramIcon from '@/public/images/icons/socials/instagram.svg';

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/hawk.starsngo';
const INSTAGRAM_HANDLE = '@hawk.starsngo';

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
      <div className='flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5'>
        <div className='flex size-full items-center justify-center rounded-full bg-white dark:bg-neutral-900'>
          <Image
            src={InstagramIcon}
            alt='Instagram'
            width={20}
            height={20}
          />
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
        className='text-muted-foreground transition-colors hover:text-foreground'
        aria-label='Open Instagram profile'
      >
        <ExternalLink className='size-4' />
      </Link>
    </div>
  );
}

function EmbedSkeleton() {
  return (
    <div className='space-y-4 p-4'>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className='animate-pulse space-y-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700'>
          <div className='flex items-center gap-2'>
            <div className='size-8 rounded-full bg-neutral-200 dark:bg-neutral-700' />
            <div className='h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700' />
          </div>
          <div className='aspect-square w-full rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='space-y-2'>
            <div className='h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700' />
            <div className='h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InstagramEmbedWidget({
  maxPosts = 3,
  showHeader = true,
  className,
}: InstagramEmbedWidgetProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadScript, reprocess } = useInstagramEmbed();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/instagram?limit=${maxPosts}`);

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts');
      }

      const data = await response.json();
      setPosts(data.posts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [maxPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
        'overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      {showHeader && <WidgetHeader />}

      {loading && <EmbedSkeleton />}

      {error && (
        <div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
          <p className='text-muted-foreground mb-3 text-sm'>{error}</p>
          <Link
            href={INSTAGRAM_PROFILE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium text-green underline-offset-4 hover:underline'
          >
            Visit us on Instagram
          </Link>
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className='max-h-[600px] space-y-4 overflow-y-auto p-4'>
          {posts.map((post) => (
            <EmbedPost key={post.id} permalink={post.permalink} />
          ))}
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
          <p className='text-muted-foreground mb-3 text-sm'>No posts to display yet.</p>
          <Link
            href={INSTAGRAM_PROFILE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-medium text-green underline-offset-4 hover:underline'
          >
            Visit us on Instagram
          </Link>
        </div>
      )}

      <div className='border-t border-neutral-200 px-4 py-3 text-center dark:border-neutral-700'>
        <Link
          href={INSTAGRAM_PROFILE_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm font-medium text-green underline-offset-4 hover:underline'
        >
          Follow {INSTAGRAM_HANDLE} on Instagram
        </Link>
      </div>
    </div>
  );
}
