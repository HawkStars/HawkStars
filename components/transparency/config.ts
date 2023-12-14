import { ContributionLabel } from '@/models/custom_types';
import { Contribution, OrganizationMovement } from '@/models/database';
import { createColumnHelper } from '@tanstack/react-table';
import i18next from 'i18next';

const columnContributionHelper = createColumnHelper<Contribution>();

const contributionColumns = [
  columnContributionHelper.accessor('donor', {
    header: () => 'Donor',
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor('type', {
    header: () => 'Type',
    cell: (info) => ContributionLabel[info.getValue()],
  }),
  columnContributionHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor('contribution_date', {
    header: 'Status',
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
    cell: (info) => info.renderValue(),
  }),
  columnMovementsHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => info.getValue(),
  }),
  columnMovementsHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnMovementsHelper.accessor('paid', {
    header: 'Paid',
    cell: (info) => (info.renderValue() ? 'True' : 'False'),
  }),
];

export { contributionColumns, orgsMovementsColumn };
