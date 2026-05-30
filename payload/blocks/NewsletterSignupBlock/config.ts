import SectionID from '@/payload/fields/SectionID';
import type { Block } from 'payload';

export const NewsletterSignupBlock: Block = {
  slug: 'newsletterSignup',
  interfaceName: 'NewsletterSignupBlock',
  admin: {
    group: 'CTA & Engagement',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Stay Updated',
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
      name: 'buttonText',
      type: 'text',
      defaultValue: 'Subscribe',
      localized: true,
      label: { en: 'Button Text', pt: 'Texto do Botão' },
    },
    SectionID,
  ],
  labels: {
    plural: { en: 'Newsletter Signups', pt: 'Inscrições na Newsletter' },
    singular: { en: 'Newsletter Signup', pt: 'Inscrição na Newsletter' },
  },
};
