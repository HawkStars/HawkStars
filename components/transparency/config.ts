import { ContributionLabel, MoneyMovementLabel } from '@/utils/models/transparency';
import { Contribution, OrganizationMovement } from '@/utils/models/database';
import { createColumnHelper } from '@tanstack/react-table';
import i18next from 'i18next';
import { ConfirmLabel } from '@/utils/models/common';

export type TransparencyContribution = Pick<
  Contribution,
  'contribution_date' | 'donor' | 'is_anonymous' | 'id' | 'value' | 'type'
>;

const columnContributionHelper = createColumnHelper<TransparencyContribution>();

const contributionColumns = [
  columnContributionHelper.accessor('contribution_date', {
    header: () => i18next.t('contribute:contribution_form.date'),
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor('type', {
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

const columnMovementsHelper = createColumnHelper<OrganizationMovement>();

const orgsMovementsColumn = [
  columnMovementsHelper.accessor('movement_date', {
    header: () => i18next.t('contribute:movement_form.date'),
    cell: (info) => info.getValue(),
  }),
  columnMovementsHelper.accessor('type', {
    header: () => i18next.t('contribute:movement_form.type'),
    cell: (info) => i18next.t(MoneyMovementLabel[info.getValue()]),
  }),
  columnMovementsHelper.accessor('value', {
    header: () => i18next.t('contribute:movement_form.value'),
    cell: (info) => `${info.getValue()}€`,
  }),
  columnMovementsHelper.accessor('description', {
    header: () => i18next.t('contribute:movement_form.description'),
    cell: (info) => info.getValue(),
  }),
  columnMovementsHelper.accessor('paid', {
    header: () => i18next.t('contribute:movement_form.paid'),
    cell: (info) => (info.renderValue() ? i18next.t(ConfirmLabel.YES) : i18next.t(ConfirmLabel.NO)),
  }),
];

export { contributionColumns, orgsMovementsColumn };
