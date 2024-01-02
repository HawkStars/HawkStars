'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { OrganizationMovement, OrganizationMovements } from '@/models/database';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { orgsMovementsColumn } from './config';

const getOrganizationMovements = async () => {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from<'organization_movements', OrganizationMovements>(
      'organization_movements'
    )
    .select()
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data;
};

const OrganizationMovementsTable = () => {
  const [organizationMovements, setOrganizationMovements] = useState<
    OrganizationMovement[]
  >([]);

  const fetchOrganizationData = async () => {
    const orgMovements = await getOrganizationMovements();
    setOrganizationMovements(orgMovements);
  };

  const table = useReactTable({
    data: organizationMovements,
    columns: orgsMovementsColumn,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  return (
    <div className='flex flex-col gap-4 overflow-x-scroll'>
      <h2 className='text-green'>Organization Movements</h2>
      <table className='min-w-full table-auto border-separate border-spacing-y-1 text-left text-sm font-light lg:table-fixed'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className='min-w-40 p-2'>
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

export default OrganizationMovementsTable;
