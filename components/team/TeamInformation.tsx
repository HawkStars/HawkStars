'use client';

import { boardSections, OrgSection, sectionLabels } from '@/app/[lng]/(org)/team/config';
import { useTranslation } from '@/i18n/client';
import type { GroupedBoardMembers } from '@/lib/payload/queries/team';
import { useMemo, useState } from 'react';
import { LanguageProps } from '../types';
import TeamCard from './TeamCard';
import { cn } from '@/lib/utils';

type TeamInformationProps = LanguageProps & {
  boardMembers: GroupedBoardMembers;
};

const PANEL_ID = 'team-members-panel';
const tabId = (section: OrgSection) => `team-tab-${section}`;

const TeamInformation = ({ boardMembers, lng }: TeamInformationProps) => {
  const [currentSection, setCurrentSection] = useState<OrgSection>('board');
  const { t } = useTranslation(lng, 'team');
  const { t: tCommon } = useTranslation(lng, 'common');

  const currentBoardMembers = useMemo(
    () => [...boardMembers[currentSection]].sort((a, b) => a.position - b.position),
    [boardMembers, currentSection]
  );

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    const currentIndex = boardSections.indexOf(currentSection);
    const lastIndex = boardSections.length - 1;
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    else if (event.key === 'ArrowLeft')
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else nextIndex = lastIndex;

    setCurrentSection(boardSections[nextIndex] ?? 'geral');
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  };

  return (
    <>
      {/* Segmented control: scrolls sideways on narrow screens rather than wrapping */}
      <div className='flex justify-center overflow-x-auto'>
        <div
          role='tablist'
          aria-label={tCommon('a11y.teamSections')}
          className='bg-bege-light border-bege-dark inline-flex shrink-0 gap-1 rounded-full border p-1'
        >
          {boardSections.map((section) => {
            const isSelected = currentSection === section;

            return (
              <button
                key={section}
                id={tabId(section)}
                type='button'
                role='tab'
                aria-selected={isSelected}
                aria-controls={PANEL_ID}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setCurrentSection(section)}
                onKeyDown={handleTabKeyDown}
                className={cn(
                  'focus-visible:ring-green cursor-pointer rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                  isSelected ? 'bg-green text-white shadow-sm' : 'hover:text-green text-black/70'
                )}
              >
                {t(sectionLabels[section])}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id={PANEL_ID}
        role='tabpanel'
        aria-labelledby={tabId(currentSection)}
        className='mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
      >
        {currentBoardMembers.map((member) => (
          <TeamCard key={member.id} member={member} lng={lng} />
        ))}
      </div>
    </>
  );
};

export default TeamInformation;
