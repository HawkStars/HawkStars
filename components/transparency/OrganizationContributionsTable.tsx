import { Contribution } from '@/payload-types';
import type { PaginatedDocs } from 'payload';
import { LuHandCoins } from 'react-icons/lu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LanguageProps } from '@/components/types';
import { getServerTranslation } from '@/i18n';
import LandingPagination from '@/components/utils/Pagination';
import SectionHeader from '@/components/ui/SectionHeader';
import ListingEmpty from '@/components/shared/ListingEmpty';
import { cn } from '@/lib/utils';
import { SITE_GET_URLS } from '@/utils/paths';
import { CONTRIBUTION_COLOR } from './config';
import { formatCurrency } from '@/lib/utils/currency';
import { HawkStarsSection } from '@/components/layout';
import { formatDate } from '@/utils/date';

const HEAD = 'text-eyebrow h-11 px-4 text-black/70';

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
    <HawkStarsSection spacing='default' className='bg-bege-light'>
      <SectionHeader
        title={t('contributions_title')}
        subtitle={t('contributions_subtitle')}
        className='mb-8'
      />
      {contributions.length === 0 ? (
        <ListingEmpty title={t('empty')} icon={LuHandCoins} />
      ) : (
        <div className='card overflow-hidden bg-white'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-bege-dark hover:bg-bege-dark border-0'>
                  <TableHead className={HEAD}>{t('contribute:contribution_form.date')}</TableHead>
                  <TableHead className={HEAD}>{t('contribute:contribution_form.type')}</TableHead>
                  <TableHead className={HEAD}>{t('contribute:contribution_form.donor')}</TableHead>
                  <TableHead className={cn(HEAD, 'text-right')}>
                    {t('contribute:contribution_form.value')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((contribution) => (
                  <TableRow
                    key={contribution.id}
                    className='border-bege-dark hover:bg-bege-light/70'
                  >
                    <TableCell className='min-w-36 px-4 py-3 text-black/70 tabular-nums'>
                      {formatDate(contribution.contribution_date, lng)}
                    </TableCell>
                    {/* The stored value is an enum key ('OFFICE_CHAIR', 'WALL_NAME_COMPANY');
                        the dot matches its segment in the progress bar above. */}
                    <TableCell className='min-w-48 px-4 py-3'>
                      {contribution.contribution_type && (
                        <span className='inline-flex items-center gap-2'>
                          <span
                            aria-hidden='true'
                            className={cn(
                              'size-2.5 shrink-0 rounded-sm',
                              CONTRIBUTION_COLOR[contribution.contribution_type]
                            )}
                          />
                          {t(`contribution_type.${contribution.contribution_type}`, {
                            defaultValue: contribution.contribution_type,
                          })}
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'min-w-40 px-4 py-3',
                        contribution.is_anonymous ? 'text-black/55 italic' : 'font-medium'
                      )}
                    >
                      {contribution.is_anonymous
                        ? t('contribute:contribution_form.anonymous_donor')
                        : contribution.donor}
                    </TableCell>
                    <TableCell className='min-w-32 px-4 py-3 text-right font-semibold tabular-nums'>
                      {formatCurrency(contribution.value, lng)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className='mt-8'>
          <LandingPagination
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            page={page}
            t={tCommon}
            lng={lng}
            totalPages={totalPages}
            url={SITE_GET_URLS.transparency}
            limit={limit}
          />
        </div>
      )}
    </HawkStarsSection>
  );
};

export default OrganizationContributionsTable;
