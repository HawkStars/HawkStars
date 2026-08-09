import { NextResponse, type NextRequest } from 'next/server';
import { cacheLife, cacheTag } from 'next/cache';
import { getPayloadConfig } from '@/lib/payload/server';
import { captureSentryMessage } from '@/lib/sentry/logs';
import { checkRateLimit, getClientIp } from '@/utils/rateLimit';

/**
 * Instagram Graph API integration for @hawk.starsngo
 *
 * Setup instructions:
 * 1. Create a Facebook Developer account at https://developers.facebook.com
 * 2. Create a new app and add the "Instagram Graph API" product
 * 3. Connect your Instagram Business/Creator account
 * 4. Generate a long-lived access token (valid for 60 days)
 * 5. Set the following environment variables:
 *    - INSTAGRAM_ACCESS_TOKEN: Your long-lived access token (fallback)
 *    - INSTAGRAM_USER_ID: Your Instagram Business account user ID
 *
 * Token refresh: The Payload job `refreshInstagramToken` automatically refreshes
 * the token twice a week and stores the updated value in Website Settings.
 * See: https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/
 */

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const CACHE_DURATION_SECONDS = 300; // 5 minutes

interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramApiResponse {
  data: InstagramMediaItem[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}

function normalizePost(item: InstagramMediaItem) {
  const imageUrl =
    item.media_type === 'VIDEO' ? (item.thumbnail_url ?? item.media_url) : item.media_url;

  return {
    id: item.id,
    caption: item.caption,
    mediaUrl: item.media_url,
    imageUrl,
    mediaType: item.media_type,
    permalink: item.permalink,
    thumbnailUrl: item.thumbnail_url,
    timestamp: item.timestamp,
    likeCount: item.like_count,
    commentsCount: item.comments_count,
  };
}

/** Thrown for Graph API failures so the caller can map them to the right HTTP status. */
class InstagramApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

/**
 * Cached Graph API call. With `cacheComponents` enabled, `fetch`'s `next.revalidate`
 * option only takes effect inside a `'use cache'` scope — used bare inside `GET` it
 * was a no-op, so every request hit Instagram live. This restores the intended
 * 5-minute cache, keyed on (userId, token, limit).
 *
 * A thrown/rejected result is never cached, so a Graph API error or expired token
 * doesn't get "stuck" for the cache lifetime — the next request tries again fresh.
 */
async function fetchInstagramPosts(userId: string, token: string, limit: number) {
  'use cache';
  cacheLife({
    stale: CACHE_DURATION_SECONDS,
    revalidate: CACHE_DURATION_SECONDS,
    expire: CACHE_DURATION_SECONDS * 2,
  });
  cacheTag('instagram');

  const fields =
    'id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,like_count,comments_count';
  const url = `${INSTAGRAM_API_BASE}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  const response = await fetch(url);

  if (!response.ok) {
    const message = `Instagram API error: ${response.status} ${response.statusText}`;
    // If token expired, surface it as a distinct status so the caller can react.
    throw new InstagramApiError(
      response.status === 190 || response.status === 401 ? 401 : 400,
      message
    );
  }

  const data: InstagramApiResponse = await response.json();
  return Array.isArray(data?.data) ? data.data.map(normalizePost) : [];
}

export async function GET(request: NextRequest) {
  // Each distinct `limit` value is its own cache key (see fetchInstagramPosts), so
  // an unrated caller could otherwise vary it to force a fresh Graph API call (and
  // burn the Instagram quota) on every request.
  const { allowed, retryAfter } = checkRateLimit(`instagram:${getClientIp(request)}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  const { searchParams } = request.nextUrl;
  // Clamp to a sane range: `Number('abc')` is NaN and negatives are invalid,
  // both of which would be forwarded raw to the Graph API.
  const requestedLimit = Number(searchParams.get('limit') ?? 12);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 50)) : 12;

  const payload = await getPayloadConfig();
  const settings = await payload.findGlobal({ slug: 'settings' });

  const { instagramToken, instagramUserId } = settings || {};
  if (!instagramToken || !instagramUserId) {
    captureSentryMessage(`Instagram API is not configured.`, 'error');

    return NextResponse.json(
      {
        error: '',
      },
      { status: 400 }
    );
  }

  try {
    const posts = await fetchInstagramPosts(instagramUserId, instagramToken, limit);

    return NextResponse.json(
      { posts },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=600`,
        },
      }
    );
  } catch (error) {
    if (error instanceof InstagramApiError) {
      captureSentryMessage(error.message, 'error');
      return NextResponse.json({ status: error.status }, { status: error.status });
    }

    captureSentryMessage(
      `Instagram feed fetch threw: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );

    return NextResponse.json(
      {
        error: 'Failed to fetch Instagram feed',
        posts: [],
      },
      { status: 500 }
    );
  }
}
