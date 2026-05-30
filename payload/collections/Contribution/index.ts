import { authenticated } from '@/payload/access/authenticated';
import { AccessArgs, CollectionConfig } from 'payload';
import { contributionTypeOptions } from './config';
import { User } from '@/payload-types';
import { notifyOnContribution } from '@/payload/hooks/notifyOnContribution';

const validateContributionAccess = (args: AccessArgs<User>) => authenticated(args);

export const ContributionCollection: CollectionConfig = {
  slug: 'contributions',
  labels: {
    singular: { en: 'Contribution', pt: 'Contribuição' },
    plural: { en: 'Contributions', pt: 'Contribuições' },
  },
  access: {
    read: () => true,
    create: validateContributionAccess,
    update: validateContributionAccess,
    admin: validateContributionAccess,
  },
  fields: [
    {
      type: 'text',
      name: 'donor',
      label: { en: 'Donor Name', pt: 'Nome do Doador' },
      required: false,
      admin: { description: 'Leave blank for anonymous donations' },
    },
    {
      type: 'checkbox',
      name: 'is_confirmed',
      label: { en: 'Payment is Confirmed', pt: 'Pagamento Confirmado' },
      defaultValue: false,
      admin: { description: 'Check this box once the payment has been verified' },
    },
    {
      type: 'checkbox',
      name: 'is_anonymous',
      label: { en: 'Donor is anonymous', pt: 'Doador Anónimo' },
      defaultValue: false,
    },
    {
      type: 'number',
      name: 'value',
      label: { en: 'Donation Value', pt: 'Valor da Doação' },
      required: true,
      validate: (value: number | undefined | null) =>
        (value && value > 0) || 'Value must be greater than 0',
      admin: { description: 'The amount of the donation in EUR' },
    },
    {
      type: 'date',
      name: 'contribution_date',
      label: { en: 'Contribution Date', pt: 'Data da Contribuição' },
      required: true,
      admin: { description: 'The date when the contribution was made' },
    },
    {
      type: 'select',
      name: 'contribution_type',
      label: { en: 'Contribution Type', pt: 'Tipo de Contribuição' },
      required: true,
      options: contributionTypeOptions,
      admin: {
        components: {
          Field: '@/components/payload/ContributionSelect',
        },
        description:
          'The type of contribution (e.g. chair donation, wall name, bank transfer, etc.)',
      },
    },
    {
      type: 'json',
      name: 'extra_info',
      label: { en: 'Extra Information', pt: 'Informação Extra' },
      admin: { description: 'Any additional information about the contribution' },
    },
    {
      type: 'collapsible',
      label: { en: 'Payment Details (EasyPay)', pt: 'Detalhes de Pagamento (EasyPay)' },
      admin: { initCollapsed: true },
      access: {
        read: () => true,
        create: () => false,
        update: () => false,
      },
      fields: [
        {
          type: 'text',
          name: 'transaction_key',
          label: { en: 'Transaction Key', pt: 'Chave de Transação' },
          admin: { description: 'UUID key used to identify this payment in EasyPay' },
        },
        {
          type: 'text',
          name: 'easypay_id',
          label: { en: 'EasyPay ID', pt: 'ID EasyPay' },
          admin: { description: 'EasyPay authorisation or payment ID' },
        },
        {
          type: 'select',
          name: 'payment_method',
          label: { en: 'Payment Method', pt: 'Método de Pagamento' },
          options: [
            { label: 'Cartão de Crédito (CC)', value: 'CC' },
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
