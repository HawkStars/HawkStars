import type { CollectionBeforeChangeHook, CollectionBeforeValidateHook } from 'payload';
import type { MemberProject } from '@/payload-types';
import { isHttpUrl } from '@/utils/paths';

export const checkProjectUrl: CollectionBeforeChangeHook<MemberProject> = async ({ data }) => {
  if (!data) return data;

  const { video_url } = data;
  if (!video_url) return data;

  const isHttpValid = isHttpUrl(video_url);
  if (!isHttpUrl) {
    return { ...data, video_url: undefined };
  }

  return data;
};
