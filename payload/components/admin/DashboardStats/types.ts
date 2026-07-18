export type StatusCounts = {
  draft: number;
  published: number;
};

export type Stats = {
  collections: {
    artCollection: number;
    boardMembers: number;
    contributions: number;
    curators: number;
    hawkProjects: number;
    partners: number;
    pages: number;
    media: number;
    users: number;
  };
  contributions: {
    totalValue: number;
    confirmedValue: number;
    totalCount: number;
    confirmedCount: number;
    byType: Record<string, { count: number; total: number }>;
  };
  contentStatus: {
    pages: StatusCounts;
    news: StatusCounts;
    hawkProjects: StatusCounts;
  };
};

export type ActorRef = { id: string | number; name?: string; email?: string };

export type ActivityEntry = {
  id: string | number;
  title: string;
  message?: string;
  situation: 'login' | 'create' | 'update' | 'delete' | 'message' | 'other';
  actor?: ActorRef | string | number | null;
  link?: string | null;
  createdAt: string;
};
