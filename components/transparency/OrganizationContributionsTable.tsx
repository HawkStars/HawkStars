'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contributions } from '@/models/database';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { TransparencyContribution, contributionColumns } from './config';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/hooks/useLanguageCookie';

const getOrganizationContributions = async () => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .select('id, contribution_date, donor, is_anonymous, type, value')
    .not('confirmed_by', 'is', null)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return data;
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
    <div className='flex flex-col gap-2 overflow-x-auto'>
      <h2 className='text-green'>{t('Contributions')}</h2>
      <table className='min-w-full table-auto border-separate border-spacing-y-1 rounded-xl border border-bege-dark p-4 text-left text-sm font-light lg:table-fixed'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
            <tr key={row.id}>
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
  );
};

export default OrganizationContributionsTable;
