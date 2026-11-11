import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { LanguageProps } from '@/components/types';
import { HawkStarsSection, PageHero, PageLoading } from '@/components/layout';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/SectionHeader';
import { DocumentList } from '@/components/reports/DocumentList';
import { FinanceSummary } from '@/components/reports/FinanceSummary';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { TimelineBlock } from '@/payload/blocks/TimelineBlock/Component';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { SITE_NAME } from '@/lib/constants';
import { getImpactReportByYear, getImpactReports } from '@/lib/payload/queries/impactReport';
import { prepareMetadataInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import type { ImpactReport, StatsBlock as StatsBlockType } from '@/payload-types';

type ImpactYearProps = { params: Promise<LanguageProps & { year: string }> };

const DOCUMENT_KEYS = [
  'activityReport',
  'accountsReport',
  'fiscalCouncilOpinion',
  'activityPlan',
] as const;

const STATS_COLUMNS: Record<number, StatsBlockType['columns']> = { 1: '2', 2: '2', 3: '3' };

export async function generateMetadata(props: ImpactYearProps): Promise<Metadata> {
  const { lng, year } = await props.params;
  const report = await getImpactReportByYear(lng as Language, Number(year));
  if (!report) return { title: SITE_NAME, robots: { index: false, follow: false } };

  return prepareMetadataInfo({
    title: `${report.title} - ${SITE_NAME}`,
    description: report.summary?.slice(0, 160),
    image: report.coverImage,
    url: `${SITE_GET_URLS.impact}/${report.year}`,
    lng: lng as Language,
  });
}

const ImpactYearPage = (props: ImpactYearProps) => (
  <Suspense fallback={<PageLoading />}>
    <ImpactYearContent params={props.params} />
  </Suspense>
);

export default ImpactYearPage;

const ImpactYearContent = async ({ params }: { params: ImpactYearProps['params'] }) => {
  const { lng: rawLng, year: rawYear } = await params;
  const lng = rawLng as Language;
  const year = Number(rawYear);
  if (!Number.isInteger(year)) notFound();

  const [{ t }, report, allReports] = await Promise.all([
    getServerTranslation(lng, 'impact'),
    getImpactReportByYear(lng, year),
    getImpactReports(lng),
  ]);
  if (!report) notFound();

  const listHref = transformUrl(lng, SITE_GET_URLS.impact);
  const otherYears = allReports.filter((r) => r.year !== report.year).map((r) => r.year);

  return (
    <>
      <PageHero
        variant='green'
        eyebrow={`${t('detail.eyebrow')} · ${report.year}`}
        title={report.title}
        description={report.summary}
        actions={
          <Button asChild variant='outline-inverse' size='lg'>
            <Link href={listHref}>
              <LuArrowLeft aria-hidden='true' className='size-4' />
              {t('detail.back')}
            </Link>
          </Button>
        }
      >
        <Cover report={report} />
      </PageHero>

      <Numbers report={report} lng={lng} t={t} />

      {report.highlights && report.highlights.length > 0 && (
        <div className='bg-bege-light'>
          <TimelineBlock
            blockType='timeline'
            lng={lng}
            eyebrow={t('detail.highlights_eyebrow')}
            title={t('detail.highlights_title', { year: report.year })}
            sectionId='destaques'
            orientation='vertical'
            items={report.highlights.map((h) => ({
              id: h.id,
              year: h.date,
              title: h.title,
              description: h.description,
              image: h.image,
            }))}
          />
        </div>
      )}

      {report.finances && (report.finances.income || report.finances.expenses) ? (
        <HawkStarsSection spacing='default' id='contas'>
          <SectionHeader
            reveal
            eyebrow={t('detail.finances_eyebrow')}
            title={t('detail.finances_title')}
            subtitle={t('detail.finances_description')}
            className='mb-10'
          />
          <FinanceSummary
            {...report.finances}
            lng={lng}
            labels={{
              income: t('detail.income'),
              expenses: t('detail.expenses'),
              balance: t('detail.balance'),
            }}
          />
        </HawkStarsSection>
      ) : null}

      <HawkStarsSection spacing='default' className='bg-bege-light' id='documentos'>
        <SectionHeader
          reveal
          eyebrow={t('detail.documents_eyebrow')}
          title={t('detail.documents_title', { year: report.year })}
          className='mb-8'
        />
        <DocumentList
          className='max-w-3xl'
          downloadLabel={t('documents.download')}
          unavailableLabel={t('documents.unavailable')}
          items={DOCUMENT_KEYS.map((key) => ({
            key,
            label: t(`documents.${key}`),
            document: report.documents?.[key],
          }))}
        />

        {otherYears.length > 0 && (
          <nav aria-label={t('detail.other_years')} className='mt-12'>
            <p className='text-eyebrow text-green mb-3'>{t('detail.other_years')}</p>
            <ul className='flex flex-wrap gap-2'>
              {otherYears.map((y) => (
                <li key={y}>
                  <Link
                    href={transformUrl(lng, `${SITE_GET_URLS.impact}/${y}`)}
                    className='border-green text-green hover:bg-green rounded-full border px-4 py-1.5 font-semibold transition-colors hover:text-white'
                  >
                    {y}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </HawkStarsSection>
    </>
  );
};

type T = Awaited<ReturnType<typeof getServerTranslation>>['t'];

const Cover = ({ report }: { report: ImpactReport }) => {
  const cover = getImagePayloadUrl(report.coverImage);
  if (!cover?.url) return null;
  return (
    <div className='relative mt-12 aspect-21/9 overflow-hidden rounded-xl shadow-md'>
      <ImageMedia
        src={cover.url}
        alt={cover.alt ?? ''}
        fill
        priority
        sizes='(min-width: 1280px) 1200px, 100vw'
        className='object-cover'
      />
    </div>
  );
};

const Numbers = ({ report, lng, t }: { report: ImpactReport; lng: Language; t: T }) => {
  const stats = report.stats ?? [];
  if (stats.length === 0) return null;

  return (
    <div className='bg-white'>
      <HawkStarsSection spacing='tight' padding='none' cap='none' container className='pt-16'>
        <SectionHeader
          reveal
          eyebrow={t('detail.numbers_eyebrow')}
          title={t('detail.numbers_title', { year: report.year })}
        />
      </HawkStarsSection>
      <StatsBlock
        blockType='statsBlock'
        lng={lng}
        columns={STATS_COLUMNS[stats.length] ?? '4'}
        background='white'
        hoverBorderColor='green'
        stats={stats.map((s) => ({
          id: s.id,
          icon: s.icon,
          iconAlign: 'left',
          title: s.value,
          titleAlign: 'left',
          description: s.label,
          descriptionAlign: 'left',
        }))}
      />
    </div>
  );
};
