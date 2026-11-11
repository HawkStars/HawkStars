import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import type { ImpactReport } from '@/payload-types';
import { IMPACT_REPORTS_CACHE_TAG } from '@/payload/collections/ImpactReport';
import { Language } from '@/i18n/settings';
import { getPayloadConfig } from '../server';

/**
 * Every published impact report, newest year first, with its documents populated so
 * the /reports page can link straight to the files.
 *
 * The `_status` filter is explicit: the Local API skips access control, so
 * `authenticatedOrPublished` does not apply here and `draft: false` alone would
 * still return unpublished reports.
 */
export const getImpactReports = async (lng: Language): Promise<ImpactReport[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag(IMPACT_REPORTS_CACHE_TAG);

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'impact_reports',
    where: { _status: { equals: 'published' } },
    sort: '-year',
    limit: 50,
    depth: 1,
    locale: lng,
    draft: false,
  });
  return result.docs;
};

export const getImpactReportByYear = async (
  lng: Language,
  year: number
): Promise<ImpactReport | null> => {
  'use cache';
  cacheLife('hours');
  cacheTag(IMPACT_REPORTS_CACHE_TAG);

  const payload = await getPayloadConfig();
  const result = await payload.find({
    collection: 'impact_reports',
    where: { and: [{ year: { equals: year } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
    locale: lng,
    draft: false,
  });
  return result.docs[0] ?? null;
};
