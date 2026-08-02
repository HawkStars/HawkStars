import type { AgendaBlock, HawkProject } from '@/payload-types';
import type { Where } from 'payload';
import { stringify } from 'qs-esm';

import API_CLIENT_PATHS from '../constants';
import payloadClientQuery from '../client';

type FetchAgendaEventsOptions = {
  maxEvents?: AgendaBlock['maxEvents'];
};

const fetchAgendaProjects = async ({
  maxEvents,
}: FetchAgendaEventsOptions): Promise<HawkProject[]> => {
  const today = new Date().toISOString();
  const limit = Math.min(maxEvents ?? 5, 20);

  const where: Where = {
    _status: { equals: 'published' },
    or: [{ startDate: { greater_than_equal: today } }, { endDate: { greater_than_equal: today } }],
  };

  const query = stringify({ where, limit, sort: 'startDate' }, { addQueryPrefix: true });

  return await payloadClientQuery<HawkProject[]>({
    url: API_CLIENT_PATHS.projects,
    query,
    method: 'GET',
    fallback: [],
  });
};

export { fetchAgendaProjects };
