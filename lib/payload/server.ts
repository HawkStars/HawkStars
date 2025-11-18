'use server';

import { getPayload } from 'payload';
import config from '@/payload.config';

export const getPayloadConfig = async () => {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  return payload;
};
