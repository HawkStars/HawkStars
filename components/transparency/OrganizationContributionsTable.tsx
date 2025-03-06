'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TransparencyContribution, contributionColumns } from './config';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { sanityFetch } from '@/lib/sanity/sanityClient';
import { contributionByTypeQuery } from '@/projects/sanity/models/types/groq/contribution';

const getOrganizationContributions = async () => {
  return await sanityFetch({ query: contributionByTypeQuery });
};

const OrganizationContributionsTable = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const [organizationContributions, setOrganizationContributions] = useState<
    TransparencyContribution[]
  >([]);

  const fetchOrganizationData = async () => {
    const contributions = await getOrganizationContributions();
    setOrganizationContributions(contributions);
  };

  const table = useReactTable({
    data: organizationContributions,
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
      </div>
    </div>
  );
};

export default OrganizationContributionsTable;
