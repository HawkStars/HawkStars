import type { Block } from 'payload';
import SectionID from '@/payload/fields/SectionID';
import PayloadLucideIcon from '@/payload/fields/ImageIcon/payload-lucide-icon';
import { isLinkUrl } from '@/utils/paths';

/**
 * A band with a header on one side and clickable contact cards (phone, email, link) on
 * the other — e.g. "How to report a concern" with 112, a helpline and an email address.
 */
export const ContactChannelsBlock: Block = {
  slug: 'contactChannels',
  interfaceName: 'ContactChannelsBlock',
  labels: {
    singular: { en: 'Contact Channels', pt: 'Canais de Contacto' },
    plural: { en: 'Contact Channels', pt: 'Canais de Contacto' },
  },
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      label: { en: 'Eyebrow', pt: 'Sobretítulo' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Title', pt: 'Título' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { en: 'Description', pt: 'Descrição' },
    },
    {
      name: 'background',
      type: 'select',
      required: true,
      defaultValue: 'ink',
      label: { en: 'Background', pt: 'Fundo' },
      options: [
        { label: { en: 'Ink blue', pt: 'Azul tinta' }, value: 'ink' },
        { label: { en: 'Green', pt: 'Verde' }, value: 'green' },
        { label: { en: 'Beige', pt: 'Bege' }, value: 'bege' },
      ],
    },
    {
      name: 'channels',
      type: 'array',
      interfaceName: 'ContactChannel',
      required: true,
      minRows: 1,
      maxRows: 4,
      label: { en: 'Channels', pt: 'Canais' },
      admin: {
        components: { RowLabel: '@/payload/components/admin/GenericArrayRowLabel' },
      },
      fields: [
        PayloadLucideIcon(),
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Label', pt: 'Rótulo' },
              admin: { width: '50%', placeholder: 'Emergência' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: { en: 'Shown value', pt: 'Valor mostrado' },
              admin: { width: '50%', placeholder: '112' },
            },
          ],
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: { en: 'Link', pt: 'Ligação' },
          admin: {
            placeholder: 'tel:112',
            description: {
              en: 'tel:112, mailto:geral@hawkstars.org?subject=…, a site path (/contribute) or an https:// URL.',
              pt: 'tel:112, mailto:geral@hawkstars.org?subject=…, um caminho do site (/contribute) ou um URL https://.',
            },
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'Required / Obrigatório';
            if (value.startsWith('/') || isLinkUrl(value)) return true;
            return 'Use tel:, mailto:, a site path (/…) or https:// / Use tel:, mailto:, um caminho (/…) ou https://';
          },
        },
      ],
    },
    SectionID,
  ],
};
