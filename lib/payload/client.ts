import { CollectionSlug, getPayload } from 'payload';
import config from '@/payload.config';

export const getPayloadConfig = async () => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  return payload;
};

export const callPayloadAPI = async (collection: CollectionSlug, options: RequestInit = {}) => {
  const payload = await getPayloadConfig();
  const response = await payload.find({ collection, ...options });

  return response;
};
