import { Contribution, Profile } from '@/models/database';
import { ContributionLabel } from '@/models/transparency';
import { createColumnHelper } from '@tanstack/react-table';
import i18next from 'i18next';

export type ContributionWithConfirmed = Contribution & {
  profile: Pick<Profile, 'name'> | null;
};

console.log(i18next.t('contribute:options.auditorium_chair'));

const columnContributionHelper =
  createColumnHelper<ContributionWithConfirmed>();

const superadminContributionColumns = [
  columnContributionHelper.accessor('contribution_date', {
    header: () => 'Contribution Date',
    cell: (info) => info.getValue(),
  }),
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
    cell: (info) => `${info.getValue()}€`,
  }),
  columnContributionHelper.accessor('description', {
    header: () => 'Description',
    cell: (info) => info.getValue(),
  }),
  columnContributionHelper.accessor((row) => row?.profile?.name || '', {
    id: 'confirmed_by',
    header: () => 'Confirmado Por:',
    cell: (info) => info.getValue(),
  }),
];

export { superadminContributionColumns };
