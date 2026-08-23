import type { PayloadHandler } from 'payload';
import * as Sentry from '@sentry/nextjs';

export const dashboardStatsHandler: PayloadHandler = async (req) => {
  const { payload, user } = req;

  // Admin dashboard data (collection counts, donation totals) must not be public.
  if (!user || !user.isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Draft / published counts using Payload's native versions/drafts status
    // (`_status`) for the collections that have drafts enabled.
    const statusCount = (
      collection: 'pages' | 'news' | 'hawk_projects',
      status: 'draft' | 'published'
    ) => payload.count({ collection, where: { _status: { equals: status } } });

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
    ]);

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
    return Response.json({ error: `Failed to fetch statistics. ${error}` }, { status: 500 });
  }
};

export default dashboardStatsHandler;
