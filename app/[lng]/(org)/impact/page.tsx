import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { HawkStarsSection, PageHero, PageLoading } from '@/components/layout';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/SectionHeader';
import { ReportCard } from '@/components/reports/ReportCard';
import { getImpactReports } from '@/lib/payload/queries/impactReport';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { LanguagePageProps } from '../types';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'impact');
}

const ImpactPage = (props: LanguagePageProps) => (
  <Suspense fallback={<PageLoading />}>
    <ImpactContent params={props.params} />
  </Suspense>
);

export default ImpactPage;

const ImpactContent = async ({ params }: { params: LanguagePageProps['params'] }) => {
  const { lng: rawLng } = await params;
  const lng = rawLng as Language;
  const [{ t }, reports] = await Promise.all([
    getServerTranslation(lng, 'impact'),
    getImpactReports(lng),
  ]);
  const [latest, ...older] = reports;
  const href = (year: number) => transformUrl(lng, `${SITE_GET_URLS.impact}/${year}`);

  return (
    <>
      <PageHero
        variant='green'
        eyebrow={t('list.eyebrow')}
        title={
          <>
            {t('list.title_pre')}{' '}
            <span className='text-bege-dark'>{t('list.title_highlight')}</span>
          </>
        }
        description={t('list.description')}
        actions={
          <Button asChild variant='outline-inverse' size='xl'>
            <Link href={transformUrl(lng, SITE_GET_URLS.reports)}>{t('list.reports_cta')}</Link>
          </Button>
        }
      />

      <HawkStarsSection spacing='default'>
        {!latest ? (
          <p className='text-body text-black/70'>{t('list.empty')}</p>
        ) : (
          <div className='flex flex-col gap-14'>
            <div>
              <SectionHeader reveal eyebrow={t('list.latest')} className='mb-6' />
              <ReportCard
                report={latest}
                href={href(latest.year)}
                readLabel={t('list.read')}
                featured
              />
            </div>

            {older.length > 0 && (
              <div>
                <SectionHeader reveal title={t('list.all')} className='mb-8' />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {older.map((report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      href={href(report.year)}
                      readLabel={t('list.read')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </HawkStarsSection>
    </>
  );
};
