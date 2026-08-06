import { authenticated } from '@/payload/access/authenticated';
import { AccessArgs, CollectionConfig } from 'payload';
import { contributionTypeOptions } from './config';
import { User } from '@/payload-types';
import { notifyContribution, notifyContributionDelete } from './hooks';
import { createRevalidateHooks } from '@/payload/utilities/revalidateCollection';

const validateContributionAccess = (args: AccessArgs<User>) => authenticated(args);

export const CONTRIBUTION_CACHE_TAG = 'contributions' as const;
const { afterChange: revalidateContribution, afterDelete: revalidateContributionDelete } =
  createRevalidateHooks(CONTRIBUTION_CACHE_TAG);

export const ContributionCollection: CollectionConfig = {
  slug: 'contributions',
  labels: {
    singular: { en: 'Contribution', pt: 'Contribuição' },
    plural: { en: 'Contributions', pt: 'Contribuições' },
  },
  access: {
    // Contributions hold donor PII (name, and customer data / EasyPay keys in
    // extra_info). Public reads exposed all of it via /api/contributions.
    // Server-side rendering (donor wall, totals) uses the Local API
    // (getPayloadConfig().find), which bypasses access control, so restricting
    // this to authenticated users does not affect the public site.
    read: validateContributionAccess,
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
      admin: {
        description: {
          en: 'Leave blank for anonymous donations',
          pt: 'Deixe em branco para doações anónimas',
        },
      },
    },
    {
      type: 'checkbox',
      name: 'is_confirmed',
      label: { en: 'Payment is Confirmed', pt: 'Pagamento Confirmado' },
      defaultValue: false,
      index: true,
      admin: {
        description: {
          en: 'Check this box once the payment has been verified',
          pt: 'Marque esta caixa após verificar o pagamento',
        },
      },
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
      admin: {
        description: { en: 'The amount of the donation in EUR', pt: 'O valor da doação em EUR' },
      },
    },
    {
      type: 'date',
      name: 'contribution_date',
      label: { en: 'Contribution Date', pt: 'Data da Contribuição' },
      required: true,
      admin: {
        description: {
          en: 'The date when the contribution was made',
          pt: 'A data em que a contribuição foi efetuada',
        },
      },
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
        description: {
          en: 'The type of contribution (e.g. chair donation, wall name, bank transfer, etc.)',
          pt: 'O tipo de contribuição (ex: doação de cadeira, nome na parede, transferência bancária, etc.)',
        },
      },
    },
    {
      type: 'json',
      name: 'extra_info',
      label: { en: 'Extra Information', pt: 'Informação Extra' },
      admin: {
        description: {
          en: 'Any additional information about the contribution',
          pt: 'Qualquer informação adicional sobre a contribuição',
        },
      },
    },
    {
      type: 'collapsible',
      label: { en: 'Payment Details (EasyPay)', pt: 'Detalhes de Pagamento (EasyPay)' },
      admin: { initCollapsed: true },
      access: {
        read: ({ req: { user } }) => Boolean(user),
        create: () => false,
        update: () => false,
      },
      fields: [
        {
          type: 'text',
          name: 'transaction_key',
          label: { en: 'Transaction Key', pt: 'Chave de Transação' },
          index: true,
          admin: {
            description: {
              en: 'UUID key used to identify this payment in EasyPay',
              pt: 'Chave UUID usada para identificar este pagamento no EasyPay',
            },
          },
        },
        {
          type: 'text',
          name: 'easypay_id',
          label: { en: 'EasyPay ID', pt: 'ID EasyPay' },
          admin: {
            description: {
              en: 'EasyPay authorisation or payment ID',
              pt: 'ID de autorização ou pagamento EasyPay',
            },
          },
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
          admin: {
            description: {
              en: 'Payment method used in EasyPay',
              pt: 'Método de pagamento usado no EasyPay',
            },
          },
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
    description: {
      en: 'Track all donations and contributions to HawkStars. Record donor details, amounts (EUR), and contribution type (chairs, wall names, bank transfers, etc.). Mark the "Payment is Confirmed" checkbox once payment is verified.',
      pt: 'Registe todas as doações e contribuições para a HawkStars. Guarde detalhes do doador, valores (EUR) e tipo de contribuição (cadeiras, nomes na parede, transferências bancárias, etc.). Marque "Pagamento Confirmado" após verificar o pagamento.',
    },
  },
  hooks: {
    afterChange: [notifyContribution, revalidateContribution],
    afterDelete: [notifyContributionDelete, revalidateContributionDelete],
  },
  versions: true,
};
