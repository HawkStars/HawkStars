import type { PayloadHandler } from 'payload';

export const dashboardStatsHandler: PayloadHandler = async (req) => {
  const { payload, user } = req;

  // Admin dashboard data (collection counts, donation totals) must not be public.
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Content-status counts (draft / in_review / published) for the collections
    // that share the workflow status field.
    const statusCount = (collection: 'pages' | 'news' | 'hawk_projects', status: string) =>
      payload.count({ collection, where: { status: { equals: status } } });

    const [
      artCollectionCount,
      boardMembersCount,
      contributionsData,
      curatorsCount,
      hawkProjectsCount,
      partnersCount,
      pagesCount,
      mediaCount,
      usersCount,
      // Pages by status
      pagesDraft,
      pagesInReview,
      pagesPublished,
      // News by status
      newsDraft,
      newsInReview,
      newsPublished,
      // Hawk projects by status
      projectsDraft,
      projectsInReview,
      projectsPublished,
    ] = await Promise.all([
      payload.count({ collection: 'artworks' }),
      payload.count({ collection: 'board-members' }),
      payload.find({ collection: 'contributions', limit: 0, pagination: false }),
      payload.count({ collection: 'curators' }),
      payload.count({ collection: 'hawk_projects' }),
      payload.count({ collection: 'partners' }),
      payload.count({ collection: 'pages' }),
      payload.count({ collection: 'media' }),
      payload.count({ collection: 'users' }),
      statusCount('pages', 'draft'),
      statusCount('pages', 'in_review'),
      statusCount('pages', 'published'),
      statusCount('news', 'draft'),
      statusCount('news', 'in_review'),
      statusCount('news', 'published'),
      statusCount('hawk_projects', 'draft'),
      statusCount('hawk_projects', 'in_review'),
      statusCount('hawk_projects', 'published'),
    ]);

    // Calculate contribution statistics
    const contributions = contributionsData.docs;

    let totalValue = 0;
    let confirmedValue = 0;
    let confirmedCount = 0;
    const byType: Record<string, { count: number; total: number }> = {};

    contributions.forEach((contrib) => {
      const value = typeof contrib.value === 'number' ? contrib.value : 0;
      const contributionType = (contrib.contribution_type as string) || 'OTHER';
      const isConfirmed = contrib.is_confirmed === true;

      // Totals
      totalValue += value;
      if (isConfirmed) {
        confirmedValue += value;
        confirmedCount++;
      }

      // By type
      if (!byType[contributionType]) {
        byType[contributionType] = { count: 0, total: 0 };
      }
      byType[contributionType].count++;
      byType[contributionType].total += value;
    });

    const stats = {
      collections: {
        artCollection: artCollectionCount.totalDocs,
        boardMembers: boardMembersCount.totalDocs,
        contributions: contributionsData.totalDocs,
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
        totalCount: contributionsData.totalDocs,
        confirmedCount,
        byType,
      },
      contentStatus: {
        pages: {
          draft: pagesDraft.totalDocs,
          in_review: pagesInReview.totalDocs,
          published: pagesPublished.totalDocs,
        },
        news: {
          draft: newsDraft.totalDocs,
          in_review: newsInReview.totalDocs,
          published: newsPublished.totalDocs,
        },
        hawkProjects: {
          draft: projectsDraft.totalDocs,
          in_review: projectsInReview.totalDocs,
          published: projectsPublished.totalDocs,
        },
      },
    };

    return Response.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return Response.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
};

export default dashboardStatsHandler;
