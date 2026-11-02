import type { Locale } from 'date-fns';
import { enGB, pt } from 'date-fns/locale';
import type { DashboardLang } from '../dashboardLang';
import type { DashboardDoc } from './queries';

/**
 * Dashboard strings for the two admin languages (`i18n.supportedLanguages` in
 * payload.config.ts). The dashboard is a custom view, so Payload's own
 * translations do not cover it — every visible string has to come from here.
 */

type DashboardCopy = {
  intlLocale: string;
  dateFnsLocale: Locale;
  greeting: { morning: string; afternoon: string; evening: string };
  intro: string;
  quickActions: Record<'news' | 'hawk_projects' | 'hawk_events' | 'pages' | 'media', string>;
  existingComponents: string;
  recentlyEdited: { title: string; empty: string };
  notYetPublished: { title: string; empty: string };
  upcomingEvents: { title: string; empty: string; viewAll: string };
  content: string;
  draft: string;
  edited: string;
  collections: Record<DashboardDoc['collection'], string>;
};

export const DASHBOARD_COPY: Record<DashboardLang, DashboardCopy> = {
  pt: {
    intlLocale: 'pt-PT',
    dateFnsLocale: pt,
    greeting: { morning: 'Bom dia', afternoon: 'Boa tarde', evening: 'Boa noite' },
    intro:
      'Gira o conteúdo da HawkStars em português e inglês. As alterações são publicadas nas duas versões do site.',
    quickActions: {
      news: 'Nova notícia',
      hawk_projects: 'Novo projeto',
      hawk_events: 'Novo evento',
      pages: 'Nova página',
      media: 'Carregar média',
    },
    existingComponents: 'Componentes Existentes',
    recentlyEdited: { title: 'Editados recentemente', empty: 'Ainda nada foi editado.' },
    notYetPublished: {
      title: 'Por publicar',
      empty: 'Sem rascunhos pendentes — está tudo publicado.',
    },
    upcomingEvents: {
      title: 'Próximos eventos',
      empty: 'Não há eventos agendados.',
      viewAll: 'Ver todos →',
    },
    content: 'Conteúdo',
    draft: 'Rascunho',
    edited: 'editado',
    collections: {
      pages: 'Página',
      news: 'Notícia',
      hawk_projects: 'Projeto',
      hawk_events: 'Evento',
    },
  },
  en: {
    intlLocale: 'en-GB',
    dateFnsLocale: enGB,
    greeting: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
    intro:
      'Manage HawkStars content in Portuguese and English. Changes are published to both versions of the website.',
    quickActions: {
      news: 'New news post',
      hawk_projects: 'New project',
      hawk_events: 'New event',
      pages: 'New page',
      media: 'Upload media',
    },
    existingComponents: 'Existing Components',
    recentlyEdited: { title: 'Recently Edited', empty: 'Nothing has been edited yet.' },
    notYetPublished: {
      title: 'Not Yet Published',
      empty: 'No drafts waiting — everything is live.',
    },
    upcomingEvents: {
      title: 'Upcoming Events',
      empty: 'No upcoming events scheduled.',
      viewAll: 'View all →',
    },
    content: 'Content',
    draft: 'Draft',
    edited: 'edited',
    collections: { pages: 'Page', news: 'News', hawk_projects: 'Project', hawk_events: 'Event' },
  },
};
