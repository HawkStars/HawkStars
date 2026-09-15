import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';
import { GROUP_LABELS } from '../constants';
import { authenticatedAdmin } from '@/payload/access/authenticatedAdmin';

/**
 * NewsletterSubscriber
 *
 * Emails collected from the public newsletter signup block
 * (`payload/blocks/NewsletterSignupBlock`). Writes only ever happen through
 * the rate-limited `/api/newsletter` route with `overrideAccess: true` — the
 * collection itself stays locked to admins/editors, same pattern as
 * `MemberProject`'s public-write app route.
 */
export const NewsletterSubscriber: CollectionConfig = {
  slug: 'newsletter_subscribers',
  labels: {
    singular: { en: 'Newsletter Subscriber', pt: 'Subscritor da Newsletter' },
    plural: { en: 'Newsletter Subscribers', pt: 'Subscritores da Newsletter' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'locale', 'createdAt'],
    description: {
      en: 'Emails collected from the newsletter signup block on the public site.',
      pt: 'Emails recolhidos através do bloco de subscrição da newsletter no site público.',
    },
    group: {
      ...GROUP_LABELS.management,
    },
  },
  access: {
    admin: authenticated,
    read: authenticated,
    create: authenticated,
    update: authenticated,
    // Deleting the subscriber list is irreversible, so it follows the same rule as
    // every other destructive operation: admins only.
    delete: authenticatedAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      label: { en: 'Email', pt: 'Email' },
    },
    {
      name: 'locale',
      type: 'select',
      label: { en: 'Locale at signup', pt: 'Idioma na subscrição' },
      options: [
        { label: { en: 'Portuguese', pt: 'Português' }, value: 'pt' },
        { label: { en: 'English', pt: 'Inglês' }, value: 'en' },
      ],
    },
  ],
};
