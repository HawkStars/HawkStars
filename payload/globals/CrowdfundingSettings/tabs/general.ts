import { Tab } from 'payload';

const CrowdfundingSettingsGeneralTab: Tab = {
  label: { pt: 'Geral', en: 'General' },
  description: {
    pt: 'Configurações gerais da campanha de crowdfunding.',
    en: 'General settings for the crowdfunding campaign.',
  },
  fields: [
    // ── Button URLs ─────────────────────────────────────────────────
    {
      name: 'supportUrl',
      type: 'text',
      label: {
        pt: 'URL do Botão de Apoio',
        en: 'Support Button URL',
      },
      admin: {
        description:
          'Link for all "Support" / "Donate" buttons across the crowdfunding page (e.g. a payment or contribute page URL).',
        width: '50%',
      },
    },
    {
      name: 'businessCtaUrl',
      type: 'text',
      label: {
        pt: 'URL do CTA Empresas',
        en: 'Business CTA URL',
      },
      admin: {
        description:
          'Link for the "Become a partner" button in the Business section (e.g. a contact form or partnership page).',
        width: '50%',
      },
    },
    {
      name: 'transparencyDocUrl',
      type: 'text',
      label: {
        pt: 'URL do Documento de Transparência',
        en: 'Transparency Document URL',
      },
      admin: {
        description:
          'Link for the "Where does the money go?" button in the Transparency section (e.g. a public report or document).',
        width: '50%',
      },
    },
    {
      name: 'contactUrl',
      type: 'text',
      label: {
        pt: 'URL de Contacto',
        en: 'Contact URL',
      },
      admin: {
        description:
          'Link for the "Contact the team" button in the CTA section (e.g. mailto: link, contact form, or social media page).',
        width: '50%',
      },
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
    // ── Supporters ───────────────────────────────────────────────────
    {
      name: 'supporters',
      type: 'array',
      interfaceName: 'CrowdfundingSupporter',
      label: {
        pt: 'Apoiantes',
        en: 'Supporters',
      },
      admin: {
        description:
          'People and entities that support the project. Shown in the "Já Contamos com o Apoio de" section.',
        components: {
          RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: {
            pt: 'Nome',
            en: 'Name',
          },
          required: true,
        },
        {
          name: 'subname',
          type: 'text',
          label: {
            pt: 'Subtítulo',
            en: 'Subtitle',
          },
          admin: {
            description: 'Role, title, or short description (e.g. "Município de Pinhel").',
          },
        },
        {
          name: 'type',
          type: 'select',
          label: {
            pt: 'Tipo',
            en: 'Type',
          },
          options: [
            { label: { pt: 'Pessoa', en: 'Person' }, value: 'person' },
            { label: { pt: 'Entidade', en: 'Entity' }, value: 'entity' },
          ],
          defaultValue: 'entity',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: {
            pt: 'Logo / Foto',
            en: 'Logo / Photo',
          },
          admin: {
            description: 'Optional logo or photo. If empty, the name initials will be shown.',
          },
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
};

export default CrowdfundingSettingsGeneralTab;
