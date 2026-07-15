import type { CollectionConfig } from 'payload';
import { anyone } from '../../access/anyone';
import { authenticated } from '../../access/authenticated';
import { sanitizeBrokenImageRelationship } from '../../hooks/sanitizeBrokenImageRelationship';
import HawkProjectFields from './HawkProjectFields';
import { GROUP_LABELS } from '@/payload/constants';

export const HawkEvent: CollectionConfig = {
  slug: 'hawk_events',
  labels: {
    singular: { en: 'Hawk Event', pt: 'Evento Hawk' },
    plural: { en: 'Hawk Events', pt: 'Eventos Hawk' },
  },
  admin: {
    defaultColumns: ['type_event', 'slug'],
    useAsTitle: 'heading',
    description: {
      en: 'Manage HawkStars projects and events. Add event details, images, and descriptions. Each project gets its own public page based on its slug.',
      pt: 'Gira os projetos e eventos da HawkStars. Adicione detalhes, imagens e descrições. Cada projeto tem a sua própria página pública baseada no slug.',
    },
    group: {
      ...GROUP_LABELS.events,
    },
    preview: (doc) => `/events/${doc.slug}`,
  },
  defaultPopulate: {
    slug: true,
  },
  access: {
    admin: authenticated,
    read: anyone,
    create: authenticated,
    delete: authenticated,
    update: authenticated,
  },
  hooks: {
    afterRead: [sanitizeBrokenImageRelationship],
  },
  fields: [
    {
      type: 'tabs',
      label: 'Hawk Event Details',
      tabs: [HawkProjectFields],
    },
  ],
};
