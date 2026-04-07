import { NextResponse, type NextRequest } from 'next/server';
import { getPayloadConfig } from '@/lib/payload/server';
import * as Sentry from '@sentry/nextjs';

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Math.min(Number(searchParams.get('limit') ?? 12), 50);

  const payload = await getPayloadConfig();
  const settings = await payload.findGlobal({ slug: 'settings' });

  const { instagramToken, instagramUserId } = settings || {};
  if (!instagramToken || !instagramUserId) {
    return NextResponse.json(
      {
        error: 'Instagram API is not configured.',
      },
      { status: 400 }
    );
  }

  try {
    const fields =
      'id,caption,media_url,media_type,permalink,thumbnail_url,timestamp,like_count,comments_count';
    const url = `${INSTAGRAM_API_BASE}/${instagramUserId}/media?fields=${fields}&limit=${limit}&access_token=${instagramToken}`;

    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION_SECONDS },
    } as RequestInit);

    if (!response.ok) {
      Sentry.captureMessage(`Instagram API error: ${response.status} ${response.statusText}`, {
        level: 'error',
      });

      // If token expired, return a helpful message
      if (response.status === 190 || response.status === 401) {
        return NextResponse.json(
          {
            error: 'Instagram access token has expired. Please refresh it.',
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          error: `Instagram API returned an error: ${response.status} ${response.statusText}`,
        },
        { status: 400 }
      );
    }

    const data: InstagramApiResponse = await response.json();
    const posts = data.data.map(normalizePost);

    return NextResponse.json(
      { posts },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=600`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch Instagram feed',
        posts: [],
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
