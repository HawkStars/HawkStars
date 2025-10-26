import type { AccessArgs, CollectionConfig } from 'payload';
import { SocialLinksField } from '../fields/objects/SocialLink';
import { User } from '@/payload-types';
import { authenticated } from '../access/authenticated';
import { onlyPortugueseLocale } from '../access/onlyPortugueseLocale';

const validateContributionAccess = (args: AccessArgs<User>) =>
  authenticated(args) && onlyPortugueseLocale(args);

export const BoardMember: CollectionConfig = {
  slug: 'board-members',
  labels: {
    singular: 'Board Member',
    plural: 'Board Members',
  },
  access: {
    read: validateContributionAccess,
    create: validateContributionAccess,
    update: validateContributionAccess,
    admin: validateContributionAccess,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'section', 'position'],
    description: 'Board Members of the Association',
    listSearchableFields: ['name', 'title', 'section'],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      localized: false,
    },
    {
      name: 'section',
      label: 'Section',
      type: 'radio',
      required: true,
      localized: false,
      admin: {
        description: 'Section out of the three that is to add the member',
      },
      options: [
        { label: 'Assembleia Geral', value: 'geral' },
        { label: 'Conselho Fiscal', value: 'fiscal' },
        { label: 'Direção', value: 'board' },
      ],
    },
    {
      name: 'title',
      label: 'Position Title',
      type: 'select',
      required: true,
      localized: false,
      options: [
        { label: 'Presidente', value: 'president' },
        { label: 'Vice-Presidente', value: 'vice_president' },
        { label: 'Vogal', value: 'vogal' },
        { label: 'Secretária', value: 'f_secretary' },
        { label: 'Secretário', value: 'm_secretary' },
        { label: 'Suplente', value: 'substitute' },
        { label: 'Tesoureiro', value: 'treasurer' },
        { label: 'Secretário Relator', value: 'rapporteur_secretary' },
      ],
    },
    {
      name: 'photo',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
    },
    { ...SocialLinksField },
    {
      name: 'position',
      label: 'Position',
      type: 'number',
      admin: {
        description: 'Position to be ordered to be shown on the page',
        step: 1,
      },
      required: true,
    },
  ],
};
