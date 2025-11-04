import { authenticated } from '@/payload/access/authenticated';
import { AccessArgs, CollectionConfig } from 'payload';
import { contributionTypeOptions } from './config';
import { User } from '@/payload-types';

const validateContributionAccess = (args: AccessArgs<User>) => authenticated(args);

export const ContributionCollection: CollectionConfig = {
  slug: 'contributions',
  access: {
    read: authenticated,
    create: validateContributionAccess,
    update: validateContributionAccess,
    admin: validateContributionAccess,
  },
  fields: [
    { type: 'text', name: 'donor', label: 'The name of the donor' },
    {
      type: 'checkbox',
      name: 'is_confirmed',
      label: 'Payment is Confirmed',
      defaultValue: false,
    },
    {
      type: 'checkbox',
      name: 'is_anonymous',
      label: 'Donor is anonymous',
      defaultValue: false,
    },
    {
      type: 'number',
      name: 'value',
      label: 'Donation Value',
      required: true,
      validate: (value: number | undefined | null) =>
        (value && value > 0) || 'Value must be greater than 0',
    },
    { type: 'date', name: 'contribution_date', label: 'Contribution Date', required: true },
    {
      type: 'select',
      name: 'contribution_type',
      label: 'Contribution Type',
      required: true,
      options: contributionTypeOptions,
      admin: {
        components: {
          Field: '@/components/payload/ContributionSelect',
        },
      },
    },
    { type: 'text', name: 'extra_info', label: 'Extra Information' },
  ],
  defaultSort: '-contribution_date',
  admin: {
    defaultColumns: [
      'donor',
      'value',
      'contribution_type',
      'is_confirmed',
      'contribution_date',
      'is_anonymous',
    ],
  },
};
