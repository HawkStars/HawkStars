import type { CollectionConfig } from 'payload';
import { notifyMediaDelete, notifyMediaUpload } from './hooks';
import { GROUP_LABELS } from '../../constants';
import { anyone } from '../../access/anyone';
import { authenticatedAdmin } from '../../access/authenticatedAdmin';
import { authenticatedEditor } from '../../access/authenticatedEditor';

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { en: 'Media', pt: 'Média' },
    plural: { en: 'Media', pt: 'Média' },
  },
  // Was previously unset, which defaults every operation to public — media is
  // rendered on public pages so read stays public, but uploading/editing/
  // deleting assets now requires an editor/admin account.
  access: {
    admin: authenticatedEditor,
    read: anyone,
    create: authenticatedEditor,
    delete: authenticatedAdmin,
    update: authenticatedEditor,
  },
  admin: {
    description: {
      en: 'Upload and manage media assets such as images used throughout the website. Use a image compression tool to optimize images before uploading to improve performance. Ideally in webP',
      pt: 'Carregue e gira recursos de média como imagens usadas no website. Use uma ferramenta de compressão antes de carregar para melhor desempenho. Idealmente em webP.',
    },
    components: {
      views: {
        list: {
          Component: '@/payload/components/admin/MediaListView',
        },
      },
    },
    pagination: {
      limits: [10, 25, 50, 100],
      defaultLimit: 2,
    },
    group: {
      ...GROUP_LABELS.management,
    },
  },
  upload: {
    staticDir: 'media',
    // Was 'image/*', which also matches 'image/svg+xml' — SVGs can embed
    // <script>/event-handler content and get rendered directly (e.g. in
    // <img>/CSS contexts, some browsers still execute inline scripts for
    // certain embed types), so an authenticated editor upload became a
    // stored-XSS vector. Restricted to an explicit raster-only safe list,
    // matching the pattern already used in Documents.ts.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'],
    disableLocalStorage: true,
    bulkUpload: true,
    displayPreview: true,
    // File-size capping isn't a per-collection `upload` option in this
    // Payload version — it's the root `buildConfig({ upload: { limits } })`
    // busboy setting (payload.config.ts), which applies to every upload
    // collection. See the comment there for the 50MB rationale.
  },
  hooks: {
    afterChange: [notifyMediaUpload],
    afterDelete: [notifyMediaDelete],
  },
  fields: [
    {
      name: 'alt',
      label: { en: 'Alt Text', pt: 'Texto Alternativo' },
      type: 'text',
      required: true,
      admin: {
        description: {
          en: 'Alternative text for the media item, used for accessibility.',
          pt: 'Texto alternativo para o item de média, usado para acessibilidade.',
        },
      },
    },
    {
      name: 'section',
      label: { en: 'Section', pt: 'Secção' },
      type: 'text',
      required: false,
      admin: {
        description: {
          en: 'For organizational purposes, specify the section of the website where this media will be used (e.g., Homepage, About Us, Gallery).',
          pt: 'Para fins organizacionais, especifique a secção do website onde este média será utilizado (ex: Página Inicial, Sobre Nós, Galeria).',
        },
      },
    },
  ],
};
