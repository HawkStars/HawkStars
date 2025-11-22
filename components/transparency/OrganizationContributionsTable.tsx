'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { contributionColumns } from './config';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Contribution } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import Link from 'next/link';

type OrganizationContributionsTableProps = {
  data: PaginatedDocs<Contribution>;
};

const OrganizationContributionsTable = ({ data }: OrganizationContributionsTableProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');

  const { docs: contributions, hasNextPage, hasPrevPage, page } = data;

  const table = useReactTable({
    data: contributions || [],
    columns: contributionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

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

        <div className='mt-4 flex justify-center lg:mt-8'>
          {hasPrevPage && (
            <Link href={`${window.location.pathname}?page=${page ? page - 1 : 1}`}></Link>
          )}
          {hasNextPage && (
            <Link href={`${window.location.pathname}?page=${page ? page + 1 : 2}`}></Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationContributionsTable;
