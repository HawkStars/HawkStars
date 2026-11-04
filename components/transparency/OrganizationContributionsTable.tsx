import { Contribution } from '@/payload-types';
import type { PaginatedDocs } from 'payload';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LanguageProps } from '../types';
import { getServerTranslation } from '@/i18n';
import LandingPagination from '../utils/Pagination';
import { formatCurrency } from '@/lib/utils/currency';
import { HawkStarsSection } from '@/components/layout';
import { formatDate } from '@/utils/date';

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

  const { docs: contributions, hasNextPage, hasPrevPage, page, totalPages, limit } = data;

  return (
    <HawkStarsSection spacing='default'>
      <div className='flex flex-col gap-4'>
        <h2 className='text-h2_bold'>{t('contributions_title')}</h2>
        <div className='-mx-4 overflow-x-auto sm:mx-0'>
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
                    {formatDate(contribution.contribution_date, lng)}
                  </TableCell>
                  {/* The stored value is an enum key ('OFFICE_CHAIR', 'WALL_NAME_COMPANY').
                    The human labels existed only in the admin field component, so this
                    public table rendered the raw keys in both locales. */}
                  <TableCell className='min-w-40 px-2'>
                    {contribution.contribution_type
                      ? t(`contribution_type.${contribution.contribution_type}`, {
                          defaultValue: contribution.contribution_type,
                        })
                      : ''}
                  </TableCell>
                  <TableCell className='min-w-40 px-2'>
                    {contribution.is_anonymous
                      ? t('contribute:contribution_form.anonymous_donor')
                      : contribution.donor}
                  </TableCell>
                  <TableCell className='min-w-40 px-2'>
                    {/* An empty options object meant no currency symbol and no fixed
                      fraction digits, so €1500.50 rendered as "1500,5". */}
                    {formatCurrency(contribution.value, lng)}
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
    </HawkStarsSection>
  );
};

export default OrganizationContributionsTable;
