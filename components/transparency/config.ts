import { ContributionLabel, MoneyMovementLabel } from '@/models/transparency';
import { Contribution, OrganizationMovement } from '@/models/database';
import { createColumnHelper } from '@tanstack/react-table';
import i18next from 'i18next';
import { ConfirmLabel } from '@/models/common';

const columnContributionHelper = createColumnHelper<Contribution>();

const contributionColumns = [
  columnContributionHelper.accessor('type', {
    header: () => 'Type',
    cell: (info) => i18next.t(ContributionLabel[info.getValue()]),
  }),
  columnContributionHelper.accessor('donor', {
    header: () => 'Donor',
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor('contribution_date', {
    header: 'Data Contribuição',
    cell: (info) => info.getValue(),
  }),
];

const columnMovementsHelper = createColumnHelper<OrganizationMovement>();

const orgsMovementsColumn = [
  columnMovementsHelper.accessor('movement_date', {
    header: () => 'Movement Date',
    cell: (info) => info.getValue(),
  }),
  columnMovementsHelper.accessor('type', {
    header: () => 'Type',
    cell: (info) => i18next.t(MoneyMovementLabel[info.getValue()]),
  }),
  columnMovementsHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => `${info.getValue()}€`,
  }),
  columnMovementsHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnMovementsHelper.accessor('paid', {
    header: 'Paid',
    cell: (info) =>
      info.renderValue()
        ? i18next.t(ConfirmLabel.YES)
        : i18next.t(ConfirmLabel.NO),
  }),
];

export { contributionColumns, orgsMovementsColumn };
