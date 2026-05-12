import { News } from '@/payload-types';

import API_CLIENT_PATHS from './constants';
import { stringify } from 'qs-esm';

const getNewsById = async (): Promise<News> => {
  const stringifiedQuery = stringify({ limit: 1 }, { addQueryPrefix: true });
  const response = await fetch(`${API_CLIENT_PATHS.news}${stringifiedQuery}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  return response.json();
};

export { getNewsById };
