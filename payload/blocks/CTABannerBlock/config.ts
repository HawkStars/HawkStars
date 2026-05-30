import { PayloadImageField } from '@/payload/fields/ImageType';
import { linkGroup } from '@/payload/fields/linkGroup';
import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const CTABannerBlock: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CTABannerBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', pt: 'Descrição' },
      localized: true,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'variant',
      type: 'select',
      label: { en: 'Variant', pt: 'Variante' },
      options: [
        { label: { en: 'Centered', pt: 'Centrado' }, value: 'centered' },
        { label: { en: 'Split', pt: 'Dividido' }, value: 'split' },
        { label: { en: 'Image Background', pt: 'Fundo com Imagem' }, value: 'image-bg' },
      ],
      defaultValue: 'centered',
    },
    PayloadImageField({ name: 'backgroundImage', description: 'For image-bg variant' }),
    SectionID,
  ],
  labels: {
    plural: { en: 'CTA Banners', pt: 'Banners CTA' },
    singular: { en: 'CTA Banner', pt: 'Banner CTA' },
  },
};
