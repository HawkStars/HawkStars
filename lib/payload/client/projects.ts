import { HawkProject } from '@/payload-types';
import { stringify } from 'qs-esm';
import API_CLIENT_PATHS from './constants';

const upcomingProject = async (): Promise<HawkProject> => {
  const stringifiedQuery = stringify({ limit: 1 }, { addQueryPrefix: true });
  const response = await fetch(`${API_CLIENT_PATHS.projects}${stringifiedQuery}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch upcoming project');
  }

  return response.json();
};

export { upcomingProject };
