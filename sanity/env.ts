export const apiVersion = '1.1';

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

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
