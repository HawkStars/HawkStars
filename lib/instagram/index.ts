import { InstagramPost } from '@/components/socials/InstagramFeed';
import * as Sentry from '@sentry/nextjs';

const getInstagramPosts = async (maxPosts: number) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram?limit=${maxPosts}`
    );

    if (!response.ok) throw new Error('Failed to fetch Instagram posts');

    const data = await response.json();
    return (data.posts as InstagramPost[]) ?? [];
  } catch (err) {
    Sentry.captureException(err);
    return [];
  }
};

export default getInstagramPosts;
