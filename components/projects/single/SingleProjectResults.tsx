import { ContentSection } from '@/components/layout';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkProject } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { FC } from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import SectionHeader from '@/components/ui/SectionHeader';

type SingleProjectReportsProps = Pick<HawkProject, 'results'> & { lng: Language };

const SingleProjectReports: FC<SingleProjectReportsProps> = async ({ results, lng }) => {
  const { t } = await getServerTranslation(lng, 'projects');
  const img = getImagePayloadUrl(results?.resultsImage);

  const hasResults = results && results.text;

  return (
    <>
      {hasResults && (
        <ContentSection>
          <SectionHeader
            title={t('sections.results')}
            className='mb-8'
            titleClassName='text-4xl font-bold'
          />
          <div className='grid items-start gap-10 md:grid-cols-3'>
            {results.text && (
              <p className='col-span-2 text-base leading-relaxed text-gray-800'>{results.text}</p>
            )}
            {img && (
              <ImageMedia
                resource={results?.resultsImage}
                alt={img.alt || t('a11y.resultsAlt')}
                width={600}
                height={400}
                className='rounded-lg object-cover'
              />
            )}
          </div>
        </ContentSection>
      )}
    </>
  );
};

export default SingleProjectReports;
