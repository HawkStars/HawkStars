'use client';

import { FC } from 'react';
import { ContentSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Language } from '@/i18n/settings';
import { HawkProject } from '@/payload-types';

type SingleProjectPhasesProps = Pick<HawkProject, 'details'> & { lng?: Language };

// Editors type phase titles as "MADRID:" — the card supplies its own separation.
const cleanTitle = (title: string) => title.replace(/:\s*$/, '');

/** "About the project": the description, then each phase as a numbered card. */
const SingleProjectPhases: FC<SingleProjectPhasesProps> = ({ details, lng: lngProp }) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');
  const { text, phases } = details || {};
  const hasPhases = Boolean(phases && phases.length > 0);
  if (!text && !hasPhases) return null;

  return (
    <ContentSection>
      <SectionHeader title={t('sections.about')} className='mb-8' />
      {text && (
        <p className='text-body_regular max-w-3xl leading-relaxed whitespace-pre-line text-black/80 lg:text-lg'>
          {text}
        </p>
      )}
      {hasPhases && (
        <ol className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {phases?.map((phase, i) => (
            <li
              key={phase.id ?? i}
              className='card card-hover border-bege-dark flex flex-col gap-3 border bg-white p-6 transition-[translate,box-shadow] duration-300 hover:-translate-y-1'
            >
              <span
                aria-hidden='true'
                className='bg-bege-dark text-green font-display flex size-10 items-center justify-center rounded-full text-lg font-semibold tabular-nums'
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {phase.title && <h3 className='text-h3_semibold'>{cleanTitle(phase.title)}</h3>}
              {phase.description && (
                <p className='text-sm leading-relaxed whitespace-pre-line text-black/70'>
                  {phase.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </ContentSection>
  );
};

export default SingleProjectPhases;
