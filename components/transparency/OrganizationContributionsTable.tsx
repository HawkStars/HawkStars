import { Contribution } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LanguageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import { toIntlLocale } from '@/i18n/settings';
import LandingPagination from '../utils/Pagination';

type OrganizationContributionsTableProps = LanguageProps & {
  data: PaginatedDocs<Contribution>;
};

const OrganizationContributionsTable = async ({
  data,
  lng,
}: OrganizationContributionsTableProps) => {
  // Three namespaces are in play here: `transparency` for this table's own
  // copy, `contribute` for the shared contribution-form labels, and `common`
  // for <LandingPagination>, whose `pagination.*` keys live there.
  const [{ t }, { t: tCommon }] = await Promise.all([
    getServerTranslation(lng, ['transparency', 'contribute']),
    getServerTranslation(lng, 'common'),
  ]);
  // 'pt'/'en' aren't guaranteed valid Intl locale tags on their own for every
  // call site, and an unsupported `lng` must never reach Intl directly (it
  // throws `RangeError: Incorrect locale information provided`) — see
  // i18n/settings.ts.
  const intlLocale = toIntlLocale(lng);

  const { docs: contributions, hasNextPage, hasPrevPage, page, totalPages, limit } = data;

  return (
    <div className='flex flex-col gap-4 px-8 py-8 lg:px-40 lg:py-20'>
      <h2 className='text-h2_bold'>{t('contributions_title')}</h2>
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
                  {contribution.is_anonymous
                    ? t('contribute:contribution_form.anonymous_donor')
                    : contribution.donor}
                </TableCell>
                <TableCell className='min-w-40 px-2'>
                  {contribution.value.toLocaleString(intlLocale, {})}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <LandingPagination
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          page={page}
          t={tCommon}
          lng={lng}
          totalPages={totalPages}
          url={'/transparency'}
          limit={limit}
        />
      </div>
    </div>
  );
};

export default OrganizationContributionsTable;
