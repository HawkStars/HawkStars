'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TransparencyContribution, contributionColumns } from './config';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { sanityFetch } from '@/lib/sanity/sanityClient';
import {
  firstPageContributionByTypeQuery,
  nextPageContributionByTypeQuery,
  totalMoneyGatheredQuery,
} from '@/projects/sanity/types/queries/contribution';
import { prepareSanityObjectQuery } from '@/lib/sanity/helpers';

const getOrganizationContributions = async () => {
  return await sanityFetch({
    query: prepareSanityObjectQuery({
      items: firstPageContributionByTypeQuery,
      count: totalMoneyGatheredQuery,
    }),
    revalidate: 86400,
  });
};

const loadMoreContributions = async (lastId: string) => {
  return await sanityFetch({
    query: nextPageContributionByTypeQuery,
  });
};

const OrganizationContributionsTable = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const [loading, setLoading] = useState(true);
  const [organizationContributions, setOrganizationContributions] = useState<{
    count: number;
    items: TransparencyContribution[];
  }>({
    count: 0,
    items: [],
  });

  const fetchOrganizationData = async () => {
    const contributions = await getOrganizationContributions();
    setOrganizationContributions(contributions);
  };

  const table = useReactTable({
    data: organizationContributions.items,
    columns: contributionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  return (
    <div className='flex flex-col gap-4 px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='text-h2_bold'>{t('Contributions')}</h2>
      <div className='-mx-7 overflow-x-auto'>
        <table className='min-w-full table-auto rounded-xl text-left lg:table-fixed'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='my-2 border-b border-bege-dark'>
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
              <tr key={row.id} className='border-b border-bege-dark'>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='min-w-40 px-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* <Button className='mx-auto'></Button> */}
      </div>
    </div>
  );
};

export default OrganizationContributionsTable;
