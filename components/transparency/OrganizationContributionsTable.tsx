'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contribution, Contributions } from '@/models/database';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { contributionColumns } from './config';
import { useTranslation } from '@/i18n/client';
import { useMainAppContext } from '@/contexts/AppProvider';

const getOrganizationContributions = async () => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .select()
    .not('confirmed_by', 'eq', null)
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return data;
};

const OrganizationContributionsTable = () => {
  const { lng } = useMainAppContext();
  const { t } = useTranslation(lng, 'contribute');
  const [organizationContributions, setOrganizationContributions] = useState<
    Contribution[]
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
    <div className='flex flex-col gap-2'>
      <h2 className='text-green'>{t('Contributions')}</h2>
      <table className='min-w-full table-auto border-separate border-spacing-y-1 text-left text-sm font-light'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default OrganizationContributionsTable;
