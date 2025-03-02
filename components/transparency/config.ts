import { ContributionLabel, MoneyMovementLabel } from '@/utils/models/transparency';

import { createColumnHelper } from '@tanstack/react-table';
import i18next from 'i18next';
import { Contribution } from '@/projects/sanity/sanity.types';

export type TransparencyContribution = Pick<
  Contribution,
  'contribution_date' | 'donor' | 'is_anonymous' | '_id' | 'value' | 'contribution_type'
>;

const columnContributionHelper = createColumnHelper<TransparencyContribution>();

const contributionColumns = [
  columnContributionHelper.accessor('contribution_date', {
    header: () => i18next.t('contribute:contribution_form.date'),
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor('contribution_type', {
    header: () => i18next.t('contribute:contribution_form.type'),
    cell: (info) => i18next.t(ContributionLabel[info.getValue()]),
  }),
  columnContributionHelper.accessor('donor', {
    header: () => i18next.t('contribute:contribution_form.donor'),
    cell: (info) =>
      info.getValue() ? info.getValue() : i18next.t('contribute:contribution_form.anonymous_donor'),
  }),
  columnContributionHelper.accessor('value', {
    header: () => i18next.t('contribute:contribution_form.value'),
    cell: (info) => `${info.getValue()}€`,
  }),
];

export { contributionColumns };
