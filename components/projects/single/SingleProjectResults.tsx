import { FC } from 'react';
import { ContentSection } from '@/components/layout';
import { getImagePayloadUrl } from '@/lib/image';
import { HawkProject } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';
import SectionHeader from '@/components/ui/SectionHeader';

type SingleProjectResultsProps = Pick<HawkProject, 'results'> & { lng: Language };

const SingleProjectResults: FC<SingleProjectResultsProps> = async ({ results, lng }) => {
  if (!results?.text) return null;

  const { t } = await getServerTranslation(lng, 'projects');
  const img = getImagePayloadUrl(results.resultsImage);

  return (
    <ContentSection>
      <SectionHeader title={t('sections.results')} className='mb-8' />
      <div className={cn('grid items-start gap-10', img?.url && 'lg:grid-cols-12')}>
        <p
          className={cn(
            'text-body_regular max-w-3xl leading-relaxed whitespace-pre-line text-black/80 lg:text-lg',
            img?.url && 'lg:col-span-7'
          )}
        >
          {results.text}
        </p>
        {img?.url && (
          <div className='card-md bg-bege-dark relative aspect-4/3 overflow-hidden lg:col-span-5'>
            <ImageMedia
              resource={results.resultsImage}
              alt={img.alt || t('a11y.resultsAlt')}
              fill
              sizes='(min-width: 1024px) 460px, 100vw'
              className='object-cover'
            />
          </div>
        )}
      </div>
    </ContentSection>
  );
};

export default SingleProjectResults;
