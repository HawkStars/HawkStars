export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/hawk.starsngo';
export const INSTAGRAM_HANDLE = '@hawk.starsngo';

export interface InstagramPost {
  id: string;
  caption?: string;
  mediaUrl: string;
  /**
   * Always points to a displayable image regardless of media type.
   * For VIDEO posts this is the thumbnail; for IMAGE / CAROUSEL it equals mediaUrl.
   * Use this when you just need a src for an <img> / next/image.
   */
  imageUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  thumbnailUrl?: string;
  timestamp: string;
  likeCount?: number;
  commentsCount?: number;
}

export interface InstagramFeedProps {
  /** Maximum number of posts to display */
  maxPosts?: number;
}

export interface InstagramGridProps extends InstagramFeedProps {
  /** Number of columns in the grid (default: 3) */
  columns?: 3 | 4;
  /** Show hover overlay with like/comment counts */
  showOverlay?: boolean;
}

export interface InstagramEmbedWidgetProps {
  /** Maximum number of embedded posts to show */
  maxPosts?: number;
  /** Show the Instagram header with profile info */
  showHeader?: boolean;
}
