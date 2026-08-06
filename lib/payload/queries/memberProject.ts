import { getPayloadConfig } from '../server';
import { cacheLife, cacheTag } from 'next/cache';
import { MEMBER_PROJECT_CACHE_TAG } from '@/payload/collections/MemberProject';

const MEMBER_PROJECTS_COLLECTION = 'member_projects' as const;

export type MemberProjectDate = {
  label: string;
  date: string;
  link?: string | null;
};

export type MemberProjectDoc = {
  id: string;
  title: string;
  description: string;
  language: string;
  image_url?: string | null;
  video_url?: string | null;
  dates?: MemberProjectDate[] | null;
  createdAt: string;
};

/**
 * Returns only confirmed member projects for the public showcase.
 * Submitter contact details are intentionally not exposed here.
 */
export const getConfirmedMemberProjects = async (): Promise<MemberProjectDoc[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(MEMBER_PROJECT_CACHE_TAG);
  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: MEMBER_PROJECTS_COLLECTION,
    where: { is_confirmed: { equals: true } },
    sort: '-createdAt',
    limit: 200,
    depth: 0,
  });

  return result.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title as string,
    description: doc.description as string,
    language: doc.language as string,
    image_url: (doc.image_url as string | null | undefined) ?? null,
    video_url: (doc.video_url as string | null | undefined) ?? null,
    dates: (doc.dates as MemberProjectDate[] | null | undefined) ?? [],
    createdAt: doc.createdAt as string,
  }));
};
