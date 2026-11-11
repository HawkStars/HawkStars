import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { HawkStarsSection, PageHero, PageLoading } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { DocumentList } from '@/components/reports/DocumentList';
import { ValuesGridBlock } from '@/payload/blocks/ValuesGridBlock/Component';
import { getImpactReports } from '@/lib/payload/queries/impactReport';
import { getMetadataPageInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { LanguagePageProps } from '../types';

const DOCUMENT_KEYS = [
  'activityReport',
  'accountsReport',
  'fiscalCouncilOpinion',
  'activityPlan',
] as const;

const STEP_ICONS = ['LuUsers', 'LuScale', 'LuVote'] as const;

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'reports');
}

const ReportsPage = (props: LanguagePageProps) => (
  <Suspense fallback={<PageLoading />}>
    <ReportsContent params={props.params} />
  </Suspense>
);

export default ReportsPage;

const ReportsContent = async ({ params }: { params: LanguagePageProps['params'] }) => {
  const { lng: rawLng } = await params;
  const lng = rawLng as Language;
  const [{ t }, reports] = await Promise.all([
    getServerTranslation(lng, 'impact'),
    getImpactReports(lng),
  ]);

  return (
    <>
      <PageHero
        eyebrow={t('reports.eyebrow')}
        title={t('reports.title')}
        description={t('reports.description')}
        actions={
          <Button asChild variant='outline' size='lg'>
            <Link href={transformUrl(lng, SITE_GET_URLS.transparency)}>
              {t('reports.transparency_cta')}
            </Link>
          </Button>
        }
      />

      <HawkStarsSection spacing='default'>
        {reports.length === 0 ? (
          <p className='text-body text-black/70'>{t('reports.empty')}</p>
        ) : (
          <div className='flex flex-col gap-12'>
            {reports.map((report) => (
              <section
                key={report.id}
                aria-labelledby={`report-${report.year}`}
                className='grid grid-cols-1 gap-6 lg:grid-cols-[12rem_1fr] lg:gap-12'
              >
                <div className='flex flex-row items-baseline justify-between gap-4 lg:flex-col lg:justify-start'>
                  <h2
                    id={`report-${report.year}`}
                    className='font-display text-green text-6xl leading-none font-semibold'
                  >
                    {report.year}
                  </h2>
                  <Link
                    href={transformUrl(lng, `${SITE_GET_URLS.impact}/${report.year}`)}
                    className='text-green group flex items-center gap-1.5 text-sm font-semibold'
                  >
                    {t('reports.impact_link', { year: report.year })}
                    <LuArrowRight
                      aria-hidden='true'
                      className='size-4 transition-transform group-hover:translate-x-0.5'
                    />
                  </Link>
                </div>
                <DocumentList
                  downloadLabel={t('documents.download')}
                  unavailableLabel={t('documents.unavailable')}
                  items={DOCUMENT_KEYS.map((key) => ({
                    key,
                    label: t(`documents.${key}`),
                    document: report.documents?.[key],
                  }))}
                />
              </section>
            ))}
          </div>
        )}
      </HawkStarsSection>

      <ValuesGridBlock
        blockType='valuesGrid'
        title={t('reports.governance_title')}
        subtitle={t('reports.governance_text')}
        columns='3'
        background='bege'
        numbered
        items={STEP_ICONS.map((icon, index) => ({
          id: String(index),
          icon,
          title: t(`reports.steps.${index + 1}.title`),
          description: t(`reports.steps.${index + 1}.description`),
        }))}
      />
    </>
  );
};
