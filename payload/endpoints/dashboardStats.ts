import type { PayloadHandler } from 'payload';
import * as Sentry from '@sentry/nextjs';

export const dashboardStatsHandler: PayloadHandler = async (req) => {
  const { payload, user } = req;

  // Admin dashboard data (collection counts, donation totals) must not be public.
  if (!user || !user.isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Draft / published counts using Payload's native versions/drafts status
    // (`_status`) for the collections that have drafts enabled.
    const statusCount = (
      collection: 'pages' | 'news' | 'hawk_projects',
      status: 'draft' | 'published'
    ) => payload.count({ collection, where: { _status: { equals: status } } });

    // Contribution totals/breakdown are aggregated in MongoDB instead of
    // pulling every document into Node. The previous implementation used
    // `payload.find({ collection: 'contributions', limit: 0, pagination: false })`
    // to fetch the *entire* collection just to sum `value` in JavaScript — as
    // the donations table grew, that unfiltered fetch got slow enough to blow
    // past nginx's 60s proxy_read_timeout, which is what was producing the
    // 504 on /admin (this handler backs the `afterDashboard` widget that
    // fetches on every admin landing-page load). See incident 2026-08-07.
    const Contribution = payload.db.collections['contributions'];

    type ContributionTotals = {
      confirmedCount: number;
      confirmedValue: number;
      totalValue: number;
    };
    type ContributionByType = {
      _id: string | null;
      count: number;
      total: number;
    };

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
      // Contribution totals (single-row aggregate) and breakdown by type
      contributionTotals,
      contributionsByType,
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
      statusCount('pages', 'draft'),
      statusCount('pages', 'published'),
      statusCount('news', 'draft'),
      statusCount('news', 'published'),
      statusCount('hawk_projects', 'draft'),
      statusCount('hawk_projects', 'published'),
      Contribution.aggregate<ContributionTotals>([
        {
          $group: {
            _id: null,
            totalValue: { $sum: { $ifNull: ['$value', 0] } },
            confirmedValue: {
              $sum: {
                $cond: [{ $eq: ['$is_confirmed', true] }, { $ifNull: ['$value', 0] }, 0],
              },
            },
            confirmedCount: {
              $sum: { $cond: [{ $eq: ['$is_confirmed', true] }, 1, 0] },
            },
          },
        },
      ]),
      Contribution.aggregate<ContributionByType>([
        {
          $group: {
            _id: { $ifNull: ['$contribution_type', 'OTHER'] },
            count: { $sum: 1 },
            total: { $sum: { $ifNull: ['$value', 0] } },
          },
        },
      ]),
    ]);

    const totals: ContributionTotals = contributionTotals[0] ?? {
      confirmedCount: 0,
      confirmedValue: 0,
      totalValue: 0,
    };

    const byType: Record<string, { count: number; total: number }> = {};
    for (const row of contributionsByType) {
      byType[row._id ?? 'OTHER'] = { count: row.count, total: row.total };
    }

    const stats = {
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
        totalValue: totals.totalValue,
        confirmedValue: totals.confirmedValue,
        totalCount: contributionsCount.totalDocs,
        confirmedCount: totals.confirmedCount,
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

    return Response.json(stats);
  } catch (error) {
    Sentry.captureException(error);
    return Response.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
};

export default dashboardStatsHandler;
