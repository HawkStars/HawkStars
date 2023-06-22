"use client";

import TeamCard from "@/components/team/TeamCard";
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
  return (
    <>
      <div className="flex flex-row gap-8 border-b">
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
            <div key={index} className="flex flex-col justify-center gap-3">
              <TeamCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamPage;
