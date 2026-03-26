import { authenticated } from '@/payload/access/authenticated';
import { AccessArgs, CollectionConfig } from 'payload';
import { contributionTypeOptions } from './config';
import { User } from '@/payload-types';
import { notifyOnContribution } from '@/payload/hooks/notifyOnContribution';

const validateContributionAccess = (args: AccessArgs<User>) => authenticated(args);

export const ContributionCollection: CollectionConfig = {
  slug: 'contributions',
  access: {
    read: () => true,
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
    {
      type: 'collapsible',
      label: 'Payment Details (EasyPay)',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'text',
          name: 'transaction_key',
          label: 'Transaction Key',
          admin: { description: 'UUID key used to identify this payment in EasyPay' },
        },
        {
          type: 'text',
          name: 'easypay_id',
          label: 'EasyPay ID',
          admin: { description: 'EasyPay authorisation or payment ID' },
        },
        {
          type: 'select',
          name: 'payment_method',
          label: 'Payment Method',
          options: [
            { label: 'Credit Card (CC)', value: 'CC' },
            { label: 'Multibanco (MB)', value: 'MB' },
            { label: 'MB Way (MBW)', value: 'MBW' },
          ],
          admin: { description: 'Payment method used in EasyPay' },
        },
      ],
    },
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
    description:
      'Track all donations and contributions to HawkStars. Record donor details, amounts (EUR), and contribution type (chairs, wall names, bank transfers, etc.). Mark the "Payment is Confirmed" checkbox once payment is verified.',
  },
  hooks: {
    afterChange: [notifyOnContribution],
  },
};
