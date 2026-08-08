import { Contribution } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LanguageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import { toIntlLocale } from '@/i18n/settings';

type OrganizationContributionsTableProps = LanguageProps & {
  data: PaginatedDocs<Contribution>;
};

const OrganizationContributionsTable = async ({
  data,
  lng,
}: OrganizationContributionsTableProps) => {
  const { t } = await getServerTranslation(lng, 'contribute');
  // 'pt'/'en' aren't guaranteed valid Intl locale tags on their own for every
  // call site, and an unsupported `lng` must never reach Intl directly (it
  // throws `RangeError: Incorrect locale information provided`) — see
  // i18n/settings.ts.
  const intlLocale = toIntlLocale(lng);

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
                  {new Date(contribution.contribution_date).toLocaleDateString(intlLocale)}
                </TableCell>
                <TableCell className='min-w-40 px-2'>{contribution.contribution_type}</TableCell>
                <TableCell className='min-w-40 px-2'>
                  {contribution.is_anonymous ? t('Anonymous') : contribution.donor}
                </TableCell>
                <TableCell className='min-w-40 px-2'>
                  {contribution.value.toLocaleString(intlLocale, {})}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className='mt-4 flex justify-center lg:mt-8'>
          {/* This is a Server Component (it `await`s translations above), so
              `window` doesn't exist when it renders — referencing
              `window.location.pathname` here throws `ReferenceError: window
              is not defined` on the server. A query-only href resolves
              against the current path automatically. */}
          {hasPrevPage && <Link href={`?page=${page ? page - 1 : 1}`}></Link>}
          {hasNextPage && <Link href={`?page=${page ? page + 1 : 2}`}></Link>}
        </div>
      </div>
    </div>
  );
};

export default OrganizationContributionsTable;
