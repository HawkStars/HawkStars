import type { BasePayload } from 'payload';
import type { Stats } from '@/payload/components/admin/DashboardStats/types';

/**
 * Shared aggregation for the admin dashboard's Statistics/Content Status
 * widgets. Called from both the `/api/dashboard-stats` HTTP handler (guarded
 * by an `isAdmin` check there) and directly via the Local API from the
 * `afterDashboard` server component — callers are responsible for their own
 * authorization check before invoking this.
 */
const statusCount = (
  payload: BasePayload,
  collection: 'pages' | 'news' | 'hawk_projects',
  status: 'draft' | 'published'
) => payload.count({ collection, where: { _status: { equals: status } } });

export const getDashboardStats = async (payload: BasePayload): Promise<Stats> => {
  const [
    artCollectionCount,
    boardMembersCount,
    contributionsCount,
    curatorsCount,
    hawkProjectsCount,
    partnersCount,
    pagesCount,
    mediaCount,
    usersCount,
    // Pages by status
    pagesDraft,
    pagesPublished,
    // News by status
    newsDraft,
    newsPublished,
    // Hawk projects by status
    projectsDraft,
    projectsPublished,
    // All contributions, for the value/type breakdown below
    contributions,
  ] = await Promise.all([
    payload.count({ collection: 'artworks' }),
    payload.count({ collection: 'board-members' }),
    payload.count({ collection: 'contributions' }),
    payload.count({ collection: 'curators' }),
    payload.count({ collection: 'hawk_projects' }),
    payload.count({ collection: 'partners' }),
    payload.count({ collection: 'pages' }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'users' }),
    statusCount(payload, 'pages', 'draft'),
    statusCount(payload, 'pages', 'published'),
    statusCount(payload, 'news', 'draft'),
    statusCount(payload, 'news', 'published'),
    statusCount(payload, 'hawk_projects', 'draft'),
    statusCount(payload, 'hawk_projects', 'published'),
    payload.find({ collection: 'contributions', limit: 0 }),
  ]);

  const byType: Record<string, { count: number; total: number }> = {};
  let totalValue = 0;
  let confirmedValue = 0;
  let confirmedCount = 0;

  for (const doc of contributions.docs) {
    const value = doc.value || 0;
    totalValue += value;
    if (doc.is_confirmed) {
      confirmedValue += value;
      confirmedCount += 1;
    }

    const type = doc.contribution_type || 'OTHER';
    if (!byType[type]) byType[type] = { count: 0, total: 0 };
    byType[type].count += 1;
    byType[type].total += value;
  }

  return {
    collections: {
      artCollection: artCollectionCount.totalDocs,
      boardMembers: boardMembersCount.totalDocs,
      contributions: contributionsCount.totalDocs,
      curators: curatorsCount.totalDocs,
      hawkProjects: hawkProjectsCount.totalDocs,
      partners: partnersCount.totalDocs,
      pages: pagesCount.totalDocs,
      media: mediaCount.totalDocs,
      users: usersCount.totalDocs,
    },
    contributions: {
      totalValue,
      confirmedValue,
      totalCount: contributions.totalDocs,
      confirmedCount,
      byType,
    },
    contentStatus: {
      pages: {
        draft: pagesDraft.totalDocs,
        published: pagesPublished.totalDocs,
      },
      news: {
        draft: newsDraft.totalDocs,
        published: newsPublished.totalDocs,
      },
      hawkProjects: {
        draft: projectsDraft.totalDocs,
        published: projectsPublished.totalDocs,
      },
    },
  };
};

export default getDashboardStats;
