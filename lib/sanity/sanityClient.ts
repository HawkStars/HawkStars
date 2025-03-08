import { createClient, QueryParams } from 'next-sanity';

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_STUDIO_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

export const sanityAPI = assertValue(
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  'Missing environment variable: NEXT_PUBLIC_SANITY_API_VERSION'
);

export const sanityToken = assertValue(
  process.env.NEXT_PUBLIC_SANITY_TOKEN,
  'Missing environment variable: NEXT_PUBLIC_SANITY_TOKEN'
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const client = createClient({
  apiVersion: sanityAPI,
  dataset,
  projectId,
  useCdn: false,
});

export const serverClient = createClient({
  apiVersion: sanityAPI,
  dataset,
  projectId,
  useCdn: false,
  token: sanityToken,
});

// from https://www.npmjs.com/package/next-sanity
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 1800, // default revalidation time in seconds (30min)
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
      tags, // for tag-based revalidation
    },
  });
}
