'use client';

import { OrgSection, boardSections, sectionLabels, TeamMembers } from '../../app/[lng]/team/config';
import classNames from 'classnames';

import { useState } from 'react';
import Select, { SelectOption } from '../utils/Select';
import TeamCard from './TeamCard';
import { useTranslation } from '../../i18n/client';
// import { useLanguageCookie } from '@/hooks/useLanguageCookie';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const MainTeamPage = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'team');
  const [selectedSection, setSelectedSection] = useState<OrgSection>('geral');

  const selectOptions: SelectOption[] = boardSections.map(
    (option, index) =>
      ({
        id: index,
        value: option,
        label: t(sectionLabels[option]),
      }) as unknown as SelectOption
  );

  return (
    <>
      <div className='text-large_regular block w-fit lg:hidden'>
        <Select
          options={selectOptions}
          defaultOption={selectOptions.find((option) => option.value === selectedSection)}
          onChange={(e) => setSelectedSection(e as OrgSection)}
          name='type_board'
        />
      </div>
      <div className='hidden flex-row gap-8 border-b lg:flex'>
        {boardSections.map((section, index) => {
          return (
            <div
              onClick={() => setSelectedSection(section)}
              key={index}
              className={classNames('text-h2_light cursor-pointer', {
                'text-disabled': selectedSection != section,
                'border-black border-b-2': selectedSection == section,
              })}
            >
              {t(sectionLabels[section])}
            </div>
          );
        })}
      </div>
      <div className='flex flex-col gap-3 py-10'>
        <div className='mt-3 flex flex-wrap gap-5'>
          {TeamMembers[selectedSection].map((member, index) => (
            <div key={index} className='flex w-full flex-col justify-center gap-3 lg:w-fit'>
              <TeamCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainTeamPage;
