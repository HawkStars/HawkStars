'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { Contributions } from '@/models/database';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import {
  ContributionWithConfirmed,
  superadminContributionColumns,
} from './config';
import { useTranslation } from '@/i18n/client';
import { useMainAppContext } from '@/contexts/AppProvider';

const getAllContributions = async () => {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .select('*, profile:profiles(name)');

  if (error) return [];
  return data;
};

const DashboardFormList = () => {
  const { lng } = useMainAppContext();
  const { t } = useTranslation(lng, 'contribute');
  const [contributions, setContributions] = useState<
    ContributionWithConfirmed[]
  >([]);

  const initListContributions = async () => {
    const data = await getAllContributions();
    setContributions(data);
  };

  const table = useReactTable({
    data: contributions,
    columns: superadminContributionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    initListContributions();
  }, []);

  const rows = table.getRowModel().rows;

  return (
    <section className='mt-5 overflow-x-auto'>
      <table className='min-w-full table-auto border-separate border-spacing-y-1 text-left text-sm font-light'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='min-w-40 py-2 text-start'>
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
          {rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='min-w-40'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows || (rows.length == 0 && <p>Sem Contribuições</p>)}
    </section>
  );
};

export default DashboardFormList;
