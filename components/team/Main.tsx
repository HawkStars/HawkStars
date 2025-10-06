'use client';

import { OrgSection, boardSections, sectionLabels, TeamMembers } from '../../app/[lng]/team/config';
import classNames from 'classnames';

import { useState } from 'react';
import TeamCard from './TeamCard';
import { useTranslation } from '../../i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export type SelectOption = {
  label: string;
  value: string;
  id: string;
  disabled: boolean;
};

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
        <Select name='type_board'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.id} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='hidden flex-row gap-8 border-b lg:flex'>
        {boardSections.map((section, index) => {
          return (
            <div
              onClick={() => setSelectedSection(section)}
              key={index}
              className={classNames('text-h2_light cursor-pointer', {
                'text-disabled': selectedSection != section,
                'border-b-2 border-black': selectedSection == section,
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
