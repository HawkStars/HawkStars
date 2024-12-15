import { createClient } from '@sanity/client';

// TODO: move to next-client here

import { apiVersion, dataset, projectId, useCdn } from '../env';

export const client = createClient({
  // apiVersion,
  dataset,
  projectId,
  useCdn,
});
