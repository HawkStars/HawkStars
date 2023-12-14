import { Contribution, OrganizationMovement } from '@/models/database';
import { createColumnHelper } from '@tanstack/react-table';

const columnContributionHelper = createColumnHelper<Contribution>();

const contributionColumns = [
  columnContributionHelper.accessor('donor', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnContributionHelper.accessor('type', {
    header: () => 'Type',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnContributionHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnContributionHelper.accessor('contribution_date', {
    header: 'Status',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

const columnMovementsHelper = createColumnHelper<OrganizationMovement>();

const orgsMovementsColumn = [
  columnMovementsHelper.accessor('movement_date', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnMovementsHelper.accessor('type', {
    header: () => 'Type',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnMovementsHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnMovementsHelper.accessor('description', {
    header: 'Status',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnMovementsHelper.accessor('registered_by', {
    header: 'Status',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

export { contributionColumns, orgsMovementsColumn };
