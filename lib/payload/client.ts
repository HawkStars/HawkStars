'use client';

import { Contribution } from '@/payload-types';

type FetchPayloadInformationProps = {
  type: 'collection' | 'global';
  slug: string;
};

const prepareUrl = (props: FetchPayloadInformationProps) => {
  const { type, slug } = props;

  if (type === 'collection') return `/api/collections/${slug}`;
  if (type === 'global') return `/api/globals/${slug}`;

  return null;
};

const fetchPayloadInformation: (
  props: FetchPayloadInformationProps
) => Promise<{ success: boolean; message?: string; data?: Contribution }> = async (props) => {
  const url = prepareUrl(props);
  if (!url) return { success: false, message: 'Invalid type' };

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.errors.join(', ') };

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching payload information:', error);
    return { success: false };
  }
};

export { fetchPayloadInformation };
