'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TransparencyContribution, contributionColumns } from './config';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import Button from '../utils/Button';
import Spinner from '../utils/Spinner/Spinner';
import { Contribution } from '@/payload-types';

const OrganizationContributionsTable = () => {
  const [nextContribution, setNextContribution] = useState<Pick<
    Contribution,
    'id' | 'updatedAt'
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [organizationContributions, setOrganizationContributions] = useState<{
    count: number;
    items: TransparencyContribution[];
  }>({
    count: 0,
    items: [],
  });

  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');

  // const fetchOrganizationData = async () => {
  //   const contributions = await getOrganizationContributions();
  //   const lastFetchedContribution = contributions.items[contributions.items.length - 1];
  //   setNextContribution(lastFetchedContribution);
  //   setOrganizationContributions(contributions);
  // };

  // const nextBatchOfContributions = async () => {
  //   if (!nextContribution) return;
  //   setLoading(true);
  //   const contributions = await loadMoreContributions(
  //     nextContribution.id,
  //     nextContribution.updatedAt
  //   );
  //   setOrganizationContributions((current) => ({
  //     ...current,
  //     items: [...current.items, ...contributions],
  //   }));
  //   setLoading(false);
  // };

  const table = useReactTable({
    data: organizationContributions.items,
    columns: contributionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // useEffect(() => {
  //   fetchOrganizationData();
  // }, []);

  return (
    <div className='flex flex-col gap-4 px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='text-h2_bold'>{t('Contributions')}</h2>
      <div className='-mx-7 overflow-x-auto'>
        <table className='min-w-full table-auto rounded-xl text-left lg:table-fixed'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='border-bege-dark my-2 border-b'>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className='min-w-40 p-2'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='border-bege-dark border-b'>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='min-w-40 px-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div className='mt-4 flex justify-center lg:mt-8'>
          {organizationContributions.items.length < organizationContributions.count && !loading && (
            <Button type='button' onClick={nextBatchOfContributions}>
              {t('load_more')}
            </Button>
          )}
          <div>{loading && <Spinner />}</div>
        </div> */}
      </div>
    </div>
  );
};

export default OrganizationContributionsTable;
