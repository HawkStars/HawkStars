import type { GlobalConfig } from 'payload';
import { GROUP_LABELS } from '@/payload/constants';
import { authenticated } from '@/payload/access/authenticated';

/**
 * Menu entry only — stores nothing. Puts "Notícias da Galeria de Arte" inside
 * the Art Gallery group of the admin sidebar, listing the News articles shown
 * in the gallery feed (`showInArtGallery`) with direct links to edit them.
 * The articles themselves stay in the News collection.
 */
export const ArtGalleryNews: GlobalConfig = {
  slug: 'artGalleryNews',
  label: { en: 'Art Gallery News', pt: 'Notícias da Galeria de Arte' },
  admin: {
    group: GROUP_LABELS.artGallery,
    description: {
      en: 'The news articles shown in the Art Gallery feed.',
      pt: 'As notícias que aparecem no feed da Galeria de Arte.',
    },
    components: {
      views: {
        edit: {
          root: { Component: '@/payload/components/admin/GalleryNewsView#GalleryNewsView' },
        },
      },
    },
  },
  access: {
    read: authenticated,
    update: authenticated,
  },
  fields: [],
};
