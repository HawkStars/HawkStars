import type { GlobalConfig } from 'payload';
import { FooterNavGroup } from '@/payload/fields/FooterNavGroup';
import { authenticatedEditor } from '@/payload/access/authenticatedEditor';
import { revalidateFooter } from './hooks/revalidateFooter';
import { authenticated } from '@/payload/access/authenticated';
import { GROUP_LABELS } from '@/payload/constants';

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: {
    pt: 'Rodapé',
    en: 'Footer',
  },
  access: {
    read: authenticated,
    update: authenticatedEditor,
  },
  admin: {
    group: GROUP_LABELS.layout,
    description: {
      en: 'Configure the footer navigation columns. Each column groups links displayed side by side on desktop or stacked on mobile.',
      pt: 'Configure as colunas de navegação do rodapé. Cada coluna agrupa links exibidos lado a lado no desktop ou empilhados no móvel.',
    },
  },
  fields: [
    {
      name: 'columns',
      label: { en: 'Footer Columns', pt: 'Colunas do Rodapé' },
      interfaceName: 'FooterColumnsItem',
      admin: {
        components: {
          RowLabel: {
            path: '@/payload/globals/Footer/components/FooterLabel',
            exportName: 'FooterLabel',
          },
        },
      },
      type: 'array',
      fields: [FooterNavGroup],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1000,
      },
    },
    max: 3,
  },
};
