"use client";

import TeamCard from "@/components/team/TeamCard";
import Select, { Option } from "@/components/utils/Select";
import classNames from "classnames";
import { useState } from "react";
import {
  boardSections,
  OrgSection,
  sectionLabels,
  TeamMembers,
} from "./config";

const TeamPage = () => {
  const [selectedSection, setSelectedSection] = useState<OrgSection>("geral");

  const selectOptions: Option[] = boardSections.map(
    (option, index) =>
      ({
        id: index,
        value: option,
        label: sectionLabels[option],
      } as unknown as Option)
  );

  return (
    <>
      <div className="block w-1/3 lg:hidden">
        <Select
          options={selectOptions}
          defaultOption={selectOptions.find(
            (option) => option.value === selectedSection
          )}
          onChange={(e) => setSelectedSection(e as OrgSection)}
        />
      </div>
      <div className="hidden flex-row gap-8 border-b lg:flex">
        {boardSections.map((section, index) => {
          return (
            <div
              onClick={() => setSelectedSection(section)}
              key={index}
              className={classNames({
                "text-disabled": selectedSection != section,
                "border-b-2 border-black": selectedSection == section,
              })}
            >
              {sectionLabels[section]}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 py-10">
        <div className="mt-3 flex flex-wrap gap-5">
          {TeamMembers[selectedSection].map((member, index) => (
            <div
              key={index}
              className="flex w-full flex-col justify-center gap-3 lg:w-fit"
            >
              <TeamCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamPage;
