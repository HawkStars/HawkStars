import type { DashboardLang } from '../dashboardLang';
import type { ActivityEntry, StatusCounts } from './types';

/**
 * Strings for the admin-only dashboard widgets, in the two admin languages.
 * The widgets are client components, so they pick the language themselves
 * with Payload's `useTranslation()` and `toDashboardLang(i18n.language)`.
 */
export type StatsError = 'unauthorized' | 'fetchFailed';

type StatsCopy = {
  intlLocale: string;
  error: string;
  activity: {
    title: string;
    refresh: string;
    loading: string;
    empty: string;
    fetchFailed: string;
    situations: Record<ActivityEntry['situation'], string>;
  };
  statistics: {
    title: string;
    loading: string;
    errors: Record<StatsError, string>;
    contributionSummary: string;
    totalDonations: string;
    confirmed: string;
    pending: string;
    average: string;
    contributionsCount: (count: number) => string;
    confirmedCount: (count: number) => string;
    pendingCount: (count: number) => string;
    chairsByType: string;
    otherContributions: string;
    collectionCounts: string;
    collections: Record<
      | 'artCollection'
      | 'boardMembers'
      | 'artists'
      | 'curators'
      | 'hawkProjects'
      | 'partners'
      | 'pages'
      | 'media'
      | 'users',
      string
    >;
    contributionTypes: Record<string, string>;
  };
  contentStatus: {
    title: string;
    loading: string;
    statuses: Record<keyof StatusCounts, string>;
    collections: Record<'pages' | 'news' | 'hawkProjects', string>;
  };
};

export const STATS_COPY: Record<DashboardLang, StatsCopy> = {
  pt: {
    intlLocale: 'pt-PT',
    error: 'Erro',
    activity: {
      title: 'Registo de atividade',
      refresh: '↻ Atualizar',
      loading: 'A carregar atividade…',
      empty: 'Ainda não há atividade registada.',
      fetchFailed: 'Não foi possível carregar a atividade.',
      situations: {
        login: 'Início de sessão',
        create: 'Criado',
        update: 'Atualizado',
        delete: 'Eliminado',
        message: 'Mensagem',
        other: 'Evento',
      },
    },
    statistics: {
      title: 'Estatísticas',
      loading: 'A carregar estatísticas…',
      errors: {
        unauthorized: 'Sem autorização.',
        fetchFailed: 'Não foi possível carregar as estatísticas.',
      },
      contributionSummary: 'Resumo de contribuições',
      totalDonations: 'Total de donativos',
      confirmed: 'Confirmadas',
      pending: 'Pendentes',
      average: 'Contribuição média',
      contributionsCount: (count) => `${count} contribuições`,
      confirmedCount: (count) => `${count} confirmadas`,
      pendingCount: (count) => `${count} pendentes`,
      chairsByType: 'Cadeiras por tipo',
      otherContributions: 'Outras contribuições',
      collectionCounts: 'Totais por coleção',
      collections: {
        artCollection: 'Obras de Arte',
        boardMembers: 'Membros da Direção',
        artists: 'Artistas',
        curators: 'Curadores',
        hawkProjects: 'Projetos Erasmus da Hawk',
        partners: 'Parceiros',
        pages: 'Páginas',
        media: 'Ficheiros de média',
        users: 'Utilizadores',
      },
      contributionTypes: {
        BANK: 'Transferência bancária',
        CRYPTO: 'Criptomoeda',
        WALL_NAME_SINGULAR: 'Nome no mural (individual)',
        WALL_NAME_COMPANY: 'Nome no mural (empresa)',
        OFFICE_CHAIR: 'Cadeira de escritório',
        SIMULATOR_CHAIR: 'Cadeira de simulador',
        LOUNGE_CHAIR: 'Cadeira lounge',
        AUDITORIUM_CHAIR: 'Cadeira de auditório',
        BUILDING_NAMING: 'Nome do edifício',
        TRAINING_ROOM_NAMING: 'Nome da sala de formação',
      },
    },
    contentStatus: {
      title: 'Estado do conteúdo',
      loading: 'A carregar estado do conteúdo…',
      statuses: { draft: 'Rascunho', published: 'Publicado' },
      collections: { pages: 'Páginas', news: 'Notícias', hawkProjects: 'Projetos Erasmus da Hawk' },
    },
  },
  en: {
    intlLocale: 'en-GB',
    error: 'Error',
    activity: {
      title: 'Activity Log',
      refresh: '↻ Refresh',
      loading: 'Loading activity…',
      empty: 'No activity recorded yet.',
      fetchFailed: 'Failed to fetch activity.',
      situations: {
        login: 'Login',
        create: 'Created',
        update: 'Updated',
        delete: 'Deleted',
        message: 'Message',
        other: 'Event',
      },
    },
    statistics: {
      title: 'Dashboard Statistics',
      loading: 'Loading statistics…',
      errors: { unauthorized: 'Unauthorized.', fetchFailed: 'Failed to fetch statistics.' },
      contributionSummary: 'Contribution Summary',
      totalDonations: 'Total Donations',
      confirmed: 'Confirmed',
      pending: 'Pending',
      average: 'Avg. Contribution',
      contributionsCount: (count) => `${count} contributions`,
      confirmedCount: (count) => `${count} confirmed`,
      pendingCount: (count) => `${count} pending`,
      chairsByType: 'Chairs by Type',
      otherContributions: 'Other Contributions',
      collectionCounts: 'Collection Counts',
      collections: {
        artCollection: 'Art Collections',
        boardMembers: 'Board Members',
        artists: 'Artists',
        curators: 'Curators',
        hawkProjects: 'Hawk Projects',
        partners: 'Partners',
        pages: 'Pages',
        media: 'Media Files',
        users: 'Users',
      },
      contributionTypes: {
        BANK: 'Bank Transfer',
        CRYPTO: 'Cryptocurrency',
        WALL_NAME_SINGULAR: 'Individual Wall Name',
        WALL_NAME_COMPANY: 'Company Wall Name',
        OFFICE_CHAIR: 'Office Chair',
        SIMULATOR_CHAIR: 'Simulator Chair',
        LOUNGE_CHAIR: 'Lounge Chair',
        AUDITORIUM_CHAIR: 'Auditorium Chair',
        BUILDING_NAMING: 'Building Naming',
        TRAINING_ROOM_NAMING: 'Training Room Naming',
      },
    },
    contentStatus: {
      title: 'Content Status',
      loading: 'Loading content status…',
      statuses: { draft: 'Draft', published: 'Published' },
      collections: { pages: 'Pages', news: 'News', hawkProjects: 'Hawk Projects' },
    },
  },
};
