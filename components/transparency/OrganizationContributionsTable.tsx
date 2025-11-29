'use client';

import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Contribution } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

type OrganizationContributionsTableProps = {
  data: PaginatedDocs<Contribution>;
};

const OrganizationContributionsTable = ({ data }: OrganizationContributionsTableProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');

  const { docs: contributions, hasNextPage, hasPrevPage, page } = data;

  return (
    <div className='flex flex-col gap-4 px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='text-h2_bold'>{t('Contributions')}</h2>
      <div className='-mx-7 overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('contribute:contribution_form.date')}</TableHead>
              <TableHead>{t('contribute:contribution_form.type')}</TableHead>
              <TableHead>{t('contribute:contribution_form.donor')}</TableHead>
              <TableHead>{t('contribute:contribution_form.value')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell className='min-w-40 px-2'>
                  {new Date(contribution.contribution_date).toLocaleDateString(lng)}
                </TableCell>
                <TableCell className='min-w-40 px-2'>{contribution.contribution_type}</TableCell>
                <TableCell className='min-w-40 px-2'>
                  {contribution.is_anonymous ? t('Anonymous') : contribution.donor}
                </TableCell>
                <TableCell className='min-w-40 px-2'>
                  {contribution.value.toLocaleString(lng, {})}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
