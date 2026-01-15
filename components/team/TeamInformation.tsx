'use client';

import { boardSections, OrgSection, sectionLabels } from '@/app/[lng]/team/config';
import { useTranslation } from '@/i18n/client';
import { GroupedBoardMembers } from '@/lib/payload/queries/team';
import { useMemo, useState } from 'react';
import { LanguageProps } from '../types';
import TeamCard from './TeamCard';
import { cn } from '@/lib/utils';

type TeamInformationProps = LanguageProps & {
  boardMembers: GroupedBoardMembers;
};

const TeamInformation = ({ boardMembers, lng }: TeamInformationProps) => {
  const [currentSection, setCurrentSection] = useState<OrgSection>('board');
  const { t } = useTranslation(lng, 'team');

  const currentBoardMembers = useMemo(
    () => boardMembers[currentSection].sort((a, b) => (a.position > b.position ? 1 : -1)),
    [boardMembers, currentSection]
  );

  const handleSectionChange = (event: React.MouseEvent<HTMLDivElement>, newSection: OrgSection) => {
    event.preventDefault();
    setCurrentSection(newSection);
  };

  return (
    <>
      <div className='flex justify-center gap-5 text-sm'>
        {boardSections.map((section) => (
          <div
            key={section}
            className={cn('cursor-pointer transition-[border] duration-200', {
              'border-primary border-b-2 font-medium': currentSection === section,
              'hover:text-foreground text-muted-foreground hover:border-b-2 hover:border-b-neutral-700':
                currentSection !== section,
            })}
            onClick={(event) => handleSectionChange(event, section)}
          >
            {t(sectionLabels[section])}
          </div>
        ))}
      </div>

      <div className='mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4'>
        {currentBoardMembers.map((member) => (
          <TeamCard key={member.id} member={member} lng={lng} />
        ))}
      </div>
    </>
  );
};

export default TeamInformation;
