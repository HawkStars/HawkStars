import { News } from '@/payload-types';

export const NewsTypeLabels: Record<News['type'], string> = {
  blog: 'Blog',
  news: 'News',
  press_release: 'Press Release',
  announcement: 'Announcement',
  other: 'Other',
};

export type NewsType = News['type'];
