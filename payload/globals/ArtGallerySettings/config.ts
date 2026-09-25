import type { GlobalConfig } from 'payload';
import { GROUP_LABELS } from '@/payload/constants';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { safeRevalidateTag } from '@/payload/utilities/safeRevalidate';

export const ART_GALLERY_SETTINGS_SLUG = 'artGallerySettings' as const;

export const ArtGallerySettings: GlobalConfig = {
  slug: ART_GALLERY_SETTINGS_SLUG,
  label: { en: 'Gallery Settings', pt: 'Configurações da Galeria' },
  admin: {
    group: GROUP_LABELS.artGallery,
    description: {
      en: 'Values used by the Art Gallery purchase page and contact forms.',
      pt: 'Valores usados na página de compra e nos formulários de contacto da Galeria de Arte.',
    },
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        safeRevalidateTag(ART_GALLERY_SETTINGS_SLUG);
        return doc;
      },
    ],
  },
  fields: [
    {
      name: 'vat_rate',
      label: { en: 'VAT Rate (%)', pt: 'Taxa de IVA (%)' },
      type: 'number',
      required: true,
      defaultValue: 23,
      min: 0,
      max: 100,
      admin: {
        description: {
          en: 'Added to the artwork price on the purchase page.',
          pt: 'Somada ao preço da obra na página de compra.',
        },
      },
    },
    {
      name: 'social_impact_share',
      label: {
        en: 'Share for Social Impact Projects',
        pt: 'Parte para Projetos de Impacto Social',
      },
      type: 'text',
      required: true,
      defaultValue: '30–40%',
      admin: {
        description: {
          en: 'Informative only (e.g. "30–40%") — shown in the gallery texts, never used in any calculation.',
          pt: 'Meramente informativo (ex.: "30–40%") — aparece nos textos da galeria, nunca é usado em cálculos.',
        },
      },
    },
    {
      name: 'contact_email',
      label: { en: 'Gallery Contact Email', pt: 'Email de Contacto da Galeria' },
      type: 'email',
      required: true,
      defaultValue: 'artgallery.socialimpact@gmail.com',
      admin: {
        description: {
          en: 'Receives purchase notifications, questions about artworks and artist proposals.',
          pt: 'Recebe os avisos de compra, as dúvidas sobre obras e as propostas de artistas.',
        },
      },
    },
    {
      name: 'contact_phone',
      label: { en: 'Gallery Phone (optional)', pt: 'Telefone da Galeria (opcional)' },
      type: 'text',
      admin: {
        description: {
          en: 'When filled, a "Phone concierge" button appears in the question panel.',
          pt: 'Quando preenchido, aparece um botão "Concierge telefónico" no painel de dúvidas.',
        },
      },
    },
    {
      name: 'office_location',
      label: { en: 'Curatorial Office Location', pt: 'Localização do Gabinete Curatorial' },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'Optional, e.g. "Pinhel & Guarda · Beira Interior, Portugal". The "Curatorial Office" box in the gallery footer only appears when this is filled in.',
          pt: 'Opcional, ex.: "Pinhel & Guarda · Beira Interior, Portugal". A caixa "Gabinete Curatorial" do rodapé da galeria só aparece quando isto está preenchido.',
        },
      },
    },
  ],
};
