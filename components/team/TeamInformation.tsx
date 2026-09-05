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

    setCurrentSection(boardSections[nextIndex]);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  };

  return (
    <>
      <div
        role='tablist'
        aria-label={tCommon('a11y.teamSections')}
        className='flex justify-center gap-5 text-sm'
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
                'focus-visible:ring-ring cursor-pointer transition-[border] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                {
                  'border-green border-b-2 font-medium': isSelected,
                  'hover:text-foreground text-muted-foreground hover:border-b-2 hover:border-b-neutral-700':
                    !isSelected,
                }
              )}
            >
              {t(sectionLabels[section])}
            </button>
          );
        })}
      </div>

      <div
        id={PANEL_ID}
        role='tabpanel'
        aria-labelledby={tabId(currentSection)}
        className='mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-5'
      >
        {currentBoardMembers.map((member) => (
          <TeamCard key={member.id} member={member} lng={lng} />
        ))}
      </div>
    </>
  );
};

export default TeamInformation;
