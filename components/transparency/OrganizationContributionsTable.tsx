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

const getOrganizationContributions = async () => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .select()
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  return data;
};

const OrganizationContributionsTable = () => {
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
    <div>
      <table>
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
