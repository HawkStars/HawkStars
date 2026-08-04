import { InstagramPost } from '@/components/socials/InstagramFeed';
import { cacheLife } from 'next/cache';

const getInstagramPosts = async (maxPosts: number) => {
  'use cache';
  cacheLife('minutes');

  const response = await fetch(`/api/instagram?limit=${maxPosts}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram posts');
  }

  const data = await response.json();
  return (data.posts as InstagramPost[]) ?? [];
};

export default getInstagramPosts;
