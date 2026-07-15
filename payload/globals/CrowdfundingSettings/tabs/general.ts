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
        description: {
          en: 'Link for all "Support" / "Donate" buttons across the crowdfunding page (e.g. a payment or contribute page URL).',
          pt: 'Link para todos os botões "Apoiar" / "Doar" na página de crowdfunding (ex: URL de uma página de pagamento ou contribuição).',
        },
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
        description: {
          en: 'Link for the "Become a partner" button in the Business section (e.g. a contact form or partnership page).',
          pt: 'Link para o botão "Torne-se parceiro" na secção de Empresas (ex: formulário de contacto ou página de parcerias).',
        },
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
        description: {
          en: 'Link for the "Where does the money go?" button in the Transparency section (e.g. a public report or document).',
          pt: 'Link para o botão "Para onde vai o dinheiro?" na secção de Transparência (ex: relatório público ou documento).',
        },
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
        description: {
          en: 'Link for the "Contact the team" button in the CTA section (e.g. mailto: link, contact form, or social media page).',
          pt: 'Link para o botão "Contactar a equipa" na secção CTA (ex: link mailto:, formulário de contacto ou página de redes sociais).',
        },
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
        description: {
          en: 'Background image for the hero section at the top of the crowdfunding page.',
          pt: 'Imagem de fundo para a secção hero no topo da página de crowdfunding.',
        },
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
        description: {
          en: 'Thumbnail image shown before the video is played.',
          pt: 'Imagem de miniatura mostrada antes do vídeo ser reproduzido.',
        },
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
        description: {
          en: 'YouTube or Vimeo URL for the documentary video (e.g. "https://www.youtube.com/watch?v=...").',
          pt: 'URL do YouTube ou Vimeo para o vídeo documental (ex: "https://www.youtube.com/watch?v=..."). ',
        },
      },
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
        description: {
          en: 'Background image for the final call-to-action section at the bottom of the page.',
          pt: 'Imagem de fundo para a secção de chamada para ação no fundo da página.',
        },
      },
    },
  ],
};

export default CrowdfundingSettingsGeneralTab;
