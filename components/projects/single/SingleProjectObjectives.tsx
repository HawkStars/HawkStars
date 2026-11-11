'use client';

import { FC } from 'react';
import { LuCheck } from 'react-icons/lu';
import { HawkProject } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { getImagePayloadUrl } from '@/lib/image';
import { ContentSection } from '@/components/layout';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import SectionHeader from '@/components/ui/SectionHeader';

type SingleProjectObjectivesProps = Pick<HawkProject, 'objectives'> & { lng?: Language };

/** Objectives as a checklist of cards, with the optional illustration beside the intro. */
const SingleProjectObjectives: FC<SingleProjectObjectivesProps> = ({
  objectives,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { introduction, items, objectivesImage } = objectives || {};
  const hasItems = Boolean(items && items.length > 0);
  if (!introduction && !hasItems) return null;

  const img = getImagePayloadUrl(objectivesImage);

  return (
    <ContentSection className='bg-bege-light'>
      <div className='grid gap-8 lg:grid-cols-12 lg:items-center'>
        <div className={img?.url ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <SectionHeader title={t('sections.objectives')} />
          {introduction && (
            <p className='text-body_regular mt-6 max-w-3xl leading-relaxed whitespace-pre-line text-black/80 lg:text-lg'>
              {introduction}
            </p>
          )}
        </div>
        {img?.url && (
          <div className='relative h-40 w-full lg:col-span-4 lg:h-48'>
            <ImageMedia
              fill
              resource={objectivesImage}
              alt={img.alt || t('a11y.objectivesAlt')}
              sizes='(min-width: 1024px) 360px, 100vw'
              className='object-contain'
            />
          </div>
        )}
      </div>

      {hasItems && (
        <ul className='mt-10 grid gap-4 md:grid-cols-2'>
          {items?.map((item, i) => (
            <li key={item.id ?? i} className='card flex items-start gap-4 bg-white p-5 lg:p-6'>
              <span className='bg-green flex size-8 shrink-0 items-center justify-center rounded-full text-white'>
                <LuCheck aria-hidden='true' className='size-4' />
              </span>
              <p className='text-body_regular leading-relaxed text-black/80'>{item.text}</p>
            </li>
          ))}
        </ul>
      )}
    </ContentSection>
  );
};

export default SingleProjectObjectives;
