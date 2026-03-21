export interface InstagramPost {
  id: string;
  caption?: string;
  mediaUrl: string;
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
  /** Additional CSS classes */
  className?: string;
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
  /** Additional CSS classes */
  className?: string;
  /** Show the Instagram header with profile info */
  showHeader?: boolean;
}
