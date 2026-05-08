import type { GlobalConfig } from 'payload';

import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';

export const CrowdfundingSettings: GlobalConfig = {
  slug: 'crowdfunding-settings',
  label: {
    pt: 'Configurações de Crowdfunding',
    en: 'Crowdfunding Settings',
  },
  admin: {
    description:
      'Configure the dynamic numbers, dates, images, and videos shown on the Crowdfunding page.',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'raisedAmount',
      type: 'number',
      label: {
        pt: 'Valor Angariado (€)',
        en: 'Raised Amount (€)',
      },
      admin: {
        description: 'Total amount raised so far, in euros.',
        width: '33%',
      },
      required: true,
      defaultValue: 0,
    },
    {
      name: 'campaignGoal',
      type: 'number',
      label: {
        pt: 'Meta da Campanha (€)',
        en: 'Campaign Goal (€)',
      },
      admin: {
        description: 'The fundraising target for the campaign phase, in euros.',
        width: '33%',
      },
      required: true,
      defaultValue: 100000,
    },
    {
      name: 'projectGoal',
      type: 'number',
      label: {
        pt: 'Meta Total do Projeto (€)',
        en: 'Total Project Goal (€)',
      },
      admin: {
        description: 'The full investment target for the project, in euros.',
        width: '33%',
      },
      required: true,
      defaultValue: 900000,
    },
    {
      name: 'lastUpdateDate',
      type: 'text',
      label: {
        pt: 'Data da Última Atualização',
        en: 'Last Update Date',
      },
      admin: {
        description: 'Displayed date of the last statistics update (e.g. "Março 2025").',
      },
      localized: true,
      required: false,
    },
    {
      name: 'weeklyIncrease',
      type: 'text',
      label: {
        pt: 'Aumento Semanal (texto)',
        en: 'Weekly Increase (text)',
      },
      admin: {
        description:
          'Short label shown next to the raised amount to indicate weekly growth (e.g. "+2.3% esta semana").',
      },
      localized: true,
      required: false,
    },
    // ── Images & Video ──────────────────────────────────────────────
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: {
        pt: 'Imagem de Fundo do Hero',
        en: 'Hero Background Image',
      },
      admin: {
        description: 'Background image for the hero section at the top of the crowdfunding page.',
      },
    },
    {
      name: 'videoThumbnail',
      type: 'upload',
      relationTo: 'media',
      label: {
        pt: 'Thumbnail do Vídeo',
        en: 'Video Thumbnail',
      },
      admin: {
        description: 'Thumbnail image shown before the video is played.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: {
        pt: 'URL do Vídeo',
        en: 'Video URL',
      },
      admin: {
        description:
          'YouTube or Vimeo URL for the documentary video (e.g. "https://www.youtube.com/watch?v=...").',
      },
    },
    {
      name: 'updateCardImages',
      type: 'array',
      label: {
        pt: 'Imagens dos Cartões de Atualizações',
        en: 'Update Card Images',
      },
      admin: {
        description:
          'Images for each update card in the Updates section. Add one per card, in order.',
      },
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: {
            pt: 'Imagem',
            en: 'Image',
          },
          required: true,
        },
      ],
    },
    {
      name: 'ctaImage',
      type: 'upload',
      relationTo: 'media',
      label: {
        pt: 'Imagem de Fundo do CTA',
        en: 'CTA Background Image',
      },
      admin: {
        description:
          'Background image for the final call-to-action section at the bottom of the page.',
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    max: 3,
  },
};
